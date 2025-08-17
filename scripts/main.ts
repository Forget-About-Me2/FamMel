import {GameLocation, gameState, LocationCategory} from "./gameState";
import {gameSettings} from "./gameSettings";
import {yourHome} from './yourHome';
import {gameScreen} from "./gameScreen/GameScreen";
import showdown from 'showdown';

/**
 * Main program loop that handles location transitions and game state updates
 * Processes time passage, bladder/tummy changes, and status effects
 * Updates UI and triggers location-specific logic
 * @param location - New game location to transition to
 */
export function go(location : GameLocation) {
    allowItems = 0;

    if (!location.isOptionsMenu) {
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

//This setups the game when you click start
//Main reason we have a seperate function is because we need have to wait for yneeds to be assigned for the first scene
//as it's called in there and this is the cleanest solution I can think of
function gamestart(){
    gameScreen.StatusBar.Update();
    yourHome();
}


function changeLog(){
    let result;
    $.ajax(
        { url: "CHANGELOG.md",
            type: 'get',
            dataType: 'html',
            async: false,
            success: function(data) { result = data; }
        }
    );
    const converter = new showdown.Converter();
    document.GetRequiredElementById("pop-up-title").innerText = "Changelog";
    document.GetRequiredElementById("pop-up-text").innerHTML = converter.makeHtml(result);
    openPopUp();
}

function showCredits(){
    if (!credits){
        getjson("credits", function (){
            credits = json;
            showCredits();
        });
        return
    }
    document.GetRequiredElementById("pop-up-title").innerText = "Credits";
    const textElem = document.GetRequiredElementById("pop-up-text");
    textElem.innerHTML = "";
    credits["page"].forEach(line => textElem.innerHTML += line);
    openPopUp();
}

function handleDisclaimer(){
    if (!localStorage.disclaimer || localStorage.disclaimer === "true") {
        if (!credits) {
            getjson("credits", function () {
                credits = json;
                handleDisclaimer();
            });
            return
        }
        document.GetRequiredElementById("pop-up-title").innerText = "Disclaimer";
        const textElem = document.GetRequiredElementById("pop-up-text");
        textElem.innerHTML = "";
        credits["disclaimer"].forEach(line => textElem.innerHTML += line);
        openPopUp();
    }
}

// Introduction page.
export async function start() {
    await quoteManager.initialize();
    handleDisclaimer();
// See random number generator from the date
    anim8();
    randcounter = Math.floor(Math.random() * 5);
    incrandom();
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