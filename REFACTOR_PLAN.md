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
- [ ] Build a top-10 behavior matrix (flow, expected behavior, evidence source, confidence).
- [ ] Identify unknown behavior areas and add characterization tests before refactor.
- [ ] Choose extraction order as vertical slices (feature + migration + tests) rather than file-type batches.

Initial extraction order recommendation (from current triage):

1. Slice 1 (confidence starter): bedroom key standardization + related tests (`3b6bb00`).
2. Slice 2 (test safety net): navigation smoke + determinism/userflow test updates (`48ae2f7`, test-only parts of nearby commits).
3. Slice 3 (high-value behavior): save/load path + integration coverage (`b06ad5f`) with explicit roundtrip verification.
4. Slice 4 (bugfix retention): darts crash/drink handling (`ac28692`) with targeted regression test.
5. Defer until later: broad bridge synchronization commits (`c90645f`, `b948e35`) unless required as prerequisites.

Exit criteria:

- No high-impact changed area remains "unknown".
- Each user-visible behavior delta has Keep/Defer/Drop status.
- First extraction slice is selected with explicit test evidence.

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

## Phase 1: Reset Save/Load To Transitional Simplicity

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

## Why This Is More Maintainable

After completion, a new developer only needs to learn:

- `gameState` owns mutable state.
- gameplay modules mutate `gameState` directly.
- save/load reads/writes `gameState`.

That removes today’s multi-layer mental model and matches a familiar C# architecture style.
