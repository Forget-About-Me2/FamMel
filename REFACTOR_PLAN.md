# FamMel TypeScript Refactor Plan

## Workflow Note

- During refactor work, also suggest updates to this plan: add newly discovered tasks, mark completed/blocked items, append changelog notes for implemented refactors, and call out sequencing or scope changes when the plan is stale.
- When the correct plan update is clear from the refactor work, apply it directly instead of only suggesting it.

## Current State

- ~22 files converted to TypeScript, ~25 JavaScript files remain
- Game HTML loads but crashes when clicking "Start Game"
- Dual architecture: bundled TS modules + script-style TS + raw JS globals
- The bridge between these worlds is broken in multiple places

### Build Architecture

| World | Files | Output |
|-------|-------|--------|
| **Bundle** (IIFE) | `app.ts → shims, main.ts, gameState, gameScreen, settings, models, helpers, yourHome, quotes, pop-up, validation, images, clothes, actions, games/darts, bladder, yourbladder, settings, fuckHer, drive, locations/*, herhome, locations, backPackItems, store, debugMenu` | `dist/app.js` — private scope, selected exports on `window` |
| *(none)* | All script-style TS and JS files have been absorbed into the bundle | |

**Note:** All script-style TS files have been migrated into the bundle as of Phase 3 Batch 2. The `scriptEntryPoints` array in esbuild.config.mjs is now empty.

### Root Causes of Crashes

1. **`gameState.ts` initializes `Companion` at class-field time** using `bladurge` and `girlname` — these are globals from `bladder.js` and `quotes.ts` that may not be set yet depending on load order
2. **`animation.js` duplicates `animationManager.ts`** — both fight over the `#thepic` DOM element
3. **`settings.js` `setup()` and `SettingsManager` both write localStorage** — double initialization
4. **`go()` routing gaps** — functions like `yourHome`, `goStore` are bundled in the IIFE but not exported to `window`, so legacy string-based routing fails
5. **Duplicate state** — `gameState.Money` vs global `money`, `gameState.Attraction` vs global `attraction`, etc. fall out of sync

---

## Phase 0 — Stop Crashing (get the game startable)

### 0a: Lazy-init gameState.Companion
- [x] Move `Companion` and `Player` creation from field initializers into an `init()` method
- [x] Call `init()` from `start()` after settings and globals are loaded
- [x] This prevents crash when `bladurge`/`girlname` don't exist at import time

### 0b: Remove duplicate animation
- [x] Delete `scripts/animation.js`
- [x] Remove its `<script>` tag from `index.html`
- [x] `animationManager.ts` (in the bundle) is the replacement

### 0c: Export missing functions to window in app.ts
- [x] Add `window.yourHome`, `window.goStore`, `window.callHer`, `window.gamestart` exports
- [x] Ensure `go()` can route to them via `resolveLegacyTarget()`

### 0d: Fix settings dual-init
- [x] Remove `setup()` call from `start()` or remove `SettingsManager().readFromLocalStorage()` — keep one
- [x] Decide: keep `settings.js` for now (less disruption) or replace with TS version

---

## Phase 1 — Stabilize Core Loop

### 1a: Verify start → gamestart → yourHome path
- [x] Ensure `start()` loads start.JSON, renders choices, `go("gamestart")` works
- [x] Ensure `yourHome()` renders correctly with listener-based choices
- [x] Fix any missing global state that yourHome.ts expects

### 1b: Fix store.ts goStore conflict
- [x] `store.ts` declares `goStore()` but `globals.d.ts` also declares it
- [x] Resolve: either store.ts exports to window or bundle imports it

### 1c: Sync dual state
- [x] Wire `gameState.Money`/`Attraction`/`Shyness` to keep legacy `money`/`attraction`/`shyness` globals in sync
- [x] Either use getters/setters on gameState that update the globals, or vice versa

---

## Phase 2 — Convert JS → TS (batch by system)

