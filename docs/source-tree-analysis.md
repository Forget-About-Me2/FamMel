# FamMel — Source Tree Analysis

**Generated:** 2026-04-20

---

## Project Root

```
FamMel/
├── index.html                      # ★ Game host page — the only HTML file
├── style.css                       # Game CSS
├── package.json                    # Node dependencies and npm scripts
├── tsconfig.json                   # TypeScript config (type-check only, noEmit)
├── esbuild.config.mjs              # ★ Build config — bundles app.ts → dist/app.js
├── CHANGELOG.md                    # Player-facing version history
├── README.md                       # Project readme
├── Dockerfile                      # Container for static serving
│
├── scripts/                        # ★ All TypeScript source (see below)
├── dist/                           # Build output — git-ignored
│   └── app.js                      # Bundled game code (+ app.js.map)
│
├── Json/                           # ★ Game data (dialogue, items, config)
├── icons/                          # UI icons (backpack, GitHub)
├── docs/                           # Project documentation
├── REFACTOR_PLAN/                  # Active migration planning documents
├── UserFlowTests/                  # ★ Selenium/NUnit integration tests
│
└── _bmad/                          # BMAD workflow config and skills
    └── bmm/config.yaml             # Project config (user_name, paths, etc.)
```

---

## `scripts/` — TypeScript Source

```
scripts/
│
├── app.ts                          # ★ Bundle entry point
│                                   #   Imports all modules, calls exposeXxxOnWindow(),
│                                   #   starts game on DOMContentLoaded
│
├── main.ts                         # ★ Game loop
│                                   #   go(location) — location transition
│                                   #   start() — initialization
│                                   #   gamestart() — begin game after settings
│
├── globals.d.ts                    # Type declarations for window globals
│
├── shims.ts                        # ★ Legacy global state bridge
│                                   #   locStack, money, thetime, attraction,
│                                   #   shyness, playerbladder, endScreens, etc.
│                                   #   Exposed on window via exposeShimsOnWindow()
│
├── quotes.ts                       # ★ Dialogue & choice system
│                                   #   fetchAndCacheJson(), sayText(), setText()
│                                   #   printAllChoices(), actionRegistry
│                                   #   initDelegatedClickHandler()
│
├── bladder.ts                      # ★ Companion bladder mechanics
│                                   #   bladder, tummy, urgency thresholds,
│                                   #   peein(), displayneed(), updateurge()
│
├── yourbladder.ts                  # ★ Player bladder mechanics
│                                   #   yourbladder, yourtummy, ypeein()
│                                   #   Mirror of bladder.ts for player character
│
├── saveLoad.ts                     # Save/load system
│                                   #   saveToSlot(), loadFromSlot(), hasSave()
│                                   #   deleteSave(), exportSave(), importSave()
│                                   #   Field-registry pattern (direct ES module imports)
│
├── backPackItems.ts                # Inventory / item system
│                                   #   IBackpackItem, backpack, haveItem()
│                                   #   buyItem(), useItem(), openPopUp()
│
├── actions.ts                      # Flirt and social actions
│                                   #   flirt_l(), flirt_m(), flirt_h()
│                                   #   kissher(), externalflirt()
│
├── fuckHer.ts                      # Intimate scene logic
│                                   #   Sex scene flow, champagne counter,
│                                   #   fuckHerSetup()
│
├── herhome.ts                      # Her home location logic
├── yourHome.ts                     # Player home location logic
├── store.ts                        # Store purchase logic
├── drive.ts                        # Driving mechanics & wet-the-car state
├── debugMenu.ts                    # Debug menu (dev tool)
├── images.ts                       # Image loading and display helpers
├── clothes.ts                      # Clothing/outfit helpers
├── locations.ts                    # Location registry / lookup
├── pop-up.ts                       # Pop-up overlay (backpack)
├── validation.ts                   # Input validation utilities
├── settings.ts                     # Legacy settings accessor (bridge)
│
├── gameState/                      # ★ State management
│   ├── gameState.ts                #   RuntimeContext singleton (gameState)
│   │                               #   LocationCategory enum, GameLocation class
│   │                               #   Time class, InteractionState, RomanceState
│   ├── Person.ts                   #   Character model (bladder, tummy, stats)
│   └── bladderState.ts             #   BladderState enum (Empty→SexLose)
│
├── gameScreen/                     # ★ UI rendering
│   ├── gameScreen.ts               #   Top-level UI façade
│   ├── contentScreen.ts            #   Main content area (#textsp)
│   ├── statusBar.ts                #   Stats bar (money, attraction, time, etc.)
│   ├── animationManager.ts         #   ASCII/image animation
│   ├── imageManager.ts             #   Image loading
│   └── PopUps/                     #   Pop-up overlays
│
├── settings/                       # Game settings
│   ├── gameSettings.ts             #   GameSettings class + enums
│   ├── imageSettings.ts            #   Image path config
│   ├── imageType.ts                #   ImageChoice enum
│   ├── companionSettings.ts        #   Per-companion overrides
│   └── settingsManager.ts          #   Settings load/save
│
├── models/                         # Enums
│   ├── baseCompanion.ts            #   baseCompanion enum (Jennifer/Laura/Karen/Melissa)
│   ├── movie.ts                    #   Movie enum
│   └── outfit.ts                   #   Outfit enum
│
├── helperFiles/                    # Utilities
│   ├── helperFunctions.ts          #   assertExists(), getRandomValueFromNormalDistribution()
│   └── documentFunctions.ts        #   DOM utility helpers
│
├── locations/                      # Per-location game logic
│   ├── driveAround.ts              #   Drive around / gas station
│   ├── theBar.ts                   #   Bar location (drinking game, sell panties)
│   ├── theClub.ts                  #   Club (dancing, darts, photo game)
│   ├── theatre.ts                  #   Movie theatre
│   └── theMakeOut.ts               #   Make-out spot
│
└── games/                          # Mini-games
    └── darts.ts                    #   Darts mini-game
```

