# Completed
| Row B — InteractionState (8 fields) | 2026-04-16 | FlirtCounter, TimeSinceLastFlirt, AllowedToFlirt, ShowedNeed, FlirtedFlag, NoFlirtFlag, MaxFlirts, RandMax — commit e890344 |
| Row B — RomanceState (7 fields) | 2026-04-17 | MaxKiss, MaxFeel, Arousal, KissCounter, FeelCounter, FuckingNow, ChampagneCounter |
| Phase 0 forensics baseline | 2026-04-16 | Triage artifacts generated; preserve-all from current head strategy validated |
| Navigation smoke (12/12) | 2026-04-16 | All navigation userflow tests green |
| Save/load integration (5/5) | 2026-04-16 | SaveAndLoad + ExportAndImport passing |

**Slice 1 gate now closed** — Phase 1A can now proceed without location-stack coupling constraints.

**STATUS: IN PROGRESS** (2026-04-18)
- Phase 1A runtime ownership cutover has started; save/load direction, role-safe `Person` syncing, and targeted `PersonPee_*` regressions are in place.
- Current validation snapshot: build clean, typecheck clean, targeted tests green, full userflow green in 2 consecutive runs (39/39 non-explicit after new tests).

**Phase 1A Ordered Implementation Checklist:**

1. [x] **Audit bladder variable reads/writes** — Map all call sites that access `Blad*` / `YourBlad*` globals.
   - Target files: `scripts/bladder.ts`, `scripts/yourbladder.ts`, all callers in `scripts/actions.ts`, `scripts/drive.ts`, `scripts/fuckHer.ts`, `scripts/locations/*.ts`
   - Validation: `grep -r "Blad\|YourBlad" scripts/ | grep -v "gameState"` (produce summary)
   - Gate: Audit complete, call-site count recorded

2. [x] **Ensure `Person` class has bladder thresholds** — Verify `gameState.Player` and `gameState.Companion` own simulation parameters.
   - Target: `scripts/gameState/person.ts` 
   - Required fields: `MaxBladder`, `BladderRate`, `threshold` (or equivalent)
   - Gate: Type check clean on Person, at least 2 threshold tests green

3. [x] **Canonicalize bladder writes in `bladder.ts`** — `updateurge()` and compatibility setters must write through `gameState.Companion` instead of treating root globals as owners.
   - Validation note (2026-04-19): removed remaining direct gameplay `bladder = ...` writes in runtime branches (`holdit`, `peephone`, `pGirlsRoom2`, `pTogether2`) and routed them through `setBladder(...)` so canonical companion state is now write authority with legacy mirroring.
   - Call sites: anywhere `Bladder` or `LastPee` are written
   - Bridge: `setUrge()` wrapper in shims for compatibility calls from legacy JS
   - Gate: `scripts/bladder.ts` build clean, no new type errors

4. [x] **Canonicalize bladder writes in `yourbladder.ts`** — `updateyoururge()` and compatibility setters must write through `gameState.Player` instead of treating root globals as owners.
   - Validation note (2026-04-19): canonical player gameplay writes remain `updateyoururge(...)`/`setYourbladurge(...)`; derived `yourblad*` threshold globals were re-demoted to legacy mirrors and canonical-to-legacy refresh now uses explicit helper `syncPlayerLegacyThresholdsFromCanonical(...)` to avoid round-tripping derived values back into canonical ownership.
   - Call sites: anywhere `YourBlad*` are written
   - Bridge: `setYourUrge()` wrapper in shims for compatibility calls
   - Gate: `scripts/yourbladder.ts` build clean, no new type errors

5. [x] **Update saveLoad.ts** — Load/save bladder state from `gameState.Player` / `gameState.Companion` only (not legacy root globals).
   - Validation note: corrected reversed ownership mapping so `blad*` serializes through `gameState.Companion` and `yourblad*` serializes through `gameState.Player`.
   - Target keys in JSON save: `player.bladder`, `companion.bladder` (or substate nesting)
   - Remove: any legacy `Bladder` / `LastPee` / `YourBlad*` keys
   - Gate: SaveAndLoad userflow test (5/5) still green after change

