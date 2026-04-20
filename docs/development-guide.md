# FamMel — Development Guide

**Generated:** 2026-04-20

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | Required for esbuild and live-server |
| npm | 8+ | Included with Node.js |
| .NET SDK | 8.0 | Required for integration tests only |
| A browser | Modern (Chrome/Firefox) | ES2024 target |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build (compile TypeScript → dist/app.js)
node esbuild.config.mjs

# 3. Start dev server with watch mode
npm run dev
# Opens live-server at http://127.0.0.1:8080
# Rebuilds on every .ts file save
```

Open `http://127.0.0.1:8080` in a browser to play/test.

---

## Available Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install all Node dependencies |
| `node esbuild.config.mjs` | One-shot build: `scripts/app.ts` → `dist/app.js` |
| `npm run build` | Alias for the above |
| `npm run watch` | esbuild in watch mode (rebuilds on save) |
| `npx live-server --no-browser --port=8080` | Serve game at `http://127.0.0.1:8080` |
| `npm run dev` | Watch + live-server concurrently (main dev workflow) |
| `npx tsc -p . --noEmit` | Type-check only (no output) |
| `npm run typecheck` | Alias for the above |

---

## Build System Details

### esbuild (compilation)

esbuild handles all TypeScript compilation. It **strips types and bundles** — it does not enforce type correctness.

```
scripts/app.ts  →  dist/app.js  (IIFE bundle, ES2024, source maps)
```

Config: [esbuild.config.mjs](../esbuild.config.mjs)

Key settings:
- `format: 'iife'` — wraps everything in an immediately-invoked function so module-level variables don't leak to `window`
- `bundle: true` — resolves and inlines all `import` statements
- `target: 'es2024'` — modern JS features allowed
- `sourcemap: true` — source maps generated alongside output

### TypeScript (type-checking only)

`tsc` is configured with `noEmit: true` — it **only checks types**, never writes files.

```bash
npx tsc -p . --noEmit    # Check types, report errors
```

Key tsconfig settings:
- `noImplicitAny: false` — relaxed for gradual migration
- `strictNullChecks: true` — enforced
- `allowJs: false` — JS files are not type-checked
- `moduleResolution: "bundler"` — matches esbuild resolution

### Why not `tsc` for compilation?

Using `tsc` with `outDir` caused recursive recompilation (output written back into source folder). esbuild avoids this by outputting to `dist/`.

---

## Project Structure for Developers

```
scripts/app.ts          ← Edit this to add new module imports
scripts/main.ts         ← go() and start() — core game loop
scripts/gameState/      ← Central state (add new state fields here)
scripts/quotes.ts       ← Dialogue, choices, JSON loading
scripts/shims.ts        ← Legacy globals bridge (minimize changes here)
scripts/globals.d.ts    ← Type declarations for window globals
Json/                   ← Game content (dialogue, items)
dist/                   ← Build output (don't edit — git-ignored)
```

---

## Adding a New Module

1. Create `scripts/myModule.ts` with your logic
2. Add an `exposeMyModuleOnWindow()` function if it needs to be accessible from HTML data-actions or other modules via `window`
3. Import and call it in `scripts/app.ts`
4. If the module exposes new globals, add declarations to `scripts/globals.d.ts`

---

## Adding a New Location

1. Create `scripts/locations/myLocation.ts`
2. Export a setup/entry function
3. Export `exposeMyLocationOnWindow()` if needed
4. Import and expose in `scripts/app.ts`
5. Create a corresponding JSON file in `Json/locations/` for dialogue
6. Register the location in `scripts/locations.ts`

---

## Adding Game Content (JSON)

All dialogue and game data lives in `Json/`. Most files use **positional arrays** (index = meaning). The target migration format is named-property objects (see `Json/locations/makeOut.JSON > theYard` as the reference example).

When adding new content:
- Prefer named-property objects for new files
- Load via `fetchAndCacheJson(tag)` in `quotes.ts`
- The cache key is the tag name passed to `fetchAndCacheJson`

---

## Running Integration Tests

Integration tests use Selenium WebDriver and NUnit (.NET 8). They require the game to be running.

```bash
# Terminal 1: Start the game server
npm run dev

# Terminal 2: Run all integration tests
dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj

# Run a specific test filter
dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj --filter "FullyQualifiedName~NavigationSmoke"
```

Test prerequisites:
- Game reachable at `http://127.0.0.1:8080`
- No other process using port 8080

See [UserFlowTests/README.md](../UserFlowTests/README.md) for full details.

---

## Type Checking

```bash
npx tsc -p . --noEmit
```

Known pre-existing type errors exist in a few files (`backPackItems.ts`, `quotes.ts`, `yourHome.ts`) that don't block the build. See the copilot instructions for details on each error category.

---

## Debugging

The game includes a **Debug Menu** accessible via the "Debug menu" button in the game UI. It exposes runtime state and allows manual manipulation of game variables.

For browser devtools:
- All game state is accessible via `window.gameState`
- `window.go("locationName")` triggers location transitions
- `window.bladder`, `window.yourbladder` etc. are exposed module values

---

## Docker (optional)

A `Dockerfile` is provided for containerized static serving:

```bash
docker build -t fammel .
docker run -p 8080:8080 fammel
```

---

## Workflow for Refactor Work

1. Check `REFACTOR_PLAN/active-slices-wip-limit-2.md` for current WIP items (max 2 at a time)
2. Follow `REFACTOR_PLAN/quality-gate-policy.md` before merging any batch
3. Run the full test suite after state-ownership changes
4. Update `REFACTOR_PLAN/` docs as part of the work (not as a follow-up)
5. Update `CHANGELOG.md` for player-facing changes only
