using OpenQA.Selenium;
using AwesomeAssertions;

namespace UserFlowTests;

/// <summary>
/// Coverage for canonical ownership of migrated settings and sex-scene state.
/// Guards pre-init staging, post-init canonical sync, save/load round-trip, and malformed recovery.
/// </summary>
[TestFixture]
public class SettingsSexSceneOwnershipBridgeTests
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
    }

    [Test]
    public void PreInit_LegacyWrites_AreStaged_NotAppliedToCanonical()
    {
        NavigateToLandingPageOnly();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                // Setup: capture canonical defaults before initialization.
                const gs = window.gameState;
                const before = {
                    images: gs.IsImagesEnabled,
                    stats: gs.IsStatsVisible,
                    multiple: gs.IsMultipleMovesEnabled,
                    reset: gs.IsMovesAutoReset,
                    drankChamp: gs.DrankChamp,
                    sexActions: gs.SexActions
                };

                // Act: drive settings/sex-scene globals through their compatibility setters before init.
                window.enableimages = 0;
                window.showstats = 0;
                window.multiplemoves = 0;
                window.rstmoves = 1;
                window.drankChamp = 3;
                window.sexActions = {
                    clothes: { skirt: { on: 0 } },
                    actions: { kNeck: { performed: 1 } },
                    fuckingNow: 1
                };

                // Collect: canonical owners should remain untouched while staged legacy state updates.
                return JSON.stringify({
                    isInitialized: gs.isInitialized,
                    canonicalUnchanged:
                        gs.IsImagesEnabled === before.images
                        && gs.IsStatsVisible === before.stats
                        && gs.IsMultipleMovesEnabled === before.multiple
                        && gs.IsMovesAutoReset === before.reset
                        && gs.DrankChamp === before.drankChamp
                        && gs.SexActions === before.sexActions,
                    stagedLegacy:
                        window.enableimages === 0
                        && window.showstats === 0
                        && window.multiplemoves === 0
                        && window.rstmoves === 1
                        && window.drankChamp === 3
                        && window.sexActions.clothes.skirt.on === 0
                        && window.sexActions.actions.kNeck.performed === 1
                        && window.sexActions.actions.tBreast.performed === 0
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"isInitialized\":false",
            "landing page should still be pre-init before start() hydrates canonical state");
        result.Should().Contain("\"canonicalUnchanged\":true",
            "pre-init writes must not touch canonical state yet — hydrateSettingsToGameState() will push staged values into canonical when start() runs");
        result.Should().Contain("\"stagedLegacy\":true",
            "pre-init compatibility writes should remain visible through the legacy/global surface");

        AssertNoRuntimeErrors("pre-init-staging");
    }

    [Test]
    public void PostInit_LegacyWrites_UpdateCanonical_AndIgnoreInvalid()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                // Setup: instrument the canonical setter to catch accidental re-entry.
                const gs = window.gameState;
                let imageSetterCalls = 0;
                const originalSetImages = gs.setIsImagesEnabled.bind(gs);
                gs.setIsImagesEnabled = function (value) {
                    imageSetterCalls += 1;
                    return originalSetImages(value);
                };

                // Act: drive post-init compatibility writes.
                window.enableimages = 0;
                window.showstats = 0;
                window.multiplemoves = 0;
                window.rstmoves = 1;

                const syncedAfterWrites =
                    gs.IsImagesEnabled === false
                    && gs.IsStatsVisible === false
                    && gs.IsMultipleMovesEnabled === false
                    && gs.IsMovesAutoReset === true
                    && window.enableimages === 0
                    && window.showstats === 0
                    && window.multiplemoves === 0
                    && window.rstmoves === 1;

                const beforeInvalid = {
                    images: gs.IsImagesEnabled,
                    stats: gs.IsStatsVisible,
                    multiple: gs.IsMultipleMovesEnabled,
                    reset: gs.IsMovesAutoReset,
                    legacyImages: window.enableimages,
                    legacyStats: window.showstats,
                    legacyMultiple: window.multiplemoves,
                    legacyReset: window.rstmoves
                };

                window.enableimages = NaN;
                window.showstats = Infinity;
                window.multiplemoves = -Infinity;
                window.rstmoves = NaN;

                const invalidNoOp =
                    gs.IsImagesEnabled === beforeInvalid.images
                    && gs.IsStatsVisible === beforeInvalid.stats
                    && gs.IsMultipleMovesEnabled === beforeInvalid.multiple
                    && gs.IsMovesAutoReset === beforeInvalid.reset
                    && window.enableimages === beforeInvalid.legacyImages
                    && window.showstats === beforeInvalid.legacyStats
                    && window.multiplemoves === beforeInvalid.legacyMultiple
                    && window.rstmoves === beforeInvalid.legacyReset;

                return JSON.stringify({ syncedAfterWrites, imageSetterCalls, invalidNoOp });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"syncedAfterWrites\":true",
            "post-init settings writes should update canonical GameState flags and keep legacy readers synchronized");
        result.Should().Contain("\"imageSetterCalls\":1",
            "the enableimages compatibility write should traverse exactly one canonical setter path with no bounce back into itself");
        result.Should().Contain("\"invalidNoOp\":true",
            "non-finite numeric writes should be deterministic no-op after initialization");

        AssertNoRuntimeErrors("post-init-settings-bridge");
    }

    [Test]
    public void PostInit_SexSceneWrites_NormalizeAndRejectUnknownKeys()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                // Setup: instrument the canonical sexActions setter to guard against bridge recursion.
                const gs = window.gameState;
                let sexActionSetterCalls = 0;
                const originalSetSexActions = gs.setSexActions.bind(gs);
                gs.setSexActions = function (value) {
                    sexActionSetterCalls += 1;
                    return originalSetSexActions(value);
                };

                // Act: apply a partial/malformed compatibility payload plus drankChamp.
                window.drankChamp = 4;
                window.sexActions = {
                    clothes: { skirt: { on: 0 } },
                    actions: { kNeck: { performed: 1 }, bogus: { performed: 1 } },
                    fuckingNow: 1
                };

                const canonical = gs.SexActions;

                // Collect: malformed shape should normalize to a playable canonical object.
                return JSON.stringify({
                    drankChampSynced: gs.DrankChamp === 4 && window.drankChamp === 4,
                    sexActionSetterCalls,
                    normalizedShape:
                        canonical
                        && typeof canonical.actions.actionList === 'function'
                        && canonical.clothes.skirt.on === 0
                        && canonical.clothes.bra.on === 1
                        && canonical.actions.kNeck.performed === 1
                        && canonical.actions.tBreast.performed === 0,
                    noBogusLeak: typeof canonical?.actions?.bogus === 'undefined',
                    legacyParity:
                        window.sexActions.actions.kNeck.performed === canonical.actions.kNeck.performed
                        && window.sexActions.clothes.skirt.on === canonical.clothes.skirt.on
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"drankChampSynced\":true",
            "post-init drankChamp writes should update the canonical counter and keep legacy reads aligned");
        result.Should().Contain("\"sexActionSetterCalls\":1",
            "sexActions compatibility writes should traverse exactly one canonical setter path with no bridge re-entry");
        result.Should().Contain("\"normalizedShape\":true",
            "malformed incoming sexActions should normalize to a safe playable shape without dropping required action helpers");
        result.Should().Contain("\"noBogusLeak\":true",
            "normalization should reject arbitrary incoming action keys and only persist known sex-scene actions");
        result.Should().Contain("\"legacyParity\":true",
            "legacy sexActions reads should stay aligned with the canonical runtime object after post-init writes");

        AssertNoRuntimeErrors("post-init-sexscene-bridge");
    }

    [Test]
    public void SaveLoad_PreservesLegacyKeys_AndRecoversFromMalformed()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                // Setup: save a known-good snapshot through the public API.
                const gs = window.gameState;
                window.enableimages = 0;
                window.showstats = 0;
                window.multiplemoves = 0;
                window.rstmoves = 1;
                window.drankChamp = 2;
                window.sexActions = {
                    clothes: { skirt: { on: 0 } },
                    actions: { kNeck: { performed: 1 } },
                    fuckingNow: 1
                };
                window.saveGame(2);

                const saved = JSON.parse(localStorage.getItem('fammel_save_2'));
                const legacyKeysPersisted =
                    Object.prototype.hasOwnProperty.call(saved, 'enableimages')
                    && Object.prototype.hasOwnProperty.call(saved, 'showstats')
                    && Object.prototype.hasOwnProperty.call(saved, 'multiplemoves')
                    && Object.prototype.hasOwnProperty.call(saved, 'rstmoves')
                    && !Object.prototype.hasOwnProperty.call(saved, 'IsImagesEnabled');

                // Act: mutate live state away from the saved snapshot, then restore it.
                window.enableimages = 1;
                window.showstats = 1;
                window.multiplemoves = 1;
                window.rstmoves = 0;
                window.drankChamp = 0;
                window.sexActions = null;
                window.loadGame(2);

                const roundTripRestored =
                    gs.IsImagesEnabled === false
                    && gs.IsStatsVisible === false
                    && gs.IsMultipleMovesEnabled === false
                    && gs.IsMovesAutoReset === true
                    && gs.DrankChamp === 2
                    && gs.SexActions.actions.kNeck.performed === 1
                    && gs.SexActions.clothes.skirt.on === 0
                    && window.sexActions.actions.kNeck.performed === 1;

                // Act again: inject malformed persistence and verify safe recovery.
                const malformed = JSON.parse(JSON.stringify(saved));
                malformed.sexActions = null;
                delete malformed.multiplemoves;
                localStorage.setItem('fammel_save_3', JSON.stringify(malformed));

                window.multiplemoves = 1;
                window.sexActions = {
                    clothes: { skirt: { on: 0 } },
                    actions: { kNeck: { performed: 1 } },
                    fuckingNow: 1
                };
                window.loadGame(3);

                const malformedRecovered =
                    typeof gs.SexActions.actions.actionList === 'function'
                    && gs.SexActions.actions.kNeck.performed === 0
                    && gs.SexActions.actions.tBreast.performed === 0
                    && gs.SexActions.clothes.skirt.on === 1
                    && window.sexActions.clothes.skirt.on === 1;

                const missingMultipleMovesPreserved =
                    gs.IsMultipleMovesEnabled === true
                    && window.multiplemoves === 1;

                return JSON.stringify({
                    legacyKeysPersisted,
                    roundTripRestored,
                    malformedRecovered,
                    missingMultipleMovesPreserved
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();
        result.Should().Contain("\"legacyKeysPersisted\":true",
            "save payloads should keep the legacy key names instead of introducing canonical boolean field names");
        result.Should().Contain("\"roundTripRestored\":true",
            "save/load should restore migrated settings and sex-scene state through the canonical-compatible path without drift");
        result.Should().Contain("\"malformedRecovered\":true",
            "malformed persisted sexActions should recover to a safe playable shape without runtime errors");
        result.Should().Contain("\"missingMultipleMovesPreserved\":true",
            "missing save keys should leave the current playable setting intact instead of corrupting canonical state");

        AssertNoRuntimeErrors("save-load-recovery");
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