using Microsoft.VisualBasic.CompilerServices;
using OpenQA.Selenium;

namespace UserFlowTests
{
    public class MelissaBy : By
    {
        public static By Flirt(FlirtLevel level)
        {
            return XPath("//a[contains(@href, 'flirt_" + level.ToString().ToLower().First() + "')]");
        }

        public static By Attraction()
        {
            return Id("att");
        }

        public static By Shyness()
        {
            return Id("shy");
        }
    }

    public enum FlirtLevel
    {
        Low,
        Medium,
        High
    }
}