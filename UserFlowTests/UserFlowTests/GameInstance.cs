using System.Diagnostics;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UserFlowTests;

public class GameInstance : IDisposable, IAsyncDisposable
{
    public GameInstance(string seed)
    {
        Driver = CreateTestDriver();
        State = new GameState(Driver);
    }

    public GameState State { get; init; }
    public string RuntimeErrors =>
        Driver.ExecuteScript("return (window.__testErrors || []).join(' || ');")?.ToString() ?? "";

    private const string BaseUrl = ServerUrl.Origin + "/index.html?seed=";
    private bool _gameInitialized;

    private readonly string _seed;

    public WebDriver Driver { get; init; }

    private static WebDriver
        CreateTestDriver()
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

    public GameInstance AssureGameInitialised()
    {
        if (_gameInitialized)
            return this;
        _gameInitialized = true;
        Driver.Navigate().GoToUrl($"{BaseUrl}{seed}");

        Driver.ExecuteScript("""
                                         window.__testErrors = [];
                                         window.addEventListener('error', function (e) {
                                             window.__testErrors.push(String(e.message || e.error || 'unknown error'));
                                         });
                                         window.addEventListener('unhandledrejection', function (e) {
                                             window.__testErrors.push(String(e.reason || 'unhandled rejection'));
                                         });
                             """);

        Driver.ClickWhenInteractable(By.Id("start"));
        GetToHomeScreen();
        return this;
    }

    private void GetToHomeScreen(int timeoutSeconds = 10)
    {
        var stopWatch = Stopwatch.StartNew();
        while (stopWatch.Elapsed.TotalSeconds < timeoutSeconds)
        {
            // check if start the game button is interactable which means the home screen is loaded
            if(Driver.TryFindElement(By.LinkText("Start the game."), out var startGame)
              && startGame!.Displayed
              && startGame.Enabled)
            {
                return;
            }

            // find the pop-up close button and close it if it is.
            if (Driver.TryFindElement(By.Id("close-pop-up"), out var closeButton)
                && closeButton!.Displayed
                && closeButton.Enabled)
            {
                closeButton.Click();
            }
        }
        throw new Exception("Timed out waiting for home screen");
    }

    /// <inheritdoc />
    public void Dispose()
    {
        Driver.Close();
        Driver.Dispose();
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        Driver.Close();
        await Driver.DisposeAsync();
    }
}