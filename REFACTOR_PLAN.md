# FamMel Single-GameState Migration Plan

## Audience Note (C#-first)

This plan assumes you are stronger in C# than TypeScript.

- Treat `gameState` like a C# POCO that owns all mutable fields.
- Treat module `export let` variables like legacy static fields to remove.
- Goal: one source of truth (`gameState`) + one serialization path (save/load).

## End State

- All mutable runtime state lives on `gameState` only.
- Game logic reads/writes `gameState.X` directly.
- No `expose*OnWindow()` bridge functions.
- No setter scaffolding (`setX(...)`) for migrated state.
- Save/load serializes and restores `gameState` directly.

## Current Snapshot (why this is hard today)

- 203 exported setter functions.
- 23 `expose*OnWindow()` functions.
- `connectToGameState()` still bridges both directions.
- saveLoad.ts currently carries bridge-aware complexity.
- `GameState` already has the vast majority of needed fields (~180), so we can migrate by replacing call sites and deleting legacy variables.

## Phase 0: Forensics And Value Recovery (must run first)

Purpose: preserve unknown feature work and test additions before deep cleanup.

Current branch forensic baseline (2026-04-16):

- 34 commits ahead of `origin/dev`.
- 120 files changed vs `origin/dev`.
- New and modified userflow tests exist in `UserFlowTests/`.
- Multiple likely user-visible/runtime commits are mixed with refactor commits.

Artifacts generated for triage:

- `triage-commits-vs-origin-dev.txt`
- `triage-files-vs-origin-dev.txt`
- `triage-diffstat-vs-origin-dev.txt`
- `triage-userflow-commits-vs-origin-dev.txt`
- `triage-userflow-diffstat-vs-origin-dev.txt`
- `triage-commit-lanes.csv` (initial lane suggestion, must be manually reviewed)

Phase 0 checklist:

- [x] Create forensic inventory artifacts from git history and diff.
- [x] Classify initial high-impact commit/file areas as Keep, Defer, or Drop (`triage-keep-defer-drop.tsv`).
- [ ] Complete Keep/Defer/Drop classification for remaining lower-impact areas.
- [x] Build and seed a top-10 behavior matrix with current evidence (`triage-behavior-matrix.tsv`).
- [ ] Identify unknown behavior areas and add characterization tests before refactor.
- [ ] Choose extraction order as vertical slices (feature + migration + tests) rather than file-type batches.

Extraction strategy update (validated 2026-04-16):

- Attempting to replay late commits onto `origin/dev` or `origin/master` via cherry-pick caused high conflict density, including missing test files, JS/TS file-shape mismatches, and bridge-era dependencies.
- Conclusion: historical replay is currently higher risk and cost than preservation cleanup.

Execution model going forward:

1. Preserve-all baseline: work from current branch head (`typeScriptAndDebugUI`) using `recovery/clean-from-head` as the cleanup lane.
2. Carve forward slices by concern (tests, save/load, bugfixes, bridge reduction) with new commits, instead of replaying old commits in isolation.
3. Keep high-confidence behavior commits conceptually protected (bedroom key consistency, navigation smoke, save/load coverage, darts crash fix), but validate via current code behavior rather than cherry-pickability.
4. Defer bridge-heavy reshaping (`connectToGameState` sync internals) until coverage confidence and behavior matrix checks are in place.

Exit criteria:

- No high-impact changed area remains "unknown".
- Each user-visible behavior delta has Keep/Defer/Drop status.
- First extraction slice is selected with explicit test evidence.

Latest validation evidence:

- Navigation smoke: 12/12 passing when dev host is running on `127.0.0.1:8080`.
- Save/load integration (`YourHomeIntegrationTests`): 5/5 passing (includes SaveAndLoad + ExportAndImport flows).
- Darts integration: 1/1 passing (`DartsIntegrationTests`) covering dark bar darts entry and first-round advance.
- Full userflow suite: 35 succeeded, 0 failed, 0 skipped (`dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj`); runner reported 35 discovered of 36 because one strict late-game test is marked `[Explicit]`.
- Random seed determinism: 3 consecutive reruns of `RandomSeedDeterminismTest` passed (2/2 each run).

## Migration Principles

1. Keep changes mechanical and batch-based.
2. Migrate one owning module at a time.
3. After each batch: build, typecheck, targeted tests for touched areas, and curated userflow smoke tests.
4. Delete old paths immediately after each successful batch (no long-lived dual write paths).

## Coverage Confidence Gate (new)

Because `UserFlowTests` are relatively new, treat them as evolving confidence signals, not full safety proof.

Before merge candidate review, require all of the following:

