# FamMel — Component Inventory

**Generated:** 2026-04-20

This document catalogs the major TypeScript modules, their responsibilities, and their public interfaces. "Component" here means a cohesive module, not a UI component framework component.

---

## Entry Points & Orchestration

| Module | File | Responsibility |
|--------|------|---------------|
| **app.ts** | `scripts/app.ts` | Bundle entry point. Imports all modules, calls `exposeXxxOnWindow()` for each, sets up click delegation, starts game on `DOMContentLoaded`. |
| **main.ts** | `scripts/main.ts` | Game loop. `go(location)` for transitions, `start()` for init, `gamestart()` to begin after settings. Handles time ticks, bladder/tummy updates. |

---

## State Management

| Module | File | Key Exports |
|--------|------|-------------|
| **gameState** | `scripts/gameState/gameState.ts` | `gameState` (RuntimeContext singleton), `GameLocation`, `LocationCategory` enum |
| **Person** | `scripts/gameState/Person.ts` | `Person` class — character bladder/tummy/stats model |
| **bladderState** | `scripts/gameState/bladderState.ts` | `BladderState` enum (Empty→SexLose) |

---

## Dialogue & Choice System

| Module | File | Key Exports |
|--------|------|-------------|
| **quotes.ts** | `scripts/quotes.ts` | `sayText()`, `setText()`, `printAllChoices()`, `fetchAndCacheJson()`, `locationSetup()`, `setupQuotes()`, `initDelegatedClickHandler()`, `actionRegistry`, `calledjsons`, dialogue variable exports (`peelines`, `ypeelines`, `needs`, `flirtresps`, etc.) |

### How choices work

```
printAllChoices([{ text: "Go to bar", action: "bar" }, ...])
  → renders <a data-action="bar">Go to bar</a>
  → click triggers: go("bar")

printAllChoices([{ text: "Use item", fn: () => useItem() }])
  → registers callback in actionRegistry → data-action-fn="id"
  → click triggers: actionRegistry.get(id)()
```

---

## UI Rendering

