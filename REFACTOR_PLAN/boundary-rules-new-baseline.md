# Boundary Rules (new baseline)

Use these rules before moving any variable:

1. Keep in canonical `gameState` only if it changes gameplay outcomes or must survive save/load.
2. Keep outside `gameState` if it is UI-only, DOM/runtime handle, timer, event subscription, or temporary interaction buffer.
3. Derived values should be computed selectors, not stored as duplicated mutable fields.
4. During migration, every concept gets one write owner and one runtime path.
5. Compatibility layers are forbidden. Do not add mirrors, dual-write, compatibility adapters, or bridge-only globals.
6. If legacy code blocks progress, migrate that call site now or delete it. Do not introduce temporary compatibility.

Examples:

- Canonical gameplay: money, attraction/shyness progression, inventory ownership, current location identity, simulation stats.
- Outside canonical gameplay: open modal flags, CSS/layout flags, DOM nodes, action callback registries, formatting caches.

---