1. Build passes (`node esbuild.config.mjs`).
2. Typecheck passes (or no net-new errors if a temporary baseline is approved).
3. Curated critical userflow smoke set passes (start, navigation, dialogue/action, store/inventory, save/load).
4. For each changed high-impact area, there is either automated test coverage or explicit manual verification evidence.
5. Residual untested risk is documented with owner + follow-up action.

## Phase 1: Organize GameState Into Domain Sub-Objects

Purpose: consolidate the 100+ scattered fields on GameState into logically grouped sub-objects (InteractionState, VenueState, CompanionState, etc.) so the architecture reflects domain logic instead of chaos.

Current state: Partially done — fields have been added to GameState but remain flat and scattered.

Target sub-objects (domains identified):

- **InteractionState**: Flirt, Kiss, Feel counters; Arousal; Champagne tracking
- **DriveState**: WetTheCar, GasStation, related counters
- **VenueState**: Venue-specific tracking (BarTopic, Loser, ExternalFlirt, WetPhoto, IsNude, PoseCtr, OutfitCtr, MovieCounter, MovieChoice, etc.)
- **LocationState**: Location progression, visited tracking (already partially done with `LocStack`)
- **TimeState**: Time tracking (already exists as `Time` object — validate integration)
- **CompanionState**: Companion needs (Bladder, Tummy, Energy, etc.) — currently still in bridged form, migrate to here
- **PlayerState**: Player-specific state (Money, PlayerBladder, Inventory) — rationalize ownership

Batch order (bottom-up from smallest):

- [ ] 1a: Create `InteractionState` class, move Flirt/Kiss/Feel/Arousal fields, update all read/write sites
- [ ] 1b: Create `DriveState` class, move Drive-related fields
- [ ] 1c: Create `VenueState` class, move all venue-specific tracking fields
- [ ] 1d: Verify CompanionState/PlayerState are properly encapsulated (may already be done)
- [ ] 1e: Rationalize remaining orphan fields (ChangeVenueFlag, CheckedHerOut, etc.) into appropriate sub-object or document why they stay top-level

After each sub-object completion:
- Update all call sites to use `gameState.Interactions.KissCounter` instead of `gameState.KissCounter`
- Run build/typecheck/tests to validate
- Commit with "refactor: [SubObject] migration" and test evidence

Exit criteria:
- No field remains on root GameState that logically belongs in a sub-object
- All tests still pass
- Code is semantically clearer (KissCounter is now in `Interactions`, not ambiguous at root)

### Phase 1 Property Tracker (Rows Are Canonical)

Use this as the only property list. Each property appears once.

Rules:

1. Update checkbox state in the same commit as code changes.
2. Keep one active row at a time until build/typecheck/tests pass.
3. Add touch-log entries only for properties changed in that commit.

Legend:

- `[ ]` Not migrated
- `[x]` Migrated
- `[ ] KEEPROOT` Stays on root intentionally
- `[ ] DEFER` Ownership unresolved

#### Row A: Core Root

- [ ] KEEPROOT Player
- [ ] KEEPROOT Companion
- [ ] KEEPROOT Time
- [ ] KEEPROOT LocStack
- [ ] KEEPROOT LegacyLocStack
- [ ] KEEPROOT LastMoney
- [ ] KEEPROOT LastAttraction
- [ ] KEEPROOT LastShyness
- [ ] KEEPROOT DidIntro
- [ ] HavePurse
- [ ] OwedFavour

#### Row B: InteractionState (active)

- [x] FlirtCounter
- [x] TimeSinceLastFlirt
- [x] AllowedToFlirt
- [x] ShowedNeed
- [x] FlirtedFlag
- [x] NoFlirtFlag
- [x] MaxFlirts
- [ ] MaxKiss
- [ ] MaxFeel
- [x] RandMax
- [ ] Arousal
- [ ] KissCounter
- [ ] FeelCounter
- [ ] FuckingNow
- [ ] ChampagneCounter
- [ ] DrankChamp
- [ ] CheckedHerOut
- [ ] ChangeVenueFlag

Row B progress: 8/18 migrated

#### Row C: SessionOrProgressState

- [ ] Late
- [ ] Shopping
- [ ] PlayerBladder
- [ ] ClubClosingTime
- [ ] TheaterClosingTime
- [ ] BarClosingTime
- [ ] TimeSpeed

#### Row D: DriveState

- [ ] WetTheCar
- [ ] GasStation

#### Row E: VenueState

