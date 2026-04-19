# Working Agreement For Each PR/Batch

Each batch should include:

1. Variables migrated (list)
2. Bridges/setters deleted (count)
3. Tests run and result summary
4. Any temporary compatibility code added (must have removal note)

## Human-Readable Plan Rules (required)

1. Keep update notes short: max 5 bullets per section.
2. Prefer checklists and tables over long paragraphs.
3. Put status in one canonical place only (no duplicate status blocks across docs).
4. Move historical detail to dedicated history files instead of active execution docs.
5. Every status claim must include date + evidence line (build/typecheck/test result).

## Copilot Update Guardrails

1. Copilot may update existing sections but should not create new plan sections unless explicitly requested.
2. Copilot should not append freeform journals to active docs.
3. If Copilot adds more than 15 lines of narrative, condense to bullets before merge.
4. If a new doc is created, it must declare owner, purpose, and lifecycle (active, reference, or archive).

