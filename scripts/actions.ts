import { callChoice, sayText, c, printList, cListenerGenList } from './quotes';
import { pickrandom, incrandom } from './shims';
import { haveSex } from './fuckHer';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';

export function flirt_l() {
    let curtext: any[] = []
    shyness -= 1;
    if (flirtcounter < 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        attraction += 2;
    } else
        //TODO have there be more quotes/responsive choice based on length of array
        curtext.push(flirtresps["neutral"][0])
    flirtcounter += 3;
    flirtedflag += 1;
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function flirt_m() {
    let curtext: any[] = [];
    shyness -= 2;
    if (flirtcounter < 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        attraction += 3;
    }
    if (flirtcounter === 1) {
        if (locStack[0] === "callher")
            curtext.push(flirtresps["medcell"][randcounter]);
        else
            curtext.push(flirtresps["med"][randcounter]);
        incrandom();
        attraction += 6;
    }
    if (flirtcounter > 1) {
        curtext.push(flirtresps["neutral"][0])
    }
    flirtcounter += 3;
    flirtedflag += 1;
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

//High level responses only available when attraction is >35.
export function flirt_h() {
    let curtext: any[] = [];
    if (attraction > 35 && shyness < 70) {
        curtext.push(flirtresps["high"][randcounter]);
        incrandom();
        attraction += 10;
    } else {
        curtext.push(flirtresps["bad"][randcounter]);
        shyness += 10;
        if (shyness > 100) shyness = 100;
    }
    flirtcounter += 4;
    flirtedflag += 1;
    c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function checkherout() {
    checkedherout = 1;
    let curtext = [pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit])];
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function feelup() {
    feelcounter += 1;
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
        if (feelcounter < maxfeel) {
            attraction += 5;
            shyness -= 2;
            arousal += 1;
        }
    } else if (attraction > 20) {
        if (locStack[0] !== "thehottub")
            curtext.push(girlname + pickrandom(feelUp["you"]));
        else
            curtext.push(girlname + pickrandom(feelUp["youTub"]));
        if (feelcounter < maxfeel) {
            attraction += 3;
            shyness -= 5;
            arousal += 2;
        }
    } else {
        curtext.push(pickrandom(feelUp["bad"]));
        attraction -= 2;
        shyness += 5;
    }
    flirtcounter += 4;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function kissher(curtext: any[] = [], sexLoc?: string) {
    kisscounter += 1;
    const [kissAttempt, kissRejected, kissPleasedResponse, kissReturnedKiss, kissPassionateReturn] = kissing["diag"];
    curtext = printList(curtext, kissAttempt);
    if (attraction < 10 || (flirtcounter > 1 && attraction < 20)) {
        curtext = printList(curtext, kissRejected);
        attraction -= 3;
    } else if (attraction < 20 || (flirtcounter > 2 && attraction < 30)) {
        curtext = printList(curtext, kissPleasedResponse);
        if (kisscounter < maxkiss) {
            flirtcounter += 3;
            attraction += 3;
            shyness -= 3;
            arousal += 2;
        }
    } else if (attraction < 30) {
        curtext = printList(curtext, kissReturnedKiss);
        if (kisscounter < maxkiss) {
            flirtcounter += 3;
            attraction += 3;
            shyness -= 3;
            arousal += 4;
        }
    } else if (attraction < 50) {
        curtext = printList(curtext, kissPassionateReturn);
        if (kisscounter < maxkiss) {
            attraction += 3;
            shyness -= 3;
            arousal += 6;
        }
    } else {
        if (gameState.Companion.bladderState < BladderState.Emergency) {
            if (locStack[0] !== "thehottub") {
                curtext.push(pickrandom(kissing["sxy"]));
                arousal += 8;
            }
            else {
                curtext.push(pickrandom(kissing["sxyNkd"]));
                arousal += 15;
            }
            incrandom();
        } else {
            if (locStack[0] !== "thehottub") {
                curtext.push(pickrandom(kissing["pee"]));
                arousal += 10;
            }
            else {
                curtext.push(pickrandom(kissing["nkdPee"]));
                arousal += 15;
            }
        }
        if (kisscounter < maxkiss) {
            attraction += 3;
            shyness -= 3;
        }
    }
    arousal += 2;
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