- [ ] BarTopic
- [ ] Loser
- [ ] ExternalFlirt
- [ ] WetPhoto
- [ ] IsNude
- [ ] PoseCtr
- [ ] OutfitCtr
- [ ] RrMovieLineThresh
- [ ] MovieCounter
- [ ] MovieChoice
- [ ] AskedFavourite
- [ ] SeenMovie
- [ ] AskedSwim
- [ ] WalkCounter
- [ ] PrePeed
- [ ] ElevatorWaitCounter
- [ ] FloorCounter
- [ ] EmerBreak
- [ ] EmerHold

#### Row F: SettingsState

- [ ] HerOutfit
- [ ] FavoriteMovie
- [ ] SuggestedLoc
- [ ] MultipleMoves
- [ ] RstMoves
- [ ] PhotoChoice
- [ ] ShowStats
- [ ] EnableImages
- [ ] EnableAscii
- [ ] PlayerGame

#### Row G: NarrativeState

- [ ] PantyColor
- [ ] GirlName
- [ ] CustomGirlName
- [ ] BaseGirl
- [ ] GirlTalk
- [ ] GirlGasp
- [ ] Comma
- [ ] ImagePrev
- [ ] AllowItems
- [ ] HomeChampagne
- [ ] PicSet

#### Row H: CompanionBladderState

- [ ] CustomUrge
- [ ] MinUrge
- [ ] MinPerc
- [ ] BladUrge
- [ ] BladNeed
- [ ] BladEmer
- [ ] BladLose
- [ ] BladCumLose
- [ ] BladSexLose
- [ ] MaxTummy
- [ ] MaxBeer
- [ ] Tummy
- [ ] Bladder
- [ ] BladDec
- [ ] BladDespDec
- [ ] Seal
- [ ] BeerDecCounter
- [ ] YBeerDecCounter
- [ ] PeedTowels
- [ ] PeedVase
- [ ] PeedShot
- [ ] PeedOutside
- [ ] LastPeeTime
- [ ] TimeHeld
- [ ] DrankBeer
- [ ] NotDesperate
- [ ] NotYDesperate
- [ ] NotHDesperate
- [ ] SpurtThresh
- [ ] YSpurtThresh
- [ ] BribeAskThresh
- [ ] BribeAskBase
- [ ] TumAvg
- [ ] RrLockedFlag
- [ ] SheSpurted
- [ ] BrokeIce
- [ ] SawHerPee
- [ ] WetLegs
- [ ] WetHerPanties
- [ ] NowPeeing
- [ ] GottaGoFlag
- [ ] AskHoldItCounter
- [ ] WaitCounter
- [ ] ToldStories
- [ ] LastStory

#### Row I: PlayerBladderState

- [ ] YourBladder
- [ ] YourTummy
- [ ] YourTumAvg
- [ ] HoldSelf
- [ ] YourBladUrge
- [ ] YourBladNeed
- [ ] YourBladEmer
- [ ] YourBladLose
- [ ] YourBladCumLose
- [ ] YourBladSexLose
- [ ] YMaxTummy
- [ ] YMaxBeer
- [ ] YourCustomUrge
- [ ] YMinUrge
- [ ] YNowPeeing
- [ ] YLastPeeTime
- [ ] YTimeHeld
- [ ] YDrankCocktails
- [ ] YDrankSodas
- [ ] YDrankWaters
- [ ] YDrankBeers
- [ ] YDrankBeer
- [ ] YRrLockedFlag
- [ ] YouSpurted

#### Row J: ContentCacheState

- [ ] Settings
- [ ] StatsBars
- [ ] EndScreens
- [ ] SexActions
- [ ] CalledJsons
- [ ] LocJson
- [ ] FlirtResps
- [ ] FeelUp
- [ ] Kissing
- [ ] YPeeLines
- [ ] PeeLines
- [ ] Needs
- [ ] YNeeds
- [ ] DrinkLines
- [ ] Appearance
- [ ] Drive
- [ ] General
- [ ] Darts
- [ ] SexLines
- [ ] ObjQuotes
- [ ] Locations
- [ ] SharedLoc
- [ ] Bar
- [ ] TalkUnused
- [ ] Club
- [ ] Theatre
- [ ] MakeOut
- [ ] HerHome

#### Touch Log (append-only)

| Date | Property | Action | Target | Commit | Notes |
|---|---|---|---|---|---|
| 2026-04-16 | FlirtCounter | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | TimeSinceLastFlirt | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | AllowedToFlirt | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | ShowedNeed | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | FlirtedFlag | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | NoFlirtFlag | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | MaxFlirts | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | RandMax | migrated | Interactions | e890344 | first interaction slice |

## Phase 1b: Reset Save/Load To Transitional Simplicity

Purpose: remove the over-engineered registry so migration work is easier to reason about.

