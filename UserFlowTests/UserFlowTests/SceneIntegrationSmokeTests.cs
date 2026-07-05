using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

[TestFixture]
public class SceneIntegrationSmokeTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260308";
    private IWebDriver _driver = null!;

    private static readonly string[] SceneFunctions =
    {
        "yourhome",
        "callher",
        "gostore",
        "herhome",
        "driveAround",
        "theTheatre",
        "theClub",
        "thebar",
        "theMakeOut"
    };

    [SetUp]
    public void SetUp()
    {
        _driver = DriverExtensions.CreateTestDriver();
    }

    [TearDown]
    public void TearDown()
    {
        _driver.Quit();
        _driver.Dispose();
    }

    [TestCaseSource(nameof(SceneFunctions))]
    [Description("Smoke-checks each scene entry function for successful render and absence of browser runtime errors.")]
    public void SceneEntryPoints_Render_WithoutRuntimeErrors(string sceneFunctionName)
    {
        StartGame();
        PrimeStateForScene(sceneFunctionName);

        var script = @"
            const sceneName = arguments[0];
            try {
                const fn = window[sceneName];
                if (typeof fn !== 'function') {
                    throw new Error('Missing scene function: ' + sceneName);
                }
                fn();
                return 'ok';
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                const details = String((e && e.stack) || e);
                window.__testErrors.push(details);
                return 'fail:' + details;
            }
        ";

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(script, sceneFunctionName)?.ToString();
        result.Should().Be("ok", $"scene function {sceneFunctionName} should execute without throwing (actual: {result})");

        WaitForStoryText().Should().NotBeNullOrWhiteSpace($"scene {sceneFunctionName} should render visible text");
        AssertNoRuntimeErrors(sceneFunctionName);
    }

    private void StartGame()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        _driver.Manage().Window.Size = new System.Drawing.Size(1600, 1000);

        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            window.__testErrors = [];
            window.addEventListener('error', function (e) {
                window.__testErrors.push(String(e.message || e.error || 'unknown error'));
            });
            window.addEventListener('unhandledrejection', function (e) {
                window.__testErrors.push(String(e.reason || 'unhandled rejection'));
            });
        ");

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
        WaitForGameDataReady();
    }

    private void WaitForGameDataReady(int timeoutMs = 10000)
    {
        var start = DateTime.UtcNow;
        while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs)
        {
            var ready = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
                try {
                    return typeof calledjsons !== 'undefined'
                        && !!calledjsons['yourhome']
                        && !!calledjsons['yourhome']['yourhome']
                        && typeof objQuotes !== 'undefined'
                        && !!objQuotes
                        && typeof general !== 'undefined'
                        && !!general;
                } catch {
                    return false;
                }
            ");

            if (ready is bool isReady && isReady)
            {
                return;
            }

            Thread.Sleep(100);
        }

        false.Should().BeTrue("expected core JSON data (calledjsons/objQuotes/general) to be ready before scene smoke checks");
    }

    private void PrimeStateForScene(string sceneFunctionName)
    {
        var script = @"
            const sceneName = arguments[0];
            attraction = 130;
            shyness = 10;
            bladder = 0;
            yourbladder = 0;
            tummy = 0;
            yourtummy = 0;
            askholditcounter = 0;
            waitcounter = 0;
            gottagoflag = 0;
            changevenueflag = 0;
            if (Array.isArray(locStack) && locStack.length > 0) {
                locStack[0] = (sceneName === 'yourhome' || sceneName === 'callher' || sceneName === 'gostore')
                    ? 'yourhome'
                    : 'driveout';
            }
        ";

        ((IJavaScriptExecutor)_driver).ExecuteScript(script, sceneFunctionName);
    }

    private void AssertNoRuntimeErrors(string sceneFunctionName)
    {
        var script = "return (window.__testErrors || []).join(' || ');";
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(script)?.ToString() ?? string.Empty;
        errors.Should().BeEmpty($"runtime errors found while testing {sceneFunctionName}: {errors}");
    }

    private string WaitForStoryText(int timeoutMs = 3000)
    {
        var start = DateTime.UtcNow;
        while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs)
        {
            try
            {
                var text = _driver.FindElement(By.Id("textsp")).Text;
                if (!string.IsNullOrWhiteSpace(text))
                {
                    return text;
                }
            }
            catch (NoSuchElementException)
            {
            }

            Thread.Sleep(100);
        }

        return _driver.FindElement(By.Id("textsp")).Text;
    }
}
