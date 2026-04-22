# Phase 1: Organize GameState Into Domain Sub-Objects

Planning note (2026-04-22): This document contains valuable ownership discovery history, but parts of its execution guidance predate the no-compatibility-layer rule. Treat it as reference/history unless a section is explicitly re-approved in the active wave plan.

Purpose: consolidate the 100+ scattered fields on GameState into logically grouped sub-objects (InteractionState, VenueState, CompanionState, etc.) so the architecture reflects domain logic instead of chaos.

Current state: Partially done — fields have been added to GameState but remain flat and scattered.

Target sub-objects (domains identified):

- **InteractionState**: Flirt, Kiss, Feel counters; Arousal; Champagne tracking
- **DriveState**: WetTheCar, GasStation, related counters
- **VenueState**: Venue-specific tracking (BarTopic, Loser, ExternalFlirt, WetPhoto, IsNude, PoseCtr, OutfitCtr, MovieCounter, MovieChoice, etc.)
- **LocationState**: Location progression, visited tracking (already partially done with `LocStack`)
- **TimeState**: Time tracking (already exists as `Time` object — validate integration)
- **CompanionState**: Companion needs (Bladder, Tummy, Energy, etc.) — currently still in bridged form, migrate to here
- **PlayerState**: Player-specific state (Money, PlayerBladder, Inventory) — rationalize ownership

Batch order (bottom-up from smallest):

- [ ] 1a: Create `InteractionState` class, move Flirt/Kiss/Feel/Arousal fields, update all read/write sites
- [ ] 1b: Create `DriveState` class, move Drive-related fields
- [ ] 1c: Create `VenueState` class, move all venue-specific tracking fields
- [ ] 1d: Verify CompanionState/PlayerState are properly encapsulated (may already be done)
- [ ] 1e: Rationalize remaining orphan fields (ChangeVenueFlag, CheckedHerOut, etc.) into appropriate sub-object or document why they stay top-level

After each sub-object completion:
- Update all call sites to use `gameState.Interactions.KissCounter` instead of `gameState.KissCounter`
- Run build/typecheck/tests to validate
- Commit with "refactor: [SubObject] migration" and test evidence

Exit criteria:
- No field remains on root GameState that logically belongs in a sub-object
- All tests still pass
- Code is semantically clearer (KissCounter is now in `Interactions`, not ambiguous at root)

### Phase 1A: Bladder Model Convergence (in scope, required)

Why this exists:

- `Person` already contains shared bladder/tummy logic.
- `bladder.ts` and `yourbladder.ts` duplicate threshold/volume fields (`Blad*` vs `YourBlad*`).
- `gameState` currently stores duplicated copies of both sets of fields, increasing drift risk.

Canonical ownership target:

- Shared simulation values live on `gameState.Player` and `gameState.Companion` (`Person` instances).
- Role-specific tuning remains as config/input (initial urge, min urge percent, event thresholds).
- Legacy module fields become compatibility aliases only, then are removed.

Execution order:

1. Stop introducing new root-level `Blad*` and `YourBlad*` properties.
2. Migrate threshold reads/writes to `gameState.Player` and `gameState.Companion` getters (`bladderUrge`, `bladderNeed`, etc.).
3. Move shared calculations (`updateurge`, `updateyoururge`, decay math) behind `Person` methods.
4. Keep only scenario/event flags in row H/I that are not simulation core.
5. Remove duplicate bridge mappings from `shims.ts` once call sites are migrated.

Ordered implementation checklist (test-gated):

1. Inventory + freeze write-paths
   - [x] Produce a call-site inventory of writes to `Blad*` / `YourBlad*` in `bladder.ts`, `yourbladder.ts`, `main.ts`, and `shims.ts`.
   - [x] Add a short "no new write paths" touch-log entry in this section before code edits.
   - Validation gate: build + typecheck + userflow evidence.
2. Person-first threshold API adoption
   - [ ] Route threshold reads in `bladder.ts` and `yourbladder.ts` to `gameState.Companion` / `gameState.Player` (`Person`) values.
   - [ ] Keep wrappers transitional and one-directional (`Person` -> legacy compatibility), never reverse ownership.
   - Validation gate: run targeted bladder/location smoke tests and ensure no behavior regression in urgency/need/desperation transitions.
3. Shared update logic consolidation
   - [ ] Move duplicated urge/decay calculations into `Person` methods (or one shared helper called by both wrappers).
   - [ ] Keep scene/event flags (`Peed*`, `NowPeeing`, `GottaGoFlag`, etc.) out of simulation-core moves in this slice.
   - Validation gate: typecheck + targeted regression tests for bladder progression loops.
4. Save/load canonicalization
   - [ ] Ensure save/load serialization/deserialization uses `gameState.Player` and `gameState.Companion` for simulation-core bladder fields.
   - [ ] Keep compatibility aliases only where legacy readers still exist.
   - Validation gate: save/load integration tests pass.
5. Bridge quarantine + cleanup
   - [ ] Remove duplicate `shims.ts` mappings for migrated simulation-core fields.
   - [ ] Update Row H/I tracker checkboxes only for fields truly migrated in this slice.
   - Final gate: build, typecheck, full userflow suite green in 2 consecutive runs.

Step 1 write-path inventory (2026-04-18):

- `scripts/bladder.ts`
   - Baseline declarations/setters: `bladurge`, `bladneed`, `blademer`, `bladlose`, `bladcumlose`, `bladsexlose`, `bladder`, `bladDec`, `bladDespDec`.
   - Runtime threshold mutations: `updateurge()` writes `bladurge`, `bladneed`, `blademer`, `bladlose`, `bladcumlose`, `bladsexlose`.
   - Runtime volume resets: `flushdrank()` and wetting-path logic set `bladder = 0`.
- `scripts/yourbladder.ts`
   - Baseline declarations/setters: `yourbladurge`, `yourbladneed`, `yourblademer`, `yourbladlose`, `yourbladcumlose`, `yourbladsexlose`, `yourbladder`.
   - Runtime threshold mutations: `updateyoururge()` writes `yourbladurge`, `yourbladneed`, `yourblademer`, `yourbladlose`, `yourbladcumlose`, `yourbladsexlose`.
   - Runtime volume resets: `flushyourdrank()` sets `yourbladder = 0`.
