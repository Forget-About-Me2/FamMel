import { driveAroundSetup } from './locations/driveAround';
import { theBarSetup } from './locations/theBar';
import { theClubSetup } from './locations/theClub';
import { theatreSetup } from './locations/theatre';
import { makeOutSetup } from './locations/theMakeOut';
import { herHomeSetup, homeConditions } from './herhome';
import { fetchJson, formatAllVarsList, printList, callChoice, sayText, cListener, cListenerGen, addSayText, addListenersList, addListeners } from './quotes';
import { pickrandom, randomchoice, pushloc, formatAll, attraction, shyness } from './shims';
import { displayneed, displaygottavoc, showneed, holdit, indepee } from './bladder';
import { displayyourneed } from './yourbladder';
import { backPackItems, haveItem } from './backPackItems';
import { suggestedloc, setSuggestedloc } from './settings';
import { seenmovie } from './locations/theatre';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';

//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
export let locations = {
    "driveAround": driveAroundSetup(),
    "theBar" :theBarSetup(),
    "theClub": theClubSetup(),
    "theTheatre": theatreSetup(),
    "makeOut": makeOutSetup(),
    "theHome": herHomeSetup()
};

export let sharedLoc;
export function setSharedLoc(val: any) { sharedLoc = val; }
fetchJson("locations/locations").then(locJsonSetup);

export function locJsonSetup(data: any){
    sharedLoc = data;
    sharedLoc["itsClosed"] = formatAllVarsList(sharedLoc["itsClosed"]);
    sharedLoc["sayHero"] = formatAllVarsList(sharedLoc["sayHero"]);
}

//Determines whether the wants to visit a location.
export function updateSuggestedLocation(){
    if (shyness < 30 && attraction > 50 && !locations.makeOut.visited) {
        setSuggestedloc("themakeout");
    } else if (homeConditions()) {
        setSuggestedloc("thehome");
    } else if (shyness > 80 && attraction < 30 && !seenmovie) {
        setSuggestedloc("themovie");
    } else if (shyness < 60 && attraction > 30 && !locations.theClub.visited) {
        setSuggestedloc("theclub");
    } else if (gameState.Companion.bladderState >= BladderState.Need && shyness < 50 && !locations.theBar.visited) {
        setSuggestedloc("thebar");
    }
}

// Prints all locations that can be visited
export function printLocationMenu(){
    Object.keys(locations).forEach(loc => {
        if (suggestedloc === loc.toLowerCase())
            cListener(locations[loc].wantVisit, loc);
        else
            cListener(locations[loc].visit, loc);
    });
    Object.keys(locations).forEach(loc => {
        addListeners(locations[loc].visit, loc)
    });
}

