# FamMel Project - Build & Architecture Instructions

## Quick Start

```bash
npm install                    # Install dependencies
node esbuild.config.mjs        # Build TS files into dist/
npm run dev                    # Watch + live-server (concurrently)
npx tsc -p . --noEmit          # Type-check only (no output)
```

## Architecture Overview

This project is a **browser-based game** that's mid-migration from JavaScript to TypeScript. It uses two parallel systems:

### Two Worlds: Modules vs Scripts

| System | Files | Module Type | Loaded How |
|--------|-------|-------------|------------|
| **TS Module files** | `main.ts`, `gameState/*.ts`, `gameScreen/*.ts`, `settings/*.ts`, `models/*.ts`, `helperFiles/*.ts` | ES module (`import`/`export`) | Bundled by esbuild into `dist/app.js` (IIFE) |
| **Script-style TS files** | `quotes.ts`, `debugMenu.ts`, `backPackItems.ts`, `store.ts` | No imports/exports, global scope | Compiled individually by esbuild into `dist/` |
| **Plain JS files** | `bladder.js`, `settings.js`, `actions.js`, etc. | Global scope | Loaded directly via `<script>` tags |
| **Shims** | `shims.js` | Global scope | Bridges missing globals from migration |

### Key Entry Points

- **`scripts/app.ts`** — Bundle entry point. Imports all module TS files, exposes `go()`, `start()`, `gameState`, `gameScreen`, etc. as `window` globals. Starts the game on `DOMContentLoaded`.
- **`scripts/main.ts`** — Main game loop. Exports `go()` (location transition) and `start()` (initialization).
- **`scripts/gameState/gameState.ts`** — Central state singleton. `GameState` class with `Player`, `Companion`, location stack, money, etc.

### Script Load Order (index.html)

1. External libs (jQuery, Showdown)
2. `scripts/shims.js` — Missing globals (locStack, pushloc, poploc, randomchoice, etc.)
3. `dist/quotes.js` — String formatting, JSON loading, choice system
4. JS game files (`animation.js`, `settings.js`, `images.js`, `bladder.js`, etc.)
5. `dist/backPackItems.js` — Items and inventory
6. `dist/store.js` — Store functions
7. `dist/app.js` — Module bundle (gameState, gameScreen, main, settings, helpers)
8. `dist/debugMenu.js` — Debug menu

**Order matters!** JS files reference globals that must be defined before them.

## Build System

### esbuild (primary build tool)

- Config: `esbuild.config.mjs`
- **Bundle build**: `scripts/app.ts` → `dist/app.js` (IIFE, all module imports bundled)
- **Script builds**: Individual TS files → `dist/` (no bundling, preserves global scope)
- Watch mode: `node esbuild.config.mjs --watch`

### TypeScript (type-checking only)

- Config: `tsconfig.json`
- `noEmit: true` — TypeScript doesn't produce output, only checks types
- `noImplicitAny: false` — Relaxed for gradual migration
- `strictNullChecks: false` — Relaxed for gradual migration
- `allowJs: false` — Only TS files are type-checked

### Why not tsc for compilation?

The old `tsc` setup had `outDir: "./scripts"` which caused **recursive recompilation** (output was written back into the source folder, creating `scripts/scripts/scripts/...`). esbuild avoids this by outputting to `dist/`.

## Type Declarations

### `scripts/globals.d.ts`

Declares types for:
- **JS global variables** (from `bladder.js`, `settings.js`, `actions.js`, etc.)
- **Window-exposed TS exports** (`go()`, `gameState`, etc.)
- **Missing function stubs** (`formatAll`, `formatString`, `printDialogue`, `range`)
- **String prototype extensions** (`.format()`, `.formatVars()`)

### Adding new globals

When a JS file defines a new global variable or function, add its declaration to `globals.d.ts`. When a TS module file needs to be accessible from script-style files, expose it in `app.ts` and add a declaration in `globals.d.ts`.

**Do NOT duplicate** declarations from script-style TS files (`quotes.ts`, `backPackItems.ts`, etc.) in `globals.d.ts` — TypeScript already sees them since they're in the compilation scope.

## Remaining Type Errors (59 in 3 files)

All remaining errors are in **script-style TS files** that esbuild compiles regardless:

| File | Errors | Main Issues |
|------|--------|-------------|
| `backPackItems.ts` | 46 | `IBackpackItem`/`IContainer` missing `volume` property, property access on `HTMLElement`, type assertions |
| `quotes.ts` | 7 | Type mismatches in string manipulation functions |
| `yourHome.ts` | 6 | Variable name mismatches (`gameState.CurrentLocation` compared to string) |

These don't block the build or runtime — esbuild strips types and compiles regardless.

### Common error patterns to fix:

1. **TS2339 (Property does not exist)**: Add the property to the interface, or use type assertion `(obj as any).prop`
2. **TS2551 (Did you mean)**: Typos in property names
3. **TS2322 (Type not assignable)**: Usually `number` vs `string` — add explicit conversion
4. **TS2352/TS2353 (Object literal)**: Missing required properties in interface — add them

## Migration Strategy

### To convert a JS file to TS:

1. Rename `.js` → `.ts`
2. If it uses `import`/`export`, add it to the module system (imported by `app.ts`)
3. If it stays script-style, add it to `esbuild.config.mjs`'s `scriptEntryPoints`
4. Update `index.html` to load from `dist/` instead of `scripts/`
5. Remove corresponding `declare` entries from `globals.d.ts` (no longer needed)
6. Add type annotations gradually

### Parallel state systems

The old JS uses global variables (`bladder`, `money`, `locStack`, `attraction`, etc.) while the new TS uses `gameState.Companion.Bladder`, `gameState.Money`, `gameState.LocStack`, etc. During migration, both systems coexist. The `shims.js` file bridges the gap for `locStack`, `pushloc`, `poploc`, `money`, and other missing globals.

### When migrating further:

- Replace `locStack` references in JS with `gameState.LocStack`
- Replace `money` references with `gameState.Money`
- Replace `bladder`, `tummy`, etc. with `gameState.Companion.Bladder`, `gameState.Companion.Tummy`
- Replace `go("locationName")` string-based calls with `go(new GameLocation(...))`

## Folder Structure

```
dist/                    # Build output (gitignored)
Json/                    # Game data JSON files (dialogue, items, locations)
scripts/
  app.ts                 # Bundle entry point
  globals.d.ts           # Type declarations for JS globals
  shims.js               # Missing global functions/variables
  main.ts                # Game loop, start()
  quotes.ts              # String formatting, JSON loading, choice system
  backPackItems.ts       # Items and inventory
  debugMenu.ts           # Debug menu
  store.ts               # Store buying logic
  yourHome.ts            # Home screen logic
  *.js                   # Original JS game files
  gameState/             # State management (Person, GameState, BladderState)
  gameScreen/            # UI rendering (ContentScreen, StatusBar, Animations)
  settings/              # Game settings (GameSettings, ImageSettings)
  models/                # Enums (BaseCompanion, Movie, Outfit)
  helperFiles/           # Utility functions
  locations/             # Location-specific JS files
  games/                 # Mini-game JS files
```

## Known Issues

- `shims.js` defines `money = 200` but `gameSettings.StartMoney` also defines it as 200. Both are used independently.
- `gameState.LocStack` uses `GameLocation` objects while JS files use `locStack` with strings — these are separate stacks.
- **JSON quote files use positional arrays** — Most JSON files in `Json/` (especially `Json/locations/`) store dialogue/quote data as plain arrays where meaning is determined by index position. This leads to hard-to-read destructuring like `const [,,,tubWilling, tubRefused] = data["section"]`. These should be incrementally converted to named-property objects (see `makeOut.JSON`'s `theYard` for the target format). `theBeach` in `makeOut.JSON` (22-element array) is the worst offender.
- Some functions (`formatAll`, `formatString`, `printDialogue`) were removed during migration but still referenced — re-implemented in `shims.js`.
- `Person.TimeSinceLastPeed` references global `lastpeetime` from `bladder.js` (not `this.lastPeeTime`).
- `quotes.ts` line 186 uses `<a href="#" data-action="locationName">` with a delegated click handler on `document` — clicking triggers `go()`. Function-based callbacks use `data-action-fn` attributes mapped via an `actionRegistry` in `quotes.ts`.

## The changelog
CHANGELOG.md tracks **player-facing changes only** (bug fixes, new features, gameplay tweaks). Do not add entries for internal refactors, build system changes, or code reorganisation that don't affect the player experience. Update it when player-facing changes are made.

## Refactor plan
When working on refactors, be proactive about keeping REFACTOR_PLAN.md up to date.

- Treat REFACTOR_PLAN.md updates as part of the refactor itself, not as an optional follow-up.
- Update REFACTOR_PLAN.md in the same task whenever refactor work changes status, sequencing, scope, blockers, or newly discovered follow-up work.
- If you complete part of a larger refactor, record that partial completion explicitly instead of leaving the plan unchanged.
- If the next logical refactor step becomes clear while doing the work, add it to REFACTOR_PLAN.md without waiting to be asked.
- When the correct REFACTOR_PLAN.md update is clear from the work performed, apply it directly instead of only suggesting it.
- Only leave REFACTOR_PLAN.md untouched when the work genuinely has no impact on the plan.
- Add changelog entries for substantial refactor work when appropriate.

## Testing
Be proactive about running tests and update the integration tests

## Documentation
When touching a function during refactor work, assess whether it needs a JSDoc comment. Add documentation when:
- The function's purpose is non-obvious from its name and parameters
- It has side effects (writes to globals, mutates shared state, triggers UI updates)
- It has a non-trivial contract (expected input formats, return value semantics, error conditions)
- It's a setter that bridges cross-module state
- It's a key entry point or lifecycle hook (e.g. `go()`, `start()`, `setupQuotes()`)

Don't add boilerplate docs to trivial one-liners or self-explanatory helpers.

## Keeping instructions up to date
Be proactive in suggesting improvements to the instructions, if you notice they are out of date, incomplete or in other ways lacking prompt the user.

## Prompting user
When there are multiple paths a refactor or solution can go, prompt the user to make the choice or give feedback