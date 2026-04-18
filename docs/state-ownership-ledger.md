# State Ownership Ledger

Purpose: enforce one write owner per gameplay concept and eliminate bidirectional bridge behavior during migration.

## Decision Legend

- MOVE: canonical gameplay state owned by `gameState`.
- ADAPT: temporary compatibility bridge while callers are migrated.
- LEAVE: intentionally outside canonical gameplay state.

## Global Guardrails

1. One concept = one write owner.
2. No bidirectional synchronization for the same concept.
3. New feature work cannot add new dual-write concepts.
4. Save/load must restore canonical owner only for concepts marked MOVE.

## Priority Concepts (Sprint 1)

| Concept | Class | Canonical Owner | Current Dual Ownership Evidence | Current Writer Paths | Bridge Direction (Target) | Save/Load Target | Status |
|---|---|---|---|---|---|---|---|
| Money (`money`, `Money`, `lastmoney`, `LastMoney`) | MOVE | `gameState.Money`, `gameState.LastMoney` | `scripts/shims.ts` defines legacy `money`/`setMoney` plus gameState bridge support; `scripts/gameState/gameState.ts` defines canonical `Money`; `scripts/saveLoad.ts` now binds `money`/`lastmoney` keys to gameState fields | Updated call sites write via gameState APIs (`scripts/yourHome.ts`, `scripts/locations/theBar.ts`, `scripts/backPackItems.ts`); formatting/options now read gameState-backed values | `gameState -> legacy money` compatibility kept temporarily (read compatibility only) | Save/load now uses canonical gameState money fields | Complete |
| Location stack / current location (`locStack`, `LegacyLocStack`, `LocStack`, `CurrentLocation`) | ADAPT then MOVE | `gameState.CurrentLocation` + typed `LocStack` | `scripts/shims.ts` owns string `locStack`; `scripts/gameState/gameState.ts` owns `LocStack` + `LegacyLocStack`; `scripts/main.ts` synchronizes typed location back into legacy stack | Heavy legacy reads/writes (`pushloc`, `poploc`, `locStack[0]`) across script-style modules; typed writes in `go(...)` via `setCurrentLocation(...)` | `gameState.CurrentLocation -> legacy locStack[0]` adapter only (no reverse authoring) | Save/load should persist canonical typed location identity; legacy stack only transitional | In Progress |
| Bladder thresholds (`blad*`, `yourblad*` vs `Person.bladder*`) | MOVE (simulation) + LEAVE (UI/transient flags) | `gameState.Companion` and `gameState.Player` (`Person`) for threshold/simulation values | `scripts/bladder.ts` and `scripts/yourbladder.ts` define duplicated threshold globals + update functions; `scripts/main.ts` syncs both directions between legacy and `Person`; `scripts/saveLoad.ts` persists both legacy groups | Legacy writes through `updateurge` / `updateyoururge`, direct globals, and setters; typed writes/read via `Person.setUrge(...)` and `person.bladderState` checks | `gameState.Person -> legacy threshold globals` temporary one-way compatibility only | Save/load captures canonical `Player`/`Companion` simulation state; legacy threshold keys removed last | In Progress |

## Concept Cutover Contracts

### 1) Money

- Step 1: Replace gameplay mutations with `gameState.ReceiveMoney(...)` / `gameState.PayAmount(...)` or `gameState.Money = ...` in TS modules.
- Step 2: Keep `setMoney` as compatibility write-through to `gameState.Money` only.
- Step 3: Move save/load key ownership to canonical gameState money fields.
- Exit: no runtime call sites mutate money through legacy-only storage.

Progress notes (2026-04-17):

- [x] Step 1 completed for initial writer slice in `yourHome.ts`, `theBar.ts`, `backPackItems.ts`.
- [x] Step 2 implemented in `shims.ts` (`setMoney`/`setLastmoney` now push into gameState when available).
- [x] Step 3 implemented in `saveLoad.ts` (`money`/`lastmoney` keys bind to gameState).
- [x] Remaining formatting/options reads migrated (`quotes.ts` and `settings.ts` now use gameState-backed money values).

