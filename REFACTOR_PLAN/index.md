# FamMel Refactor Plan

This index is the human-readable entry point.

If you read only 3 files, read these:

1. [Start Here (Human Mode)](start-here.md)
2. [Active Slices (current execution state)](active-slices-wip-limit-2.md)
3. [Quality Gate Policy (validation rules)](quality-gate-policy.md)

## Fast Navigation

### Daily Execution

- [Start Here (Human Mode)](start-here.md)
- [Active Slices (current execution state)](active-slices-wip-limit-2.md)
- [Low-Bandwidth Execution Mode (active)](low-bandwidth-execution-mode-active.md)
- [Working Agreement For Each PR/Batch](working-agreement-for-each-prbatch.md)

### What Is Next

- [Parking Lot (ordered by dependency; no active WIP)](parking-lot-ordered-by-dependency-no-active-wip.md)
- [Sequencing Rationale](sequencing-rationale.md)

### Rules And Boundaries

- [Quality Gate Policy](quality-gate-policy.md)
- [Boundary Rules (new baseline)](boundary-rules-new-baseline.md)
- [Migration Principles](migration-principles.md)
- [Ownership Discovery Strategy (when owners are unclear)](ownership-discovery-strategy-when-owners-are-unclear.md)
- [Document Hygiene](doc-hygiene.md)

### Completion And History

- [Completed](completed.md)
- [Phase 0: Forensics And Value Recovery (must run first)](phase-0-forensics-and-value-recovery-must-run-first.md)

### Detailed Phase Specs (read only when needed)

- [Phase 1: Organize GameState Into Domain Sub-Objects](phase-1-organize-gamestate-into-domain-sub-objects.md)
- [Phase 1b: Reset Save/Load To Transitional Simplicity](phase-1b-reset-saveload-to-transitional-simplicity.md)
- [Phase 2: Move State Ownership To gameState (Batches)](phase-2-move-state-ownership-to-gamestate-batches.md)
- [Phase 3: Remove Bridge Infrastructure](phase-3-remove-bridge-infrastructure.md)
- [Phase 4: Final Save/Load Simplification](phase-4-final-saveload-simplification.md)
- [Phase 5: Developer-Focused Hardening](phase-5-developer-focused-hardening.md)

### Legacy/Reference Docs

- [Strategic Intent](strategic-intent.md)
- [End State](end-state.md)
- [Execution Discipline (Commit Early + Boy Scout + Learning Loop)](execution-discipline-commit-early-boy-scout-learning-loop.md)
- [Why This Is More Maintainable](why-this-is-more-maintainable.md)

## Anti-Noise Rules For Plan Updates

1. Put execution status in one place only: [Active Slices (current execution state)](active-slices-wip-limit-2.md).
2. Put completion records in one place only: [Completed](completed.md).
3. Do not add narrative progress journals to index or policy pages.
4. If a change adds a new status section, remove the older duplicate section in the same commit.
