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

// store.ts currently registers lowercase gostore on window.
if (typeof (window as any).gostore === 'function') {
	(window as any).goStore = (window as any).gostore;
}