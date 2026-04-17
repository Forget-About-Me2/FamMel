// Save/load system for FamMel game state.
// Snapshots all module-scoped mutable state via direct ES module imports
// and restores through setter functions in each source module.
//
// Architecture: A field registry maps each save key to { get, set } using
// direct imports (no window bridges needed).

import { backPackItems, herpurse, allowItems, setAllowItems, homeChampagne, setHomeChampagne } from './backPackItems';
import {
    thetime, setThetime, hour, setHour, minute, setMinute,
    meridian, setMeridian, late, setLate, attraction, setAttraction, shyness, setShyness,
    flirtedflag, setFlirtedflag, flirtcounter, setFlirtcounter, noflirtflag, setNoflirtflag,
    checkedherout, setCheckedherout, haveherpurse, setHaveherpurse, owedfavor, setOwedfavor,
    changevenueflag, setChangevenueflag, shopping, setShopping, didintro, setDidintro,
    showedneed, setShowedneed, randcounter, setRandcounter,
    lastattraction, setLastattraction, lastshyness, setLastshyness,
    maxflirts, setMaxflirts, randmax, setRandmax,
    clubclosingtime, setClubclosingtime, theaterclosingtime, setTheaterclosingtime,
    barclosingtime, setBarclosingtime, timespeed, setTimespeed,
    playerbladder, setPlayerbladder,
    settings, setSettings, statsBars, setStatsBars, endScreens, setEndScreens,
} from './shims';
import {
    customurge, setCustomurge, minurge, setMinurge, minperc, setMinperc,
    bladurge, setBladurge, bladneed, setBladneed, blademer, setBlademer,
    bladlose, setBladlose, bladcumlose, setBladcumlose, bladsexlose, setBladsexlose,
    maxtummy, setMaxtummy, maxbeer, setMaxbeer, tummy, setTummy, bladder, setBladder,
    bladDec, setBladDec, bladDespDec, setBladDespDec, seal, setSeal,
    beerdecCounter, setBeerdecCounter, ybeerdecCounter, setYbeerdecCounter,
    peedtowels, setPeedtowels, peedvase, setPeedvase, peedshot, setPeedshot, peedoutside, setPeedoutside,
    lastpeetime, setLastpeetime, timeheld, setTimeheld, drankbeer, setDrankbeer,
    notdesperate, setNotdesperate, notydesperate, setNotydesperate, nothdesperate, setNothdesperate,
    spurtthresh, setSpurtthresh, yspurtthresh, setYspurtthresh,
    bribeaskthresh, setBribeaskthresh, bribeAskBase, setBribeAskBase,
    tumavg, setTumavg, rrlockedflag, setRrlockedflag, shespurted, setShespurted,
    brokeice, setBrokeice, sawherpee, setSawherpee,
    wetlegs, setWetlegs, wetherpanties, setWetherpanties, nowpeeing, setNowpeeing,
    gottagoflag, setGottagoflag, askholditcounter, setAskholditcounter, waitcounter, setWaitcounter,
    toldstories, setToldstories, lastStory, setLastStory,
} from './bladder';
import {
    yourbladder, setYourbladder, yourtummy, setYourtummy, yourtumavg, setYourtumavg,
    holdself, setHoldself, yourbladurge, setYourbladurge,
    yourbladneed, setYourbladneed, yourblademer, setYourblademer,
    yourbladlose, setYourbladlose, yourbladcumlose, setYourbladcumlose,
    yourbladsexlose, setYourbladsexlose,
    ymaxtummy, setYmaxtummy, ymaxbeer, setYmaxbeer, yourcustomurge, setYourcustomurge,
    yminurge, setYminurge, ynowpeeing, setYnowpeeing,
    ylastpeetime, setYlastpeetime, ytimeheld, setYtimeheld,
    ydrankcocktails, setYdrankcocktails, ydranksodas, setYdranksodas,
    ydrankwaters, setYdrankwaters, ydrankbeers, setYdrankbeers, ydrankbeer, setYdrankbeer,
    yrrlockedflag, setYrrlockedflag, youSpurted, setYouSpurted,
} from './yourbladder';
import { gameState } from './gameState/gameState';
import {
    drankChamp, setDrankChamp,
    sexActions, setSexActions,
} from './fuckHer';
import { wetthecar, setWetthecar } from './drive';
import {
    enableimages, setEnableimages, enableascii, setEnableascii, playerGame, setPlayerGame,
    showstats, setShowstats, photoChoice, setPhotoChoice, favoritemovie, setFavoritemovie,
    suggestedloc, setSuggestedloc, heroutfit, setHeroutfit, multiplemoves, setMultiplemoves,
    rstmoves, setRstmoves,
} from './settings';
import {
    pantycolor, setPantycolor, girlname, setGirlname, customgirlname, setCustomgirlname,
    basegirl, setBasegirl, girltalk, setGirltalk, girlgasp, setGirlgasp, comma, setComma,
    calledjsons, setCalledjsons, locjson, setLocjson,
    flirtresps, setFlirtresps, feelUp, setFeelUp, kissing, setKissing,
    ypeelines, setYpeelines, peelines, setPeelines,
    needs, setNeeds, yneeds, setYneeds, drinklines, setDrinklines,
    appearance, setAppearance, drive, setDrive, general, setGeneral,
    darts, setDarts, sexLines, setSexLines, objQuotes, setObjQuotes,
} from './quotes';
import { picset, setPicset } from './images';
import { emerBreak, setEmerBreak, emerHold, setEmerHold, locations, setLocations, sharedLoc, setSharedLoc } from './locations';
import { gasStation, setGasStation } from './locations/driveAround';
import { bartopic, setBartopic, loser, setLoser, bar, setBar, talkUnused, setTalkUnused } from './locations/theBar';
import {
    externalflirt, setExternalflirt, wetPhoto, setWetPhoto, isNude, setIsNude,
    posectr, setPosectr, outfitctr, setOutfitctr, club, setClub,
} from './locations/theClub';
import {
    rrMovieLineThresh, setRrMovieLineThresh, moviecounter, setMoviecounter,
    moviechoice, setMoviechoice, askedfavourite, setAskedfavourite,
    seenmovie, setSeenmovie, theatre, setTheatre,
} from './locations/theatre';
import { askedswim, setAskedswim, walkcounter, setWalkcounter, makeOut, setMakeOut } from './locations/theMakeOut';
import { prepeed, setPrepeed, elevatorwaitcounter, setElevatorwaitcounter, floorcounter, setFloorcounter, herHome, setHerHome } from './herhome';

