// Legacy global state and utility functions.
// Originally in shims.js (loaded before the bundle via <script> tag).
// Now a module in the bundle — values exposed on window via exposeShimsOnWindow().

// ============================================================================
// Game state variables (initial values)
// ============================================================================
export let locStack: string[] = ["yourhome"];
export function setLocStack(val: string[]) { locStack = val; }
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

// Interaction / flirt state
export let attraction: number = 10;
export function setAttraction(val: number) { attraction = val; }
export let shyness: number = 90;
export function setShyness(val: number) { shyness = val; }
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
export let lastattraction: number = attraction;
export let lastshyness: number = shyness;

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
export function setLastattraction(val: number) { lastattraction = val; }
export function setLastshyness(val: number) { lastshyness = val; }
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
// Connect window bridges to gameState — makes gameState the sole authority
// for absorbed variables.  Call once after gameState.init() + initial sync.
// ============================================================================
export function connectToGameState(gs: any): void {
    const w = window as any;

    const getByPath = (obj: any, path: string): any => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const setByPath = (obj: any, path: string, value: any): void => {
        const keys = path.split('.');
        const last = keys.pop();
        if (!last) {
            return;
        }

        let current = obj;
        for (const key of keys) {
            if (current[key] === undefined || current[key] === null) {
                current[key] = {};
            }
            current = current[key];
        }
        current[last] = value;
    };

    const definePropertyByPath = (obj: any, path: string, descriptor: PropertyDescriptor): void => {
        const keys = path.split('.');
        const last = keys.pop();
        if (!last) {
            return;
        }

        let current = obj;
        for (const key of keys) {
            if (current[key] === undefined || current[key] === null) {
                current[key] = {};
            }
            current = current[key];
        }

        Object.defineProperty(current, last, descriptor);
    };

    // ========================================================================
    // FORWARD bridges — shims-owned variables.
    // These module vars are NOT read/written by module code after init, so
    // overriding window.x → gs.X is safe.  All runtime access goes through
    // window, which now delegates to gameState.
    // ========================================================================

    const shimsNumericProps: Array<[string, string]> = [
        ['money',          'Money'],
        ['attraction',     'Attraction'],
        ['shyness',        'Shyness'],
        ['lastmoney',      'LastMoney'],
        ['lastattraction', 'LastAttraction'],
        ['lastshyness',    'LastShyness'],
        ['flirtcounter',   'Interactions.FlirtCounter'],
        ['randcounter',    'randCounter'],
        ['owedfavor',      'OwedFavour'],
        ['late',           'Late'],
        ['flirtedflag',    'Interactions.FlirtedFlag'],
        ['noflirtflag',    'Interactions.NoFlirtFlag'],
        ['shopping',       'Shopping'],
        ['maxflirts',      'Interactions.MaxFlirts'],
        ['randmax',        'Interactions.RandMax'],
        ['clubclosingtime','ClubClosingTime'],
        ['theaterclosingtime','TheaterClosingTime'],
        ['barclosingtime', 'BarClosingTime'],
        ['timespeed',      'TimeSpeed'],
    ];

    const shimsBoolProps: Array<[string, string]> = [
        ['didintro',       'DidIntro'],
        ['haveherpurse',   'HavePurse'],
        ['changevenueflag','Interactions.ChangeVenueFlag'],
        ['checkedherout',  'Interactions.CheckedHerOut'],
        ['showedneed',     'Interactions.ShowedNeed'],
        ['playerbladder',  'PlayerBladder'],
    ];

    // Seed gameState from current window values, then override window bridge.
    for (const [globalName, gsProp] of shimsNumericProps) {
        const cur = w[globalName];
        if (cur !== undefined) setByPath(gs, gsProp, cur);
        Object.defineProperty(w, globalName, {
            get: () => getByPath(gs, gsProp),
            set: (v: any) => { setByPath(gs, gsProp, v); },
            configurable: true,
            enumerable: true,
        });
    }

    for (const [globalName, gsProp] of shimsBoolProps) {
        const cur = w[globalName];
        if (cur !== undefined) setByPath(gs, gsProp, !!cur);
        Object.defineProperty(w, globalName, {
            get: () => getByPath(gs, gsProp),
            set: (v: any) => { setByPath(gs, gsProp, !!v); },
            configurable: true,
            enumerable: true,
        });
    }

    // Time system — forward bridge (shims-owned)
    if (w.thetime !== undefined) gs.Time.totalTime = w.thetime;
    if (w.hour !== undefined) gs.Time.hour = w.hour;
    if (w.minute !== undefined) gs.Time.minute = w.minute;
    Object.defineProperty(w, 'thetime', {
        get: () => gs.Time.totalTime,
        set: (v: any) => { gs.Time.totalTime = v; },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(w, 'hour', {
        get: () => gs.Time.hour,
        set: (v: any) => { gs.Time.hour = v; },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(w, 'minute', {
        get: () => gs.Time.minute,
        set: (v: any) => { gs.Time.minute = v; },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(w, 'meridian', {
        get: () => gs.Time.meridian,
        set: () => {},  // derived from hour — no-op
        configurable: true, enumerable: true,
    });

    // ========================================================================
    // REVERSE bridges — non-shims module variables.
    // These vars are read/written by their module code via the local `let`
    // variable.  The expose*OnWindow() bridges keep window ↔ module var in
    // sync.  We define gs.X as a pass-through to window.x so gameState
    // always sees the live module value without overriding the window bridge.
    // ========================================================================

    const moduleNumericProps: Array<[string, string]> = [
        // fuckHer.ts state
        // NOTE: Do not reverse-bridge Romance.* fields here.
        // exposeFuckHerOnWindow() already maps window.<field> directly to
        // gameState.Romance.<field>; adding reverse bridges causes a
        // window -> gameState -> window accessor loop.
        ['drankChamp',     'DrankChamp'],
        // drive.ts state
        ['wetthecar',      'WetTheCar'],
        // locations.ts state
        ['emerBreak',      'EmerBreak'],
        ['emerHold',       'EmerHold'],
        // driveAround.ts state
        ['gasStation',     'GasStation'],
        // theBar.ts state
        ['bartopic',       'BarTopic'],
        // theClub.ts state
        ['externalflirt',  'ExternalFlirt'],
        ['wetPhoto',       'WetPhoto'],
        ['isNude',         'IsNude'],
        ['posectr',        'PoseCtr'],
        ['outfitctr',      'OutfitCtr'],
        // theatre.ts state
        ['rrMovieLineThresh','RrMovieLineThresh'],
        ['moviecounter',   'MovieCounter'],
        ['askedfavourite', 'AskedFavourite'],
        ['seenmovie',      'SeenMovie'],
        // theMakeOut.ts state
        ['askedswim',      'AskedSwim'],
        ['walkcounter',    'WalkCounter'],
        // herhome.ts state
        ['prepeed',        'PrePeed'],
        ['elevatorwaitcounter','ElevatorWaitCounter'],
        ['floorcounter',   'FloorCounter'],
        // settings.ts state
        ['multiplemoves',  'MultipleMoves'],
        ['rstmoves',       'RstMoves'],
        ['showstats',      'ShowStats'],
        ['enableimages',   'EnableImages'],
        ['enableascii',    'EnableAscii'],
        ['playerGame',     'PlayerGame'],
        // quotes.ts state
        ['comma',          'Comma'],
        // backPackItems.ts state
        ['allowItems',     'AllowItems'],
        ['homeChampagne',  'HomeChampagne'],
        // images.ts state
        ['picset',         'PicSet'],
        // bladder.ts state
        ['customurge',     'CustomUrge'],
        ['minurge',        'MinUrge'],
        ['minperc',        'MinPerc'],
        ['bladurge',       'BladUrge'],
        ['bladneed',       'BladNeed'],
        ['blademer',       'BladEmer'],
        ['bladlose',       'BladLose'],
        ['bladcumlose',    'BladCumLose'],
        ['bladsexlose',    'BladSexLose'],
        ['maxtummy',       'MaxTummy'],
        ['maxbeer',        'MaxBeer'],
        ['tummy',          'Tummy'],
        ['bladder',        'Bladder'],
        ['bladDec',        'BladDec'],
        ['bladDespDec',    'BladDespDec'],
        ['seal',           'Seal'],
        ['beerdecCounter', 'BeerDecCounter'],
        ['ybeerdecCounter','YBeerDecCounter'],
        ['peedtowels',     'PeedTowels'],
        ['peedvase',       'PeedVase'],
        ['peedshot',       'PeedShot'],
        ['peedoutside',    'PeedOutside'],
        ['lastpeetime',    'LastPeeTime'],
        ['timeheld',       'TimeHeld'],
        ['drankbeer',      'DrankBeer'],
        ['notdesperate',   'NotDesperate'],
        ['notydesperate',  'NotYDesperate'],
        ['nothdesperate',  'NotHDesperate'],
        ['spurtthresh',    'SpurtThresh'],
        ['yspurtthresh',   'YSpurtThresh'],
        ['bribeaskthresh', 'BribeAskThresh'],
        ['bribeAskBase',   'BribeAskBase'],
        ['tumavg',         'TumAvg'],
        ['rrlockedflag',   'RrLockedFlag'],
        ['shespurted',     'SheSpurted'],
        ['brokeice',       'BrokeIce'],
        ['sawherpee',      'SawHerPee'],
        ['wetlegs',        'WetLegs'],
        ['wetherpanties',  'WetHerPanties'],
        ['nowpeeing',      'NowPeeing'],
        ['gottagoflag',    'GottaGoFlag'],
        ['askholditcounter','AskHoldItCounter'],
        ['waitcounter',    'WaitCounter'],
        // yourbladder.ts state
        ['yourbladder',    'YourBladder'],
        ['yourtummy',      'YourTummy'],
        ['yourtumavg',     'YourTumAvg'],
        ['holdself',       'HoldSelf'],
        ['yourbladurge',   'YourBladUrge'],
        ['yourbladneed',   'YourBladNeed'],
        ['yourblademer',   'YourBladEmer'],
        ['yourbladlose',   'YourBladLose'],
        ['yourbladcumlose','YourBladCumLose'],
        ['yourbladsexlose','YourBladSexLose'],
        ['ymaxtummy',      'YMaxTummy'],
        ['ymaxbeer',       'YMaxBeer'],
        ['yourcustomurge', 'YourCustomUrge'],
        ['yminurge',       'YMinUrge'],
        ['ynowpeeing',     'YNowPeeing'],
        ['ylastpeetime',   'YLastPeeTime'],
        ['ytimeheld',      'YTimeHeld'],
        ['ydrankcocktails','YDrankCocktails'],
        ['ydranksodas',    'YDrankSodas'],
        ['ydrankwaters',   'YDrankWaters'],
        ['ydrankbeers',    'YDrankBeers'],
        ['ydrankbeer',     'YDrankBeer'],
        ['yrrlockedflag',  'YRrLockedFlag'],
        ['youSpurted',     'YouSpurted'],
    ];

    const moduleStringProps: Array<[string, string]> = [
        ['loser',          'Loser'],
        ['moviechoice',    'MovieChoice'],
        // settings.ts state
        ['heroutfit',      'HerOutfit'],
        ['favoritemovie',  'FavoriteMovie'],
        ['suggestedloc',   'SuggestedLoc'],
        ['photoChoice',    'PhotoChoice'],
        // quotes.ts state
        ['pantycolor',     'PantyColor'],
        ['girlname',       'GirlName'],
        ['customgirlname', 'CustomGirlName'],
        ['basegirl',       'BaseGirl'],
        ['girltalk',       'GirlTalk'],
        ['girlgasp',       'GirlGasp'],
        ['imageprev',      'ImagePrev'],
    ];

    // Deep-field variables (toldstories, lastStory, calledjsons, locjson,
    // bar, club, etc.) and locStack are accessed the same way — module code
    // mutates them directly.  They stay on expose*OnWindow() bridges only.
    // gameState has placeholder properties for them but they're reverse-bridged
    // here so gs.X always reads the live module value through window.
    const moduleDeepProps: Array<[string, string]> = [
        ['toldstories',    'ToldStories'],
        ['lastStory',      'LastStory'],
        ['settings',       'Settings'],
        ['statsBars',      'StatsBars'],
        ['endScreens',     'EndScreens'],
        ['sexActions',     'SexActions'],
        ['calledjsons',    'CalledJsons'],
        ['locjson',        'LocJson'],
        ['flirtresps',     'FlirtResps'],
        ['feelUp',         'FeelUp'],
        ['kissing',        'Kissing'],
        ['ypeelines',      'YPeeLines'],
        ['peelines',       'PeeLines'],
        ['needs',          'Needs'],
        ['yneeds',         'YNeeds'],
        ['drinklines',     'DrinkLines'],
        ['appearance',     'Appearance'],
        ['drive',          'Drive'],
        ['general',        'General'],
        ['darts',          'Darts'],
        ['sexLines',       'SexLines'],
        ['objQuotes',      'ObjQuotes'],
        ['locations',      'Locations'],
        ['sharedLoc',      'SharedLoc'],
        ['bar',            'Bar'],
        ['talkUnused',     'TalkUnused'],
        ['club',           'Club'],
        ['theatre',        'Theatre'],
        ['makeOut',        'MakeOut'],
        ['herHome',        'HerHome'],
    ];

    // Reverse bridge: define gs.X as a pass-through to window.x
    const allModuleProps = [
        ...moduleNumericProps,
        ...moduleStringProps,
        ...moduleDeepProps,
    ];
    for (const [globalName, gsProp] of allModuleProps) {
        definePropertyByPath(gs, gsProp, {
            get: () => w[globalName],
            set: (v: any) => { w[globalName] = v; },
            configurable: true,
            enumerable: true,
        });
    }

    // Keep legacy location stack on a direct module bridge to avoid
    // accessor loops through window.locStack <-> gameState.LegacyLocStack.
    definePropertyByPath(gs, 'LegacyLocStack', {
        get: () => locStack,
        set: (v: any) => { locStack = Array.isArray(v) ? v : []; },
        configurable: true,
        enumerable: true,
    });
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
        ['money',             () => ((window as any).gameState?.Money ?? money), (v) => { setMoney(v); }],
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
        ['randmax',           () => randmax,           (v) => { randmax = v; }],
        ['clubclosingtime',   () => clubclosingtime,   (v) => { clubclosingtime = v; }],
        ['theaterclosingtime',() => theaterclosingtime,(v) => { theaterclosingtime = v; }],
        ['barclosingtime',    () => barclosingtime,    (v) => { barclosingtime = v; }],
        ['timespeed',         () => timespeed,         (v) => { timespeed = v; }],
        ['didintro',          () => didintro,          (v) => { didintro = v; }],
        ['lastmoney',         () => ((window as any).gameState?.LastMoney ?? lastmoney), (v) => { setLastmoney(v); }],
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
    w.randomize = randomize;
}

// Self-expose at module load time so that window globals are available
// before any other module in the bundle initializes.
exposeShimsOnWindow();