6. [ ] **Verify no dual writes** — Confirm all call sites use canonical `gameState` paths; legacy reads fallback only.
   - Progress (2026-04-19): player-side threshold bridge writes in `yourbladder.ts` are now canonical-first; remaining audit focus is non-player legacy mirror writes outside setter wrappers.
   - Grep: `Bladder =` (should find only shims wrappers + legacy JS)
   - Grep: `YourBlad =` (should find only shims wrappers + legacy JS)
   - Gate: No new direct writes found outside shims/legacy JS

Progress note (2026-04-19, Phase 1A player threshold cutover):

- Canonical player gameplay writes still flow through `updateyoururge(...)`, but derived `yourblad*` globals are now treated as legacy mirrors again rather than alternate canonical write inputs.
- Added explicit helper `syncPlayerLegacyThresholdsFromCanonical(...)` in `scripts/yourbladder.ts`; `Person.syncThresholdsToLegacy()` now uses that helper for player mirror refresh so pee/decay sync does not bounce through window property setters.
- Replaced the temporary global->canonical regression with `PlayerPee_CanonicalUrgeDecay_RefreshesLegacyDerivedThresholdMirrors` in `UserFlowTests/UserFlowTests/NavigationSmokeTests.cs` to guard the intended canonical->legacy mirror direction.
- Validation evidence: build (`node esbuild.config.mjs`) clean, typecheck (`npx tsc -p . --noEmit`) clean, targeted userflow parity tests green (4/4): `PersonPee_CompanionSyncsCompanionLegacyThresholdsOnly`, `PersonPee_PlayerSyncsPlayerLegacyThresholdsOnly`, `BladderGlobals_WindowAssignment_KeepsCanonicalParity_SameTick`, `PlayerPee_CanonicalUrgeDecay_RefreshesLegacyDerivedThresholdMirrors`.

7. [x] **Userflow validation (2 consecutive runs)** — Full suite green with bladder logic running on canonical state.
   - Validation note: targeted regressions green (`IncomingPhoneCall`, `SaveAndLoad`, `ExportAndImport`, `PersonPee_*`), plus 2 consecutive full non-explicit suite passes at 39/39.
   - Target: Start, navigation, dialogue, actions, store, save/load (critical smoke)
   - Gate: 39/39 green in run N and run N+1

**Next Priority After Phase 1A:** Row D — DriveState (`WetTheCar`, `GasStation`); then Row C — Session/Progress/Settings state fields.
| Darts integration (1/1) | 2026-04-16 | Dark bar darts entry + first-round advance |

---

- Slice 1 complete; Slice 2 Phase 1A can now execute without location constraints.
Purpose: stop split-brain state before further migration.
Checklist:

- [x] Create `docs/state-ownership-ledger.md` with one row per duplicated concept.
- [ ] For each row, classify as `MOVE` (canonicalize in `gameState`), `ADAPT` (bridge for now), or `LEAVE` (intentionally outside canonical state).
- [ ] Record exactly one write owner per row (`gameState` or legacy module).
- [ ] Record bridge direction (`legacy -> gameState` or `gameState -> legacy`) and explicit removal trigger.
- [ ] Add a guardrail rule: no new dual-write fields accepted.
- [ ] Prioritize and complete first 3 high-risk rows: `money`, `locStack/currentLocation`, bladder thresholds.

Progress note (2026-04-17):

- Money row completed: writer call sites migrated to gameState in core TS modules, `setMoney`/`setLastmoney` now compatibility-write into gameState, save/load money keys bind to gameState, and residual formatting reads now use gameState-backed values.
- Decision: keep legacy money forward-bridge keys temporarily as compatibility aliases only (not ownership).
- Remaining in this trio: execute location and bladder rows.

Exit criteria:

- No top-priority concept has ambiguous ownership.
- No bidirectional bridge remains for the first 3 high-risk rows.
- A first migration slice can be executed concept-by-concept instead of file-by-file.
