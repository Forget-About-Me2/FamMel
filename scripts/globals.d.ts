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
// Globals from bladder.ts (now in the bundle, exposed on window)
// ============================================================================
declare let customurge: number;
declare let minperc: number;
declare let bladurge: number;
declare let bladneed: number;
declare let blademer: number;
declare let bladlose: number;
declare let bladcumlose: number;
declare let bladsexlose: number;
declare let maxtummy: number;
declare let maxbeer: number;
declare let tummy: number;
declare let bladder: number;
declare let bladDec: number;
declare let bladDespDec: number;
declare let seal: number;
declare let ybeerdecCounter: number;
declare let drankbeer: number;
declare let lastpeetime: number;
declare let timeheld: number;
declare let notdesperate: number;
declare let notydesperate: number;
declare let nothdesperate: number;
declare let bribeaskthresh: number;
declare let bribeAskBase: number;
declare let rrlockedflag: number;
declare let shespurted: number;
declare let brokeice: number;
declare let wetlegs: number;
declare let wetherpanties: number;
declare let gottagoflag: number;
declare let askholditcounter: number;
declare let waitcounter: number;
declare const rrlockedthresh: number;
declare const rrlinethresh: number;
declare const phoneholdthresh: number;
declare const drinkinggamethreshold: number;
declare const photoGameThresholds: any;
declare const hottubthresh: number;
declare const gomakeoutthresh: number;
declare function initUrge(urge: number): void;
declare function interpbladder(curtext: any[]): any[];
declare function flushdrank(): void;
declare function showneed(curtext?: any[]): any[];
declare function displayneed(curtext: any[]): any[];
declare function displaygottavoc(curtext: any[], index?: number): any[];
declare function displayholdquip(curtext: any[]): any[];
declare function noteholding(curtext: any[]): any[];
declare function peein(item: string): void;
declare function indepee(curtext?: any[], called?: boolean): void;
declare function holdit(): void;
declare function askcanhold(): void;
declare function allowpee(): void;
declare function preventpee(listenerList?: any[]): any[];
declare function wetherself(curtext?: any[]): void;
declare function pstory(): void;

// ============================================================================
// Globals from yourbladder.ts (now in the bundle, exposed on window)
// ============================================================================
declare let yourbladder: number;
declare let yourtummy: number;
declare let holdself: number;
declare const holdpeethresh: number;
declare let yourbladurge: number;
declare let yourbladneed: number;
declare let yourblademer: number;
declare let yourbladlose: number;
declare let yourcustomurge: number;
declare let ymaxtummy: number;
declare let ymaxbeer: number;
declare let ydrankbeer: number;
declare let ydranksodas: number;
declare let yspurtthresh: number;
declare let youSpurted: number;
declare function displayyourneed(curtext: any[]): any[];
declare function initYUrge(urge: number): void;
declare function flushyourdrank(): void;
declare function youpee(): void;
declare function ypeein(item: string): void;
declare function yPeeInTub(): void;
declare function ypeeoutside(): void;
declare function wetyourself(): void;

// ============================================================================
// Globals from settings.ts (now in the bundle, exposed on window)
// ============================================================================
declare let heroutfit: string;
declare let favoritemovie: any;
declare let suggestedloc: string;
declare let multiplemoves: number;
declare let rstmoves: number;
declare let photoChoice: any;
declare function setup(): void;
declare function setjpgimgs(): void;

// ============================================================================
// Globals from fuckHer.ts (now in the bundle, exposed on window)
// ============================================================================
declare let arousal: number;
declare let kisscounter: number;
declare let feelcounter: number;
declare let fuckingnow: number;
declare let champagnecounter: number;
declare let drankChamp: number;
declare function haveSex(location: string): void;

// ============================================================================
// Globals from drive.ts (now in the bundle, exposed on window)
// ============================================================================
declare let wetthecar: number;
declare function driveout(): void;
declare function leavehm(): void;

// ============================================================================
// Globals from locations/driveAround.ts (now in the bundle, exposed on window)
// ============================================================================
declare let gasStation: any;
declare function nextstop(): void;

