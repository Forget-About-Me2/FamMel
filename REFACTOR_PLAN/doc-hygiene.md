# Document Hygiene

Purpose: keep refactor and triage docs short, readable, and non-duplicated.

## Canonical Sources

1. Active execution status: REFACTOR_PLAN/active-slices-wip-limit-2.md
2. Completed ledger: REFACTOR_PLAN/completed.md
3. Validation policy: REFACTOR_PLAN/quality-gate-policy.md
4. Triage decisions: triage-keep-defer-drop.tsv and triage-commit-lanes.csv

## Rules

1. Do not duplicate status sections across plan files.
2. Delete deprecated artifacts once they have no remaining consumers.
3. Keep only one canonical artifact per generated report type.
4. Do not keep transitional stub docs unless they are still needed for active consumers.
5. Keep active docs concise and current; move history to ledger/reference files.
6. Recheck project docs at least every few commits to prevent drift (default gate: every 5 commits since `docs/index.md` unless docs are already changed in working tree).

## Automation

Run:

```powershell
./scripts/doc-hygiene-check.ps1
```

Optional cadence tuning:

```powershell
./scripts/doc-hygiene-check.ps1 -MaxCommitsSinceDocsRefresh 3
```

The check fails when:

1. Deprecated artifacts still exist after consolidation.
2. Multiple plan docs contain STATUS headings.
3. Commit lag since `docs/index.md` exceeds the configured threshold and no pending docs changes exist.
