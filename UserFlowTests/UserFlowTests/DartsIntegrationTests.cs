using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

[TestFixture]
public class DartsIntegrationTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260416";
    private IWebDriver _driver = null!;

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

    [Test]
    public void PlayDarts_FromBar_RendersAndAdvancesWithoutRuntimeErrors()
    {
        StartGame();
        WaitForGameDataReady();

        PrimeStateForDarts();
        InvokeScene("darkBar");

        WaitForStoryText().Should().NotBeNullOrWhiteSpace("dark bar scene should render before starting darts");

        var started = TryClickFirstAvailable(By.Id("playDarts"), By.CssSelector("#playDarts"));
        started.Should().BeTrue("bar scene should expose a darts choice");

        var intro = WaitForStoryText();
        intro.Should().NotBeNullOrWhiteSpace("darts intro text should render");

        var advanced = TryClickFirstAvailable(By.LinkText("Continue..."), By.Id("dartRound"));
        advanced.Should().BeTrue("darts intro should allow progressing into rounds");

        var roundText = WaitForStoryText();
        roundText.Should().NotBeNullOrWhiteSpace("first darts round should render text");

        AssertNoRuntimeErrors("darts-first-round");
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
    }

    private void WaitForGameDataReady(int timeoutMs = 12000)
    {
        var start = DateTime.UtcNow;
        while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs)
        {
            var ready = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
                try {
                    return typeof calledjsons !== 'undefined'
                        && !!calledjsons['yourhome']
                        && !!calledjsons['yourhome']['store']
                        && typeof darts !== 'undefined'
                        && !!darts
                        && !!darts['play']
                        && typeof playDarts === 'function'
                        && typeof go === 'function';
                } catch {
                    return false;
                }
            ");

            if (ready is bool ok && ok)
            {
                return;
            }

            Thread.Sleep(100);
        }

        false.Should().BeTrue("expected core game data and darts setup to be ready");
    }

    private void PrimeStateForDarts()
    {
        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
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
                locStack[0] = 'driveout';
            }
        ");
    }

    private void InvokeScene(string sceneFunctionName)
    {
        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const fn = window[arguments[0]];
                if (typeof fn !== 'function') {
                    throw new Error('Missing scene function: ' + arguments[0]);
                }
                fn();
                return 'ok';
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                const details = String((e && e.stack) || e);
                window.__testErrors.push(details);
                return 'fail:' + details;
            }
        ", sceneFunctionName)?.ToString();

        result.Should().Be("ok", $"scene function {sceneFunctionName} should execute without throwing (actual: {result})");
    }

    private bool TryClickFirstAvailable(params By[] selectors)
    {
        var start = DateTime.UtcNow;
        while ((DateTime.UtcNow - start).TotalMilliseconds < 3000)
        {
            foreach (var selector in selectors)
            {
                if (_driver.TryFindElement(selector, out _))
                {
                    _driver.ClickWhenInteractable(selector);
                    return true;
                }
            }

            Thread.Sleep(100);
        }

        return false;
    }

    private string WaitForStoryText(int timeoutMs = 5000)
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

    private void AssertNoRuntimeErrors(string context)
    {
        var script = "return (window.__testErrors || []).join(' || ');";
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(script)?.ToString() ?? string.Empty;
        errors.Should().BeEmpty($"runtime errors found in {context}: {errors}");
    }
}
