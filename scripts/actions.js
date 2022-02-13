function flirt_l() {
    let curtext = []
    shyness -= 1;
    if (flirtcounter < 1) {
        if (locstack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        attraction += 2;
    } else
        //TODO have there be more quotes/respondive choice based on length of array
        curtext.push(flirtresps["neutral"][0])
    flirtcounter += 3;
    flirtedflag += 1;
    c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

function flirt_m() {
    let curtext = [];
    shyness -= 2;
    if (flirtcounter < 1) {
        if (locstack[0] === "callher")
            curtext.push(flirtresps["lowcell"][randcounter]);
        else
            curtext.push(flirtresps["low"][randcounter]);
        incrandom();
        attraction += 3;
    }
    if (flirtcounter === 1) {
        if (locstack[0] === "callher")
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
    c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

//High level responses only available when attraction is >35.
function flirt_h() {
    let curtext = [];
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
    c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

function checkherout() {
    checkedherout = 1;
    let curtext = [pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit])];
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

function feelup() {
    feelcounter += 1;
    let curtext = [];
    if (locstack[0] !== "thehottub") {
        curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelher"]));
        if (bladder > blademer) curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelpee"]));
        else curtext.push(pickrandom(appearance["clothes"][heroutfit]["feelres"]));
    } else {
        curtext.push(pickrandom(feelUp["tub"]));
        if (bladder > blademer) curtext.push(pickrandom(feelUp["peeTub"]));
        else curtext.push(pickrandom(feelUp["resTub"]));
    }
    if (flirtcounter > 1 && attraction > 35) {
        curtext.push(pickrandom(feelUp["resp"]));
        if (locstack[0] !== "thehottub")
            curtext.push("She" + pickrandom(feelUp["you"]));
        else
            curtext.push("She" + pickrandom(feelUp["youTub"]));
        if (feelcounter < maxfeel) {
            attraction += 5;
            shyness -= 2;
            arousal += 1;
        }
    } else if (attraction > 20) {
        if (locstack[0] !== "thehottub")
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

function kissher(curtext=[], sexLoc) {
    kisscounter += 1;
    curtext = printList(curtext, kissing["diag"][0]);
    if (attraction < 10 || (flirtcounter > 1 && attraction < 20)) {
        curtext = printList(curtext, kissing["diag"][1]);
        attraction -= 3;
    } else if (attraction < 20 || (flirtcounter > 2 && attraction < 30)) {
        curtext = printList(curtext, kissing["diag"][2]);
        if (kisscounter < maxkiss) {
            flirtcounter += 3;
            attraction += 3;
            shyness -= 3;
            arousal += 2;
        }
    } else if (attraction < 30) {
        curtext = printList(curtext, kissing["diag"][3]);
        if (kisscounter < maxkiss) {
            flirtcounter += 3;
            attraction += 3;
            shyness -= 3;
            arousal += 4;
        }
    } else if (attraction < 50) {
        curtext = printList(curtext, kissing["diag"][4]);
        if (kisscounter < maxkiss) {
            attraction += 3;
            shyness -= 3;
            arousal += 6;
        }
    } else {
        if (bladder < blademer) {
            if (locstack[0] !== "thehottub") {
                curtext.push(pickrandom(kissing["sxy"]));
                arousal += 8;
            }
            else {
                curtext.push(pickrandom(kissing["sxyNkd"]));
                arousal += 15;
            }
            incrandom();
        } else {
            if (locstack[0] !== "thehottub") {
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
    let listenerList = [];
    //If sexLoc is defined then this kiss is happening in the middle of a sexual encounter and therefore handled accordingly
    if (!sexLoc) curtext = callChoice(["curloc", "Continue..."], curtext);
    else {
        listenerList.push([[function () {haveSex(sexLoc)}, "Continue..."], "haveSex"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}