- `scripts/main.ts`
   - Bridged sync writes into canonical state: `gameState.Companion.Bladder = Number(bladder) || 0`, `gameState.Player.Bladder = Number(yourbladder) || 0`.
   - Bridged compatibility writes back to legacy globals: `setBladder(...)`, `setBladurge(...)` + `updateurge(bladurge)`, `setYourbladder(...)`, `setYourbladurge(...)` + `updateyoururge(yourbladurge)`.
- `scripts/shims.ts`
   - No direct `Blad*` / `YourBlad*` write sites found in this file during Step 1 scan; bladder compatibility writes are currently centralized in `scripts/main.ts` and legacy bladder modules.

Step 1 touch-log (freeze note, 2026-04-18):

- Freeze rule applied: no new write-paths to duplicated root-level `Blad*` / `YourBlad*` fields will be introduced outside existing compatibility wrappers during Phase 1A.
- Validation evidence: `node esbuild.config.mjs` and `npx tsc -p . --noEmit` executed after inventory update with no reported failures.
- Userflow evidence (global finalization gate): `dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj` executed on 2026-04-18; result failed (1/38) at `IncomingPhoneCall_AnswerPath_ShowsCantWaitDialogue_WithoutErrors` in `UserFlowTests/UserFlowTests/YourHomeIntegrationTests.cs`.
- Step 1 finalization status: pending until userflow gate is green.

Current progress:

- [x] Guardrail agreed: do not add new legacy setter/global dependencies while converging bladder models.
- [x] Player read-only threshold consumers in `yourbladder.ts` (`youpee()`, `displayyourneed()`, `youbathroomlocked()`, `ypeein()`, `ypeein3()`, `ypeeoutside()`) now read canonical `gameState.Player` thresholds first, with legacy `yourblad*` values retained only as fallback compatibility mirrors.
- [x] `flushyourdrank()` now reads canonical `gameState.Player` thresholds (`bladderUrge`, `bladderEmer`, `bladderLose`) first for decay branch decisions, while preserving existing compatibility write paths through `updateyoururge(...)`.
- [x] Window compatibility getters for `yourblad*` in `exposeYourBladderOnWindow()` now read canonical `gameState.Player` thresholds first, eliminating remaining direct legacy threshold read call sites in `yourbladder.ts` outside fallback mirror plumbing.
- [ ] Next implementation slice: move threshold ownership to `Person` without expanding legacy imports or legacy setter calls in `main.ts`.
- [ ] Remaining: migrate call sites that still read threshold globals directly in `bladder.ts` / `yourbladder.ts`.

Exit criteria:

- No duplicated threshold pairs remain (`Blad*` and `YourBlad*`) as independent runtime sources of truth.
- `bladder.ts` and `yourbladder.ts` use shared simulation helpers or `Person` methods.
- Save/load captures player/companion simulation state from `gameState.Player` and `gameState.Companion`.

### Phase 1 Property Tracker (Rows Are Canonical)

Use this as the only property list. Each property appears once.

Rules:

1. Update checkbox state in the same commit as code changes.
2. Keep one active row at a time until build/typecheck/tests pass.
3. Add touch-log entries only for properties changed in that commit.

Legend:

- `[ ]` Not migrated
- `[x]` Migrated
- `[ ] KEEPROOT` Stays on root intentionally
- `[ ] DEFER` Ownership unresolved

#### Row A: Core Root

- [ ] KEEPROOT Player
- [ ] KEEPROOT Companion
- [ ] KEEPROOT Time
- [ ] KEEPROOT LocStack
- [ ] KEEPROOT LegacyLocStack
- [ ] KEEPROOT LastMoney
- [ ] KEEPROOT LastAttraction
- [ ] KEEPROOT LastShyness
- [ ] KEEPROOT DidIntro

Probable substates from this row:

- `RelationshipState`: `HavePurse`, `OwedFavour`

- [ ] HavePurse -> RelationshipState
- [ ] OwedFavour -> RelationshipState

#### Row B: InteractionState (closed)

- [x] FlirtCounter
- [x] TimeSinceLastFlirt
- [x] AllowedToFlirt
- [x] ShowedNeed
- [x] FlirtedFlag
- [x] NoFlirtFlag
- [x] MaxFlirts
- [x] MaxKiss -> RomanceState
- [x] MaxFeel -> RomanceState
- [x] RandMax
- [x] Arousal -> RomanceState
- [x] KissCounter -> RomanceState
- [x] FeelCounter -> RomanceState
- [x] FuckingNow -> RomanceState
- [x] ChampagneCounter -> RomanceState
- [x] DrankChamp -> RomanceState
- [x] CheckedHerOut -> InteractionState
- [x] ChangeVenueFlag -> InteractionState

Probable substates from this row:

- `InteractionState`: `FlirtCounter`, `TimeSinceLastFlirt`, `AllowedToFlirt`, `ShowedNeed`, `FlirtedFlag`, `NoFlirtFlag`, `MaxFlirts`, `RandMax`
- `RomanceState`: `MaxKiss`, `MaxFeel`, `Arousal`, `KissCounter`, `FeelCounter`, `FuckingNow`, `ChampagneCounter`
- `InteractionState`: `CheckedHerOut`, `ChangeVenueFlag`
- `RomanceState`: `DrankChamp`

