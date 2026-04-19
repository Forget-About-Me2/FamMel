# Bladder Ownership Map

Purpose: restore decision clarity for bladder-related migration work.

Use this before any edit:

1. Find the row your change belongs to.
2. If the row says canonical owner is Person/gameState, do not add new primary writes in bridge files.
3. Bridge files may mirror/expose for compatibility, but should delegate ownership writes.

## Ownership Table

| Concept | Canonical Owner | Bridge/Adapter Responsibility | Current Status |
|---|---|---|---|
| Base bladder urge (player/companion) | scripts/gameState/Person.ts | Accept legacy setter calls and delegate into canonical owner | Partial |
| Derived thresholds (need/emergency/lose/cumlose/sexlose) | scripts/gameState/Person.ts (derived from urge) | Mirror derived values for legacy readers in scripts/yourbladder.ts and scripts/bladder.ts | Partial |
| Bladder/tummy volume runtime state | gameState.Player and gameState.Companion | Keep legacy globals synchronized for old callers; do not become new write owner | Partial |
| Pee urgency state classification | scripts/gameState/Person.ts | Scene/dialog files consume classification outputs | Partial |
| Pee/wet/spurt scene orchestration | scripts/yourbladder.ts and scripts/bladder.ts | Keep narrative/UI flow, route simulation writes through canonical paths | Partial |
| Window/global compatibility surface | scripts/yourbladder.ts and scripts/bladder.ts | Expose legacy names and adapters only; no new long-term ownership | Ongoing |
| Save/load persistence source of truth | gameState canonical state | Translate for backward compatibility where needed | Partial |

## Practical Rule Set

1. If a value can be derived from urge, it is not a primary mutable owner field.
2. Compatibility setters are allowed during migration only if they delegate to canonical ownership.
3. Avoid direct writes to legacy threshold globals as primary logic.
4. New gameplay logic should not depend on bridge-only fields.

## Fast Decision Check (30 seconds)

Before merging a change, answer:

1. Did this edit move ownership toward scripts/gameState/Person.ts or away from it?
2. Did I preserve compatibility without creating a new legacy write owner?
3. Can I explain in one sentence which row above this change belongs to?

If any answer is no, do not merge yet.
