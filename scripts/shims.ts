// Legacy global state and utility functions.
// Originally in shims.js (loaded before the bundle via <script> tag).
// Now a module in the bundle — values exposed on window via exposeShimsOnWindow().

// ============================================================================
// Game state variables (initial values)
// ============================================================================
export let locStack: string[] = ["yourhome"];
export let money: number = 200;
export let thetime: number = 0;
export let hour: number = 7;
export let minute: number = 0;
export let meridian: string = "PM";
export let late: number = 0;
export let playerbladder: boolean = true;

// Interaction / flirt state
export let attraction: number = 10;
export let shyness: number = 90;
export let flirtedflag: number = 0;
export let flirtcounter: number = 0;
export let noflirtflag: number = 0;
export let checkedherout: number = 0;
export let haveherpurse: number = 0;
export let owedfavor: number = 0;
export let changevenueflag: number = 0;
export let shopping: number = 0;

// Flirt / interaction limits
export let maxflirts: number = 2;
export let maxkiss: number = 7;
export let maxfeel: number = 7;
export let randmax: number = 5;

// Venue closing times (ticks from 7 PM)
export let clubclosingtime: number = 7 * 60;    // 2:00 AM
export let theaterclosingtime: number = 3 * 60;  // 10:00 PM last showing
export let barclosingtime: number = 6 * 60;      // 1:00 AM

// Time
export let timespeed: number = 2;
export let didintro: number = 0;

// Delta tracking (for status bar arrows)
export let lastmoney: number = money;
export let lastattraction: number = attraction;
export let lastshyness: number = shyness;

// JSON data loaded at runtime
export let settings: any;
export let statsBars: any;
export let showedneed: any;
export let endScreens: any;

// ============================================================================
// Seedable RNG — deterministic integration tests use ?seed= query param
// ============================================================================
let gameRngState: number | null = null;
let gameInitialSeed: number | null = null;

