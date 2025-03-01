let wetthecar = 0; // Seat of the car is wet

//
//  This function is used to leave ANY location and drive off.
//
function leavehm() {
    changevenueflag = 1;
    checkedherout = 0;
    kisscounter = 0;
    feelcounter = 0;
    rrlockedflag = 0;
    externalflirt = 0;

    let curtext = showneed([]);

    if (gottagoflag > 0) {
        curtext = printChoicesList(curtext, [0,1], drive["leavehm"]["choices"]);
        // c("holdit", "Ask her to hold it.");
        // c("allowpee", "Let her go.");
    } else {
        flirtedflag = 0;
        curtext.push("<b>YOU</b> " + pickrandom(drive["leavehm"]["outtahere"]));
        incrandom();
        curtext.push(girltalk + "Yeah! " + pickrandom(drive["leavehm"]["outtahere"]));
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        curtext = printChoicesList(curtext, [2], drive["leavehm"]["choices"]);
    }
    sayText(curtext);

}

//TODO fix the go to the bar like she asked
function driveout() {
    allowItems = 1;
    let curtext = [];
    if (locstack[0] !== "driveout") {
        pushloc("driveout");
        locationMCSetup("driveout", drive);
        curtext = printIntro(curtext, 0);
        suggestedloc = "none";
        if (wetthecar)
            curtext.push(appearance["clothes"][heroutfit]["soakedseatquote"]);
        else
            curtext = printIntro(curtext, 1);
        curtext = printIntro(curtext, 2);
    } else {
         curtext = printIntro(curtext, 4);
    }
    curtext = displayneed(curtext);
    //TODO can probably combine the printing things in the if statement
    if (suggestedloc === "none") {
        if (randomchoice(8)) {
            updateSuggestedLocation();
            if (suggestedloc !== "none")
                curtext = printDialogue(curtext, suggestedloc,0);
        }
    }
    curtext = displayyourneed(curtext);
    curtext = printAlways(curtext);
    sayText(curtext);
    printLocationMenu();
}

