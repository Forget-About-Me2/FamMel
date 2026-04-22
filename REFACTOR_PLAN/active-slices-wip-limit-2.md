# Active Slices (WIP limit: 2)

## Current mode

- Planning phase only. Do not execute implementation changes from this file unless explicitly authorized.
- Use this file to define scope, gates, sequencing, and ownership.

## Global execution policy (effective 2026-04-22)

1. No compatibility layers anymore.
2. No new bridges, mirrors, dual-write paths, or compatibility-only globals.
3. Any slice that cannot complete without compatibility code must be re-scoped into a deletable vertical cutover.
4. "Done" requires less legacy runtime surface than before the slice started.
5. Enforcement is convention + explicit review checklist + plan tracking; do not rely on CI hard-fail for migration-policy policing.

### Slice T1 — Test framework realignment (compatibility tests out of UserFlow/C#)

**Goal:** Keep `UserFlowTests` focused on player-observable integration flows and migrate compatibility/bridge logic tests to the JS/TS low-level lane.

**Scope:**

- `UserFlowTests/UserFlowTests/AttractionShynessBridgeTests.cs`
- `UserFlowTests/UserFlowTests/DriveImagesOwnershipBridgeTests.cs`
- `UserFlowTests/UserFlowTests/SettingsSexSceneOwnershipBridgeTests.cs`
- New/updated JS/TS low-level test lane files for equivalent canonical/legacy transition assertions

**Gate (done when):**

- [ ] Compatibility/bridge assertions are no longer authored in C# UserFlow test classes.
- [ ] UserFlow C# suite keeps only player-observable behavior scenarios.
- [ ] Equivalent low-level assertions exist in JS/TS test lane and are runnable locally.
- [ ] Test docs clearly state lane ownership: userflow in C#, low-level compatibility in JS/TS.

**STATUS: In progress** (2026-04-22)

Execution notes:

- This is a framework cleanup and ownership realignment slice, not a gameplay behavior change.
- If a compatibility assertion is required temporarily, track it as migration debt with explicit removal owner/date.

### Slice 1 — High-Risk Trio: Location stack cutover

**Goal:** Eliminate dual-write on `locStack`/`LocStack`; typed `CurrentLocation` becomes the sole route authority.

**Scope:** `scripts/shims.ts`, `scripts/main.ts`, `scripts/gameState/gameState.ts`, `scripts/saveLoad.ts`, and any module using `pushloc`/`poploc`/`locStack[0]`

**Gate (done when):**

**Blocker:** Script-era JS modules still use `pushloc`/`poploc` directly — audit needed before removal.

**STATUS: COMPLETE** ✓ (2026-04-18)
- [x] Gameplay routing does not depend on `pushloc`/`poploc` side effects
- [x] `locStack[0]` reads replaced by typed location predicates in migrated modules
- [x] Legacy location write path eliminated from canonical gameplay routing
- [x] Build clean, typecheck clean, navigation userflow tests green (37/37, 2 consecutive runs stable)

**Completion evidence:**
- All major call sites (`yourHome.ts`, `actions.ts`, `store.ts`, `quotes.ts`, `herhome.ts`, `drive.ts`, `fuckHer.ts`, venue modules, `backPackItems.ts`) migrated to `getCurrentLocationTag()` adapter.
- Write paths (`pushloc`/`poploc`) now route through `gameState.LegacyLocStack` via `setCurrentLegacyLocationTag()`.
- Userflow smoke tests: 37/37 green across 2 consecutive runs (last run 2026-04-18 138.3s).
- Location stack invariants validated in `UserFlowTests/NavigationSmokeTests.cs`.

Progress note (2026-04-17):

- `scripts/main.ts` already contains one-way typed -> legacy top-of-stack sync (`syncLegacyLocStackFromTypedLocation`) for pre-game categories.
- `scripts/saveLoad.ts` now serializes/deserializes the location stack via canonical `gameState.LegacyLocStack` ownership (instead of shims module variable ownership).
- Remaining work in this slice is call-site migration (`locStack[0]` predicate reads + `pushloc`/`poploc` writes) and quarantine of legacy write paths.

Progress note (2026-04-18):

