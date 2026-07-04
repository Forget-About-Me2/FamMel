using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

/// <summary>
/// Coverage for canonical ownership of imgs/wetthecar/picset.
/// Guards bridge behavior across pre-init and post-init compatibility paths.
/// </summary>
[TestFixture]
public class DriveImagesOwnershipBridgeTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260422";
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
    public void Init_WithNoSavedImgs_SeedsExactDefaultGirlKeys()
    {
        NavigateToLandingPageOnly();
        ((IJavaScriptExecutor)_driver).ExecuteScript("localStorage.removeItem('imgs');");

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
        WaitForGameDataReady();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const keys = Object.keys(window.gameState.Imgs).sort();
                const expected = ['Jennifer', 'Karen', 'Laura', 'Melissa'];
                const exactKeys = JSON.stringify(keys) === JSON.stringify(expected);
                const allEmptyMaps = expected.every(k => {
                    const map = window.gameState.Imgs[k];
                    return map && typeof map === 'object' && !Array.isArray(map) && Object.keys(map).length === 0;
                });

                return JSON.stringify({ exactKeys, allEmptyMaps, keys });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"exactKeys\":true",
            "canonical gameState.Imgs should initialize with exact default girl keys and no extras");
        result.Should().Contain("\"allEmptyMaps\":true",
            "each default girl key should start with an empty image map");

        AssertNoRuntimeErrors("init-default-img-keys");
    }

    [Test]
    public void PreInit_ImportImgs_UpdatesLegacyOnly_WithoutTouchingCanonicalImgs()
    {
        NavigateToLandingPageOnly();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const canonicalBefore = JSON.stringify(gs.Imgs);

                localStorage.setItem('imgs', JSON.stringify({
                    Jennifer: { pixdrive: 'legacy-preinit-url' }
                }));

                window.importimgs();

                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalUnchanged: JSON.stringify(gs.Imgs) === canonicalBefore,
                    legacyImported: window.imgs?.Jennifer?.pixdrive === 'legacy-preinit-url',
                    missingDefaultFilled: !!window.imgs?.Karen && !!window.imgs?.Laura && !!window.imgs?.Melissa
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"isInitialized\":false",
            "landing page should remain pre-init before game start");
        result.Should().Contain("\"canonicalUnchanged\":true",
            "pre-init importimgs should not mutate canonical gameState.Imgs");
        result.Should().Contain("\"legacyImported\":true",
            "pre-init importimgs should update legacy/module image map");
        result.Should().Contain("\"missingDefaultFilled\":true",
            "pre-init import should keep required default girl keys available");

        AssertNoRuntimeErrors("pre-init-importimgs");
    }

    [Test]
    public void PostInit_ImportAndSaveLoad_PreserveCanonicalImgs_AndRestoreSavedSnapshot()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                localStorage.setItem('imgs', JSON.stringify({
                    Jennifer: { pixdrive: 'j-drive' },
                    Karen: {},
                    Laura: {},
                    Melissa: {},
                    ExtraGirl: { pixintro: 'extra-intro' }
                }));

                window.importimgs();

                const importedCanonical = window.gameState.Imgs?.Jennifer?.pixdrive === 'j-drive';
                const extraPreserved = window.gameState.Imgs?.ExtraGirl?.pixintro === 'extra-intro';
                const defaultsStillPresent = ['Jennifer', 'Karen', 'Laura', 'Melissa']
                    .every(k => !!window.gameState.Imgs[k]);

                // Save snapshot, mutate live reference, then load to verify deep clone restore.
                window.saveGame(0);
                window.imgs.Jennifer.pixdrive = 'mutated-after-save';
                window.loadGame(0);

                const restoredFromSave = window.gameState.Imgs?.Jennifer?.pixdrive === 'j-drive';
                const legacyParity = window.imgs?.Jennifer?.pixdrive === window.gameState.Imgs?.Jennifer?.pixdrive;

                return JSON.stringify({
                    importedCanonical,
                    extraPreserved,
                    defaultsStillPresent,
                    restoredFromSave,
                    legacyParity
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"importedCanonical\":true",
            "post-init importimgs should hydrate canonical gameState.Imgs");
        result.Should().Contain("\"extraPreserved\":true",
            "valid extra girl keys should be preserved during canonical import");
        result.Should().Contain("\"defaultsStillPresent\":true",
            "default girl keys should remain present after import");
        result.Should().Contain("\"restoredFromSave\":true",
            "save/load should restore canonical imgs snapshot after post-save live mutation");
        result.Should().Contain("\"legacyParity\":true",
            "legacy window.imgs should stay aligned with canonical imgs after load");

        AssertNoRuntimeErrors("post-init-import-save-load-imgs");
    }

    [Test]
    public void PostInit_InvalidSetImgsInputs_AreDeterministicNoOp_WithoutThrowing()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                window.imgs = {
                    Jennifer: { pixdrive: 'baseline' },
                    Karen: {},
                    Laura: {},
                    Melissa: {}
                };
                localStorage.setItem('imgs', JSON.stringify(window.imgs));

                const beforeCanonical = JSON.stringify(window.gameState.Imgs);
                const beforeLegacy = JSON.stringify(window.imgs);
                const beforeStored = localStorage.getItem('imgs');

                let threw = false;
                try { window.imgs = null; } catch { threw = true; }
                try { window.imgs = undefined; } catch { threw = true; }
                try { window.imgs = 42; } catch { threw = true; }

                return JSON.stringify({
                    threw,
                    canonicalUnchanged: JSON.stringify(window.gameState.Imgs) === beforeCanonical,
                    legacyUnchanged: JSON.stringify(window.imgs) === beforeLegacy,
                    storedUnchanged: localStorage.getItem('imgs') === beforeStored
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"threw\":false",
            "invalid setImgs inputs should not throw runtime exceptions");
        result.Should().Contain("\"canonicalUnchanged\":true",
            "invalid setImgs inputs should not mutate canonical imgs state");
        result.Should().Contain("\"legacyUnchanged\":true",
            "invalid setImgs inputs should not mutate legacy imgs mirror");
        result.Should().Contain("\"storedUnchanged\":true",
            "invalid setImgs inputs should not mutate persisted imgs snapshot");

        AssertNoRuntimeErrors("invalid-setimgs-noop");
    }

    [Test]
    public void HasWetTheCar_BridgeSync_PreAndPostInit_WithNonFiniteNoOp()
    {
        NavigateToLandingPageOnly();

        var preInit = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const canonicalBefore = gs.HasWetTheCar;
                window.wetthecar = 1;
                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalBefore,
                    canonicalAfter: gs.HasWetTheCar,
                    legacyAfter: window.wetthecar,
                    canonicalUnchanged: gs.HasWetTheCar === canonicalBefore
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        preInit.Should().NotBeNullOrWhiteSpace();
        preInit.Should().Contain("\"isInitialized\":false",
            "pre-init wetthecar probe should run before game initialization");
        preInit.Should().Contain("\"canonicalUnchanged\":true",
            "pre-init wetthecar write should stay legacy-only");

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.DismissDisclaimerPopupIfPresent();
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
        WaitForGameDataReady();

        var postInit = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.gameState;
                const seededFromPreInit = gs.HasWetTheCar === 1;

                window.wetthecar = 2;
                const syncedAfterLegacyWrite = gs.HasWetTheCar === 2 && window.wetthecar === 2;

                const beforeInvalid = { c: gs.HasWetTheCar, l: window.wetthecar };
                window.wetthecar = NaN;
                window.wetthecar = Infinity;
                window.wetthecar = -Infinity;

                const invalidNoOp = gs.HasWetTheCar === beforeInvalid.c && window.wetthecar === beforeInvalid.l;

                return JSON.stringify({ seededFromPreInit, syncedAfterLegacyWrite, invalidNoOp });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        postInit.Should().NotBeNullOrWhiteSpace();
        postInit.Should().Contain("\"seededFromPreInit\":true",
            "connectToGameState should seed canonical HasWetTheCar from pre-init legacy value");
        postInit.Should().Contain("\"syncedAfterLegacyWrite\":true",
            "post-init wetthecar writes should keep legacy and canonical state synchronized");
        postInit.Should().Contain("\"invalidNoOp\":true",
            "non-finite wetthecar writes should be deterministic no-op");

        AssertNoRuntimeErrors("wetthecar-bridge");
    }

    [Test]
    public void Picset_SaveLoad_RoundTrip_PreservesCanonicalAndLegacyParity()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                window.picset = 9;
                window.saveGame(1);

                window.picset = 0;
                window.loadGame(1);

                return JSON.stringify({
                    canonical: window.gameState.PicSet,
                    legacy: window.picset,
                    parity: window.gameState.PicSet === window.picset
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"canonical\":9",
            "picset save/load should restore canonical gameState.PicSet value");
        result.Should().Contain("\"legacy\":9",
            "picset save/load should restore legacy picset mirror value");
        result.Should().Contain("\"parity\":true",
            "picset canonical and legacy values should remain synchronized after load");

        AssertNoRuntimeErrors("picset-round-trip");
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
            "expected core JSON data (calledjsons/objQuotes/general) to be ready before bridge assertions");
    }

    private void AssertNoRuntimeErrors(string context)
    {
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(
            "return (window.__testErrors || []).join(' || ');")?.ToString() ?? string.Empty;
        errors.Should().BeEmpty(
            $"runtime errors found during {context}: {errors}");
    }
}