---

## `Json/` — Game Data

```
Json/
├── general.JSON                    # General dialogue, need descriptions
├── flirting.JSON                   # Flirt dialogue trees
├── drinking.JSON                   # Drinking game dialogue
├── drive.JSON                      # Driving dialogue
├── herhome.JSON                    # Her home dialogue
├── fuckHer.JSON                    # Intimate scene dialogue
├── shepee.JSON                     # Companion bathroom dialogue
├── youpee.JSON                     # Player bathroom dialogue
├── options.JSON                    # Settings screen text
├── objects.JSON                    # Item/backpack descriptions
├── start.JSON                      # Start/intro dialogue
├── homeScreen.json                 # Home screen content
├── yourhome.json                   # Player home content
├── appearance.JSON                 # Appearance/outfit text
├── statsBars.JSON                  # Status bar label text
├── storeQuotes.json                # Store dialogue
├── phoneCall.json                  # Phone call dialogue
├── endScreens.JSON                 # End-of-game screens
├── needs.JSON                      # Her needs display text
├── yneeds.JSON                     # Your needs display text
├── credits.json                    # Credits screen
│
├── locations/                      # Per-location dialogue
│   ├── locations.JSON              # Location names/metadata
│   ├── driveAround.JSON            # Driving
│   ├── makeOut.JSON                # Make-out spot (theYard = named-property target format)
│   ├── theBar.JSON                 # Bar
│   ├── theClub.JSON                # Club
│   └── theatre.JSON                # Theatre
│
└── games/                          # Mini-game data
```

---

## `UserFlowTests/` — Integration Tests

```
UserFlowTests/
├── UserFlowTests.sln               # .NET solution
├── README.md                       # Test suite docs
└── UserFlowTests/
    ├── UserFlowTests.csproj        # .NET 8 project (NUnit + Selenium)
    ├── GlobalUsings.cs             # Global using statements
    ├── DriverExtensions.cs         # Selenium helper extensions
    ├── NavigationSmokeTests.cs     # Page load and basic navigation
    ├── SceneIntegrationSmokeTests.cs  # Scene entry/exit
    ├── YourHomeIntegrationTests.cs # Player home flows
    ├── DartsIntegrationTests.cs    # Darts mini-game
    ├── EndgameIntegrationTests.cs  # End-of-game screens
    ├── TheMovieTest.cs             # Movie theatre flow
    ├── PickherupTest.cs            # Initial companion pickup
    ├── RandomSeedDeterminismTest.cs # RNG determinism
    └── MelissaBy.cs                # Melissa companion flows
```

---

## `REFACTOR_PLAN/` — Migration Planning

Active planning docs for the JS→TS migration. Key files:

| File | Purpose |
|------|---------|
| `start-here.md` | Entry point for the refactor plan |
| `active-slices-wip-limit-2.md` | Current WIP work items |
| `phase-0-forensics...md` | Phase 0: forensics (must run first) |
| `phase-1-organize-gamestate...md` | Phase 1: GameState domain sub-objects |
| `phase-2-move-state-ownership...md` | Phase 2: state migration batches |
| `phase-3-remove-bridge...md` | Phase 3: remove shims bridge |
| `completed.md` | Completed refactor work |
| `migration-principles.md` | Guiding principles |
| `quality-gate-policy.md` | Quality gates for each PR |

---

## Critical Integration Points

| From | To | Mechanism |
|------|----|-----------|
| `index.html` | `dist/app.js` | `<script src>` |
| `app.ts` | all modules | ES module `import` |
| `quotes.ts` | `go()` | `data-action` click delegation |
| `shims.ts` | `gameState` | `exposeShimsOnWindow()` + `window.gameState.*` setters |
| `bladder.ts` / `yourbladder.ts` | `gameState.Companion` / `gameState.Player` | `legacyBladderMirror` sync in `Person.ts` |
| `saveLoad.ts` | all state modules | Direct ES module imports (field registry) |
| `UserFlowTests` | dev server | Selenium → `http://127.0.0.1:8080` |