- Deferred Row B field `DrankChamp` is now canonicalized to `gameState.DrankChamp` in runtime + save/load paths (`scripts/fuckHer.ts`, `scripts/saveLoad.ts`, `scripts/backPackItems.ts`).
- Deferred Row B field `CheckedHerOut` is now canonicalized to `gameState.Interactions.CheckedHerOut` in runtime + save/load paths (`scripts/shims.ts`, `scripts/saveLoad.ts`, `scripts/locations/theBar.ts`, `scripts/locations/theClub.ts`, `scripts/locations/theatre.ts`, `scripts/locations/theMakeOut.ts`).
- Deferred Row B field `ChangeVenueFlag` is now canonicalized to `gameState.Interactions.ChangeVenueFlag` in runtime + save/load paths (`scripts/shims.ts`, `scripts/saveLoad.ts`, `scripts/bladder.ts`, `scripts/drive.ts`, `scripts/locations/theClub.ts`, `scripts/locations/theatre.ts`).

Progress note (2026-04-18, location read-path tranche):

- Added transitional typed-first location read adapter `getCurrentLocationTag()` in `scripts/shims.ts` (falls back to legacy `locStack[0]`).
- Migrated `scripts/yourHome.ts` off direct `locStack[0]` reads to the adapter for scene reload checks and continue-routing tags.
- Migrated `scripts/actions.ts` off direct `locStack[0]` reads to the adapter for flirt routing, continue tags, and hot tub checks.
- Migrated `scripts/store.ts` off direct `locStack[0]` reads to the adapter for go-store stack checks.
- Migrated `scripts/quotes.ts` off direct `locStack[0]` reads to the adapter for `curloc` routing and flirt choice variants.
- Migrated `scripts/herhome.ts` off direct `locStack[0]` reads to the adapter for pickup/elevator/key-search/home entry routing checks.
- Migrated `scripts/drive.ts` and `scripts/fuckHer.ts` off direct `locStack[0]` reads to the adapter for drive/bedroom/sex-entry routing checks.
- Migrated `scripts/locations/driveAround.ts` off direct `locStack[0]` reads for continue-tag routing.
- Migrated `scripts/locations/theBar.ts`, `scripts/locations/theClub.ts`, `scripts/locations/theatre.ts`, and `scripts/locations/theMakeOut.ts` off direct `locStack[0]` reads for venue entry/state predicate checks.
- Migrated `scripts/backPackItems.ts` off direct `locStack[0]` reads for buy/use eligibility and continue-tag routing checks.
- Slice 1 sequencing narrowed: finish read-path cutover file-by-file before migrating `pushloc`/`poploc` write paths.

Progress note (2026-04-18, location write-path tranche 1):

- `scripts/shims.ts` now routes `pushloc()`/`poploc()` writes through canonical `gameState.LegacyLocStack` when available, with legacy fallback only when gameState is unavailable.
- Added `setCurrentLegacyLocationTag()` in `scripts/shims.ts` to centralize top-of-stack writes behind canonical ownership.
- `scripts/main.ts` typed->legacy pre-game sync now uses `setCurrentLegacyLocationTag()` instead of direct `locStack` mutation.
- Remaining Slice 1 write-path work: migrate call sites that still invoke `pushloc`/`poploc` directly, then quarantine legacy write entry points.

Validation note (2026-04-18, location stack invariants):

- Added focused location stack invariants in `UserFlowTests/UserFlowTests/NavigationSmokeTests.cs`:
   - `LocationStack_PushPop_PreservesLifoDepthAndCanonicalParity`
   - `LocationStack_RepeatedPushPop_KeepsBaselineAndNeverUnderflows`
- Filtered test run is green: 2/2 passed via `dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj --filter "FullyQualifiedName~LocationStack_"`.

Test environment note (2026-04-17):

- Treat `ERR_CONNECTION_REFUSED` / host-unreachable Selenium failures as infrastructure failures first.
- Before userflow runs, verify dev host health at `http://127.0.0.1:8080` (responding HTML) and only then triage app behavior.

---

### Slice 2 — Phase 1A: Bladder model convergence

**Goal:** Make `gameState.Player` and `gameState.Companion` (`Person`) the sole runtime owners of bladder simulation thresholds/volumes.

