import {GameLocation, gameState, LocationCategory} from "./gameState/gameState";
import {gameSettings} from "./settings/gameSettings";
import {yourHome} from './yourHome';
import {gameScreen} from "./gameScreen/gameScreen";
import { animationManager } from "./gameScreen/animationManager";

/**
 * Main program loop that handles location transitions and game state updates
 * Processes time passage, bladder/tummy changes, and status effects
 * Updates UI and triggers location-specific logic
 * @param location - New game location to transition to
 */
function isGameLocation(location: unknown): location is GameLocation {
    return typeof location === "object"
        && location !== null
        && "function" in location
        && typeof (location as GameLocation).function === "function"
        && "category" in location;
}

function resolveLegacyTarget(location: unknown): ((...args: any[]) => unknown) | undefined {
    if (typeof location === "function") {
        const callback = location as () => void;
        return callback;
    }

    if (typeof location !== "string") {
        return undefined;
    }

    let target = normalizeLegacyTarget(location);
    if (target.toLowerCase() === "goback") {
        poploc();
        target = normalizeLegacyTarget(locStack[0] ?? "");
    }

    const maybeFunction = getGlobalFunction(target);
    if (typeof maybeFunction === "function") {
        return maybeFunction;
    }

    const lowerTarget = target.toLowerCase();
    if (lowerTarget === "gamestart") {
        return gamestart;
    }

    // Handle parameterized calls like buyItem("water")
    const paramMatch = location.toString().match(/^([A-Za-z_$][\w$]*)\s*\((.+)\)\s*;?$/);
    if (paramMatch) {
        const funcName = paramMatch[1];
        const argsRaw = paramMatch[2];
        const func = getGlobalFunction(funcName);
        if (typeof func === "function") {
            // Parse simple quoted string or numeric arguments
            const args = argsRaw.split(',').map(a => {
                const trimmed = a.trim().replace(/&quot;/g, '"');
                // Strip surrounding quotes
                const unquoted = trimmed.replace(/^["']|["']$/g, '');
                // If it was originally a number without quotes, parse it
                if (/^\d+$/.test(trimmed)) return Number(trimmed);
                return unquoted;
            });
            return () => func(...args);
        }
    }

    return undefined;
}

function normalizeLegacyTarget(target: string): string {
    const trimmed = target.trim();
    // Accept old-style stack entries like "someFunction()" and resolve as function names.
    const match = trimmed.match(/^([A-Za-z_$][\w$]*)\s*\(\s*\)\s*;?$/);
    return match ? match[1] : trimmed;
}

function legacyTag(locationTag: string | undefined): string {
    return (locationTag ?? "").toLowerCase();
}

function isLegacyPlayerOnlyLocation(locationTag: string | undefined): boolean {
    const tag = legacyTag(locationTag);
    return tag === "yourhome" || tag === "gostore" || tag === "callher";
}

function isLegacyCallHerLocation(locationTag: string | undefined): boolean {
    return legacyTag(locationTag) === "callher";
}

function isLegacyDrinkingGameLocation(locationTag: string | undefined): boolean {
    return legacyTag(locationTag) === "drinkinggame";
}

function syncLegacyLocStackFromTypedLocation(location: GameLocation): void {
    const tagMap: Record<LocationCategory, string> = {
        [LocationCategory.Start]: "start",
        [LocationCategory.Options]: "options",
        [LocationCategory.ExplainImg]: "explainimg",
        [LocationCategory.HideScreen]: "hidescreen",
        [LocationCategory.CustomGirl]: "customgirl",
        [LocationCategory.YourHome]: "yourhome",
        [LocationCategory.GoStore]: "gostore",
        [LocationCategory.CallHer]: "callher",
        [LocationCategory.DrinkingGame]: "drinkinggame",
    };

    const mappedTag = tagMap[location.category];
    if (!mappedTag) {
        return;
    }

    if (locStack.length === 0) {
        locStack.unshift(mappedTag);
        return;
    }

    locStack[0] = mappedTag;
}

export function go(location: unknown) {
    gameState.init();
    allowItems = 0;

    const previousLocation = gameState.CurrentLocation;
    const currentLegacyTag = locStack[0];
    const typedLocation = isGameLocation(location) ? location : undefined;
    const shouldProcessTick = !typedLocation || !typedLocation.isPreGame;
    const isPlayerOnlyLocation = previousLocation?.isPlayerOnly ?? isLegacyPlayerOnlyLocation(currentLegacyTag);
    const isCallHerLocation = previousLocation?.category === LocationCategory.CallHer
        || isLegacyCallHerLocation(currentLegacyTag);
    const isDrinkingGameLocation = previousLocation?.category === LocationCategory.DrinkingGame
        || isLegacyDrinkingGameLocation(currentLegacyTag);

    if (shouldProcessTick) {
        gameState.ShowedNeed = false; // clear the showed need flag - only active in the current window.
        gameState.ChangeVenueFlag = false;
        gameState.AllowedToFlirt = true;
        gameState.Companion.NowPeeing = false; // clear the currently peeing flag.

        gameState.Companion.processFluidsDigestion();

        //  If she's not with you, then she can go pee
        if (isPlayerOnlyLocation &&
            // TODO Add bladder state enum instead
            gameState.Companion.Bladder > blademer && !askholditcounter)
            if (!isCallHerLocation)
                gameState.Companion.pee();

        if (gameSettings.PlayerBladder
            || (isDrinkingGameLocation && gameSettings.PlayerDrinkGame)) {
            gameState.Player.processFluidsDigestion();
        }

        if (gameState.FlirtCounter > 0) {
            gameState.FlirtCounter -= 1;
        }

        gameState.Time.nextTick();

        // Sync legacy globals with gameState
        thetime = gameState.Time.totalTime;
        hour = gameState.Time.hour;

        // Keep typed game state in sync with legacy globals modified by JS modules.
        if (typeof money !== "undefined") gameState.Money = money;
        if (typeof attraction !== "undefined") gameState.Attraction = attraction;
        if (typeof shyness !== "undefined") gameState.Shyness = shyness;
    }

    document.GetRequiredElementById('textsp').innerText = "";
    if (gameState.DidIntro) {
        gameScreen.StatusBar.Update();
    }

    if (typedLocation) {
        gameState.setCurrentLocation(typedLocation);
        syncLegacyLocStackFromTypedLocation(typedLocation);
        typedLocation.function();
        return;
    }

    const legacyTarget = resolveLegacyTarget(location);
    if (legacyTarget) {
        legacyTarget();
        return;
    }

    console.error("Invalid location passed to go():", location);
}

//TODO potentially use this to choose quotes instead of randomchoice
/**
 * Picks a random element from the given array.
 * @template T The type of elements in the array
 * @param {T[]} array The input array to pick from
 * @returns {T} A randomly selected element from the array
 * @throws {Error} If the array is empty
 */
function pickRandom<T>(array: T[]): T {
    if (!array.length) {
        throw new Error('Cannot pick from an empty array');
    }
    const index = randomInt(array.length);
    return array[index];
}


//Picks a random index from a list.
function randomIndex(list : []){
    return randomInt(list.length);
}

//Randomizes the given list
function shuffle<T>(array: T[]): T[] {
    const copy = [...array]; // Using spread operator instead of custom deep copy

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = copy.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]]; // swap elements
    }

    return copy;
}

