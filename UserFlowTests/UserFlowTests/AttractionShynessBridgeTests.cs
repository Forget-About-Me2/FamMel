using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

/// <summary>
/// Verifies runtimeContext.setAttraction()/setShyness() behavior: clamping,
/// LastAttraction/LastShyness tracking, and no-op for non-finite inputs.
/// </summary>
[TestFixture]
public class AttractionShynessBridgeTests
{
    private const string BaseUrl = ServerUrl.Origin + "/index.html?seed=20260421";
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
    public void PreInit_SetShyness_WritesDirectlyToCanonical()
    {
        NavigateToLandingPageOnly();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;
                const canonicalBefore = gs.Shyness;

                gs.setShyness(12);

                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalBefore,
                    canonicalAfter: gs.Shyness,
                    canonicalUpdated: gs.Shyness === 12
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"isInitialized\":false",
            "runtimeContext should still be pre-init on the landing page");
        result.Should().Contain("\"canonicalUpdated\":true",
            "pre-init setShyness should write directly to canonical shyness owner");

        AssertNoRuntimeErrors("pre-init-setshyness");
    }

    [Test]
    public void PostInit_InvalidNumericInput_IsDeterministicNoOp()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                gs.setAttraction(50);
                const beforeCanonical = gs.Attraction;
                const beforeLast = gs.LastAttraction;

                gs.setAttraction(NaN);
                gs.setAttraction(Infinity);
                gs.setAttraction(-Infinity);

                return JSON.stringify({
                    beforeCanonical,
                    afterCanonical: gs.Attraction,
                    beforeLast,
                    afterLast: gs.LastAttraction,
                    canonicalUnchanged: gs.Attraction === beforeCanonical,
                    lastUnchanged: gs.LastAttraction === beforeLast
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"canonicalUnchanged\":true",
            "invalid attraction writes should not mutate canonical value");
        result.Should().Contain("\"lastUnchanged\":true",
            "invalid attraction writes should not mutate LastAttraction");

        AssertNoRuntimeErrors("post-init-invalid-noop");
    }

    [Test]
    public void PostInit_SuccessiveSetAttraction_WritesAdvanceLastAttractionSequence()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;
                const initial = gs.Attraction;

                gs.setAttraction(10);
                const afterFirst = { canonical: gs.Attraction, last: gs.LastAttraction };

                gs.setAttraction(20);
                const afterSecond = { canonical: gs.Attraction, last: gs.LastAttraction };

                gs.setAttraction(30);
                const afterThird = { canonical: gs.Attraction, last: gs.LastAttraction };

                return JSON.stringify({
                    initial,
                    afterFirst,
                    afterSecond,
                    afterThird,
                    sequenceMatches: afterFirst.last === initial
                        && afterSecond.last === 10
                        && afterThird.last === 20
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"afterFirst\":{\"canonical\":10",
            "first write should set canonical attraction to 10");
        result.Should().Contain("\"sequenceMatches\":true",
            "successive writes should preserve the required LastAttraction sequence [initial, 10, 20]");
        result.Should().Contain("\"afterSecond\":{\"canonical\":20,\"last\":10",
            "second write should capture 10 as LastAttraction before writing 20");
        result.Should().Contain("\"afterThird\":{\"canonical\":30,\"last\":20",
            "third write should capture 20 as LastAttraction before writing 30");

        AssertNoRuntimeErrors("post-init-lastattraction-sequence");
    }

    [Test]
    public void PostInit_OutOfBoundsValues_ClampToGameplayBounds_AndCapturePriorValue()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                gs.setAttraction(20);

                gs.setAttraction(150);
                const afterHigh = {
                    canonical: gs.Attraction,
                    last: gs.LastAttraction
                };

                gs.setAttraction(-5);
                const afterLow = {
                    canonical: gs.Attraction,
                    last: gs.LastAttraction
                };

                return JSON.stringify({
                    afterHigh,
                    afterLow
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"canonical\":130",
            "high out-of-bounds attraction should clamp to verified gameplay max 130");
        result.Should().Contain("\"last\":20",
            "LastAttraction should capture the prior in-range value before high clamp");
        result.Should().Contain("\"afterLow\":{\"canonical\":0,\"last\":130",
            "low out-of-bounds attraction should clamp to 0 and capture previous canonical 130");

        AssertNoRuntimeErrors("post-init-clamp-bounds");
    }

    [Test]
    public void SetShyness_ClampsAndTracksLast()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                gs.setShyness(70);
                const afterInRange = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness
                };

                gs.setShyness(150);
                const afterHighClamp = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness
                };

                return JSON.stringify({
                    afterInRange,
                    afterHighClamp
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"afterInRange\":{\"canonical\":70",
            "setShyness(70) should write canonical shyness to 70");
        result.Should().Contain("\"afterHighClamp\":{\"canonical\":100,\"last\":70",
            "high out-of-bounds shyness should clamp to 100 and capture the prior value");

        AssertNoRuntimeErrors("setshyness-clamp-last");
    }

    private void NavigateToLandingPageOnly()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        _driver.Manage().Window.Size = new System.Drawing.Size(1600, 1000);
        InstallErrorTracker();
    }

    private void StartGameAndWait()
    {
        NavigateToLandingPageOnly();

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

        false.Should().BeTrue(
            "expected core JSON data (calledjsons/objQuotes/general) to be ready before state-bridge assertions");
    }

    private void AssertNoRuntimeErrors(string context)
    {
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(
            "return (window.__testErrors || []).join(' || ');")?.ToString() ?? string.Empty;
        errors.Should().BeEmpty(
            $"runtime errors found during {context}: {errors}");
    }
}
