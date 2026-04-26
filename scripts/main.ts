import {GameLocation, runtimeContext, LocationCategory} from "./gameState/runtimeContext";
import { BladderLevel } from "./gameState/bladderLevel";

import {gameSettings} from "./settings/gameSettings";
import {yourHome} from './yourHome';
import {gameScreen} from "./gameScreen/gameScreen";
import { animationManager } from "./gameScreen/animationManager";
import { setupQuotes, fetchAndCacheJson, locationSetup, locjson, printAllChoices, sayText, printList, setText, fetchJson } from "./quotes";
import { pushloc, poploc, randomInt, connectToGameState, locStack, endScreens, playerbladder, setCurrentLegacyLocationTag } from './shims';
import { hydrateSettingsToGameState, setup } from './settings';
import { updateyoururge, yourbladder, setYourbladder, yourtummy, setYourtummy, ymaxtummy, setYmaxtummy, ymaxbeer, setYmaxbeer, ydrankbeer, setYdrankbeer, ynowpeeing, setYnowpeeing, yourbladurge, setYourbladurge } from './yourbladder';
import { updateurge, bladder, setBladder, tummy, setTummy, maxtummy, setMaxtummy, maxbeer, setMaxbeer, drankbeer, setDrankbeer, nowpeeing, setNowpeeing, bladurge, setBladurge, askholditcounter } from './bladder';
import { allowItems, setAllowItems } from './backPackItems';
import { hydrateSexSceneStateToGameState } from './fuckHer';

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
    setCurrentLegacyLocationTag(mappedTag);
}

function syncCompanionFromLegacyGlobals(): void {
    if (!runtimeContext.Companion) return;
    runtimeContext.Companion.Bladder = Number(bladder) || 0;
    runtimeContext.Companion.Tummy = Number(tummy) || 0;
    runtimeContext.Companion.MaxTummy = Number(maxtummy) || runtimeContext.Companion.MaxTummy;
    runtimeContext.Companion.MaxAlcohol = Number(maxbeer) || runtimeContext.Companion.MaxAlcohol;
    runtimeContext.Companion.AlcoholInTummy = Number(drankbeer) || 0;
    runtimeContext.Companion.NowPeeing = !!nowpeeing;
    const legacyUrge = Number(bladurge);
    if (Number.isFinite(legacyUrge) && legacyUrge > 0) {
        runtimeContext.Companion.setUrge(legacyUrge);
    }
}

function syncLegacyGlobalsFromCompanion(): void {
    if (!runtimeContext.Companion) return;
    setBladder(runtimeContext.Companion.Bladder);
    setTummy(runtimeContext.Companion.Tummy);
    setMaxtummy(runtimeContext.Companion.MaxTummy);
    setMaxbeer(runtimeContext.Companion.MaxAlcohol);
    setDrankbeer(runtimeContext.Companion.AlcoholInTummy);
    setNowpeeing(runtimeContext.Companion.NowPeeing ? 1 : 0);
    setBladurge(runtimeContext.Companion.bladderUrge);
}

function syncPlayerFromLegacyGlobals(): void {
    if (!runtimeContext.Player) {
        return;
    }

    runtimeContext.Player.TummyVolume = Number(yourtummy) || 0;
    runtimeContext.Player.MaxTummy = Number(ymaxtummy) || runtimeContext.Player.MaxTummy;
    runtimeContext.Player.MaxAlcohol = Number(ymaxbeer) || runtimeContext.Player.MaxAlcohol;
    runtimeContext.Player.AlcoholInTummy = Number(ydrankbeer) || 0;
    runtimeContext.Player.NowPeeing = !!ynowpeeing;

    const legacyUrge = Number(yourbladurge);
    if (Number.isFinite(legacyUrge) && legacyUrge > 0) {
        runtimeContext.Player.setUrge(legacyUrge);
    }
}

