// Legacy global state and utility functions.
// Originally in shims.js (loaded before the bundle via <script> tag).
// Now a module in the bundle — values exposed on window via exposeShimsOnWindow().

// ============================================================================
// Game state variables (initial values)
// ============================================================================
export let locStack: string[] = ["yourhome"];
function resolveLegacyLocStackOwner(): string[] {
    const w = globalThis as any;
    if (Array.isArray(w?.gameState?.LegacyLocStack)) {
        return w.gameState.LegacyLocStack;
    }
    return locStack;
}

export function setLocStack(val: string[]) {
    const nextStack = Array.isArray(val) ? val : [];
    locStack = nextStack;

    const w = globalThis as any;
    if (w?.gameState) {
        w.gameState.LegacyLocStack = nextStack;
    }
}
export let money: number = 200;
export function setMoney(val: number) {
    money = Number(val);
    const w = globalThis as any;
    if (w?.gameState) {
        w.gameState.Money = money;
    }
}
export let thetime: number = 0;
export function setThetime(val: number) { thetime = val; }
export let hour: number = 7;
export function setHour(val: number) { hour = val; }
export let minute: number = 0;
export function setMinute(val: number) { minute = val; }
export let meridian: string = "PM";
export function setMeridian(val: string) { meridian = val; }
export let late: number = 0;
export function setLate(val: number) { late = val; }
export let playerbladder: boolean = true;
export function setPlayerbladder(val: any) { playerbladder = val; }

export let flirtedflag: number = 0;
export function setFlirtedflag(val: number) { flirtedflag = val; }
export let flirtcounter: number = 0;
export function setFlirtcounter(val: number) { flirtcounter = val; }
export let noflirtflag: number = 0;
export function setNoflirtflag(val: number) { noflirtflag = val; }
export let checkedherout: number = 0;
export function setCheckedherout(val: number) { checkedherout = val; }
export let haveherpurse: number = 0;
export function setHaveherpurse(val: number) { haveherpurse = val; }
export let owedfavor: number = 0;
export function setOwedfavor(val: number) { owedfavor = val; }
export let changevenueflag: number = 0;
export function setChangevenueflag(val: number) { changevenueflag = val; }
export let shopping: number = 0;
export function setShopping(val: number) { shopping = val; }

// Flirt / interaction limits
export let maxflirts: number = 2;
export function setMaxflirts(val: number) { maxflirts = val; }
export let randmax: number = 5;

// Venue closing times (ticks from 7 PM)
export let clubclosingtime: number = 7 * 60;    // 2:00 AM
export function setClubclosingtime(val: number) { clubclosingtime = val; }
export let theaterclosingtime: number = 3 * 60;  // 10:00 PM last showing
export function setTheaterclosingtime(val: number) { theaterclosingtime = val; }
export let barclosingtime: number = 6 * 60;      // 1:00 AM
export function setBarclosingtime(val: number) { barclosingtime = val; }

// Time
export let timespeed: number = 2;
export let didintro: number = 0;
export function setDidintro(val: number) { didintro = val; }

// Delta tracking (for status bar arrows)
export let lastmoney: number = money;

// JSON data loaded at runtime
export let settings: any;
export function setSettings(val: any) { settings = val; }
export let statsBars: any;
export function setStatsBars(val: any) { statsBars = val; }
export let showedneed: any;
export function setShowedneed(val: any) { showedneed = val; }
export let endScreens: any;
export function setEndScreens(val: any) { endScreens = val; }

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
    const stack = resolveLegacyLocStackOwner();
    stack.unshift(loc);
    if (stack !== locStack) {
        locStack = stack;
    }
}

export function poploc(): string | undefined {
    const stack = resolveLegacyLocStackOwner();
    const popped = stack.shift();
    if (stack !== locStack) {
        locStack = stack;
    }
    return popped;
}

