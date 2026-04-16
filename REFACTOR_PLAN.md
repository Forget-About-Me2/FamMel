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
- Player and companion bladder mechanics share one model (`Person`) with role-specific config values.

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

> **Test prerequisite:** The `UserFlowTests` Selenium suite requires a live dev server at `http://127.0.0.1:8080`. Run `npm run dev` (or `node esbuild.config.mjs --watch` + `live-server`) before running tests. All `ERR_CONNECTION_REFUSED` failures are infrastructure failures, not code failures.
- Random seed determinism: 3 consecutive reruns of `RandomSeedDeterminismTest` passed (2/2 each run).

## Migration Principles

1. Keep changes mechanical and batch-based.
2. Migrate one owning module at a time.
3. After each batch: build, typecheck, targeted tests for touched areas, and curated userflow smoke tests.
4. Delete old paths immediately after each successful batch (no long-lived dual write paths).

## Ownership Discovery Strategy (when owners are unclear)

This plan's domain blocks are suggestions, not locked architecture.

Use this 3-pass flow before moving any unresolved field:

1. **Evidence pass (no moves):**
   - For each field, collect where it is read and written.
   - Record write frequency and whether writes happen in one feature or many features.
   - Mark fields with unknown behavior as `DEFER` instead of guessing ownership.
2. **Lifecycle pass:**
   - Classify each field as one of:
     - `Session` (lives across most of a run),
     - `Scene` (only relevant in one location/flow),
     - `Cache` (loaded data blobs),
     - `LegacyBridge` (compatibility only),
     - `SimulationCore` (player/companion physiology models).
3. **Ownership pass (smallest safe move):**
   - Choose owner by primary writer (not by current comment block name).
   - If multiple unrelated writers exist, keep field on root for now and mark `KEEPROOT`.
   - If owner is still ambiguous, keep `DEFER` and add a short note in the touch log.

Decision rule:

- Move only when all are true:
  1. One clear primary writer exists.
  2. Save/load impact is understood.
  3. At least one validation test or userflow check covers the touched behavior.

Confidence labels for unresolved rows:

- `HIGH`: owner clear, single-writer or tightly-coupled writer set.
- `MEDIUM`: mostly clear, but has shared writes or weak test coverage.
- `LOW`: ambiguous ownership or unknown behavior impact (default to `DEFER`).

Practical guardrail:

- Do not force every field into a substate early. A temporary `KEEPROOT` is safer than a wrong owner that causes hidden regressions.

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

### Phase 1A: Bladder Model Convergence (in scope, required)

Why this exists:

- `Person` already contains shared bladder/tummy logic.
- `bladder.ts` and `yourbladder.ts` duplicate threshold/volume fields (`Blad*` vs `YourBlad*`).
- `gameState` currently stores duplicated copies of both sets of fields, increasing drift risk.

Canonical ownership target:

- Shared simulation values live on `gameState.Player` and `gameState.Companion` (`Person` instances).
- Role-specific tuning remains as config/input (initial urge, min urge percent, event thresholds).
- Legacy module fields become compatibility aliases only, then are removed.

Execution order:

1. Stop introducing new root-level `Blad*` and `YourBlad*` properties.
2. Migrate threshold reads/writes to `gameState.Player` and `gameState.Companion` getters (`bladderUrge`, `bladderNeed`, etc.).
3. Move shared calculations (`updateurge`, `updateyoururge`, decay math) behind `Person` methods.
4. Keep only scenario/event flags in row H/I that are not simulation core.
5. Remove duplicate bridge mappings from `shims.ts` once call sites are migrated.

Current progress:

- [x] Guardrail agreed: do not add new legacy setter/global dependencies while converging bladder models.
- [ ] Next implementation slice: move threshold ownership to `Person` without expanding legacy imports or legacy setter calls in `main.ts`.
- [ ] Remaining: migrate call sites that still read threshold globals directly in `bladder.ts` / `yourbladder.ts`.

