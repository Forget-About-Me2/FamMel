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
- [ ] Move `bladurge`, `bladneed`, `blademer`, `bladlose` to `Person` or `gameSettings`

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

- [ ] Absorb shims state (money, attraction, shyness, time, closing times, etc.)
- [ ] Absorb bladder state (bladder, tummy, thresholds, flags)
- [ ] Absorb yourbladder state
- [ ] Absorb fuckHer state (arousal, counters)
- [ ] Absorb location state (locStack, venue flags, closing times)
- [ ] Absorb flirt/action state (flirtcounter, checkedherout, etc.)
- [ ] Remove remaining `declare let` from globals.d.ts → delete the file
- [ ] Remove `expose*OnWindow()` bridges (no more bare global reads)
- [ ] Add save/load UI (buttons in game, not just console API)

---

## Phase 4 — Polish & Testing

- [x] Wire up Selenium tests (PickherupTest, RandomSeedDeterminismTest)
- [ ] Add smoke test: load game → start → navigate each location
- [x] Replace required `document.getElementById(...)` call sites with `document.GetRequiredElementById(...)` where the element is expected to exist; keep nullable lookups only where absence is a valid runtime state (quotes.ts, backPackItems.ts, bladder.ts, settings.ts)
- [x] Replace temporary `any` escape hatches with narrower types — `backPackItems` map restored to `IBackpackItem`; all `!` assertions replaced with proper narrowing (`?? 0`, truthiness checks, optional chaining, local variable extraction)
- [x] Remove jQuery dependency — replaced `$()` radio queries in images.ts with `querySelector`, replaced `$.ajax()` in changeLogPopUp.ts with `fetch()`, removed jQuery from index.html and package.json
- [ ] Audit null-fallback strategy: some `?? 0` / `?? ""` defaults are correct for genuinely optional counters (e.g. `sheDrank`, `tumInc`), but properties like `description`, `quote`, `giveQuotes` that are expected to exist for any item reaching that code path should throw on absence rather than fail silently — consider a runtime assert helper or making those properties required on sub-interfaces
- [ ] Improve readability of dense functions: many functions (especially in `backPackItems.ts`, `bladder.ts`, `quotes.ts`) pack too much into deeply nested conditionals with inline mutations, making them hard to follow. Break these into smaller named helpers, extract early-return guards, and reduce nesting depth. Good candidates: `selectitem()`, `drinkNow()`/`yDrinkNow()`/`drinkTogether()` (near-identical — DRY into shared helper), `champagneNow()`, `giveHer()`, `buyItem()`, `getAmountOwned()`
- [ ] Clean up dead code
- [ ] Condense refactor changelogs below into a concise "current architecture" summary — the per-session changelogs have grown unwieldy; replace them with a compact overview of how the app works now, what patterns are used (expose bridges, delegated clicks, etc.), and key decisions made during migration

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

## Changelog — Phase 0 Implementation

All 3 Selenium tests (PickherupTest, RandomSeedDeterminismTest ×2) now pass.

### scripts/shims.js
- **Added ~25 missing runtime globals** from original `main.js` that were type-only in `globals.d.ts`: `maxflirts`, `attraction`, `shyness`, `flirtedflag`, `flirtcounter`, `noflirtflag`, `checkedherout`, `haveherpurse`, `owedfavor`, `changevenueflag`, `maxkiss`, `maxfeel`, `randmax`, `clubclosingtime`, `theaterclosingtime`, `barclosingtime`, `timespeed`, `didintro`, `minute`, `meridian`, `lastmoney`, `lastattraction`, `lastshyness`, `settings`, `statsBars`, `showedneed`, `endScreens`, `shopping`, `hour`
- **Removed `seenmovie`** — conflicted with `let seenmovie` in `theatre.js`. The `var`+`let` conflict caused a SyntaxError that silently prevented `theatre.js` from loading, making `theatreSetup` undefined and breaking the `locations` object initialization
- **Fixed `formatAll()`** — was passing the entire `vars` array to each line instead of per-line values; fixed to match original per-line semantics
- **Fixed `formatString()`** — now delegates to `String.prototype.format` matching original behavior

### scripts/yourHome.ts
- **Added `onphone = 1`** in `callHer()` first-visit branch — without this, returning from the phone didn't refresh `locjson` via `locationMSetup`
- **Removed `let shopping = 0`** — moved to `shims.js` as a shared global (needed by both `yourHome.ts` and `store.ts`)

### scripts/store.ts
- **Added `shopping = 1`** inside the location-entry `if` block to match original

### scripts/backPackItems.ts
- **Fixed `standObjs` → `standobjs`** — function was renamed to camelCase during refactoring but all callers use lowercase
- **Fixed return value** — was returning global `curText` (undefined) instead of input parameter `curtext`; caused `addSayText(undefined)` preventing UI rendering
- **Reverted to original `c()` style** instead of broken listener-push style

### scripts/herhome.js
- **Changed `herHomeSetup()` from `getjson` to `getjsonTF`** — `getjson` doesn't cache to `calledjsons`, but `pickup()` needs `calledjsons["herhome"]` via `getMLocations`. Note: this was also a bug in the original FamMel2
- **Fixed duplicate `});` syntax error** introduced during earlier debug edits

### scripts/globals.d.ts
- **Added `declare let shopping: number`**

### UserFlowTests/PickherupTest.cs
- **Changed `FlirtLevel.High` → `FlirtLevel.Medium`** (4 places) — high flirt is never available on the phone (`locStack[0] !== "callher"` condition in `handleFlirt` prevents it)

