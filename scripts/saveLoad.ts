// Save/load system for FamMel game state.
// Snapshots all module-scoped mutable state via window property bridges
// and restores through the same bridge setters.
//
// Architecture: The expose*OnWindow() bridges use Object.defineProperty
// getter/setter pairs. Reading window.X returns the module-scoped let;
// writing window.X = v sets it. This module exploits that for zero-churn
// save/load — no game logic files need changes.

import { backPackItems, herpurse } from './backPackItems';

const SAVE_VERSION = 1;
const STORAGE_KEY = 'fammel_save';

// ---------------------------------------------------------------------------
// Field lists — every window-exposed mutable variable, grouped by source
// ---------------------------------------------------------------------------

// Scalar fields: primitives read/written via defineProperty getter/setter.
// Saved with direct copy, restored with direct assignment.
const SIMPLE_FIELDS = [
    // shims.ts — gameplay
    'money', 'thetime', 'hour', 'minute', 'meridian', 'late',
    'attraction', 'shyness', 'flirtedflag', 'flirtcounter', 'noflirtflag',
    'checkedherout', 'haveherpurse', 'owedfavor', 'changevenueflag', 'shopping',
    'didintro', 'showedneed', 'randcounter',
    'lastmoney', 'lastattraction', 'lastshyness',
    // shims.ts — config (save these so restored game has same settings)
    'maxflirts', 'maxkiss', 'maxfeel', 'randmax',
    'clubclosingtime', 'theaterclosingtime', 'barclosingtime', 'timespeed',
    'playerbladder',
    // bladder.ts
    'customurge', 'minurge', 'minperc',
    'bladurge', 'bladneed', 'blademer', 'bladlose', 'bladcumlose', 'bladsexlose',
    'maxtummy', 'maxbeer', 'tummy', 'bladder',
    'bladDec', 'bladDespDec', 'seal',
    'beerdecCounter', 'ybeerdecCounter',
    'peedtowels', 'peedvase', 'peedshot', 'peedoutside',
    'lastpeetime', 'timeheld', 'drankbeer',
    'notdesperate', 'notydesperate', 'nothdesperate',
    'spurtthresh', 'yspurtthresh', 'bribeaskthresh', 'bribeAskBase',
    'tumavg', 'rrlockedflag', 'shespurted', 'brokeice', 'sawherpee',
    'wetlegs', 'wetherpanties', 'nowpeeing', 'gottagoflag',
    'askholditcounter', 'waitcounter',
    // yourbladder.ts
    'yourbladder', 'yourtummy', 'yourtumavg', 'holdself',
    'yourbladurge', 'yourbladneed', 'yourblademer', 'yourbladlose',
    'yourbladcumlose', 'yourbladsexlose',
    'ymaxtummy', 'ymaxbeer', 'yourcustomurge', 'yminurge',
    'ynowpeeing', 'ylastpeetime', 'ytimeheld',
    'ydrankcocktails', 'ydranksodas', 'ydrankwaters', 'ydrankbeers', 'ydrankbeer',
    'yrrlockedflag', 'youSpurted',
    // fuckHer.ts
    'arousal', 'kisscounter', 'feelcounter', 'fuckingnow',
    'champagnecounter', 'drankChamp',
    // drive.ts
    'wetthecar',
    // settings.ts
    'enableimages', 'enableascii', 'playerGame', 'showstats',
    'photoChoice', 'favoritemovie', 'suggestedloc', 'heroutfit',
    'multiplemoves', 'rstmoves',
    // quotes.ts — gameplay strings
    'pantycolor', 'girlname', 'customgirlname', 'basegirl',
    'girltalk', 'girlgasp', 'comma',
    // backPackItems.ts
    'allowItems', 'homeChampagne',
    // images.ts
    'picset',
    // locations.ts
    'emerBreak', 'emerHold',
    // driveAround.ts
    'gasStation',
    // theBar.ts
    'bartopic', 'loser',
    // theClub.ts
    'externalflirt', 'wetPhoto', 'isNude', 'posectr', 'outfitctr',
    // theatre.ts
    'rrMovieLineThresh', 'moviecounter', 'moviechoice', 'askedfavourite', 'seenmovie',
    // theMakeOut.ts
    'askedswim', 'walkcounter',
    // herhome.ts
    'prepeed', 'elevatorwaitcounter', 'floorcounter',
] as const;