// ============================================================================
// Globals from locations/theBar.ts (now in the bundle, exposed on window)
// ============================================================================
declare let bar: any;
declare function sellPanties(): void;
declare function flirtBarGirl(): void;
declare function pdrinkinggame(): void;
declare function pphotogame(): void;

// ============================================================================
// Globals from locations/theClub.ts (now in the bundle, exposed on window)
// ============================================================================
declare let club: any;
declare let externalflirt: number;
declare function doDance(): void;

// ============================================================================
// Globals from locations/theatre.ts (now in the bundle, exposed on window)
// ============================================================================
declare let theatre: any;
declare let seenmovie: number;
declare let rrMovieLineThresh: number;

// ============================================================================
// Globals from locations/theMakeOut.ts (now in the bundle, exposed on window)
// ============================================================================
declare let theMakeOut: any;
declare function theYard(): void;
declare function exitYard(): void;
declare function theWalk(): void;
declare function theBedroom(): void;
declare function theHotTub(): void;

// ============================================================================
// Globals from herhome.ts (now in the bundle, exposed on window)
// ============================================================================
declare let herHome: any;
declare let prepeed: number;
declare function homeConditions(): boolean;

// ============================================================================
// Globals from locations.ts (now in the bundle, exposed on window)
// ============================================================================
declare let locations: any;
declare let sharedLoc: any;
declare let emerBreak: any;
declare let emerHold: any;
declare function printLocationMenu(): void;
declare function updateSuggestedLocation(): void;
declare function lookAround(loc: string): void;
declare function itsClosed(locname: string, fun: () => void, curloc: string): void;

// ============================================================================
// Globals from backPackItems.ts (now in the bundle, exposed on window)
// ============================================================================
declare let allowItems: number;
declare const backPackItems: any;
declare const playOnly: any;
declare function standobjs(curtext: any[], listenerList?: any[]): any[];
declare function buyItem(item: any): void;
declare function giveHer(item: string): void;
declare function holdpurse(): void;
declare function haveItem(key: string): boolean;
declare function displaydrank(curtext: any[]): any[];
interface IBackpackItem {
    name: string;
    price: number;
    value: number;
    [key: string]: any;
}
interface IDrink extends IBackpackItem {
    bladInc: number;
    tumInc: number;
    [key: string]: any;
}

// ============================================================================
// Globals from actions.ts (now in the bundle, exposed on window)
// ============================================================================
// flirt_l, flirt_m, flirt_h, checkherout, feelup, kissher — now module exports
// Still declared for script-style callers:
declare function flirt_l(): void;
declare function flirt_m(): void;
declare function flirt_h(): void;
declare function checkherout(): void;
declare function feelup(): void;
declare function kissher(curtext?: any[], sexLoc?: string): void;

// ============================================================================
// Globals from games/darts.ts (now in the bundle) and fuckHer.ts (script-style)
// ============================================================================
// dartSetup — now module export, still declared for quotes.ts global reference
declare function dartSetup(data: any): void;
declare function fuckHerSetup(data: any): void;

// ============================================================================
// Globals from validation.ts (now in the bundle, exposed on window)
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
// in the bundle, exposed on window. Declarations are above.

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

// backPackItems, allowItems — now in the bundle, declared above

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
// Global functions from images.ts (now in the bundle, exposed on window)
// ============================================================================
declare function displaypix(picname: string): void;
declare function explainimgs(): void;
declare function importimgs(): void;
declare let picset: number;

// ============================================================================
// Global functions from pop-up.ts (now in the bundle, exposed on window)
// ============================================================================
declare function openPopUp(): void;
declare function setErrorPopup(data: string): void;
declare function copyErrorText(): Promise<void>;

// ============================================================================
// Global functions from clothes.ts (now in the bundle, exposed on window)
// ============================================================================
declare function changepanties(choice: number): void;

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
// Functions from games/darts.ts (now in the bundle)
// wrapAndFormatAll — called but never defined anywhere; pre-existing bug.
// Kept as declare so TypeScript compiles. Will crash if darts code path is hit.
// ============================================================================
declare function wrapAndFormatAll(template: any, values: any): any;
declare function playDarts(): void;
declare function dartRound(dartPoints: any): void;