### From prior session (already applied)
- Restored `Json/yourhome.json` to original 228-line version
- Made `gamestart()` async with `await getjsonTF("yourhome", ...)`
- Added parameterized call support to `go()`
- Added legacy time sync after `nextTick`
- Added `window` exports for `yourHome`, `goStore`, `callHer`, `gamestart`
- Removed duplicate `animation.js`
- Added `Time.toString()` method
- Fixed `globals.d.ts` conflicts with TS declarations
- Changed `MelissaBy.Flirt()` from XPath to Id-based selector

---

## Changelog — Readability Refactor (Magic Index Elimination)

Replaced numeric array indices with named variables across all JS files that access JSON dialogue/narrative data.
Pattern used: destructuring at point of use + inline comments for very large arrays.

### scripts/actions.js
- **`kissher()`**: Destructured `kissing["diag"][0-4]` → `[kissAttempt, kissRejected, kissPleasedResponse, kissReturnedKiss, kissPassionateReturn]`

### scripts/bladder.js (~15 functions)
- **`bathroomlocked()`**: Named `locked["urgency"][0-2]` → `[emergencyReaction, uncomfortableReaction, unfulfilledReaction]`; merged bar/club complaint arrays with `const isBar` + named `[fourthPlusAttempt, thirdAttempt, secondAttempt, firstAttempt]`
- **`indepee()`**: Named `peelines["noneavailable"][0-3]` and `peelines["thehome"][0-2]` with semantic names
- **`askpee()`**: Named `needs["askpee"][0-3]` → `[askQuestion, shyBlush, casualResponse, consideringIt]`
- **`holdit()` area**: Named `needs["holdIt"][0-6]` → `[holdUnsure, holdPhonePanic, holdPhoneLosing, holdPhoneWet, holdPhoneSorry, holdPhoneHangUp, holdRefusal]`
- **`allowpee()`**: Named `needs["allowpee"][0-2]` → `[allowResponse, allowRelief, allowOfferPurse]`
- **`peephone()`**: Added `PHONE_PEE_OPEN=0, PHONE_PEE_PRIVATE=1, PHONE_PEE_HANGUP=2`
- **`peeintub()`**: Named `tubConsent` and `tubRefusal`
- **`peeoutside()`**: Named `outsideRepeat, outsideFirst, outsideRefusal`; added inline comments on all `peeoutside[N]` accesses
- **`wetherself2()`/`wetherself2m()`**: Named `wetHissing, wetPanicMakeOut`
- **`askspurted()`/`checkspurted()`/`smellspurted()`**: Named `askDidYouPee, dontBelieveYou, sniffFingers`
- **`pgirlsroom()`/`pTogether()`**: Added index legend comments and inline comments

### scripts/yourbladder.js (~10 functions)
- **`youpee()`**: Named `ypeelines["thehome"]` → `[askToiletLines, peeDescription]`
- **`youbathroomlocked()`**: Named urgency and complaint arrays (same pattern as bladder.js)
- **`youbegtoilet()`**: Named `ypeelines["beg"]` → `[begDialogue, begChoices]` then `[shotglassChoice, vaseChoice, noIdeasChoice]`
- **`ypeein()`**: Added `URGENCY_MILD=0, URGENCY_MODERATE=1, URGENCY_DESPERATE=2, URGENCY_ALONE=3`; destructured `yneeds[item]` → 7-element tuple with semantic names
- **`ypeein2()`/`ypeein3()`**: Used urgency constants + named result elements
- **`ypeeoutside()` + related**: Added 13-element index legend comment, inline comments on all uses

### scripts/locations.js
- **`lookAround()`**: Named `sharedLoc[loc][0]` → `randomObservations`, `[1]` → `keyDiscoveryText`
- **`itsClosed()`**: Destructured `sharedLoc["itsClosed"]` → `[arrivalLines, emergencyQuote, confirmedClosedLines]`
- **`breakLoc()`**: Destructured `sharedLoc["breakLoc"]` → `[tryingKey, sheRushesPast]`, `sharedLoc["sayHero"]` → `[heroCompliments, heroThanksUrgent]`

### scripts/locations/theBar.js
- **`thebar()`**: Named `bar["theBar"][0-2]` → `[barRevisit, barArrival, barAmbient]`
- **`barTalk()`**: Renamed `cur` → `responseQuality` with comment explaining 1=good, 2=neutral, 3=bad
- **`barResp()`**: Added `GOOD=1, NEUTRAL=2, BAD=3` constants, clarified `choice-1` mapping
- **`darkBar()`**: Named `bar["darkBar"][0-3]` → `[rushesToToilet, stillNeedsToPee, enterClosedBar, darkBarAmbient]`
- **`pdrinkinggame()`**: Named `bar["drinkingGame"][0-7]` → `[gameProposal, needsToPeeFirst, gameRejection, bathroomScene, gameRules, gameStatus, drinkRound, staringWaiting]`; added inline comments on remaining indexed accesses
- **`postgame()`**: Named `postGame[Her|You][0-6]` → `[spurtedOpener, cleanOpener, transition, bothDesperate, sheDesperate, youDesperate, neitherDesperate]`
- **`postGame2()`**: Named `bar["postGame"][0-3]` → `[pgNone, pgHerDesperate, pgYouDesperate, pgBothDesperate]`
- **`holdYourself()`**: Named `bar["holdYourself"][0-2]` → `[sneakHand, holdUnnoticed, holdCaught]`