Row B ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Next action | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `FlirtCounter` | `actions.ts` via `setFlirtcounter`, `main.ts` decrements `gameState.Interactions.FlirtCounter` | `actions.ts`, `backPackItems.ts` | HIGH | `InteractionState` | keep as-is | Migrated | Looks stable after Romance slice; keep as regression sentinel for interaction loop |
| `TimeSinceLastFlirt` | no active writes found outside declaration/bridge | none obvious | LOW | `DEFER` | locate intended usage before migration step | Migrated | Might be dead state; confirm if any legacy timing mechanic still depends on it |
| `AllowedToFlirt` | `main.ts` sets `gameState.Interactions.AllowedToFlirt = true` | none obvious | MEDIUM | `InteractionState` | keep in interaction until contrary evidence | Migrated | Name is clear, but semantic overlap with NoFlirtFlag should be documented |
| `ShowedNeed` | `bladder.ts` via `setShowedneed`, `main.ts` clears `gameState.Interactions.ShowedNeed` | `backPackItems.ts` conditions | HIGH | `InteractionState` | keep as interaction signal | Migrated | Is fine name, maybe add to companion npc |
| `FlirtedFlag` | `actions.ts` via `setFlirtedflag`, `drive.ts` resets | `backPackItems.ts` conditions | HIGH | `InteractionState` | keep as-is | Migrated | Reset behavior ties to venue transition; verify if all hard scene exits clear this |
| `NoFlirtFlag` | legacy setter path in `shims.ts` only | `backPackItems.ts` conditions | MEDIUM | `InteractionState` | keep, confirm write source during slice | Migrated | Inverse naming with AllowedToFlirt is confusing; may collapse to one canonical flag |
| `MaxFlirts` | legacy setter path in `shims.ts` | `backPackItems.ts` conditions | MEDIUM | `InteractionState` | keep, confirm runtime configurability | Migrated | Treat as tuning config if it never changes mid-run |
| `RandMax` | legacy setter path in `shims.ts` | no clear direct reads beyond bridge | LOW | `DEFER` | confirm if still behaviorally relevant | Migrated | Candidate for deletion if unused after bridge removal |
| `MaxKiss` | legacy setter path in `shims.ts` | `actions.ts`, `fuckHer.ts`, `herhome.ts` via legacy import | HIGH | `RomanceState` | migrate with romance counters in same slice | Migrated | I think this might be a constant actually |
| `MaxFeel` | legacy setter path in `shims.ts` | `actions.ts` gating | HIGH | `RomanceState` | migrate with romance counters in same slice | Migrated | idem  |
| `Arousal` | heavy writes in `actions.ts` and `fuckHer.ts` | heavy reads in `fuckHer.ts` | HIGH | `RomanceState` | migrate as first romance field | Migrated | Validate usage and philosphy behind it  |
| `KissCounter` | writes in `actions.ts`, `fuckHer.ts` reset path | reads in `actions.ts`, `fuckHer.ts`, `herhome.ts` | HIGH | `RomanceState` | migrate with `Arousal` | Migrated |  |
| `FeelCounter` | writes in `actions.ts` | reads in `actions.ts` | HIGH | `RomanceState` | migrate with `Arousal` | Migrated |  |
| `FuckingNow` | writes in `fuckHer.ts` | reads in `bladder.ts` | HIGH | `RomanceState` | migrate with compatibility alias temporarily | Migrated |  |
| `ChampagneCounter` | writes in `backPackItems.ts` and legacy setter | reads in `backPackItems.ts`, `herhome.ts` | HIGH | `RomanceState` | migrate with champagne flow tests | Migrated |  |
| `DrankChamp` | writes via `setDrankChamp` in `backPackItems.ts`; canonicalized in save/load | reads in `fuckHer.ts` bridge mapping and romance flow checks | HIGH | `RomanceState` | ownership resolved in deferred-field slice; canonical owner is `gameState.DrankChamp` | Migrated | This is actually a flag indicating champagne was drunk to determine whether she invites you to the bedroom. I think this might actualy be used as a counter which is not obvious from the name|
| `CheckedHerOut` | writes in `actions.ts`, `drive.ts` reset; canonicalized in shims/save-load bridges | imported/used in interaction-heavy paths | HIGH | `InteractionState` | ownership resolved in deferred-field slice; canonical owner is `gameState.Interactions.CheckedHerOut` | Migrated | Could become richer attraction history event instead of raw flag |
| `ChangeVenueFlag` | writes in `drive.ts`, `bladder.ts`, `main.ts` reset; canonicalized in shims/save-load bridges | checked in `bladder.ts` and venue routing | HIGH | `InteractionState` | ownership resolved in deferred-field slice; canonical owner is `gameState.Interactions.ChangeVenueFlag` | Migrated | Name is imperative; consider VenueChangePending |

Row B closure note (2026-04-18):

1. Deferred ownership decisions are complete: `DrankChamp` -> Romance, `CheckedHerOut` -> Interaction, `ChangeVenueFlag` -> Interaction.
2. Row B is fully migrated and no deferred fields remain in this row.
3. Follow-up only: naming/semantics cleanup candidates (`RandMax`, `TimeSinceLastFlirt`) can be handled outside ownership migration.

Row B progress: 18/18 migrated

### Discovered Substate Taxonomy (from full evidence pass)

Accumulated from rows A–J evidence passes. This supersedes the original Phase 1 target sub-objects list.

