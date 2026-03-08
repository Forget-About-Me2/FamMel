/**
 * Global type declarations for variables and functions defined in JavaScript files
 * and script-style TypeScript files that are loaded via <script> tags.
 *
 * This file bridges the gap between the old JS globals and the new TS module system.
 */

// ============================================================================
// String prototype extensions (defined in quotes.ts)
// ============================================================================
interface String {
    format(...args: any[]): string;
    formatVars(): string;
}

// ============================================================================
// Game state variables (from bladder.js)
// ============================================================================
declare let bladurge: number;
declare let bladneed: number;
declare let blademer: number;
declare let bladlose: number;
declare let bladcumlose: number;
declare let bladsexlose: number;
declare let bladder: number;
declare let maxtummy: number;
declare let maxbeer: number;
declare let bladDec: number;
declare let bladDespDec: number;
declare let seal: number;
declare let tummy: number;
declare let peedtowels: number;
declare let peedvase: number;
declare let peedshot: number;
declare let peedoutside: number;
declare let lastpeetime: number;
declare let timeheld: number;
declare let drankbeer: number;
declare let notdesperate: number;
declare let notydesperate: number;
declare let nothdesperate: number;
declare let askholditcounter: number;
declare let waitcounter: number;
declare let rrlockedflag: number;
declare let shespurted: number;
declare let gottagoflag: number;
declare let minperc: number;
declare let minurge: number;
declare let customurge: number;
declare let prepeed: number;

// ============================================================================
// Your bladder variables (from yourbladder.js)
// ============================================================================
declare let yourbladder: number;
declare let yourbladurge: number;
declare let yourbladneed: number;
declare let yourbladlose: number;
declare let yourtummy: number;
declare let ydranksodas: number;
declare let yourcustomurge: number;
declare let playerbladder: number;
declare let playerGame: number;
declare let ylastpeetime: number;

// Quote variables from quotes.ts are already visible to TypeScript
// (quotes.ts is a script-style TS file in the compilation scope)

// ============================================================================
// Settings variables (from settings.js)
// ============================================================================
declare let showstats: number;
declare let photoChoice: any;
declare let favoritemovie: string;
declare let suggestedloc: string;
declare let heroutfit: string;
declare let multiplemoves: number;
declare let rstmoves: number;
declare let money: number;
declare let settings: any;
declare let statsBars: any;

// ============================================================================
// Image variables (from images.js)
// ============================================================================
declare let imgs: any;
declare let picset: any;
declare let enableimages: number;
declare let enableascii: number;

// ============================================================================
// Action/Flirt variables (from actions.js, fuckHer.js)
// ============================================================================
declare let attraction: number;
declare let shyness: number;
declare let flirtcounter: number;
declare let flirtedflag: number;
declare let maxflirts: number;
declare let noflirtflag: number;
declare let checkedherout: number;
declare let feelcounter: number;
declare let arousal: number;
declare let kisscounter: number;
declare let fuckingnow: number;
declare let champagnecounter: number;
declare let drankChamp: number;
declare let sexActions: any;

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
declare let locations: any;
declare let sharedLoc: any;
// allowItems is declared in backPackItems.ts
declare let endScreens: any;
declare let thetime: number;
declare let hour: number;
declare let late: number;
declare let didintro: number;
declare let shopping: number;
declare let seenmovie: number;
declare let elevatorwaitcounter: number;
declare let floorcounter: number;
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

// Functions from quotes.ts are already visible to TypeScript
// (quotes.ts is a script-style TS file in the compilation scope)

// Functions that are called but not yet implemented (stubs for migration)
declare function formatAll(html: any, vars: any): any;
declare function formatString(template: string, values: any[]): string;
declare function printDialogue(curtext: any[], loc: string, index: number): any[];
declare function range(start: number, end: number): number[];

