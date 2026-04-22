# Parking Lot (ordered by dependency; no active WIP)

Planning note (2026-04-22): this backlog is ordered for post-reboot sequencing and assumes no compatibility-layer additions.

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
- [ ] Wave 1 — [test framework realignment](wave-1-test-framework-realignment.md) (move compatibility/bridge assertions out of C# UserFlowTests)
- [ ] Wave 2 — domain cutovers in priority order (navigation -> settings/money -> bladder)
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