const SAVE_VERSION = 1;
const STORAGE_KEY = 'fammel_save';

// ---------------------------------------------------------------------------
// Field registry — maps save keys to { get, set } using direct imports.
// No window bridges needed.
// ---------------------------------------------------------------------------

interface FieldEntry {
    get: () => any;
    set: (v: any) => void;
    deep?: boolean; // true = deep-clone on save/load
}

/** All saveable fields. Each entry reads/writes a module-scoped variable. */
const FIELD_REGISTRY: Record<string, FieldEntry> = {
    // --- shims.ts — gameplay ---
    money:              { get: () => gameState.Money, set: (v) => { gameState.Money = Number(v); } },
    thetime:            { get: () => thetime, set: setThetime },
    hour:               { get: () => hour, set: setHour },
    minute:             { get: () => minute, set: setMinute },
    meridian:           { get: () => meridian, set: setMeridian },
    late:               { get: () => late, set: setLate },
    attraction:         { get: () => attraction, set: setAttraction },
    shyness:            { get: () => shyness, set: setShyness },
    flirtedflag:        { get: () => flirtedflag, set: setFlirtedflag },
    flirtcounter:       { get: () => flirtcounter, set: setFlirtcounter },
    noflirtflag:        { get: () => noflirtflag, set: setNoflirtflag },
    checkedherout:      { get: () => checkedherout, set: setCheckedherout },
    haveherpurse:       { get: () => haveherpurse, set: setHaveherpurse },
    owedfavor:          { get: () => owedfavor, set: setOwedfavor },
    changevenueflag:    { get: () => changevenueflag, set: setChangevenueflag },
    shopping:           { get: () => shopping, set: setShopping },
    didintro:           { get: () => didintro, set: setDidintro },
    showedneed:         { get: () => showedneed, set: setShowedneed },
    randcounter:        { get: () => randcounter, set: setRandcounter },
    lastmoney:          { get: () => gameState.LastMoney, set: (v) => { gameState.LastMoney = Number(v); } },
    lastattraction:     { get: () => lastattraction, set: setLastattraction },
    lastshyness:        { get: () => lastshyness, set: setLastshyness },
    // --- shims.ts — config ---
    maxflirts:          { get: () => maxflirts, set: setMaxflirts },
    maxkiss:            { get: () => gameState.Romance.MaxKiss, set: (v) => { gameState.Romance.MaxKiss = v; } },
    maxfeel:            { get: () => gameState.Romance.MaxFeel, set: (v) => { gameState.Romance.MaxFeel = v; } },
    randmax:            { get: () => randmax, set: setRandmax },
    clubclosingtime:    { get: () => clubclosingtime, set: setClubclosingtime },
    theaterclosingtime: { get: () => theaterclosingtime, set: setTheaterclosingtime },
    barclosingtime:     { get: () => barclosingtime, set: setBarclosingtime },
    timespeed:          { get: () => timespeed, set: setTimespeed },
    playerbladder:      { get: () => playerbladder, set: setPlayerbladder },
    // --- shims.ts — deep ---
    // Canonical owner is gameState.LegacyLocStack.
    legacyLocStack:     { get: () => gameState.LegacyLocStack, set: (v) => { gameState.LegacyLocStack = v; }, deep: true },
    settings:           { get: () => settings, set: setSettings, deep: true },
    statsBars:          { get: () => statsBars, set: setStatsBars, deep: true },
    endScreens:         { get: () => endScreens, set: setEndScreens, deep: true },
    // --- bladder.ts ---
    customurge:         { get: () => customurge, set: setCustomurge },
    minurge:            { get: () => minurge, set: setMinurge },
    minperc:            { get: () => minperc, set: setMinperc },
    bladurge:           { get: () => bladurge, set: setBladurge },
    bladneed:           { get: () => bladneed, set: setBladneed },
    blademer:           { get: () => blademer, set: setBlademer },
    bladlose:           { get: () => bladlose, set: setBladlose },
    bladcumlose:        { get: () => bladcumlose, set: setBladcumlose },
    bladsexlose:        { get: () => bladsexlose, set: setBladsexlose },
    maxtummy:           { get: () => maxtummy, set: setMaxtummy },
    maxbeer:            { get: () => maxbeer, set: setMaxbeer },
    tummy:              { get: () => tummy, set: setTummy },
    bladder:            { get: () => bladder, set: setBladder },
    bladDec:            { get: () => bladDec, set: setBladDec },
    bladDespDec:        { get: () => bladDespDec, set: setBladDespDec },
    seal:               { get: () => seal, set: setSeal },
    beerdecCounter:     { get: () => beerdecCounter, set: setBeerdecCounter },
    ybeerdecCounter:    { get: () => ybeerdecCounter, set: setYbeerdecCounter },
    peedtowels:         { get: () => peedtowels, set: setPeedtowels },
    peedvase:           { get: () => peedvase, set: setPeedvase },
    peedshot:           { get: () => peedshot, set: setPeedshot },
    peedoutside:        { get: () => peedoutside, set: setPeedoutside },
    lastpeetime:        { get: () => lastpeetime, set: setLastpeetime },
    timeheld:           { get: () => timeheld, set: setTimeheld },
    drankbeer:          { get: () => drankbeer, set: setDrankbeer },
    notdesperate:       { get: () => notdesperate, set: setNotdesperate },
    notydesperate:      { get: () => notydesperate, set: setNotydesperate },
    nothdesperate:      { get: () => nothdesperate, set: setNothdesperate },
    spurtthresh:        { get: () => spurtthresh, set: setSpurtthresh },
    yspurtthresh:       { get: () => yspurtthresh, set: setYspurtthresh },
    bribeaskthresh:     { get: () => bribeaskthresh, set: setBribeaskthresh },
    bribeAskBase:       { get: () => bribeAskBase, set: setBribeAskBase },
    tumavg:             { get: () => tumavg, set: setTumavg },
    rrlockedflag:       { get: () => rrlockedflag, set: setRrlockedflag },
    shespurted:         { get: () => shespurted, set: setShespurted },
    brokeice:           { get: () => brokeice, set: setBrokeice },
    sawherpee:          { get: () => sawherpee, set: setSawherpee },
    wetlegs:            { get: () => wetlegs, set: setWetlegs },
    wetherpanties:      { get: () => wetherpanties, set: setWetherpanties },
    nowpeeing:          { get: () => nowpeeing, set: setNowpeeing },
    gottagoflag:        { get: () => gottagoflag, set: setGottagoflag },
    askholditcounter:   { get: () => askholditcounter, set: setAskholditcounter },
    waitcounter:        { get: () => waitcounter, set: setWaitcounter },
    // --- bladder.ts — deep ---
    toldstories:        { get: () => toldstories, set: setToldstories, deep: true },
    lastStory:          { get: () => lastStory, set: setLastStory, deep: true },
    // --- yourbladder.ts ---
    yourbladder:        { get: () => yourbladder, set: setYourbladder },
    yourtummy:          { get: () => yourtummy, set: setYourtummy },
    yourtumavg:         { get: () => yourtumavg, set: setYourtumavg },
    holdself:           { get: () => holdself, set: setHoldself },
    yourbladurge:       { get: () => yourbladurge, set: setYourbladurge },
    yourbladneed:       { get: () => yourbladneed, set: setYourbladneed },
    yourblademer:       { get: () => yourblademer, set: setYourblademer },
    yourbladlose:       { get: () => yourbladlose, set: setYourbladlose },
    yourbladcumlose:    { get: () => yourbladcumlose, set: setYourbladcumlose },
    yourbladsexlose:    { get: () => yourbladsexlose, set: setYourbladsexlose },
    ymaxtummy:          { get: () => ymaxtummy, set: setYmaxtummy },
    ymaxbeer:           { get: () => ymaxbeer, set: setYmaxbeer },
    yourcustomurge:     { get: () => yourcustomurge, set: setYourcustomurge },
    yminurge:           { get: () => yminurge, set: setYminurge },
    ynowpeeing:         { get: () => ynowpeeing, set: setYnowpeeing },
    ylastpeetime:       { get: () => ylastpeetime, set: setYlastpeetime },
    ytimeheld:          { get: () => ytimeheld, set: setYtimeheld },
    ydrankcocktails:    { get: () => ydrankcocktails, set: setYdrankcocktails },
    ydranksodas:        { get: () => ydranksodas, set: setYdranksodas },
    ydrankwaters:       { get: () => ydrankwaters, set: setYdrankwaters },
    ydrankbeers:        { get: () => ydrankbeers, set: setYdrankbeers },
    ydrankbeer:         { get: () => ydrankbeer, set: setYdrankbeer },
    yrrlockedflag:      { get: () => yrrlockedflag, set: setYrrlockedflag },
    youSpurted:         { get: () => youSpurted, set: setYouSpurted },
    // --- fuckHer.ts / RomanceState ---
    arousal:            { get: () => gameState.Romance.Arousal, set: (v) => { gameState.Romance.Arousal = v; } },
    kisscounter:        { get: () => gameState.Romance.KissCounter, set: (v) => { gameState.Romance.KissCounter = v; } },
    feelcounter:        { get: () => gameState.Romance.FeelCounter, set: (v) => { gameState.Romance.FeelCounter = v; } },
    fuckingnow:         { get: () => gameState.Romance.FuckingNow, set: (v) => { gameState.Romance.FuckingNow = v; } },
    champagnecounter:   { get: () => gameState.Romance.ChampagneCounter, set: (v) => { gameState.Romance.ChampagneCounter = v; } },
    drankChamp:         { get: () => drankChamp, set: setDrankChamp },
    sexActions:         { get: () => sexActions, set: setSexActions, deep: true },
    // --- drive.ts ---
    wetthecar:          { get: () => wetthecar, set: setWetthecar },
    // --- settings.ts ---
    enableimages:       { get: () => enableimages, set: setEnableimages },
    enableascii:        { get: () => enableascii, set: setEnableascii },
    playerGame:         { get: () => playerGame, set: setPlayerGame },
    showstats:          { get: () => showstats, set: setShowstats },
    photoChoice:        { get: () => photoChoice, set: setPhotoChoice },
    favoritemovie:      { get: () => favoritemovie, set: setFavoritemovie },
    suggestedloc:       { get: () => suggestedloc, set: setSuggestedloc },
    heroutfit:          { get: () => heroutfit, set: setHeroutfit },
    multiplemoves:      { get: () => multiplemoves, set: setMultiplemoves },
    rstmoves:           { get: () => rstmoves, set: setRstmoves },
    // --- quotes.ts ---
    pantycolor:         { get: () => pantycolor, set: setPantycolor },
    girlname:           { get: () => girlname, set: setGirlname },
    customgirlname:     { get: () => customgirlname, set: setCustomgirlname },
    basegirl:           { get: () => basegirl, set: setBasegirl },
    girltalk:           { get: () => girltalk, set: setGirltalk },
    girlgasp:           { get: () => girlgasp, set: setGirlgasp },
    comma:              { get: () => comma, set: setComma },
    calledjsons:        { get: () => calledjsons, set: setCalledjsons, deep: true },
    locjson:            { get: () => locjson, set: setLocjson, deep: true },
    flirtresps:         { get: () => flirtresps, set: setFlirtresps, deep: true },
    feelUp:             { get: () => feelUp, set: setFeelUp, deep: true },
    kissing:            { get: () => kissing, set: setKissing, deep: true },
    ypeelines:          { get: () => ypeelines, set: setYpeelines, deep: true },
    peelines:           { get: () => peelines, set: setPeelines, deep: true },
    needs:              { get: () => needs, set: setNeeds, deep: true },
    yneeds:             { get: () => yneeds, set: setYneeds, deep: true },
    drinklines:         { get: () => drinklines, set: setDrinklines, deep: true },
    appearance:         { get: () => appearance, set: setAppearance, deep: true },
    drive:              { get: () => drive, set: setDrive, deep: true },
    general:            { get: () => general, set: setGeneral, deep: true },
    darts:              { get: () => darts, set: setDarts, deep: true },
    sexLines:           { get: () => sexLines, set: setSexLines, deep: true },
    objQuotes:          { get: () => objQuotes, set: setObjQuotes, deep: true },
    // --- images.ts ---
    picset:             { get: () => picset, set: setPicset },
    // --- backPackItems.ts ---
    allowItems:         { get: () => allowItems, set: setAllowItems },
    homeChampagne:      { get: () => homeChampagne, set: setHomeChampagne },
    // --- locations.ts ---
    emerBreak:          { get: () => emerBreak, set: setEmerBreak },
    emerHold:           { get: () => emerHold, set: setEmerHold },
    locations:          { get: () => locations, set: setLocations, deep: true },
    sharedLoc:          { get: () => sharedLoc, set: setSharedLoc, deep: true },
    // --- driveAround.ts ---
    gasStation:         { get: () => gasStation, set: setGasStation },
    // --- theBar.ts ---
    bartopic:           { get: () => bartopic, set: setBartopic },
    loser:              { get: () => loser, set: setLoser },
    bar:                { get: () => bar, set: setBar, deep: true },
    talkUnused:         { get: () => talkUnused, set: setTalkUnused, deep: true },
    // --- theClub.ts ---
    externalflirt:      { get: () => externalflirt, set: setExternalflirt },
    wetPhoto:           { get: () => wetPhoto, set: setWetPhoto },
    isNude:             { get: () => isNude, set: setIsNude },
    posectr:            { get: () => posectr, set: setPosectr },
    outfitctr:          { get: () => outfitctr, set: setOutfitctr },
    club:               { get: () => club, set: setClub, deep: true },
    // --- theatre.ts ---
    rrMovieLineThresh:  { get: () => rrMovieLineThresh, set: setRrMovieLineThresh },
    moviecounter:       { get: () => moviecounter, set: setMoviecounter },
    moviechoice:        { get: () => moviechoice, set: setMoviechoice },
    askedfavourite:     { get: () => askedfavourite, set: setAskedfavourite },
    seenmovie:          { get: () => seenmovie, set: setSeenmovie },
    theatre:            { get: () => theatre, set: setTheatre, deep: true },
    // --- theMakeOut.ts ---
    askedswim:          { get: () => askedswim, set: setAskedswim },
    walkcounter:        { get: () => walkcounter, set: setWalkcounter },
    makeOut:            { get: () => makeOut, set: setMakeOut, deep: true },
    // --- herhome.ts ---
    prepeed:            { get: () => prepeed, set: setPrepeed },
    elevatorwaitcounter: { get: () => elevatorwaitcounter, set: setElevatorwaitcounter },
    floorcounter:       { get: () => floorcounter, set: setFloorcounter },
    herHome:            { get: () => herHome, set: setHerHome, deep: true },
};

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