// ============================================================================
// Global functions from quotes.ts (script-style TS)
// ============================================================================
declare function printIntro(curtext: any[], index: number): any[];
declare function printAlways(curtext: any[]): any[];
declare function printSDialogue(curtext: any[], loc: string, index: number, begin: number, end: number): any[];
declare function printList(curtext: any[], list: any[]): any[];
declare function printChoices(curtext: any[], selection: number[]): any[];
declare function printAllChoices(curtext: any[]): any[];
declare function printChoicesList(curtext: any[], selection: number[], list: any[]): any[];
declare function sayText(lines: any[]): void;
declare function addSayText(lines: any[]): void;
declare function setText(lines: any[]): void;
declare function c(choice: any[], curtext?: any[]): any[];
declare function cListener(choice: any[], tag: string): void;
declare function cListenerGen(choice: any[], loc: string): void;
declare function cListenerGenList(list: any[]): void;
declare function fetchJson(path: string): Promise<any>;
declare function fetchAndCacheJson(tag: string): Promise<any>;
declare function locationSetup(tag: string): void;
declare function loadLocationScene(tag: string, subtag: string): void;
declare function locationMCSetup(subtag: string, customloc: any): void;
declare function setupQuotes(): Promise<void>;
// locjson, calledjsons, girlname, girltalk, girlgasp, pantycolor, yneeds,
// drinklines are defined in quotes.ts (script-style TS, shares global scope).

// ============================================================================
// Global functions from settings.js
// ============================================================================
declare function setup(): void;
declare function setLocal(varName: string, value: any): void;
declare function setbasegirl(name: string): void;
declare function setgirl(name: string): void;
declare function options(): void;
declare function importimgs(): void;
declare function initYUrge(urge: any): void;
declare function bladOpt(): void;

// ============================================================================
// Global functions from bladder.js
// ============================================================================
declare function flushdrank(): void;
declare function displaygottavoc(curtext: any[], index?: number): any[];

// ============================================================================
// Global functions from yourbladder.js
// ============================================================================
declare function displayyourneed(curtext: any[]): any[];
declare function wetyourself(): void;
declare function youpee(): void;
declare function yPreDrink(): void;

// ============================================================================
// Global functions from locations.js, herhome.js, drive.js
// ============================================================================
declare function pushloc(loc: string): void;
declare function poploc(): void;
declare function herhome(): void;
declare function callHer(): void;
declare function cellphone(): void;
declare function peeFun(): void;
declare function goStore(): void;

// ============================================================================
// Global functions from images.js
// ============================================================================
declare function resetImg(): void;

// ============================================================================
// Global functions from pop-up.js
// ============================================================================
declare function openPopUp(): void;
declare function setCloseButton(): void;

// ============================================================================
// Global functions from validation.js
// ============================================================================
declare function validateListenerList(list: any[]): void;

// ============================================================================
// Global functions from actions.js
// ============================================================================
declare function handleFlirt(listenerList: any[]): any;
declare function pickrandom(list: any[]): any;
declare function incrandom(): void;

// ============================================================================
// Debug location objects (from locations.js, used in debugMenu.ts)
// ============================================================================
declare let theYard: any;
declare let exitYard: any;
declare let theWalk: any;

// ============================================================================
// Delay function (from animation.js or similar)
// ============================================================================
declare function delay(ms: number): Promise<void>;

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
// Additional bladder / player variables (from yourbladder.js, bladder.js)
// ============================================================================
declare let ymaxtummy: number;
declare let ymaxbeer: number;
declare let ydrankbeer: number;
declare let peein: any;
declare let ypeein: any;
declare let indepee: any;
declare let wetlegs: number;

// ============================================================================
// Bribe / phone thresholds (from bladder.js or actions.js)
// ============================================================================
declare let bribeAskBase: number;
declare let bribeaskthresh: number;
declare let phoneholdthresh: number;

// ============================================================================
// Location objects (from locations.js)
// ============================================================================
declare let bar: any;
declare let club: any;

// ============================================================================
// Game flags and counters
// ============================================================================
declare let brokeice: number;
declare let toldstories: number[];

// ============================================================================
// Additional display / need functions (from bladder.js, actions.js, etc.)
// ============================================================================
declare function showneed(curtext: any[]): any[];
declare function displayholdquip(curtext: any[]): any[];
declare function displayneed(curtext: any[]): any[];
declare function dartSetup(data: any): void;
declare function fuckHerSetup(data: any): void;
declare function sellPanties(): void;
declare function flirtBarGirl(): void;
declare function askpee(): void;
declare function help(): void;
declare let haveherpurse: number;

// ============================================================================
// Flirt levels (from actions.js)
// ============================================================================
declare let flirt_h: any;
declare let flirt_l: any;
declare let flirt_m: any;
