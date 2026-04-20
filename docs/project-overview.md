# FamMel — Project Overview

**Generated:** 2026-04-20  
**Version:** 0.6.0  
**Type:** Browser-based single-page game (monolith)

---

## What is FamMel?

FamMel is a browser-based adult dating-simulation game. The player takes a companion (one of four selectable girls) out for an evening and manages social interactions, venue navigation, and a bladder-urgency mechanic for both the companion and optionally the player character. The game is presented as text, ASCII art, and optional images through a single HTML page.

The codebase is **mid-migration from JavaScript to TypeScript**. Most game logic now lives in TypeScript modules bundled by esbuild; the bridge layer (`shims.ts`) keeps legacy global-style state accessible during the transition.

---

## Tech Stack Summary

| Category | Technology | Version | Role |
|----------|-----------|---------|------|
| Language | TypeScript | 5.8.x | Primary source language |
| Bundler | esbuild | 0.27.x | Compiles & bundles TS → `dist/app.js` |
| Type-checker | tsc | 5.8.x | Type-check only (`noEmit: true`) |
| Runtime | Browser (ES2024) | — | Target execution environment |
| Markdown | Showdown | 1.9.1 | Renders in-game dialogue markdown |
| Dev server | live-server | 1.2.2 | Hot-reload dev workflow |
| Testing | NUnit 3 + Selenium | .NET 8 | Browser-level integration tests |
| Save format | `localStorage` | — | Save-slot persistence |

---

## Architecture Type

**Single-page browser game** — component-based, with a global state singleton (`gameState` / `RuntimeContext`) as the source of truth. A dual-ownership migration bridge (`shims.ts`) mirrors canonical state to legacy globals while the JS→TS migration is in progress.

---

## Repository Structure

```
FamMel/                         # Monolith — one project
├── index.html                  # Game host page (single HTML file)
├── style.css                   # Game styling
├── esbuild.config.mjs          # Build configuration
├── package.json                # Node dependencies & scripts
├── tsconfig.json               # TypeScript config (type-check only)
├── scripts/                    # All TypeScript source
│   ├── app.ts                  # Bundle entry point
│   └── ...                     # Game logic modules
├── Json/                       # Game data (dialogue, items, locations)
├── dist/                       # Build output (git-ignored)
├── icons/                      # UI icons
├── docs/                       # Project documentation (this folder)
├── UserFlowTests/              # Selenium/NUnit integration tests (.NET 8)
└── REFACTOR_PLAN/              # Active migration & refactor planning docs
```

---

## Companion Characters

Players choose one of four companion girls at the start of each session:

| ID | Name |
|----|------|
| `Jennifer` | Jennifer |
| `Laura` | Laura |
| `Karen` | Karen |
| `Melissa` | Melissa |

Each character uses shared game logic but can have custom dialogue and traits configured through JSON data files.

---

## Key Entry Points

| File | Purpose |
|------|---------|
| `index.html` | Browser entry — loads `dist/app.js` |
| `scripts/app.ts` | Bundle entry — imports all modules, exposes window globals |
| `scripts/main.ts` | Game loop — `go()` (location transitions), `start()` (initialization) |
| `scripts/gameState/gameState.ts` | Central state singleton (`gameState`) |

---

## Current Version Highlights (v0.6.0)

- Full TypeScript migration with esbuild bundle
- Debug menu added
- Darts mini-game crash fix
- Save/load system covering all module state

---

## Links to Detailed Documentation

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Data Models](./data-models.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [Master Index](./index.md)