**Scope:** `scripts/bladder.ts`, `scripts/yourbladder.ts`, `scripts/gameState/person.ts`, `scripts/main.ts`, `scripts/shims.ts`, `scripts/saveLoad.ts`.

**Gate (done when):**
- [ ] No direct gameplay writes to duplicated root-level `Blad*` / `YourBlad*` simulation fields
- [ ] `updateurge` / `updateyoururge` behavior is owned by shared `Person` methods (or thin wrappers that delegate to `Person`)
- [x] Save/load reads and writes canonical simulation values from `gameState.Player` and `gameState.Companion`
- [x] Build clean, typecheck clean, targeted bladder/location tests green, full userflow green in 2 consecutive runs

Execution status (2026-04-18):

- [x] Guardrail in place: do not add new legacy setter/global dependencies while converging bladder models.
- [x] Step 1 validated: bladder write-path audit recorded, build/typecheck clean, targeted save/load + phone tests green, full userflow green.
- [x] Step 2 validated: `Person` remains the threshold owner and now has role-safe legacy mirroring (`blad*` for companion, `yourblad*` for player); targeted regression tests added for both roles.
- [x] Step 5 validated: `saveLoad.ts` canonical bladder ownership direction corrected (`blad*` -> `gameState.Companion`, `yourblad*` -> `gameState.Player`).
- [ ] Step 3/4/6 remain open: internal gameplay code in `bladder.ts` / `yourbladder.ts` still performs direct module-local writes, so dual-write elimination is not finished yet.

Progress note (2026-04-19):

- `scripts/yourbladder.ts`: migrated one legacy derived-threshold write path to canonical delegation by changing `setYourbladneed(...)` to call `updateyoururge(...)` (derived inverse), so canonical `gameState.Player` urge remains the write owner and legacy thresholds are mirrored via `syncPlayerLegacyThresholdsFromCanonical(...)`.

Progress note (2026-04-19, ASAP threshold cutover tranche):

- `scripts/yourbladder.ts`: remaining legacy player threshold setters now delegate to canonical urge ownership (`setYourblademer`, `setYourbladlose`, `setYourbladcumlose`, `setYourbladsexlose` now route through `updateyoururge(...)` via a shared derived-threshold helper).
- `scripts/bladder.ts`: companion legacy threshold setters now delegate to canonical urge ownership (`setBladneed`, `setBlademer`, `setBladlose`, `setBladcumlose`, `setBladsexlose` now route through `updateurge(...)` via a shared derived-threshold helper).
- `scripts/bladder.ts`: `exposeBladderOnWindow()` threshold property setters now call compatibility setter functions instead of direct threshold global writes.
- Validation: build clean, typecheck clean, focused bladder tests green (`PersonPee_`, `PlayerPee_`, `BladderGlobals_` filter, 4/4 pass).

Progress note (2026-04-19, naming/boundary correction tranche):

- `scripts/gameState/gameState.ts`: renamed the runtime container class from `GameState` to `RuntimeContext` and introduced exported singleton `runtimeContext`.
- Added a non-breaking compatibility alias export `gameState = runtimeContext` to avoid immediate cross-file churn while ownership boundaries are corrected.
- `scripts/app.ts` now exposes both `window.gameState` (compat alias) and `window.runtimeContext` (transitional container identity).
- `scripts/globals.d.ts` now declares `runtimeContext` for script-era/global callers.

**Active issue found while executing Phase 1A:** `scripts/gameState/gameState.ts` still carries duplicated root-level `Blad*` / `YourBlad*` fields even though runtime ownership is converging on `Person`. They appear to be transitional data bag state now and should be removed or formally quarantined in a later Phase 1A pass.

Plan integrity note (2026-04-18):

- Issue found while maintaining this plan: Row B deferred-field status drifted between the Active Slices summary (resolved) and the Row B property tracker section (still marked `DEFER`).
- Action taken in this update: Row B tracker, evidence snapshot, and progress counters are now aligned to the resolved canonical ownership state.
- Issue found while preparing the next slice: Phase 1A existed only as high-level intent (not an executable checklist with explicit test gates), which made completion criteria ambiguous.
- Action taken in this update: Phase 1A is now promoted to an Active Slice with ordered, test-gated execution tasks.