Exit criteria:

- No duplicated threshold pairs remain (`Blad*` and `YourBlad*`) as independent runtime sources of truth.
- `bladder.ts` and `yourbladder.ts` use shared simulation helpers or `Person` methods.
- Save/load captures player/companion simulation state from `gameState.Player` and `gameState.Companion`.

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

Probable substates from this row:

- `RelationshipState`: `HavePurse`, `OwedFavour`

- [ ] HavePurse -> RelationshipState
- [ ] OwedFavour -> RelationshipState

#### Row B: InteractionState (active)

- [x] FlirtCounter
- [x] TimeSinceLastFlirt
- [x] AllowedToFlirt
- [x] ShowedNeed
- [x] FlirtedFlag
- [x] NoFlirtFlag
- [x] MaxFlirts
- [x] MaxKiss -> RomanceState
- [x] MaxFeel -> RomanceState
- [x] RandMax
- [x] Arousal -> RomanceState
- [x] KissCounter -> RomanceState
- [x] FeelCounter -> RomanceState
- [x] FuckingNow -> RomanceState
- [x] ChampagneCounter -> RomanceState
- [ ] DEFER DrankChamp (RomanceState vs SessionOrProgressState)
- [ ] DEFER CheckedHerOut (InteractionState vs VenueState)
- [ ] DEFER ChangeVenueFlag (InteractionState vs SessionOrProgressState)

Probable substates from this row:

- `InteractionState`: `FlirtCounter`, `TimeSinceLastFlirt`, `AllowedToFlirt`, `ShowedNeed`, `FlirtedFlag`, `NoFlirtFlag`, `MaxFlirts`, `RandMax`
- `RomanceState`: `MaxKiss`, `MaxFeel`, `Arousal`, `KissCounter`, `FeelCounter`, `FuckingNow`, `ChampagneCounter`
`Deferred decisions`: `DrankChamp`, `CheckedHerOut`, `ChangeVenueFlag`

Row B ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Next action |
|---|---|---|---|---|---|
| `FlirtCounter` | `actions.ts` via `setFlirtcounter`, `main.ts` decrements `gameState.Interactions.FlirtCounter` | `actions.ts`, `backPackItems.ts` | HIGH | `InteractionState` | keep as-is |
| `TimeSinceLastFlirt` | no active writes found outside declaration/bridge | none obvious | LOW | `DEFER` | locate intended usage before migration step |
| `AllowedToFlirt` | `main.ts` sets `gameState.Interactions.AllowedToFlirt = true` | none obvious | MEDIUM | `InteractionState` | keep in interaction until contrary evidence |
| `ShowedNeed` | `bladder.ts` via `setShowedneed`, `main.ts` clears `gameState.Interactions.ShowedNeed` | `backPackItems.ts` conditions | HIGH | `InteractionState` | keep as interaction signal |
| `FlirtedFlag` | `actions.ts` via `setFlirtedflag`, `drive.ts` resets | `backPackItems.ts` conditions | HIGH | `InteractionState` | keep as-is |
| `NoFlirtFlag` | legacy setter path in `shims.ts` only | `backPackItems.ts` conditions | MEDIUM | `InteractionState` | keep, confirm write source during slice |
| `MaxFlirts` | legacy setter path in `shims.ts` | `backPackItems.ts` conditions | MEDIUM | `InteractionState` | keep, confirm runtime configurability |
| `RandMax` | legacy setter path in `shims.ts` | no clear direct reads beyond bridge | LOW | `DEFER` | confirm if still behaviorally relevant |
| `MaxKiss` | legacy setter path in `shims.ts` | `actions.ts`, `fuckHer.ts`, `herhome.ts` via legacy import | HIGH | `RomanceState` | migrate with romance counters in same slice |
| `MaxFeel` | legacy setter path in `shims.ts` | `actions.ts` gating | HIGH | `RomanceState` | migrate with romance counters in same slice |
| `Arousal` | heavy writes in `actions.ts` and `fuckHer.ts` | heavy reads in `fuckHer.ts` | HIGH | `RomanceState` | migrate as first romance field |
| `KissCounter` | writes in `actions.ts`, `fuckHer.ts` reset path | reads in `actions.ts`, `fuckHer.ts`, `herhome.ts` | HIGH | `RomanceState` | migrate with `Arousal` |
| `FeelCounter` | writes in `actions.ts` | reads in `actions.ts` | HIGH | `RomanceState` | migrate with `Arousal` |
| `FuckingNow` | writes in `fuckHer.ts` | reads in `bladder.ts` | HIGH | `RomanceState` | migrate with compatibility alias temporarily |
| `ChampagneCounter` | writes in `backPackItems.ts` and legacy setter | reads in `backPackItems.ts`, `herhome.ts` | HIGH | `RomanceState` | migrate with champagne flow tests |
| `DrankChamp` | writes via `setDrankChamp` in `backPackItems.ts` | reads in `fuckHer.ts` bridge mapping | MEDIUM | `DEFER` | resolve if it is romance pacing or session pacing |
| `CheckedHerOut` | writes in `actions.ts`, `drive.ts` reset | imported/used in interaction-heavy paths | MEDIUM | `DEFER` | decide after one focused call-site pass |
| `ChangeVenueFlag` | writes in `drive.ts`, `bladder.ts`, `main.ts` reset | checked in `bladder.ts` | MEDIUM | `DEFER` | likely `SessionOrProgressState`, verify first |

