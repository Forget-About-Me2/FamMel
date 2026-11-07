using System.Diagnostics;
using OpenQA.Selenium;

namespace UserFlowTests
{
    public static class DriverExtensions
    {
        extension(WebDriver driver)
        {
            public IWebElement FindHighestFlirt()
            {
                if (driver.TryFindElement(MelissaBy.Flirt(FlirtLevel.High), out var highFlirt))
                {
                    var attraction = Int32.Parse(driver.FindElement(MelissaBy.Attraction()).Text);
                    var shyness = Int32.Parse(driver.FindElement(MelissaBy.Shyness()).Text);
                    if (attraction > 35 && shyness < 70)
                    {
                        return highFlirt!;
                    }

                    return driver.FindElement(MelissaBy.Flirt(FlirtLevel.Low));
                }

                return driver.FindElement(MelissaBy.Flirt(FlirtLevel.Medium));
            }

            public bool TryFindElement(By by, out IWebElement? element)
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

            public void ClickWhenInteractable(By by, int timeoutSeconds = 10)
            {
                var stopWatch = Stopwatch.StartNew();
                var timeOutTimeSpan = TimeSpan.FromSeconds(timeoutSeconds);
                Exception? lastError = null;

                while (stopWatch.Elapsed < timeOutTimeSpan)
                {
                    try
                    {
                        var element = driver.FindElement(by);
                        if (element is { Displayed: true, Enabled: true })
                        {
                            element.Click();
                            return;
                        }
                    }
                    catch (Exception ex)
                    {
                        lastError = ex;
                    }
                }

                throw new WebDriverTimeoutException($"Timed out waiting to click interactable element: {by}", lastError);
            }
        }
    }
}