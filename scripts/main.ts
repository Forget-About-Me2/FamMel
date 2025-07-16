import {GameLocation, gameState, LocationCategory} from "./gameState";
import {gameSettings, ImageChoice} from "./gameSettings";
import {yourHome} from './yourHome';

/**
 * Updates all UI elements displaying game statistics
 * Shows money, attraction, shyness, and tummy/bladder values
 * Handles stats visibility based on game settings
 * Updates color indicators for changed values
 */
export function DisplayStats() {

    document.GetRequiredElementById("mon").innerText = "$" + gameState.Money;
    document.GetRequiredElementById("att").innerText = gameState.Attraction.toString();
    document.GetRequiredElementById("shy").innerText = gameState.Shyness.toString();
    document.GetRequiredElementById("tum").innerText = gameState.Companion.Tummy.toString();
    document.GetRequiredElementById("blad").innerText = gameState.Companion.Bladder.toString();
    document.GetRequiredElementById("time").innerText = gameState.Time.toString();
    if(gameSettings.PlayerBladder) {
        document.GetRequiredElementById("ytum").innerText = gameState.Player.Tummy.toString();
        document.GetRequiredElementById("yblad").innerText = gameState.Player.Bladder.toString();
    }
    if (!gameSettings.ShowStats) {
        document.GetRequiredElementById("tum").innerText = "?";
        document.GetRequiredElementById("blad").innerText = "?";
        if(gameSettings.PlayerBladder) {
            document.GetRequiredElementById("ytum").innerText = "?";
            document.GetRequiredElementById("yblad").innerText = "?";
        }
    }
    if (gameState.Attraction < gameState.LastAttraction) {
        setColour("att", "red", "white");
    } else if (gameState.Attraction> gameState.LastAttraction)
        setColour("att", "green", "white");

    if (gameState.Shyness < gameState.LastShyness) {
        setColour("shy", "green", "blue");
    } else if (gameState.Shyness > gameState.LastShyness) {
        setColour("shy", "red", "blue");
    }

    if (gameState.Money < gameState.LastMoney) {
        setColour("mon", "red", "blue");
    } else if (gameState.Money > gameState.LastMoney) {
        setColour("mon", "green", "blue");
    }

    //  Hard Limits on shyness and attraction
    if (gameState.Shyness < 0) {
        gameState.Shyness = 0;
        valueChange("shy", 0);
    }
    if (gameState.Shyness > 100) {
        gameState.Shyness = 100;
        valueChange("shy", 100);
    }
    if (gameState.Attraction < 0) {
        gameState.Attraction = 0;
        valueChange("att", 0);
    }
    if (gameState.Attraction > 130) {
        gameState.Attraction = 130;
        valueChange("att", 130);
    }
}

/**
 * Sets a temporary color on an UI element and reverts it after delay
 * @param id - Element ID to color
 * @param colour - Color to temporarily apply
 * @param original - Original color to revert to
 */
function setColour(id : string, colour : string, original : string){
    let elem = document.GetRequiredElementById(id);
    elem.className = "stats-cells-"+colour;
    setTimeout(function () {
        elem.className = "stats-cells-"+original;
    }, 500);
}

/**
 * Updates the text value of an UI element after a delay
 * @param id - Element ID to update
 * @param value - New value to display
 */
function valueChange(id : string, value : number){
    setTimeout(function () {
        document.GetRequiredElementById(id).innerText = value.toString();
    }, 500);
}


/**
 * Main program loop that handles location transitions and game state updates
 * Processes time passage, bladder/tummy changes, and status effects
 * Updates UI and triggers location-specific logic
 * @param location - New game location to transition to
 */