### Batch A: Bladder System (core mechanic)
- [x] `bladder.js` → `bladder.ts` — extract threshold globals into gameSettings or Person
- [x] `yourbladder.js` → `yourbladder.ts`
- [x] Move `bladurge`, `bladneed`, `blademer`, `bladlose` to `Person` — Person is now the authoritative owner; `updateurge()` syncs to Person, `Person.pee()` syncs back to legacy module vars. `bladderThresholds.ts` bridge deleted; TS consumers read `gameState.Companion` directly. ~80 legacy bare-global read sites remain (future Phase 5 cleanup)

### Batch B: Quotes into Bundle
- [x] Move `quotes.ts` from script-style into the bundle (import from main.ts)
- [x] Remove from `esbuild.config.mjs` scriptEntryPoints
- [x] Remove `<script src="dist/quotes.js">` from index.html
- [x] This eliminates the biggest cross-boundary gap

### Batch C: Actions & Interactions
- [x] `actions.js` → `actions.ts`
- [x] `clothes.js` → `clothes.ts`

### Batch D: Location Files
- [x] `drive.js` → `drive.ts`
- [x] `herhome.js` → `herhome.ts`
- [x] `locations.js` → `locations.ts`
- [x] `locations/driveAround.js` → TS
- [x] `locations/theBar.js` → TS
- [x] `locations/theClub.js` → TS
- [x] `locations/theatre.js` → TS
- [x] `locations/theMakeOut.js` → TS

### Batch E: Remaining Systems
- [x] `fuckHer.js` → TS
- [x] `images.js` → TS
- [x] `pop-up.js` → TS (overlap with PopUps/ TS classes — merge)
- [x] `settings.js` → merge into `settingsManager.ts`
- [x] `validation.js` → TS
- [x] `games/darts.js` → TS

---

## Phase 3 — Architecture Cleanup

- [x] Remove function/const/interface/type declares from `globals.d.ts` — only mutable state `declare let`/`declare var` remain (~120 entries)
- [ ] Remove remaining `globals.d.ts` entirely (Phase 5 — when mutable state is absorbed into gameState)
- [x] Move everything into bundle — remove `scriptEntryPoints` from esbuild config
- [x] Remove `shims.js` — move RNG, locStack into proper TS modules
- [x] Replace `eval()` calls in `getjsonT()` with function registry
- [x] Enable `strictNullChecks` in tsconfig.json
- [ ] Eliminate duplicate state (single source of truth per variable)
- [ ] Replace raw bladder threshold comparisons with `BladderState` enum checks — deferred to Phase 5b (needs numeric enum, Player Person object, and state absorption first). See Phase 5b for details
- [x] Replace `javascript:go()` hrefs with delegated data-attribute pattern

### 3b: Replace bare-global functions/constants with ES imports ✓

All cross-module **function** and **constant** references now use proper `import { fn }` statements (~22 consumer files updated). globals.d.ts was rewritten to remove all ~130 function declares, ~10 const declares, all interface/type declares. Only ~120 mutable state `declare let`/`declare var` entries remain, plus 3 window-only function declares.

**Remaining** (Phase 5): Move mutable state into `gameState` object → all modules read/write through `gameState.*` → remaining declares disappear → `globals.d.ts` deleted entirely → `gameState` becomes the single serializable save object.

### 3a: Delegated click handler — eliminate `javascript:` hrefs ✓

Replaced `href="javascript:go(...)"` with `data-action` / `data-action-fn` attributes + document-level event delegation. See changelog below for details.

---

## Phase 5 — Unified Game State & Save System

Goal: all mutable game state lives in a single `gameState` object that can be serialized for save/load.

### 5a: Save/load API ✓

Save/load system implemented in `saveLoad.ts`. Reads ~130 module-scoped variables via `window` property bridges (defineProperty getter/setter), deep-clones objects/arrays, and restores through the same bridge setters. No game logic files changed.

- [x] Add save/load API (`saveToSlot`, `loadFromSlot`, `exportSave`, `importSave`)
- [x] Expose on `window` via app.ts (`saveGame`, `loadGame`, `hasSave`, `deleteSave`, `exportSave`, `importSave`)
- [x] Handle deep-mutable const objects (`backPackItems`, `herpurse`) with deep-merge on load
- [x] Sync `gameState` backing fields from restored globals after load
- [x] Integration tests: save/load round-trip + export/import round-trip

### 5b: Absorb state into gameState (incremental)

