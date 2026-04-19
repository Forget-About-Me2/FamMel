# Coverage Confidence Gate (Pre-Merge)

This is the **merge-time gate** (complements the intermediate validation policy above). Before each slice merges, all of the following must pass:

1. Build: `node esbuild.config.mjs` exits 0.
2. Typecheck: `npx tsc -p . --noEmit` exits 0 (or no net-new errors if temporary baseline is approved).
3. **Full userflow twice:** Critical smoke suite (start, navigation, dialogue/action, store/inventory, save/load, all ~37+ location tests) — 100% pass in **2 consecutive runs** (no flakes).
4. **Manual regression:** For each changed high-impact area (bladder, location stack, save/load, companion state), replay relevant gameplay scenarios per the focused test definitions above.
5. Residual untested risk documented with owner and follow-up action.
6. No blockers to merge (all critical userflow and manual regression checks green).

Global finalization rule (all phases/slices/steps):

1. A checklist item is not finalized (`[x]`) until validation evidence is recorded for that item.
2. For merge-time finalization: validation evidence must include full userflow test execution (all critical smoke tests in 2 runs) + manual regression for changed high-impact areas.
3. For intermediate checkpoints: validation evidence is focused tests (per slice type definition above) + build/typecheck clean.
4. If any userflow test fails during pre-merge validation, the slice remains open and the failure is logged with test name and status.
5. Any issue discovered during execution must be logged immediately in this plan with owner impact and follow-up action before marking the affected item complete.
6. When touching compatibility setters, bridge paths, or canonical-vs-legacy ownership logic, add/update usage-and-relevance documentation (JSDoc at function level plus a short project-level note when behavior expectations change).

**Stop condition:** any critical-path userflow failure or non-deterministic failure blocks merge.

> **Test prerequisite:** `UserFlowTests` Selenium suite requires a live dev server at `http://127.0.0.1:8080`. Run `npm run dev` before `dotnet test`.

---