Compatibility decision:

- Keep forward-bridge keys (`money`, `lastmoney`) during location/bladder migration to avoid breaking script-era global consumers.
- Treat them as compatibility aliases only; ownership remains `gameState`.
- Removal trigger: after location row and bladder row are complete, and a grep confirms no functional consumers require legacy money globals except optional debug compatibility wiring.

### 2) Location stack / current location

- Step 1: Keep typed `CurrentLocation` as route authority in `go(...)`.
- Step 2: Restrict legacy `locStack` to mirror current typed location tag for compatibility reads.
- Step 3: Migrate modules using `locStack[0]` to typed category/location predicates.
- Exit: gameplay routing does not depend on `pushloc/poploc` side effects.

### 3) Bladder thresholds

- Step 1: Treat `Person` threshold fields (`bladderUrge`, `bladderNeed`, `bladderEmer`, `bladderLose`, etc.) as canonical.
- Step 2: Convert `updateurge`/`updateyoururge` to compatibility wrappers that delegate into `Person.setUrge(...)`.
- Step 3: Move simulation save/load ownership to `gameState.Player` and `gameState.Companion`.
- Exit: no independent legacy threshold source of truth remains (`blad*` and `yourblad*` are aliases only or removed).

### 4) Deferred Row B fields (partial closure)

#### DrankChamp

- Classification: MOVE
- Canonical owner: `gameState.DrankChamp`
- Write owner: `scripts/fuckHer.ts` via `setDrankChamp(...)` (now writes into `gameState`)
- Save/load owner: `scripts/saveLoad.ts` key `drankChamp` bound to `gameState.DrankChamp`
- Compatibility bridge: window `drankChamp` accessor now reads/writes `gameState.DrankChamp` through `exposeFuckHerOnWindow()`
- Status: Complete

#### CheckedHerOut

- Classification: MOVE
- Canonical owner: `gameState.Interactions.CheckedHerOut`
- Write owner: gameplay writers set `gameState.Interactions.CheckedHerOut` directly (`scripts/actions.ts`, `scripts/drive.ts`)
- Read migration evidence: dark-location checks now read canonical owner in `scripts/locations/theBar.ts`, `scripts/locations/theClub.ts`, `scripts/locations/theatre.ts`, `scripts/locations/theMakeOut.ts`
- Save/load owner: `scripts/saveLoad.ts` key `checkedherout` bound to `gameState.Interactions.CheckedHerOut`
- Compatibility bridge: legacy shim/global `checkedherout` remains as compatibility storage; canonical gameplay logic reads/writes `gameState`
- Status: Complete

#### ChangeVenueFlag

- Classification: MOVE
- Canonical owner: `gameState.Interactions.ChangeVenueFlag`
- Write owner: gameplay writers set `gameState.Interactions.ChangeVenueFlag` directly (`scripts/drive.ts`, `scripts/locations/theClub.ts`, `scripts/locations/theatre.ts`, reset in `scripts/bladder.ts`)
- Read migration evidence: `scripts/bladder.ts` now reads `gameState.Interactions.ChangeVenueFlag` in `showneed(...)`
- Save/load owner: `scripts/saveLoad.ts` key `changevenueflag` bound to `gameState.Interactions.ChangeVenueFlag`
- Compatibility bridge: legacy shim/global `changevenueflag` remains as compatibility storage; canonical gameplay logic reads/writes `gameState`
- Status: Complete

Row B deferred closure note:

- Deferred fields `DrankChamp`, `CheckedHerOut`, and `ChangeVenueFlag` are all canonicalized to `gameState` owners.

## Validation Gate Per Concept

1. `node esbuild.config.mjs`
2. `npx tsc -p . --noEmit`
3. Targeted userflow tests for touched behavior lanes.
4. No new dual-write paths introduced in diff.