### scripts/locations/theatre.js
- **`theTheatre()`**: Named `theatre["theatre"][0-2]` → `[theatreRevisit, theatreArrival, theatreAmbient]`
- **`askMovie()`**: Named all `theatre["watchMovie"][0-10]` with full legend comment → `[askFavourite, alreadyWatching, chooseOtherPrompt, youPickPrompt, argueBadFaith, argueSuggestsFavourite, movieStarts, nextScene, movieEnds, sceneMood, preMovieBathroom]`; added inline `// semanticName` comments on remaining uses
- **`movieRomance()`/`movieScary()`/`movieDoh()`**: Destructured `[attempt, success, failure]`
- **`movieSex()`**: Destructured `[attempt, success]`
- **`darkTheatre()`**: Named `theatre["darkTheatre"][0-1]` → `[darkEntry, darkAmbient]`
- **`stealSoda()`**: Named `theatre["stealSoda"][0-1]` → `[firstSteal, stealAnother]`

### scripts/locations/theClub.js
- **`theClub()`**: Named `club["theClub"][0-3]` → `[clubRevisit, clubArrival, clubAmbient, goDanceIntro]`

### scripts/locations/theMakeOut.js
- **`theMakeOut()`**: Named `makeOut["theMakeOut"][0-3]` → `[makeOutArrival, attractionLow, makeOutAmbient, makeOutRejection]`
- **`viewStars()`**: Named `makeOut["viewStars"][0-2]` → `[stargazing, herBladderCold, yourBladderCold]`
- **`theWalk()`**: Named `makeOut["theWalk"][0-5]` → `[walkStart, walkAmbient, gateExamine, gateLocked, gateInviting, gateToBeach]`
- **`theYard()`**: Named `makeOut["theYard"][0-6]` → `[yardEntry, yardAmbient, yardDesc, tubWilling, tubRefused, tubEntry, tubAmbient]`
- **`theBeach()`**: Added 22-element index legend comment (0-21); destructured first 3 elements; added `// semanticName` inline comments on all remaining indexed accesses

### scripts/locations/driveAround.js
- **`driveAround()`**: Named `driveRound["driveAround"][0-1]` → `[drivingNarration, gasStationSpotted]`

### scripts/drive.js
- **`leavehm()`**: Added `// choices: [0]=hold it, [1]=let her go, [2]=let's go` comments on `printChoicesList` calls

### scripts/games/darts.js
- **`playDarts()`**: Named `darts["play"][0-2]` → `[firstPlay, replayIntro, gameSetup]`
- Added structural comment for dart score result tuples: `[throws, totalScored, remainingPoints]`

### scripts/fuckHer.js
- **`fuckHerSetup()`**: Added `// intro: [0]=first-time intro variants, [1]=returning intro` comment
- **`haveSex()`**: Named `sexQuotes["intro"][0-1]` → `[firstIntroVariants, returningIntro]`
- **`takeOff()`**: Destructured `clothesInfo` tuple → `[prerequisite, bladderCheck, failMode]`; added `// sexLines["clothes"][item][i]: [baseText, desperateText, normalText, extraText]` comment; added inline `// semanticName` on all indexed accesses
- **`performAction()`**: Destructured `arousalInfo` tuple → `[prerequisite, arousalBonus, bladderCheck]`; added `// sexLines["actions"][action][i]: [baseText, desperateText, normalText, wetPantiesText, bladderLoseExtraText]` comment; added inline semantic comments

### Not refactored (out of scope)
- **`settings.js` `vars[]` arrays** — positional template slots for HTML form rendering; would require restructuring the template system

---

## Changelog — Continuing Refactor (2026-03-08)

### scripts/gameState/gameState.ts
- **Moved `Player`/`Companion` creation into `init()`** and made it idempotent
- **Switched legacy global reads to `globalThis`** with safe defaults (`bladurge` fallback, `girlname` fallback) so module import no longer crashes when globals are not yet initialized
- **Added synchronized getters/setters for `Money`, `Attraction`, and `Shyness`** so typed state updates legacy globals automatically
- **Now reads companion bladder urge via shared threshold bridge** (`getLegacyBladderThresholds`) instead of direct ad-hoc global parsing

### scripts/gameState/bladderThresholds.ts
- **Added typed legacy-threshold bridge** with stable defaults and derived values for `urge`, `need`, `emergency`, `lose`, `cumLose`, `sexLose`
- **Purpose**: prepare Batch A migration by centralizing threshold reads in TS without changing JS gameplay behavior yet

### scripts/main.ts
- **Removed `SettingsManager().readFromLocalStorage()` from `start()`** to avoid dual settings initialization with `settings.js` `setup()`
- **Added `gameState.init()` in `start()` after `setup()`**, ensuring companion/player are created only after legacy globals are loaded
- **Moved `animationManager.start()` to run after `setup()` + `gameState.init()`** so first animation tick cannot access an uninitialized companion
- **Added defensive `gameState.init()` at start of `go()`** for safety if routing is invoked early
- **Exported `gamestart()`** so it can be registered explicitly on `window` from the bundle entry
- **Synced typed `gameSettings.PlayerBladder` from legacy `playerbladder`** after `setup()`
- **Added startup + tick sync from legacy globals into typed state** for `money`, `attraction`, and `shyness`
- **Hardened `resolveLegacyTarget()` with case-insensitive global lookup** so legacy string routing works across mixed casing (`yourHome`/`yourhome`, etc.)

### scripts/gameScreen/animationManager.ts
- **Hardened animation tick path against uninitialized game state** by using safe fallbacks when `gameState.Companion` is not ready
- **Added legacy bladder-state fallback mapping** (`bladder`/`bladurge`/`bladneed`/`blademer`/`bladlose`) for startup safety in image/ascii rendering
- **Switched fallback mapping to shared threshold bridge** so legacy threshold logic is centralized across TS modules

