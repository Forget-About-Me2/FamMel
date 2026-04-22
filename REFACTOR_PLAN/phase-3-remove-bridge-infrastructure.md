# Phase 3: Remove Bridge Infrastructure

Planning note: This document currently defines execution intent and gates only. Do not begin code changes from this checklist until execution phase is explicitly approved.

This is now an active policy, not a future-only phase.

Compatibility layers are forbidden. Remove bridge infrastructure as part of each active slice.

Immediate actions:

- [ ] Delete `connectToGameState()` bridge logic and call sites.
- [ ] Delete all `expose*OnWindow()` functions and app.ts calls.
- [ ] Remove remaining bridge-era window indirection for state.
- [ ] Add report-only guardrails (review checklist + optional lint/report output) for newly introduced bridge/mirror patterns.

Exit criteria:
- `Object.defineProperty(window, ...)` is no longer used for state bridging.
- State flow is direct and local: module → `gameState`.
- No gameplay mutation depends on legacy globals.