- [ ] Replace saveLoad.ts field registry/setter graph with a simple transitional approach.
- [ ] Keep behavior identical (save slot, load slot, export/import).
- [ ] Preserve deep-merge behavior for mutable `const` objects (`backPackItems`, `herpurse`).
- [ ] Validate with save/load integration tests.

Exit criteria:
- saveLoad.ts is understandable without tracing 100+ imports.
- Existing save/load tests pass.

## Phase 2: Move State Ownership To gameState (Batches)

For each batch:
- replace reads/writes of module state with `gameState.X`
- remove corresponding module `export let`
- remove corresponding `setX` function(s)
- remove corresponding `expose*OnWindow` state mapping(s)
- run build/typecheck/tests

### Batch order (smallest risk first)

- [ ] Batch A: `drive.ts`, `images.ts` (very small, confidence batch)
- [ ] Batch B: `settings.ts`, `fuckHer.ts`
- [ ] Batch C: location modules (`locations.ts`, `driveAround.ts`, `theBar.ts`, `theClub.ts`, `theatre.ts`, `theMakeOut.ts`, `herhome.ts`)
- [ ] Batch D: `backPackItems.ts`, `quotes.ts`
- [ ] Batch E: `shims.ts`
- [ ] Batch F: `bladder.ts`, `yourbladder.ts`

Exit criteria:
- No migrated variable remains as module-owned mutable state.
- No migrated variable needs a bridge setter.

## Phase 3: Remove Bridge Infrastructure

Once all mutable state is gameState-owned:

- [ ] Delete `connectToGameState()` bridge logic and call sites.
- [ ] Delete all `expose*OnWindow()` functions and app.ts calls.
- [ ] Remove remaining bridge-era window indirection for state.

Exit criteria:
- `Object.defineProperty(window, ...)` is no longer used for state bridging.
- State flow is direct and local: module → `gameState`.

## Phase 4: Final Save/Load Simplification

Implement straightforward gameState serialization.

- [ ] Save snapshot from `gameState` (plus any intentional non-gameState objects).
- [ ] Restore into `gameState` with explicit reconstruction where needed (e.g. `Person` objects if methods/state require rebuilding).
- [ ] Keep file import/export compatibility.

Exit criteria:
- saveLoad.ts is short, explicit, and gameState-centric.
- No knowledge of bridge internals required to maintain save/load.

## Phase 5: Developer-Focused Hardening

- [ ] Property naming consistency pass (minimize mixed naming styles).
- [ ] Add targeted JSDoc on non-obvious lifecycle/state mutation functions.
- [ ] Add short "How State Works" section to README (for non-TS contributors).

## Working Agreement For Each PR/Batch

Each batch should include:

1. Variables migrated (list)
2. Bridges/setters deleted (count)
3. Tests run and result summary
4. Any temporary compatibility code added (must have removal note)

## Execution Discipline (Commit Early + Boy Scout + Learning Loop)

### Commit Early, Often, and Slice-Based

Rules for this branch:

1. Each meaningful change slice gets its own commit (avoid mega-commits).
2. Commit at least once per completed validation checkpoint (build/test evidence attached in commit message or notes).
3. Keep commit scope single-purpose when possible:
   - test-only
   - behavior fix
   - refactor/mechanical move
   - cleanup/doc update
4. If a task grows past ~60-90 minutes without a safe commit point, split it and commit the stable part first.

Commit message pattern (recommended):

- `<type>: <short intent>`
- `Validation: <what ran + result>`
- `Risk: <known residual risk or "none noted">`

### Boy Scout Rule (Leave It Better)

When touching a file, do at least one small local improvement if safe:

1. remove dead code/path,
2. tighten confusing naming,
3. add or adjust a high-value assertion/test,
4. clarify one non-obvious block with a concise comment,
5. simplify one branch or duplicated snippet.

Guardrail: do not expand scope if the cleanup risks blocking the current slice; record deferred cleanup in this plan.

### Mistake Tracking and Learning Loop

Use `mistake-ledger.tsv` to track mistakes and convert them into process improvements.

For each notable mistake capture:

1. What happened,
2. Why it happened,
3. Detection signal,
4. Fix applied,
5. Preventive rule/check added.

Cadence:

1. Update ledger immediately after mistakes that cost time or created risk.
2. Review top recurring patterns every 5-10 commits.
3. Add one preventive action to this plan for any recurring mistake pattern.

## Why This Is More Maintainable

After completion, a new developer only needs to learn:

- `gameState` owns mutable state.
- gameplay modules mutate `gameState` directly.
- save/load reads/writes `gameState`.

That removes today’s multi-layer mental model and matches a familiar C# architecture style.
