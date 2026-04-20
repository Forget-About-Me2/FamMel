# FamMel — Documentation Index

**Generated:** 2026-04-20 | **Scan level:** Deep | **Version:** 0.6.0

---

## Project Overview

- **Type:** Monolith browser game (single HTML page)
- **Primary Language:** TypeScript 5.8
- **Architecture:** Component-based game loop with global state singleton
- **Migration status:** Mid JS→TypeScript migration (active — see REFACTOR_PLAN/)

---

## Quick Reference

| Item | Value |
|------|-------|
| Entry point | `index.html` → `dist/app.js` |
| Bundle entry | `scripts/app.ts` |
| Game loop | `scripts/main.ts` → `go()`, `start()` |
| Central state | `scripts/gameState/gameState.ts` → `gameState` |
| Dev server | `npm run dev` → `http://127.0.0.1:8080` |
| Build | `node esbuild.config.mjs` |
| Type-check | `npx tsc -p . --noEmit` |
| Tests | `dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj` |

---

## Generated Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](./project-overview.md) | Purpose, tech stack, entry points, companion characters |
| [Architecture](./architecture.md) | Module architecture, state management, navigation system, UI, testing |
| [Source Tree Analysis](./source-tree-analysis.md) | Annotated directory tree for all critical folders |
| [Data Models](./data-models.md) | All state classes, enums, legacy variables, inventory and settings models |
| [Component Inventory](./component-inventory.md) | All TypeScript modules, their responsibilities and public interfaces |
| [Development Guide](./development-guide.md) | Build setup, commands, workflow, adding modules/locations/content |

---

## Existing Project Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG.md](../CHANGELOG.md) | Player-facing version history |
| [README.md](../README.md) | Project readme |
| [UserFlowTests/README.md](../UserFlowTests/README.md) | Integration test suite documentation |
| [REFACTOR_PLAN/start-here.md](../REFACTOR_PLAN/start-here.md) | Active JS→TS migration plan entry point |
| [REFACTOR_PLAN/active-slices-wip-limit-2.md](../REFACTOR_PLAN/active-slices-wip-limit-2.md) | Current WIP items (max 2 at a time) |
| [REFACTOR_PLAN/completed.md](../REFACTOR_PLAN/completed.md) | Completed refactor work |
| [REFACTOR_PLAN/quality-gate-policy.md](../REFACTOR_PLAN/quality-gate-policy.md) | Quality gates for each PR/batch |
| [REFACTOR_PLAN/migration-principles.md](../REFACTOR_PLAN/migration-principles.md) | Guiding principles for the migration |
| [docs/state-ownership-ledger.md](./state-ownership-ledger.md) | State ownership tracking across modules |
| [.github/copilot-instructions.md](../.github/copilot-instructions.md) | Copilot/AI developer instructions |

---

## Getting Started

### Play the game locally

```bash
npm install
npm run dev
# Open http://127.0.0.1:8080
```

### Make a code change

```bash
npm run dev          # watch + live reload
# Edit scripts/*.ts
# Browser auto-reloads
npx tsc -p . --noEmit   # Check for type errors
```

### Run integration tests

```bash
npm run dev   # must be running in another terminal
dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj
```

### Understand the state architecture

Start with:
1. [Architecture](./architecture.md) — the two-world hybrid model
2. [Data Models](./data-models.md) — `RuntimeContext`, `Person`, `BladderState`
3. [Component Inventory](./component-inventory.md) — which module owns what
4. [REFACTOR_PLAN/start-here.md](../REFACTOR_PLAN/start-here.md) — migration roadmap

---

## Key Design Decisions

| Decision | Rationale | Docs |
|----------|-----------|------|
| esbuild instead of tsc for output | Avoids recursive recompilation into source folder | [Development Guide](./development-guide.md) |
| `exposeXxxOnWindow()` pattern | Bridges ES modules to legacy global callers during migration | [Component Inventory](./component-inventory.md) |
| `shims.ts` bridge layer | Keeps legacy global variables working while canonical state migrates | [Architecture](./architecture.md) |
| Field-registry save/load | Direct ES module imports — no window dependency in save path | [Data Models](./data-models.md) |
| Delegated click handler | Single listener on `document` replaces per-element onclick callbacks | [Component Inventory](./component-inventory.md) |
| JSON positional arrays → named objects | Incremental conversion for readability (makeOut.JSON > theYard is target format) | [Architecture](./architecture.md) |
