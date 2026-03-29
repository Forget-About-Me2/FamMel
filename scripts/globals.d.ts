/**
 * Global type declarations for mutable state variables shared across modules
 * via window bridges during the JS→TS migration.
 *
 * Functions, constants, interfaces, and types have been moved to proper
 * ES module exports with import statements. Only mutable `let`/`var` state
 * that is read/written as bare globals remains here.
 *
 * These declares will be removed in Phase 5 when all mutable state is
 * absorbed into the unified gameState object.
 */

// ============================================================================
// Mutable state from bladder.ts
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
declare let spurtthresh: number;

// ============================================================================
// Mutable state from yourbladder.ts
// ============================================================================
declare let yourbladder: number;
declare let yourtummy: number;
declare let holdself: number;
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
declare let yrrlockedflag: number;
declare let ynowpeeing: number;
declare let ylastpeetime: number;
declare let ytimeheld: number;
declare let ydrankcocktails: number;
declare let ydrankwaters: number;
declare let ydrankbeers: any;

// ============================================================================
// Mutable state from settings.ts
// ============================================================================
declare let heroutfit: string;
declare let favoritemovie: any;
declare let suggestedloc: string;
declare let multiplemoves: number;
declare let rstmoves: number;
declare let photoChoice: any;
declare let showstats: number;
declare let enableimages: number;
declare let enableascii: number;
declare let playerGame: number;

// ============================================================================
// Mutable state from fuckHer.ts
// ============================================================================
declare let arousal: number;
declare let kisscounter: number;
declare let feelcounter: number;
declare let fuckingnow: number;
declare let champagnecounter: number;
declare let drankChamp: number;

// ============================================================================
// Mutable state from drive.ts
// ============================================================================
declare let wetthecar: number;

// ============================================================================
// Mutable state from location modules
// ============================================================================
declare let gasStation: any;
declare let bar: any;
declare let bartopic: number;
declare let club: any;
declare let externalflirt: number;
declare let theatre: any;
declare let seenmovie: number;
declare let rrMovieLineThresh: number;
declare let moviecounter: number;
declare let moviechoice: any;
declare let askedfavourite: number;
declare let makeOut: any;
declare let askedswim: number;
declare let walkcounter: number;
declare let herHome: any;
declare let prepeed: number;
declare let elevatorwaitcounter: number;
declare let locations: any;
declare let sharedLoc: any;
declare let emerBreak: any;
declare let emerHold: any;

// ============================================================================
// Mutable state from backPackItems.ts
// ============================================================================
declare let allowItems: number;
declare let previousbtn: any;
declare let itemtext: any;
declare let homeChampagne: number;

// ============================================================================
// Mutable state from quotes.ts
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

// ============================================================================
// Mutable state from shims.ts
// ============================================================================
declare let money: number;
declare let settings: any;
declare let statsBars: any;
declare let attraction: number;
declare let shyness: number;
declare let flirtcounter: number;
declare let flirtedflag: number;
declare let maxflirts: number;
declare let noflirtflag: number;
declare let checkedherout: number;
declare let locStack: string[];
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
declare let haveherpurse: number;
declare let owedfavor: number;
declare let changevenueflag: number;
declare let playerbladder: any;
declare let maxkiss: number;
declare let maxfeel: number;
declare let theaterclosingtime: number;
declare let barclosingtime: number;

// ============================================================================
// Mutable state from images.ts
// ============================================================================
declare let picset: number;

// ============================================================================
// Window-exposed singletons (from app.ts)
// ============================================================================
declare var gameState: any;
declare var gameScreen: any;

// ============================================================================
// Window-only functions (not exported from any module)
// cellphone — local function in yourHome.ts, exposed on window
// wrapAndFormatAll — called but never defined; pre-existing bug
// GetRequiredElementById — Document prototype extension, exposed on window by app.ts
// ============================================================================
declare function cellphone(): void;
declare function wrapAndFormatAll(template: any, values: any): any;
declare function GetRequiredElementById<T extends HTMLElement>(id: string): T;
