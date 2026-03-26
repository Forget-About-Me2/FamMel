/**
 * Bundle entry point — imports all TS module files and exposes key exports
 * as window globals so that legacy JS scripts and script-style TS files
 * can access them.
 */
import './helperFiles/documentFunctions';
import { go, start, gamestart } from './main';
import { callHer, yourHome } from './yourHome';
import { gameState } from './gameState/gameState';
import { gameScreen } from './gameScreen/gameScreen';
import { gameSettings } from './settings/gameSettings';
import { animationManager } from './gameScreen/animationManager';
import { exposeQuotesOnWindow } from './quotes';
import { exposePopUpOnWindow } from './pop-up';
import { exposeValidationOnWindow } from './validation';
import { exposeImagesOnWindow } from './images';
import { exposeClothesOnWindow } from './clothes';
import { exposeActionsOnWindow } from './actions';
import { exposeDartsOnWindow } from './games/darts';

// Expose quotes module state and functions on window first — many script files depend on these
exposeQuotesOnWindow();

// Expose Tier 1 modules on window for script-style callers
exposePopUpOnWindow();
exposeValidationOnWindow();
exposeImagesOnWindow();
exposeClothesOnWindow();
exposeActionsOnWindow();
exposeDartsOnWindow();

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

// store.ts registers lowercase gostore on window after loading.
// Alias is set up at DOMContentLoaded to ensure store.ts has loaded.
document.addEventListener('DOMContentLoaded', () => {
	if (typeof (window as any).gostore === 'function') {
		(window as any).goStore = (window as any).gostore;
	}
});