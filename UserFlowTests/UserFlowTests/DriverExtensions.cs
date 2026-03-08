using OpenQA.Selenium;
using System.Diagnostics;

namespace UserFlowTests
{
    public static class DriverExtensions
    {
        public static void ClickWhenInteractable(this IWebDriver driver, By by, int timeoutSeconds = 10)
        {
            var element = driver.WaitForInteractable(by, timeoutSeconds);

            try
            {
                element.Click();
            }
            catch (ElementClickInterceptedException)
            {
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", element);
            }
            catch (ElementNotInteractableException)
            {
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", element);
            }
        }

        public static IWebElement WaitForInteractable(this IWebDriver driver, By by, int timeoutSeconds = 10)
        {
            var timeoutAt = Stopwatch.StartNew();
            Exception? lastError = null;

            while (timeoutAt.Elapsed < TimeSpan.FromSeconds(timeoutSeconds))
            {
                try
                {
                    var element = driver.FindElement(by);
                    if (element.Displayed && element.Enabled)
                    {
                        return element;
                    }
                }
                catch (NoSuchElementException ex)
                {
                    lastError = ex;
                }
                catch (StaleElementReferenceException ex)
                {
                    lastError = ex;
                }

                Thread.Sleep(100);
            }

            throw new WebDriverTimeoutException($"Timed out waiting for interactable element: {by}", lastError);
        }

        public static IWebElement FindHighestFlirt(this IWebDriver driver)
        {
            if (driver.TryFindElement(MelissaBy.Flirt(FlirtLevel.High), out var highFlirt))
            {
                var attraction = Int32.Parse(driver.FindElement(MelissaBy.Attraction()).Text);
                var shyness = Int32.Parse(driver.FindElement(MelissaBy.Shyness()).Text);
                if (attraction > 35 && shyness < 70)
                {
                    return highFlirt!;
                }

                if (driver.TryFindElement(MelissaBy.Flirt(FlirtLevel.Low), out var lowFlirt))
                {
                    return lowFlirt!;
                }
            }

            if (driver.TryFindElement(MelissaBy.Flirt(FlirtLevel.Medium), out var mediumFlirt))
            {
                return mediumFlirt!;
            }

            if (driver.TryFindElement(MelissaBy.Flirt(FlirtLevel.Low), out var fallbackLowFlirt))
            {
                return fallbackLowFlirt!;
            }

            throw new NoSuchElementException("No flirt option is currently available.");
        }

        public static bool TryFindElement(this IWebDriver driver, By by, out IWebElement? element)
        {
            try
            {
                element = driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                element = null;
                return false;
            }
        }

        public static void SetGameSeed(this IWebDriver driver, int seed)
        {
            ((IJavaScriptExecutor)driver).ExecuteScript("setRandomSeed(arguments[0]);", seed);
        }
    }
}