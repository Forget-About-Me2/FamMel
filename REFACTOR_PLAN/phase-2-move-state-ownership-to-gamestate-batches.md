# Phase 2: Move State Ownership To gameState (Batches)

## Active Slice (2026-04-20): Attraction/Shyness Canonical Write Routing Foundation

Status: Partial completion (write-path routing complete; read-path and persistence follow-ups deferred)

Scope for this slice only:
- Add canonical write APIs for attraction/shyness in `gameState`.
- Keep legacy `setAttraction`/`setShyness` compatibility signatures, but route post-init writes through canonical setters.
- Preserve early-init fallback behavior when `window.gameState` is unavailable.
- Standardize invalid numeric handling for attraction/shyness as explicit non-finite no-op (keep prior value, no throw).

Out of scope for this slice:
- Broad call-site migration from legacy reads/writes to canonical reads/writes.
- Gameplay tuning or narrative balancing changes.
- Unrelated ownership migrations.
- Full bridge hardening beyond minimal direct-recursion guard.
- Broader last-value UX redesign beyond explicit setter invariant for successful writes.

Canonical contracts for this slice (specified in `_bmad-output/implementation-artifacts/spec-migrate-legacy-variable-calls-to-gamestate.md`):
- **Initialization**: `gameState` exposes public `isInitialized` getter; shims check `gameState.isInitialized === true` for post-init delegation.
- **Numeric range**: Attraction clamps to `[0, 130]`; shyness clamps to `[0, 100]` (verified from current gameplay bounds).
- **Numeric contract**: Canonical setters accept finite numbers only and treat non-finite values (`NaN`, `Infinity`, `-Infinity`) as deterministic no-op.
- **Legacy global mirroring**: After any successful canonical write, canonical setters immediately mirror new value to `window.attraction` or `window.shyness`. Failed writes (NaN skip) do not mutate legacy globals.
- **Write ordering**: successful canonical write sequence is prior capture (`Last*`) -> canonical update -> legacy mirror.
- **Recursion prevention**: structural one-way dependency only (shim compatibility setters call canonical setters; canonical setters do not call shim compatibility setters).
- **Read-path deferral**: Legacy code reading `window.attraction` directly will see stale values until call-sites migrated in Batch B2. This is acceptable; writes control state.

Quality gates for this slice:
- Bridge crossing verified: legacy setter updates canonical value after init.
- Bridge no-op path verified: invalid numeric input does not mutate current/last values and does not throw.
- Pre-init compatibility verified: valid numeric updates legacy globals; invalid numeric is no-op; no runtime throw.
- Clamping verified: out-of-bounds valid values clamp to gameplay bounds while preserving last-value sequencing and legacy mirror parity.
- Targeted userflow assertions pass for attraction/shyness paths.

For each batch:
- replace reads/writes of module state with `gameState.X`
- remove corresponding module `export let`
- remove corresponding `setX` function(s)
- remove corresponding `expose*OnWindow` state mapping(s)
- run build/typecheck/tests

### Batch order (smallest risk first)

- [ ] Batch A: `drive.ts`, `images.ts` (very small, confidence batch)
- [ ] Batch B: `settings.ts`, `fuckHer.ts`
- [~] Batch B1a: attraction/shyness canonical write routing (`gameState.ts`, `shims.ts`, `globals.d.ts`, targeted `UserFlowTests`) — write path implemented; read-path and persistence follow-ups remain in Batch B2/Phase 3+
- [ ] Batch C: location modules (`locations.ts`, `driveAround.ts`, `theBar.ts`, `theClub.ts`, `theatre.ts`, `theMakeOut.ts`, `herhome.ts`)
- [ ] Batch D: `backPackItems.ts`, `quotes.ts`
- [ ] Batch E: `shims.ts`
- [ ] Batch F: `bladder.ts`, `yourbladder.ts`

Next ordered follow-up after Batch B1a:
- [ ] Batch B1b: strengthen bridge hardening (cross-field recursion instrumentation and richer diagnostics) if needed after B1a tests.
- [ ] Batch B2: migrate attraction/shyness call sites from legacy arithmetic patterns to canonical reads/writes, then retire bridge-only fallback once compatibility risk is acceptably low.

Progress update (2026-04-21):
- Added canonical `gameState.setAttraction`/`gameState.setShyness` write path with finite-input guard, bounds clamping, prior-value capture, and legacy mirror updates.
- Updated shim compatibility setters to delegate post-init via `gameState.isInitialized` and preserve pre-init legacy fallback behavior.
- Added targeted UserFlow tests for post-init routing, pre-init fallback, invalid-input no-op, clamping, and one-way dependency behavior.

Exit criteria:
- No migrated variable remains as module-owned mutable state.
- No migrated variable needs a bridge setter.

Slice completion note:
- Batch B1a is considered complete only when contracts and quality gates above are met, not merely when setter wiring compiles.