### scripts/yourHome.ts
- **Switched phone/hold-state threshold checks to shared threshold bridge** (`urge`, `need`, `emergency`) for Batch A preparation

### scripts/main.ts
- **Switched companion emergency check in `go()` to shared threshold bridge** (`thresholds.emergency`) for consistency with other TS modules

### UserFlowTests/DriverExtensions.cs
- **Added `DismissDisclaimerPopupIfPresent()`** to centralize and harden startup popup handling for Selenium flows

### Selenium test startup refactor
- **Replaced direct `ClickWhenInteractable(By.Id("close-pop-up"))` calls** with `DismissDisclaimerPopupIfPresent()` across Pickherup, TheMovie, YourHome integration, Scene smoke, and Endgame integration tests
- **De-flaked `IncomingPhoneCall_AnswerPath_ShowsCantWaitDialogue_WithoutErrors`** by removing brittle keyword matching while keeping dialogue-render and runtime-error assertions
- **Validation**: full `UserFlowTests` suite passes (`18/18` non-explicit tests)

### UserFlowTests/YourHomeIntegrationTests.cs
- **Added `GoGamestart_RoutesToYourHome_AndRendersChoices`** to verify `go("gamestart")` path transitions to `yourhome`, renders text, and stays runtime-error free

### scripts/app.ts
- **Added explicit bundle exports**: `window.yourHome`, `window.callHer`, `window.gamestart`
- **Added `window.goStore` alias** from existing lowercase `window.gostore` registration

### scripts/yourHome.ts
- **Exported `callHer()`** for bundle-level global registration

### scripts/animation.js
- **Deleted duplicate legacy animation script** (now only `animationManager.ts` drives picture animation)

### scripts/quotes.ts
- **No remaining `eval()` call sites** (legacy `getjsonT`/`getjsonTF` eval-style path has been retired in favor of explicit JSON helpers like `fetchAndCacheJson`, `loadLocationScene`, and `locationSetup`)

---

## Changelog — Phase 2 Batch B: Quotes into Bundle (2026-03-26)

Moved `quotes.ts` from script-style output (`dist/quotes.js`) into the app bundle (`dist/app.js`) while keeping legacy script-style callers working.

### scripts/quotes.ts
- **Converted to module exports** for quote state/functions used by bundled code (`main.ts`) and by legacy scripts via window exposure
- **Added `exposeQuotesOnWindow()` bridge** with getter/setter-backed window properties so module-scoped state stays synchronized with legacy global reads/writes
- **Moved early `yneeds` load into `setupQuotes()`** so quote-related startup data is loaded in one place
- **Kept legacy runtime behavior** by exposing helper functions used by script-style files (`callChoice`, `printListSelection`, `printLList`, `addListenersList`, `printAllChoicesList`, etc.)

### scripts/app.ts
- **Imported and initialized quotes bridge** via `exposeQuotesOnWindow()` during bundle startup
- **Kept legacy route aliasing** (`goStore`) compatible after startup initialization

### scripts/main.ts
- **Switched to direct imports from `quotes.ts`** for startup and scene rendering helpers (`setupQuotes`, `fetchAndCacheJson`, `locationSetup`, `printAllChoices`, `sayText`, `printList`, `setText`)
- **Removed duplicate top-level `yneeds` fetch path** now handled by `setupQuotes()`

### esbuild.config.mjs
- **Removed `scripts/quotes.ts` from `scriptEntryPoints`** so it no longer emits `dist/quotes.js`

### index.html
- **Removed `<script src="dist/quotes.js">`**
- **Loaded `dist/app.js` before script-style TS files** so bridge globals are available for parse-time references (notably `locations.ts` top-level `fetchJson(...)`)

### scripts/globals.d.ts
- **Updated declarations for quotes-owned globals/functions** to reflect bundle-exposed API instead of script-style implicit scope

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes
- **Build**: `node esbuild.config.mjs` emits bundle + script outputs successfully
- **Tests**: `dotnet test` (UserFlowTests) passes (`18/18` non-explicit tests)

---

## Changelog — Phase 2 Batch A: Bladder System (2026-03-26)

Converted `bladder.js` and `yourbladder.js` to script-style TypeScript. All 18 Selenium tests pass.

### scripts/bladder.ts (was bladder.js)
- **Added type annotations** to all 50+ function signatures (parameter types, return types)
- **Fixed scoping bug in `holdit()`** — destructured `[holdPhoneSorry, holdPhoneHangUp, holdRefusal]` was inside the `if` block but referenced in the `else` block; moved destructuring before the conditional
- **Fixed `flushdrank()` `Object.keys` bug** — was calling `.hasOwnProperty("shedrank")` on the string key instead of the object value; now iterates values correctly
- **Fixed missing arg in `noToiletPee()`** — `cListenerGen()` was called with 1 arg instead of 2
- **Added explicit `let nowpeeing = 0`** declaration (was previously an implicit global)
- **Changed `var object` → `let object`** in `peein()`

### scripts/yourbladder.ts (was yourbladder.js)
- **Added type annotations** to all 26 function signatures
- **Added explicit `let yminurge`** declaration (was previously an implicit global via assignment in `initYUrge`)
- **Added explicit `let ynowpeeing = 0`** declaration (was previously an implicit global)

### esbuild.config.mjs
- **Added `bladder.ts` and `yourbladder.ts`** to `scriptEntryPoints` array

### index.html
- **Changed script paths** from `scripts/bladder.js` → `dist/bladder.js`, `scripts/yourbladder.js` → `dist/yourbladder.js`

