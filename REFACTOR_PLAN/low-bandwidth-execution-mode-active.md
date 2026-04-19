# Low-Bandwidth Execution Mode (active)

This section is the day-to-day operating mode when the full plan feels overwhelming.

### Rule 1: One small win per session

- Pick exactly one scoped target (one function or one file).
- Stop after that target is validated and committed.
- Do not chain extra cleanup tasks in the same session.

### Rule 2: Keep WIP low (default 1, hard cap 2)

- Default to one active task in progress.
- A second active task is allowed only when it directly unblocks the first task.
- Never exceed two active tasks total. 
- If a task requires touching more than 3 files, split it before starting.

### Rule 3: Use the minimum validation gate

For each session, require only:

1. Build passes (`node esbuild.config.mjs`).
2. Typecheck passes (`npx tsc -p . --noEmit`) or no net-new errors in touched files.
3. One focused test slice for the changed area.

### Rule 4: Progress tracking is evidence, not ambition

- A session counts as progress only when there is:
   - one small commit,
   - one short note in this plan under the relevant slice,
   - and validation evidence.
- Ignore percent complete estimates; track only closed, validated increments.

### Rule 5: Recovery first, acceleration second

- If state clarity is low, spend the next session on mapping current behavior before changing code.
- Never "fix everything" in one pass.

### Next-session template (copy/paste)

- Target:
- Why this target:
- Files touched:
- Validation run:
- Result:
- Follow-up (single next step):