Row B provisional sequencing (not locked):

1. Migrate high-confidence romance fields first: `MaxKiss`, `MaxFeel`, `Arousal`, `KissCounter`, `FeelCounter`, `FuckingNow`, `ChampagneCounter`.
2. Keep `DrankChamp`, `CheckedHerOut`, `ChangeVenueFlag`, `RandMax`, `TimeSinceLastFlirt` as `DEFER` until call-site verification is complete.
3. Avoid owner changes for `DEFER` fields in the same PR as romance moves.

Row B progress: 15/18 migrated

Next Row B implementation slice (no new legacy deps):

1. Resolve deferred ownership fields only: `DrankChamp`, `CheckedHerOut`, `ChangeVenueFlag`.
2. Run a focused call-site pass before moving any deferred field.
3. Keep `RandMax` and `TimeSinceLastFlirt` deferred until behavior relevance is confirmed.
4. Validate build + typecheck.
5. Update Row B checkboxes and touch log in same change.

### Discovered Substate Taxonomy (from full evidence pass)

Accumulated from rows A–J evidence passes. This supersedes the original Phase 1 target sub-objects list.

| Substate | Fields going in | Spawned from row | Status |
|---|---|---|---|
| `InteractionState` | FlirtCounter, TimeSinceLastFlirt, AllowedToFlirt, ShowedNeed, FlirtedFlag, NoFlirtFlag, MaxFlirts, RandMax | B | ✅ Migrated |
| `RomanceState` | MaxKiss, MaxFeel, Arousal, KissCounter, FeelCounter, FuckingNow, ChampagneCounter | B | ✅ Migrated |
| `RelationshipState` | HavePurse, OwedFavour | A | 🔲 Planned |
| `DriveState` | WetTheCar, GasStation | D | 🔲 HIGH confidence — ready for Phase 2 Batch A |
| `SettingsState` | HerOutfit, FavoriteMovie, SuggestedLoc, MultipleMoves, RstMoves, PhotoChoice, ShowStats, EnableImages, EnableAscii, PlayerGame + **PlayerBladder, ClubClosingTime, TheaterClosingTime, BarClosingTime, TimeSpeed (from Row C)** | F + C | 🔲 Planned; Row C config fields should migrate here, not stay in SessionOrProgressState |
| `SessionOrProgressState` | Late, Shopping, BrokeIce, SawHerPee, ToldStories, LastStory | C + H | 🔲 Planned; Row C only contributes Late and Shopping after config fields split off |
| `CompanionProfileState` *(new)* | PantyColor, GirlName, CustomGirlName, BaseGirl, GirlTalk, GirlGasp | G | 🔲 Discovered in Row G evidence pass; companion identity/appearance |
| `UIState` *(new)* | Comma, ImagePrev, AllowItems | G | 🔲 Discovered in Row G; consider moving to `gameScreen` not `gameState` |
| `BarState` *(new)* | BarTopic, Loser | E | 🔲 Venue-scoped |
| `ClubState` *(new)* | ExternalFlirt, WetPhoto, IsNude, PoseCtr, OutfitCtr | E | 🔲 Venue-scoped |
| `TheatreState` *(new)* | RrMovieLineThresh, MovieCounter, MovieChoice, AskedFavourite, SeenMovie | E | 🔲 Venue-scoped |
| `MakeOutState` *(new)* | AskedSwim, WalkCounter | E | 🔲 Venue-scoped |
| `HerHomeState` *(new)* | PrePeed, ElevatorWaitCounter, FloorCounter, HomeChampagne | E + G | 🔲 Venue-scoped |
| `NavigationState` *(new)* | EmerBreak, EmerHold | E | 🔲 Transition event flags; not venue-specific |
| `CompanionBladderEventState` *(new)* | PeedTowels, PeedVase, PeedShot, PeedOutside, NotDesperate, NotHDesperate, RrLockedFlag, SheSpurted, WetLegs, WetHerPanties, NowPeeing, GottaGoFlag, AskHoldItCounter, WaitCounter | H | 🔲 Scene event flags split from simulation core |
| `PlayerBladderEventState` *(new)* | HoldSelf, YNowPeeing, YouSpurted, YRrLockedFlag | I | 🔲 Scene event flags split from simulation core |
| `ContentCache` *(new — not on gameState)* | All Row J JSON blobs except SexActions | J | 🔲 These should not be on gameState; move to a separate singleton |
| `gameState.Companion` (Person) | Row H SimulationCore fields | H | 🔲 Phase 1A — already planned |
| `gameState.Player` (Person) | Row I SimulationCore fields | I | 🔲 Phase 1A — already planned |