### scripts/globals.d.ts
- **Removed `declare` blocks** for bladder.js and yourbladder.js variables and functions (now defined in TS files and visible to the compiler directly)
- **Added `declare` statements** for JS-file globals newly referenced by TS: `externalflirt`, `rrMovieLineThresh`, `gasStation`, `wetthecar`, `owedfavor`, `changevenueflag`, `theatre`, `playerbladder`, `haveherpurse`, `prepeed`, `doDance`, `kissher`, `theHotTub`, `theMakeOut`, `pphotogame`, `pdrinkinggame`, `nextstop`

---

## Changelog — Phase 3 Batch 1: Tier 1 Files into Bundle (2026-03-26)

Moved 6 "leaf" script-style TS files into the app bundle using the same `expose*OnWindow()` bridge pattern as quotes.ts. These files had no dependencies on other script-style files, making them safe to migrate first.

### Files migrated: pop-up.ts, validation.ts, images.ts, clothes.ts, actions.ts, games/darts.ts

### scripts/pop-up.ts
- **Converted to module** with `export` on `openPopUp`, `setErrorPopup`, `copyErrorText`
- **Added `exposePopUpOnWindow()` bridge** to register functions on `window` for script-style callers and HTML event handlers

### scripts/validation.ts
- **Converted to module** with `export` on `validateListenerList`
- **Added `exposeValidationOnWindow()` bridge** — quotes.ts references this as a global

### scripts/images.ts
- **Converted to module** with `export` on `displaypix`, `explainimgs`, `importimgs`, `imgs`, `picset`
- **Added `exposeImagesOnWindow()` bridge** with getter/setter for mutable `picset` state

### scripts/clothes.ts
- **Converted to module** with `export` on `changepanties`
- **Added `exposeClothesOnWindow()` bridge** — called from JSON routing via `go()`

### scripts/actions.ts
- **Converted to module** with `export` on `flirt_l`, `flirt_m`, `flirt_h`, `checkherout`, `feelup`, `kissher`
- **Added `exposeActionsOnWindow()` bridge** — location files reference these as globals

### scripts/games/darts.ts
- **Converted to module** with `export` on `dartSetup`, `playDarts`, `dartRound`, `playedDarts`
- **Added `exposeDartsOnWindow()` bridge** — `dartSetup` called from quotes.ts JSON load callback
- **Note:** `wrapAndFormatAll` is called but never defined (pre-existing bug); kept `declare` in globals.d.ts

### scripts/app.ts
- **Added imports and calls** for all 6 `expose*OnWindow()` bridges after `exposeQuotesOnWindow()`

### scripts/gameScreen/PopUps/popUp.ts
- **Added direct import** of `openPopUp` from `../../pop-up` — replaces implicit global reference now that both are in the bundle

### esbuild.config.mjs
- **Removed 6 files** from `scriptEntryPoints`: actions.ts, clothes.ts, images.ts, pop-up.ts, validation.ts, games/darts.ts

### index.html
- **Removed 6 `<script>` tags**: dist/actions.js, dist/clothes.js, dist/images.js, dist/pop-up.js, dist/validation.js, dist/games/darts.js

### scripts/globals.d.ts
- **Added `declare` statements** for functions newly needed by script-style callers: `playDarts`, `dartRound`, `displaypix`, `explainimgs`, `importimgs`, `picset`, `openPopUp`, `setErrorPopup`, `copyErrorText`, `changepanties`, `checkherout`, `feelup`, `kissher`
- **Updated comments** to reflect bundle-vs-script-style status

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes
- **Build**: `node esbuild.config.mjs` emits bundle (238.7kb) + script outputs successfully
- **Tests**: `dotnet test` (UserFlowTests) passes (18/18 non-explicit tests)

---

## Changelog — Phase 3a: Delegated Click Handler (2026-03-27)

Replaced `javascript:go()` hrefs with `data-action` attributes and converted the listener-based choice system to use a centralized action registry with document-level event delegation. All 18 Selenium tests pass.

### scripts/quotes.ts
- **Added `actionRegistry` Map** + `nextActionId()` counter for registering function-based click callbacks
- **Added `clearActionRegistry()`** — called by `sayText()` and `setText()` on screen refresh to GC stale closures
- **Added `initDelegatedClickHandler()`** — single `document`-level click listener handles both `data-action` (calls `go()`) and `data-action-fn` (calls registered function)
- **Changed `c()`** to emit `<a href="#" data-action="target">` instead of `<a href="javascript:go('target')">`
- **Changed `cListener()`** to register function in `actionRegistry` and emit `<li data-action-fn="id">` — no longer requires post-render `addEventListener`
- **Added `cListenerRaw()`** — variant that registers callback directly (no `go()` wrapper), used when `listenerList` item has `false` as third element
- **Changed `cListenerGen()`** — simplified to just call `cListener()` (no separate `addListeners` call needed)
- **Changed `cListenerGenList()`** — routes to `cListener()` or `cListenerRaw()` based on third element; no longer calls `addListenersList()`
- **Kept `addListeners()` / `addListenersList()` functional** — needed for external callers (e.g. `backPackItems.ts` `buyItem()`) where HTML is generated manually without `cListener`; skips elements that already have `data-action-fn`

### scripts/app.ts
- **Imported `initDelegatedClickHandler`** from quotes.ts
- **Called `initDelegatedClickHandler()`** at bundle startup (before DOMContentLoaded — document-level delegation works immediately)