/** Keys whose window property is a forward bridge to gameState.
 *  For these keys, `window.x` reads/writes gameState — the module variable
 *  becomes stale after `connectToGameState()`. We must use window for
 *  both read (createSave) and write (loadSave) of these keys.
 */
const FORWARD_BRIDGED_KEYS = new Set([
    'money', 'attraction', 'shyness', 'lastmoney', 'lastattraction', 'lastshyness',
    'flirtcounter', 'randcounter', 'owedfavor', 'late', 'flirtedflag', 'noflirtflag',
    'shopping', 'maxflirts', 'randmax',
    'clubclosingtime', 'theaterclosingtime', 'barclosingtime', 'timespeed',
    'didintro', 'haveherpurse', 'changevenueflag', 'checkedherout', 'showedneed', 'playerbladder',
    'thetime', 'hour', 'minute', 'meridian',
]);

// ---------------------------------------------------------------------------
// Core save / load
// ---------------------------------------------------------------------------

export function createSave(): Record<string, any> {
    const w = window as any;
    const save: Record<string, any> = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
    };

    for (const [key, field] of Object.entries(FIELD_REGISTRY)) {
        // Forward-bridged keys: read from window (which reads gameState)
        // because the module variable is stale after connectToGameState().
        if (FORWARD_BRIDGED_KEYS.has(key)) {
            save[key] = w[key];
        } else {
            const val = field.get();
            save[key] = field.deep ? deepClone(val) : val;
        }
    }

    // Const objects: deep-clone captures mutable item counts, drank amounts, etc.
    save.backPackItems = deepClone(backPackItems);
    save.herpurse = deepClone(herpurse);

    return save;
}

