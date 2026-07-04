using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.Diagnostics;

namespace UserFlowTests
{
    public static class DriverExtensions
    {
        public static IWebDriver CreateTestDriver()
        {
            var options = new ChromeOptions();

            // Default to headless to keep UI tests from stealing focus during background runs.
            var runHeadless = !string.Equals(
                Environment.GetEnvironmentVariable("FAMMEL_UI_TEST_HEADFUL"),
                "1",
                StringComparison.OrdinalIgnoreCase);

            if (runHeadless)
            {
                options.AddArgument("--headless=new");
            }

            options.AddArgument("--window-size=1600,1000");
            options.AddArgument("--disable-gpu");

            return new ChromeDriver(options);
        }

        public static void ClickWhenInteractable(this IWebDriver driver, By by, int timeoutSeconds = 10)
        {
            var timeoutAt = Stopwatch.StartNew();
            Exception? lastError = null;

            while (timeoutAt.Elapsed < TimeSpan.FromSeconds(timeoutSeconds))
            {
                try
                {
                    var element = driver.WaitForInteractable(by, timeoutSeconds);
                    element.Click();
                    return;
                }
                catch (StaleElementReferenceException ex)
                {
                    lastError = ex;
                }
                catch (ElementClickInterceptedException ex)
                {
                    lastError = ex;
                    var element = driver.FindElement(by);
                    ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", element);
                    return;
                }
                catch (ElementNotInteractableException ex)
                {
                    lastError = ex;
                    var element = driver.FindElement(by);
                    ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", element);
                    return;
                }
                catch (UnknownErrorException ex) when (ex.Message.Contains("Node with given id does not belong to the document"))
                {
                    lastError = ex;
                }
            }

            throw new WebDriverTimeoutException($"Timed out waiting to click interactable element: {by}", lastError);
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
                catch (UnknownErrorException ex) when (ex.Message.Contains("Node with given id does not belong to the document"))
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

        // Best-effort popup dismissal used at game startup in integration tests.
        // The popup close button can be briefly non-interactable during page init.
        public static void DismissDisclaimerPopupIfPresent(this IWebDriver driver, int timeoutSeconds = 10)
        {
            var timeoutAt = Stopwatch.StartNew();

            while (timeoutAt.Elapsed < TimeSpan.FromSeconds(timeoutSeconds))
            {
                if (driver.TryFindElement(By.Id("close-pop-up"), out var closeButton)
                    && closeButton!.Displayed
                    && closeButton.Enabled)
                {
                    try
                    {
                        closeButton.Click();
                    }
                    catch (ElementClickInterceptedException)
                    {
                        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", closeButton);
                    }
                    catch (ElementNotInteractableException)
                    {
                        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", closeButton);
                    }
                    return;
                }

                // If start-game choice is already interactable, treat popup handling as complete.
                if (driver.TryFindElement(By.LinkText("Start the game."), out var startGame)
                    && startGame!.Displayed
                    && startGame.Enabled)
                {
                    return;
                }

                Thread.Sleep(100);
            }
        }
    }
}