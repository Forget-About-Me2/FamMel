using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using AwesomeAssertions;

namespace UserFlowTests;

/// <summary>
/// Tests the full go() navigation pipeline: start game → navigate to each location
/// via go("locationName"). Unlike SceneIntegrationSmokeTests (which calls scene
/// functions directly), this exercises the routing, time processing, state updates,
/// and UI rendering that occurs during normal gameplay navigation.
/// </summary>
[TestFixture]
public class NavigationSmokeTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260330";
    private IWebDriver _driver = null!;

    /// <summary>
    /// Locations navigable via go() after game start.
    /// Each entry is [go() target, display name for diagnostics].
    /// </summary>
    private static readonly (string Target, string Label)[] NavigableLocations =
    {
        ("yourhome", "Your Home"),
        ("callher", "Call Her"),
        ("gostore", "Go to Store"),
        ("herhome", "Her Home"),
        ("driveAround", "Drive Around"),
        ("theTheatre", "The Theatre"),
        ("theClub", "The Club"),
        ("thebar", "The Bar"),
        ("theMakeOut", "The Make Out"),
    };

    [SetUp]
    public void SetUp()
    {
        _driver = new ChromeDriver();
    }

    [TearDown]
    public void TearDown()
    {
        _driver.Quit();
    }

    [Test]
    public void FullNavigation_StartGame_ThenVisitAllLocations_WithoutErrors()
    {
        StartGameAndWait();

        foreach (var (target, label) in NavigableLocations)
        {
            PrimeStateForNavigation(target);
            NavigateViaGo(target);

            var text = WaitForStoryText();
            text.Should().NotBeNullOrWhiteSpace(
                $"go(\"{target}\") [{label}] should render visible text in #textsp");

            AssertNoRuntimeErrors(target);
        }
    }

    [TestCase("yourhome", "Your Home")]
    [TestCase("callher", "Call Her")]
    [TestCase("gostore", "Go to Store")]
    [TestCase("herhome", "Her Home")]
    [TestCase("driveAround", "Drive Around")]
    [TestCase("theTheatre", "The Theatre")]
    [TestCase("theClub", "The Club")]
    [TestCase("thebar", "The Bar")]
    [TestCase("theMakeOut", "The Make Out")]
    public void GoNavigation_Individual_RendersWithoutErrors(string target, string label)
    {
        StartGameAndWait();
        PrimeStateForNavigation(target);
        NavigateViaGo(target);

        var text = WaitForStoryText();
        text.Should().NotBeNullOrWhiteSpace(
            $"go(\"{target}\") [{label}] should render visible text");

        AssertNoRuntimeErrors(target);
    }

    [Test]
    public void GoBack_ReturnsToYourHome_WithoutErrors()
    {
        StartGameAndWait();

        // Prime locStack so goback resolves to yourhome (not driveout)
        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            locStack.length = 0;
            locStack.unshift('yourhome');
        ");

        // Navigate to the store (player-only location, same as yourhome stack)
        PrimeStateForNavigation("gostore");
        NavigateViaGo("gostore");
        WaitForStoryText().Should().NotBeNullOrWhiteSpace("gostore should render text");
        AssertNoRuntimeErrors("gostore");

        // Navigate back — should resolve to yourhome
        NavigateViaGo("goback");
        WaitForStoryText().Should().NotBeNullOrWhiteSpace("goback should render text");
        AssertNoRuntimeErrors("goback");
    }

    [Test]
    public void GoGamestart_ThenYourHome_NavigationChain_WithoutErrors()
    {
        // Start game via the normal UI flow
        _driver.Navigate().GoToUrl(BaseUrl);
        _driver.Manage().Window.Size = new System.Drawing.Size(1600, 1000);
        InstallErrorTracker();

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));

        // Wait for gamestart to complete and yourHome to render
        WaitForGameDataReady();
        var text = WaitForStoryText();
        text.Should().NotBeNullOrWhiteSpace("gamestart → yourHome should render text");

        // Verify we're at yourHome by checking locStack
        var topLoc = ((IJavaScriptExecutor)_driver).ExecuteScript(
            "return (typeof locStack !== 'undefined' && locStack.length > 0) ? locStack[0] : '';");
        topLoc?.ToString().Should().Be("yourhome",
            "after gamestart, locStack[0] should be 'yourhome'");

        AssertNoRuntimeErrors("gamestart→yourhome");
    }

    private void StartGameAndWait()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        _driver.Manage().Window.Size = new System.Drawing.Size(1600, 1000);
        InstallErrorTracker();

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
        WaitForGameDataReady();
    }

    private void InstallErrorTracker()
    {
        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            window.__testErrors = [];
            window.addEventListener('error', function (e) {
                window.__testErrors.push(String(e.message || e.error || 'unknown error'));
            });
            window.addEventListener('unhandledrejection', function (e) {
                window.__testErrors.push(String(e.reason || 'unhandled rejection'));
            });
        ");
    }

    /// <summary>
    /// Navigates via the game's go() function, exercising the full routing pipeline.
    /// </summary>
    private void NavigateViaGo(string target)
    {
        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                go(arguments[0]);
                return 'ok';
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return 'fail:' + String((e && e.stack) || e);
            }
        ", target);

        result?.ToString().Should().Be("ok",
            $"go(\"{target}\") should execute without throwing (actual: {result})");
    }

    /// <summary>
    /// Primes game state so the target scene can render without precondition failures.
    /// High attraction + low shyness ensures most paths are available.
    /// </summary>
    private void PrimeStateForNavigation(string target)
    {
        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            const target = arguments[0];
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
            hour = 6;
            minute = 0;
            meridian = 'pm';
            thetime = 360;
            if (Array.isArray(locStack) && locStack.length > 0) {
                locStack[0] = (target === 'yourhome' || target === 'callher' || target === 'gostore')
                    ? 'yourhome'
                    : 'driveout';
            }
        ", target);
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
                        && !!calledjsons['yourhome']['store']
                        && typeof objQuotes !== 'undefined'
                        && !!objQuotes
                        && typeof general !== 'undefined'
                        && !!general;
                } catch {
                    return false;
                }
            ");

            if (ready is bool isReady && isReady)
                return;

            Thread.Sleep(100);
        }

        false.Should().BeTrue(
            "expected core JSON data (calledjsons/objQuotes/general) to be ready before navigation tests");
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
                    return text;
            }
            catch (NoSuchElementException) { }

            Thread.Sleep(100);
        }

        return _driver.FindElement(By.Id("textsp")).Text;
    }

    private void AssertNoRuntimeErrors(string context)
    {
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(
            "return (window.__testErrors || []).join(' || ');")?.ToString() ?? string.Empty;
        errors.Should().BeEmpty(
            $"runtime errors found during go(\"{context}\"): {errors}");
    }
}