#### Row C: SessionOrProgressState

- [ ] Late
- [ ] Shopping
- [ ] PlayerBladder
- [ ] ClubClosingTime
- [ ] TheaterClosingTime
- [ ] BarClosingTime
- [ ] TimeSpeed

Row C ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes |
|---|---|---|---|---|---|
| `Late` | shims.ts forward-bridge only | `bladder.ts` checks in pee loop | MEDIUM | `SessionOrProgressState` | Set when time > 75; genuine session state |
| `Shopping` | `store.ts` via `setShopping(1)`, reset unclear | `store.ts` | HIGH | `SessionOrProgressState` | Single writer, scene-level session flag |
| `PlayerBladder` | `settings.ts` via `setPlayerbladder`, `main.ts` reads from `gameSettings` | `main.ts`, `backPackItems.ts`, `theMakeOut.ts` | HIGH | **SettingsState (misclassified in Row C)** | This is a game option, not session state; `gameSettings.ts` already has `PlayerBladder`; migrate there |
| `ClubClosingTime` | shims.ts default only | `theClub.ts`, `debugMenu.ts` | HIGH | **SettingsState (misclassified in Row C)** | Static config after init; `gameSettings.ts` already has `ClubClosingTime` |
| `TheaterClosingTime` | shims.ts default only | `theatre.ts` | HIGH | **SettingsState (misclassified in Row C)** | Static config; `gameSettings.ts` has `TheaterClosingTime` |
| `BarClosingTime` | shims.ts default only | `theBar.ts` | HIGH | **SettingsState (misclassified in Row C)** | Static config; `gameSettings.ts` has `BarClosingTime` |
| `TimeSpeed` | shims.ts default only | `gameState.ts` tick math | HIGH | **SettingsState (misclassified in Row C)** | Config; `gameSettings.ts` has `TimeSpeed`; already used via `gameSettings.TimeSpeed` in tick |

