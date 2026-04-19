# Ownership Discovery Strategy (when owners are unclear)

This plan's domain blocks are suggestions, not locked architecture.

Use this 3-pass flow before moving any unresolved field:

1. **Evidence pass (no moves):**
   - For each field, collect where it is read and written.
   - Record write frequency and whether writes happen in one feature or many features.
   - Mark fields with unknown behavior as `DEFER` instead of guessing ownership.
2. **Lifecycle pass:**
   - Classify each field as one of:
     - `Session` (lives across most of a run),
     - `Scene` (only relevant in one location/flow),
     - `Cache` (loaded data blobs),
     - `LegacyBridge` (compatibility only),
     - `SimulationCore` (player/companion physiology models).
3. **Ownership pass (smallest safe move):**
   - Choose owner by primary writer (not by current comment block name).
   - If multiple unrelated writers exist, keep field on root for now and mark `KEEPROOT`.
   - If owner is still ambiguous, keep `DEFER` and add a short note in the touch log.

Decision rule:

- Move only when all are true:
  1. One clear primary writer exists.
  2. Save/load impact is understood.
  3. At least one validation test or userflow check covers the touched behavior.

Confidence labels for unresolved rows:

- `HIGH`: owner clear, single-writer or tightly-coupled writer set.
- `MEDIUM`: mostly clear, but has shared writes or weak test coverage.
- `LOW`: ambiguous ownership or unknown behavior impact (default to `DEFER`).

Practical guardrail:

- Do not force every field into a substate early. A temporary `KEEPROOT` is safer than a wrong owner that causes hidden regressions.
