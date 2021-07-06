//This file contains all functions related to peeing
//TODO option to turn off playerbladder
//TODO organize this better

// Slightly randomizes the calculated tuminc
// so the bladder doesn't fill with a completely fixed amount each time
function randtuminc(tempinc) {
    if (tempinc === 2)
        return tempinc;
    let choicearray = [];
    for (let i = 0; i < 10; i++) {
        if (i === 0)
            choicearray.push(tempinc - 2);
        else if (i < 3)
            choicearray.push(tempinc - 1);
        else if (i < 7)
            choicearray.push(tempinc);
        else if (i < 9)
            choicearray.push(tempinc + 1);
        else
            choicearray.push(tempinc + 2);
    }
    return pickrandom(choicearray);
}

//
//  Reset All Pee Counters ( this means she peed )
//
//TODO maybe also slightly derate bladder when desperate
function flushdrank() {

    //  Derate bladder capacity if she loses it...
    if (bladder >= bladlose) updateurge(bladurge * 9 / 10);

    bladder = 0;
    askholditcounter = 0;
    waitcounter = 0;
    gottagoflag = 0;
    drankwaters = 0;
    drankcocktails = 0;
    drankbeers = 0;
    dranksodas = 0;
    lastpeetime = thetime;
    rrlockedflag = 0;
    shespurted = 0;
    nowpeeing = 1;
    bribeaskthresh = 8;
}

function flushyourdrank() {

    //  Derate bladder capacity if you loses it...
    if (yourbladder >= yourbladlose) updateyoururge(yourbladurge * 9 / 10);

    yourbladder = 0;
    ydrankwaters = 0;
    ydrankcocktails = 0;
    ydrankbeers = 0;
    ydranksodas = 0;
    ylastpeetime = thetime;
    yrrlockedflag = 0;
    ynowpeeing = 1;
}

// Showneed
// Showneed calculates how she's going to indicate
// her current level of need ( if at all ) based on her situation
function showneed(curtext) {
    //TODO turn quotes into JSON

    // Clear the gottagoflag.  It will be set by displaygottavoc().
    gottagoflag = 0;

    //  How this should work:
    //  Outer IFs determine LOCATION/SCENARIO.
    //  Inner IFs determine pee request parameters
    //  Upper IFs are emergencies

    // If she's within 2 turns of wetting and not too shy, she will vocalize
    // no matter what.

    if (bladder >= (bladlose - 25) && shyness < 90) {
        if (externalflirt) curtext = voccurse(curtext);
        curtext = displaygottavoc(curtext);
    } else if (changevenueflag) {
        // She's almost always going to ask to go if you're off somewhere
        if ((bladder >= blademer) ||
            (bladder >= bladneed && shyness < 70)) {
            if (waitcounter === 0) {  // did you just ask her to wait?
                curtext.push(girltalk + "Hey! Before we go...");
                waitcounter = 4;
                curtext = displaygottavoc(curtext);
            } else {
                curtext.push(girlname + " looks like she really has to pee, but she doesn't say anything.");
                if (askholditcounter)
                    curtext.push("After all, you did ask her to hold it.");
            }
        }
    } else if (waitcounter === 0 && !externalflirt) {
        // Then there are generic instances where she might ask
        // She'll try to hold it if you flirted with somebody at that location
        // Shyness < 80 is enough to ask if she's having a bladder emergency
        if (shyness < 80 && bladder > blademer) {
            waitcounter = 6;
            curtext = displaygottavoc(curtext);
            // Shyness < 60 is enough to ask if she's merely needing to pee bad
        } else if (shyness < 60 && bladder > bladneed) {
            waitcounter = 10;
            curtext = displaygottavoc(curtext);
            // Shyness < 40 and she's letting you know at 1st urge.
        } else if (shyness < 40 && bladder > bladurge) {
            waitcounter = 12;
            curtext = displaygottavoc(curtext);
            // Otherwise, she may or may not show symptoms of having to go
        } else if ((Math.random() * bladlose) < bladder) {
            curtext = displayneed(curtext);
        }
        // Otherwise, she may or may not show symptoms of having to go
    } else if ((Math.random() * bladlose) < bladder) {
        curtext = displayneed(curtext);
    }
    changevenueflag = 0;
    return curtext;
}


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
    if(index){
        if (textchoice.length === 1){
            curtext.splice(index, 0, textchoice[0]);
        } else {
            textchoice.forEach(text => {curtext.splice(index, 0, text); index++});
        }
    } else {
        textchoice.forEach(text => curtext.push(text));
    }
    return curtext;
}


// Publish a note about her holding it for you.
// Depends on whether you asked her to hold it,
// and emergency bladder state
function noteholding(curtext) {
    if (bladder > blademer && askholditcounter) curtext.push(pickrandom(needs["sheholds"]));
    return curtext;
}

//
//  Publish a note about her looking like she has to go.
//
function interpbladder(curtext) {
    if (bladder > bladlose) curtext.push(pickrandom(needs["interplose"]));
    else if (bladder > blademer) curtext.push(pickrandom(needs["interpemer"]));
    else if (bladder > bladneed) curtext.push(pickrandom(needs["interplose"]));
    return curtext;
}

//TODO lose control when bursting on the way
function indepee(curtext=[], called=false) {
    gottagoflag = 0;
    //TODO the locstack aren't compeltely correct
    if (haveherpurse) {
        haveherpurse = 0;
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "pickup" ||
        locstack[0] === "fuckher6") {
        curtext.push(peelines["thehome"][0]);
        // s(girlname + " heads for the bathroom, leaving the door slightly ajar.");
    } else if (locstack[0] === "themakeout" ||
        locstack[0] === "thehottub" ||
        locstack[0] === "driveout" ||
        locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "thewalk" || locstack[0] === "theyard" || locstack[0] === "thebeach") {
        curtext.push(peelines["noneavailable"][0]);
    } else
        curtext = printList(curtext, peelines["remaining"]);
    if ((locstack[0] === "thebar" && randomchoice(rrlockedthresh) ) || ((locstack[0] === "theclub" || locstack[0] === "dodance") && randomchoice(rrlinethresh)) ){
        curtext = bathroomlocked(curtext);
    } else if (locstack[0] === "themakeout") {
        curtext.push(peelines["noneavailable"][1]);
        displayneed();
    } else if (locstack[0] === "driveout") {
        curtext.push(peelines["noneavailable"][2]);
        displayneed();
    } else if (locstack[0] === "thewalk" || locstack[0] === "theyard" || locstack[0] === "thebeach" || locstack[0] === "thehottub") {
        curtext.push(peelines["noneavailable"][3]);
        displayneed();
        interpbladder();
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "fuckher6") {
        curtext.push(peelines["thehome"][1]);
        flushdrank();
    } else if (locstack[0] === "pickup") {
        curtext.push(peelines["thehome"][2]);
        flushdrank();
    } else if (locstack[0] === "solobar") {
        if (bladder > bladlose - 25)
            curtext.push(pickrandom(peelines["barpeeprivate"]));
        else
            curtext.push(pickrandom(peelines["barpeeprivate2"]));
        //TODO check validity of these attraction
        attraction -= 2;
        flushdrank();
    } else {
        if (bladder > bladlose - 25)
            curtext.push(pickrandom(appearance[heroutfit]["peeprivate"]));
        else
            curtext.push(pickrandom(appearance[heroutfit]["peeprivate2"]));
        //TODO check validity of these attraction
        attraction -= 2;
        flushdrank();
    }
    if (bladder >= bladlose - 25 && locstack[0] !== "thehottub") curtext = begtoilet(curtext);
    else {
        curtext = c([locstack[0], "Continue..."], curtext);
    }
    //If the function has been called by another function, send the result back otherwise print it yourself
    if (called)
        return curtext;
    else
        sayText(curtext);
}