> **New ownership type discovered:** `Late` and `Shopping` are true session progress flags. The remaining five fields (`PlayerBladder`, `*ClosingTime`, `TimeSpeed`) are **config/settings values** that are already duplicated in `gameSettings.ts`. Row C should be split: keep `Late` and `Shopping` here; move the config fields to SettingsState to eliminate the duplication.

#### Row D: DriveState

- [ ] WetTheCar
- [ ] GasStation

Row D ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes |
|---|---|---|---|---|---|
| `WetTheCar` | `bladder.ts` via `setWetthecar(1)` | `drive.ts` (conditional quote) | HIGH | `DriveState` | Single writer (`bladder.ts`), single reader (`drive.ts`); classic drive scene outcome flag |
| `GasStation` | `driveAround.ts` via `setGasStation` | `bladder.ts` cross-checks, `driveAround.ts` | HIGH | `DriveState` | Owned entirely by the drive-around flow; no cross-domain readers |

Both fields are HIGH confidence. `DriveState` is the right owner. These are also eligible for an early confidence batch migration (Phase 2 Batch A).

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

Row E ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes |
|---|---|---|---|---|---|
| `BarTopic` | `theBar.ts` | `theBar.ts` | HIGH | `BarState` | Single-venue, single-module |
| `Loser` | `theBar.ts` | `theBar.ts` | HIGH | `BarState` | Single-venue |
| `ExternalFlirt` | `theClub.ts` | `bladder.ts` (3 reads), `drive.ts` (reset) | HIGH | `ClubState` | Cross-read by bladder but write-owned by club |
| `WetPhoto` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue |
| `IsNude` | `theClub.ts` | `theClub.ts`, `fuckHer.ts` | HIGH | `ClubState` | Used in sex flow too — worth tracking |
| `PoseCtr` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue |
| `OutfitCtr` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue |
| `RrMovieLineThresh` | `theatre.ts` | `bladder.ts` (threshold check) | HIGH | `TheatreState` | Cross-read but write-owned by theatre |
| `MovieCounter` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue |
| `MovieChoice` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue |
| `AskedFavourite` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue |
| `SeenMovie` | `theatre.ts` via `setSeenmovie` | `locations.ts`, `herhome.ts` | MEDIUM | `TheatreState` | Cross-module read for unlock logic; still theatre-owned |
| `AskedSwim` | `theMakeOut.ts` | `theMakeOut.ts` | HIGH | `MakeOutState` | Single-venue |
| `WalkCounter` | `theMakeOut.ts` | `theMakeOut.ts` | HIGH | `MakeOutState` | Single-venue |
| `PrePeed` | `herhome.ts` via `setPrepeed` | `herhome.ts` | HIGH | `HerHomeState` | Single-venue |
| `ElevatorWaitCounter` | `herhome.ts` | `herhome.ts` | HIGH | `HerHomeState` | Single-venue (from saveLoad import evidence) |
| `FloorCounter` | `herhome.ts` (direct mutation) | `herhome.ts` | HIGH | `HerHomeState` | Single-venue |
| `EmerBreak` | `locations.ts` | `locations.ts`, `bladder.ts` | MEDIUM | `NavigationState` (new) | Not venue-specific; fires during location transitions |
| `EmerHold` | `locations.ts` | `locations.ts`, `bladder.ts` | MEDIUM | `NavigationState` (new) | Same as EmerBreak — navigation event flag |

