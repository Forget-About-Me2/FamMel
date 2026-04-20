# Parking Lot (ordered by dependency; no active WIP)

### Ownership migrations (next up)

- [ ] Row D — `DriveState`: `WetTheCar`, `GasStation` (HIGH confidence, small — first row after location slice)
- [ ] Row C — `SessionOrProgressState` (`Late`, `Shopping`); `SettingsState` (`PlayerBladder`); `RuntimeConfigState` (closing times, `TimeSpeed` — likely immutable config, not mutable state)
- [ ] Row E — venue-scoped states: `BarState`, `ClubState`, `TheatreState`, `MakeOutState`, `HerHomeState`, `NavigationState`
- [ ] Row F — `SettingsState` (user options); `CompanionContextState` (`HerOutfit`, `FavoriteMovie`, `SuggestedLoc`)
- [ ] Row G — `CompanionProfileState` (`GirlName`, `BaseGirl`, `PantyColor`, etc.); `UIState` → move to `gameScreen` not `gameState`
- [ ] Row H/I — companion/player bladder SimulationCore → `gameState.Companion`/`gameState.Player`; event flag sub-objects
- [ ] Row J — move JSON content blobs off `gameState` to `ContentCache` singleton; `SexActions` → `RomanceState`
- [ ] Row A — `RelationshipState`: `HavePurse`, `OwedFavour`

### Infrastructure

- [ ] Phase 1b — replace saveLoad.ts setter registry with simple transitional approach
- [ ] Phase 2 Batch B1b — strengthen attraction/shyness bridge hardening (depends on B1a complete)
- [ ] Phase 2 Batch B2 — migrate attraction/shyness call sites to canonical reads/writes; retire bridge fallback (depends on B1b)
- [ ] Phase 2 Batches A, B, C–F — module ownership migrations *(status tracked in phase-2 doc; listed here for dependency ordering only)*
- [ ] Phase 3 — delete all bridge infrastructure (`connectToGameState`, `expose*OnWindow`)
- [ ] Phase 4 — final save/load simplification (direct `gameState` snapshot)
- [ ] Phase 5 — naming consistency pass, JSDoc on lifecycle functions, "How State Works" README section

### Known tech debt

- [ ] 46 type errors in `backPackItems.ts` (`IBackpackItem`/`IContainer` missing `volume` + `HTMLElement` property access)
- [ ] 7 type errors in `quotes.ts`
- [ ] 6 type errors in `yourHome.ts` (`CurrentLocation` naming mismatch)
- [ ] `TimeSinceLastFlirt` — likely dead state; confirm before removal
- [ ] `RandMax` — unclear behavioral relevance after bridge removal
- [ ] `PicSet` — purpose unclear vs render pipeline cache
- [ ] JSON positional arrays in `Json/locations/` — convert to named-property objects (see `makeOut.JSON` `theYard` as target format)
- [ ] `NoFlirtFlag`/`AllowedToFlirt` — inverse naming confusing; consider collapsing to one canonical flag
- [ ] `Person.TimeSinceLastPeed` references global `lastpeetime` — migrate to `this.lastPeeTime`

---