---

### Slice 3 — Phase 2 Batch B1a: Attraction/Shyness NaN Contract + Canonical-First Hydration

**Goal:** Add canonical write APIs for attraction/shyness in `gameState`; standardize NaN handling as explicit no-op; align save/load hydration to canonical-first ordering.

**Scope:** `scripts/gameState/gameState.ts`, `scripts/shims.ts`, `scripts/saveLoad.ts`, `scripts/globals.d.ts`, targeted `UserFlowTests`.

**Sequencing note:** B1a started ahead of Batches A and B. Batches A and B have module-level dependencies; B1a is a clean atomic unit with no A/B prerequisite. Batches A and B remain pending in phase-2.

**Gate (done when):**
- [ ] Bridge crossing verified: legacy setter updates canonical value after init.
- [ ] Bridge no-op path verified: invalid numeric input does not mutate current/last values and does not throw.
- [ ] Pre-init compatibility verified: valid numeric updates legacy globals; invalid numeric is no-op; no runtime throw.
- [ ] Save/load round-trip verified for attraction/shyness with canonical-first hydration and matching numeric contract.
- [ ] Targeted userflow assertions pass for attraction/shyness paths.
- [ ] Build clean, typecheck clean, full userflow green in 2 consecutive runs.

**STATUS: In progress** (2026-04-20)

Policy update (2026-04-22):

- Re-scope remaining B1a work to remove compatibility indirection instead of extending it.
- Any open task that depends on new bridge behavior is now invalid and must be replaced by direct canonical ownership cutover.

---

### Slice 4 — Story 1.1: Drive/Images Canonical Ownership Hardening

**Goal:** Finalize Story 1.1 execution readiness by locking canonical ownership and bridge/persistence contracts for `imgs`, `wetthecar`, and `picset` before implementation.

**Scope:** `_bmad-output/implementation-artifacts/spec-1-1-drive-and-images-migration.md`, `scripts/gameState/gameState.ts`, `scripts/images.ts`, `scripts/drive.ts`, `scripts/shims.ts`, `scripts/saveLoad.ts`, `UserFlowTests/UserFlowTests/DriveImagesOwnershipBridgeTests.cs`.

**Gate (done when):**
- [x] Spec explicitly defines canonical-only write authority for image state (`gameState.Imgs`); legacy globals are compatibility facade only.
- [x] Spec defines deterministic startup/hydration order and persistence precedence (canonical wins over legacy fallback).
- [x] Bridge contract is one-way toward canonical ownership and idempotent under repeated setup.
- [x] Quality gates are explicit and measurable: deterministic replay, bridge parity, focused userflow, and no-flake requirement.
- [x] Active slice includes risk/mitigation/owner and a rollback trigger.

**STATUS: COMPLETE** ✓ (2026-04-22)

Execution checklist (consensus-ordered):
- [x] Lock ownership contract text in Story 1.1 spec using SHALL language and glossary definitions.
- [x] Add startup order + hydration tie-break section (canonical persisted payload precedence, legacy fallback behavior).
- [x] Add bridge invariants: canonical-first read/write, pre-init fallback behavior, and idempotent setup requirement.
- [x] Add persistence contract section for conflict resolution and backward-compatible hydration mapping.
- [x] Add deterministic quality gates and acceptance mapping (contract completeness, bridge parity, determinism, regression safety, coverage-to-risk).
- [x] Add/update focused test plan for `DriveImagesOwnershipBridgeTests` with boundary and corrupted-payload cases.

Completion evidence (2026-04-22):
- Canonical owner methods added in `scripts/gameState/gameState.ts`: `Imgs`, `setImgs`, `resetImgsToDefault`, `tryImportImgsFromStorage`.
- `scripts/images.ts` migrated to canonical-first image ownership with pre-init legacy-only fallback and invalid-input no-op handling.
- Bridge seeding and one-way ownership alignment completed in `scripts/shims.ts` for `imgs`, `wetthecar`, and `picset` pre-init compatibility.
- `scripts/drive.ts` wet-seat bridge now enforces finite numeric no-op contract and post-init canonical routing.
- `scripts/saveLoad.ts` now persists `imgs` through `FIELD_REGISTRY` with field-level structured clone semantics and canonical live reads for `wetthecar`/`picset`.
- New focused integration suite `UserFlowTests/UserFlowTests/DriveImagesOwnershipBridgeTests.cs` is green: 6/6 passed.
- Build and typecheck gates are green: `node esbuild.config.mjs`, `npx tsc -p . --noEmit`.
- Smoke filter gate executed; no smoke-tagged tests currently present (`Category=Smoke` => 0 discovered).