export function loadSave(save: Record<string, any>): void {
    if (save.version !== SAVE_VERSION) {
        throw new Error(`Save version ${save.version} not supported (expected ${SAVE_VERSION})`);
    }

    for (const [key, field] of Object.entries(FIELD_REGISTRY)) {
        if (key in save) {
            field.set(field.deep ? deepClone(save[key]) : save[key]);
        }
    }

    // Const objects: can't reassign the module const, must merge into existing ref
    if (save.backPackItems) deepMerge(backPackItems, save.backPackItems);
    if (save.herpurse) deepMerge(herpurse, save.herpurse);

    // Forward-bridged shims variables: window.x is overridden by
    // connectToGameState() to read/write gameState.X instead of the module
    // variable. The setters above wrote to the module variable, so we must
    // also push the restored values through the window bridge to update
    // gameState. (Reverse-bridged vars don't need this — window.x still
    // reads the module variable for those.)
    syncForwardBridges(save);
}

/**
 * Push restored module values through window property bridges so that
 * gameState (which owns the value via forward bridges) gets updated.
 */
function syncForwardBridges(save: Record<string, any>): void {
    const w = window as any;
    for (const key of FORWARD_BRIDGED_KEYS) {
        if (key in save) {
            w[key] = save[key];
        }
    }
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
