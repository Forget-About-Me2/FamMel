//This file contains all functions related to peeing

// DisplayGottaVoc function prints a quasi-random vocalization from "+girlname+"
// indication her sincere hope to find a bathroom soon.
function displaygottavoc(curtext, index) {
    let textchoice = [];
    if (askholditcounter > 0 && bladder > bladurge && randomchoice(3)) {
        textchoice.push(girltalk + "" + wanthold[randcounter]);
    }

    if (bladder >= bladneed && !brokeice) {
        textchoice.push(girlname + " looks embarassed.");
        textchoice.push(girltalk + "Jesus, I'm sorry.");
    }

    if (locstack[0] === "driveout") {
        if (bladder >= bladlose - 10) {
            textchoice.push(girltalk + "" + carlosequotes[randcounter]);
        } else if (bladder >= blademer) {
            textchoice.push(girltalk + "" + caremerquotes[randcounter]);
        } else if (bladder >= bladneed) {
            textchoice.push(girltalk + "" + carneedquotes[randcounter]);
        } else if (bladder >= bladurge) {
            textchoice.push(girltalk + "" + carurgequotes[randcounter]);
        } else {
        }
    } else {
        if (bladder >= bladlose - 10) {
            textchoice.push(girltalk + "" + losequotes[randcounter]);
        } else if (bladder >= blademer) {
            textchoice.push(girltalk + "" + emerquotes[randcounter]);
        } else if (bladder >= bladneed) {
            textchoice.push(girltalk + "" + needquotes[randcounter]);
        } else if (bladder >= bladurge) {
            textchoice.push(girltalk + "" + urgequotes[randcounter]);
        }
    }
    if (bladder >= bladneed) gottagoflag = 1;
    if (bladder >= bladurge) brokeice = 1;
    incrandom();
    if (textchoice.length === 1){
        curtext.splice(index, 0, textchoice[0]);
    } else {
        textchoice.forEach(text => {curtext.splice(index, 0, text); index++});
    }
    return curtext;
}

//TODO lose control when bursting on the way
function indepee() {
    gottagoflag = 0;
    //TODO the locstack aren't compeltely correct
    if (haveherpurse) {
        haveherpurse = 0;
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "pickup" ||
        locstack[0] === "fuckher6") {
        s(girlname + " heads for the bathroom, leaving the door slightly ajar.");
    } else if (locstack[0] === "themakeout" ||
        locstack[0] === "thehottub" ||
        locstack[0] === "driveout" ||
        locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "thewalk" || locstack[0] === "theyard" || locstack[0] === "thebeach") {
        s(girlname + " heads for the restroom and then realizes:");
    } else s(girlname + " runs toward the restroom.");

    if (locstack[0] === "thebar" && randomchoice(rrlockedthresh)) {
        bathroomlocked();
        if (rrlockedflag > 3) {
            s(girltalk + "It's <b><i>still</i></b> fucking locked!");
        } else if (rrlockedflag > 2) {
            s(girltalk + "It's <b><i>still</i></b> locked!  What's taking her so long?");
        } else if (rrlockedflag) {
            s(girltalk + "It's still locked!");
        } else {
            s(girltalk + "It was locked!");
        }
        rrlockedflag++;
        displayneed();
    } else if (locstack[0] === "theclub" && randomchoice(rrlinethresh)) {
        bathroomlocked();
        if (rrlockedflag) {
            s(girltalk + "The line's not getting any smaller.");
        } else {
            s(girltalk + "There was a huge line.");
        }
        rrlockedflag++;
        displayneed();
    } else if (locstack[0] === "dodance" && randomchoice(rrlinethresh)) {
        bathroomlocked();
        if (rrlockedflag > 3) {
            s(girltalk + "The line's still really fucking long.");
        } else if (rrlockedflag > 2) {
            s(girltalk + "I think the line's getting longer...");
        } else if (rrlockedflag) {
            s(girltalk + "The line's still really really long.");
        } else {
            s(girltalk + "There was a huge line.");
        }
        rrlockedflag++;
        displayneed();
    } else if (locstack[0] === "themakeout") {
        s("There is no restroom out here in the boonies.");
        displayneed();
    } else if (locstack[0] === "driveout") {
        s("There is no restroom in the car.");
        displayneed();
    } else if (locstack[0] === "thewalk" || locstack[0] === "theyard" || locstack[0] === "thebeach" || locstack[0] === "thehottub") {
        s("There is no restroom around.");
        displayneed();
        interpbladder();
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "fuckher6") {
        s("You hear a quick clatter and a gasp as she lifts the toilet lid.  She starts to pee violently, a loud hiss accompanying the splash of the urine in the bowl.  You imagine being in there with her as she relieves her bladder.");
        flushdrank();
    } else if (locstack[0] === "pickup") {
        s("You hear a quick clatter of the toilet lid, and then the hissing and splashing of her urine in the bowl.");
        flushdrank();
    } else if (locstack[0] === "solobar") {
        if (bladder > bladlose - 25)
            s(barpeeprivate[randcounter]);
        else
            s(barpeeprivate2[randcounter]);
        incrandom();
        //TODO check validity of these attraction
        attraction -= 2;
        flushdrank();
    } else {
        if (bladder > bladlose - 25)
            s(peeprivate[randcounter]);
        else
            s(peeprivate2[randcounter]);
        incrandom();
        //TODO check validity of these attraction
        attraction -= 2;
        flushdrank();
    }
    if (bladder >= bladlose - 25 && locstack[0] !== "thehottub") begtoilet();
    else {
        c(locstack[0], "Continue...");
    }
}

