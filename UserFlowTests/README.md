# UserFlowTests

This folder contains the browser-level userflow test suite for FamMel.

## What It Is For

Use these tests to catch player-visible regressions that unit tests and type checks cannot detect,
especially during migration work where canonical `gameState` ownership and legacy global mirrors both exist.

These tests exercise full game behavior in a real browser, including:

- startup and initial routing
- navigation transitions
- dialogue/action click pipelines
- compatibility parity between canonical state and legacy globals
- save/load and export/import behavior

## When To Run It

Run userflow tests when you change:

- gameplay flow logic in `scripts/*.ts`
- state ownership bridges or compatibility setters
- routing/location transitions
- save/load serialization logic
- shared text/choice plumbing that can break interaction flow

For high-risk refactors, run the full suite twice to confirm stability.

## Prerequisites

1. Install dependencies:
   - `npm install`

The test suite automatically starts a dedicated web server on port 8081
before running and stops it when finished. No manual server setup needed.

## Common Commands

Run full suite:

```bash
dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj
```

Run one targeted test:

```bash
dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj --filter "HoldIt_PhoneRefusal_ZeroesCanonicalCompanionBladder"
```

Run from VS Code tasks:

- `tests: userflow`
- `tests: userflow (filter)`

## Test Intent Catalog

This index is the quick answer to "what does this test actually protect?"

### Navigation and State Parity

- `NavigationSmokeTests.FullNavigation_StartGame_ThenVisitAllLocations_WithoutErrors`:
   Ensures `go()` navigation can visit all major locations and still render text without runtime errors.
- `NavigationSmokeTests.GoNavigation_Individual_RendersWithoutErrors`:
   Per-location routing sanity check for `go("target")`.
- `NavigationSmokeTests.GoBack_ReturnsToYourHome_WithoutErrors`:
   Verifies `goback` returns correctly through the location stack.
- `NavigationSmokeTests.GoGamestart_ThenYourHome_NavigationChain_WithoutErrors`:
   Validates startup route chain (`gamestart` to `yourhome`).
- `NavigationSmokeTests.LocationStack_PushPop_PreservesLifoDepthAndCanonicalParity`:
   Confirms LIFO behavior and parity with canonical legacy location stack mirror.
- `NavigationSmokeTests.LocationStack_RepeatedPushPop_KeepsBaselineAndNeverUnderflows`:
   Guards against stack underflow or baseline corruption under repeated push/pop cycles.
- `NavigationSmokeTests.PersonPee_CompanionSyncsCompanionLegacyThresholdsOnly`:
   Ensures companion pee flow updates companion canonical and legacy-linked urge/parity paths.
- `NavigationSmokeTests.PersonPee_PlayerSyncsPlayerLegacyThresholdsOnly`:
   Ensures player pee flow updates player canonical and legacy-linked urge/parity paths.
- `NavigationSmokeTests.BladderGlobals_WindowAssignment_KeepsCanonicalParity_SameTick`:
   Verifies direct global assignments propagate to canonical state within the same tick.
- `NavigationSmokeTests.HoldIt_PhoneRefusal_ZeroesCanonicalCompanionBladder`:
   Regression guard for phone refusal branch ensuring both canonical and legacy bladder become zero.

### Scene and Feature Smokes

- `SceneIntegrationSmokeTests.SceneEntryPoints_Render_WithoutRuntimeErrors`:
   Parameterized smoke test for scene entry functions to ensure each renders and throws no browser errors.
- `DartsIntegrationTests.PlayDarts_FromBar_RendersAndAdvancesWithoutRuntimeErrors`:
   Covers darts entry from bar and first progression step.
- `TheMovieTest.MovieScene_TheatreFlow_RendersAndAdvancesWithoutRuntimeErrors`:
   Covers theatre/movie interaction path and progression.
- `PickherupTest.PickHerUp_PhoneAndStoreProgression_ReachesPickupFlow`:
   Covers the pick-her-up route after phone/store progression.

### Home, Save/Load, and Endgame

- `YourHomeIntegrationTests.PreDrink_ShowsDialogue_AndContinueChoice`:
   Confirms early drink interaction renders expected dialogue and continuation.
- `YourHomeIntegrationTests.IncomingPhoneCall_AnswerPath_ShowsCantWaitDialogue_WithoutErrors`:
   Confirms incoming-call answer path shows hold/pee dialogue without runtime errors.
- `YourHomeIntegrationTests.GoGamestart_RoutesToYourHome_AndRendersChoices`:
   Verifies startup navigation to `yourhome` plus visible choices.
- `YourHomeIntegrationTests.SaveAndLoad_PreservesGameState_WithoutErrors`:
   Verifies save/load round trip restores key state values and sync.
- `YourHomeIntegrationTests.ExportAndImport_RoundTrips_WithoutErrors`:
   Verifies exported JSON import restores modified state.
- `EndgameIntegrationTests.CanReach_Endgame_GameOver_FromHerHomeFlow`:
   Covers reachable game-over rendering path from her-home flow.
- `EndgameIntegrationTests.CanReach_Endgame_WinScreen_FromLateGameFlow`:
   Covers win-screen rendering path in deterministic late-game integration setup.
- `EndgameIntegrationTests.CanReach_Endgame_WinScreen_StrictLateGamePath_NoFallback`:
   Strict real-branch win path check (explicit/flaky guard while migration is in progress).
- `EndgameIntegrationTests.E2E_WetHerselfWin_FuckNowToGameWet`:
   End-to-end wet-win branch from sex flow.
- `EndgameIntegrationTests.E2E_WinState_FuckNowPauseThroughToGameWon`:
   End-to-end controlled pause/continue route to game-won screen.

### Determinism

- `RandomSeedDeterminismTest.SeededRandom_IsRepeatable_AndDifferentAcrossSeeds`:
   Ensures same seed repeats sequence and different seeds diverge.
- `RandomSeedDeterminismTest.QueryParamSeed_IsDeterministicAcrossReloads`:
   Ensures `?seed=` remains deterministic across reloads.

## Reading Failures

- Test names describe the scenario and expected behavior.
- Runtime JS errors are captured via browser-side error tracking and surfaced through assertions.
- For behavior depending on randomness, prefer deterministic mode using `?seed=<number>`.

## Relationship To Other Validation

Use this suite together with:

- build check: `node esbuild.config.mjs`
- type check: `npx tsc -p . --noEmit`

Type checks confirm static correctness; userflow tests confirm real player behavior.
