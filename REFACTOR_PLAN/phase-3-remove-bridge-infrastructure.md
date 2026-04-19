# Phase 3: Remove Bridge Infrastructure

Once all mutable state is gameState-owned:

- [ ] Delete `connectToGameState()` bridge logic and call sites.
- [ ] Delete all `expose*OnWindow()` functions and app.ts calls.
- [ ] Remove remaining bridge-era window indirection for state.

Exit criteria:
- `Object.defineProperty(window, ...)` is no longer used for state bridging.
- State flow is direct and local: module → `gameState`.