| Substate | Fields going in | Spawned from row | Status |
|---|---|---|---|
| `InteractionState` | FlirtCounter, TimeSinceLastFlirt, AllowedToFlirt, ShowedNeed, FlirtedFlag, NoFlirtFlag, MaxFlirts, RandMax | B | ✅ Migrated |
| `RomanceState` | MaxKiss, MaxFeel, Arousal, KissCounter, FeelCounter, FuckingNow, ChampagneCounter | B | ✅ Migrated |
| `RelationshipState` | HavePurse, OwedFavour | A | 🔲 Planned |
| `DriveState` | WetTheCar, GasStation | D | 🔲 HIGH confidence — ready for Phase 2 Batch A |
| `SettingsState` | ShowStats, EnableImages, EnableAscii, PlayerGame, MultipleMoves, RstMoves, PhotoChoice, PlayerBladder | F + C | 🔲 Planned; user-facing/toggle-style options only |
| `RuntimeConfigState` *(new)* | ClubClosingTime, TheaterClosingTime, BarClosingTime, TimeSpeed | C | 🔲 Non-user-facing constants/tuning; keep out of user settings bucket |
| `CompanionContextState` *(new)* | HerOutfit, FavoriteMovie, SuggestedLoc | F | 🔲 Companion preference/context values; not user settings |
| `SessionOrProgressState` | Late, Shopping, BrokeIce, SawHerPee, ToldStories, LastStory | C + H | 🔲 Planned; Row C only contributes Late and Shopping after config fields split off |
| `CompanionProfileState` *(new)* | PantyColor, GirlName, CustomGirlName, BaseGirl, GirlTalk, GirlGasp | G | 🔲 Discovered in Row G evidence pass; companion identity/appearance |
| `UIState` *(new)* | Comma, ImagePrev, AllowItems | G | 🔲 Discovered in Row G; consider moving to `gameScreen` not `gameState` |
| `BarState` *(new)* | BarTopic, Loser | E | 🔲 Venue-scoped |
| `ClubState` *(new)* | ExternalFlirt, WetPhoto, IsNude, PoseCtr, OutfitCtr | E | 🔲 Venue-scoped |
| `TheatreState` *(new)* | RrMovieLineThresh, MovieCounter, MovieChoice, AskedFavourite, SeenMovie | E | 🔲 Venue-scoped |
| `MakeOutState` *(new)* | AskedSwim, WalkCounter | E | 🔲 Venue-scoped |
| `HerHomeState` *(new)* | PrePeed, ElevatorWaitCounter, FloorCounter, HomeChampagne | E + G | 🔲 Venue-scoped |
| `NavigationState` *(new)* | EmerBreak, EmerHold | E | 🔲 Transition event flags; not venue-specific |
| `CompanionBladderEventState` *(new)* | PeedTowels, PeedVase, PeedShot, PeedOutside, NotDesperate, NotHDesperate, RrLockedFlag, SheSpurted, WetLegs, WetHerPanties, NowPeeing, GottaGoFlag, AskHoldItCounter, WaitCounter | H | 🔲 Scene event flags split from simulation core |
| `PlayerBladderEventState` *(new)* | HoldSelf, YNowPeeing, YouSpurted, YRrLockedFlag | I | 🔲 Scene event flags split from simulation core |
| `ContentCache` *(new — not on gameState)* | All Row J JSON blobs except SexActions | J | 🔲 These should not be on gameState; move to a separate singleton |
| `gameState.Companion` (Person) | Row H SimulationCore fields | H | 🔲 Phase 1A — already planned |
| `gameState.Player` (Person) | Row I SimulationCore fields | I | 🔲 Phase 1A — already planned |



#### Row C: SessionOrProgressState

- [ ] Late
- [ ] Shopping
- [ ] PlayerBladder -> SettingsState
- [ ] ClubClosingTime -> RuntimeConfigState
- [ ] TheaterClosingTime -> RuntimeConfigState
- [ ] BarClosingTime -> RuntimeConfigState
- [ ] TimeSpeed -> RuntimeConfigState

Row C ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `Late` | shims.ts forward-bridge only | `bladder.ts` checks in pee loop | MEDIUM | `SessionOrProgressState` | Set when time > 75; genuine session state | Not migrated | hmm, could make sense in some sort of general time keeping block  |
| `Shopping` | `store.ts` via `setShopping(1)`, reset unclear | `store.ts` | HIGH | `SessionOrProgressState` | Single writer, scene-level session flag | Not migrated | Could also make sense in like a thehome ownership |
| `PlayerBladder` | `settings.ts` via `setPlayerbladder`, `main.ts` reads from `gameSettings` | `main.ts`, `backPackItems.ts`, `theMakeOut.ts` | HIGH | `SettingsState` | Game toggle option; should remain in user-settings ownership (rename candidate: `PlayerBladderEnabled`) | Not migrated | Might make sense to have it be called like playerBladderEnabled |
| `ClubClosingTime` | shims.ts default only | `theClub.ts`, `debugMenu.ts` | HIGH | `RuntimeConfigState` | Static runtime tuning; not user-facing, and likely should live in config/constants instead of mutable game state | Not migrated | I don't think closingtype is currently an expose setting, but it is a constant so might not make sense to be in gamestate at all |
| `TheaterClosingTime` | shims.ts default only | `theatre.ts` | HIGH | `RuntimeConfigState` | Static runtime tuning; not user-facing | Not migrated | Same as before |
| `BarClosingTime` | shims.ts default only | `theBar.ts` | HIGH | `RuntimeConfigState` | Static runtime tuning; not user-facing | Not migrated | Idem  |
| `TimeSpeed` | shims.ts default only | `gameState.ts` tick math | HIGH | `RuntimeConfigState` | Tick-rate tuning; runtime config, not player-facing option | Not migrated | Idem |

> **Updated ownership split:** `Late` and `Shopping` are true session progress flags. `PlayerBladder` belongs to user-facing `SettingsState`. `ClubClosingTime`, `TheaterClosingTime`, `BarClosingTime`, and `TimeSpeed` belong to non-user-facing `RuntimeConfigState` (and should likely be immutable config rather than mutable game state).

#### Row D: DriveState

- [ ] WetTheCar
- [ ] GasStation

Row D ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `WetTheCar` | `bladder.ts` via `setWetthecar(1)` | `drive.ts` (conditional quote) | HIGH | `DriveState` | Single writer (`bladder.ts`), single reader (`drive.ts`); classic drive scene outcome flag | Not migrated | Good early migration candidate to validate DriveState batch mechanics |
| `GasStation` | `driveAround.ts` via `setGasStation` | `bladder.ts` cross-checks, `driveAround.ts` | HIGH | `DriveState` | Owned entirely by the drive-around flow; no cross-domain readers | Not migrated | Potential rename to HasGasStationStop for boolean readability |

Both fields are HIGH confidence. `DriveState` is the right owner. These are also eligible for an early confidence batch migration (Phase 2 Batch A).

#### Row E: VenueState

- [ ] BarTopic
- [ ] Loser
- [ ] ExternalFlirt
- [ ] WetPhoto
- [ ] IsNude
- [ ] PoseCtr
- [ ] OutfitCtr
- [ ] RrMovieLineThresh
- [ ] MovieCounter
- [ ] MovieChoice
- [ ] AskedFavourite
- [ ] SeenMovie
- [ ] AskedSwim
- [ ] WalkCounter
- [ ] PrePeed
- [ ] ElevatorWaitCounter
- [ ] FloorCounter
- [ ] EmerBreak
- [ ] EmerHold

