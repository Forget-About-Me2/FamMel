using Microsoft.VisualBasic.CompilerServices;
using OpenQA.Selenium;

namespace UserFlowTests
{
    public class MelissaBy : By
    {
        public static By Flirt(FlirtLevel level)
        {
            var suffix = level.ToString().ToLower().First();
            return Id("flirt_" + suffix);
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