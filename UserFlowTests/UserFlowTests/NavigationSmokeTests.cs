using OpenQA.Selenium;
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
    private const string BaseUrl = ServerUrl.Origin + "/index.html?seed=20260330";
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
        _driver = DriverExtensions.CreateTestDriver();
    }

    [TearDown]
    public void TearDown()
    {
        _driver.Quit();
        _driver.Dispose();
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

    /// <summary>
    /// The game tracks where you are using a stack of location names (locStack).
    /// "Push" adds a location on top (you go somewhere new),
    /// "Pop" removes the top (you go back to where you were).
    ///
    /// This test verifies the stack works like a proper last-in-first-out stack
    /// and that the legacy global array stays in sync with the canonical
    /// gameState.LegacyLocStack mirror.
    /// </summary>
    [Test]
    public void LocationStack_PushPop_PreservesLifoDepthAndCanonicalParity()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                // Start with just 'yourhome' on the stack
                window.locStack = ['yourhome'];

                // Navigate: yourhome -> driveout -> thebar
                pushloc('driveout');
                pushloc('thebar');

                // Stack should now be: [thebar, driveout, yourhome] (3 deep, thebar on top)
                const depthAfterPush = Array.isArray(locStack) ? locStack.length : -1;
                const topAfterPush = Array.isArray(locStack) ? String(locStack[0]) : '';

                // Go back twice: thebar -> driveout -> yourhome
                const popped1 = String(poploc() ?? '');  // should return 'thebar'
                const popped2 = String(poploc() ?? '');  // should return 'driveout'

                // Should be back to just yourhome
                const finalDepth = Array.isArray(locStack) ? locStack.length : -1;
                const finalTop = Array.isArray(locStack) ? String(locStack[0]) : '';

                // Check the canonical mirror matches the legacy global
                const canonical = Array.isArray(window.runtimeContext?.LegacyLocStack)
                    ? window.runtimeContext.LegacyLocStack
                    : [];
                const parity = JSON.stringify(locStack) === JSON.stringify(canonical);

                return JSON.stringify({
                    depthAfterPush,
                    topAfterPush,
                    popped1,
                    popped2,
                    finalDepth,
                    finalTop,
                    parity
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // After two pushes onto a 1-deep stack, depth should be 3
        result.Should().Contain("\"depthAfterPush\":3",
            "stack should be 3 deep after pushing driveout and thebar");
        result.Should().Contain("\"topAfterPush\":\"thebar\"",
            "most recently pushed location should be on top");

        // Pops should return locations in reverse push order
        result.Should().Contain("\"popped1\":\"thebar\"",
            "first pop should return the last pushed location (thebar)");
        result.Should().Contain("\"popped2\":\"driveout\"",
            "second pop should return driveout");

        // Back to baseline
        result.Should().Contain("\"finalDepth\":1",
            "after popping both, only yourhome should remain");
        result.Should().Contain("\"finalTop\":\"yourhome\"",
            "yourhome should be the remaining location");

        // Old and new state systems agree on the stack contents
        result.Should().Contain("\"parity\":true",
            "legacy locStack global and canonical gameState mirror must match");

        AssertNoRuntimeErrors("location-stack-lifo");
    }

    /// <summary>
    /// Stress test: push and pop the same location 25 times in a row.
    /// The stack should always return to its baseline (just 'yourhome')
    /// and never underflow (go below 1 entry) or lose track of where you are.
    /// </summary>
    [Test]
    public void LocationStack_RepeatedPushPop_KeepsBaselineAndNeverUnderflows()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                window.locStack = ['yourhome'];

                let underflow = false;
                for (let i = 0; i < 25; i++) {
                    // Push a location, verify stack didn't break
                    pushloc('callher');
                    if ((locStack?.length ?? 0) < 1) {
                        underflow = true;
                        break;
                    }

                    // Pop it back off, verify we got the right one
                    const popped = poploc();
                    if (String(popped ?? '') !== 'callher') {
                        underflow = true;
                        break;
                    }

                    // Stack should still have at least yourhome
                    if ((locStack?.length ?? 0) < 1) {
                        underflow = true;
                        break;
                    }
                }

                // After 25 round-trips, we should still be at yourhome
                const currentTag = typeof getCurrentLocationTag === 'function'
                    ? String(getCurrentLocationTag())
                    : '';

                const finalDepth = Array.isArray(locStack) ? locStack.length : -1;
                const finalTop = Array.isArray(locStack) ? String(locStack[0]) : '';

                // Canonical mirror should still match
                const parity = JSON.stringify(locStack)
                    === JSON.stringify(Array.isArray(window.runtimeContext?.LegacyLocStack)
                        ? window.runtimeContext.LegacyLocStack
                        : []);

                return JSON.stringify({ underflow, finalDepth, finalTop, currentTag, parity });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // No underflow detected during 25 push/pop cycles
        result.Should().Contain("\"underflow\":false",
            "stack should never underflow during repeated push/pop cycles");

        // Still exactly 1 entry (yourhome) at the bottom
        result.Should().Contain("\"finalDepth\":1",
            "stack should return to baseline depth of 1 after all cycles");
        result.Should().Contain("\"finalTop\":\"yourhome\"",
            "yourhome should remain as the base location");
        result.Should().Contain("\"currentTag\":\"yourhome\"",
            "getCurrentLocationTag should report yourhome");

        // Old and new state agree
        result.Should().Contain("\"parity\":true",
            "legacy locStack and canonical mirror must stay in sync after stress test");

        AssertNoRuntimeErrors("location-stack-repeat");
    }

    /// <summary>
    /// When the companion pees, her bladder state should reset correctly
    /// and ONLY her globals should be affected — not the player's.
    ///
    /// Background: During migration, bladder state exists in two places:
    ///   - Canonical: gameState.Companion (typed object)
    ///   - Legacy: window.bladder, window.bladurge, etc. (old globals)
    /// The pee() method must update the companion side without touching
    /// the player's separate globals (window.yourbladurge).
    /// </summary>
    [Test]
    public void PersonPee_CompanionSyncsCompanionLegacyThresholdsOnly()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                // --- SETUP: give companion and player different urge values ---
                // Companion urge = 250, Player urge = 500.
                // This lets us verify pee() only touches the companion side.
                window.bladurge = 250;       // companion's legacy urge global
                window.yourbladurge = 500;    // player's legacy urge global (should NOT change)
                gs.Companion.setUrge(250);

                // Fill companion's bladder past the point of no return
                gs.Companion.Bladder = gs.Companion.bladderLose + 25;
                gs.Companion.NowPeeing = false;
                gs.Companion.LastPeeTime = -1;

                // --- ACT: companion pees ---
                gs.Companion.pee();

                // --- COLLECT: check what changed ---
                return JSON.stringify({
                    companionBladder: gs.Companion.Bladder,
                    companionNowPeeing: gs.Companion.NowPeeing,
                    companionLastPeeTime: gs.Companion.LastPeeTime,
                    companionLegacyUrge: window.bladurge,
                    companionCanonicalUrge: gs.Companion.bladderUrge,
                    playerLegacyUrge: window.yourbladurge
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // After peeing, her bladder should be empty
        result.Should().Contain("\"companionBladder\":0",
            "companion's bladder should be 0 after peeing");

        // The NowPeeing flag should be set (she is mid-pee)
        result.Should().Contain("\"companionNowPeeing\":true",
            "companion should be flagged as currently peeing");

        // LastPeeTime should have been updated from its initial -1
        result.Should().NotContain("\"companionLastPeeTime\":-1",
            "companion's last-pee timestamp should have been updated");

        // Crucially: the PLAYER's urge should be untouched at 500
        result.Should().Contain("\"playerLegacyUrge\":500",
            "player's urge global must not be affected by companion peeing");

        AssertNoRuntimeErrors("companion-pee-sync");
    }

    /// <summary>
    /// Mirror of the companion test above, but for the player character.
    /// When the player pees, only the player's state should reset —
    /// the companion's globals (window.bladurge) must stay untouched.
    /// </summary>
    [Test]
    public void PersonPee_PlayerSyncsPlayerLegacyThresholdsOnly()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                // --- SETUP: companion urge = 250, player urge = 500 ---
                window.bladurge = 250;       // companion's legacy urge (should NOT change)
                window.yourbladurge = 500;    // player's legacy urge
                gs.Player.setUrge(500);

                // Fill player's bladder past the breaking point
                gs.Player.Bladder = gs.Player.bladderLose + 25;
                gs.Player.NowPeeing = false;
                gs.Player.LastPeeTime = -1;

                // --- ACT: player pees ---
                gs.Player.pee();

                // --- COLLECT ---
                return JSON.stringify({
                    playerBladder: gs.Player.Bladder,
                    playerNowPeeing: gs.Player.NowPeeing,
                    playerLastPeeTime: gs.Player.LastPeeTime,
                    playerLegacyUrge: window.yourbladurge,
                    playerCanonicalUrge: gs.Player.bladderUrge,
                    companionLegacyUrge: window.bladurge
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // After peeing, player's bladder should be empty
        result.Should().Contain("\"playerBladder\":0",
            "player's bladder should be 0 after peeing");

        // NowPeeing flag should be set
        result.Should().Contain("\"playerNowPeeing\":true",
            "player should be flagged as currently peeing");

        // LastPeeTime should have been updated from -1
        result.Should().NotContain("\"playerLastPeeTime\":-1",
            "player's last-pee timestamp should have been updated");

        // Crucially: the COMPANION's urge should still be 250
        result.Should().Contain("\"companionLegacyUrge\":250",
            "companion's urge global must not be affected by player peeing");

        AssertNoRuntimeErrors("player-pee-sync");
    }

    /// <summary>
    /// Verifies the bridge between old globals and new gameState stays in sync.
    ///
    /// The game has two parallel state systems during migration:
    ///   OLD: window.bladder, window.yourbladder, window.nowpeeing, etc.
    ///   NEW: gameState.Companion.Bladder, gameState.Player.Bladder, etc.
    ///
    /// When old code writes to a global (e.g. window.bladder = 321),
    /// the new canonical state must reflect the same value immediately.
    /// If this breaks, the UI shows one value while game logic uses another.
    /// </summary>
    [Test]
    public void BladderGlobals_WindowAssignment_KeepsCanonicalParity_SameTick()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                // --- Simulate old-style code writing directly to globals ---
                window.bladder = 321;         // companion bladder fill level
                window.yourbladder = 654;     // player bladder fill level
                window.bladurge = 275;        // companion first-urge threshold
                window.yourbladurge = 525;    // player first-urge threshold
                window.nowpeeing = 1;         // companion is mid-pee (truthy)
                window.ynowpeeing = 0;        // player is NOT mid-pee
                window.lastpeetime = 777;     // companion's last pee timestamp
                window.ylastpeetime = 888;    // player's last pee timestamp

                // --- Check: does the new gameState mirror match? ---
                return JSON.stringify({
                    companionBladderParity: gs.Companion.Bladder === window.bladder,
                    playerBladderParity: gs.Player.Bladder === window.yourbladder,
                    companionUrgeParity: gs.Companion.bladderUrge === window.bladurge,
                    playerUrgeParity: gs.Player.bladderUrge === window.yourbladurge,
                    companionNowPeeingParity: gs.Companion.NowPeeing === true,
                    playerNowPeeingParity: gs.Player.NowPeeing === false,
                    companionLastPeeTimeParity: gs.Companion.LastPeeTime === window.lastpeetime,
                    playerLastPeeTimeParity: gs.Player.LastPeeTime === window.ylastpeetime
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // Each "parity" field should be true: the old global and new gameState agree
        result.Should().Contain("\"companionBladderParity\":true",
            "companion bladder: global and gameState should match");
        result.Should().Contain("\"playerBladderParity\":true",
            "player bladder: global and gameState should match");
        result.Should().Contain("\"companionUrgeParity\":true",
            "companion urge threshold: global and gameState should match");
        result.Should().Contain("\"playerUrgeParity\":true",
            "player urge threshold: global and gameState should match");
        result.Should().Contain("\"companionNowPeeingParity\":true",
            "companion now-peeing flag: global and gameState should match");
        result.Should().Contain("\"playerNowPeeingParity\":true",
            "player now-peeing flag: global and gameState should match");
        result.Should().Contain("\"companionLastPeeTimeParity\":true",
            "companion last-pee time: global and gameState should match");
        result.Should().Contain("\"playerLastPeeTimeParity\":true",
            "player last-pee time: global and gameState should match");

        AssertNoRuntimeErrors("bladder-global-parity");
    }

    /// <summary>
    /// During Phase 1A cutover, the player's derived threshold globals remain
    /// legacy mirrors, and canonical player updates must keep those mirrors in
    /// parity after pee-driven urge decay.
    ///
    /// This guards the supported contract: old code may still read the legacy
    /// threshold globals, but those values must be recomputed from canonical
    /// player state instead of acting as independent write targets.
    /// </summary>
    [Test]
    public void PlayerPee_CanonicalUrgeDecay_KeepsLegacyDerivedThresholdParity()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                // Set a known canonical urge and force a pee decay path (> lose threshold => 10% decay).
                gs.Player.setUrge(500);
                gs.Player.Bladder = gs.Player.bladderLose + 25;
                gs.Player.NowPeeing = false;

                gs.Player.pee();

                return JSON.stringify({
                    canonicalUrge: gs.Player.bladderUrge,
                    canonicalNeed: gs.Player.bladderNeed,
                    canonicalEmer: gs.Player.bladderEmer,
                    canonicalLose: gs.Player.bladderLose,
                    canonicalCumLose: gs.Player.bladderCumLose,
                    canonicalSexLose: gs.Player.bladderSexLose,
                    legacyUrge: window.yourbladurge,
                    legacyNeed: window.yourbladneed,
                    legacyEmer: window.yourblademer,
                    legacyLose: window.yourbladlose,
                    legacyCumLose: window.yourbladcumlose,
                    legacySexLose: window.yourbladsexlose
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        result.Should().Contain("\"canonicalUrge\":450",
            "player pee decay should reduce the canonical urge from 500 to 450");
        result.Should().Contain("\"legacyUrge\":450",
            "legacy player urge mirror should stay in parity with canonical state after pee decay");
        result.Should().Contain("\"canonicalNeed\":900",
            "canonical need threshold should be recomputed from the decayed urge");
        result.Should().Contain("\"legacyNeed\":900",
            "legacy need threshold should stay in parity with the canonical value after pee decay");
        result.Should().Contain("\"canonicalEmer\":1350",
            "canonical emergency threshold should be recomputed from the decayed urge");
        result.Should().Contain("\"legacyEmer\":1350",
            "legacy emergency threshold should stay in parity with the canonical value after pee decay");
        result.Should().Contain("\"canonicalLose\":1500",
            "canonical lose-control threshold should be recomputed from the decayed urge");
        result.Should().Contain("\"legacyLose\":1500",
            "legacy lose-control threshold should stay in parity with the canonical value after pee decay");
        result.Should().Contain("\"canonicalCumLose\":1800",
            "canonical cum-lose threshold should be recomputed from the decayed urge");
        result.Should().Contain("\"legacyCumLose\":1800",
            "legacy cum-lose threshold should stay in parity with the canonical value after pee decay");
        result.Should().Contain("\"canonicalSexLose\":2250",
            "canonical sex-lose threshold should be recomputed from the decayed urge");
        result.Should().Contain("\"legacySexLose\":2250",
            "legacy sex-lose threshold should stay in parity with the canonical value after pee decay");

        AssertNoRuntimeErrors("player-derived-threshold-mirror-sync");
    }

    /// <summary>
    /// Exercises a specific gameplay branch: you ask the companion to hold it
    /// while she's on the phone at the store, but attraction is too low so she
    /// refuses and relieves herself.
    ///
    /// The bug this guards against: before the migration fix, holdit() wrote
    /// `bladder = 0` directly to the legacy global, leaving
    /// gameState.Companion.Bladder out of sync (still showing the old value).
    /// Now it must use setBladder(0) so both sides agree.
    /// </summary>
    [Test]
    public void HoldIt_PhoneRefusal_ZeroesCanonicalCompanionBladder()
    {
        StartGameAndWait();

        var result = ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            try {
                const gs = window.runtimeContext;

                // --- SETUP: simulate being on the phone at the store ---
                // locStack[0] = 'gostore' triggers the phone-call branch in holdit()
                window.locStack = ['gostore'];

                // Low attraction means she will refuse to hold it
                window.attraction = 0;

                // Give her a non-zero bladder so we can verify it gets zeroed
                window.bladder = 420;

                // --- ACT: ask her to hold it (she refuses, relieves herself) ---
                holdit();

                // --- COLLECT: both state systems should show bladder = 0 ---
                return JSON.stringify({
                    companionBladder: gs.Companion.Bladder,
                    legacyBladder: window.bladder,
                    parity: gs.Companion.Bladder === window.bladder
                });
            } catch (e) {
                window.__testErrors = window.__testErrors || [];
                window.__testErrors.push(String((e && e.stack) || e));
                return JSON.stringify({ error: String((e && e.stack) || e) });
            }
        ")?.ToString();

        result.Should().NotBeNullOrWhiteSpace();

        // After she relieves herself, canonical state should be 0
        result.Should().Contain("\"companionBladder\":0",
            "canonical gameState bladder should be 0 after she relieves herself");

        // The old global should also be 0
        result.Should().Contain("\"legacyBladder\":0",
            "legacy global bladder should be 0 after she relieves herself");

        // Both must agree
        result.Should().Contain("\"parity\":true",
            "canonical and legacy bladder must match after holdit() phone refusal");

        AssertNoRuntimeErrors("holdit-phone-refusal");
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
