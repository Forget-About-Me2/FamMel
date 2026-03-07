// Globals that were removed during the TS migration but are still needed by the JS files.
// These should be gradually replaced by gameState properties.

var locStack = ["yourhome"];
var money = 200;

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
function formatString(template, values) {
    let result = template;
    for (let i = values.length - 1; i >= 0; i--) {
        result = result.replace(new RegExp('\\{' + i + '\\}', 'gm'), values[i].toString());
    }
    return result;
}

// Format all strings in an array with the given values
function formatAll(htmlArray, vars) {
    let result = [];
    htmlArray.forEach(function(item) {
        result.push(formatString(item, vars));
    });
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