export function lookAround(loc: string){
    const findkey = randomchoice(locations[loc].keyChance);
    let curtext: any[] = [];
    curtext.push(pickrandom(sharedLoc["lookAround"]));
    // Location data: [0]=random observations array, [1]=key discovery text
    const randomObservations = sharedLoc[loc][0];
    const keyDiscoveryText = sharedLoc[loc][1];
    let listenerList: any[] = [];
    if (findkey){
        curtext.push(keyDiscoveryText);
        sayText(curtext);
        listenerList.push([[function () {lookKey(loc)}], "lookKey"]);
        cListener(["", "Investigate..."], "lookKey");
    } else {
        curtext.push(pickrandom(randomObservations));
        sayText(curtext);
        //Increase the chance to find the key you were looking for by 20%.
        //Success is guaranteed on the 5th try.
        locations[loc].keyChance += 2;
    }
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

export function lookKey(loc: string){
    let curtext = [pickrandom(sharedLoc["lookKey"])];
    let listenerList: any[] = [];
    sayText(curtext);
    listenerList.push([[function () {getKey(loc)}], "getKey"]);
    cListener(["", "Pick it up."], "getKey");
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

export function getKey(loc: string){
    locations[loc].foundKey = 1;
    let curtext = [pickrandom(sharedLoc["getKey"])];
    backPackItems[loc+"Key"].value++;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO fix the double desperate
export function itsClosed(locname: string, fun: () => void, curloc: string) {
    let theloc;
    if (locname === "theBar") theloc = "bar";
    else if (locname === "theClub") theloc = "night club";
    else  theloc = "movie theater";

    // itsClosed: [0]=arrival text, [1]=bladder emergency quote, [2]=confirmed closed text
    const [arrivalLines, emergencyQuote, confirmedClosedLines] = sharedLoc["itsClosed"];

    let curtext: any[] = []
    let list = new Array(arrivalLines.length).fill([theloc]);
    let temp = formatAll(arrivalLines, list);
    curtext = printList(curtext, temp);
    if (gameState.Companion.bladderState >= BladderState.Emergency) {
        curtext = printList(curtext, emergencyQuote);
        curtext = displaygottavoc(curtext);
    }
    list = new Array(confirmedClosedLines.length).fill([theloc]);
    temp = formatAll(confirmedClosedLines, list);
    curtext = printList(curtext, temp);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    let listenerList: any[] = []
    if (haveItem(locname+"Key")){
        let breakFun = function () {
            breakLoc(fun, curloc);
        }
        listenerList.push([[breakFun], locname]);
        cListener(["", "Try to break in with your key."], locname);
    }
    addSayText(callChoice(["curloc", "Continue..."], []));
    addListenersList(listenerList);
}

export let emerBreak; //True if she rushed to the toilet after you opened the door
export function setEmerBreak(val: any) { emerBreak = val; }
export let emerHold; //True if you asked her to hold it.
export function setEmerHold(val: any) { emerHold = val; }
export function breakLoc(loc: any, curloc: string){
    // breakLoc: [0]=trying the key, [1]=she rushes past you
    const [tryingKey, sheRushesPast] = sharedLoc["breakLoc"];
    // sayHero: [0]=hero compliments (calm), [1]=rushed hero thanks (urgent)
    const [heroCompliments, heroThanksUrgent] = sharedLoc["sayHero"];

    let curtext = printList(tryingKey, [] as any[]);
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Emergency){
        //There's a 30% chance she'll run to the bathroom as soon as you break in.
        if (randomchoice(3)) {
            curtext.push(pickrandom(heroThanksUrgent));
            curtext = printList(sheRushesPast, curtext);
            curtext = displayneed(curtext);
            curtext = displayyourneed(curtext);
            pushloc(curloc);
            sayText(curtext);
            let holdFun = function () {
                emerHold = 1;
                holdit();
            }
            let peeFun = function () {
                emerBreak = 1;
                indepee();
            }
            listenerList.push([[holdFun], "holdit"]);
            listenerList.push([[peeFun], "indepee"]);
            cListener([holdFun, "Grab her arm to stop her."], "holdit");
            cListener([peeFun, "Let her go."], "indepee");
            addListenersList(listenerList);
            return
        } else
            curtext.push(pickrandom(heroCompliments));
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGen([loc, "Continue..."], "curloc");
}

export function exposeLocationsOnWindow() {
    const mutableVars: [string, () => any, (v: any) => void][] = [
        ["locations", () => locations, (v) => { locations = v; }],
        ["sharedLoc", () => sharedLoc, (v) => { sharedLoc = v; }],
        ["emerBreak", () => emerBreak, (v) => { emerBreak = v; }],
        ["emerHold", () => emerHold, (v) => { emerHold = v; }],
    ];
    for (const [name, getter, setter] of mutableVars) {
        Object.defineProperty(window, name, { get: getter, set: setter, configurable: true });
    }

    Object.assign(window, {
        locJsonSetup, updateSuggestedLocation, printLocationMenu,
        lookAround, lookKey, getKey, itsClosed, breakLoc,
    });
}