//TODO lose control when bursting on the way
//TODO add a chance of her denying you
function youpee() {
    let curtext = [];
    gottagoflag = 0;
    let peed = 0;
    if (locstack[0] === "yourhome") {
        curtext = printList(curtext, ypeelines["yourhome"]);
        flushyourdrank();
        peed = 1
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" || locstack[0] === "pickup" || locstack[0] === "fuckher6") {
        if(locstack[0] !== "fuckher6") {
            curtext = printList(curtext, ypeelines["thehome"][0]);
        }
        curtext = printList(curtext, ypeelines["thehome"][1]);
        flushyourdrank();
        peed = 1
    } else {
        curtext = printList(curtext, ypeelines["remaining"]);
    }

    if ((locstack[0] === "thebar" && randomchoice(rrlockedthresh) ) || ((locstack[0] === "theclub" || locstack[0] === "dodance") && randomchoice(rrlinethresh)) ) {
        curtext = youbathroomlocked(curtext);
    }

    else if (locstack[0] === "darkbar" || locstack[0] === "darkmovie" || locstack[0] === "darkclub") {
        //TODO potentially cycle between quotes
        if (yourbladder > yourbladlose - 25)
            curtext = printList(ypeelines["youpeeprivate"][0], curtext);
        else
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
    sayText(curtext);
}

//TODO your and her bathroomlocked can probably be intertwened, only difference is start and the locked variable
function bathroomlocked(curtext) {
    const locked = peelines["locked"]
    //Description of her reaction, based on how badly she has to go
    if (bladder > blademer)
        curtext.push(locked["urgency"][0]);
    else if (bladder > bladneed)
        curtext.push(locked["urgency"][1]);
    else
        curtext.push(locked["urgency"][2]);
    if(locstack[0] === "thebar") {
        //She tells you the bathroom was locked, depending on how often you tried already
        if (rrlockedflag > 3) {
            curtext.push(locked["cbar"][0]);
        } else if (rrlockedflag > 2) {
            curtext.push(locked["cbar"][1]);
        } else if (rrlockedflag) {
            curtext.push(locked["cbar"][2]);
        } else {
            curtext.push(locked["cbar"][3]);
        }
    } else {
        //She tells you the line was too long, depending on how often she tried already
        if (rrlockedflag > 3) {
            curtext.push(locked["cclub"][0]);
        } else if (rrlockedflag > 2) {
            curtext.push(locked["cclub"][1]);
        } else if (rrlockedflag) {
            curtext.push(locked["cclub"][2]);
        } else {
            curtext.push(locked["cclub"][3]);
        }
    }

    rrlockedflag++; //Increase how often she tried
    curtext = displayneed(curtext);
    return curtext;

}

function youbathroomlocked(curtext) {
    const locked = ypeelines["locked"];
    //Description of the situation
    if (locstack[0] === "thebar")
        curtext.push(locked["bar"]);
    else {
        curtext.push(locked["club"]);
    }
    //Description of your reaction, based on how badly you have to go
    if (yourbladder > yourblademer)
        curtext.push(locked["urgency"][0]);
    else if (yourbladder > yourbladneed)
        curtext.push(locked["urgency"][1]);
    else
        curtext.push(locked["urgency"[2]]);
    if(locstack[0] === "thebar") {
        //Tell her the bathroom was locked, depending on how often you tried already
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
        //Tell her the line was too long, depending on how often you tried already
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
    yrrlockedflag++; //Increase how often you tried
    curtext = displayneed(curtext);
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

function displayyourneed(curtext) {
    if (yourbladder >= yourbladlose && !holdself) {
        curtext.push(pickrandom(yneeds["burst"]));
    } else if (yourbladder > yourblademer) {
        curtext.push(pickrandom(yneeds["desperate"]));
    } else if (yourbladder > yourbladneed) {
        curtext.push(pickrandom(yneeds["need"]));
    } else if (yourbladder > yourbladurge) {
        curtext.push(pickrandom(yneeds["urge"]));
    } else if (locstack[0] === "drinkinggame") {
        curtext.push(pickrandom(yneeds["empty"]));
    }
    return curtext
}

//TODO make this more fancy
function youbegtoilet(curtext) {
    curtext.push(ypeelines["beg"][0]);
    if (shotglass > 0) curtext = callChoice(ypeelines["beg"][1][0], curtext);
    if (vase > 0) curtext = callChoice(ypeelines["beg"][1][1], curtext);
    curtext = callChoice(ypeelines["beg"][1][2], curtext);
    return curtext;
}


//
//  She says how long she's been waiting to pee.
//
function displaywaited(curtext) {
    let timewaited = " ";
    let halftimewaited;
    halftimewaited = Math.floor((thetime - lastpeetime) / 30);
    if (halftimewaited > 1) {
        timewaited += Math.floor(halftimewaited / 2);
        if (halftimewaited % 2 === 1) {
            timewaited += " and a half hours";
        } else if (halftimewaited === 2) {
            timewaited += " whole hour";
        } else {
            timewaited += " hours"
        }
    } else if (halftimewaited === 1) {
        timewaited = " half an hour";
    }

    if (halftimewaited > 1)
        curtext.push(girltalk + pickrandom(needs["holdingtime"]) + timewaited + "!");
    return curtext;
}

//
//  She says how much she's drank since she last peed.
//
function displaydrank(curtext) {

    let sentence = " ";
    comma = 0;

    if (drankwaters > 0) {
        comma = 1;
        sentence += drankwaters + " water";
        if (drankwaters > 1) sentence += "s";
    }

    if (drankbeers > 0) {
        if (comma > 0) {
            if (dranksodas + drankcocktails === 0)
                sentence += " and ";
            else
                sentence += ", ";
        }
        comma = 1;

        sentence += drankbeers + " beer";
        if (drankbeers > 1) sentence += "s";
    }

    if (dranksodas > 0) {
        if (comma > 0) {
            if (drankcocktails === 0)
                sentence += " and ";
            else
                sentence += ", ";
        }
        comma = 1;
        sentence += dranksodas + " soda";
        if (dranksodas > 1) sentence += "s";
    }

    if (drankcocktails > 0) {
        if (comma > 0) sentence += " and ";
        comma = 1;
        sentence += drankcocktails + " cocktail";
        if (drankcocktails > 1) sentence += "s";
    }

    if ((drankwaters + drankbeers + drankcocktails + dranksodas) > 0) {
        curtext.push(girltalk + "I drank " + sentence + " " + pickrandom(needs["drankburst"]));
    }

    return curtext;
}

//
//  You try to convince her to hold it.
//
function convinceher(curtext) {
    let selection = []; //Used to keep track of which options need to be printed
    if (haveItem("roses")) {
        selection.push(0);
    }
    if (haveItem("earrings")) {
        selection.push(1);
    }
    if (owedfavor > 0) {
        selection.push(2);
    }
    selection.push(3);
    selection.push(4);
    curtext = printChoicesList(curtext, selection, needs["convinceher"]);
    return curtext;
}

function briberoses() {
    let curtext = [];
    curtext = printList(curtext, needs["briberoses"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    roses -= 1;
    sayText(curtext);
}

function bribeearrings() {
    let curtext = [];
    curtext = printList(curtext, needs["bribeearrings"]);
    // s("<b>YOU:</b>  Pretty please!  I'll give you a set of diamond earrings if you can hold it!");
    // s(girltalk + "For diamonds, I'd do much more than hold it.  But okay.");
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    earrings -= 1;
    sayText(curtext);
}

function bribeask() {
    // s("<b>YOU:</b> Pretty please!");
    let curtext = []
    curtext = printList(curtext, needs["bribeask"]);
    if (randomchoice(bribeaskthresh) && (
        (bladder >= bladlose && attraction > holditlosethresh) ||
        (bladder >= blademer && attraction > holditemerthresh) ||
        (bladder >= bladneed && attraction > holditneedthresh))) {
        curtext.push(girltalk + pickrandom(general["okayforyou"]));
        askholditcounter++;
        curtext = displayholdquip(curtext);
        curtext = printChoicesList(curtext, [0],  needs["choices"]);
    } else {
        //TODO figure out how to deal with multiple variable quotes
        curtext.push(girltalk + "You've already asked me to hold it " + askholditcounter + " times.");
        curtext = displaygottavoc(curtext);
        curtext = printChoicesList(curtext, [1],  needs["choices"]);
    }
    sayText(curtext);
    bribeaskthresh -= askholditcounter * 0.1;
}

function bribefavor() {
    let curtext = needs["bribefavor"]
    // s("<b>YOU:</b> Pretty please!  Remember you promised to do me a favor!");
    // s(girltalk + "Well... Okay.  But just a little bit.  I did promise you a favor.");
    curtext = displayholdquip(curtext);
    curtext = interpbladder(curtext);
    owedfavor -= 1;
    askholditcounter++;
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    sayText(curtext);
}

//
//  Pay her to hold it in.
//
//TODO maybe she haggles
function payholdit() {
    let curtext = needs["payholdit"];
    // s("<b>YOU:</b> I'll pay you if you can hold it for a while.");
    const temp = displayneed(curtext);
    //TODO make this more standard
    curtext.splice(1, 0, ...temp); //Inserts the displayholdquip into the dialouge
    // s(girltalk + "I don't know... how much?");
    curtext = printChoicesList(curtext, [2,3,4,0]);
    //TODO you never pay it?
    sayText(curtext);
    // c("payfails", "$10.00");
    // c("payfails", "$20.00");
    // c("payokay", "$50.00");
    // c(locstack[0], "Continue...");
}

function payfails() {
    const curtext = needs["payfails"];
    // s(girltalk + "That's not going to be enough.");
    indepee(curtext);
}

function payokay(curtext) {
    curtext.push(girltalk + pickrandom(general["okayforyou"]));
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    sayText(curtext);
    // c(locstack[0], "Continue...");
}


//TOOD check correctness
function remindpayholdit() {
    let curtext = displayholdquip([]);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    sayText(curtext);
    // c(locstack[0], "Continue...");
}

//
//  Ask her to hold it in.
//
//TODO fix it that if you are at her place after you asked her and she doesn't have to go you always fail
function holdit() {
    let curtext = [];
    curtext.push(pickrandom(needs["askhold"]));
    gottagoflag = 0;
    waitcounter = 6;
    if ((bladder >= bladlose && attraction > holditlosethresh) ||
        (bladder >= blademer && attraction > holditemerthresh) ||
        (bladder >= bladneed && attraction > holditneedthresh)) {
        if (bladder >= blademer) {
            curtext.push(girltalk + pickrandom(needs["surpriseexcl"])); //TODO this shouldn't be allowed
            if (randomchoice(5))
                curtext = displaydrank(curtext);
            else
                curtext = displaywaited(curtext);
            curtext.push(needs["holdit"]["dialogue"][0]); //She's not sure, you have to convince her
            if (locstack[0] !== "gostore") curtext = displayneed(curtext);
            else curtext = displaygottavoc(curtext);
            curtext = convinceher(curtext);
        } else {
            curtext = displayholdquip(curtext);
            askholditcounter++;
            if (bladder >= bladlose) {
                if (locstack[0] === "gostore") {
                    //TODO maybe put in one thing to print all lines
                    curtext.push(needs["holdit"]["dialogue"][1]);
                    curtext.push(needs["holdit"]["dialogue"][2]);
                    curtext.push(needs["holdit"]["dialogue"][3]); //She's wetting herself over the phone
                    bladder = 0;
                    waitcounter = 0;
                    askholditcounter = 0;
                    attraction = 0;
                } else {
                    curtext = displayneed(curtext);
                }
            }
            curtext = callChoice(needs["choices"][0], curtext);
        }
    } else {
        if (locstack[0] === "gostore") {
            curtext.push(needs["holdit"]["dialogue"][4]);
            curtext.push(needs["holdit"]["dialogue"][5]);
            //She's not holding it while on the phone
            attraction -= 5;
            bladder = 0;
            curtext = callChoice(needs["choices"][0], curtext);
        } else {
            curtext.push(needs["holdit"]["dialogue"][6]);
            // she's not holding it for you
            attraction -= 5;
            curtext = indepee(curtext, true);
        }
    }
    sayText(curtext);
}

function allowpee() {
    gottagoflag = 0;
    askholditcounter = 0;
    let curtext = [];
    curtext.push(needs["allowpee"][0]);
    curtext.push(needs["allowpee"][1]);
    if (locstack[0] === "solobar" || locstack[0] === "fuckher6" || locstack[0] === "thehome" || locstack[0] === "thebedroom" || locstack[0] === "darkbar"
        || locstack[0] === "pickup" || locstack[0] === "darkclub" || locstack[0] === "darkbar") {
        curtext = callChoice(needs["choices"][1], curtext);
    } else {
        //TODO test
        s(girltalk + "Can you hold my purse for me?");
        curtext.push(needs["allowpee"][2]);
        attraction += 7;
        curtext = printChoicesList(curtext, [1,5], needs["choices"]);
        // c("holdpurse", "Sure, I'll take care of it!");
        // c("indepee", "I think you'd better take it with you.");
    }
    sayText(curtext);
}

function peephone() {
    let curtext = [];
    gottagoflag = 0;
    if (attraction > 30) {
        if (bladder > blademer && shyness < 75) {
            curtext = printLList(curtext,peelines["peephone"], 0);
            attraction += 10;
            flushdrank();
        } else {
            curtext = printLList(curtext,peelines["peephone"], 1);
        }
    } else {
        curtext = printLList(curtext,peelines["peephone"], 2);
        bladder = 0;
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

//TODO test
function holdpurse() {
    haveherpurse = 1;
    let curtext = [];
    curtext.push(needs["holdpurse"][0]);
    curtext.push(needs["holdpurse"][1]);
    // s(girltalk + "Great!");
    // s("She hands you her small, stylish purse and runs off to relieve herself.");
    curtext = printChoicesList(curtext, [6,7], needs["choices"]);
    // c("lookinsidepurse", "Look inside her purse.");
    // c("indepee", "Be a gentleman");
    sayText(curtext)
}

//TODO test
function lookinsidepurse() {
    let curtext = [];
    curtext.push(needs["holdpurse"][2]);
    // s("You open the top and see:");
    let tempstring = "A ";
    herpurse.forEach((item, index) => {
        if(index === 0)
            tempstring += item["desc"];
        else if (index === item.size - 1){
            tempstring += "and a" + item["desc"];
        } else {
            tempstring += "a" + item["desc"];
        }
    });
    // if (!herkeys)
    //     tempstring += "set of keys, a ";
    // if (!hercellphone)
    //     tempstring += "small cellphone, a ";
    // tempstring += "compact makeup kit and a comb.";
    // s(tempstring);
    curtext.push(tempstring);
    herpurse.forEach(item => {
        if ("funDesc" in item){
            curtext = c(["takeHerItem(item.key)", "take "+ item.funDesc] ,curtext);
        }
    });
    // if (!herkeys)
    //     c("takeherkeys", "Take her keys");
    // if (!hercellphone)
    //     c("takeherphone", "Take her cellphone");
    // c("indepee", "Close the purse");
    curtext = printChoicesList(curtext,[8], needs["choices"]);
    sayText(curtext);
}

//TODO test
//You steal the given item from her purse
function takeHerItem(item){
    let curtext = [];
    curtext.push(needs["holdpurse"][3].format(item.funDesc));
    curtext = printChoicesList(curtext, [9,1]);
    sayText(curtext);

}
//
// function takeherkeys() {
//     delete herpurse.keys;
//     objects.herKeys.owned++;
//     s("Thinking they might come in handy later, you pocket her keys.");
//     c("lookinsidepurse", "Examine her purse again");
//     c("indepee", "Continue...");
// }
//
// function takeherphone() {
//     hercellphone++;
//     s("Thinking it might come in handy later, you pocket her cellphone.");
//     c("lookinsidepurse", "Examine her purse again");
//     c("indepee", "Continue...");
// }

//TODO figureout duplicate continue
function peeshot() {
    //TODO test
    let curtext = [];
    if (attraction > 30) {
        if ((bladder > blademer && shyness < 60) ||
            (bladder >= bladlose - 25)) {
            gottagoflag = 0;
            if (peedshot < 1) {
                curtext.push(needs["peeshot"][0]);
                curtext.push(needs["peeshot"][1]);
                // s(girltalk + "You're a naughty boy, aren't you?");
                // s(girltalk + "But I'm going to wet my panties if I don't go.....");
            }
            peedshot = 1;
            curtext = displayneed(curtext);
            curtext.push(needs["peeshot"][2]);
            // s(girltalk + "God! I can't wait any longer!");
            // c("peeshot2", "Continue...");
            curtext = printChoicesList(curtext, [10], needs["choices"]);
        } else {
            gottagoflag = 0;
            curtext.push(needs["peeshot"][3]);
            // s(girltalk + "I think maybe not.  At least not yet.");
            curtext = printChoicesList(curtext, [0], needs["choices"]);
            // c(locstack[0], "Continue...");
        }
    } else if (locstack[0] !== "themakeout" && locstack[0] !== "driveout") {
        curtext.push(needs["peeshot"][4]);
        curtext.push(needs["peeshot"][5]);
        curtext.push(needs["peeshot"][6]);
        // s(girltalk + "Somehow, I don't think that's happening.");
        // s("She runs to the bathroom with your shot glass in hand.");
        // s("You are left to ponder your situation.");
        flushdrank();
        attraction -= 3;
        shotglass -= 1;
        curtext = printChoicesList(curtext, [0], needs["choices"]);
        // c(locstack[0], "Continue...");

    } else {
        curtext.push(needs["peeshot"][4]);
        // s(girltalk + "Somehow I don't see that happening.");
        curtext = printChoicesList(curtext, [0], needs["choices"]);
        // c(locstack[0], "Continue...");
    }
    sayText(curtext);
}

//TODO test
function peeshot2() {
    let curtext = [];
    if (pantycolor !== "none")
        curtext.push(appearance["peeshotquote"]);
    else
        curtext.push(appearance["peeshotquotebare"]);
    // if (pantycolor !== "none") s(peeshotquote);
    // else s(peeshotquotebare);
    curtext = itscomingout(curtext);
    curtext = printChoicesList(curtext, [11], needs["choices"]);
    // c("peeshot3", "Continue...");
    sayText(curtext);
}

//TODO test
function peeshot3() {
    let curtext = [];
    curtext.push(needs["peeshot"][7]);
    curtext.push(needs["peeshot"][8]);
    // s("The pee hisses out and the glass is filled in no time.  " + girlname + " bends over and jams her hand between her legs, gasping in the effort to stop the flow.");
    // s(girltalk + "Damn.  That's not much better.");
    attraction += 3;
    bladder -= 100;
    waitcounter = 4;
    sawherpee = 1;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    // c(locstack[0], "Continue...");
    sayText(curtext);
}

//TODO more variety? and implement for different locations
function ypeeshot() {
    s("YOU: I got a shot glass. Here hold this for a minute.");
    if (locstack[0] === "driveout")
        s("You give her the shot glass so you can open your fly with the hand that is not holding the steering wheel.");
    else
        s("You give her the shot glass so that you can use both hands to open your fly.");
    s("You quickly whip your dick out, not really caring that she can see it.");
    c("ypeeshot2", "Continue...");
}

function ypeeshot2() {
    s("You urgently reach your hand to her.");
    s("YOU: Give me the glass, it's coming out!");
    s(girlname + "quickly hands you the glass.");
    s("You push it in place before allowing your muscles to relax.");
    c("ypeeshot3", "Continue...");
}

function ypeeshot3() {
    if (locstack[0] === "driveout")
        s("The pee hisses out and the glass is filled in no time. You groan at the effort it takes to stop the flow, you can't grasp yourself as both your hand are occupied.");
    else
        s("The pee hisses out and the glass is filled in no time. You grab your dick as you force to flow to stop. It is hard but you manage with a groan.");
    s("YOU: Damn. That's not much better.");
    attraction += 10;
    yourbladder -= 100;
    c(locstack[0], "Continue...");
}

//TODO search privacy in club/bar?
//TODO don't take it to the bathroom with her in the car
function peevase() {
    if (attraction > 30) {
        if (bladder > blademer) {
            gottagoflag = 0;
            if (peedvase < 0) {
                s(girltalk + "That's pretty kinky!");
                s(girltalk + "But I'm about to wet my panties!");
            }
            displayneed();
            peedvase = 1;
            s(girltalk + "I just can't hold it anymore.  Give it here.");
            s("She grabs the vase, wrenching it from your hands and nearly dropping it.");
            c("peevase2", "Continue...");
        } else {
            displaygottavoc();
            gottagoflag = 0;
            s(girltalk + "But a vase?  I can't! At least not yet.");
            displayholdquip();
            c(locstack[0], "Continue...");
        }
    } else {
        s(girltalk + "Somehow, I don't think that's happening.");
        s("She runs to the bathroom with your vase in hand.");
        s("You are left to ponder your situation.");
        flushdrank();
        attraction -= 3;
        vase -= 1;
        c(locstack[0], "Continue...");
    }
}

function peevase2() {
    if (pantycolor !== "none") s(peeskirtquote);
    else s(peeskirtquotebare);
    itscomingout();
    c("peevase3", "Continue...");
}

function peevase3() {
    s("The pee hisses out for nearly a minute vase is filled almost to the top.");
    s(girlname + " puts herself back together, looking embarrassed.");
    s(girltalk + embarquote[randcounter]);
    incrandom();
    attraction += 3;
    flushdrank();
    sawherpee = 1;
    c(locstack[0], "Continue...");
}

//TODO locations that are not the car
function ypeevase() {
    s("YOU: I got a vase. Here hold this for a minute.");
    s("You give her the vase so you can open your fly with the hand that is not holding the steering wheel.");
    s("You quickly whip your dick out, not really caring that she can see it.");
    c("ypeevase2", "Continue...");
}

function ypeevase2() {
    s("You urgently reach your hand to her.");
    s("YOU: Give me the vase, it's coming out!");
    s(girlname + " quickly hands you the vase.");
    s("You push it in place before allowing your muscles to relax.");
    c("ypeevase3", "Continue...");
}

function ypeevase3() {
    s("The pee hisses out for nearly a minute and the vase is almost filled to the to the top");
    s("YOU: Oh! That's much better.");
    attraction += 10;
    flushyourdrank();
    c(locstack[0], "Continue...");
}

//TODO she can't run away with the towels while in the car
//TODO check for having peed towels/vase or shot
function peetowels() {
    if (attraction > 30) {
        if (bladder > blademer) {
            gottagoflag = 0;
            if (peedvase < 0) {
                s(girltalk + "That's kind of gross!");
                s(girltalk + "But I'm about to wet my panties!");
            }
            displayneed();
            peedtowels = 1;
            wetherpanties = 1;
            s(girltalk + "I just can't hold it anymore.  Give it here.");
            s("She takes the roll of paper towels in both hands and freezes for a moment, thinking.");
            c("peetowels2", "Continue...");
        } else {
            //TODO unrreachable because you onl get here when your bladder is beyond emer
            displaygottavoc();
            gottagoflag = 0;
            s(girltalk + "But in just a roll of towels?  No way! At least not yet.");
            displayholdquip();
            c(locstack[0], "Continue...");
        }
    } else {
        s(girltalk + "Somehow, I don't think that's happening.");
        s("She runs off with your roll of paper towels in hand.");
        s("You are left to ponder your situation.");
        flushdrank();
        attraction -= 3;
        if (attraction < 0) attraction = 0;
        ptowels -= 1;
        c(locstack[0], "Continue...");
    }

}

function peetowels2() {
    if (pantycolor !== "none") s(girlname + peetowelquote);
    else s(girlname + peetowelquotebare);
    itscomingout();
    c("peetowels3", "Continue...");
}

function peetowels3() {
    s("The pee hisses out and is mostly absorbed by the paper towels, just a small trickle running down her left leg.");
    s("She carefully sets to sopping wet roll of towels in a corner.");
    s(girltalk + embarquote[randcounter]);
    incrandom();
    attraction += 3;
    flushdrank();
    ptowels -= 1;
    sawherpee = 1;
    c(locstack[0], "Continue...");
}

function peeintub() {
    if (bladder > blademer) {
        displaygottavoc();
        s(girltalk + "Sure you're okay with it?");
        displayneed();
        c("peeintub2", "Continue...");
    } else {
        s(girltalk + "I'll just wait, thank you very much.");
        c(locstack[0], "Continue...");
    }
}

function peeintub2() {
    s(girlgasp + "Ungh!  I can't hold it.");
    s("You nonchalantly move closer and slip your hand under her butt.  The strong stream of pee flows out between your fingers for nearly a minute, and you can detect the barest scent of urine rising from the hot water.  It feels strangely cool in the warm water of the tub.");
    flushdrank();
    s("The stream slows and finishes, and " + girlname + " lets out a sigh of relief.");
    s(girltalk + "That feels <i>so</i> much better.");
    c(locstack[0], "Continue...");
}

//TODO better scene
function ypeeintub() {
    s("You relax your muscles while acting as if nothing happens.");
    s("She doesn't notice that you're peeing right next to her.");
    s("You can't help but get a bit aroused.");
    flushyourdrank();
    c(locstack[0], "Continue");
}

//TODO do something if you peed outside already(mention to follow your lead)
//TODO she pees outside if she's not bursting
//TODO fix the duplicate code
function peeoutside() {
    if (attraction > 30) {
        if (bladder > blademer) {
            if (peedoutside)
                s(girltalk + "I'm so embarrassed to have to pee outside again.");
            else
                s(girltalk + "That's pretty daring.  I've never gone outside before.");
            s(girltalk + "But I'm about to wet my panties if I don't go somewhere!");
            s(girltalk + "I can't hold it!  What am I gonna do???");
            displayneed();
            if (locstack[0] === "themakeout") c("peeoutside2", "Continue...");
            else c("peeoutside2b", "Continue...");

        } else {
            displaygottavoc();
            s(girltalk + "But I can't just go outside!");
            s(girltalk + "At least not yet.");
            displayholdquip();
            gottagoflag = 0;
            c(locstack[0], "Continue...");
        }
    } else {
        //TODO this code is almost impossible to reach? since you need at least 40 attraction to get outside
        s(girltalk + "Pee outside?  No way am I exposing my privates to the whole world!");
        attraction -= 3;
        if (attraction < 0) attraction = 0;
        c(locstack[0], "Continue...");
    }

}

// In the car
function peeoutside2() {
    if (pantycolor !== "none") s(peeoutsidequote);
    else s(peeoutsidequotebare);
    s(girltalk + "Are you sure it's safe?");
    c("peeoutside3", "Continue...");
}

// Not in the car
function peeoutside2b() {
    if (pantycolor !== "none") s(peeoutsidebquote);
    else s(peeoutsidebquotebare);
    s(girltalk + "Are you sure it's safe?");
    if (locstack[0] === "thebeach") c("peeoutside3c", "Continue...");
    else c("peeoutside3b", "Continue...");
}

// She was in the car
function peeoutside3() {
    itscomingout();
    s("You try to be nonchalant as you stare, and she doesn't seem to notice.  The pee hisses out from between her smooth thighs for nearly a minute, and runs in a stream under the car.  You can smell her scent as steam rises from the hot river.");
    //TODO attraction goes down?
    attraction -= 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    c(locstack[0], "Continue...");
}

//  Again, she's not in the car
function peeoutside3b() {
    s(girltalk + "Oh!  Don't look!  It's coming!");
    s("You nonchalantly move closer and watch as the pee hisses out from between her delicate pussy lips for nearly a minute, and runs in a stream along the ground.  You can smell her scent as steam rises from the hot river and she sighs in relief.");
    s(girltalk + "That's so much better.");
    s("She seems aroused as she gets back up.");
    //TODO attraction goes down?
    attraction -= 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    c(locstack[0], "Continue...");
}

//  Pee on the beach
function peeoutside3c() {
    itscomingout();
    s("You nonchalantly move closer and watch as the pee hisses out from between her delicate pussy lips for nearly a minute, soaking quickly into the sand and turning it dark.  You can smell her scent and hear the hiss of the urine hitting the sand and she sighs orgasimcally.");
    s(girltalk + "That's <b>so</b> much better.  I was dying!");
    s("She seems aroused as she gets back up.");
    //TODO attraction goes down?
    attraction -= 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    c(locstack[0], "Continue...");
}

//TODO a Can I watch option
function ypeeoutside() {
    if (yourbladder < yourblademer)
        s("<b>YOU:</b> Hang on I need a pee.");
    else {
        s("<b>YOU;</b> Hold up I really need to pee!");
        s("You are messaging your crotch to help you hold it.");
    }
    if (locstack[0] === "themakeout") c("ypeeoutside2", "Continue...");
    else c("ypeeoutside2b", "Continue...");
}

//In the car
function ypeeoutside2() {
    s("You step out of the car and lower your zipper. You check if no one is around before you pull your penis out.");
    c("ypeeoutside3", "Continue...");
}

function ypeeoutside2b() {
    s("You lower your zipper and check if no one is around before you pull your penis out");
    if (locstack[0] === "thebeach") c("ypeeoutside3c", "Continue...");
    else c("ypeeoutside3b", "Continue...");
}

//TODO determine if she would watch and arousal
function ypeeoutside3() {
    s("You subtly turn towards the car so she could watch if she wanted to. The pee hisses out of your tip and runs in a stream under the car.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}

function ypeeoutside3b() {
    s("You only turn away from her slightly, allowing her to watch if she wants to. The pee hisses out from of your tip and runs in a stream along the ground.");
    s("As you zip back up you can't help but feel aroused.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}

function ypeeoutside3c() {
    s("You only turn away from her slightly, allowing her to watch if she wants to. The pee hisses out from of your tip, it soaks quickly into the sand turning it dark.");
    s("As you zip back up you can't help but feel aroused.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}


//  DisplayHoldQuip function prints a quasi-random quip from "+girlname+"
//  saying she's going to try to hold it for you.
function displayholdquip(curtext) {
    //TODO is the noneed ever used?
    //TODO test
    let need = "noneed" //How full her bladder is influences what she says
    if (bladder >= bladlose)
        need = "lose";
        // s(girltalk + quiplose[randcounter]);
    else if (bladder >= blademer)
        need = "emer"
        // s(girltalk + quipemer[randcounter]);
    else if (bladder >= bladneed)
        need = "need"
        // s(girltalk + quipneed[randcounter]);
    else if (bladder >= bladurge)
        need = "urge";
        // s(girltalk + quipurge[randcounter]);
    curtext.push(girltalk + pickrandom(needs["holdquip"][need]));
    return curtext;
}




// If she begs you, you end up not leaving the venue.
function begtoilet(curtext) {
    //TODO mention having peed outside before? / autonomously choose that
    //TODO test
    let selection = [0];
    // s(girlname + " looks intently into your eyes:");
    if (peedvase)
        selection.push(1);
        // s("I've absolutely got to go.  I <i>need</i> your vase again. <b>NOW!</b>");
    else if (peedshot)
        selection.push(2);
        // s("I'm gonna pee myself!  I <i>need</i> that shot glass again. <b>NOW!</b>");
    else if (peedtowels)
        selection.push(3);
        // s("I just <b>can't</b> hold it - you don't have any more paper towels, do you?");
    else
        selection.push(4);
        // s("I'm <i>begging</i> you - find me somewhere to pee.  <b>NOW!</b>");
    printListSelection(curtext, needs["begtoilet"]["dialogue"], selection);
    selection = [];
    if (shotglass > 0)
        selection.push(0);
        // c("peeshot", "Offer her the shot glass.");
    if (ptowels > 0)
        selection.push(1);
        // c("peetowels", "Offer her the roll of paper towels.");
    if (vase > 0)
        selection.push(2);
        // c("peevase", "Offer her the vase.");
    if (locstack[0] === "themakeout")
        selection.push(3);
        // c("peeoutside", "Suggest she pee outside.");
    selection.push(4);
    return printChoicesList(curtext, selection, needs["begtoilet"]["choices"]);
    // c(locstack[0], "Stand by helplessly.");
}


//TODO add extra options like pee outside
//TODO make responses more realisitc
//TODO don't take her purse in certian situations
function askpee() {
    s("<b>YOU:</b> Do you need to pee?");

    if (shyness > 60) s(girlname + " blushes.");
    else s(girltalk + "...");

    if (bladder > bladneed && bladder < blademer)
        s("She seems to be considering the matter...");

    if (((shyness < 50 && bladder > bladneed) ||
        bladder > blademer) &&
        (locstack[0] !== "drinkinggame" && !externalflirt)) {
        displaygottavoc();
        interpbladder();
        showneed();
        c("pstory", "Ask her if she's ever wet herself.");
        preventpee();
    } else {
        s(girltalk + denyquotes[randcounter]);
        displayneed();
        interpbladder();
        c(locstack[0], "Continue...");
    }
}

function askcanhold() {
    s("<b>YOU:</b> How are you doing?  Can you still hold it?");
    if (bladder >= bladlose) s(girltalk + holdlosequotes[randcounter]);
    else if (bladder >= blademer) s(girltalk + holdemerquotes[randcounter]);
    else if (bladder >= bladneed) s(girltalk + holdneedquotes[randcounter]);
    else if (bladder >= bladurge) s(girltalk + holdurgequotes[randcounter]);
    else s(girltalk + holdokayquotes[randcounter]);
    incrandom();
    interpbladder();
    c(locstack[0], "Continue...");
}

function pstory() {
    s("<b>You ask her:</b> have you ever waited too long?");
    displayneed();
    s(girltalk + peestory[pstorycounter]);
    oldpstorycounter = pstorycounter;
    pstorycounter++;
    if (pstorycounter > maxpstory) pstorycounter = 0;
    c("pstory2", "Ask her what happened.");
    c(locstack[0], "Continue...");
}

function pstory2() {
    s("<b>You ask her:</b> so... did you make it?");
    s(girlname + " blushes and looks down at her feet.");
    s(girltalk + peestory2[oldpstorycounter]);
    displayneed();
    c(locstack[0], "Continue...");
}

//TODO make her less demanding
function preventpee(curtext) {

    // If she's not in obviously dire straits, your
    // admonitions, whatever they are, will effectly
    // have answered her request to pee.  So the flag
    // will be cleared.

    let choices = [] // This keeps track of the options you can choose from so they can be printed at the end

    if (bladder < bladlose - 50)
        gottagoflag = 0;

    if (locstack[0] === "solobar") {
        choices.push(0); //Suggest she has a drink
        if (askholditcounter)
            choices.push(1); //Remind that you are paying her
        else
            choices.push(2); //Pay her
    } else
        choices.push(3); //Hold it

    if (locstack[0] === "dodance")
        choices.push(4); //Pee together
    if (locstack[0] === "darkbar" || locstack[0] === "darkmovie" || locstack[0] === "darkclub")
        choices.push(5); //Watch
    if (locstack[0] === "darkmovie")
        choices.push(6); //No restroom
    if (locstack[0] === "darkbar")
        choices.push(7); //pdrinkinggame
    if (locstack[0] === "darkclub")
        choices.push(8); //pphotegame
    if (locstack[0] === "driveout") {
        choices.push(9); //nextstop
    } else if (locstack[0] !== "solobar") {
        choices.push(10); //allowpee
    }
    if (locstack[0] !== "solobar")
        choices.push(11); //indepee

    return printChoicesList(curtext, choices, needs["preventpee"]);
}


//TODO chance with triggering each other into wetting when desperate
//TODO it's impossible to spurt more than once while it shouldn't be
//Here's actually where we decide if she wet or just spurted
function wetherself() {
    s(wetquote[randcounter]);
    incrandom();
    if (randomchoice(spurtthresh) && locstack[0] !== "thehottub" && !shespurted) {
        spurtedherself();
    } else {
        spurtthresh = 5;
        if (locstack[0] === "driveout")
            c("wetherself2c", "Continue ...");
        else if (locstack[0] === "themakeout")
            c("wetherself2m", "Continue ...");
        else if (locstack[0] === "thehottub")
            c("wetherself2t", "Continue ...");
        else
            c("wetherself2", "Continue ...");
    }
}

function wetherself2() {

    s("You hear the loud hissing as her bladder uncontrollably empties itself.");
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    s(girltalk + embarquote[randcounter]);
    incrandom();
    if (locstack[0] === "solobar")
        c("wetherself3bg", "Continue ...");
    else
        c("wetherself3", "Continue ...");

}

// She's in the makeout spot
function wetherself2m() {
    s(girlname + " suddenly and frantically looks around.  She fumbles with her seat belt, then the wrenches open the door and jumps out of the car.");
    wetherself2();
}

// She's in the hottub
function wetherself2t() {
    s(girlname + " suddenly stiffens and whispers: Oh no!");
    flushdrank();
    s("She sighs and slumps back in the tub, lost in her own little world for a minute or so.");
    s("There's complete silence aside from her heavy breathing and some crickets in the distance.");
    c("wetherself3t", "Continue ...");
}

// She's in the car
function wetherself2c() {
    s(girlname + " suddenly and frantically looks around, pulling open the glove box and feeling under her chair.");
    s(girltalk + " Oh No!  Your seat!");
    s("She arches her back, lifting her ass off the chair and straining against her seatbelt.");
    s("You hear the loud hissing as her bladder uncontrollably empties itself.");
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    wetthecar = 1;
    c("wetherself3c", "Continue ...");
}

function wetherself3c() {
    s(girltalk + "I'm <u>so</u> sorry about your car...");
    s("She settles unhappily into the squishy wet seat.");
    shyness += 20;
    if (shyness > 100) shyness = 100;
    attraction -= 20;
    c(locstack[0], "Continue ...");
}

function wetherself3() {
    if (pantycolor !== "none" && shyness < 70) {
        s(wetherselfquote);
        if (attraction > 40) {
            s(girlname + " hands you the wet panties, soaked with her fragrant urine.");
            s(girltalk + "Is there someplace you can put these?");
            wetpanties += 1;
        }
        pantycolor = "none";
    } else if (pantycolor === "none")
        s(girltalk + "Good thing I wasn't wearing panties, I guess.");
    s(dryquote[randcounter]);
    incrandom();
    if (ptowels > 0)
        c("giveptowels", "Offer her paper towels");
    if (panties > 0)
        c("givedrypanties", "Offer her a clean pair of panties");
    shyness += 15;
    if (shyness > 100) shyness = 100;
    //TODO maybe not during hold contest
    c("scoldher", "Scold her for wetting herself");
    c(locstack[0], "Continue ...");
}

// In the tub
function wetherself3t() {
    s(girltalk + "I'm <u>so</u> sorry ... I just couldn't hold it.");
    s("The faint scent of her urine rises from the water.");
    s(girltalk + "I peed in the tub.");
    shyness += 20;
    if (shyness > 100) shyness = 100;
    attraction -= 20;
    c(locstack[0], "Continue ...");
}

//TODO this should probably be changed
// Bar Girl wets herself
function wetherself3bg() {
    s(girltalk + "I'm <u>so</u> sorry ... I just couldn't hold it.");
    c(locstack[0], "Continue ...");
}


function spurtedherself() {
    bladder -= 50;
    spurtthresh -= 0.1 * spurtthresh;
    shespurted = 1;
    s(spurtquote[randcounter]);
    incrandom();
    displayneed();
    c("askspurted", "Ask her if she peed herself.");
    c(locstack[0], "Continue ...");
}

function askspurted() {
    s("<b>YOU:</b> Did you just pee yourself?");
    s(spurtquote[randcounter]);
    incrandom();
    s(girltalk + spurtdenyquote[randcounter]);
    incrandom();
    displayneed();
    if (locstack[0] !== "thehottub")
        c("checkspurted", "Check if she's wet.");
    c(locstack[0], "Continue ...");
}

function checkspurted() {
    s("<b>YOU:</b> I'm not sure I believe you.");

    if (attraction < 75) {
        s("You run your hand up her leg, but she pushes you away:");
        s(girltalk + "Hey! Keep your hands to yourself!");
        displayneed();
        attraction -= 10;
        shyness += 10;
    } else {
        if (pantycolor === "none") {
            s("You run your hand up her thigh until you feel the lips of her bare pussy.");
            s("There are drops of some liquid up there.");
        } else {
            s("You run your hand up her thigh until you feel the thin fabric of her panties.");
            s("They aren't sopping wet, but the gusset has a definite wet spot.");
        }
        if (bladder > blademer)
            s(feelthigh[randcounter]);
        incrandom();
        c("smellspurted", "Smell your fingers.");
    }
    c(locstack[0], "Continue ...");
}

function smellspurted() {
    s("You sniff your damp fingers.");
    s(smellpee[randcounter]);
    incrandom();
    c(locstack[0], "Continue ...");
}

function givedrypanties() {
    s(girltalk + "Where did you get those?");
    s("She slips into the clean panties with a smile.");
    panties -= 1;
    pantycolor = "sexy";
    if (wetlegs < 1) attraction += 5;
    if (wetlegs > 0) {
        s("Her still dripping pussy dampens the crotch of the new panties.");
    }
    wetlegs = 0;
    c(locstack[0], "Continue ... ");
}

function giveptowels() {
    s(girltalk + "Thanks!");
    s("She wipes the pee from her legs and pussy.");
    attraction += 5;
    ptowels -= 1;
    wetlegs = 0;
    if (panties > 0)
        c("givedrypanties", "Offer her a clean pair of panties");
    c(locstack[0], "Continue ... ");
}

function scoldher() {
    s("<b>YOU:</b> You're such a baby, wetting yourself like that!");
    s("She pouts and turns away from you.");
    s("Her face turns bright red and she begins to cry.");
    attraction -= 20;
    c("comforther", "Apologize and comfort her");
    c("callherataxi", "Call her a cab");
}

//
//  It's coming out and she can't stop it
//  used to help describe various pees.
//
function itscomingout(curtext) {
    //TODO test
    if (!sawherpee)
        curtext.push(girltalk + pickrandom(needs["outpeelook"]));
        // s(girltalk + outpeelook[randcounter]);
    else
        curtext.push(girltalk + pickrandom(needs["outpeehide"]));
        // s(girltalk + outpeehide[randcounter]);
    curtext.push(girlgasp + pickrandom(needs["outpeectrl"]));
    curtext.push(girltalk + pickrandom(needs["outpeecome"]));
    // s(girlgasp + outpeectrl[randcounter]);
    // s(girltalk + outpeecome[randcounter]);
    return curtext;
}

//Here's where we decide if you wet yourself or if you just spurted.
//TODO more original quotes (most are now stolen from her)
//TODO fix timings
function wetyourself() {
    s(ywetquote[randcounter]);
    incrandom();
    if (randomchoice(yspurtthresh) && locstack[0] !== "thehottub") {
        spurtedyourself();
    } else {
        yspurtthresh = 3;
        if (locstack[0] === "driveout")
            c("wetyourself2c", "Continue ...");
        else if (locstack[0] === "themakeout")
            c("wetyourself2m", "Continue ...");
        else if (locstack[0] === "thehottub")
            c("wetyourself2t", "Continue ...");
        else
            c("wetyourself2", "Continue ...");
    }
}

//TODO register you wet your pants
function wetyourself2() {
    s("You are helpless as your bladder uncontrollably empties itself.");
    s("Surely she can hear the hissing.");
    flushyourdrank();
    if (locstack[0] === "solobar")
        c("wetyourself3bg", "Continue ...");
    else {
        c(locstack[0], "Continue ...");
    }
}

//You're in the make out spot
function wetyourself2m() {
    s("You frantically look around, wanting to safe your car seat. You fumble with the seat belt, then wrench the door open and jump out of the car.");
    wetyourself2();
}

//You're in the hottub
function wetyourself2t() {
    s("You stiffen and let out a shaky breath.");
    flushyourdrank();
    s("You sigh and slump back in the tub, letting the relieve course through you.");
    s("When you are finally empty you open your eyes to meet hers");
    c("wetyourself3t", "Continue ...");
}

//You're in the car
//TODO register you wet the car
function wetyourself2c() {
    s("There is nothing you can do, your hands tighten on the steering wheel.");
    s("YOU: Dammit!");
    s("You are helpless as your bladder uncontrollably empties itself.");
    s("Surely she can hear the hissing.");
    flushyourdrank();
    c("wetyourself3c", "Continue ...");
}

function wetyourself3c() {
    s("YOU: I'm sorry about that. I really couldn't wait.");
    s("You uncomfortably shift in the squishy wet seat.");
    c(locstack[0], "Continue ...");
}

//TODO fill later and connect with the right function (wetyourself2)
function wetyourself3() {

}

//In the tub
function wetyourself3t() {
    s("YOU: I'm <u>so</u> sorry... I just couldn't hold it.");
    s("The faint scent of your urine rises from the water.");
    s("YOU: I peed in the tub.");
    c(locstack[0], "Continue ...");
}

//TODO determine if this is neccesarry for you
function wetyourself3bg() {
    s("YOU: I'm <u>so</u> sorry... I just couldn't hold it.");
    c(locstack[0], "Continue ...");
}

//TODO more text options and her reponse
function spurtedyourself() {
    yourbladder -= 50;
    yspurtthresh -= 0.1 * yspurtthresh;
    s("You manage to get your control back but you still let out a little bit.");
    c(locstack[0], "Continue ...");
}