> **New ownership types discovered:**
> - `BarState`, `ClubState`, `TheatreState`, `MakeOutState`, `HerHomeState`: venue-scoped sub-objects. `VenueState` as a single flat class would be too big — these are better as separate classes per venue, similar to how `RomanceState` is separate from `InteractionState`.
> - `NavigationState` (new): `EmerBreak`/`EmerHold` are not venue-owned; they fire during the `go()` / `leavehm()` transitions. A lightweight `NavigationState` (or `TransitionState`) captures these.

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

Row F ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes |
|---|---|---|---|---|---|
| `HerOutfit` | `settings.ts` via `setHeroutfit` | `drive.ts`, `fuckHer.ts`, `herhome.ts`, `actions.ts`, `bladder.ts`, `backPackItems.ts` | HIGH | `SettingsState` | Wide read surface — companion appearance config; set during game setup |
| `FavoriteMovie` | `settings.ts` | `theatre.ts` | HIGH | `SettingsState` | Companion preference set once |
| `SuggestedLoc` | `locations.ts` (6 writes), `drive.ts` (reset) | `drive.ts` reads, `locations.ts` checks | HIGH | `SettingsState` | Technically a session-computed recommendation, but already on gameState root; migration is clean |
| `MultipleMoves` | `settings.ts` | `fuckHer.ts` | HIGH | `SettingsState` | Game option |
| `RstMoves` | `settings.ts` | `fuckHer.ts` | HIGH | `SettingsState` | Game option; flag to reset move set |
| `PhotoChoice` | `settings.ts` | `images.ts` | HIGH | `SettingsState` | Set by player preference |
| `ShowStats` | `settings.ts` | `gameScreen/statusBar.ts` | HIGH | `SettingsState` | UI preference |
| `EnableImages` | `settings.ts`, `images.ts` | `images.ts` | HIGH | `SettingsState` | UI option |
| `EnableAscii` | `settings.ts` | unclear | HIGH | `SettingsState` | UI option |
| `PlayerGame` | `settings.ts` | unclear | MEDIUM | `SettingsState` | Unclear semantics — likely enable/disable player bladder mini-game |

All Row F fields are HIGH/MEDIUM confidence, single-writer from `settings.ts`. Straightforward batch.  
Note: `ClubClosingTime`, `TheaterClosingTime`, `BarClosingTime`, `TimeSpeed`, `PlayerBladder` from Row C also belong here — Row C should be reconciled against Row F.

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

Row G ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes |
|---|---|---|---|---|---|
| `PantyColor` | `backPackItems.ts` (`setPantycolor`), `bladder.ts` | `bladder.ts`, `fuckHer.ts`, `herhome.ts` | HIGH | **CompanionProfileState** (new) | Companion appearance state, not generic narrative |
| `GirlName` | `quotes.ts` / game init | `backPackItems.ts`, `herhome.ts`, `bladder.ts`, many | HIGH | **CompanionProfileState** (new) | Companion identity; wide reads, single init write |
| `CustomGirlName` | `settings.ts` | `quotes.ts` | HIGH | **CompanionProfileState** (new) | Companion identity |
| `BaseGirl` | `settings.ts` | `actions.ts`, `quotes.ts` | HIGH | **CompanionProfileState** (new) | Companion visual variant |
| `GirlTalk` | `quotes.ts` / game init | Used across all dialogue | HIGH | **CompanionProfileState** (new) | Companion speech prefix |
| `GirlGasp` | `quotes.ts` / game init | `bladder.ts`, `backPackItems.ts` | HIGH | **CompanionProfileState** (new) | Companion speech prefix variant |
| `Comma` | `backPackItems.ts` | `backPackItems.ts` | HIGH | **UIState** (new) | Purely a rendering helper for the inventory description builder; not narrative state |
| `ImagePrev` | `images.ts` | `images.ts` | HIGH | **UIState** (new) | Previous image cache for dedup; pure UI |
| `AllowItems` | `main.ts`, `drive.ts`, `herhome.ts` (many callers) | `backPackItems.ts`, `herhome.ts` | HIGH | **UIState** (new) | Controls backpack button visibility; cross-venue UI gate |
| `HomeChampagne` | `backPackItems.ts` | `backPackItems.ts`, `herhome.ts` | HIGH | **HerHomeState** | Already identified in Row E; poured/first-glass tracker for her home |
| `PicSet` | unclear — bridge only visible | `images.ts` | LOW | `DEFER` | Purpose unclear; likely image rendering mode flag |

