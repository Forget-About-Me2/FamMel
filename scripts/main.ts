import {GameLocation, gameState, LocationCategory} from "./gameState/gameState";
import {gameSettings} from "./settings/gameSettings";
import {yourHome} from './yourHome';
import {gameScreen} from "./gameScreen/gameScreen";
import { animationManager } from "./gameScreen/animation";
import {SettingsManager} from "./settings/settingsManager";

/**
 * Main program loop that handles location transitions and game state updates
 * Processes time passage, bladder/tummy changes, and status effects
 * Updates UI and triggers location-specific logic
 * @param location - New game location to transition to
 */
export function go(location : GameLocation) {
    allowItems = 0;

    if (!location.isPreGame) {
        gameState.ShowedNeed = false; // clear the showed need flag - only active in the current window.
        gameState.ChangeVenueFlag = false;
        gameState.AllowedToFlirt = true;
        gameState.Companion.NowPeeing = false; // clear the currently peeing flag.

        gameState.Companion.processFluidsDigestion();

        //  If she's not with you, then she can go pee
        if (gameState.CurrentLocation.isPlayerOnly &&
            // TODO Add bladder state enum instead
            gameState.Companion.Bladder > blademer && !askholditcounter)
            if (!gameState.isCurrentLocation(LocationCategory.CallHer))
                gameState.Companion.pee();

        if (gameSettings.PlayerBladder
            || (gameState.isCurrentLocation(LocationCategory.DrinkingGame) && gameSettings.PlayerDrinkGame)) {
            gameState.Player.processFluidsDigestion();
        }

        if (gameState.FlirtCounter > 0) {
            gameState.FlirtCounter -= 1;
        }

        gameState.Time.nextTick();
    }

    document.GetRequiredElementById('textsp').innerText = "";
    if (gameState.DidIntro) {
        gameScreen.StatusBar.Update();
    }

    location.function();
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
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}


//Picks a random index from a list.
function randomIndex(list : []){
    let number = Math.random() * list.length;
    return Math.floor(number);
}

//Randomizes the given list
function shuffle<T>(array: T[]): T[] {
    const copy = [...array]; // Using spread operator instead of custom deep copy

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]]; // swap elements
    }

    return copy;
}

//This sets the game up when you click start
// TODO probably no longer needed.
function gamestart(){
    gameScreen.StatusBar.Update();
    yourHome();
}


// Introduction page.
export async function start() {
    gameScreen.PopUps.Disclaimer.displayDisclaimerPopup();
    animationManager.start();
    new SettingsManager().readFromLocalStorage();
    setup();
    pushloc("yourhome");
    locationSetup("start");
    let curtext = locjson["always"];
    curtext = printAllChoices(curtext);
    sayText(curtext);
    //the start of the game is dependent on yneeds, to save loading time it is called as soon as you move from the main screen
    //And then the variables will be added when the game actually starts, but that's not necessary for the begin scene so this should be fine.
    getjson("yneeds", function () {yneeds = json});
}

function gameOver() {
    setText(endScreens["gameOver"]);
}

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