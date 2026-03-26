/**
 * Global type declarations for variables and functions defined in JavaScript files
 * and script-style TypeScript files that are loaded via <script> tags.
 *
 * This file bridges the gap between the old JS globals and the new TS module system.
 */

// ============================================================================
// String prototype extensions (defined in quotes.ts — now in the bundle)
// ============================================================================
interface String {
    format(...args: any[]): string;
    formatVars(): string;
}

// ============================================================================
// Globals from bladder.ts / yourbladder.ts (script-style, visible to all files)
// Note: bladlose, bladder, timeheld, toldstories are declared in bladder.ts
// (script-style TS) so they're already in the global scope. Do NOT redeclare here.
// ============================================================================

// ============================================================================
// Globals from actions.ts (script-style, needed by quotes module)
// ============================================================================
declare function flirt_l(): void;
declare function flirt_m(): void;
declare function flirt_h(): void;

// ============================================================================
// Globals from games/darts.ts and fuckHer.ts (script-style, needed by quotes module)
// ============================================================================
declare function dartSetup(data: any): void;
declare function fuckHerSetup(data: any): void;

// ============================================================================
// Globals from validation.ts (script-style, needed by quotes module)
// ============================================================================
declare function validateListenerList(list: any[]): void;

// ============================================================================
// Quotes module state variables — exposed on window by exposeQuotesOnWindow()
// Declared here so script-style TS files can access them as globals.
// ============================================================================
declare let calledjsons: any;
declare let locjson: any;
declare let girlname: string;
declare let basegirl: string;
declare let girltalk: string;
declare let girlgasp: string;
declare let pantycolor: string;
declare let flirtresps: any;
declare let feelUp: any;
declare let kissing: any;
declare let ypeelines: any;
declare let peelines: any;
declare let needs: any;
declare let yneeds: any;
declare let drinklines: any;
declare let appearance: any;
declare let drive: any;
declare let general: any;
declare let sexLines: any;
declare let objQuotes: any;
declare let imageprev: any;
declare let comma: number;
declare let customgirlname: string;
declare let darts: any;
declare let imagedesc: string;

// ============================================================================
// Variables and functions from bladder.ts and yourbladder.ts are now
// defined in script-style TS files and visible to the TS compiler directly.

// ============================================================================
// Settings variables (from shims.js — settings.ts references these)
// ============================================================================
declare let money: number;
declare let settings: any;
declare let statsBars: any;

// ============================================================================
// Image variables (implicit globals used by images.ts and settings.ts)
// ============================================================================
declare let enableimages: number;
declare let enableascii: number;

// ============================================================================
// Action/Flirt variables (from actions.ts — remaining globals from shims.js)
// ============================================================================
declare let attraction: number;
declare let shyness: number;
declare let flirtcounter: number;
declare let flirtedflag: number;
declare let maxflirts: number;
declare let noflirtflag: number;
declare let checkedherout: number;

// ============================================================================
// Animation variables (from animation.js)
// ============================================================================
declare let artno: number;
declare let directartno: number;
declare let maxart: number;
declare let asciiloops: any;
declare let peeingloop: any;
declare let alphadecode: any;

// ============================================================================
// Location/flow variables (from locations.js, herhome.js, etc.)
// ============================================================================
declare let locStack: string[];
// allowItems is declared in backPackItems.ts
declare let endScreens: any;
declare let thetime: number;
declare let hour: number;
declare let late: number;
declare let didintro: number;
declare let shopping: number;
declare let clubclosingtime: number;
declare let curText: any;
declare let showedneed: any;
declare let randcounter: number;
declare let randomchoice: any;

// backPackItems and allowItems are declared in backPackItems.ts (script-style TS file)

// ============================================================================
// Person type for debug menu (simplified)
// ============================================================================
declare type person = {
    bladderUrge: number;
    bladderNeed: number;
    bladderEmer: number;
    bladderLose: number;
    [key: string]: any;
};

// Functions from quotes.ts — now a module in the bundle.
// Exposed on window by exposeQuotesOnWindow() for script-style files.

// Functions that are called but not yet implemented (stubs for migration)
declare function formatAll(html: any, vars: any): any;
declare function formatString(template: string, values: any[]): string;
declare function printDialogue(curtext: any[], loc: string, index: number): any[];
declare function range(start: number, end: number): number[];