> **New ownership types discovered:**
> - `CompanionProfileState` (new): `PantyColor`, `GirlName`, `CustomGirlName`, `BaseGirl`, `GirlTalk`, `GirlGasp` are companion identity/appearance. These don't belong in NarrativeState — they belong on the companion model. Consider adding them to `dateNPC` / `Companion` or as a separate `CompanionProfileState`.
> - `UIState` (new): `Comma`, `ImagePrev`, `AllowItems` are runtime UI flags that control rendering, not game logic. They don't belong on gameState at all in the long term — they could live on `gameScreen` or a dedicated UI state object.

#### Row H: CompanionBladderState

Scope note: split this row while migrating.
- Simulation-core fields should converge into `gameState.Companion` (`Person`) and be removed from root.
- Scenario/event flags can remain in row H until a later behavior refactor.

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

Row H ownership evidence snapshot (2026-04-17):

| Property | Lifecycle | Confidence | Provisional owner | Notes |
|---|---|---|---|---|
| `CustomUrge`, `MinUrge`, `MinPerc` | SimulationCore — per-companion urge threshold config | HIGH | `gameState.Companion` (Person) | Already on `Person` as simulation params |
| `BladUrge`, `BladNeed`, `BladEmer`, `BladLose`, `BladCumLose`, `BladSexLose` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model |
| `MaxTummy`, `MaxBeer`, `Tummy`, `Bladder` | SimulationCore — volume state | HIGH | `gameState.Companion` (Person) | Core simulation values |
| `BladDec`, `BladDespDec`, `Seal` | SimulationCore — decay rates | HIGH | `gameState.Companion` (Person) | Rate constants; go with Person |
| `BeerDecCounter`, `YBeerDecCounter` | Scene counters | MEDIUM | `gameState.Companion` (Person) or `SessionState` | Counting drink cycles — borderline |
| `PeedTowels`, `PeedVase`, `PeedShot`, `PeedOutside` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome flags; not simulation-core — keep in Row H or separate event sub-object |
| `LastPeeTime`, `TimeHeld` | SimulationCore — time tracking | HIGH | `gameState.Companion` (Person) | Used in desperation pacing |
| `DrankBeer` | Session counter | MEDIUM | `gameState.Companion` (Person) | Tracks drinks for tummy simulation |
| `NotDesperate`, `NotYDesperate`, `NotHDesperate` | Scene flags | MEDIUM | `CompanionBladderEventState` | Cooldown flags for vocalizations |
| `SpurtThresh`, `YSpurtThresh`, `BribeAskThresh`, `BribeAskBase` | SimulationCore — event thresholds | HIGH | `gameState.Companion` (Person) | Rate/threshold constants |
| `TumAvg` | SimulationCore | HIGH | `gameState.Companion` (Person) | Running average for tummy fill rate |
| `RrLockedFlag` | Scene flag | HIGH | `CompanionBladderEventState` | Bathroom locked during rr scene |
| `SheSpurted`, `WetLegs`, `WetHerPanties`, `NowPeeing` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome states |
| `BrokeIce`, `SawHerPee` | Session progress | MEDIUM | `SessionOrProgressState` | Track unique events that don't reset between locations |
| `GottaGoFlag`, `AskHoldItCounter`, `WaitCounter` | Scene flags | HIGH | `CompanionBladderEventState` | Short-lived scene interaction flags |
| `ToldStories`, `LastStory` | Session progress | HIGH | `SessionOrProgressState` | Story tracking persists across locations |