// Object/array fields: need JSON deep-clone for save.
// All use defineProperty, so window setter replaces the module-scoped let.
const DEEP_FIELDS = [
    // shims.ts
    'locStack',
    // shims.ts — JSON caches (included so restore doesn't need async re-fetches)
    'settings', 'statsBars', 'endScreens',
    // bladder.ts
    'toldstories', 'lastStory',
    // fuckHer.ts
    'sexActions',
    // quotes.ts — JSON caches
    'calledjsons', 'locjson',
    'flirtresps', 'feelUp', 'kissing', 'ypeelines', 'peelines',
    'needs', 'yneeds', 'drinklines', 'appearance', 'drive', 'general',
    'darts', 'sexLines', 'objQuotes',
    // locations.ts
    'locations', 'sharedLoc',
    // theBar.ts
    'bar', 'talkUnused',
    // theClub.ts
    'club',
    // theatre.ts
    'theatre',
    // theMakeOut.ts
    'makeOut',
    // herhome.ts
    'herHome',
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone(obj: any): any {
    if (obj == null) return obj;
    return JSON.parse(JSON.stringify(obj));
}

/** Replace all own keys in target with those from source (recursive for objects). */
function deepMerge(target: any, source: any): void {
    for (const key of Object.keys(target)) {
        if (!(key in source)) delete target[key];
    }
    for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && !Array.isArray(value)
            && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
            deepMerge(target[key], value);
        } else {
            target[key] = deepClone(value);
        }
    }
}

// ---------------------------------------------------------------------------
// Core save / load
// ---------------------------------------------------------------------------

export function createSave(): Record<string, any> {
    const w = window as any;
    const save: Record<string, any> = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
    };

    for (const key of SIMPLE_FIELDS) save[key] = w[key];
    for (const key of DEEP_FIELDS) save[key] = deepClone(w[key]);

    // Const objects exposed via Object.assign (shared reference, not defineProperty).
    // Deep-clone captures mutable item counts, drank amounts, etc.
    save.backPackItems = deepClone(backPackItems);
    save.herpurse = deepClone(herpurse);

    return save;
}

export function loadSave(save: Record<string, any>): void {
    if (save.version !== SAVE_VERSION) {
        throw new Error(`Save version ${save.version} not supported (expected ${SAVE_VERSION})`);
    }

    const w = window as any;

    // Restore scalars via window setters (writes to module-scoped lets)
    for (const key of SIMPLE_FIELDS) {
        if (key in save) w[key] = save[key];
    }

    // Restore objects/arrays via window setters (replaces module-scoped lets)
    for (const key of DEEP_FIELDS) {
        if (key in save) w[key] = deepClone(save[key]);
    }

    // Const objects: can't reassign the module const, must merge into existing ref
    if (save.backPackItems) deepMerge(backPackItems, save.backPackItems);
    if (save.herpurse) deepMerge(herpurse, save.herpurse);

    // Sync gameState's private backing fields from restored globals
    syncGameState();
}

/** Push restored window globals into the typed gameState singleton.
 *  After connectToGameState(), most variables are already bridged — the
 *  window property setter writes directly to gameState.  Only un-bridged
 *  variables (time, etc.) still need manual sync here.
 */
function syncGameState(): void {
    const w = window as any;
    const gs = w.gameState;
    if (!gs) return;

    // Time is not yet bridged — sync manually
    gs.Time.hour = w.hour;
    gs.Time.minute = w.minute;
    gs.Time.totalTime = w.thetime;
}

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------

export function saveToSlot(slot = 0): void {
    const save = createSave();
    const json = JSON.stringify(save);
    localStorage.setItem(`${STORAGE_KEY}_${slot}`, json);
}

export function loadFromSlot(slot = 0): boolean {
    const json = localStorage.getItem(`${STORAGE_KEY}_${slot}`);
    if (!json) return false;
    loadSave(JSON.parse(json));
    return true;
}

export function hasSave(slot = 0): boolean {
    return localStorage.getItem(`${STORAGE_KEY}_${slot}`) !== null;
}

export function deleteSave(slot = 0): void {
    localStorage.removeItem(`${STORAGE_KEY}_${slot}`);
}

// ---------------------------------------------------------------------------
// File-based import / export
// ---------------------------------------------------------------------------

export function exportSave(): string {
    return JSON.stringify(createSave(), null, 2);
}

export function importSave(json: string): void {
    loadSave(JSON.parse(json));
}
