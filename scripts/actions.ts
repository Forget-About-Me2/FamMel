import { callChoice, sayText, c, printList, cListenerGenList, flirtresps, appearance, feelUp, kissing, girlname, basegirl } from './quotes';
import { pickrandom, incrandom, getCurrentLocationTag, randcounter, flirtcounter, setFlirtcounter, flirtedflag, setFlirtedflag } from './shims';
import { haveSex } from './fuckHer';
import { runtimeContext } from './gameState/runtimeContext';
import { BladderLevel } from './gameState/bladderLevel';
import { heroutfit } from './settings';

export function flirt_l() {
    let curtext: any[] = []
    const currentLocationTag = getCurrentLocationTag();
    runtimeContext.setShyness(runtimeContext.Shyness - 1);
    if (flirtcounter < 1) {
        if (currentLocationTag === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        runtimeContext.setAttraction(runtimeContext.Attraction + 2);
    } else
        //TODO have there be more quotes/responsive choice based on length of array
        curtext.push(flirtresps["neutral"][0])
    setFlirtcounter(flirtcounter + 3);
    setFlirtedflag(flirtedflag + 1);
    c([currentLocationTag, "Continue..."], curtext);
    sayText(curtext);
}

export function flirt_m() {
    let curtext: any[] = [];
    const currentLocationTag = getCurrentLocationTag();
    runtimeContext.setShyness(runtimeContext.Shyness - 2);
    if (flirtcounter < 1) {
        if (currentLocationTag === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        runtimeContext.setAttraction(runtimeContext.Attraction + 3);
    }
    if (flirtcounter === 1) {
        if (currentLocationTag === "callher")
            curtext.push(flirtresps["medcell"][randcounter]);
        else
            curtext.push(flirtresps["med"][randcounter]);
        incrandom();
        runtimeContext.setAttraction(runtimeContext.Attraction + 6);
    }
    if (flirtcounter > 1) {
        curtext.push(flirtresps["neutral"][0])
    }
    setFlirtcounter(flirtcounter + 3);
    setFlirtedflag(flirtedflag + 1);
    c([currentLocationTag, "Continue..."], curtext);
    sayText(curtext);
}

//High level responses only available when runtimeContext.Attraction is >35.
export function flirt_h() {
    let curtext: any[] = [];
    const currentLocationTag = getCurrentLocationTag();
    if (runtimeContext.Attraction > 35 && runtimeContext.Shyness < 70) {
        curtext.push(flirtresps["high"][randcounter]);
        incrandom();
        runtimeContext.setAttraction(runtimeContext.Attraction + 10);
    } else {
        curtext.push(flirtresps["bad"][randcounter]);
        runtimeContext.setShyness(runtimeContext.Shyness + 10);
        if (runtimeContext.Shyness > 100) runtimeContext.setShyness(100);
    }
    setFlirtcounter(flirtcounter + 4);
    setFlirtedflag(flirtedflag + 1);
    c([currentLocationTag, "Continue..."], curtext);
    sayText(curtext);
}

export function checkherout() {
    runtimeContext.Interactions.CheckedHerOut = true;
    let curtext = [pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit])];
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function feelup() {
    runtimeContext.Romance.FeelCounter += 1;
    let curtext: any[] = [];
    const currentLocationTag = getCurrentLocationTag();
    if (currentLocationTag !== "thehottub") {
        curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelher"]));
        if (runtimeContext.Companion.bladderState >= BladderLevel.Emergency) curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelpee"]));
        else curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelres"]));
    } else {
        curtext.push(pickrandom(feelUp["tub"]));
        if (runtimeContext.Companion.bladderState >= BladderLevel.Emergency) curtext.push(pickrandom(feelUp["peeTub"]));
        else curtext.push(pickrandom(feelUp["resTub"]));
    }
    if (flirtcounter > 1 && runtimeContext.Attraction > 35) {
        curtext.push(pickrandom(feelUp["resp"]));
        if (currentLocationTag !== "thehottub")
            curtext.push("She" + pickrandom(feelUp["you"]));
        else
            curtext.push("She" + pickrandom(feelUp["youTub"]));
        if (runtimeContext.Romance.FeelCounter < runtimeContext.Romance.MaxFeel) {
            runtimeContext.setAttraction(runtimeContext.Attraction + 5);
            runtimeContext.setShyness(runtimeContext.Shyness - 2);
            runtimeContext.Romance.Arousal += 1;
        }
    } else if (runtimeContext.Attraction > 20) {
        if (currentLocationTag !== "thehottub")
            curtext.push(girlname + pickrandom(feelUp["you"]));
        else
            curtext.push(girlname + pickrandom(feelUp["youTub"]));
        if (runtimeContext.Romance.FeelCounter < runtimeContext.Romance.MaxFeel) {
            runtimeContext.setAttraction(runtimeContext.Attraction + 3);
            runtimeContext.setShyness(runtimeContext.Shyness - 5);
            runtimeContext.Romance.Arousal += 2;
        }
    } else {
        curtext.push(pickrandom(feelUp["bad"]));
        runtimeContext.setAttraction(runtimeContext.Attraction - 2);
        runtimeContext.setShyness(runtimeContext.Shyness + 5);
    }
    setFlirtcounter(flirtcounter + 4);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function kissher(curtext: any[] = [], sexLoc?: string) {
    runtimeContext.Romance.KissCounter += 1;
    const currentLocationTag = getCurrentLocationTag();
    const [kissAttempt, kissRejected, kissPleasedResponse, kissReturnedKiss, kissPassionateReturn] = kissing["diag"];
    curtext = printList(curtext, kissAttempt);
    if (runtimeContext.Attraction < 10 || (flirtcounter > 1 && runtimeContext.Attraction < 20)) {
        curtext = printList(curtext, kissRejected);
        runtimeContext.setAttraction(runtimeContext.Attraction - 3);
    } else if (runtimeContext.Attraction < 20 || (flirtcounter > 2 && runtimeContext.Attraction < 30)) {
        curtext = printList(curtext, kissPleasedResponse);
        if (runtimeContext.Romance.KissCounter < runtimeContext.Romance.MaxKiss) {
            setFlirtcounter(flirtcounter + 3);
            runtimeContext.setAttraction(runtimeContext.Attraction + 3);
            runtimeContext.setShyness(runtimeContext.Shyness - 3);
            runtimeContext.Romance.Arousal += 2;
        }
    } else if (runtimeContext.Attraction < 30) {
        curtext = printList(curtext, kissReturnedKiss);
        if (runtimeContext.Romance.KissCounter < runtimeContext.Romance.MaxKiss) {
            setFlirtcounter(flirtcounter + 3);
            runtimeContext.setAttraction(runtimeContext.Attraction + 3);
            runtimeContext.setShyness(runtimeContext.Shyness - 3);
            runtimeContext.Romance.Arousal += 4;
        }
    } else if (runtimeContext.Attraction < 50) {
        curtext = printList(curtext, kissPassionateReturn);
        if (runtimeContext.Romance.KissCounter < runtimeContext.Romance.MaxKiss) {
            runtimeContext.setAttraction(runtimeContext.Attraction + 3);
            runtimeContext.setShyness(runtimeContext.Shyness - 3);
            runtimeContext.Romance.Arousal += 6;
        }
    } else {
        if (runtimeContext.Companion.bladderState < BladderLevel.Emergency) {
            if (currentLocationTag !== "thehottub") {
                curtext.push(pickrandom(kissing["sxy"]));
                runtimeContext.Romance.Arousal += 8;
            }
            else {
                curtext.push(pickrandom(kissing["sxyNkd"]));
                runtimeContext.Romance.Arousal += 15;
            }
            incrandom();
        } else {
            if (currentLocationTag !== "thehottub") {
                curtext.push(pickrandom(kissing["pee"]));
                runtimeContext.Romance.Arousal += 10;
            }
            else {
                curtext.push(pickrandom(kissing["nkdPee"]));
                runtimeContext.Romance.Arousal += 15;
            }
        }
        if (runtimeContext.Romance.KissCounter < runtimeContext.Romance.MaxKiss) {
            runtimeContext.setAttraction(runtimeContext.Attraction + 3);
            runtimeContext.setShyness(runtimeContext.Shyness - 3);
        }
    }
    runtimeContext.Romance.Arousal += 2;
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