> **New sub-type clarification for Row H:** Splitting into two groups:
> - **SimulationCore** → converge into `gameState.Companion` (`Person`): all threshold/volume/rate fields.
> - **`CompanionBladderEventState`** (new label for the scene flags that stay separate): `PeedTowels`, `PeedVase`, `PeedShot`, `PeedOutside`, `NotDesperate`, `NotHDesperate`, `RrLockedFlag`, `SheSpurted`, `WetLegs`, `WetHerPanties`, `NowPeeing`, `GottaGoFlag`, `AskHoldItCounter`, `WaitCounter`.

#### Row I: PlayerBladderState

Scope note: split this row while migrating.
- Simulation-core fields should converge into `gameState.Player` (`Person`) and be removed from root.
- Scenario/event flags can remain in row I until a later behavior refactor.

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

Row I ownership evidence snapshot (2026-04-17):

Row I mirrors Row H exactly, with all fields belonging to `gameState.Player` (`Person`) for SimulationCore fields and a `PlayerBladderEventState` for scene flags. Confidence is HIGH for the split — the `Y*` prefix is exactly parallel to the companion's un-prefixed set.

| Sub-group | Fields | Provisional owner |
|---|---|---|
| SimulationCore | `YourBladder`, `YourTummy`, `YourTumAvg`, `YourBladUrge`, `YourBladNeed`, `YourBladEmer`, `YourBladLose`, `YourBladCumLose`, `YourBladSexLose`, `YMaxTummy`, `YMaxBeer`, `YourCustomUrge`, `YMinUrge`, `YLastPeeTime`, `YTimeHeld` | `gameState.Player` (Person) |
| DrinkCounters | `YDrankCocktails`, `YDrankSodas`, `YDrankWaters`, `YDrankBeers`, `YDrankBeer` | `gameState.Player` (Person) or `SessionState` |
| Scene/event flags | `HoldSelf`, `YNowPeeing`, `YouSpurted`, `YRrLockedFlag` | `PlayerBladderEventState` (new) |

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

Row J ownership evidence snapshot (2026-04-17):

| Sub-group | Fields | Provisional owner | Notes |
|---|---|---|---|
| Deep mutable config | `Settings`, `StatsBars`, `EndScreens` | `ContentCacheState` or `gameSettings` | Loaded once, treated as config blobs; already on gameState |
| Sex scene data | `SexActions`, `SexLines` | `ContentCacheState` | Loaded in `fuckHer.ts`; `SexActions` is the one mutable object (tracks action state) — split `SexActions` out as a runtime object, leave `SexLines` as cache |
| Loaded JSON blobs | `CalledJsons`, `LocJson`, `FlirtResps`, `FeelUp`, `Kissing`, `YPeeLines`, `PeeLines`, `Needs`, `YNeeds`, `DrinkLines`, `Appearance`, `Drive`, `General`, `Darts`, `ObjQuotes`, `SharedLoc`, `Bar`, `TalkUnused`, `Club`, `Theatre`, `MakeOut`, `HerHome`, `Locations` | `ContentCacheState` | Read-only after load; true cache blobs |

> **Key observation for Row J:** These are **not runtime state** — they are load-once content blobs. They should not be serialized in save/load. Future action: move them off `gameState` entirely to a `ContentCache` singleton, leaving `gameState` only for mutable runtime state. `SexActions` is the one exception — it is mutable (tracks current action queue) and should live on `RomanceState`.



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
| 2026-04-17 | MaxKiss | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | MaxFeel | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | Arousal | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | KissCounter | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | FeelCounter | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | FuckingNow | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | ChampagneCounter | migrated | Romance | pending | Row B romance ownership slice |

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