// ============================================================================
// Global functions from quotes.ts (exposed on window from the bundle)
// ============================================================================
declare function printIntro(curtext: any[], index: number): any[];
declare function printAlways(curtext: any[]): any[];
declare function printSDialogue(curtext: any[], loc: string, index: number, begin: number, end: number): any[];
declare function printList(curtext: any[], list: any[]): any[];
declare function printListSelection(curtext: any[], list: any[], selection: number[]): any[];
declare function printLList(curtext: any[], list: any[], index: number): any[];
declare function printChoices(curtext: any[], selection: number[]): any[];
declare function printAllChoices(curtext: any[]): any[];
declare function printChoicesList(curtext: any[], selection: number[], list: any[]): any[];
declare function printAllChoicesList(curtext: any[], list: any[]): any[];
declare function callChoice(choice: any[], curtext?: any[]): any[];
declare function sayText(lines: any[]): void;
declare function addSayText(lines: any[]): void;
declare function setText(lines: any[]): void;
declare function c(choice: any[], curtext?: any[]): any[];
declare function cListener(choice: any[], tag: string): void;
declare function cListenerGen(choice: any[], loc: string): void;
declare function cListenerGenList(list: any[]): void;
declare function addListenersList(list: any[]): void;
declare function addGirlTalk(quotes: any[]): any[];
declare function formatAllVarsList(list: any[]): any[];
declare function fetchJson(path: string): Promise<any>;
declare function fetchAndCacheJson(tag: string): Promise<any>;
declare function locationSetup(tag: string): void;
declare function loadLocationScene(tag: string, subtag: string): void;
declare function locationMCSetup(subtag: string, customloc: any): void;
declare function getMLocations(tag: string, subtag: string): void;
declare function setupQuotes(): Promise<void>;
declare function handleFlirt(listenerList: any[]): any[];
declare function voccurse(curtext: any[]): any[];
declare function printFormatDialogue(curtext: any[], loc: string, index: number, begin: number, end: number, values: any[]): any[];
declare function formatAllVars(exprList: any[]): any[];
declare function addListeners(choice: any[], loc: string, go?: boolean): void;
declare function addGirlname(quotes: any[]): any[];

// ============================================================================
// Global functions from settings.js — most moved to settings.ts
// ============================================================================
// initYUrge is in yourbladder.ts

// ============================================================================
// ============================================================================
// Global functions from locations.js, herhome.js, drive.js
// ============================================================================
declare function pushloc(loc: string): void;
declare function poploc(): void;
declare function callHer(): void;
declare function cellphone(): void;

// ============================================================================
// Global functions from images.js — now in images.ts
// ============================================================================

// ============================================================================
// Global functions from pop-up.js — now in pop-up.ts
// ============================================================================

// ============================================================================
// Global functions from validation.js — now in validation.ts
// ============================================================================

// ============================================================================
// Global functions from actions.ts / quotes.ts
// ============================================================================
declare function pickrandom(list: any[]): any;
declare function incrandom(): void;

// ============================================================================
// theYard, exitYard, theWalk are now in theMakeOut.ts

// ============================================================================
// Delay is now in pop-up.ts

// ============================================================================
// TS module exports exposed as window globals by app.ts
// (for script-style TS files that reference them without imports)
// ============================================================================
declare function go(location: any): void;
declare function start(): Promise<void>;
declare function GetRequiredElementById<T extends HTMLElement>(id: string): T;
declare function randomIndex(list: any[]): number;
declare function gameRandom(): number;
declare function randomInt(maxExclusive: number): number;
declare function setRandomSeed(seed: number | string): number;
declare function getRandomSeed(): number;
declare function clearRandomSeed(): void;
declare var gameState: any;
declare var gameScreen: any;

// ============================================================================
// Additional display / need functions
// ============================================================================
declare function help(): void;

// ============================================================================
// Globals from JS files referenced by bladder.ts / yourbladder.ts
// ============================================================================
declare let haveherpurse: number;
declare let owedfavor: number;
declare let changevenueflag: number;
declare let playerbladder: any;

// ============================================================================
// Variables from fuckHer.ts / shims.js
// ============================================================================
declare let maxkiss: number;
declare let maxfeel: number;

// ============================================================================
// Functions/variables from shims.js
// ============================================================================
declare let theaterclosingtime: number;
declare let barclosingtime: number;
declare function randomize(list: any[]): any[];

// ============================================================================
// Functions from main.ts (bundle — exposed as window globals)
// ============================================================================
declare function gameOver(): void;
declare function gameWet(): void;
declare function gameSexBoth(): void;
declare function gameWon(): void;

// ============================================================================
// Implicit globals from shims.js / settings.ts
// ============================================================================
declare let playerGame: number;

// ============================================================================
// Functions from games/darts.ts
// ============================================================================
declare function wrapAndFormatAll(template: any, values: any): any;