export function setCurrentLegacyLocationTag(locationTag: string): void {
    const stack = resolveLegacyLocStackOwner();
    if (stack.length === 0) {
        stack.unshift(locationTag);
    } else {
        stack[0] = locationTag;
    }

    if (stack !== locStack) {
        locStack = stack;
    }
}

const typedLocationTagByCategory: Record<number, string> = {
    5: "yourhome",
    6: "gostore",
    7: "callher",
    8: "drinkinggame",
};

/**
 * Transitional location read adapter.
 * Uses typed CurrentLocation when available and falls back to the legacy stack.
 */
export function getCurrentLocationTag(): string {
    const w = globalThis as any;
    const typedCategory = w?.gameState?.CurrentLocation?.category;
    if (typeof typedCategory === "number") {
        const mapped = typedLocationTagByCategory[typedCategory];
        if (mapped) {
            return mapped;
        }
    }
    return locStack[0] ?? "";
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
export function setRandcounter(val: number) { randcounter = val; }
export function setLastmoney(val: number) {
    lastmoney = Number(val);
    const w = globalThis as any;
    if (w?.gameState) {
        w.gameState.LastMoney = lastmoney;
    }
}
export function setRandmax(val: number) { randmax = val; }
export function setTimespeed(val: number) { timespeed = val; }

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
// Window bridge — expose all shims globals on window so existing code
// that references bare variable names (resolved via global scope) works.
// ============================================================================
export function exposeShimsOnWindow(): void {
    const w = window as any;

    // Mutable state — defineProperty keeps module and global in sync
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['locStack',          () => locStack,          (v) => { setLocStack(v); }],
        ['money',             () => ((window as any).gameState?.Money ?? money), (v) => { setMoney(v); }],
        ['thetime',           () => thetime,           (v) => { thetime = v; }],
        ['hour',              () => hour,              (v) => { hour = v; }],
        ['minute',            () => minute,            (v) => { minute = v; }],
        ['meridian',          () => meridian,          (v) => { meridian = v; }],
        ['late',              () => late,              (v) => { late = v; }],
        ['playerbladder',     () => playerbladder,     (v) => { playerbladder = v; }],
        ['flirtedflag',       () => flirtedflag,       (v) => { flirtedflag = v; }],
        ['flirtcounter',      () => flirtcounter,      (v) => { flirtcounter = v; }],
        ['noflirtflag',       () => noflirtflag,       (v) => { noflirtflag = v; }],
        ['checkedherout',     () => checkedherout,     (v) => { checkedherout = v; }],
        ['haveherpurse',      () => haveherpurse,      (v) => { haveherpurse = v; }],
        ['owedfavor',         () => owedfavor,         (v) => { owedfavor = v; }],
        ['changevenueflag',   () => changevenueflag,   (v) => { changevenueflag = v; }],
        ['shopping',          () => shopping,          (v) => { shopping = v; }],
        ['maxflirts',         () => maxflirts,         (v) => { maxflirts = v; }],
        ['randmax',           () => randmax,           (v) => { randmax = v; }],
        ['clubclosingtime',   () => clubclosingtime,   (v) => { clubclosingtime = v; }],
        ['theaterclosingtime',() => theaterclosingtime,(v) => { theaterclosingtime = v; }],
        ['barclosingtime',    () => barclosingtime,    (v) => { barclosingtime = v; }],
        ['timespeed',         () => timespeed,         (v) => { timespeed = v; }],
        ['didintro',          () => didintro,          (v) => { didintro = v; }],
        ['lastmoney',         () => ((window as any).gameState?.LastMoney ?? lastmoney), (v) => { setLastmoney(v); }],
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
    w.getCurrentLocationTag = getCurrentLocationTag;
    w.randomchoice = randomchoice;
    w.incrandom = incrandom;
    w.pickrandom = pickrandom;
    w.randomIndex = randomIndex;
    w.range = range;
    w.formatString = formatString;
    w.formatAll = formatAll;
    w.randomize = randomize;
}

// Self-expose at module load time so that window globals are available
// before any other module in the bundle initializes.
exposeShimsOnWindow();