function syncLegacyGlobalsFromPlayer(): void {
    if (!runtimeContext.Player) {
        return;
    }

    setYourbladder(runtimeContext.Player.Bladder);
    setYourtummy(runtimeContext.Player.TummyVolume);
    setYmaxtummy(runtimeContext.Player.MaxTummy);
    setYmaxbeer(runtimeContext.Player.MaxAlcohol);
    setYdrankbeer(runtimeContext.Player.AlcoholInTummy);
    setYnowpeeing(runtimeContext.Player.NowPeeing ? 1 : 0);

    setYourbladurge(runtimeContext.Player.bladderUrge);
}

export function go(location: unknown) {
    runtimeContext.init();
    syncCompanionFromLegacyGlobals();
    syncPlayerFromLegacyGlobals();
    setAllowItems(0);

    const previousLocation = runtimeContext.CurrentLocation;
    const currentLegacyTag = locStack[0];
    const typedLocation = isGameLocation(location) ? location : undefined;
    const shouldProcessTick = !typedLocation || !typedLocation.isPreGame;
    const isPlayerOnlyLocation = previousLocation?.isPlayerOnly ?? isLegacyPlayerOnlyLocation(currentLegacyTag);
    const isCallHerLocation = previousLocation?.category === LocationCategory.CallHer
        || isLegacyCallHerLocation(currentLegacyTag);
    const isDrinkingGameLocation = previousLocation?.category === LocationCategory.DrinkingGame
        || isLegacyDrinkingGameLocation(currentLegacyTag);

    if (shouldProcessTick) {
        runtimeContext.Interactions.ShowedNeed = false; // clear the showed need flag - only active in the current window.
        runtimeContext.Interactions.ChangeVenueFlag = false;
        runtimeContext.Interactions.AllowedToFlirt = true;
        runtimeContext.Companion.NowPeeing = false; // clear the currently peeing flag.

        runtimeContext.Companion.processFluidsDigestion();
        syncLegacyGlobalsFromCompanion();

        //  If she's not with you, then she can go pee
        if (isPlayerOnlyLocation &&
            runtimeContext.Companion.bladderState >= BladderLevel.Emergency && !askholditcounter)
            if (!isCallHerLocation) {
                runtimeContext.Companion.pee();
                syncLegacyGlobalsFromCompanion();
            }

        if (gameSettings.PlayerBladder
            || (isDrinkingGameLocation && gameSettings.EnablePlayerInDrinkGame)) {
            runtimeContext.Player.processFluidsDigestion();
            syncLegacyGlobalsFromPlayer();
        }

        if (runtimeContext.Interactions.FlirtCounter > 0) {
            runtimeContext.Interactions.FlirtCounter -= 1;
        }

        runtimeContext.Time.nextTick();
    }

    document.GetRequiredElementById('textsp').innerText = "";
    if (runtimeContext.DidIntro) {
        gameScreen.StatusBar.Update();
    }

    if (typedLocation) {
        runtimeContext.setCurrentLocation(typedLocation);
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
    runtimeContext.init();
    hydrateSettingsToGameState();
    hydrateSexSceneStateToGameState();
    animationManager.start();
    // Connect window bridges to gameState — auto-seeds from current window values.
    connectToGameState(runtimeContext);
    syncCompanionFromLegacyGlobals();
    syncPlayerFromLegacyGlobals();
    await fetchAndCacheJson("start");
    pushloc("yourhome");
    locationSetup("start");
    let curtext = locjson["always"];
    curtext = printAllChoices(curtext);
    sayText(curtext);
}

export function gameOver() {
    setText(endScreens["gameOver"]);
}

// Expose legacy-facing functions to global scope for legacy JS modules
(globalThis as any).gameOver = gameOver;

//TODO maybe combine the game ending function into one
//Basically you got her into bed but not desperate
export function gameSexBoth(){
    let curtext = printList([], endScreens["gameSexBoth"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

//TODO It's just you who came. You selfish bastard
function gameSexYou(){
    //TODO implement
}

export function gameWet() {
    let curtext = printList([], endScreens["gameWet"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

export function gameWon() {
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