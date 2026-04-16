import { fetchJson, fetchAndCacheJson, getMLocations, printList, sayText, cListenerGen, cListenerGenList, addSayText, voccurse, locjson, appearance, setAppearance, girlname, pantycolor } from './quotes';
import { pushloc, poploc, pickrandom, randomchoice, randomize, locStack, thetime, attraction, setAttraction, shyness, setShyness } from './shims';
import { showneed, displayneed, displaygottavoc, noteholding, preventpee, flushdrank, allowpee, wetherself, bladder, bladlose, gottagoflag, setGottagoflag, askholditcounter, setAskholditcounter, waitcounter, setWaitcounter } from './bladder';
import { displayyourneed, wetyourself, youpee } from './yourbladder';
import { standobjs, haveItem, backPackItems, allowItems, setAllowItems } from './backPackItems';
import { leavehm } from './drive';
import { kissher } from './actions';
import { theBedroom } from './fuckHer';
import { gameOver } from './main';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';
import { locations } from './locations';
import { heroutfit } from './settings';
import { seenmovie } from './locations/theatre';

// All functions connected to her house. This is both pickup and endgame
export let herHome; //Json with quotes for herHome.
export let prepeed = 0; // did she pee before you picked her up
export function setPrepeed(val: number) {
    prepeed = val;
}
export let elevatorwaitcounter = 0;
export function setElevatorwaitcounter(val: number) { elevatorwaitcounter = val; }
export function setFloorcounter(val: number) { floorcounter = val; }
export function setHerHome(val: any) { herHome = val; }

export function herHomeSetup() {
    fetchAndCacheJson("herhome").then(function(data) {
        herHome = data["theHome"];
        locations.theHome.visit = [herhome, herHome["choices"]["visit"]];
        locations.theHome.wantVisit = [herhome, herHome["choices"]["wantVisit"]];
    });
    return {
        visit: [] as any[],
        wantVisit: [] as any[],
        group: 4
    }
}

export function homeConditions() {
    return shyness < 50 && attraction > 100 && locations.makeOut.visited &&
        locations.theBar.visited && locations.theClub.visited && seenmovie;
}

export function herhome() {
    //This chooses the appropriate function to continue in the location herhome
    if (locStack[0] === "yourhome")
        fetchJson("appearance").then(function(data) {
            setAppearance(data);
            pickup();
        });
    else takeHerHome();
}

//TODO fix this scene
//The dialogues is fucked if you asked her to hold it
export function pickup() {
    setAllowItems(1);
    let curtext: any[] = [];
    if (locStack[0] !== "pickup") { // happens first time only.
        getMLocations("herhome", "pickup");
        pushloc("pickup");
        curtext.push(locjson["goOver"].formatVars());
        curtext.push(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        if (pantycolor !== "none") {
            //TODO make this more graceful
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquote"].formatVars());
        }else
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquotebare"]);
        if (thetime < 55) {
            curtext.push(locjson["earlyComment"].formatVars());
        } else if (!askholditcounter && gameState.Companion.bladderState >= BladderState.Need) {
            flushdrank(); // You did not ask her to wait.
        }
        if (gameState.Companion.bladderState >= BladderState.Emergency)
            curtext.push(pickrandom(locjson["bladderBulgeDesc"]));
        if (thetime > 75 || (gameState.Companion.bladderState >= BladderState.Need && thetime > 60)) {
            curtext = printList(curtext, locjson["lateComment"]);
            curtext =  showneed(curtext);
            curtext.push(pickrandom(locjson["upsetDesc"]));
            setAttraction(attraction - 5);
            setShyness(shyness - 10);
        }
        curtext = displayneed(curtext);
        if (prepeed) {
            curtext.push(locjson["prePeed"].formatVars());
            curtext = displaygottavoc(curtext);
        } else if (gameState.Companion.bladderState >= BladderState.Need && askholditcounter) {
            if (thetime > 60)
                curtext.push(pickrandom(locjson["lateHold"]).formatVars());
            else
                curtext.push(pickrandom(locjson["arriveHold"]).formatVars());
            curtext = displayneed(curtext);
            setAskholditcounter(0);
            setWaitcounter(0);
            setGottagoflag(1);
        } else if (askholditcounter) {
            curtext.push(pickrandom(locjson["askedHold"]).formatVars());
            curtext = showneed(curtext);
            setAskholditcounter(0);
            setWaitcounter(0);
        }
    } else {
        curtext.push(locjson["pickupMsg"].formatVars());
        curtext = showneed(curtext);
    }
    curtext = displayyourneed(curtext);
    sayText(curtext);
    curtext = [];
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else {
            curtext = standobjs(curtext, listenerList);
            if (gameState.Player.bladderState >= BladderState.Urge)
                listenerList.push([[youpee, locjson["choices"]["askToilet"]], "youpee"]);
        }
        listenerList.push([[leavehm, locjson["choices"]["letsGo"]], "leavehm"]);
    }
    addSayText(curtext);
    cListenerGenList(listenerList);

}

