# FamMel — Architecture

**Generated:** 2026-04-20  
**Project type:** Browser-based single-page game (monolith)  
**Architecture pattern:** Component-based game loop with global state singleton  

---

## Executive Summary

FamMel is a browser-based text-and-image dating simulation game. All game logic runs in the browser; there is no server component. The TypeScript source is bundled by esbuild into a single IIFE file (`dist/app.js`) loaded by `index.html`.

The codebase is mid-way through a **JavaScript → TypeScript migration**. A dual-ownership model currently exists: canonical state lives in the `gameState` singleton (`RuntimeContext`), while a legacy bridge layer (`shims.ts`) mirrors values to plain JavaScript globals so unconverted code paths continue to work. The `REFACTOR_PLAN/` directory documents the active migration strategy.

---

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Language | TypeScript 5.8 | Strict mode, `noImplicitAny: false` (gradual migration) |
| Target runtime | Browser ES2024 | Single HTML page |
| Bundler | esbuild 0.27 | IIFE bundle: `scripts/app.ts` → `dist/app.js` |
| Type-checker | tsc (`noEmit: true`) | Type-checking only; esbuild does compilation |
| Markdown renderer | Showdown 1.9 (CDN) | Dialogue text → HTML |
| Dev tooling | live-server + concurrently | Watch + auto-reload |
| Integration tests | NUnit 3 + Selenium (.NET 8) | Browser-level smoke and flow tests |

---

## Architecture Pattern: Two-World Hybrid

The codebase has two coexisting module styles that interact via the `shims.ts` bridge:

### World 1 — ES Module System (canonical)
TypeScript files using `import`/`export`. All compiled into `dist/app.js` by esbuild.  
**State owner:** `gameState` (`RuntimeContext` singleton in `gameState/gameState.ts`)

### World 2 — Script-style globals (legacy, being removed)
No `import`/`export`. Accessed through `window.*` or plain global variables.  
**State owner:** plain `let` variables in modules like `bladder.ts`, `yourbladder.ts`, `shims.ts`

The `exposeXxxOnWindow()` functions in each module mount their public interface onto `window`, making them callable from HTML `data-action` attributes and other global-style code.

---

## Module Architecture

### Core Lifecycle

```
index.html loads dist/app.js
  └─ app.ts (bundle entry)
       ├─ exposeShimsOnWindow()        — legacy globals bridge
       ├─ exposeQuotesOnWindow()       — dialogue & choice system
       ├─ initDelegatedClickHandler()  — routes click events → go()
       ├─ ... (all other exposeXxx)
       └─ DOMContentLoaded → start()  — game initialization
             └─ go(yourHome)          — first location rendered
```

### State Management

The central state object is `gameState` (a `RuntimeContext` instance exposed on `window`):

```
RuntimeContext
  ├── Player: Person              — player character (bladder, stats)
  ├── Companion: dateNPC          — NPC companion (bladder, attraction, shyness)
  ├── LocStack: GameLocation[]    — canonical location navigation stack
  ├── LegacyLocStack: string[]    — legacy bridge stack (strings)
  ├── Money: number               — player's money
  ├── Time: Time                  — in-game time (ticks, hour, minute, meridian)
  ├── Interactions: InteractionState  — flirt counters, flags
  └── Romance: RomanceState       — kiss/feel/arousal counters
```

The `Person` class (`gameState/Person.ts`) models a character's physical state:

```
Person
  ├── Bladder: number             — current bladder fill level
  ├── Tummy: number               — stomach fill level
  ├── MaxTummy / MaxAlcohol       — capacity settings
  ├── _bladderUrge: number        — threshold for first urge
  └── legacyBladderMirror         — "companion" | "player" (bridge sync target)
```

### Bladder State Machine

`BladderState` (enum in `gameState/bladderState.ts`) represents the companion's urgency level:

```
Empty → Urge → Need → Emergency → Lose → CumLose → SexLose
  0      1      2        3          4       5          6
```

Player bladder uses parallel module-scoped state in `yourbladder.ts` with the same progression logic.

### Navigation / Location System

Locations are `GameLocation` objects (or legacy strings). `go(location)` in `main.ts` handles:
1. Resolving `GameLocation` vs legacy string vs function callback
2. Applying time passage (ticks)
3. Updating bladder/tummy state
4. Updating status bar UI
5. Calling the location's `function` property (or legacy global function)

```
go(location)
  ├─ isGameLocation()         — type guard
  ├─ resolveLegacyTarget()    — string → window function lookup
  ├─ time tick + state updates
  └─ location.function()      — renders the screen
```

The legacy location stack (`locStack`) uses strings; the canonical stack (`gameState.LocStack`) uses `GameLocation` objects. Both coexist during migration.

### UI Rendering System

All UI is controlled through `gameScreen/`:

