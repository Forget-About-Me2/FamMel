# Quality Gate Policy

Intermediate refactor sessions and pre-merge validation have different burden/value tradeoffs. Clarify the distinction to unblock incremental progress without sacrificing release confidence.

### Intermediate Validation (per refactor session)

After each logical edit or small batch of edits **during** a refactor session:

1. **Build:** `node esbuild.config.mjs` exits 0 (no blockers).
2. **Typecheck:** `npx tsc -p . --noEmit` exits 0 (no net-new errors in touched files).
3. **Focused tests:** Run automated tests for the **changed slice only** (not full suite). Examples:
   - Changing player bladder thresholds → run `dotnet test UserFlowTests --filter "FullyQualifiedName~PersonPee_"` (4 player-bladder tests)
   - Changing location stack writes → run location invariant tests (2-3 focused checks)
   - Changing save/load serialization → run save/load userflow slice only
4. **No net-new failures:** Focused tests that passed before the edit must still pass (test hygiene, not full-game proof).

**Rationale:** This keeps feedback loops tight (5–10 min per edit), prevents obvious breakage in the touched area, and lets you batch 5–10 edits per session before deferring expensive full-game validation.

### Pre-Merge Validation (closing the slice/PR)

Before merging a completed refactor slice:

1. **Build + Typecheck:** Clean (no errors).
2. **Full userflow userflow twice:** Complete critical smoke suite (start, navigation, dialogue/action, store/inventory, save/load, **all 37+ navigation tests**) — must pass in **2 consecutive runs** (stability check).
3. **Manual regression for under-covered slices:** Replay gameplay scenarios that the userflow suite doesn't cover:
   - If bladder thresholds changed, play until pee state changes occur; verify legacy mirrors refresh correctly.
   - If location stack changed, navigate between 5+ venues and verify no stack corruption or soft-lock.
   - If money/inventory changed, trade items and verify canonical + legacy state stay in sync.
4. **Documented residual risk:** Any test or scenario not covered by the above must have an explicit note in the plan (owner, next action, risk tier).

**Rationale:** This happens once per slice boundary, not after every 15-line edit. It validates the whole game and catches cross-slice regressions before anyone else runs the code.

### What "Focused Tests" Means per Slice Type

- **Location stack (Slice 1):** Run location-specific navigation userflow + `LocationStack_*` invariant tests (3–5 tests, ~30s).
- **Bladder thresholds (Slice 2 Phase 1A):** Run `PersonPee_*` and `BladderGlobals_*` userflow tests (4 tests, ~15s).
- **Save/Load (Phase 1b):** Run `SaveLoad_*` userflow tests (2–3 tests, ~20s).
- **Companion state (any companion-specific change):** Run `PersonPee_Companion*` to verify companion thresholds don't interfere (1 test, ~5s).

If in doubt, ask: "Would a player in gameplay hit this change?" If yes, add a focused test; if no, it's not focused-scope for that session.

---