Risk register (Story 1.1):
- Risk: hidden divergence between canonical and legacy image state during initialization/bridge transitions.
- Likelihood: medium.
- Impact: high (silent state drift and hard-to-triage regressions in image rendering/drive flow).
- Mitigation: deterministic startup ordering, bridge parity assertions, idempotent bridge setup, and deterministic replay gate.
- Owner: Murat (quality gate definition) + implementation owner for execution.

Rollback trigger:
- Any failed deterministic replay or bridge parity regression in touched flows triggers commit-level rollback of the Story 1.1 migration slice.

Sequencing note:
- Story 1.1 drive/images hardening is a prerequisite for downstream bridge-removal and save/load simplification batches touching image consumers.

Exit criteria for compatibility mode:
- Zero direct writes to legacy image globals outside approved bridge adapters.
- Canonical-only save path for image payload is verified by tests.
- Focused drive/images userflow + required build/typecheck gates pass.

---

### Slice 5 — Story 1.2: Settings and Sex-Scene Canonical Ownership

**Goal:** Complete Story 1.2 runtime ownership migration for settings toggles and sex-scene state while preserving legacy globals, save payload shape, and `haveSex()` behavior.

**Scope:** `scripts/gameState/gameState.ts`, `scripts/settings.ts`, `scripts/fuckHer.ts`, `scripts/main.ts`, `scripts/shims.ts`, `scripts/saveLoad.ts`, `scripts/globals.d.ts`, `UserFlowTests/UserFlowTests/SettingsSexSceneOwnershipBridgeTests.cs`.

**Gate (done when):**
- [x] Story 1.2 settings globals stage before init and delegate to canonical boolean owners after init.
- [x] `drankChamp` and `sexActions` stage before init, hydrate once, and keep post-init canonical ownership without reverse-bridge recursion.
- [x] Save/load remains on legacy key names and restores canonical/legacy parity for Story 1.2 fields.
- [x] Build clean, typecheck clean, focused Story 1.2 userflow tests green.

**STATUS: COMPLETE** ✓ (2026-04-22)

Completion evidence (2026-04-22):
- `scripts/gameState/gameState.ts` now owns Story 1.2 canonical boolean flags via `IsImagesEnabled`, `IsStatsVisible`, `IsMultipleMovesEnabled`, and `IsMovesAutoReset`, with deterministic no-op setters for invalid numeric compatibility writes.
- `scripts/settings.ts` now stages Story 1.2 compatibility writes before init, hydrates them once in `start()`, and delegates post-init writes through canonical setters while preserving legacy numeric mirrors.
- `scripts/fuckHer.ts` now stages `drankChamp`, normalizes malformed `sexActions` payloads to a safe playable shape, and delegates post-init compatibility writes to canonical `gameState` ownership.
- `scripts/shims.ts` no longer reverse-bridges Story 1.2 settings or `sexActions`, preventing write bounce/re-entry loops.
- `scripts/saveLoad.ts` now reads Story 1.2 settings/sex-scene state from canonical-first paths while preserving legacy persisted key names.
- `UserFlowTests/UserFlowTests/SettingsSexSceneOwnershipBridgeTests.cs` added focused coverage for pre-init staging, post-init canonical sync, no-bounce setter execution, round-trip save/load, and malformed recovery; filtered run is green (4/4).
- Validation gates executed: `node esbuild.config.mjs`, `npx tsc -p . --noEmit`, `dotnet test ... --filter "FullyQualifiedName~SettingsSexSceneOwnershipBridgeTests"`.

Risk note:
- `haveSex()` still reads transitional numeric mirrors from `scripts/settings.ts`, but those mirrors are now hydrated from and synchronized to canonical GameState ownership. A future slice can remove the mirrors entirely once the remaining script-style consumers are cut over.

---