function go(location : GameLocation) {
    allowItems = 0;

    if (location.category !== LocationCategory.Options &&
        location.category !== LocationCategory.ExplainImg &&
        location.category !== LocationCategory.HideScreen &&
        location.category !== LocationCategory.CustomGirl &&
        gameSettings.ImageChoice != ImageChoice.None) {
        showedneed = 0; // clear showed need - only active in the current window.
        changevenueflag = 0; // clear venue change.
        noflirtflag = 0; // clear no flirting flag.
        nowpeeing = 0; // clear the currently peeing flag.


        let tuminc = calcTuminc();

        tummy -= tuminc;
        if (tummy < 0) tummy = 0;
        bladder += tuminc;

        //  If she's not with you, then she can go pee
        if (playOnly.includes(locStack[0]) && bladder > blademer && !askholditcounter)
            if (locStack[0] !== "callher")
                flushdrank();

        if (playerbladder || (locStack[0]==="drinkinggame" && playerGame)) {
            yourtumavg = Math.round((yourtumavg * (tumdecay - 1) + yourtummy) / tumdecay);
            let yourtuminc = Math.round(yourtumavg / 10);
            if (ydrankbeer === 0 && yourtuminc > 12) yourtuminc = 12;
            if (ydrankbeer > 0 && yourtuminc > 18) yourtuminc = 18;
            if (yourtuminc < 1) yourtuminc = 2;
            yourtuminc = randtuminc(yourtuminc);
            yourtummy -= yourtuminc;
            if (yourtummy < 0) yourtummy = 0;
            yourbladder += yourtuminc;

            if (ydrankbeer > 0) ydrankbeer -= 1;
            if (drankbeer > 0) {
                drankbeer -= 1;
            }
        }
        if (flirtcounter > 0) {
            flirtcounter -= 1;
        }
        if (waitcounter > 0) {
            waitcounter -= 1;
        }
        if (seal) {
            beerdecCounter++;
            ybeerdecCounter++;
        }

        if (champagnecounter > 0) {
            drankChamp++;
            if (drankChamp > 10) {
                champagnecounter--;
                drankChamp = 0;
            }
        }

        thetime += timespeed;
        minute += timespeed;
        if (minute > 59) {
            hour += 1;
            minute = 0
        }
        if (hour > 12) {
            hour = 1;
            if (meridian === "PM") meridian = "AM"; else meridian = "PM";
        }
    }

    enablehide = 0; // clear the hide screen flag.
    if (bladder < 0) bladder = 0;
    if (tummy < 0) tummy = 0;
    if (money < 0) money = 0;

    document.GetRequiredElementById('textsp').innerText = "";
    if (didintro) {
        DisplayStats();
    }

    // Flash changed stuff...
    lastmoney = money;
    lastattraction = attraction;
    lastshyness = shyness;

    if (tag === "hidescreen") {
        enablehide = 1;
        document.GetRequiredElementById('statsp').innerHTML = "";
        document.GetRequiredElementById('objsp').innerHTML = "";
        document.GetRequiredElementById('thepic').innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></table>";
    }

    if (typeof tag === "function")
        tag();
    else if(jsonlocs.includes(tag)&&!calledjsons.hasOwnProperty(tag)){
        //checks whether the given location has a corresponding JSON file and calls it if it hasn't been called before
        getjsonT(tag);
    } else if (tag.includes("(")){
        //this is a terrible way to deal with choice functions but it works so hey
        //TODO alternative way is just giving all choices the () from the getgo, but that might break other things
        eval(tag);
    } else {
        eval(tag + "()");
    }
}

//Calculates her current tuminc
function calcTuminc(){
    tumavg = Math.round((tumavg * (tumdecay - 1) + tummy) / tumdecay);
    let tuminc = Math.round(tumavg / 10);
    if (drankbeer === 0 && tuminc > 12) tuminc = 12;
    if (drankbeer > 0 && tuminc > 18) tuminc = 18;
    if (tuminc < 1) tuminc = 2;
    return randtuminc(tuminc);
}

/*
//TODO update comments
Location handling.
curloc is ALWAYS the current location, but...
   curloc is ONLY set under certain circumstances:
     1)  Leaving car to go to a destination _and_ the
     destination is not a repeat and still open.
 2)  Special locations such as the dancefloor.

nextloc is the INTENDED destination.  Meaning you set it
   when you choose to head somewhere.

*/
function pushloc(newloc) {
    if (newloc !== locStack[0]) {
        locStack.unshift(newloc);
    }
}

function poploc() {
    if (locStack[0] !== locStack[1]) {
        locStack.shift();
    }
}

//  increment the random number counter.
const randmax = 5; // Maximum value of random counter
function incrandom() {
    randcounter += Math.floor(Math.random() * 2) + 1;
    if (randcounter > randmax) randcounter -= (randmax + 1);
}

//  Randomness Chooser
//  1 corresponds to 10% likelihood.
//  10 corresponds to 100% likelihood.
function randomchoice(probability) {
    let x = Math.floor(Math.random() * 10);
    if (x < probability)
        return 1;
    else
        return 0;
}

//TODO potentially use this to choose quotes instead of randomchoice
//Picks a random value from the given list
function pickrandom(list) {
    return list[randomIndex(list)];
}

//Picks a random index from a list.
function randomIndex(list){
    let number = Math.random() * list.length;
    return Math.floor(number);
}

//Randomizes the given list
function randomize(list){
    let deepCopy = getDeepCopy(list);
    let result = [];
    while(deepCopy.length !== 0){
        let temp = randomIndex(deepCopy);
        result.push(deepCopy[temp]);
        deepCopy.splice(temp, 1);
    }
    return result;
}

//Returns a deepCopy of the given list
function getDeepCopy(list){
    let result = [];
    list.forEach(item => result.push(item));
    return result;
}

//This setups the game when you click start
//Main reason we have a seperate function is because we need have to wait for yneeds to be assigned for the first scene
//as it's called in there and this is the cleanest solution I can think of
function gamestart(){
    if (!playerbladder) {
        const stats = document.GetRequiredElementById("stats-bar");
        let result = "";
        statsBars["noplayer"].forEach(item => result += item);
        stats.innerHTML = result;
        yourbladder = 0;
    }
    DisplayStats();
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
async function start() {
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