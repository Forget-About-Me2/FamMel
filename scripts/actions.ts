import { callChoice, sayText, c, printList, cListenerGenList, flirtresps, appearance, feelUp, kissing, girlname, basegirl } from './quotes';
import { pickrandom, incrandom, locStack, randcounter, attraction, setAttraction, shyness, setShyness, flirtcounter, setFlirtcounter, flirtedflag, setFlirtedflag, checkedherout, setCheckedherout } from './shims';
import { haveSex } from './fuckHer';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';
import { heroutfit } from './settings';

export function flirt_l() {
    let curtext: any[] = []
    setShyness(shyness - 1);
    if (flirtcounter < 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        setAttraction(attraction + 2);
    } else
        //TODO have there be more quotes/responsive choice based on length of array
        curtext.push(flirtresps["neutral"][0])
    setFlirtcounter(flirtcounter + 3);
    setFlirtedflag(flirtedflag + 1);
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function flirt_m() {
    let curtext: any[] = [];
    setShyness(shyness - 2);
    if (flirtcounter < 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        setAttraction(attraction + 3);
    }
    if (flirtcounter === 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["medcell"][randcounter]);
        else
            curtext.push(flirtresps["med"][randcounter]);
        incrandom();
        setAttraction(attraction + 6);
    }
    if (flirtcounter > 1) {
        curtext.push(flirtresps["neutral"][0])
    }
    setFlirtcounter(flirtcounter + 3);
    setFlirtedflag(flirtedflag + 1);
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

//High level responses only available when attraction is >35.
export function flirt_h() {
    let curtext: any[] = [];
    if (attraction > 35 && shyness < 70) {
        curtext.push(flirtresps["high"][randcounter]);
        incrandom();
        setAttraction(attraction + 10);
    } else {
        curtext.push(flirtresps["bad"][randcounter]);
        setShyness(shyness + 10);
        if (shyness > 100) setShyness(100);
    }
    setFlirtcounter(flirtcounter + 4);
    setFlirtedflag(flirtedflag + 1);
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function checkherout() {
    setCheckedherout(1);
    let curtext = [pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit])];
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function feelup() {
    gameState.Romance.FeelCounter += 1;
    let curtext: any[] = [];
    if (locStack[0] !== "thehottub") {
        curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelher"]));
        if (gameState.Companion.bladderState >= BladderState.Emergency) curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelpee"]));
        else curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelres"]));
    } else {
        curtext.push(pickrandom(feelUp["tub"]));
        if (gameState.Companion.bladderState >= BladderState.Emergency) curtext.push(pickrandom(feelUp["peeTub"]));
        else curtext.push(pickrandom(feelUp["resTub"]));
    }
    if (flirtcounter > 1 && attraction > 35) {
        curtext.push(pickrandom(feelUp["resp"]));
        if (locStack[0] !== "thehottub")
            curtext.push("She" + pickrandom(feelUp["you"]));
        else
            curtext.push("She" + pickrandom(feelUp["youTub"]));
        if (gameState.Romance.FeelCounter < gameState.Romance.MaxFeel) {
            setAttraction(attraction + 5);
            setShyness(shyness - 2);
            gameState.Romance.Arousal += 1;
        }
    } else if (attraction > 20) {
        if (locStack[0] !== "thehottub")
            curtext.push(girlname + pickrandom(feelUp["you"]));
        else
            curtext.push(girlname + pickrandom(feelUp["youTub"]));
        if (gameState.Romance.FeelCounter < gameState.Romance.MaxFeel) {
            setAttraction(attraction + 3);
            setShyness(shyness - 5);
            gameState.Romance.Arousal += 2;
        }
    } else {
        curtext.push(pickrandom(feelUp["bad"]));
        setAttraction(attraction - 2);
        setShyness(shyness + 5);
    }
    setFlirtcounter(flirtcounter + 4);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function kissher(curtext: any[] = [], sexLoc?: string) {
    gameState.Romance.KissCounter += 1;
    const [kissAttempt, kissRejected, kissPleasedResponse, kissReturnedKiss, kissPassionateReturn] = kissing["diag"];
    curtext = printList(curtext, kissAttempt);
    if (attraction < 10 || (flirtcounter > 1 && attraction < 20)) {
        curtext = printList(curtext, kissRejected);
        setAttraction(attraction - 3);
    } else if (attraction < 20 || (flirtcounter > 2 && attraction < 30)) {
        curtext = printList(curtext, kissPleasedResponse);
        if (gameState.Romance.KissCounter < gameState.Romance.MaxKiss) {
            setFlirtcounter(flirtcounter + 3);
            setAttraction(attraction + 3);
            setShyness(shyness - 3);
            gameState.Romance.Arousal += 2;
        }
    } else if (attraction < 30) {
        curtext = printList(curtext, kissReturnedKiss);
        if (gameState.Romance.KissCounter < gameState.Romance.MaxKiss) {
            setFlirtcounter(flirtcounter + 3);
            setAttraction(attraction + 3);
            setShyness(shyness - 3);
            gameState.Romance.Arousal += 4;
        }
    } else if (attraction < 50) {
        curtext = printList(curtext, kissPassionateReturn);
        if (gameState.Romance.KissCounter < gameState.Romance.MaxKiss) {
            setAttraction(attraction + 3);
            setShyness(shyness - 3);
            gameState.Romance.Arousal += 6;
        }
    } else {
        if (gameState.Companion.bladderState < BladderState.Emergency) {
            if (locStack[0] !== "thehottub") {
                curtext.push(pickrandom(kissing["sxy"]));
                gameState.Romance.Arousal += 8;
            }
            else {
                curtext.push(pickrandom(kissing["sxyNkd"]));
                gameState.Romance.Arousal += 15;
            }
            incrandom();
        } else {
            if (locStack[0] !== "thehottub") {
                curtext.push(pickrandom(kissing["pee"]));
                gameState.Romance.Arousal += 10;
            }
            else {
                curtext.push(pickrandom(kissing["nkdPee"]));
                gameState.Romance.Arousal += 15;
            }
        }
        if (gameState.Romance.KissCounter < gameState.Romance.MaxKiss) {
            setAttraction(attraction + 3);
            setShyness(shyness - 3);
        }
    }
    gameState.Romance.Arousal += 2;
    let listenerList: any[] = [];
    //If sexLoc is defined then this kiss is happening in the middle of a sexual encounter and therefore handled accordingly
    if (!sexLoc) curtext = callChoice(["curloc", "Continue..."], curtext);
    else {
        listenerList.push([[function () {haveSex(sexLoc)}, "Continue..."], "haveSex"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function exposeActionsOnWindow(): void {
    const w = window as any;
    w.flirt_l = flirt_l;
    w.flirt_m = flirt_m;
    w.flirt_h = flirt_h;
    w.checkherout = checkherout;
    w.feelup = feelup;
    w.kissher = kissher;
}