### Key design decisions
- **Delegation on `document`** not `#textsp` — `#textsp` is created dynamically by ContentScreen, so it may not exist at bundle startup time
- **`data-action-fn` on `<li>` not nested `<a>`** — Selenium tests use `By.Id()` which targets the `<li>` element; `.closest()` searches UP the DOM, not down to children
- **`addListeners`/`addListenersList` kept functional** — `buyItem()` in backPackItems.ts creates `<li id="buy">` manually and relies on `addListenersList` to attach the handler; making it a no-op broke the store buy flow

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits bundle (239.8kb) + script outputs successfully
- **Tests**: `dotnet test` (UserFlowTests) passes (18/18 non-explicit tests)

---

## Changelog — Phase 3 Batch 2: All Script-Style Files into Bundle

Migrated all 15 remaining script-style TS files into the esbuild IIFE app bundle. The `scriptEntryPoints` array is now empty — every TS file is bundled through `app.ts`. All 18 Selenium tests pass.

### Pattern used for each file:
1. Added `export` keyword to all top-level `let`, `const`, and `function` declarations
2. Added `expose*OnWindow()` bridge function with getter/setter for mutable `let` variables and `Object.assign` for constants and functions
3. Imported expose function in `app.ts` and called it after Tier 1 exposes

### Files migrated (15 total):

**Core game systems:**
- **scripts/bladder.ts** — 45 mutable variables, 14 constants, 73 functions. Largest expose function in the project.
- **scripts/yourbladder.ts** — 24 mutable variables, 1 constant, 27 functions.
- **scripts/settings.ts** — 7 mutable variables, 26 functions.
- **scripts/fuckHer.ts** — 7 mutable variables, 21 functions.
- **scripts/drive.ts** — 1 mutable variable, 2 functions.

**Location files:**
- **scripts/locations/driveAround.ts** — 1 mutable variable, 7 functions. Added `import { fetchJson } from '../quotes'`.
- **scripts/locations/theBar.ts** — 5 mutable variables, 18 functions. Added `import { fetchJson } from '../quotes'`.
- **scripts/locations/theClub.ts** — 6 mutable variables, 15 functions. Added `import { fetchJson } from '../quotes'`.
- **scripts/locations/theatre.ts** — 6 mutable variables, 17 functions. Added `import { fetchJson } from '../quotes'`.
- **scripts/locations/theMakeOut.ts** — 3 mutable variables, 25 functions. Added `import { fetchJson } from '../quotes'`.

**Higher-level systems (depend on location files):**
- **scripts/herhome.ts** — 4 mutable variables, 14 functions. Added `import { fetchJson, fetchAndCacheJson } from './quotes'`.
- **scripts/locations.ts** — 4 mutable variables, 8 functions. Added `import` for all 6 setup functions + `fetchJson`/`formatAllVarsList` from quotes.
- **scripts/backPackItems.ts** — 4 mutable variables, 5 constants, 26 functions.
- **scripts/store.ts** — 1 function (`goStore`).
- **scripts/debugMenu.ts** — IIFE `Debug` object + 17 helper functions.

### scripts/locations.ts — critical import addition
- **Added ES module imports** for `driveAroundSetup`, `theBarSetup`, `theClubSetup`, `theatreSetup`, `makeOutSetup`, `herHomeSetup`, `fetchJson`, `formatAllVarsList`
- Previously these were globals from separate `<script>` tags; now they must be explicit module imports since the file is bundled

### scripts/locations/*.ts, herhome.ts — fetchJson imports
- **Added `import { fetchJson }` from quotes.ts** to all 6 files that call `fetchJson()` in their setup functions
- Without this, the setup functions would reference `window.fetchJson` which isn't set yet during IIFE initialization