Row E ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `BarTopic` | `theBar.ts` | `theBar.ts` | HIGH | `BarState` | Single-venue, single-module | Not migrated | Currently used to I believe give the index of the current bartopic in a json list somewhere.|
| `Loser` | `theBar.ts` | `theBar.ts` | HIGH | `BarState` | Single-venue | Not migrated | This variavle name is non obvious what it's about |
| `ExternalFlirt` | `theClub.ts` | `bladder.ts` (3 reads), `drive.ts` (reset) | HIGH | `ClubState` | Cross-read by bladder but write-owned by club | Not migrated | Consider rename to ExternalFlirtActive/happened for boolean intent |
| `WetPhoto` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue | Not migrated | Might be clearer as WetPhotoTaken (event outcome naming) |
| `IsNude` | `theClub.ts` | `theClub.ts`, `fuckHer.ts` | HIGH | `ClubState` | Used in sex flow too — worth tracking | Not migrated | Might make sense to be in companion class |
| `PoseCtr` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue | Not migrated | This name is a bit vague |
| `OutfitCtr` | `theClub.ts` | `theClub.ts` | HIGH | `ClubState` | Single-venue | Not migrated | this name is a bit vague |
| `RrMovieLineThresh` | `theatre.ts` | `bladder.ts` (threshold check) | HIGH | `TheatreState` | Cross-read but write-owned by theatre | Not migrated | this name is a bit vague |
| `MovieCounter` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue | Not migrated | Confirm reset semantics on re-entry to avoid soft-locks |
| `MovieChoice` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue | Not migrated | Normalize to explicit constants/enum values if choices expand |
| `AskedFavourite` | `theatre.ts` | `theatre.ts` | HIGH | `TheatreState` | Single-venue | Not migrated | Rename candidate: HasAskedFavourite |
| `SeenMovie` | `theatre.ts` via `setSeenmovie` | `locations.ts`, `herhome.ts` | MEDIUM | `TheatreState` | Cross-module read for unlock logic; still theatre-owned | Not migrated | Couple migration with unlock-flow tests due cross-module reads |
| `AskedSwim` | `theMakeOut.ts` | `theMakeOut.ts` | HIGH | `MakeOutState` | Single-venue | Not migrated | Could be a cooldown/once-per-scene flag; clarify intent in name |
| `WalkCounter` | `theMakeOut.ts` | `theMakeOut.ts` | HIGH | `MakeOutState` | Single-venue | Not migrated | Clarify unit (steps/turns/scenes) in code comment or docs |
| `PrePeed` | `herhome.ts` via `setPrepeed` | `herhome.ts` | HIGH | `HerHomeState` | Single-venue | Not migrated | I belive herhome is at the end of the game while the prepeed is only used once in the beginning |
| `ElevatorWaitCounter` | `herhome.ts` | `herhome.ts` | HIGH | `HerHomeState` | Single-venue (from saveLoad import evidence) | Not migrated | Rename candidate: ElevatorWaitTurns |
| `FloorCounter` | `herhome.ts` (direct mutation) | `herhome.ts` | HIGH | `HerHomeState` | Single-venue | Not migrated | Rename candidate: CurrentFloorStep |
| `EmerBreak` | `locations.ts` | `locations.ts`, `bladder.ts` | MEDIUM | `NavigationState` (new) | Not venue-specific; fires during location transitions | Not migrated | Non obviou what this is for from the name |
| `EmerHold` | `locations.ts` | `locations.ts`, `bladder.ts` | MEDIUM | `NavigationState` (new) | Same as EmerBreak — navigation event flag | Not migrated | Not obvious what this is for from the name |

> **New ownership types discovered:**
> - `BarState`, `ClubState`, `TheatreState`, `MakeOutState`, `HerHomeState`: venue-scoped sub-objects. `VenueState` as a single flat class would be too big — these are better as separate classes per venue, similar to how `RomanceState` is separate from `InteractionState`.
> - `NavigationState` (new): `EmerBreak`/`EmerHold` are not venue-owned; they fire during the `go()` / `leavehm()` transitions. A lightweight `NavigationState` (or `TransitionState`) captures these.

#### Row F: SettingsState

- [ ] HerOutfit -> CompanionContextState
- [ ] FavoriteMovie -> CompanionContextState
- [ ] SuggestedLoc -> CompanionContextState
- [ ] MultipleMoves
- [ ] RstMoves
- [ ] PhotoChoice
- [ ] ShowStats
- [ ] EnableImages
- [ ] EnableAscii
- [ ] PlayerGame

Row F ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `HerOutfit` | `settings.ts` via `setHeroutfit` | `drive.ts`, `fuckHer.ts`, `herhome.ts`, `actions.ts`, `bladder.ts`, `backPackItems.ts` | HIGH | `CompanionContextState` | Companion context/identity value, not a user-facing setting toggle | Not migrated | Should initialize once and then mutate only from clothing/game events |
| `FavoriteMovie` | `settings.ts` | `theatre.ts` | HIGH | `CompanionContextState` | Companion preference seed/context, not a player option menu toggle | Not migrated | If randomized, keep deterministic seed path for tests |
| `SuggestedLoc` | `locations.ts` (6 writes), `drive.ts` (reset) | `drive.ts` reads, `locations.ts` checks | HIGH | `CompanionContextState` | Runtime recommendation context, not a user setting | Not migrated | Might eventually warrant a dedicated RecommendationState |
| `MultipleMoves` | `settings.ts` | `fuckHer.ts` | HIGH | `SettingsState` | Game option | Not migrated | Name is opaque; ensure UI label explains behavior |
| `RstMoves` | `settings.ts` | `fuckHer.ts` | HIGH | `SettingsState` | Game option; flag to reset move set | Not migrated | Rename candidate: ResetMovesEachTurn |
| `PhotoChoice` | `settings.ts` | `images.ts` | HIGH | `SettingsState` | Set by player preference | Not migrated | Verify persistence contract between local storage and save/load |
| `ShowStats` | `settings.ts` | `gameScreen/statusBar.ts` | HIGH | `SettingsState` | UI preference | Not migrated | Good first candidate in Settings migration slice |
| `EnableImages` | `settings.ts`, `images.ts` | `images.ts` | HIGH | `SettingsState` | UI option | Not migrated | Validate fallback text flow when disabled |
| `EnableAscii` | `settings.ts` | unclear | HIGH | `SettingsState` | UI option | Not migrated | Check whether this is mutually exclusive with EnableImages |
| `PlayerGame` | `settings.ts` | unclear | MEDIUM | `SettingsState` | Unclear semantics — likely enable/disable player bladder mini-game | Not migrated | Clarify meaning before migration to avoid preserving hidden ambiguity |

