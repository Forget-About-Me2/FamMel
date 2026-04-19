# Execution Discipline (Commit Early + Boy Scout + Learning Loop)

### Commit Early, Often, and Slice-Based

Rules for this branch:

1. Each meaningful change slice gets its own commit (avoid mega-commits).
2. Commit at least once per completed validation checkpoint (build/test evidence attached in commit message or notes).
3. Keep commit scope single-purpose when possible:
   - test-only
   - behavior fix
   - refactor/mechanical move
   - cleanup/doc update
4. If a task grows past ~60-90 minutes without a safe commit point, split it and commit the stable part first.

Commit message pattern (recommended):

- `<type>: <short intent>`
- `Validation: <what ran + result>`
- `Risk: <known residual risk or "none noted">`

### Boy Scout Rule (Leave It Better)

When touching a file, do at least one small local improvement if safe:

1. remove dead code/path,
2. tighten confusing naming,
3. add or adjust a high-value assertion/test,
4. clarify one non-obvious block with a concise comment,
5. simplify one branch or duplicated snippet.

Guardrail: do not expand scope if the cleanup risks blocking the current slice; record deferred cleanup in this plan.

### Mistake Tracking and Learning Loop

Use `mistake-ledger.tsv` to track mistakes and convert them into process improvements.

For each notable mistake capture:

1. What happened,
2. Why it happened,
3. Detection signal,
4. Fix applied,
5. Preventive rule/check added.

Cadence:

1. Update ledger immediately after mistakes that cost time or created risk.
2. Review top recurring patterns every 5-10 commits.
3. Add one preventive action to this plan for any recurring mistake pattern.
