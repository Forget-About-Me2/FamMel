# End State

- Canonical gameplay state lives on `gameState`.
- Non-gameplay mutable runtime state (UI/DOM/timers/transient interaction) stays outside `gameState`.
- Game logic reads/writes canonical gameplay state through `gameState` domain APIs.
- No `expose*OnWindow()` bridge functions.
- No setter scaffolding (`setX(...)`) for migrated state.
- Save/load serializes canonical gameplay state from `gameState` only.
- Player and companion bladder mechanics share one model (`Person`) with role-specific config values.