| Module | File | Key Exports | DOM Target |
|--------|------|-------------|------------|
| **gameScreen** | `scripts/gameScreen/gameScreen.ts` | `gameScreen` singleton | Top-level façade |
| **contentScreen** | `scripts/gameScreen/contentScreen.ts` | Content rendering functions | `#textsp` |
| **statusBar** | `scripts/gameScreen/statusBar.ts` | `updateStatusBar()` | `#stats-bar` |
| **animationManager** | `scripts/gameScreen/animationManager.ts` | `animationManager` | `#thepic` (ASCII/image) |
| **imageManager** | `scripts/gameScreen/imageManager.ts` | Image loading/display | `#thepic` |
| **PopUps/** | `scripts/gameScreen/PopUps/` | Modal overlays | `#pop-up` |
| **pop-up.ts** | `scripts/pop-up.ts` | `openPopUp()`, `exposePopUpOnWindow()` | `#pop-up` |

### Status bar layout

```
#stats-bar (table)
  Money | Attraction | Shyness | [Bladder stats if enabled] | Time
```

---

## Bladder System

| Module | File | Key Exports | Owns |
|--------|------|-------------|------|
| **bladder.ts** | `scripts/bladder.ts` | `bladder`, `tummy`, `bladurge`, `peein()`, `displayneed()`, `updateurge()`, `bladlose`, `indepee()` | Companion bladder state |
| **yourbladder.ts** | `scripts/yourbladder.ts` | `yourbladder`, `yourtummy`, `yourbladurge`, `ypeein()`, `displayyourneed()`, `updateyoururge()` | Player bladder state |

These modules are legacy owners being migrated to `gameState.Companion` and `gameState.Player`. Both expose `exposeXxxOnWindow()` for compatibility with the click pipeline.

### Bladder fill thresholds (companion example)

```
bladurge = 250         → first urge shown
bladurge * 2 = 500     → need (continuous urgency)
bladurge * 3 = 750     → emergency
bladurge * 3 + 150     → lose control (accident)
bladurge * 4 = 1000    → cum-triggered accident
bladurge * 5 = 1250    → sex-triggered accident
```

---

## Location Modules

| Module | File | Location |
|--------|------|---------|
| **yourHome** | `scripts/yourHome.ts` | Player's home (start location) |
| **herhome** | `scripts/herhome.ts` | Companion's home |
| **store** | `scripts/store.ts` | In-game store |
| **drive** | `scripts/drive.ts` | Driving / car scenes |
| **driveAround** | `scripts/locations/driveAround.ts` | Drive-around navigation, gas station |
| **theBar** | `scripts/locations/theBar.ts` | Bar (drinking game, sell panties) |
| **theClub** | `scripts/locations/theClub.ts` | Club (dancing, photo game, darts setup) |
| **theatre** | `scripts/locations/theatre.ts` | Movie theatre |
| **theMakeOut** | `scripts/locations/theMakeOut.ts` | Make-out spot |
| **locations** | `scripts/locations.ts` | Location registry / lookup |

---

## Mini-Games

| Module | File | Game |
|--------|------|------|
| **darts** | `scripts/games/darts.ts` | Darts throwing mini-game (in the club) |

---

## Inventory / Items

| Module | File | Key Exports |
|--------|------|-------------|
| **backPackItems** | `scripts/backPackItems.ts` | `backpack`, `IBackpackItem`, `haveItem()`, `buyItem()`, `useItem()`, `exposeBackPackItemsOnWindow()` |

---

## Social Actions

| Module | File | Key Exports |
|--------|------|-------------|
| **actions** | `scripts/actions.ts` | `flirt_l()`, `flirt_m()`, `flirt_h()`, `kissher()`, `externalflirt()`, `exposeActionsOnWindow()` |
| **fuckHer** | `scripts/fuckHer.ts` | Sex scene logic, `fuckHerSetup()`, champagne counter, `sexActions`, `exposeFuckHerOnWindow()` |

---

## Settings System

| Module | File | Key Exports |
|--------|------|-------------|
| **gameSettings** | `scripts/settings/gameSettings.ts` | `GameSettings` class, `baseCompanion` enum, `ImageChoice` enum, `gameSettings` singleton |
| **imageSettings** | `scripts/settings/imageSettings.ts` | `ImageSettings` — image path configuration |
| **imageType** | `scripts/settings/imageType.ts` | `ImageChoice` enum |
| **companionSettings** | `scripts/settings/companionSettings.ts` | Per-companion setting overrides |
| **settingsManager** | `scripts/settings/settingsManager.ts` | Settings persistence |
| **settings** | `scripts/settings.ts` | Legacy settings accessor bridge |

---

## Save / Load

| Module | File | Key Exports |
|--------|------|-------------|
| **saveLoad** | `scripts/saveLoad.ts` | `saveToSlot()`, `loadFromSlot()`, `hasSave()`, `deleteSave()`, `exportSave()`, `importSave()` |

---

## Utilities & Bridge

| Module | File | Key Exports |
|--------|------|-------------|
| **shims** | `scripts/shims.ts` | `locStack`, `money`, `thetime`, `attraction`, `shyness`, `playerbladder`, `endScreens`, `pushloc()`, `poploc()`, `randomInt()`, `randomchoice()`, `pickrandom()`, `range()`, `incrandom()`, `formatString()`, `exposeShimsOnWindow()` |
| **helperFunctions** | `scripts/helperFiles/helperFunctions.ts` | `assertExists()`, `getRandomValueFromNormalDistribution()` |
| **documentFunctions** | `scripts/helperFiles/documentFunctions.ts` | DOM utility helpers |
| **validation** | `scripts/validation.ts` | Input validation, `validateListenerList()`, `exposeValidationOnWindow()` |
| **images** | `scripts/images.ts` | Image loading helpers, `exposeImagesOnWindow()` |
| **clothes** | `scripts/clothes.ts` | Outfit helpers, `exposeClothesOnWindow()` |

---

## Debug

| Module | File | Key Exports |
|--------|------|-------------|
| **debugMenu** | `scripts/debugMenu.ts` | Debug menu UI, `exposeDebugMenuOnWindow()` |

---

## Models (Enums)

| Module | File | Values |
|--------|------|--------|
| **baseCompanion** | `scripts/models/baseCompanion.ts` | `Jennifer`, `Laura`, `Karen`, `Melissa` |
| **movie** | `scripts/models/movie.ts` | Movie titles available at the theatre |
| **outfit** | `scripts/models/outfit.ts` | Outfit options for the companion |

---

## Type Declarations

| File | Purpose |
|------|---------|
| `scripts/globals.d.ts` | Declares types for `window.*` globals: `go()`, `gameState`, `bladder`, `yourbladder`, `money`, etc. Required because script-style callers reference these via the window. |

---

## Window Exposure Summary

The following are exposed on `window` by `app.ts` at startup, making them accessible from `data-action` click handlers and any remaining plain-JS callers:

| Window key | Source module |
|------------|--------------|
| `go` | `main.ts` |
| `start` | `main.ts` |
| `gamestart` | `main.ts` |
| `gameState` | `gameState/gameState.ts` |
| `gameScreen` | `gameScreen/gameScreen.ts` |
| `gameSettings` | `settings/gameSettings.ts` |
| `animationManager` | `gameScreen/animationManager.ts` |
| `bladder`, `tummy`, `bladurge`, etc. | `bladder.ts` |
| `yourbladder`, `yourtummy`, etc. | `yourbladder.ts` |
| `money`, `thetime`, `locStack`, etc. | `shims.ts` |
| `printAllChoices`, `sayText`, etc. | `quotes.ts` |
| `backpack`, `haveItem`, etc. | `backPackItems.ts` |
| `saveToSlot`, `loadFromSlot`, etc. | `saveLoad.ts` |
| `callHer`, `yourHome` | `yourHome.ts` |
| Location functions | per location module |