Row F is currently mixing multiple concerns.  
Refined split:
- keep true user-facing options in `SettingsState` (`ShowStats`, `EnableImages`, `EnableAscii`, `PlayerGame`, `MultipleMoves`, `RstMoves`, `PhotoChoice`, `PlayerBladder`)
- move non-user-facing tuning constants (`*ClosingTime`, `TimeSpeed`) to `RuntimeConfigState`
- move companion context fields (`HerOutfit`, `FavoriteMovie`, `SuggestedLoc`) to `CompanionContextState`

#### Row G: NarrativeState

- [ ] PantyColor
- [ ] GirlName
- [ ] CustomGirlName
- [ ] BaseGirl
- [ ] GirlTalk
- [ ] GirlGasp
- [ ] Comma
- [ ] ImagePrev
- [ ] AllowItems
- [ ] HomeChampagne
- [ ] PicSet

Row G ownership evidence snapshot (2026-04-17):

| Property | Primary writes observed | Cross-module reads observed | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|---|
| `PantyColor` | `backPackItems.ts` (`setPantycolor`), `bladder.ts` | `bladder.ts`, `fuckHer.ts`, `herhome.ts` | HIGH | **CompanionProfileState** (new) | Companion appearance state, not generic narrative | Not migrated | Strong candidate to centralize writes through companion profile API |
| `GirlName` | `quotes.ts` / game init | `backPackItems.ts`, `herhome.ts`, `bladder.ts`, many | HIGH | **CompanionProfileState** (new) | Companion identity; wide reads, single init write | Not migrated | Ensure cache invalidation if custom naming changes mid-run |
| `CustomGirlName` | `settings.ts` | `quotes.ts` | HIGH | **CompanionProfileState** (new) | Companion identity | Not migrated | Document precedence between base/default/custom naming |
| `BaseGirl` | `settings.ts` | `actions.ts`, `quotes.ts` | HIGH | **CompanionProfileState** (new) | Companion visual variant | Not migrated | Rename candidate: CompanionArchetype |
| `GirlTalk` | `quotes.ts` / game init | Used across all dialogue | HIGH | **CompanionProfileState** (new) | Companion speech prefix | Not migrated | Could be derived from GirlName; avoid storing redundant string state |
| `GirlGasp` | `quotes.ts` / game init | `bladder.ts`, `backPackItems.ts` | HIGH | **CompanionProfileState** (new) | Companion speech prefix variant | Not migrated | Could be derived from GirlName; avoid storing redundant string state |
| `Comma` | `backPackItems.ts` | `backPackItems.ts` | HIGH | **UIState** (new) | Purely a rendering helper for the inventory description builder; not narrative state | Not migrated | High chance this can be removed and computed inline |
| `ImagePrev` | `images.ts` | `images.ts` | HIGH | **UIState** (new) | Previous image cache for dedup; pure UI | Not migrated | Should remain session-only and excluded from save payload |
| `AllowItems` | `main.ts`, `drive.ts`, `herhome.ts` (many callers) | `backPackItems.ts`, `herhome.ts` | HIGH | **UIState** (new) | Controls backpack button visibility; cross-venue UI gate | Not migrated | Rename candidate: IsItemUseEnabled |
| `HomeChampagne` | `backPackItems.ts` | `backPackItems.ts`, `herhome.ts` | HIGH | **HerHomeState** | Already identified in Row E; poured/first-glass tracker for her home | Not migrated | Validate first-visit vs repeat-visit behavior after migration |
| `PicSet` | unclear — bridge only visible | `images.ts` | LOW | `DEFER` | Purpose unclear; likely image rendering mode flag | Not migrated | Investigate if redundant with ImagePrev or render pipeline cache |

> **New ownership types discovered:**
> - `CompanionProfileState` (new): `PantyColor`, `GirlName`, `CustomGirlName`, `BaseGirl`, `GirlTalk`, `GirlGasp` are companion identity/appearance. These don't belong in NarrativeState — they belong on the companion model. Consider adding them to `dateNPC` / `Companion` or as a separate `CompanionProfileState`.
> - `UIState` (new): `Comma`, `ImagePrev`, `AllowItems` are runtime UI flags that control rendering, not game logic. They don't belong on gameState at all in the long term — they could live on `gameScreen` or a dedicated UI state object.

#### Row H: CompanionBladderState

Scope note: split this row while migrating.
- Simulation-core fields should converge into `gameState.Companion` (`Person`) and be removed from root.
- Scenario/event flags can remain in row H until a later behavior refactor.

- [ ] CustomUrge
- [ ] MinUrge
- [ ] MinPerc
- [ ] BladUrge
- [ ] BladNeed
- [ ] BladEmer
- [ ] BladLose
- [ ] BladCumLose
- [ ] BladSexLose
- [ ] MaxTummy
- [ ] MaxBeer
- [ ] Tummy
- [ ] Bladder
- [ ] BladDec
- [ ] BladDespDec
- [ ] Seal
- [ ] BeerDecCounter
- [ ] YBeerDecCounter
- [ ] PeedTowels
- [ ] PeedVase
- [ ] PeedShot
- [ ] PeedOutside
- [ ] LastPeeTime
- [ ] TimeHeld
- [ ] DrankBeer
- [ ] NotDesperate
- [ ] NotYDesperate
- [ ] NotHDesperate
- [ ] SpurtThresh
- [ ] YSpurtThresh
- [ ] BribeAskThresh
- [ ] BribeAskBase
- [ ] TumAvg
- [ ] RrLockedFlag
- [ ] SheSpurted
- [ ] BrokeIce
- [ ] SawHerPee
- [ ] WetLegs
- [ ] WetHerPanties
- [ ] NowPeeing
- [ ] GottaGoFlag
- [ ] AskHoldItCounter
- [ ] WaitCounter
- [ ] ToldStories
- [ ] LastStory

Row H ownership evidence snapshot (2026-04-17):