export function takeHerHome(){
    let curtext = printList([], herHome["arrive"]);
    let listenerList: any[] = [];
    if (homeConditions()){
        curtext.push(herHome["inviteUp"]);
        listenerList.push([[elevatorWait, herHome["choices"]["elevator"]], "elevator"]);
    } else
        curtext.push(herHome["goodnight"].formatVars());
    listenerList.push([[gameOver, herHome["choices"]["goodNight"]], "gameOver"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export let floorcounter = 0;
export function elevatorWait() {
    setAllowItems(1);
    let curtext: any[] = [];
    let listenerList: any[] = [];
    if (locStack[0] !== "theElevator") {
        pushloc("theElevator");
        curtext.push(herHome["goElevator"].formatVars());
        listenerList.push([[elevatorWait, "Continue..."], "elevatorWait"]);
    } else {
            if (randomchoice(3)) {
                if (elevatorwaitcounter > 2 && gameState.Companion.bladderState >= BladderState.Emergency) {
                    curtext = printList(curtext, herHome["elevArriveEmer"]);
                } else {
                    curtext.push(herHome["elevArrive"].formatVars());
                }
                listenerList.push([[theElevator, "Continue..."], "theElevator"]);
            } else {
                curtext = printList(curtext, herHome["elevWait"]);
                if (gameState.Companion.bladderState >= BladderState.Emergency)
                    curtext.push(pickrandom(herHome["elevWaitEmerQuote"]).formatVars());
                else
                    curtext.push(pickrandom(herHome["elevWaitQuote"]).formatVars());
                listenerList.push([[elevatorWait, "Continue..."], "elevatorWait"]);
                elevatorwaitcounter++;
            }
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function theElevator(){
    setAllowItems(1);
    let curtext: any[] = [];
    let listenerList: any[] = [];
    if (floorcounter === 3) {
        curtext = printList(curtext, herHome["elev3rdFloor"])
        if (!haveItem("herKeys")) {
            if (gameState.Companion.bladderState >= BladderState.Emergency)
                curtext.push(herHome["sheHasKeys"].formatVars());
            listenerList.push([[theHome, "Continue..."], "theHome"]);
        } else
            listenerList.push([[stolenKeys, "Continue..."], "stolenKeys"]);
    } else {
        curtext.push(herHome["inElev"].formatVars());
        curtext = noteholding(curtext);
        listenerList.push([[theElevator, "Continue..."], "theElevator"]);
    }
    curtext =  showneed(curtext);
    curtext = displayyourneed(curtext);
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (floorcounter >= 3) {
            poploc();
        } else {
            floorcounter += 1;
        }
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function stolenKeys(){
    let curtext = [herHome["searchKeys"].formatVars()];
    curtext = displayneed(curtext);
    curtext = voccurse(curtext);
    curtext.push(herHome["lostKeys"].formatVars());
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList([
        [[giveKeys, herHome["giveKeys"]], "giveKeys"],
        [[lookForKeys, herHome["lookKeys"]], "lookKeys"]
    ]);
}

export function giveKeys() {
    backPackItems.herKeys.value=0;
    let curtext = [herHome["getKeys"]];
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Emergency) {
        curtext = displayneed(curtext);
        curtext.push(herHome["giveKeysDesp"].formatVars());
        listenerList.push([[theHome, "Continue..."], "theHome"]);
    } else {
        curtext.push(herHome["giveKeysQuest"].formatVars());
        let excuses = [
            [ [keyNevermind, herHome["choices"]["keyNvm"]], "keyNvm"],
            [ [keyGoodExcuse, herHome["choices"]["keyGood"]], "keyGood"],
            [ [keyBadExcuse, herHome["choices"]["keyBad"]], "keyBad"]
        ];
        randomize(excuses).forEach(item => listenerList.push(item));
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function keyNevermind() {
    let curtext = printList([], herHome["keysNvm"])
    sayText(curtext);
    cListenerGen([theHome, "Continue..."], "theHome");
}

export function keyGoodExcuse(){
    let curtext = printList([], herHome["keysGood"]);
    sayText(curtext);
    setAttraction(attraction + 10);
    cListenerGen([theHome, "Continue..."], "theHome");
}

export function keyBadExcuse(){
    let curtext = printList([], herHome["keysBad"]);
    sayText(curtext);
    setAttraction(0);
    cListenerGen([gameOver, herHome["choices"]["keySlap"]], "gameOver");
}

export function lookForKeys() {
    let curtext: any[] = [];
    if (locStack[0] !== "lookForKeys"){
        pushloc("lookForKeys");
        curtext = printList(curtext, herHome["offersPurse"]);
        curtext = showneed(curtext);
    } else {
        curtext = showneed(curtext);
        curtext.push(herHome["rummagePurse"]);
    }
    // s(girlname + " offers you her purse.");
    // showneed();
    // s("You palm the keys in your pocket, take her purse and rummage through it.");
    backPackItems.herKeys.value = 0;
    sayText(curtext);
    cListenerGenList([
        [[lookForKeys, herHome["choices"]["keysNotFound"]],"lookForKeys"],
        [[function () {
            poploc();
            theHome();
        }, herHome["choices"]["foundThem"]], "theHome"]
    ]);
}

export function theHome() {
    setAllowItems(1);
    if (locStack[0] !== "theHome")
        pushloc("theHome")
    let curtext = [herHome["atHome"].formatVars()];
    let listerList: any[] = [];
    if (gameState.Romance.KissCounter > gameState.Romance.MaxKiss) {
        curtext = printList(curtext, herHome["kissExceeded"]);
        listerList.push([[gameOver, "Continue..."], "gameOver"]);
    } else {
        curtext = displaygottavoc(curtext);
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        //TODO figure out what the hell this is
        if (gameState.Romance.ChampagneCounter > 5) {
            if (bladder > bladlose-25)
                curtext = printList(curtext, herHome["champagneLose"]);
            else
                curtext.push(herHome["inviteBedroom"]);
            listerList.push([[theBedroom, herHome["choices"]["followHer"]], "theBedroom"]);
            listerList.push([[gameOver, herHome["choices"]["goodNight"]], "gameOver"]);
        } else {
            if (gottagoflag)
                listerList.push([[allowpee, herHome["choices"]["allowPee"]], "allowPee"]);
            else if (gameState.Player.bladderState >= BladderState.Urge)
                listerList.push([[youpee, herHome["choices"]["askBathroom"]], "youPee"]);
            listerList.push([[kissher, herHome["choices"]["kissHer"]], "kissHer"]);
            listerList.push([[gameOver, herHome["choices"]["goodNight"]],"gameOver"]);
        }
    }
    sayText(curtext);
    cListenerGenList(listerList);
}

export function exposeHerHomeOnWindow() {
    const mutableVars: [string, () => any, (v: any) => void][] = [
        ["herHome", () => herHome, (v) => { herHome = v; }],
        ["prepeed", () => prepeed, (v) => { prepeed = v; }],
        ["elevatorwaitcounter", () => elevatorwaitcounter, (v) => { elevatorwaitcounter = v; }],
        ["floorcounter", () => floorcounter, (v) => { floorcounter = v; }],
    ];
    for (const [name, getter, setter] of mutableVars) {
        Object.defineProperty(window, name, { get: getter, set: setter, configurable: true });
    }

    Object.assign(window, {
        herHomeSetup, herhome, pickup, takeHerHome, theElevator,
        elevatorWait, theHome, homeConditions,
        lookForKeys, giveKeys, stolenKeys,
        keyGoodExcuse, keyBadExcuse, keyNevermind,
    });
}