function createAutoSeed(): number {
    return ((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0) || 1;
}

function normalizeSeed(seed: number | string): number {
    const numericSeed = Number(seed);
    if (!Number.isFinite(numericSeed)) {
        throw new Error("Seed must be a finite number");
    }
    const normalized = (Math.trunc(numericSeed) >>> 0);
    return normalized === 0 ? 1 : normalized;
}

export function setRandomSeed(seed: number | string): number {
    gameInitialSeed = normalizeSeed(seed);
    gameRngState = gameInitialSeed;
    return gameInitialSeed;
}

export function clearRandomSeed(): void {
    setRandomSeed(createAutoSeed());
}

export function getRandomSeed(): number {
    return gameInitialSeed!;
}

export function gameRandom(): number {
    if (gameRngState === null) {
        return Math.random();
    }
    gameRngState = (Math.imul(gameRngState, 1664525) + 1013904223) >>> 0;
    return gameRngState / 4294967296;
}

export function randomInt(maxExclusive: number): number {
    const max = Math.floor(maxExclusive);
    if (max <= 0) {
        return 0;
    }
    return Math.floor(gameRandom() * max);
}

// ============================================================================
// Utility functions
// ============================================================================
export function pushloc(loc: string): void {
    locStack.unshift(loc);
}

export function poploc(): string | undefined {
    return locStack.shift();
}

export function randomchoice(n: number): boolean {
    return randomInt(n) === 0;
}

export function incrandom(): void {
    const w = globalThis as any;
    w.randcounter = (w.randcounter + randomInt(2) + 1) % 5;
}

export function pickrandom(list: any[]): any {
    return list[randomInt(list.length)];
}

export function randomIndex(list: any[]): number {
    return randomInt(list.length);
}

export function range(start: number, end: number): number[] {
    let result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

export function formatString(expr: string, values: any[]): string {
    return expr.format(values);
}

export function formatAll(exprList: any[], values: any[]): any[] {
    let result: any[] = [];
    for (let i = 0; i < exprList.length; i++) {
        result.push(formatString(exprList[i], values[i]));
    }
    return result;
}

export function printDialogue(curtext: any[], loc: string, index: number): any[] {
    const lj = (window as any).locjson;
    if (lj && lj.dialogue && lj.dialogue[loc]) {
        lj.dialogue[loc][index].forEach(function(item: any) {
            curtext.push(item);
        });
    }
    return curtext;
}

// Shuffle a list randomly (Fisher-Yates)
export function randomize(list: any[]): any[] {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Random counter for NPC behavior
export let randcounter: number = 0;

// ============================================================================
// Initialize RNG seed from query string (runs at module load time)
// ============================================================================
setRandomSeed(createAutoSeed());

const params = new URLSearchParams(window.location.search);
const seed = params.get("seed");
if (seed !== null && seed !== "") {
    setRandomSeed(seed);
}

// Initialize randcounter after RNG is seeded
randcounter = randomInt(5);

// ============================================================================
// Connect window bridges to gameState — makes gameState the sole authority
// for absorbed variables.  Call once after gameState.init() + initial sync.
// ============================================================================
export function connectToGameState(gs: any): void {
    const w = window as any;

    // Numeric properties — direct pass-through
    const numericProps: Array<[string, string]> = [
        ['money',          'Money'],
        ['attraction',     'Attraction'],
        ['shyness',        'Shyness'],
        ['lastmoney',      'LastMoney'],
        ['lastattraction', 'LastAttraction'],
        ['lastshyness',    'LastShyness'],
        ['flirtcounter',   'FlirtCounter'],
        ['randcounter',    'randCounter'],
        ['owedfavor',      'OwedFavour'],
    ];

    // Boolean flags — coerce number↔boolean for legacy compatibility
    const boolProps: Array<[string, string]> = [
        ['didintro',       'DidIntro'],
        ['haveherpurse',   'HavePurse'],
        ['changevenueflag','ChangeVenueFlag'],
        ['checkedherout',  'CheckedHerOut'],
        ['showedneed',     'ShowedNeed'],
    ];

    for (const [globalName, gsProp] of numericProps) {
        Object.defineProperty(w, globalName, {
            get: () => gs[gsProp],
            set: (v: any) => { gs[gsProp] = v; },
            configurable: true,
            enumerable: true,
        });
    }

    for (const [globalName, gsProp] of boolProps) {
        Object.defineProperty(w, globalName, {
            get: () => gs[gsProp],
            set: (v: any) => { gs[gsProp] = !!v; },
            configurable: true,
            enumerable: true,
        });
    }
}

// ============================================================================
// Window bridge — expose all shims globals on window so existing code
// that references bare variable names (resolved via global scope) works.
// ============================================================================
export function exposeShimsOnWindow(): void {
    const w = window as any;

    // Mutable state — defineProperty keeps module and global in sync
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['locStack',          () => locStack,          (v) => { locStack = v; }],
        ['money',             () => money,             (v) => { money = v; }],
        ['thetime',           () => thetime,           (v) => { thetime = v; }],
        ['hour',              () => hour,              (v) => { hour = v; }],
        ['minute',            () => minute,            (v) => { minute = v; }],
        ['meridian',          () => meridian,          (v) => { meridian = v; }],
        ['late',              () => late,              (v) => { late = v; }],
        ['playerbladder',     () => playerbladder,     (v) => { playerbladder = v; }],
        ['attraction',        () => attraction,        (v) => { attraction = v; }],
        ['shyness',           () => shyness,           (v) => { shyness = v; }],
        ['flirtedflag',       () => flirtedflag,       (v) => { flirtedflag = v; }],
        ['flirtcounter',      () => flirtcounter,      (v) => { flirtcounter = v; }],
        ['noflirtflag',       () => noflirtflag,       (v) => { noflirtflag = v; }],
        ['checkedherout',     () => checkedherout,     (v) => { checkedherout = v; }],
        ['haveherpurse',      () => haveherpurse,      (v) => { haveherpurse = v; }],
        ['owedfavor',         () => owedfavor,         (v) => { owedfavor = v; }],
        ['changevenueflag',   () => changevenueflag,   (v) => { changevenueflag = v; }],
        ['shopping',          () => shopping,          (v) => { shopping = v; }],
        ['maxflirts',         () => maxflirts,         (v) => { maxflirts = v; }],
        ['maxkiss',           () => maxkiss,           (v) => { maxkiss = v; }],
        ['maxfeel',           () => maxfeel,           (v) => { maxfeel = v; }],
        ['randmax',           () => randmax,           (v) => { randmax = v; }],
        ['clubclosingtime',   () => clubclosingtime,   (v) => { clubclosingtime = v; }],
        ['theaterclosingtime',() => theaterclosingtime,(v) => { theaterclosingtime = v; }],
        ['barclosingtime',    () => barclosingtime,    (v) => { barclosingtime = v; }],
        ['timespeed',         () => timespeed,         (v) => { timespeed = v; }],
        ['didintro',          () => didintro,          (v) => { didintro = v; }],
        ['lastmoney',         () => lastmoney,         (v) => { lastmoney = v; }],
        ['lastattraction',    () => lastattraction,    (v) => { lastattraction = v; }],
        ['lastshyness',       () => lastshyness,       (v) => { lastshyness = v; }],
        ['settings',          () => settings,          (v) => { settings = v; }],
        ['statsBars',         () => statsBars,         (v) => { statsBars = v; }],
        ['showedneed',        () => showedneed,        (v) => { showedneed = v; }],
        ['endScreens',        () => endScreens,        (v) => { endScreens = v; }],
        ['randcounter',       () => randcounter,       (v) => { randcounter = v; }],
    ];

    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: true,
        });
    }

    // Functions — direct assignment
    w.setRandomSeed = setRandomSeed;
    w.clearRandomSeed = clearRandomSeed;
    w.getRandomSeed = getRandomSeed;
    w.gameRandom = gameRandom;
    w.randomInt = randomInt;
    w.pushloc = pushloc;
    w.poploc = poploc;
    w.randomchoice = randomchoice;
    w.incrandom = incrandom;
    w.pickrandom = pickrandom;
    w.randomIndex = randomIndex;
    w.range = range;
    w.formatString = formatString;
    w.formatAll = formatAll;
    w.printDialogue = printDialogue;
    w.randomize = randomize;
}

// Self-expose at module load time so that window globals are available
// before any other module in the bundle initializes.
exposeShimsOnWindow();
