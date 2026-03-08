// Globals that were removed during the TS migration but are still needed by the JS files.
// These should be gradually replaced by gameState properties.
// Originally declared in main.js — values preserved from the original.

var locStack = ["yourhome"];
var money = 200;
var thetime = 0;
var hour = 7;
var minute = 0;
var meridian = "PM";
var late = 0;
// Player bladder feature toggle (legacy global used by old JS files)
var playerbladder = true;

// Interaction / flirt state
var attraction = 10;
var shyness = 90;
var flirtedflag = 0;
var flirtcounter = 0;
var noflirtflag = 0;
var checkedherout = 0;
var haveherpurse = 0;
var owedfavor = 0;
var changevenueflag = 0;
var shopping = 0;

// Flirt / interaction limits
var maxflirts = 2;
var maxkiss = 7;
var maxfeel = 7;
var randmax = 5;

// Venue closing times (ticks from 7 PM)
var clubclosingtime = 7 * 60;    // 2:00 AM
var theaterclosingtime = 3 * 60; // 10:00 PM last showing
var barclosingtime = 6 * 60;     // 1:00 AM

// Time
var timespeed = 2;
var didintro = 0;
// seenmovie is declared in theatre.js — do NOT redeclare here (var+let conflict breaks script loading)

// Delta tracking (for status bar arrows)
var lastmoney = money;
var lastattraction = attraction;
var lastshyness = shyness;

// JSON data loaded at runtime (declared here so assignments in async callbacks work)
var settings;
var statsBars;
var showedneed;
var endScreens;

// Seedable RNG support for deterministic integration tests.
// A random seed is always generated at startup and can be overridden via ?seed=.
var gameRngState = null;
var gameInitialSeed = null;

function createAutoSeed() {
    // Timestamp + random bits gives a new uint32 seed on each launch.
    return ((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0) || 1;
}

function normalizeSeed(seed) {
    const numericSeed = Number(seed);
    if (!Number.isFinite(numericSeed)) {
        throw new Error("Seed must be a finite number");
    }

    // Convert to uint32 and avoid zero state for consistent LCG stepping.
    const normalized = (Math.trunc(numericSeed) >>> 0);
    return normalized === 0 ? 1 : normalized;
}

function setRandomSeed(seed) {
    gameInitialSeed = normalizeSeed(seed);
    gameRngState = gameInitialSeed;
    return gameInitialSeed;
}

function clearRandomSeed() {
    setRandomSeed(createAutoSeed());
}

function getRandomSeed() {
    return gameInitialSeed;
}

function gameRandom() {
    if (gameRngState === null) {
        // Defensive fallback in case globals are reset unexpectedly.
        return Math.random();
    }

    // LCG parameters from Numerical Recipes.
    gameRngState = (Math.imul(gameRngState, 1664525) + 1013904223) >>> 0;
    return gameRngState / 4294967296;
}

function randomInt(maxExclusive) {
    const max = Math.floor(maxExclusive);
    if (max <= 0) {
        return 0;
    }
    return Math.floor(gameRandom() * max);
}

(function initializeSeedFromQuery() {
    // Always initialize with a random seed first.
    setRandomSeed(createAutoSeed());

    const params = new URLSearchParams(window.location.search);
    const seed = params.get("seed");
    if (seed !== null && seed !== "") {
        setRandomSeed(seed);
    }
})();

function pushloc(loc) {
    locStack.unshift(loc);
}

function poploc() {
    return locStack.shift();
}

// Returns true with a 1-in-n chance
function randomchoice(n) {
    return randomInt(n) === 0;
}

// Increment the random counter (wraps around)
function incrandom() {
    randcounter = (randcounter + randomInt(2) + 1) % 5;
}

// Picks a random element from a list
function pickrandom(list) {
    return list[randomInt(list.length)];
}

// Picks a random index from a list
function randomIndex(list) {
    return randomInt(list.length);
}

// Range function - returns array of numbers from start to end (inclusive)
function range(start, end) {
    let result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

// Simple string format function for templates with {0}, {1}, etc.
function formatString(expr, values) {
    return expr.format(values);
}

// Format all strings in an array, each with its corresponding values entry
function formatAll(exprList, values) {
    let result = [];
    for (let i = 0; i < exprList.length; i++) {
        result.push(formatString(exprList[i], values[i]));
    }
    return result;
}

// Print dialogue from the current location json
function printDialogue(curtext, loc, index) {
    if (locjson && locjson.dialogue && locjson.dialogue[loc]) {
        locjson.dialogue[loc][index].forEach(function(item) {
            curtext.push(item);
        });
    }
    return curtext;
}

// Random counter for NPC behavior
var randcounter = randomInt(5);