//TODO lose control when bursting on the way
//TODO add a chance of her denying you
function youpee() {
    let curtext = [];
    gottagoflag = 0;
    let peed = 0;
    if (locstack[0] === "yourhome") {
        curtext = printList(ypeelines["yourhome"], curtext);
        flushyourdrank();
        peed = 1
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" || locstack[0] === "pickup" || locstack[0] === "fuckher6") {
        if(locstack[0] !== "fuckher6") {
            curtext = printList(ypeelines["thehome"][0], curtext);
        }
        curtext = printList(ypeelines["thehome"][1], curtext);
        flushyourdrank();
        peed = 1
    } else {
        curtext = printList(ypeelines["remaining"], curtext);
    }

    if ((locstack[0] === "thebar" || locstack[0] === "theclub" || locstack[0] === "dodance") && randomchoice(rrlockedthresh)) {
        youbathroomlocked();
    }

    else if (locstack[0] === "darkbar" || locstack[0] === "darkmovie" || locstack[0] === "darkclub") {
        //TODO potentially cycle between quotes
        if (yourbladder > yourbladlose - 25)
            curtext = printList(ypeelines["youpeeprivate"][0], curtext);
        else if (!peed)
            curtext = printList(ypeelines["youpeeprivate2"][0], curtext);
        flushyourdrank();
    } else {
        if (yourbladder > yourbladlose - 25)
            curtext = printList(ypeelines["youpeeprivate"][randcounter], curtext);
        else if (!peed)
            curtext = printList(ypeelines["youpeeprivate2"][randcounter], curtext);
        incrandom();
        flushyourdrank();
    }
    if (yourbladder >= yourbladlose - 25 && locstack[0] !== "thehottub") curtext = youbegtoilet(curtext);
    else {
        curtext = c([locstack[0], "Continue..."], curtext);
    }
    console.log(curtext);
    sayText(curtext);
}

function bathroomlocked() {
    if (bladder > blademer)
        s("She quickly runs back looking shaken.");
    else if (bladder > bladneed)
        s("Momentarily, she returns looking uncomfortable.");
    else
        s("She returns looking unfulfilled.");
}

function youbathroomlocked(curtext) {
    const locked = ypeelines["locked"];
    if (locstack[0] === "thebar")
        curtext.push(locked["bar"]);
    else {
        curtext.push(locked["club"]);
    }
    if (yourbladder > yourblademer)
        curtext.push(locked["urgency"][0]);
    else if (yourbladder > yourbladneed)
        curtext.push(locked["urgency"][1]);
    else
        curtext.push(locked["urgency"[2]]);
    if(locstack[0] === "thebar") {
        if (yrrlockedflag > 3) {
            curtext.push(locked["cbar"][0]);
        } else if (yrrlockedflag > 2) {
            curtext.push(locked["cbar"][1]);
        } else if (yrrlockedflag) {
            curtext.push(locked["cbar"][2]);
        } else {
            curtext.push(locked["cbar"][3]);
        }
    } else {
        if (yrrlockedflag > 3) {
            curtext.push(locked["cclub"][0]);
        } else if (yrrlockedflag > 2) {
            curtext.push(locked["cclub"][1]);
        } else if (yrrlockedflag) {
            curtext.push(locked["cclub"][2]);
        } else {
            curtext.push(locked["cclub"][3]);
        }
    }
    yrrlockedflag++;
    displayneed(curtext);
    return curtext;
}

//  Displayneed function prints a relatively random
//  indication of her level of pee urgency.
function displayneed(curtext) {
    showedneed = 1;
    if (locstack[0] === "themakeout" || locstack[0] === "driveout" ||
        locstack[0] === "drivearound" || locstack[0] === "domovie" ||
        locstack[0] === "thebed" || fuckingnow > 0 || locstack[0] === "solobar"){
        if (bladder >= bladlose){
            curtext.push(needs["sitneedlose"][randcounter]);
        } else if (bladder > blademer) {
            curtext.push(needs["sitneedemer"][randcounter]);
        } else if (bladder > bladneed) {
            curtext.push(needs["sitneed"][randcounter]);
        } else if (bladder > bladurge) {
            curtext.push(needs["sitneedurge"][randcounter]);
        }
    } else if (locstack[0] === "thehottub"){
        if (bladder >= bladlose){
            curtext.push(needs["tubneedlose"][randcounter]);
        } else if (bladder > blademer) {
            curtext.push(needs["tubneedemer"][randcounter]);
        } else if (bladder > bladneed) {
            curtext.push(needs["tubneed"][randcounter]);
        } else if (bladder > bladurge) {
            curtext.push(needs["tubneedurge"][randcounter]);
        }
    } else {
        if (bladder >= bladlose){
            curtext.push(needs["needlose"][randcounter]);
        } else if (bladder > blademer) {
            curtext.push(needs["needemer"][randcounter]);
        } else if (bladder > bladneed) {
            curtext.push(needs["need"][randcounter]);
        } else if (bladder > bladurge) {
            curtext.push(needs["needurge"][randcounter]);
        }
    }
    incrandom();
    return curtext;
}

function youbegtoilet(curtext) {
    curtext.push(ypeelines["beg"][0]);
    if (shotglass > 0) curtext = callChoice(ypeelines["beg"][1][0], curtext);
    if (vase > 0) curtext = callChoice(ypeelines["beg"][1][1], curtext);
    curtext = callChoice(ypeelines["beg"][1][2], curtext);
    return curtext;
}