### scripts/app.ts
- **Added 15 new imports** for all `expose*OnWindow()` bridges
- **Added 15 expose calls** in correct dependency order (bladder → yourbladder → settings → fuckHer → drive → locations/* → herhome → locations → backPackItems → store → debugMenu)
- **Removed stale `DOMContentLoaded` goStore alias listener** — store is now in the bundle

### esbuild.config.mjs
- **Emptied `scriptEntryPoints` array** — all 15 entries removed

### index.html
- **Removed 16 `<script>` tags** (15 dist/*.js files + debug menu)
- **Updated comment** to reflect "all TS files bundled via app.ts"

### scripts/globals.d.ts
- **Added ~180 `declare` statements** for all variables/functions/constants from the 15 migrated files
- **Fixed 11 function signatures** to match actual code: `interpbladder`, `preventpee`, `standobjs`, `itsClosed`, `haveSex`, `indepee`, `peein`, `ypeein`, `giveHer`, `showneed`, `displaygottavoc`
- **Added `IBackpackItem` and `IDrink` interface declarations** for cross-file references

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits single bundle (465.4kb) — no separate script outputs
- **Tests**: `dotnet test` (UserFlowTests) passes (18/18 non-explicit tests)

---

## Changelog — Phase 3: Absorb shims.js into Bundle

Converted `shims.js` (the last remaining `<script>`-loaded file) into a TS module within the app bundle. All global state variables, RNG system, and utility functions now live in `scripts/shims.ts` with the standard `exposeShimsOnWindow()` bridge.

### scripts/shims.ts (NEW — replaces shims.js)
- **35 mutable state variables** with typed exports: `locStack`, `money`, `thetime`, `hour`, `minute`, `meridian`, `late`, `playerbladder`, `attraction`, `shyness`, `flirtedflag`, `flirtcounter`, `noflirtflag`, `checkedherout`, `haveherpurse`, `owedfavor`, `changevenueflag`, `shopping`, `maxflirts`, `maxkiss`, `maxfeel`, `randmax`, `clubclosingtime`, `theaterclosingtime`, `barclosingtime`, `timespeed`, `didintro`, `lastmoney`, `lastattraction`, `lastshyness`, `settings`, `statsBars`, `showedneed`, `endScreens`, `randcounter`
- **Seedable RNG system**: `setRandomSeed()`, `clearRandomSeed()`, `getRandomSeed()`, `gameRandom()`, `randomInt()` — identical LCG implementation with `?seed=` URL param support for deterministic Selenium tests
- **Utility functions**: `pushloc()`, `poploc()`, `randomchoice()`, `incrandom()`, `pickrandom()`, `randomIndex()`, `range()`, `formatString()`, `formatAll()`, `printDialogue()`, `randomize()`
- **Added `randomize()` implementation** (Fisher-Yates shuffle) — was declared in globals.d.ts but never defined (pre-existing bug)
- **`printDialogue()` uses `(window as any).locjson`** to avoid circular dependency with quotes.ts
- **Self-invoking bridge**: `exposeShimsOnWindow()` is called at module load time (bottom of file) so window globals are available before any other module in the bundle initializes

### scripts/app.ts
- **Added `import { exposeShimsOnWindow } from './shims'`** as first import
- **Called `exposeShimsOnWindow()`** as first bridge call (idempotent with self-invocation)

### index.html
- **Removed `<script src="scripts/shims.js">` tag** — shims are now part of the bundle

### scripts/globals.d.ts
- **Updated section comments** to reflect shims.ts source (was "from shims.js")
- **Kept `declare` statements** — still needed because bundled modules reference shims globals as bare names (resolved through window at runtime)

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits single bundle (472.5kb)
- **Tests**: `dotnet test` (UserFlowTests) passes (18/18 non-explicit tests)

---

## Changelog — Phase 3b: Replace Bare-Global Functions/Constants with ES Imports

Replaced all cross-module bare-global function and constant references with proper ES `import` statements across ~22 consumer files. Rewrote `globals.d.ts` to remove all function/const/interface/type declares — only mutable state remains. All 18 Selenium tests pass.

### Import additions (~22 files)

Every bundled TS module now imports the functions and constants it uses directly from their source modules, rather than relying on `window` globals set by `expose*OnWindow()` bridges. Examples of the heaviest importers:

- **scripts/bladder.ts** — 8 import lines: quotes (13 functions + voccurse), shims (8 functions), backPackItems (5 functions), driveAround (nextstop), theBar (pdrinkinggame), theClub (doDance, pphotogame), yourbladder (displayyourneed), actions (kissher)
- **scripts/herhome.ts** — 8 import lines: quotes (9 functions), shims (5 functions), bladder (8 functions), yourbladder (3 functions), backPackItems (3 functions), drive (leavehm), actions (kissher), fuckHer (theBedroom), main (gameOver)
- **scripts/locations/theBar.ts** — 9 import lines: quotes (9 functions), shims (6 functions), bladder (11 functions/constants), yourbladder (5 functions/constants), backPackItems (4 functions/constants), actions (3 functions), games/darts (playDarts), drive (2 functions), locations (2 functions)
- **scripts/backPackItems.ts** — 7 import lines: quotes (15 functions), shims (4 functions), bladder (5 functions), yourbladder (ypeein), pop-up (openPopUp), theBar (sellPanties), theClub (flirtBarGirl)

Other files with new imports: validation.ts, clothes.ts, images.ts, drive.ts, store.ts, actions.ts, games/darts.ts, settings.ts, fuckHer.ts, yourbladder.ts, debugMenu.ts, main.ts, yourHome.ts, locations.ts, driveAround.ts, theClub.ts, theatre.ts, theMakeOut.ts, gameScreen/animationManager.ts, gameState/gameState.ts, gameState/Person.ts, helperFiles/helperFunctions.ts

### scripts/main.ts
- **Exported 4 functions**: `gameOver()`, `gameSexBoth()`, `gameWet()`, `gameWon()` — previously local, needed by fuckHer.ts and herhome.ts

### scripts/locations/theMakeOut.ts
- **Fixed pre-existing type error**: `let rand: number | boolean = 1;` (randomchoice returns boolean, was assigned to number var)

### scripts/globals.d.ts — rewritten
- **Removed all ~130 `declare function` entries** — now imported directly via ES modules
- **Removed all ~10 `declare const` entries** — now imported directly
- **Removed `String` interface augmentation** — now `declare global` in quotes.ts
- **Removed `IBackpackItem` and `IDrink` interface declarations** — now exported from backPackItems.ts
- **Removed `declare type person`** — now local type in debugMenu.ts
- **Kept ~120 `declare let`/`declare var` entries** for mutable state variables shared via window bridges
- **Kept 3 window-only function declares**: `cellphone` (local in yourHome.ts, exposed on window), `wrapAndFormatAll` (pre-existing bug, never defined), `GetRequiredElementById` (Document prototype extension)

### Key discovery
- **`pphotogame` is exported from theClub.ts**, not theBar.ts — initial analysis was wrong, caught via typecheck

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits single bundle (472.1kb)
- **Tests**: `dotnet test` (UserFlowTests) passes (18/18 non-explicit tests)

---

## Changelog — Phase 5a: Save/Load API

Added a save/load system that snapshots and restores all ~130 module-scoped mutable state variables via the existing `window` property bridges. Zero changes to game logic files. All 20 Selenium tests pass (18 existing + 2 new).

### scripts/saveLoad.ts (NEW)
- **`createSave()`** — reads all window-exposed state via defineProperty getters, deep-clones objects/arrays, returns a plain serializable object with version and timestamp
- **`loadSave(save)`** — writes all state back through window setters (which update module-scoped lets), deep-merges const objects (`backPackItems`, `herpurse`), syncs `gameState` backing fields
- **`saveToSlot(slot)`** / **`loadFromSlot(slot)`** — localStorage persistence (key: `fammel_save_{slot}`)
- **`hasSave(slot)`** / **`deleteSave(slot)`** — slot management
- **`exportSave()`** / **`importSave(json)`** — file-based save/load via JSON strings
- **Field coverage**: 93 scalar fields (SIMPLE_FIELDS), 25 deep-clone fields (DEEP_FIELDS), 2 const-object fields (`backPackItems`, `herpurse`)
- **`syncGameState()`** — reverse-syncs gameState's private backing fields (Money, Attraction, Shyness, Time, DidIntro, FlirtCounter, etc.) from restored window globals

### scripts/app.ts
- **Added imports** from saveLoad.ts
- **Exposed on window** as `saveGame`, `loadGame`, `hasSave`, `deleteSave`, `exportSave`, `importSave`

### UserFlowTests/YourHomeIntegrationTests.cs
- **`SaveAndLoad_PreservesGameState_WithoutErrors`** — saves game, modifies money/attraction, loads save, verifies values restored and gameState synced
- **`ExportAndImport_RoundTrips_WithoutErrors`** — exports JSON, modifies money, imports JSON, verifies restored

### Design decisions
- **Window bridges as the save/load mechanism** — all `expose*OnWindow()` bridges use `Object.defineProperty` with getter/setter pairs that read/write the module-scoped lets. This means reading `window.X` returns the current module value, and writing `window.X = v` updates the module variable. No game logic changes needed.
- **JSON caches saved too** — dialogue data (`bar`, `club`, etc.) and `calledjsons` are included so restore doesn't require async re-fetches
- **Const objects use deep-merge** — `backPackItems` and `herpurse` are `export const` (exposed via `Object.assign`, not `defineProperty`), so the module reference can't be replaced. `deepMerge` clears and repopulates the existing object.

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits single bundle (479.0kb)
- **Tests**: `dotnet test` (UserFlowTests) passes (20/20 non-explicit tests)

---

## Changelog — Phase 3: strictNullChecks Enabled

Enabled `strictNullChecks` in tsconfig and fixed compile errors across the migrated TS bundle. Typecheck now passes with strict null checking on.

### tsconfig.json
- **Enabled** `"strictNullChecks": true`

### Broad cleanup strategy
- Added explicit array typings (`any[]`) where empty arrays previously inferred as `never[]`
- Added targeted null guards/non-null assertions around required DOM elements used by legacy UI code
- Added optional-value guards for item/drink counters (e.g. `x = (x ?? 0) + n`)
- Kept migration-safe typing in legacy-heavy item maps by loosening `backPackItems` map values to `any` during transition; this should be treated as temporary refactor debt and narrowed again once the remaining item-shape access is cleaned up

### Main files updated for strict-null compatibility
- `scripts/actions.ts`
- `scripts/backPackItems.ts`
- `scripts/bladder.ts`
- `scripts/clothes.ts`
- `scripts/drive.ts`
- `scripts/fuckHer.ts`
- `scripts/games/darts.ts`
- `scripts/herhome.ts`
- `scripts/images.ts`
- `scripts/locations.ts`
- `scripts/locations/driveAround.ts`
- `scripts/locations/theBar.ts`
- `scripts/locations/theClub.ts`
- `scripts/locations/theMakeOut.ts`
- `scripts/locations/theatre.ts`
- `scripts/pop-up.ts`
- `scripts/quotes.ts`
- `scripts/settings.ts`
- `scripts/validation.ts`
- `scripts/yourHome.ts`
- `scripts/yourbladder.ts`

- **Tests**: `dotnet test` (UserFlowTests) passes (20/20 non-explicit tests)

---

## Changelog — Phase 4: Polish (GetRequiredElementById, IBackpackItem, jQuery Removal)

### GetRequiredElementById migration
Replaced `document.getElementById(...)!` with `document.GetRequiredElementById<T>(...)` at all call sites where the element is expected to exist at runtime:
- **scripts/quotes.ts** — 5 sites (`textsp` lookups in `sayText`, `addSayText`, `setText`, `cListener`, `addListeners`)
- **scripts/backPackItems.ts** — 15 sites (inventory UI elements, volume displays, item containers)
- **scripts/bladder.ts** — 1 site (`popup-close` button)
- **scripts/settings.ts** — 5 sites (input elements for custom names, bladder settings, money)

### backPackItems typing tightened
- Restored `backPackItems` map type from `{ [key: string]: any }` back to `{ [key: string]: IBackpackItem }`
- Fixed 48 strict-null errors caused by optional properties on `IBackpackItem`:
  - Added `!` assertions after `hasOwnProperty()` guards (TS doesn't narrow from these)
  - Added `?? 0` fallbacks for arithmetic on optional counters (`sheDrank`, `youDrank`, volume)
- Fixed 3 related errors in `bladder.ts` (container volume access, backpack item quote access)

### jQuery removed
- **scripts/images.ts** — Replaced 2 `$("input[name=imgtype]:checked").val()` calls with `document.querySelector<HTMLInputElement>(...)?.value ?? ""`
- **scripts/gameScreen/PopUps/changeLogPopUp.ts** — Replaced `$.ajax()` with native `fetch()` API
- **index.html** — Removed jQuery CDN `<script>` tag
- **package.json** — Removed `jquery` and `@types/jquery` from dependencies

### Validation
- **Typecheck**: `npx tsc -p . --noEmit` passes (0 errors)
- **Build**: `node esbuild.config.mjs` emits bundle (480.0kb)
- **Tests**: `dotnet test` (UserFlowTests) passes (20/20 non-explicit tests)
