using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

/// <summary>
/// Locks migration-bridge behavior for attraction/shyness write routing.
/// These tests cover legacy compatibility calls and canonical owner updates.
/// </summary>
[TestFixture]
public class AttractionShynessBridgeTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260421";
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
    }

    [Test]
    public void PostInit_LegacySetAttraction_UpdatesCanonicalLastAndLegacyMirror()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;

                // Setup: establish a known prior canonical value.
                // window.attraction = 10 routes through the canonical setter post-init,
                // so it sets _attraction = 10 and LastAttraction = prior value.
                gs.Attraction = 10;
                window.attraction = 10;

                // Act: legacy compatibility setter should delegate post-init.
                window.setAttraction(42);

                return JSON.stringify({
                    canonical: gs.Attraction,
                    last: gs.LastAttraction,
                    legacy: window.attraction,
                    parity: gs.Attraction === window.attraction
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"canonical\":42",
            "post-init legacy setter should write canonical attraction");
        result.Should().Contain("\"last\":10",
            "LastAttraction should capture the prior canonical value before writing 42");
        result.Should().Contain("\"legacy\":42",
            "legacy attraction global should mirror canonical value immediately");
        result.Should().Contain("\"parity\":true",
            "legacy and canonical attraction should remain in sync after bridge write");

        AssertNoRuntimeErrors("post-init-legacy-setattraction");
    }

    [Test]
    public void PreInit_LegacySetShyness_UpdatesLegacyOnly_WithoutTouchingCanonicalOwner()
    {
        NavigateToLandingPageOnly();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;

                // Setup: explicit baseline before initialization.
                const canonicalBefore = gs.Shyness;
                const legacyBefore = window.shyness;

                // Act: pre-init compatibility path should stay legacy-only.
                window.setShyness(12);

                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalBefore,
                    canonicalAfter: gs.Shyness,
                    legacyBefore,
                    legacyAfter: window.shyness,
                    canonicalUnchanged: gs.Shyness === canonicalBefore,
                    legacyUpdated: window.shyness === 12
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"isInitialized\":false",
            "gameState should still be pre-init on the landing page");
        result.Should().Contain("\"canonicalUnchanged\":true",
            "pre-init compatibility setter should not mutate canonical shyness owner");
        result.Should().Contain("\"legacyUpdated\":true",
            "pre-init compatibility setter should still update legacy shyness global");

        AssertNoRuntimeErrors("pre-init-legacy-setshyness");
    }

    [Test]
    public void PreInit_InvalidAttractionWrites_DoNotMutateLegacyOrSeedCanonicalStateOnStart()
    {
        NavigateToLandingPageOnly();

        var preInitResult = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const canonicalBefore = gs.Attraction;
                const legacyBefore = window.attraction;

                // Act: invalid pre-init writes through both compatibility paths should be ignored.
                window.setAttraction(NaN);
                window.attraction = Infinity;

                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalBefore,
                    canonicalAfter: gs.Attraction,
                    legacyBefore,
                    legacyAfter: window.attraction,
                    canonicalUnchanged: gs.Attraction === canonicalBefore,
                    legacyUnchanged: window.attraction === legacyBefore
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        preInitResult.Should().NotBeNullOrWhiteSpace();
        preInitResult.Should().Contain("\"isInitialized\":false",
            "landing page should still be pre-init before the game starts");
        preInitResult.Should().Contain("\"canonicalUnchanged\":true",
            "invalid pre-init attraction writes should not mutate canonical state before initialization");
        preInitResult.Should().Contain("\"legacyUnchanged\":true",
            "invalid pre-init attraction writes should not mutate the legacy attraction mirror");

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
        WaitForGameDataReady();

        var postStartResult = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                return JSON.stringify({
                    canonical: gs.Attraction,
                    last: gs.LastAttraction,
                    legacy: window.attraction,
                    parity: gs.Attraction === window.attraction,
                    finiteCanonical: Number.isFinite(gs.Attraction),
                    finiteLegacy: Number.isFinite(window.attraction)
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        postStartResult.Should().NotBeNullOrWhiteSpace();
        postStartResult.Should().Contain("\"finiteCanonical\":true",
            "invalid pre-init attraction writes should not poison canonical attraction during bridge seeding");
        postStartResult.Should().Contain("\"finiteLegacy\":true",
            "invalid pre-init attraction writes should not poison the legacy attraction mirror after startup");
        postStartResult.Should().Contain("\"parity\":true",
            "legacy and canonical attraction should remain synchronized after startup");

        AssertNoRuntimeErrors("pre-init-invalid-attraction-no-seed");
    }

    [Test]
    public void PostInit_InvalidNumericInput_IsDeterministicNoOp_ForCanonicalLastAndLegacyMirror()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;

                // Setup: lock known baseline.
                window.setAttraction(50);
                const beforeCanonical = gs.Attraction;
                const beforeLast = gs.LastAttraction;
                const beforeLegacy = window.attraction;

                // Act: invalid values should be deterministic no-op.
                window.setAttraction(NaN);
                window.setAttraction(Infinity);
                window.setAttraction(-Infinity);

                return JSON.stringify({
                    beforeCanonical,
                    afterCanonical: gs.Attraction,
                    beforeLast,
                    afterLast: gs.LastAttraction,
                    beforeLegacy,
                    afterLegacy: window.attraction,
                    canonicalUnchanged: gs.Attraction === beforeCanonical,
                    lastUnchanged: gs.LastAttraction === beforeLast,
                    legacyUnchanged: window.attraction === beforeLegacy
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
        result.Should().Contain("\"legacyUnchanged\":true",
            "invalid attraction writes should not mutate legacy attraction mirror");

        AssertNoRuntimeErrors("post-init-invalid-noop");
    }

    [Test]
    public void PostInit_SuccessiveLegacySetAttraction_WritesAdvanceLastAttractionSequence()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const initial = gs.Attraction;

                // Act: successive legacy writes should advance LastAttraction one step behind.
                window.setAttraction(10);
                const afterFirst = { canonical: gs.Attraction, last: gs.LastAttraction, legacy: window.attraction };

                window.setAttraction(20);
                const afterSecond = { canonical: gs.Attraction, last: gs.LastAttraction, legacy: window.attraction };

                window.setAttraction(30);
                const afterThird = { canonical: gs.Attraction, last: gs.LastAttraction, legacy: window.attraction };

                return JSON.stringify({
                    initial,
                    afterFirst,
                    afterSecond,
                    afterThird,
                    sequenceMatches: afterFirst.last === initial
                        && afterSecond.last === 10
                        && afterThird.last === 20,
                    parity: [afterFirst, afterSecond, afterThird].every(step => step.canonical === step.legacy)
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"afterFirst\":{\"canonical\":10",
            "first legacy write should set canonical attraction to 10");
        result.Should().Contain("\"sequenceMatches\":true",
            "successive legacy writes should preserve the required LastAttraction sequence [initial, 10, 20]");
        result.Should().Contain("\"afterSecond\":{\"canonical\":20,\"last\":10,\"legacy\":20}",
            "second legacy write should capture 10 as LastAttraction before writing 20");
        result.Should().Contain("\"afterThird\":{\"canonical\":30,\"last\":20,\"legacy\":30}",
            "third legacy write should capture 20 as LastAttraction before writing 30");
        result.Should().Contain("\"parity\":true",
            "legacy attraction mirror should stay aligned across successive writes");

        AssertNoRuntimeErrors("post-init-lastattraction-sequence");
    }

    [Test]
    public void PostInit_OutOfBoundsValues_ClampToGameplayBounds_AndCapturePriorValue()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;

                // Setup: set a known in-range value.
                window.setAttraction(20);

                // Act 1: high out-of-bounds attraction clamps to current gameplay max.
                window.setAttraction(150);
                const afterHigh = {
                    canonical: gs.Attraction,
                    last: gs.LastAttraction,
                    legacy: window.attraction
                };

                // Act 2: low out-of-bounds attraction clamps to current gameplay min.
                window.setAttraction(-5);
                const afterLow = {
                    canonical: gs.Attraction,
                    last: gs.LastAttraction,
                    legacy: window.attraction
                };

                return JSON.stringify({
                    afterHigh,
                    afterLow,
                    highParity: afterHigh.canonical === afterHigh.legacy,
                    lowParity: afterLow.canonical === afterLow.legacy
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
        result.Should().Contain("\"highParity\":true",
            "legacy attraction mirror should match canonical value after high clamp");
        result.Should().Contain("\"afterLow\":{\"canonical\":0,\"last\":130,\"legacy\":0}",
            "low out-of-bounds attraction should clamp to 0 and capture previous canonical 130");
        result.Should().Contain("\"lowParity\":true",
            "legacy attraction mirror should match canonical value after low clamp");

        AssertNoRuntimeErrors("post-init-clamp-bounds");
    }

    [Test]
    public void PostInit_DirectLegacyShynessAssignment_UsesCanonicalClampAndNoOpContracts()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;

                // Setup: direct global writes should route through canonical shyness setter semantics.
                window.shyness = 70;
                const afterInRange = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness,
                    legacy: window.shyness
                };

                window.shyness = 150;
                const afterHighClamp = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness,
                    legacy: window.shyness
                };

                const beforeInvalid = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness,
                    legacy: window.shyness
                };

                window.shyness = NaN;
                const afterInvalid = {
                    canonical: gs.Shyness,
                    last: gs.LastShyness,
                    legacy: window.shyness
                };

                return JSON.stringify({
                    afterInRange,
                    afterHighClamp,
                    beforeInvalid,
                    afterInvalid,
                    invalidNoOp: beforeInvalid.canonical === afterInvalid.canonical
                        && beforeInvalid.last === afterInvalid.last
                        && beforeInvalid.legacy === afterInvalid.legacy,
                    parity: [afterInRange, afterHighClamp, afterInvalid].every(step => step.canonical === step.legacy)
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"afterInRange\":{\"canonical\":70",
            "direct post-init shyness assignment should write canonical shyness through the bridge");
        result.Should().Contain("\"afterHighClamp\":{\"canonical\":100,\"last\":70,\"legacy\":100}",
            "high out-of-bounds direct shyness assignment should clamp to 100 and capture the prior value");
        result.Should().Contain("\"invalidNoOp\":true",
            "invalid direct shyness assignment should be a deterministic no-op");
        result.Should().Contain("\"parity\":true",
            "direct legacy shyness assignment should keep legacy and canonical values synchronized");

        AssertNoRuntimeErrors("post-init-direct-shyness-bridge");
    }

    [Test]
    public void CanonicalSetAttraction_DoesNotReenterLegacySetterPath()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const originalLegacySetter = window.setAttraction;
                let legacySetterCalls = 0;

                // Instrument legacy setter to detect accidental re-entry.
                window.setAttraction = function(v) {
                    legacySetterCalls += 1;
                    return originalLegacySetter(v);
                };

                gs.setAttraction(77);

                // Restore immediately after probe.
                window.setAttraction = originalLegacySetter;

                return JSON.stringify({
                    canonical: gs.Attraction,
                    legacy: window.attraction,
                    legacySetterCalls,
                    parity: gs.Attraction === window.attraction
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"canonical\":77",
            "canonical setAttraction should complete successfully");
        result.Should().Contain("\"legacy\":77",
            "canonical setAttraction should mirror to legacy attraction");
        result.Should().Contain("\"legacySetterCalls\":0",
            "canonical setAttraction must not re-enter legacy bridge setter path");
        result.Should().Contain("\"parity\":true",
            "canonical and legacy values should stay synchronized");

        AssertNoRuntimeErrors("canonical-no-legacy-reentry");
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
