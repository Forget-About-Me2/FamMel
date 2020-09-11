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