| Module | Responsibility |
|--------|---------------|
| `gameScreen.ts` | Top-level façade — coordinates screen updates |
| `contentScreen.ts` | Main text/choice area (`#textsp`) |
| `statusBar.ts` | Stats bar (money, attraction, shyness, bladder, time) |
| `animationManager.ts` | ASCII/image animations |
| `imageManager.ts` | Image loading and display |
| `PopUps/` | Backpack and modal overlays |

### Dialogue & Choice System (`quotes.ts`)

- Fetches and caches JSON dialogue files via `fetchAndCacheJson()`
- `sayText(html)` / `setText(html)` — render text to `#textsp`
- `printAllChoices(choices[])` — render clickable choice buttons
- Choices use `data-action="locationName"` (routes to `go()`) or `data-action-fn="id"` (routes to `actionRegistry` callback)
- `actionRegistry` (Map) stores callbacks; cleared on every screen refresh

### Settings System (`settings/`)

| Module | Responsibility |
|--------|---------------|
| `gameSettings.ts` | `GameSettings` class — all tunable constants |
| `imageSettings.ts` | Image path and mode config |
| `companionSettings.ts` | Per-companion overrides |
| `settingsManager.ts` | Reads/writes `settings` object from JSON |

### Save / Load System (`saveLoad.ts`)

A field-registry pattern: each save key maps to `{ get, set }` pairs using direct ES module imports (no `window` bridges). Saves to `localStorage` slots. Covers all module-scoped mutable state across `bladder.ts`, `yourbladder.ts`, `shims.ts`, `fuckHer.ts`, `drive.ts`, and `gameState`.

---

## Data Architecture

All game content is stored in JSON files under `Json/`:

| File | Content |
|------|---------|
| `general.JSON` | General dialogue, need descriptions |
| `flirting.JSON` | Flirt dialogue trees |
| `drinking.JSON` | Drinking game dialogue |
| `drive.JSON` | Driving location dialogue |
| `herhome.JSON` | Her home location |
| `fuckHer.JSON` | Intimate scene dialogue |
| `shepee.JSON` | Companion bathroom dialogue |
| `youpee.JSON` | Player bathroom dialogue |
| `options.JSON` | Settings options text |
| `objects.JSON` | Item descriptions |
| `start.JSON` | Start/intro dialogue |
| `homeScreen.json` | Home screen content |
| `yourhome.json` | Player home content |
| `appearance.JSON` | Appearance/outfit descriptions |
| `statsBars.JSON` | Status bar labels |
| `storeQuotes.json` | Store dialogue |
| `phoneCall.json` | Phone call dialogue |
| `endScreens.JSON` | End-of-game screens |
| `needs.JSON` / `yneeds.JSON` | Need-display text (her/yours) |
| `credits.json` | Credits screen |
| `locations/*.JSON` | Per-location dialogue (bar, club, theatre, makeout, drive) |
| `games/` | Mini-game data |

Most JSON files use **positional arrays** (index = meaning). The `makeOut.JSON > theYard` section is the target format for migration: named-property objects.

---

## Testing Architecture

Integration tests live in `UserFlowTests/` (C#, .NET 8, NUnit + Selenium WebDriver):

| Test File | Coverage |
|-----------|---------|
| `NavigationSmokeTests.cs` | Page load, basic navigation |
| `SceneIntegrationSmokeTests.cs` | Scene entry/exit smoke tests |
| `YourHomeIntegrationTests.cs` | Player home flows |
| `DartsIntegrationTests.cs` | Darts mini-game |
| `EndgameIntegrationTests.cs` | End-of-game screens |
| `TheMovieTest.cs` | Movie theater flow |
| `PickherupTest.cs` | Initial companion pickup |
| `RandomSeedDeterminismTest.cs` | RNG determinism validation |
| `MelissaBy.cs` | Melissa companion-specific flows |

Tests require the dev server running at `http://127.0.0.1:8080`.

---

## Deployment

The game runs entirely in the browser — there is no server build. Production deployment is a static file host:

```
index.html + style.css + icons/ + Json/ + dist/app.js → static host
```

A `Dockerfile` is present for containerized serving. The dev workflow uses `live-server` on port 8080.

---

## Known Architecture Trade-offs & Active Work

| Issue | Status |
|-------|--------|
| Dual-ownership state (canonical `gameState` vs legacy globals in `shims.ts`) | Active migration — see `REFACTOR_PLAN/` |
| JSON positional arrays vs named-property objects | Incremental conversion ongoing |
| `locStack` (strings) vs `gameState.LocStack` (GameLocation objects) | Coexisting during migration |
| `Person.TimeSinceLastPeed` references global `lastpeetime` from `bladder.ts` | Known bridge debt |
| Script-style files compiled individually vs module bundle | Migration complete as of v0.6.0 |

See [REFACTOR_PLAN/start-here.md](../REFACTOR_PLAN/start-here.md) for the active migration sequencing.