| Property | Lifecycle | Confidence | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|---|
| `CustomUrge` | SimulationCore — per-companion urge threshold config | HIGH | `gameState.Companion` (Person) | Already on `Person` as simulation params | Not migrated |  |
| `MinUrge` | SimulationCore — per-companion urge threshold config | HIGH | `gameState.Companion` (Person) | Already on `Person` as simulation params | Not migrated |  |
| `MinPerc` | SimulationCore — per-companion urge threshold config | HIGH | `gameState.Companion` (Person) | Already on `Person` as simulation params | Not migrated |  |
| `BladUrge` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `BladNeed` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `BladEmer` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `BladLose` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `BladCumLose` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `BladSexLose` | SimulationCore — urge thresholds | HIGH | `gameState.Companion` (Person) | Converge with `Person` bladder model | Not migrated |  |
| `MaxTummy` | SimulationCore — volume state | HIGH | `gameState.Companion` (Person) | Core simulation values | Not migrated |  |
| `MaxBeer` | SimulationCore — volume state | HIGH | `gameState.Companion` (Person) | Core simulation values | Not migrated |  |
| `Tummy` | SimulationCore — volume state | HIGH | `gameState.Companion` (Person) | Core simulation values | Not migrated |  |
| `Bladder` | SimulationCore — volume state | HIGH | `gameState.Companion` (Person) | Core simulation values | Not migrated |  |
| `BladDec` | SimulationCore — decay rates | HIGH | `gameState.Companion` (Person) | Rate constants; go with Person | Not migrated |  |
| `BladDespDec` | SimulationCore — decay rates | HIGH | `gameState.Companion` (Person) | Rate constants; go with Person | Not migrated |  |
| `Seal` | SimulationCore — decay rates | HIGH | `gameState.Companion` (Person) | Rate constants; go with Person | Not migrated |  |
| `BeerDecCounter` | Scene counters | MEDIUM | `gameState.Companion` (Person) or `SessionState` | Counting drink cycles — borderline | Not migrated |  |
| `YBeerDecCounter` | Scene counters | MEDIUM | `gameState.Companion` (Person) or `SessionState` | Counting drink cycles — borderline | Not migrated |  |
| `PeedTowels` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome flags; not simulation-core — keep in Row H or separate event sub-object | Not migrated |  |
| `PeedVase` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome flags; not simulation-core — keep in Row H or separate event sub-object | Not migrated |  |
| `PeedShot` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome flags; not simulation-core — keep in Row H or separate event sub-object | Not migrated |  |
| `PeedOutside` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome flags; not simulation-core — keep in Row H or separate event sub-object | Not migrated |  |
| `LastPeeTime` | SimulationCore — time tracking | HIGH | `gameState.Companion` (Person) | Used in desperation pacing | Not migrated |  |
| `TimeHeld` | SimulationCore — time tracking | HIGH | `gameState.Companion` (Person) | Used in desperation pacing | Not migrated |  |
| `DrankBeer` | Session counter | MEDIUM | `gameState.Companion` (Person) | Tracks drinks for tummy simulation | Not migrated |  |
| `NotDesperate` | Scene flags | MEDIUM | `CompanionBladderEventState` | Cooldown flags for vocalizations | Not migrated |  |
| `NotYDesperate` | Scene flags | MEDIUM | `CompanionBladderEventState` | Cooldown flags for vocalizations | Not migrated |  |
| `NotHDesperate` | Scene flags | MEDIUM | `CompanionBladderEventState` | Cooldown flags for vocalizations | Not migrated |  |
| `SpurtThresh` | SimulationCore — event thresholds | HIGH | `gameState.Companion` (Person) | Rate/threshold constants | Not migrated |  |
| `YSpurtThresh` | SimulationCore — event thresholds | HIGH | `gameState.Companion` (Person) | Rate/threshold constants | Not migrated |  |
| `BribeAskThresh` | SimulationCore — event thresholds | HIGH | `gameState.Companion` (Person) | Rate/threshold constants | Not migrated |  |
| `BribeAskBase` | SimulationCore — event thresholds | HIGH | `gameState.Companion` (Person) | Rate/threshold constants | Not migrated |  |
| `TumAvg` | SimulationCore | HIGH | `gameState.Companion` (Person) | Running average for tummy fill rate | Not migrated |  |
| `RrLockedFlag` | Scene flag | HIGH | `CompanionBladderEventState` | Bathroom locked during rr scene | Not migrated |  |
| `SheSpurted` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome states | Not migrated |  |
| `BrokeIce` | Session progress | MEDIUM | `SessionOrProgressState` | Track unique events that don't reset between locations | Not migrated |  |
| `SawHerPee` | Session progress | MEDIUM | `SessionOrProgressState` | Track unique events that don't reset between locations | Not migrated |  |
| `WetLegs` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome states | Not migrated |  |
| `WetHerPanties` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome states | Not migrated |  |
| `NowPeeing` | Scene event flags | HIGH | `CompanionBladderEventState` | Outcome states | Not migrated |  |
| `GottaGoFlag` | Scene flags | HIGH | `CompanionBladderEventState` | Short-lived scene interaction flags | Not migrated |  |
| `AskHoldItCounter` | Scene flags | HIGH | `CompanionBladderEventState` | Short-lived scene interaction flags | Not migrated |  |
| `WaitCounter` | Scene flags | HIGH | `CompanionBladderEventState` | Short-lived scene interaction flags | Not migrated |  |
| `ToldStories` | Session progress | HIGH | `SessionOrProgressState` | Story tracking persists across locations | Not migrated |  |
| `LastStory` | Session progress | HIGH | `SessionOrProgressState` | Story tracking persists across locations | Not migrated |  |

> **New sub-type clarification for Row H:** Splitting into two groups:
> - **SimulationCore** → converge into `gameState.Companion` (`Person`): all threshold/volume/rate fields.
> - **`CompanionBladderEventState`** (new label for the scene flags that stay separate): `PeedTowels`, `PeedVase`, `PeedShot`, `PeedOutside`, `NotDesperate`, `NotHDesperate`, `RrLockedFlag`, `SheSpurted`, `WetLegs`, `WetHerPanties`, `NowPeeing`, `GottaGoFlag`, `AskHoldItCounter`, `WaitCounter`.

