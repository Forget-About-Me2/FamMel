# Start Here (Human Mode)

If you feel lost, ignore the full roadmap. Use this page only.

## 60-second version

If you only read one thing, read this:

1. We are not rewriting the game.
2. We are making one rule true: player bladder simulation has one owner (`gameState.Player`).
3. Legacy fields stay temporarily, but only as mirrors for old callers. 
4. One tiny validated step per session is enough.

Quick decision anchor:

- Use [bladder-ownership-map.md](bladder-ownership-map.md) before any bladder-related edit.

## What we are working toward

North star for this phase:

- One canonical owner for player bladder simulation: `gameState.Player` (`Person`).
- Legacy fields in `yourbladder.ts` stay only as compatibility mirrors.
- Old callers can still run, but they must route writes through canonical logic.

Phase 1A is done when:

1. Bladder threshold setters in `yourbladder.ts` no longer mutate legacy threshold fields as primary ownership.
2. Threshold writes delegate to canonical urge ownership and then mirror back for compatibility.
3. Focused bladder tests stay green after each small migration step.

Not the goal in this phase:

- Deleting all bridge code.
- Refactoring all bladder dialogue/scene flow.
- Converting the entire game to idiomatic TypeScript in one pass.

## What to do before any migration edit (design first, but small)

Yes, player and bladder behavior should be thought through before migration changes. Do this in lightweight form:

1. Write 2-4 behavior rules first (example: "need/emergency/lose thresholds stay internally consistent").
2. Pick one rule that the next edit must preserve.
3. Only then change code.

Do not wait for a perfect full design document. Use "just enough design" per step.

## Session start decision (use this every time)

1. Can I state the behavior rule this edit preserves?
2. Can I name the owner being moved toward (`gameState.Player`)?
3. Can I validate with build, typecheck, and focused bladder tests?

If any answer is no, do a no-code session (mapping or notes) instead of editing.

## What is relevant right now

Only one active unfinished slice matters:

- Slice 2: bladder model convergence in `bladder.ts` and `yourbladder.ts`

Everything else is secondary until this slice moves forward.

## Today's smallest useful task (pick this first)

Target:
- `scripts/yourbladder.ts`

Goal:
- Remove one direct write to legacy root-level `YourBlad*` simulation fields
- Route that write through canonical `gameState.Player` or a thin wrapper delegating to `Person`

Hard limits:
- Touch at most 1 file
- Spend at most 90 minutes
- Stop after one validated commit

## Validation for today (minimum gate)

1. `node esbuild.config.mjs`
2. `npx tsc -p . --noEmit`
3. `dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj --filter "FullyQualifiedName~PersonPee_|FullyQualifiedName~PlayerPee_|FullyQualifiedName~BladderGlobals_"`

If all pass, the session is a win.

## If you are too overloaded to code

Do this instead (still counts as progress):

1. Open `scripts/yourbladder.ts`
2. List direct writes to `YourBlad*` fields in a short note
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
