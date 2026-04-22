# Start Here (Human Mode)

If you feel lost, ignore the full roadmap. Use this page only.

## 60-second version

If you only read one thing, read this:

1. We are not rewriting the game.
2. We are making one rule true: the game runs on one canonical TypeScript runtime path.
3. Compatibility layers are no longer allowed.
4. One tiny validated deletion step per session is enough.

Quick decision anchor:

- Use [bladder-ownership-map.md](bladder-ownership-map.md) before any bladder-related edit.

## What we are working toward

North star for this phase:

- One canonical owner per gameplay concept in TypeScript.
- No runtime legacy mirrors, bridges, or dual-write behavior.
- Old callers are migrated or removed, not wrapped.

Current migration direction is done when:

1. Core gameplay loops have no dependency on legacy globals.
2. Every changed slice removes legacy runtime surface in the same PR.
3. Build, typecheck, and relevant userflow tests stay green after each slice.

Not the goal:

- Adding more compatibility infrastructure.
- Deferring deletion as a follow-up with no owner/date.
- Broad readability-only refactors that do not reduce legacy runtime surface.
- Enforcing migration-policy behavior only via CI hard-fail rules.

Test lane reminder:

- `UserFlowTests` (C#) = player-observable integration journeys.
- Compatibility/bridge/transition logic assertions belong in the JS/TS low-level test lane.

## What to do before any migration edit (design first, but small)

Yes, player and bladder behavior should be thought through before migration changes. Do this in lightweight form:

1. Write 2-4 behavior rules first (example: "need/emergency/lose thresholds stay internally consistent").
2. Pick one rule that the next edit must preserve.
3. Only then change code.

Do not wait for a perfect full design document. Use "just enough design" per step.

## Session start decision (use this every time)

1. Can I state the behavior rule this edit preserves?
2. Can I name the canonical owner this edit enforces?
3. Can I validate with build, typecheck, and focused tests for the touched slice?

If any answer is no, do a no-code session (mapping or notes) instead of editing.

## What is relevant right now

Only active slices that delete legacy runtime surface matter.

Everything else is secondary until it does.

## Today's smallest useful task (pick this first)

Target:
- One file with active legacy global writes in a gameplay path

Goal:
- Remove one direct legacy gameplay write path
- Replace it with direct canonical TypeScript ownership (no compatibility wrapper)

Hard limits:
- Touch at most 1 file
- Spend at most 90 minutes
- Stop after one validated commit

## Validation for today (minimum gate)

1. `node esbuild.config.mjs`
2. `npx tsc -p . --noEmit`
3. `dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj` (or targeted player-observable filter)

If all pass, the session is a win.

## If you are too overloaded to code

Do this instead (still counts as progress):

1. Open one currently touched gameplay file
2. List direct legacy global writes in a short note
3. Mark one write as "next to migrate"

That gives you a clear next move without forcing implementation today.

## Session log template

- Target:
- Behavior rule protected:
- Why this target:
- Files touched:
- Validation run:
- Result:
- Follow-up (single next step):