Move module-scoped `let` variables into `gameState` properties, updating all references. This removes the need for window bridges and makes `gameState` the canonical runtime source of truth.

#### Bridge connection pattern (established)

`connectToGameState(gs)` in shims.ts sets up two kinds of bridges, called from `start()` after `gameState.init()`:

1. **Forward bridges** (shims-owned variables — money, attraction, shyness, time, etc.): Overrides `window.x` to delegate to `gs.X`. Safe because no module code reads/writes these variables after initialization — all runtime access goes through window.

2. **Reverse bridges** (non-shims module variables — bladder, fuckHer, drive, locations, settings, quotes, images, etc., plus deep fields): Defines `gs.X` as a getter/setter that reads/writes through `window.x`, which still delegates to the module variable via `expose*OnWindow()`. This preserves module code correctness (module writes to its local `let` variable → window getter reads it → gs getter reads window → everything in sync).

#### Absorbed variables

- [x] **First batch** (14 variables): money, attraction, shyness, lastmoney, lastattraction, lastshyness, flirtcounter, randcounter, owedfavor, didintro, haveherpurse, changevenueflag, checkedherout, showedneed — all already had gameState counterparts. Window bridges now delegate to gameState. Removed redundant sync lines from `go()` and `syncGameState()`. Fixed `OwedFavour` from `boolean` to `number` (it's a counter — `+=1`/`-=1` in theatre.ts/bladder.ts; the old `!!` coercion was lossy). Removed global-write from `Money`/`Attraction`/`Shyness` setters (bridge handles it, avoids infinite loop). Updated `incrandom()` to use window bridge instead of module variable.

- [x] **Second batch — shims state** (17 variables): thetime, hour, minute, meridian, late, playerbladder, flirtedflag, noflirtflag, shopping, maxflirts, maxkiss, maxfeel, randmax, clubclosingtime, theaterclosingtime, barclosingtime, timespeed. Added `Time.meridian` computed getter, `Late`, `FlirtedFlag`, `NoFlirtFlag`, `Shopping`, `MaxFlirts`, `MaxKiss`, `MaxFeel`, `RandMax`, `ClubClosingTime`, `TheaterClosingTime`, `BarClosingTime`, `TimeSpeed`, `PlayerBladder` to GameState. Time variables (`thetime`, `hour`, `minute`) bridge to nested `gs.Time.totalTime/hour/minute`. `meridian` is derived from hour (setter is no-op). Removed manual time sync from `syncGameState()` (all bridged now). Removed redundant `thetime`/`hour` sync lines from `go()` in main.ts. Seeded `PlayerBladder` from shims before `connectToGameState()`.

- [x] **Third batch — fuckHer + drive state** (7 variables): arousal, kisscounter, feelcounter, fuckingnow, champagnecounter, drankChamp, wetthecar. Added `Arousal`, `KissCounter`, `FeelCounter`, `FuckingNow`, `ChampagneCounter`, `DrankChamp`, `WetTheCar` to GameState. All bridged via `connectToGameState()` overriding the `exposeFuckHerOnWindow()`/`exposeDriveOnWindow()` bridges. Note: `drankChamp` is dead (written once, never read) — preserved for save compatibility.

- [x] **Fourth batch — location modules** (20 variables): emerBreak, emerHold (locations.ts), gasStation (driveAround.ts), bartopic, loser (theBar.ts), externalflirt, wetPhoto, isNude, posectr, outfitctr (theClub.ts), rrMovieLineThresh, moviecounter, moviechoice, askedfavourite, seenmovie (theatre.ts), askedswim, walkcounter (theMakeOut.ts), prepeed, elevatorwaitcounter, floorcounter (herhome.ts). All bridged via `connectToGameState()`. String vars (`loser`, `moviechoice`) use separate `stringProps` loop.

- [x] **Fifth batch — settings, quotes, backPackItems, images** (21 variables): heroutfit, favoritemovie, suggestedloc, multiplemoves, rstmoves, photoChoice, showstats, enableimages, enableascii, playerGame (settings.ts), pantycolor, girlname, customgirlname, basegirl, girltalk, girlgasp, comma, imageprev (quotes.ts), allowItems, homeChampagne (backPackItems.ts), picset (images.ts). String/any-typed vars use `stringProps` loop. UI-only DOM refs (`previousbtn`, `itemtext`, `curTopicI`) intentionally excluded — not saveable state.

- [x] **Sixth batch — bladder + yourbladder** (68 variables): All 44 bladder.ts state variables (customurge, minurge, minperc, bladurge, bladneed, blademer, bladlose, bladcumlose, bladsexlose, maxtummy, maxbeer, tummy, bladder, bladDec, bladDespDec, seal, beerdecCounter, ybeerdecCounter, peedtowels, peedvase, peedshot, peedoutside, lastpeetime, timeheld, drankbeer, notdesperate, notydesperate, nothdesperate, spurtthresh, yspurtthresh, bribeaskthresh, bribeAskBase, tumavg, rrlockedflag, shespurted, brokeice, sawherpee, wetlegs, wetherpanties, nowpeeing, gottagoflag, askholditcounter, waitcounter, toldstories, lastStory) and all 24 yourbladder.ts variables (yourbladder, yourtummy, yourtumavg, holdself, yourbladurge, yourbladneed, yourblademer, yourbladlose, yourbladcumlose, yourbladsexlose, ymaxtummy, ymaxbeer, yourcustomurge, yminurge, ynowpeeing, ylastpeetime, ytimeheld, ydrankcocktails, ydranksodas, ydrankwaters, ydrankbeers, ydrankbeer, yrrlockedflag, youSpurted). Deep fields (`toldstories`, `lastStory`) bridged via `stringProps` (no-coercion pass-through). Added auto-seeding to `connectToGameState()` — all bridge loops now copy current window value into gameState before overriding, so `setup()` localStorage changes survive. Removed redundant explicit seeding lines from `start()` in main.ts.

- [x] **Seventh batch — deep fields & locStack** (28 variables): Added GameState properties for all remaining DEEP_FIELDS from saveLoad.ts: Settings, StatsBars, EndScreens, LegacyLocStack (shims.ts); SexActions (fuckHer.ts); CalledJsons, LocJson, FlirtResps, FeelUp, Kissing, YPeeLines, PeeLines, Needs, YNeeds, DrinkLines, Appearance, Drive, General, Darts, SexLines, ObjQuotes (quotes.ts); Locations, SharedLoc (locations.ts); Bar, TalkUnused (theBar.ts); Club (theClub.ts); Theatre (theatre.ts); MakeOut (theMakeOut.ts); HerHome (herhome.ts). Reverse-bridged via `connectToGameState()` so `gs.X` reads through `window.x` (which reads the module variable). Module code continues to work with its own `let` variable unimpeded.

- [x] **Bridge direction fix**: Restructured `connectToGameState()` to use two bridge types. Shims-owned variables (21 numeric + 6 bool + 4 time) keep forward bridges (window → gs). Non-shims module variables (68 numeric + 13 string + 31 deep fields) now use reverse bridges (gs → window). This fixes the fundamental disconnect where module code writes its local `let` variable but `window.x` was reading a stale gameState copy. All 34 tests pass.

#### Bridge limitation (resolved)

Module-scoped variables cannot be safely bridged via window property override (forward bridge). The `connectToGameState()` forward pattern overrides `window.x` to delegate to `gs.X`, but module code still reads/writes the local `let` variable directly. This disconnects `window.x` from the module variable.

**Resolution**: Reverse bridges for non-shims variables. Instead of overriding `window.x`, the reverse bridge defines `gs.X` as a getter/setter that reads/writes through `window.x` (which still reads the module variable via `expose*OnWindow()`). Forward bridges are only used for shims.ts-owned variables where no module code accesses them after initialization.

#### Remaining absorption

- [x] Fix non-shims scalar bridges — reverse bridge direction so `gs.X` delegates to `window.x` instead of overriding window (see "Bridge limitation" above)
- [x] Bridge deep fields via reverse bridges — `gs.X` reads through `window.x`

#### Remaining structural work
- [x] Consolidate bedroom location key — standardized to `"theBedroom"` (camelCase). Fixed `"thebedroom"` in yourbladder.ts, removed `BEDROOM_LOCATIONS` workaround array from bladder.ts, inlined `"theBedroom"` directly into `HOME_LOCATIONS`, `NO_RESTROOM_LOCATIONS`, and the `allowpee` check
- [ ] Create Player `Person` object — player currently uses bare globals (`yourbladder`, `yourbladurge`, etc.) with no `Person` instance. Give the player a `gameState.Player` Person so both companion and player share the same bladder API
- [ ] Replace raw bladder threshold comparisons with `BladderState` enum checks (~134 sites across 15 files). Requires: convert `BladderState` to numeric enum for `>=` comparisons; keep a raw-value escape hatch (e.g. `person.Bladder > person.bladderLose - 25`) for ~15 offset comparisons that don't map to a clean enum state. `Person.bladderState` getter already exists; migrate consumer files (actions, backPackItems, fuckHer, herhome, locations/*, store, darts) first, leave bladder.ts/yourbladder.ts internals for last
- [ ] Remove remaining `declare let` from globals.d.ts → delete the file
- [ ] Remove `expose*OnWindow()` bridges (no more bare global reads)
- [ ] Add save/load UI (buttons in game, not just console API)

---

## Phase 4 — Polish & Testing

- [x] Wire up Selenium tests (PickherupTest, RandomSeedDeterminismTest)
- [x] Add smoke test: load game → start → navigate each location
- [x] Add end-to-end test: start game → play through to a win state — `E2E_WinState_FuckNowPauseThroughToGameWon` (injects state at fuckNow, clicks Pause → Continue chain → fuckHer7 → gameWon → asserts "You Won")
- [x] Add end-to-end test: start game → play through to a wet-herself win state — `E2E_WetHerselfWin_FuckNowToGameWet` (injects bladder=800, calls fuckNow, clicks "Keep fucking her" → wetBed → gameWet → asserts "Woot")
- [x] Replace required `document.getElementById(...)` call sites with `document.GetRequiredElementById(...)` where the element is expected to exist; keep nullable lookups only where absence is a valid runtime state (quotes.ts, backPackItems.ts, bladder.ts, settings.ts)
- [x] Replace temporary `any` escape hatches with narrower types — `backPackItems` map restored to `IBackpackItem`; all `!` assertions replaced with proper narrowing (`?? 0`, truthiness checks, optional chaining, local variable extraction)
- [x] Remove jQuery dependency — replaced `$()` radio queries in images.ts with `querySelector`, replaced `$.ajax()` in changeLogPopUp.ts with `fetch()`, removed jQuery from index.html and package.json
- [x] Audit null-fallback strategy: added `assertExists()` helper in helperFunctions.ts. Replaced silent `?? ""` / `?? []` fallbacks with asserting calls at 3 code paths where the property must exist: `giveQuotes` in `giveHer()`, `description` in `selectitem()`, `quote` in `peein2()`. Remaining ~28 `?? 0` / `?? ""` patterns are correct (optional counters, arithmetic guards, defensive DOM access)
- [x] Improve readability of dense functions: `drinkNow()`/`yDrinkNow()`/`drinkTogether()` DRY'd into shared `executeDrink()` helper with `companionRefusesDrink()`, `generateDrinkQuotes()`, `applyDrinkStats()`. `champagneNow()` — extracted `consumeChampagne()` helper, named magic indices via destructuring, named constants (`CHAMPAGNE_VOLUME`, `CHAMPAGNE_GLASSES`, `CHAMPAGNE_MAX_COUNTER`). `giveHer()` — flattened nested else-if, added `MAX_BRIBE_LEVEL` constant. `getAmountOwned()` — extracted `formatChampagneOwned()` helper, named `CHAMPAGNE_HALF_EMPTY_THRESHOLD`. `selectitem()` — extracted `buildItemActions()` helper to flatten 4 levels of nesting to 1, named color constants (`SELECTED_BG_COLOR`, `SELECTED_TEXT_COLOR`), replaced `.forEach(item => str += item)` with `.join("")`. `showneed()` — named 6 magic shyness thresholds as constants (`SHYNESS_ALWAYS_VOCALIZE`, `SHYNESS_EMERGENCY_ASK`, etc.), named wait constants (`WAIT_AFTER_VENUE_CHANGE`, `WAIT_RECENT_THRESHOLD`), extracted `showsRandomSymptom()` to deduplicate identical final branches. `loadLocationScene()`/`locationSetup()` — extracted `resolveWildcards()` helper to replace 6+ manual `replaceWCI`/`replaceWCT` calls with a loop, removed redundant `hasOwnProperty` in dialogue loop, consolidated dialogue replacement with `reduce`. `displayneed()` — collapsed 36-line triplicated if/else into 13 lines using location→prefix mapping (`sit`/`tub`/`""`), named `SEATED_LOCATIONS` constant. `indepee()` — extracted `isBathroomLocked()` helper, moved location arrays to module-level constants (`HOME_LOCATIONS`, `NO_RESTROOM_LOCATIONS`, `OUTDOOR_NO_RESTROOM`), named `DESPERATE_PEE_OFFSET` (was magic `25`), removed unused `homeLocations` variable, eliminated duplicate location checks. `buyItem()` — extracted `addVenueSpecificContent()` and `setupBuyFormListeners()` helpers, documented the `formatList` array structure with per-line comments, named `WET_PANTIES_QUOTE_INDEX` (was magic `3`)
- [x] Clean up dead code: removed unused `pickRandom()`, `randomIndex()`, `shuffle()` from main.ts (duplicates of shims.ts functions). Fixed `wrapAndFormatAll` pre-existing bug (was called but never defined in darts.ts) — implemented in quotes.ts, imported in darts.ts, removed dead `declare` from globals.d.ts. Migrated `createItemButtonList()` from inline `onclick` to delegated `data-select-item` click handler
- [x] Condense refactor changelogs into a concise "current architecture" summary — replaced ~620 lines of per-session changelogs with a compact architecture overview

---

## Execution Priority

| Step | Impact | Risk |
|------|--------|------|
| Phase 0a-0d | **Game starts** | Low — targeted fixes |
| Phase 1a-1c | **Core loop works** | Low-Medium |
| Phase 2B (quotes into bundle) | **Biggest single win** | Medium — many callers |
| Phase 2A (bladder) | Core mechanic works | Medium |
| Phase 2C-E | Incremental | Low per batch |
| Phase 3-4 | Polish | Low |

---

## Current Architecture Summary

This section replaces the per-session changelogs that tracked incremental progress. It describes how the codebase works **now**.

### Build & Bundle

- **Single IIFE bundle**: All TS files are bundled through `scripts/app.ts` → `dist/app.js` (~479kb) via esbuild. No separate script-style outputs remain. `scriptEntryPoints` in esbuild.config.mjs is empty.
- **TypeScript type-checking**: `npx tsc -p . --noEmit` with `strictNullChecks: true`, `noImplicitAny: false`. TypeScript checks types only; esbuild handles compilation.
- **No jQuery**: Replaced with native DOM APIs (`querySelector`, `fetch`).

### Module Bridge Pattern

Every file that was originally a global-scope script now uses an `expose*OnWindow()` function to bridge module-scoped variables to `window`:

```typescript
// Example from bladder.ts — 45 mutable vars, 14 constants, 73 functions
export function exposeBladderOnWindow() {
    const mutableVars = [
        ["bladder", () => bladder, (v) => { bladder = v; }],
        // ...
    ];
    for (const [name, getter, setter] of mutableVars) {
        Object.defineProperty(window, name, { get: getter, set: setter, configurable: true });
    }
    Object.assign(window, { updateurge, wetherself, /* ... */ });
}
```

These bridges serve three purposes:
1. **Legacy compatibility** — ~120 mutable state variables still referenced as bare globals across files via `globals.d.ts` declares
2. **Save/load** — `saveLoad.ts` reads/writes all state through these window getters/setters
3. **Cross-module state sharing** — until variables are absorbed into `gameState` (Phase 5b)

### Click Handling

- **`data-action="target"`** — calls `go(target)` via document-level event delegation (set up by `initDelegatedClickHandler()` in quotes.ts)
- **`data-action-fn="id"`** — calls a registered function from `actionRegistry` (Map of id → callback). `cListener()` and `cListenerRaw()` register callbacks.
- **`data-select-item="key"`** — delegated handler on backpack container for item selection
- **`addListeners()`/`addListenersList()`** — fallback for manually-created HTML (e.g. `buyItem()` store flow) where delegation isn't wired
- **Remaining `onclick` attributes** — radio buttons in `Json/options.JSON` for settings page (large number, separate concern)
- **Zero `javascript:` hrefs** remain in code/JSON

### Game State Architecture

- **`GameState` class** — singleton with `Companion` (Person), `Player` (Person), `Money`, `Attraction`, `Shyness`, location stack. Lazy-initialized via `init()` called from `start()`.
- **`Person` class** — owns bladder thresholds (`_bladderUrge` → computed `bladderNeed/Emer/Lose/CumLose/SexLose`), `bladderState` getter returns `BladderState` enum, `processFluidsDigestion()`, `pee()` with threshold decay + sync
- **Dual state**: `gameState.Money` / `gameState.Attraction` / `gameState.Shyness` have synchronized getters/setters that update legacy globals. Bladder thresholds: Person is authoritative, `updateurge()` syncs to Person, `pee()` syncs back to legacy module vars.
- **Forward bridges** (shims-owned vars): `window.x` delegates to `gs.X`. Used for ~31 shims.ts variables (money, attraction, time, etc.) that are never read/written by module code after initialization.
- **Reverse bridges** (module vars): `gs.X` delegates to `window.x` (which reads module var via `expose*OnWindow()`). Used for ~112 non-shims variables and deep fields. Module code continues writing its local `let` variable; gameState always sees the live value.
- **`globals.d.ts`** — ~120 `declare let`/`declare var` entries remain for mutable state accessed as bare globals. Will be deleted when all state is absorbed into `gameState` (Phase 5b).

### Save/Load System

- **`saveLoad.ts`** — snapshots ~130 variables via window bridge getters, deep-clones objects/arrays, persists to localStorage or JSON export
- **Load** — writes back through window setters, deep-merges const objects (`backPackItems`, `herpurse`), syncs `gameState` backing fields
- **API** — `saveToSlot`/`loadFromSlot`/`hasSave`/`deleteSave`/`exportSave`/`importSave` exposed on window from app.ts

### Testing

- **32 Selenium/NUnit tests** in `UserFlowTests/`:
  - `PickherupTest` — visit her home, pick her up
  - `RandomSeedDeterminismTest` (×2) — seeded RNG produces consistent results
  - `NavigationSmokeTests` (12) — `go()` routing to all locations, goback, chained navigation
  - `SceneIntegrationSmokeTests` (8) — direct scene function invocation
  - `TheMovieTest` — watch a movie, verify scenes
  - `EndgameIntegrationTests` (4) — game over, sex, wet, won end screens
  - `YourHomeIntegrationTests` (3) — gamestart routing, phone call, save/load round-trip

### Key Bugs Fixed During Migration

- **`wrapAndFormatAll`** — called in darts.ts but never defined; implemented in quotes.ts, imported properly
- **`theatre.js` load failure** — `var seenmovie` in shims.js conflicted with `let seenmovie` in theatre.js, silently preventing theatre from loading
- **`formatAll()` semantics** — was passing entire `vars` array to each line instead of per-line values
- **`holdit()` scoping** — destructured variables used in `else` block but defined inside `if` block
- **`flushdrank()` iteration** — `.hasOwnProperty("shedrank")` called on string key instead of object value
- **Recursive recompilation** — old `tsc` setup with `outDir: "./scripts"` created `scripts/scripts/scripts/...`; esbuild outputs to `dist/`

### Readability Improvements

- **Magic index elimination** — replaced numeric array indices across ~15 JS-origin files with named variables via destructuring and index legend comments
- **Drink functions DRY'd** — `drinkNow()`/`yDrinkNow()`/`drinkTogether()` collapsed into `executeDrink(item, mode)` with `doesCompanionRefuseDrink()`, `generateDrinkQuotes()`, `applyDrinkStats()` helpers
- **Dead code removed** — unused `pickRandom()`, `randomIndex()`, `shuffle()` from main.ts (duplicates of shims.ts functions)