//This sets the game up when you click start
export async function gamestart(){
    if (!gameSettings.PlayerBladder) {
        gameScreen.StatusBar.TogglePlayerBladder(false);
    }
    gameScreen.StatusBar.Update();
    await fetchAndCacheJson("yourhome");
    await setupQuotes();
    yourHome();
}


// Introduction page.
export async function start() {
    gameScreen.PopUps.Disclaimer.displayDisclaimerPopup();
    setup();
    // Keep typed settings in sync with legacy setup() localStorage behavior.
    try { gameSettings.PlayerBladder = !!(globalThis as any).playerbladder; } catch {}
    gameState.init();
    animationManager.start();
    if (typeof money !== "undefined") gameState.Money = money;
    if (typeof attraction !== "undefined") gameState.Attraction = attraction;
    if (typeof shyness !== "undefined") gameState.Shyness = shyness;
    await fetchAndCacheJson("start");
    pushloc("yourhome");
    locationSetup("start");
    let curtext = locjson["always"];
    curtext = printAllChoices(curtext);
    sayText(curtext);
    //yneeds is loaded early to avoid delay when the game actually starts
    yneeds = await fetchJson("yneeds");
}

function gameOver() {
    setText(endScreens["gameOver"]);
}

// Expose legacy-facing functions to global scope for legacy JS modules
(globalThis as any).gameOver = gameOver;

//TODO maybe combine the game ending function into one
//Basically you got her into bed but not desperate
function gameSexBoth(){
    let curtext = printList([], endScreens["gameSexBoth"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

//It's just who who came. You selfish bastard
function gameSexYou(){
//TODO
}

function gameWet() {
    let curtext = printList([], endScreens["gameWet"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

function gameWon() {
    let curtext = printList([], endScreens["gameWon"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

function getGlobalFunction(functionName: string): ((...args: any[]) => unknown) | undefined {
    const exact = (window as any)[functionName];
    if (typeof exact === "function") {
        return exact;
    }

    const normalized = functionName.toLowerCase();
    const matchingKey = Object.keys(window).find(key => key.toLowerCase() === normalized);
    if (!matchingKey) {
        return undefined;
    }

    const matched = (window as any)[matchingKey];
    return typeof matched === "function" ? matched : undefined;
}