#### Row I: PlayerBladderState

Scope note: split this row while migrating.
- Simulation-core fields should converge into `gameState.Player` (`Person`) and be removed from root.
- Scenario/event flags can remain in row I until a later behavior refactor.

- [ ] YourBladder
- [ ] YourTummy
- [ ] YourTumAvg
- [ ] HoldSelf
- [ ] YourBladUrge
- [ ] YourBladNeed
- [ ] YourBladEmer
- [ ] YourBladLose
- [ ] YourBladCumLose
- [ ] YourBladSexLose
- [ ] YMaxTummy
- [ ] YMaxBeer
- [ ] YourCustomUrge
- [ ] YMinUrge
- [ ] YNowPeeing
- [ ] YLastPeeTime
- [ ] YTimeHeld
- [ ] YDrankCocktails
- [ ] YDrankSodas
- [ ] YDrankWaters
- [ ] YDrankBeers
- [ ] YDrankBeer
- [ ] YRrLockedFlag
- [ ] YouSpurted

Row I ownership evidence snapshot (2026-04-17):

Row I mirrors Row H exactly, with all fields belonging to `gameState.Player` (`Person`) for SimulationCore fields and a `PlayerBladderEventState` for scene flags. Confidence is HIGH for the split — the `Y*` prefix is exactly parallel to the companion's un-prefixed set.

| Property | Lifecycle | Provisional owner | Migration state | Your notes |
|---|---|---|---|---|
| `YourBladder` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourTummy` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourTumAvg` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `HoldSelf` | Scene/event flag | `PlayerBladderEventState` (new) | Not migrated |  |
| `YourBladUrge` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourBladNeed` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourBladEmer` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourBladLose` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourBladCumLose` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourBladSexLose` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YMaxTummy` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YMaxBeer` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YourCustomUrge` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YMinUrge` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YNowPeeing` | Scene/event flag | `PlayerBladderEventState` (new) | Not migrated |  |
| `YLastPeeTime` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YTimeHeld` | SimulationCore | `gameState.Player` (Person) | Not migrated |  |
| `YDrankCocktails` | Drink counter | `gameState.Player` (Person) or `SessionState` | Not migrated |  |
| `YDrankSodas` | Drink counter | `gameState.Player` (Person) or `SessionState` | Not migrated |  |
| `YDrankWaters` | Drink counter | `gameState.Player` (Person) or `SessionState` | Not migrated |  |
| `YDrankBeers` | Drink counter | `gameState.Player` (Person) or `SessionState` | Not migrated |  |
| `YDrankBeer` | Drink counter | `gameState.Player` (Person) or `SessionState` | Not migrated |  |
| `YRrLockedFlag` | Scene/event flag | `PlayerBladderEventState` (new) | Not migrated |  |
| `YouSpurted` | Scene/event flag | `PlayerBladderEventState` (new) | Not migrated |  |

#### Row J: ContentCacheState

- [ ] Settings
- [ ] StatsBars
- [ ] EndScreens
- [ ] SexActions
- [ ] CalledJsons
- [ ] LocJson
- [ ] FlirtResps
- [ ] FeelUp
- [ ] Kissing
- [ ] YPeeLines
- [ ] PeeLines
- [ ] Needs
- [ ] YNeeds
- [ ] DrinkLines
- [ ] Appearance
- [ ] Drive
- [ ] General
- [ ] Darts
- [ ] SexLines
- [ ] ObjQuotes
- [ ] Locations
- [ ] SharedLoc
- [ ] Bar
- [ ] TalkUnused
- [ ] Club
- [ ] Theatre
- [ ] MakeOut
- [ ] HerHome

Row J ownership evidence snapshot (2026-04-17):

| Property | Category | Provisional owner | Notes | Migration state | Your notes |
|---|---|---|---|---|---|
| `Settings` | Deep mutable config | `ContentCacheState` or `gameSettings` | Loaded once, treated as config blobs; already on gameState | Not migrated |  |
| `StatsBars` | Deep mutable config | `ContentCacheState` or `gameSettings` | Loaded once, treated as config blobs; already on gameState | Not migrated |  |
| `EndScreens` | Deep mutable config | `ContentCacheState` or `gameSettings` | Loaded once, treated as config blobs; already on gameState | Not migrated |  |
| `SexActions` | Sex scene data | `ContentCacheState` (should move to `RomanceState`) | Mutable runtime object (action queue/state) | Not migrated |  |
| `CalledJsons` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `LocJson` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `FlirtResps` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `FeelUp` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Kissing` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `YPeeLines` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `PeeLines` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Needs` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `YNeeds` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `DrinkLines` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Appearance` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Drive` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `General` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Darts` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `SexLines` | Sex scene data | `ContentCacheState` | Loaded in `fuckHer.ts`; cache lines | Not migrated |  |
| `ObjQuotes` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Locations` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `SharedLoc` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Bar` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `TalkUnused` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Club` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `Theatre` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `MakeOut` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |
| `HerHome` | Loaded JSON blob | `ContentCacheState` | Read-only after load; cache blob | Not migrated |  |

> **Key observation for Row J:** These are **not runtime state** — they are load-once content blobs. They should not be serialized in save/load. Future action: move them off `gameState` entirely to a `ContentCache` singleton, leaving `gameState` only for mutable runtime state. `SexActions` is the one exception — it is mutable (tracks current action queue) and should live on `RomanceState`.



#### Touch Log (append-only)

| Date | Property | Action | Target | Commit | Notes |
|---|---|---|---|---|---|
| 2026-04-16 | FlirtCounter | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | TimeSinceLastFlirt | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | AllowedToFlirt | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | ShowedNeed | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | FlirtedFlag | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | NoFlirtFlag | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | MaxFlirts | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-16 | RandMax | migrated | Interactions | e890344 | first interaction slice |
| 2026-04-17 | MaxKiss | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | MaxFeel | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | Arousal | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | KissCounter | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | FeelCounter | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | FuckingNow | migrated | Romance | pending | Row B romance ownership slice |
| 2026-04-17 | ChampagneCounter | migrated | Romance | pending | Row B romance ownership slice |

