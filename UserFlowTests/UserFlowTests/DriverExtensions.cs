using OpenQA.Selenium;

namespace UserFlowTests
{
    public static class DriverExtensions
    {
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

                return driver.FindElement(MelissaBy.Flirt(FlirtLevel.Low));
            }

            return driver.FindElement(MelissaBy.Flirt(FlirtLevel.Medium));
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
    }
}