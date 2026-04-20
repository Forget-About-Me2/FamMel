# FamMel — Data Models

**Generated:** 2026-04-20

FamMel has no database. All runtime state is held in TypeScript module-scoped variables and a central singleton. Persistent state is saved to browser `localStorage`. Game content (dialogue, items) is stored as JSON files.

---

## Core State Models

### `RuntimeContext` (central state singleton)

Exported as `gameState` from `scripts/gameState/gameState.ts`. Exposed on `window.gameState`.

| Field | Type | Description |
|-------|------|-------------|
| `Player` | `Person` | Player character state |
| `Companion` | `dateNPC` | NPC companion state |
| `LocStack` | `GameLocation[]` | Canonical location navigation stack |
| `LegacyLocStack` | `string[]` | Legacy bridge stack (string-based) |
| `Money` | `number` | Player's money (also mirrored as `window.money`) |
| `Time` | `Time` | In-game time object |
| `Interactions` | `InteractionState` | Per-venue flirt/interaction counters |
| `Romance` | `RomanceState` | Kiss, feel, arousal progression |
| `Late` | `number` | Flag: 1 when after closing time |
| `Shopping` | `number` | Flag: 1 while in store |
| `PlayerBladder` | `boolean` | Whether player bladder mechanic is active |
| `DrankChamp` | `number` | Champagne drunk counter |
| `TimeSpeed` | `number` | Time progression rate (ticks per action) |
| `ClubClosingTime` | `number` | Club closing time in ticks |
| `TheaterClosingTime` | `number` | Theatre closing time in ticks |
| `BarClosingTime` | `number` | Bar closing time in ticks |
| `DidIntro` | `boolean` | Whether the game introduction has been shown |
| `randCounter` | `number` | RNG cycle counter |

---

### `Person` (`scripts/gameState/Person.ts`)

Shared model for both Player and Companion characters.

| Field | Type | Description |
|-------|------|-------------|
| `Bladder` | `number` | Current bladder fill level |
| `Tummy` | `number` | Current stomach fill level |
| `MaxTummy` | `number` | Maximum stomach capacity |
| `MaxAlcohol` | `number` | Maximum alcohol capacity |
| `AlcoholInTummy` | `number` | Simulates diuretic effect |
| `_bladderUrge` | `number` | Threshold where first urge is felt |
| `MinUrge` | `number` | Minimum bladder level (decay floor) |
| `UnderWearColour` | `string` | Underwear color (affects dialogue) |
| `ItemsDrankSinceLastPee` | `IBackpackItem[]` | Items consumed since last bathroom visit |
| `TummyAverage` | `number` | Rolling average tummy level (10-tick window) |
| `lastPeeTime` | `number` | Game tick of last bathroom visit |
| `lastAskedToHoldTime` | `number` | Game tick of last "hold it" request |
| `legacyBladderMirror` | `"companion" \| "player"` | Which legacy globals to sync to |

---

### `BladderState` enum (`scripts/gameState/bladderState.ts`)

Represents urgency level for both companion and player:

| Value | Name | Numeric |
|-------|------|---------|
| No urgency | `Empty` | 0 |
| First awareness | `Urge` | 1 |
| Uncomfortable | `Need` | 2 |
| Critical | `Emergency` | 3 |
| Accident | `Lose` | 4 |
| Climax accident | `CumLose` | 5 |
| Sex accident | `SexLose` | 6 |

---

### `InteractionState` (nested in `RuntimeContext`)

Per-venue social interaction tracking, reset on venue change:

| Field | Type | Description |
|-------|------|-------------|
| `FlirtCounter` | `number` | Number of flirts this venue visit |
| `TimeSinceLastFlirt` | `number` | Ticks since last flirt attempt |
| `ChangeVenueFlag` | `boolean` | She wants to change venues |
| `CheckedHerOut` | `boolean` | Player has checked her out |
| `AllowedToFlirt` | `boolean` | Flirting is currently permitted |
| `ShowedNeed` | `boolean` | She has shown bladder need |
| `FlirtedFlag` | `number` | Flirt success count |
| `NoFlirtFlag` | `number` | Flirt failure count |
| `MaxFlirts` | `number` | Maximum flirts allowed this venue |
| `RandMax` | `number` | Randomization ceiling for interactions |
| `HavePurse` | `boolean` | Player currently has her purse |
| `OwedFavour` | `number` | How many favours she owes the player |

---

### `RomanceState` (nested in `RuntimeContext`)

Romantic progression tracking:

| Field | Type | Description |
|-------|------|-------------|
| `MaxKiss` | `number` | Kiss counter ceiling |
| `MaxFeel` | `number` | Feel counter ceiling |
| `Arousal` | `number` | Current arousal level |
| `KissCounter` | `number` | Number of kisses this session |
| `FeelCounter` | `number` | Number of feels this session |
| `FuckingNow` | `number` | Flag: currently in sex scene |
| `ChampagneCounter` | `number` | Champagne consumed (for scene gating) |

---

### `Time` (nested in `RuntimeContext`)

In-game time tracking:

| Field | Type | Description |
|-------|------|-------------|
| `thetime` | `number` | Raw tick counter (starts at 0, ~7 PM) |
| `hour` | `number` | Display hour (7-12, 1-12) |
| `minute` | `number` | Display minute (0-59) |
| `meridian` | `string` | "AM" or "PM" |

---

### `GameLocation` (`scripts/gameState/gameState.ts`)

Represents a navigable game location:

| Field | Type | Description |
|-------|------|-------------|
| `function` | `() => void` | Renders this location's screen |
| `category` | `LocationCategory` | Location type enum |
| `tag` | `string` | String identifier (used in legacy stack) |

`LocationCategory` enum values: `Start`, `Options`, `ExplainImg`, `HideScreen`, `CustomGirl`, `YourHome`, `GoStore`, `CallHer`, `DrinkingGame`

---

## Legacy Module-Scoped State

These variables live as `export let` in their respective modules and are mirrored via bridge setters. They represent the "old" ownership model being migrated away.

### Companion Bladder (`scripts/bladder.ts`)

| Variable | Type | Description |
|----------|------|-------------|
| `bladder` | `number` | Companion bladder fill |
| `tummy` | `number` | Companion stomach fill |
| `bladurge` | `number` | First urge threshold |
| `maxtummy` | `number` | Max stomach capacity |
| `maxbeer` | `number` | Max beer capacity |
| `drankbeer` | `number` | Beers drunk |
| `nowpeeing` | `boolean` | Currently peeing animation flag |
| `wetlegs` | `boolean` | Had an accident |
| `wetherpanties` | `boolean` | Panties are wet |

### Player Bladder (`scripts/yourbladder.ts`)

| Variable | Type | Description |
|----------|------|-------------|
| `yourbladder` | `number` | Player bladder fill |
| `yourtummy` | `number` | Player stomach fill |
| `yourbladurge` | `number` | Player first urge threshold |
| `ymaxtummy` | `number` | Player max stomach capacity |
| `ynowpeeing` | `boolean` | Player currently peeing flag |
| `holdself` | `boolean` | Player is holding themselves |

### Shared Time & Interaction (`scripts/shims.ts`)

| Variable | Type | Description |
|----------|------|-------------|
| `locStack` | `string[]` | Legacy location stack |
| `money` | `number` | Player money (mirrors `gameState.Money`) |
| `thetime` | `number` | Game tick counter |
| `attraction` | `number` | Current attraction score (0-100) |
| `shyness` | `number` | Current shyness score (0-100) |
| `playerbladder` | `boolean` | Player bladder enabled flag |
| `endScreens` | `any` | End-game screen data |
| `randcounter` | `number` | RNG cycle counter |

---

## Inventory / Item Model (`scripts/backPackItems.ts`)

### `IBackpackItem`

| Field | Type | Description |
|-------|------|-------------|
| `bpName` | `string` | Display name |
| `price` | `number?` | Purchase price |
| `value` | `number` | Bladder fill value or effect magnitude |
| `owned` | `string?` | Ownership category |
| `attr` | `number?` | Attraction modifier |
| `attrThresh` | `number?` | Attraction threshold for use |
| `attraction` | `number?` | Attraction gain on use |
| `emerAttr` | `number?` | Attraction gain in emergency |
| `holdCount` | `number?` | How many ticks item helps hold |
| `banLocs` | `string[]?` | Locations where item cannot be used |
| `functions` | `Array<[Function, string]>?` | Use actions on companion |
| `yFunctions` | `Array<[Function, string]>?` | Use actions on player |
| `togFunctions` | `Array<[Function, string]>?` | Toggle actions |
| `locations` | `string[]?` | Restricted use locations |
| `giveQuotes` | `string[][]?` | Dialogue when giving item |

---

## Settings Model (`scripts/settings/gameSettings.ts`)

### `GameSettings`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `PlayerBladder` | `boolean` | `true` | Enable/disable player bladder mechanic |
| `PlayerDrinkGame` | `boolean` | `true` | Player bladder in drinking game |
| `StartMoney` | `number` | `200` | Starting money |
| `ClubClosingTime` | `number` | `420` | Club closing (ticks, = 2 AM) |
| `TheaterClosingTime` | `number` | `180` | Theatre last showing (ticks, = 10 PM) |
| `BarClosingTime` | `number` | `360` | Bar closing (ticks, = 1 AM) |
| `TimeSpeed` | `number` | `2` | Ticks per action |
| `ImageChoice` | `ImageChoice` | `Ascii` | Images / ASCII / None |
| `ShowStats` | `boolean` | `true` | Show detailed bladder/tummy stats |
| `TummyDecayCycles` | `number` | `6` | Tummy averaging window |

---

## Save Format

State is serialized to `localStorage` under named slot keys. The save/load system (`saveLoad.ts`) uses a field registry: each field maps to a `{ get, set }` pair using direct ES module imports. This avoids any `window.*` dependency in the save path.

Slots: `slot1`, `slot2`, `slot3` (player-selectable)

Export/import is supported via JSON string (for backup/sharing).
