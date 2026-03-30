/**
 * Bundle entry point — imports all TS module files and exposes key exports
 * as window globals so that legacy JS scripts and script-style TS files
 * can access them.
 */
import { exposeShimsOnWindow } from './shims';
import './helperFiles/documentFunctions';
import { go, start, gamestart } from './main';
import { callHer, yourHome } from './yourHome';
import { gameState } from './gameState/gameState';
import { gameScreen } from './gameScreen/gameScreen';
import { gameSettings } from './settings/gameSettings';
import { animationManager } from './gameScreen/animationManager';
import { exposeQuotesOnWindow, initDelegatedClickHandler } from './quotes';
import { exposePopUpOnWindow } from './pop-up';
import { exposeValidationOnWindow } from './validation';
import { exposeImagesOnWindow } from './images';
import { exposeClothesOnWindow } from './clothes';
import { exposeActionsOnWindow } from './actions';
import { exposeDartsOnWindow } from './games/darts';

// Batch 2 — former script-style files now bundled
import { exposeBladderOnWindow } from './bladder';
import { exposeYourBladderOnWindow } from './yourbladder';
import { exposeSettingsOnWindow } from './settings';
import { exposeFuckHerOnWindow } from './fuckHer';
import { exposeDriveOnWindow } from './drive';
import { exposeDriveAroundOnWindow } from './locations/driveAround';
import { exposeTheBarOnWindow } from './locations/theBar';
import { exposeTheClubOnWindow } from './locations/theClub';
import { exposeTheatreOnWindow } from './locations/theatre';
import { exposeTheMakeOutOnWindow } from './locations/theMakeOut';
import { exposeHerHomeOnWindow } from './herhome';
import { exposeLocationsOnWindow } from './locations';
import { exposeBackPackItemsOnWindow, backpack } from './backPackItems';
import { exposeStoreOnWindow } from './store';
import { exposeDebugMenuOnWindow } from './debugMenu';
import { saveToSlot, loadFromSlot, hasSave, deleteSave, exportSave, importSave } from './saveLoad';

// Shims FIRST — state variables and RNG that all other modules depend on
exposeShimsOnWindow();

// Expose quotes module state and functions on window — many other modules depend on these
exposeQuotesOnWindow();

// Set up delegated click handler for data-action/data-action-fn attributes
initDelegatedClickHandler();

// Expose Tier 1 modules on window for script-style callers
exposePopUpOnWindow();
exposeValidationOnWindow();
exposeImagesOnWindow();
exposeClothesOnWindow();
exposeActionsOnWindow();
exposeDartsOnWindow();

// Expose Batch 2 — former script-style files
exposeBladderOnWindow();
exposeYourBladderOnWindow();
exposeSettingsOnWindow();
exposeFuckHerOnWindow();
exposeDriveOnWindow();
exposeDriveAroundOnWindow();
exposeTheBarOnWindow();
exposeTheClubOnWindow();
exposeTheatreOnWindow();
exposeTheMakeOutOnWindow();
exposeHerHomeOnWindow();
exposeLocationsOnWindow();
exposeBackPackItemsOnWindow();
exposeStoreOnWindow();
exposeDebugMenuOnWindow();

// Expose to global scope for JS files and script-style TS files
(window as any).go = go;
(window as any).start = start;
(window as any).gameState = gameState;
(window as any).gameScreen = gameScreen;
(window as any).gameSettings = gameSettings;
(window as any).animationManager = animationManager;
(window as any).GetRequiredElementById = document.GetRequiredElementById.bind(document);

// CamelCase aliases used by legacy JSON/script routing.
(window as any).yourHome = yourHome;
(window as any).callHer = callHer;
(window as any).gamestart = gamestart;

// Save/load API — available from console or future UI
(window as any).saveGame = saveToSlot;
(window as any).loadGame = loadFromSlot;
(window as any).hasSave = hasSave;
(window as any).deleteSave = deleteSave;
(window as any).exportSave = exportSave;
(window as any).importSave = importSave;

// Wire up static UI elements
document.getElementById("backpack-link")?.addEventListener("click", function (e) {
    e.preventDefault();
    backpack();
});