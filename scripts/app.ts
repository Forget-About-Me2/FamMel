/**
 * Bundle entry point — imports all TS module files and exposes key exports
 * as window globals so that legacy JS scripts and script-style TS files
 * can access them.
 */
import { exposeShimsOnWindow } from './shims';
import './helperFiles/documentFunctions';
import { go, displayIntroSequence, gamestart } from './main';
import { callHer, yourHome } from './yourHome';
import { runtimeContext, runtimeContext } from './gameState/runtimeContext';
import { gameScreen } from './gameScreen/gameScreen';
import { gameSettings } from './settings/gameSettings';
import { showSettingsScreen } from './settings/settingsScreen';
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


// Wire up static UI elements
document.getElementById("backpack-link")?.addEventListener("click", function (e) {
    e.preventDefault();
    backpack();
});

// New: Wire up settings navigation (replace legacy navigation)
export function showSettingsPage() {
    // Find or create a container for the settings screen
    let container = document.getElementById("settings-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "settings-container";
        document.body.appendChild(container);
    }
    showSettingsScreen(container);
}
