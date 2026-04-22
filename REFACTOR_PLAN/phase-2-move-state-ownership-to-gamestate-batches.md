# Phase 2: Canonical Ownership Cutover Waves

Planning status: reset in progress (planning only, no execution implied by this document).

This phase was re-scoped because the previous batch plan assumed transitional compatibility patterns that are no longer allowed.

## Goal

Move gameplay state and behavior to one canonical TypeScript runtime path in small, finishable waves.

## Non-negotiables

1. No new compatibility layers.
2. No dual-write paths.
3. No bridge-hardening work that preserves legacy paths.
4. Every execution wave must reduce legacy runtime surface.

## What to do first (planning outputs)

Wave P0 (planning-only readiness) is complete when:

1. First execution slice is selected and bounded to 1 domain.
2. Exit criteria are defined in player-visible terms and code-surface terms.
3. Test-lane ownership is explicit for the slice:
   1. C# UserFlowTests: player-observable flows only.
   2. JS/TS lane: compatibility/bridge/low-level transition assertions.
4. Legacy symbols to remove in the slice are listed up front.

## Execution waves (when explicitly approved)

### Wave 1: Test and boundary realignment

Purpose: stop adding debt while migration continues.

1. Move compatibility-style tests out of C# UserFlow tests into JS/TS lane.
2. Keep C# suite focused on player-observable behavior.
3. Publish and use review checklist enforcement (no CI hard-fail requirement).

Done when:

1. Target bridge/compat tests no longer live in `UserFlowTests`.
2. Equivalent JS/TS assertions exist and are runnable.
3. UserFlow naming and scope read like player journeys.

### Wave 2: High-impact canonical cutovers

Purpose: remove legacy runtime paths in the most coupled areas first.

Priority order:

1. Location/navigation runtime path cleanup.
2. Money/settings ownership cleanup.
3. Bladder simulation ownership cleanup.

Done when each slice:

1. Has one canonical write owner.
2. Has no slice-local compatibility path left behind.
3. Passes build, typecheck, and focused + userflow validation.

### Wave 3: Bridge infrastructure elimination

Purpose: remove global indirection points once slices are cut over.

1. Remove `connectToGameState()` and call sites.
2. Remove `expose*OnWindow()` state-bridge ownership behavior.
3. Remove bridge-era state indirection from save/load.

Done when:

1. `Object.defineProperty(window, ...)` is not used for gameplay state ownership.
2. No gameplay mutation depends on legacy globals.

### Wave 4: Final hardening

1. Save/load simplified to canonical snapshot model.
2. Type gates ratcheted per migrated domain.
3. Documentation reduced to active operating docs only.

## Deferred/removed from old Phase 2 plan

The following legacy-compatible planning concepts are intentionally removed:

1. Bridge hardening batches (for preserving compatibility behavior).
2. Compatibility fallback expansion.
3. Transitional mirror-specific acceptance criteria.
