using OpenQA.Selenium;

namespace UserFlowTests;

public class GameState(WebDriver driver)
{
    public int Attraction { get => Get<int>("attraction"); set => Set("attraction", value); }
    public int Shyness { get => Get<int>("shyness"); set => Set("shyness", value); }
    public int Bladder { get => Get<int>("bladder"); set => Set("bladder", value); }
    public int YourBladder { get => Get<int>("yourbladder"); set => Set("yourbladder", value); }

    private void Set(string name, object value) =>
        driver.ExecuteScript(
            $"if (typeof {name} === 'undefined') throw new Error('No game variable: {name}'); {name} = arguments[0];",
            value);

    // ExecuteScript returns JS numbers as long; ChangeType converts to the property's type.
    private T Get<T>(string name) =>
        (T)Convert.ChangeType(driver.ExecuteScript($"return {name};"), typeof(T))!;
}