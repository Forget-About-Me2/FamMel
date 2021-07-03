
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
        s("<b>YOU:</b> " + outtahere[randcounter]);
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
    let curtext = [];
    if (locstack[0] !== "driveout") {
        pushloc("driveout");
        if (withgirl) {
            locationMCSetup("driveout", drive);
            curtext = printIntro(curtext, 0);
            suggestedloc = "none";
            if (wetthecar)
                curtext.push(appearance["clothes"][heroutfit]["soakedseatquote"]);
                // s(soakedseatquote);
            else
                curtext = printIntro(curtext, 1);
            curtext = printIntro(curtext, 2);
        } else {
            curtext = printIntro(curtext, 3);
        }
    } else {
        if (withgirl)
            curtext = printIntro(curtext, 4);
        else
            curtext = printIntro(curtext, 5);
    }
    if (withgirl) {
        curtext = displayneed(curtext);
        if (suggestedloc === "none") {
            if (randomchoice(8)) {
                if (shyness < 30 && attraction > 50 && !beenmakeout) {
                    suggestedloc = "themakeout";
                } else if (shyness < 50 && attraction > 100 && beenmakeout &&
                    beenbar && beenclub && seenmovie) {
                    suggestedloc = "thehome";
                } else if (shyness > 80 && attraction < 30 && !seenmovie) {
                    suggestedloc = "themovie";
                } else if (shyness < 60 && attraction > 30 && !beenclub) {
                    suggestedloc = "theclub";
                } else if (bladder > bladneed && shyness < 50 && !beenbar) {
                    suggestedloc = "thebar";
                }
                if (suggestedloc !== "none")
                    curtext = printDialogue(curtext, suggestedloc,0);
            }
        }
    }
    curtext = displayyourneed(curtext);
    curtext = printAlways(curtext);
    let choices = [0];
    if (withgirl) {
        if (suggestedloc !== "thebar")
            choices.push(1);
        else
            choices.push(2);
        if (suggestedloc !== "theclub")
            choices.push(3);
        else
            choices.push(4);
        if (suggestedloc !== "themovie")
            choices.push(5);
        else
            choices.push(6);
        if (suggestedloc !== "themakeout")
            choices.push(7);
        else
            choices.push(8);
        if (suggestedloc !== "thehome")
            choices.push(9);
        else
            choices.push(10);
    } else
        choices.push(11);
    curtext = printChoices(curtext, choices);
    sayText(curtext);

    //TODO determine whether debug should stay
    // if (debugmode) c("timewarp", "Advance to 2AM");
    // if (debugmode && withgirl) c("ditchgirl", "Ditch the girl");
}

function nextstop() {
    s("<b>YOU:</b> I'll definitely stop at the next place I see.");
    s(girltalk + "Thanks!");
    displayneed();
    c(locstack[0], "Continue...");
}

function drivearound() {
    if (!withgirl) {
        s(soloview[randcounter]);
        incrandom();
        c(locstack[0], "Continue...");
    } else {
        s("You are driving around with " + girlname + " in the passenger seat.");
        showneed();
        displayyourneed();
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (yourbladder > yourblademer)
                c("drivetell", "Tell her you need to go.");
            if (gottagoflag > 0) {
                preventpee();
            } else standobjs();
            c(locstack[0], "Continue...");
        }
    }
}

function drivetell() {
    s("You shift uncomfortably in your seat, trying to focus on the road.");
    s("YOU: I'm bursting for a pee.");
    s(girltalk + "Then you better stop somewhere so you can go.");
    c("drivepee", "I can't wait.");
    c(locstack[0], "I'll stop at the next place I see.");
}

function drivepee() {
    s(girltalk + "Do you have anything you can pee in? A cup or something?");
    if (shotglass > 0) c("ypeeshot", "Pee in the shot glass.");
    //TODO figure out how towels would work for you
    // if ( ptowels > 0 ) c("peetowels" , "Pee in the roll of paper towels.");
    if (vase > 0) c("ypeevase", "Pee in the vase.");
    c(locstack[0], "No, I got nothing!")
}

//TODO fix the double desperate
function itsclosed(locname) {
    let theloc;
    if (locname === "thebar") theloc = "bar";
    if (locname === "theclub") theloc = "night club";
    if (locname === "themovie") theloc = "movie theater";

    s("You and " + girlname + " arrive at the " + theloc + ".");
    s("It seems a bit deserted.");
    if (bladder > blademer) {
        s(girltalk + "<i>It had better not be closed.</i>");
        displaygottavoc();
    }
    s("The " + theloc + " is definitely closed.");
    showneed();
    displayyourneed();
    if (locname === "thebar" && barkey > 0)
        c("breakbar", "Try to break in with your key.");
    if (locname === "theclub" && clubkey > 0)
        c("breakclub", "Try to break in with your key.");
    if (locname === "themovie" && theaterkey > 0)
        c("breakmovie", "Try to break in with your key.");
    c(locstack[0], "Continue...");
}