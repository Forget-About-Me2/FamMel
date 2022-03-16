//This file contains all functions related to peeing
//TODO organize this better

//Her bladder variables
let customurge = 250;
let minurge = 187; //Bladder never decays below this

let minperc = 75; //Percentage of the minimumvalue of the bladder

let bladurge = 250; // Level where she feels the first urge
let bladneed = bladurge * 2; // Level where she continuously needs to go
let blademer = bladurge * 3; // Level where it becomes an emergency
let bladlose = bladurge * 3 + 150; // Level where she loses control
let bladcumlose = bladurge * 4; // Level where she spurts as she cums
let bladsexlose = bladurge * 5; // Level where she can't control it during sex

let maxtummy = 250; // Drink capacity of stomach
let maxbeer = 500; // Beer capacity of stomach

let bladDec = 1;
let bladDespDec = 1;
let seal = 1;
let beerdecCounter = 0; //How long has it been since her bladder capacity has been decayed by beer
let ybeerdecCounter = 0; //How long has it been since your bladder capacity has been decayed by beer

//  So she doesn't seem unfamiliar with the concept after the first time.
let peedtowels = 0; // has she peed in your paper towels
let peedvase = 0; // has she peed in your vase
let peedshot = 0; // has she peed in the shot glass
let peedoutside = 0; // has she peed outside

//  The following are used by her to complain about how long she's
// been waiting and how much she's drunk.
let lastpeetime = 0;  // When did she last go?
let timeheld = 0; // for stats

let drankbeer = 0; // has she drunk beer?  Changes capacities and rates.

// Flags for drinking game.
let notdesperate = 0; //neither you or her are desperate after drinking game.
let notydesperate = 0; //You aren't desperate but she is after drinking game.
let nothdesperate = 0; //She isn't desperate but you are after drinking game

//  Randomness thresholds 1-10.
//  1 corresponds to 10% likelihood.
//  10 corresponds to 100% likelihood.
const rrlockedthresh = 7; // Likelihood of bar restroom locked ( occupied )
const rrlinethresh = 7; // Likelihood of line for restroom in club
const phoneholdthresh = 7; // Likelihood of her holding it for you on the phone
let spurtthresh = 5; // Likelihood of her spurting rather than wetting
let yspurtthresh = 3; // Likelihood of you spurting rather than wetting
let bribeaskthresh = 7; //Likelihood she'll hold it if you ask her when desperate
let bribeAskBase = 7; //The base likelihood that the asks works, this is used to reset the askthresh when she pees

let tumavg = tummy; // Average blood water level
const tumdecay = 6; // Number of calculation cycles to average bladder filling


//  Attraction thresholds
const ptogetherthreshold = 100; // She'll take you with her to the bathroom.
const pnorestroomthreshold = 110; // She'll pee outside of the restroom.
const pwatchthreshold = 90; // You can watch her pee in a closed place.
const drinkinggamethreshold = 90; // She'll play your silly drinking game.
const photoGameThresholds = {
  snapshots: 90, // She'll play your silly photo game
  costume: 100, // She'll play your silly photo game in costume
  nudes: 110  // She'll play your silly photo game nude
};
const hottubthresh = 90; //  She'll strip and go into the hot tub
const holditneedthresh = 30; // She'll hold it for need
const holditemerthresh = 60; // She'll hold it for emergency
const holditlosethresh = 90; // She'll try to hold it for lose
const gomakeoutthresh = 40; // She'll go to the makeout spot

let rrlockedflag = 0; // Restroom was locked last time she went
let shespurted = 0; // She only spurted
let brokeice = 0; // She's previously brought up that she needs to pee
let sawherpee = 0; // You've seen her pee

let wetlegs = 0; // her legs are wet
let wetherpanties = 0; // did she ever wet herself?

let gottagoflag = 0; // has she just asked to use the restroom
let showedneed = 0; // has she just visually displayed her need

let askholditcounter = 0; // How many times have you asked her to hold it.
let waitcounter = 0; // how long ago did she ask to pee?
                     //Reset positive when you ask her.

let nowpeeing = 0; // She is currently peeing
let ynowpeeing = 0; // You're currently peeing

//Initializes the bladder values for the girl
function initUrge(urge){
    minurge = urge * minperc/100;
    updateurge(urge);
}

// noinspection DuplicatedCode
function updateurge(newurge) {
    if (newurge < minurge) newurge = minurge;
    newurge = Math.round(newurge);
    bladurge = newurge;
    bladneed = newurge * 2; // Level where she continuously needs to go
    blademer = newurge * 3; // Level where it becomes an emergency
    bladlose = newurge * 3 + 150; // Level where she loses control
    bladcumlose = newurge * 4; // Level where she spurts as she cums
    bladsexlose = newurge * 5; // Level where she can't control it during sex
}

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
function flushdrank() {

    //  Derate bladder capacity if she loses it...
    if (bladDec) {
        if (bladder >= bladlose) updateurge(bladurge * 9 / 10);
        else if (bladder >= blademer && bladDespDec) updateurge(bladurge * 9.5 / 10);
        //bladder decays based on breaking the seal can only happen once an hour
        else if (seal && drankbeer > 15 && beerdecCounter > 30) {
            updateurge(bladurge * 9.5 / 10);
            beerdecCounter = 0;
        }
    }

    Object.keys(objects).forEach(item => {
        if (item.hasOwnProperty("shedrank"))
            item.shedrank = 0;
    });
    bladder = 0;
    askholditcounter = 0;
    waitcounter = 0;
    gottagoflag = 0;
    lastpeetime = thetime;
    rrlockedflag = 0;
    shespurted = 0;
    nowpeeing = 1;
    bribeaskthresh = bribeAskBase;
}

// Showneed calculates how she's going to indicate
// her current level of need ( if at all ) based on her situation
function showneed(curtext=[]) {

    // Clear the gottagoflag.  It will be set by displaygottavoc().
    gottagoflag = 0;

    //  How this should work:
    //  Outer IFs determine LOCATION/SCENARIO.
    //  Inner IFs determine pee request parameters
    //  Upper IFs are emergencies

    // If she's within 2 turns of wetting and not too shy, she will vocalize
    // no matter what.
    let tuminc = calcTuminc(); //Gets the current tuminc, used to calculate if she's within the 2 turns
    //TODO use this calculation globally, instead of a fixed constant
    if (bladder >= (bladlose - 2 * tuminc) && shyness < 90) {
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
            waitcounter = Math.max(Math.round(bladlose/150), 6);
            curtext = displaygottavoc(curtext);
            // Shyness < 60 is enough to ask if she's merely needing to pee bad
        } else if (shyness < 60 && bladder > bladneed) {
            waitcounter = Math.max(Math.round(bladlose/90), 9);
            curtext = displaygottavoc(curtext);
            // Shyness < 40 and she's letting you know at 1st urge.
        } else if (shyness < 40 && bladder > bladurge) {
            waitcounter = Math.max(Math.round(bladlose/75), 12);
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
//TODO this probably should only be used by showneed
function displaygottavoc(curtext, index) {
    let textchoice = [];
    if (askholditcounter > 0 && waitcounter < 3 && bladder > bladurge && randomchoice(3)) {
        textchoice.push(pickrandom(needs["wantHold"]).formatVars());
    }

    if (bladder >= bladneed && !brokeice) {
        textchoice = printList(curtext, needs["appolNeed"]);
    }

    if (locstack[0] === "driveout") {
        if (bladder >= bladlose - 10) {
            textchoice.push(pickrandom(needs["carLose"]).formatVars());
        } else if (bladder >= blademer) {
            textchoice.push(pickrandom(needs["carEmer"]).formatVars());
        } else if (bladder >= bladneed) {
            textchoice.push(pickrandom(needs["carNeed"]).formatVars());
        } else if (bladder >= bladurge) {
            textchoice.push(pickrandom(needs["carUrge"]).formatVars());
        }
    } else {
        if (bladder >= bladlose - 10) {
            textchoice.push(pickrandom(needs["loseQuote"]).formatVars());
        } else if (bladder >= blademer) {
            textchoice.push(pickrandom(needs["emerQuote"]).formatVars());
        } else if (bladder >= bladneed) {
            textchoice.push(pickrandom(needs["needQuote"]).formatVars());
        } else if (bladder >= bladurge) {
            textchoice.push(pickrandom(needs["urgeQuote"]).formatVars());
        }
    }
    if (bladder >= bladneed) gottagoflag = 1;
    if (bladder >= bladurge) brokeice = 1;
    if(index){
        if (textchoice.length === 1){
            curtext.splice(index, 0, textchoice[0]);
        } else {
            textchoice.forEach(text => {curtext.splice(index, 0, text); index++});
        }
    } else
        curtext = printList(curtext, textchoice);
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
    else if (bladder > bladneed) curtext.push(pickrandom(needs["interpneed"]));
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
    } else if (locstack[0] === "theMakeOut" ||
        locstack[0] === "theHotTub" ||
        locstack[0] === "driveout" ||
        locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "theWalk" || locstack[0] === "theYard" || locstack[0] === "theBeach") {
        curtext.push(peelines["noneavailable"][0]);
    } else
        curtext = printList(curtext, peelines["remaining"]);
    if ((locstack[0] === "theBar" && randomchoice(rrlockedthresh) ) ||
        ((locstack[0] === "theClub" || locstack[0] === "doDance") && randomchoice(rrlinethresh)) ||
        (locstack[0] === "theTheatre" && randomchoice(rrMovieLineThresh) || locstack[0] === "domovie" && randomchoice(rrMovieLineThresh))){
        curtext = bathroomlocked(curtext);
    } else if (locstack[0] === "theMakeOut") {
        curtext.push(peelines["noneavailable"][1]);
        curtext = displayneed(curtext);
    } else if (locstack[0] === "driveout") {
        curtext.push(peelines["noneavailable"][2]);
        curtext = displayneed(curtext);
    } else if (locstack[0] === "theWalk" || locstack[0] === "theYard" || locstack[0] === "theBeach" || locstack[0] === "theHotTub") {
        curtext.push(peelines["noneavailable"][3]);
        curtext = displayneed(curtext);
        curtext = interpbladder(curtext);
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" ||
        locstack[0] === "fuckher6") {
        curtext.push(peelines["thehome"][1]);
        flushdrank();
    } else if (locstack[0] === "pickup") {
        curtext.push(peelines["thehome"][2]);
        flushdrank();
    } else {
        if (bladder > bladlose - 25)
            curtext.push(pickrandom(appearance["clothes"][heroutfit]["peeprivate"]));
        else
            curtext.push(pickrandom(appearance["clothes"][heroutfit]["peeprivate2"]));
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

//  Displayneed function prints a relatively random
//  indication of her level of pee urgency.
function displayneed(curtext) {
    showedneed = 1;
    if (locstack[0] === "themakeout" || locstack[0] === "driveout" ||
        locstack[0] === "drivearound" || locstack[0] === "domovie" ||
        locstack[0] === "thebed" || fuckingnow > 0){
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

//TODO add extra options like pee outside
//TODO make responses more realisitc
//TODO don't take her purse in certian situations
function askpee() {
    let curtext = [needs["askpee"][0]];
    if (shyness > 60) curtext.push(needs["askpee"][1]);
    else curtext.push(needs["askpee"][2]);
    if (bladder > bladneed && bladder < blademer)
        curtext.push(needs["askpee"][3]);
    if (((shyness < 50 && bladder > bladneed) ||
        bladder > blademer) &&
        (locstack[0] !== "drinkinggame" && !externalflirt)) {
        curtext = displaygottavoc(curtext);
        curtext = interpbladder(curtext);
        curtext = showneed(curtext);
        curtext = printChoicesList(curtext, [22], needs["choices"]);
        curtext = preventpee(curtext);
    } else {
        curtext.push(girltalk + pickrandom(needs["deny"]));
        curtext = displayneed(curtext);
        curtext = interpbladder(curtext);
        curtext = printChoicesList(curtext, [0], needs["choices"]);
    }
    sayText(curtext);
}

//TODO make her less demanding
function preventpee(curtext) {

    // If she's not in obviously dire straits, your
    // admonitions, whatever they are, will effectly
    // have answered her request to pee.  So the flag
    // will be cleared.

    let choices = [1, 9] // This keeps track of the options you can choose from so they can be printed at the end

    if (bladder < bladlose - 50)
        gottagoflag = 0;

    if (locstack[0] === "doDance")
        choices.push(2); //Pee together
    if (locstack[0] === "darkbar" || locstack[0] === "darkmovie" || locstack[0] === "darkclub")
        choices.push(3); //Watch
    if (locstack[0] === "darkTheatre")
        choices.push(4); //No restroom
    if (locstack[0] === "darkBar")
        choices.push(5); //pdrinkinggame
    if (locstack[0] === "darkClub")
        choices.push(6); //pphotegame
    if (locstack[0] === "driveout" && !gasStation) {
        choices.push(7); //nextstop
    } else {
        choices.push(8); //allowpee
    }

    return printChoicesList(curtext, choices, needs["preventpee"]);
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
//  DisplayHoldQuip function prints a quasi-random quip from "+girlname+"
//  saying she's going to try to hold it for you.
function displayholdquip(curtext) {
    //TODO is the noneed ever used?
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

function askcanhold() {
    let curtext = printList([], needs["askcanhold"]);
    let needType = "holdokay";
    if (bladder >= bladlose) needType = "holdlose";
    else if (bladder >= blademer) needType = "holdemer";
    else if (bladder >= bladneed) needType = "holdneed";
    else if (bladder >= bladurge) needType = "holdurge";
    curtext.push(girltalk + pickrandom(needs[needType]));
    curtext = interpbladder(curtext);
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

let toldstories;
let lastStory;
function pstory() {
    let curtext = [needs["pstory"][0]];
    curtext = displayneed(curtext);
    if (toldstories.length === 0) {
        toldstories = range(0, needs["peestory"].length-1);
        toldstories.splice(toldstories.indexOf(lastStory), 1);
    }
    lastStory = pickrandom(toldstories);
    toldstories.splice(toldstories.indexOf(lastStory), 1);
    curtext.push(needs["peestory"][lastStory]);
    curtext = printChoicesList(curtext, [23, 0], needs["choices"]);
    sayText(curtext);
}

function pstory2() {
    let curtext = printListSelection([], needs["pstory"], [1,2])
    curtext.push(needs["peestory2"][lastStory]);
    curtext = displayneed(curtext);
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

// If she begs you, you end up not leaving the venue.
function begtoilet(curtext) {
    //TODO mention having peed outside before? / autonomously choose that
    let selection = [0];
    if (peedvase)
        selection.push(1);
    else if (peedshot)
        selection.push(2);
    else if (peedtowels)
        selection.push(3);
    else
        selection.push(4);
    printListSelection(curtext, needs["begtoilet"]["dialogue"], selection);
    selection = [];
    if (locstack[0] === "themakeout")
        selection.push(3);
    selection.push(4);
    return printChoicesList(curtext, selection, needs["begtoilet"]["choices"]);
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

function bribeask() {
    let curtext = []
    curtext = printList(curtext, needs["bribeask"]);
    if (!Math.floor(Math.random() * askholditcounter) && (
        (bladder >= bladlose && attraction > holditlosethresh) ||
        (bladder >= blademer && attraction > holditemerthresh) ||
        (bladder >= bladneed && attraction > holditneedthresh))) {
        curtext.push(girltalk + pickrandom(general["okayforyou"]));
        askholditcounter++;
        curtext = displayholdquip(curtext);
        curtext = printChoicesList(curtext, [0],  needs["choices"]);
    } else {
        curtext.push(girltalk + "You've already asked me to hold it " + askholditcounter + " times.");
        curtext = displaygottavoc(curtext);
        curtext = printChoicesList(curtext, [1],  needs["choices"]);
    }
    sayText(curtext);
    bribeaskthresh -= askholditcounter * 0.1;
}

function bribefavor() {
    let curtext = needs["bribefavor"]
    curtext = displayholdquip(curtext);
    curtext = interpbladder(curtext);
    owedfavor -= 1;
    askholditcounter++;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

function allowpee() {
    gottagoflag = 0;
    askholditcounter = 0;
    let curtext = [];
    curtext.push(needs["allowpee"][0]);
    curtext.push(needs["allowpee"][1]);
    if (locstack[0] === "fuckher6" || locstack[0] === "thehome" || locstack[0] === "thebedroom" || locstack[0] === "darkbar"
        || locstack[0] === "pickup" || locstack[0] === "darkclub" || locstack[0] === "darkbar") {
        curtext = callChoice(needs["choices"][1], curtext);
    } else {
        curtext.push(needs["allowpee"][2]);
        attraction += 7;
        curtext = printChoicesList(curtext, [1,5], needs["choices"]);
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

//Ask her to pee in a given item from your backpack
function peein(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    const list = needs[item];
    let curtext = [];
    let itemAttr = 30;
    if (list.hasOwnProperty("attrThresh"))
        itemAttr = list.attrThresh;
    if (attraction > itemAttr) {
        gottagoflag = 0;
        if (bladder < bladneed) {
            if (attraction < 130) {
                //She doesn't have to go and therefore refuses
                curtext = printList(curtext, list[0]);
                curtext = callChoice(["curloc", "Continue..."], curtext);
            } else {
                //Only if you maxed attraction, she'll try to pee even if she doesn't have to go.
                curtext = printList(curtext, list[1]);
                curtext = callChoice(["peein2(&quot;" +item+ "&quot;)", "Continue..."], curtext);
            }
        }else if (bladder < blademer) {
            if (attraction < 100) {
                //She's not quite willing to try it but not against the idea.
                curtext = printList(curtext, list[2]);
                curtext = displayholdquip(curtext);
                curtext = callChoice(["curloc", "Continue..."], curtext);
            } else {
                //She likes you enough to do it.
                curtext = displayneed(curtext);
                curtext = printList(curtext, list[3]);
                curtext = callChoice(["peein2(&quot;" +item+ "&quot;)", "Continue..."], curtext);
            }
        } else {
            //She's desperate so uses it.
            if (attraction < 70 && !objects[item].peed){
                //An exclamation about the idea of it
                curtext = printList(list[4]);
            }
            curtext = displayneed(curtext);
            curtext = printList(curtext, list[5]);
            curtext = callChoice(["peein2(&quot;" +item+ "&quot;)", "Continue..."], curtext);
        }
    } else {
        //She outrightly refuses the idea.
        curtext = printList(curtext, list[6]);
        attraction -= 3;
        if (attraction < 0) attraction = 0;
        //TODO add check for makeout
        if (locstack[0] === "driveout"){
            //When in the car she'll throw the item out of the window.
            curtext.push("She throws it out of the window.");
            curtext.push("You sigh, not sure how to fix this.");
            objects[item].value--;
        } else if (bladder > bladneed){
            //If she actually has to go she'll go to the bathroom and take the item with her
            curtext.push("She grabs your "+ objects[item].bpname.toLowerCase() + " and runs to the bathroom");
            curtext.push("Leaving you to ponder your current situation.");
            flushdrank();
            objects[item].value--;
        }
        curtext = callChoice(["curloc", "Continue..."], curtext);
    }
    sayText(curtext);
}

function peein2(item){
    let curtext = [];
    //print quote depending on the panties she wears.
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit][objects[item].quote].format([pantycolor]));
    else
        curtext.push(appearance["clothes"][heroutfit][objects[item].quote + "bare"]);
    //prints certain quotes about it coming out if she is actually able to pee
    if (bladder > blademer)
        curtext = itscomingout(curtext);
    else if (bladder > bladurge)
        curtext.push(girltalk + pickrandom(needs["outpeecome"]));
    curtext = callChoice(["peein3(&quot;" + item + "&quot;)", "Continue..."], curtext);
    sayText(curtext);
}

function peein3(item){
    const list = needs[item];
    let curtext = [];
    //If her bladder is virtually empty she can't go even if she tries.
    if (bladder < bladurge) {
        curtext.push(girltalk + "I'm sorry. I really don't have to go.");
        curtext.push(girltalk + "I just can't. Maybe later.");
        shyness += 1;
    } else {
        const container = objects[item];
        if (container.hasOwnProperty("volume")){
            if (container.volume < bladder){
                if (bladder > blademer)
                    //She's desperate and it shows
                    curtext = printList(curtext, list[7]);
                else
                    //Not desperate but the item is too small to hold it all
                    curtext = printList(curtext, list[9]);
                bladder -= container.volume;
                waitcounter = 4;
            } else {
                //The item can hold her full bladder content
                curtext = printList(curtext, list[8]);
                flushdrank();
            }
        } else{
            if (bladder > blademer)
                //She's desperate and it shows
                curtext = printList(curtext, list[7]);
            else
                //She's doing it for you
                curtext = printList(curtext, list[8]);
            flushdrank();
        }
        sawherpee = 1;
        attraction += 4;
        container.peed = 1;
    }
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

function peeintub() {
    console.log("test");
    let curtext = [];
    if (bladder > blademer) {
        curtext = displaygottavoc(curtext);
        curtext.push(needs["peeintub"][0]);
        // s(girltalk + "Sure you're okay with it?");
        curtext = displayneed(curtext);
        curtext = printChoicesList(curtext, [16], needs["choices"]);
        // c("peeintub2", "Continue...");
    } else {
        curtext.push(needs["peeintub"][1]);
        // s(girltalk + "I'll just wait, thank you very much.");
        curtext = printChoicesList(curtext, [0], needs["choices"]);
        // c(locstack[0], "Continue...");
    }
    sayText(curtext);
}

function peeintub2() {
    console.log("test");
    let curtext = printListSelection([], needs["peeintub"], range(2, 5));
    // s(girlgasp + "Ungh!  I can't hold it.");
    // s("You nonchalantly move closer and slip your hand under her butt.  The strong stream of pee flows out between your fingers for nearly a minute, and you can detect the barest scent of urine rising from the hot water.  It feels strangely cool in the warm water of the tub.");
    flushdrank();
    // s("The stream slows and finishes, and " + girlname + " lets out a sigh of relief.");
    // s(girltalk + "That feels <i>so</i> much better.");
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    // c(locstack[0], "Continue...");
    sayText(curtext);
}

//TODO do something if you peed outside already(mention to follow your lead)
//TODO she pees outside if she's not bursting
//TODO fix the duplicate code
function peeoutside() {
    let curtext = [];
    if (attraction > 30) {
        if (bladder > blademer) {
            if (peedoutside)
                curtext.push(needs["peeoutside"][0]);
            else
                curtext.push(needs["peeoutside"][1]);
            curtext = printListSelection(curtext, needs["peeoutside"], [2,3]);
            curtext = displayneed(curtext);
            let choices = [];
            if (locstack[0] === "themakeout") choices.push(17);
            else choices.push(18);
            curtext = printChoicesList(curtext, choices, needs["choices"]);
        } else {
            curtext = displaygottavoc(curtext);
            curtext = printListSelection(curtext, needs["peeoutside"], [4,5]);
            curtext = displayholdquip(curtext);
            gottagoflag = 0;
            curtext = printChoicesList(curtext, [0], needs["choices"]);
        }
    } else {
        //TODO this code is almost impossible to reach? since you need at least 40 attraction to get outside
        curtext.push(needs["peeoutisde"][6]);
        attraction -= 3;
        if (attraction < 0) attraction = 0;
        curtext = printChoicesList(curtext, [0], needs["choices"]);
    }
    sayText(curtext);
}

// In the car
function peeoutside2() {
    console.log("test");
    let curtext = [];
    if (pantycolor !== "none") curtext.push(appearance["clothes"][heroutfit]["peeoutsidequote"].format([pantycolor]));
    else curtext.push(appearance["clothes"][heroutfit]["peeoutsidequotebare"]);
    // if (pantycolor !== "none") s(peeoutsidequote);
    // else s(peeoutsidequotebare);
    curtext.push(needs["peeoutside"][7]);
    // s(girltalk + "Are you sure it's safe?");
    curtext = printChoicesList(curtext, [19], needs["choices"]);
    // c("peeoutside3", "Continue...");
    sayText(curtext);
}

// Not in the car
function peeoutside2b() {
    console.log("test");
    let curtext = [];
    if (pantycolor !== "none") curtext.push(appearance["clothes"][heroutfit]["peeoutsidebquote"]);
    else curtext.push(appearance["clothes"][heroutfit]["peeoutsidebquotebare"]);
    curtext.push(needs["peeoutside"][7]);
    let choices = [];
    if (locstack[0] === "thebeach") choices.push(20);
    else choices.push(21);
    curtext = printChoicesList(curtext, choices, needs["choices"]);
    sayText(curtext);
}

// She was in the car
function peeoutside3() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(8,10));
    attraction += 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

//  Again, she's not in the car
function peeoutside3b() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(11,13));
    attraction += 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

//  Pee on the beach
function peeoutside3c() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(14,16));
    attraction += 3;
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

//TODO chance with triggering each other into wetting when desperate
//TODO it's impossible to spurt more than once while it shouldn't be
//Here's actually where we decide if she wet or just spurted
function wetherself() {
    let curtext = [pickrandom(needs["wetquote"])];
    if (randomchoice(spurtthresh) && locstack[0] !== "thehottub" && !shespurted) {
        curtext = spurtedherself(curtext);
    } else {
        spurtthresh = 5;
        let choices = [];
        if (locstack[0] === "driveout")
            choices.push(24);
        else if (locstack[0] === "themakeout")
            choices.push(25);
        else if (locstack[0] === "thehottub")
            choices.push(26);
        else
            choices.push(27);
        curtext = printChoicesList(curtext, choices, needs["choices"]);
    }
    sayText(curtext);
}

function wetherself2(curtext) {
    if (!curtext)
        curtext = [];
    curtext.push(needs["wetherself"][0]);
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    curtext.push(girltalk + pickrandom(needs["embarquote"]));
    curtext = printChoicesList(curtext, [32], needs["choices"]);
    sayText(curtext);
}

// She's in the makeout spot
function wetherself2m() {
    let curtext = [needs["wetherself"][1]];
    wetherself2(curtext);
}

// She's in the hottub
function wetherself2t() {
    let curtext = printListSelection([],  needs["wetherself"], range(2,4));
    flushdrank();
    curtext = printChoicesList(curtext, [33], needs["choices"]);
    sayText(curtext);
}

// She's in the car
function wetherself2c() {
    let curtext = printListSelection([],  needs["wetherself"], range(5,8));
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    wetthecar = 1;
    curtext = printChoicesList(curtext, [34], needs["choices"]);
    sayText(curtext);
}

function wetherself3c() {
    let curtext = printListSelection([],  needs["wetherself"], [9,10]);
    shyness += 20;
    if (shyness > 100) shyness = 100;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

//TODO check this, for unfilled in variables
function wetherself3() {
    let curtext = [];
    if (pantycolor !== "none" && shyness < 70) {
        curtext.push(appearance["clothes"][heroutfit]["wetherselfquote"].format([pantycolor]));
        if (attraction > 40) {
            curtext = printListSelection(curtext, needs["wetherself"], [11,12]);
            objects.wetPanties.value++
        }
        pantycolor = "none";
    } else if (pantycolor === "none")
        curtext.push(needs["wetherself"][13]);
    curtext.push(pickrandom(appearance["clothes"][heroutfit]["dryquote"]));
    if (locstack[0] !== "drinkinggame") {
        shyness += 15;
        if (shyness > 100) shyness = 100;
    }
    let listenerList = [[[scoldher, "Scold her for wetting herself"]]];
    if (haveItem("ptowels")) {
        listenerList.push([[function () {
            giveHer("ptowels");
        }, "Offer her paper towels."], "pTowels"]);
    } if (haveItem("panties")) {
        listenerList.push([[function () {
            giveHer("panties");
        }, "Offer her a clean pair of panties."], "panties"]);
    }
    sayText(curtext);
    listenerList.forEach(item => cListener(item[0], item[1]));
    curtext = callChoice(["curloc", "Continue..."] );
    addSayText(curtext);
    addListenersList(listenerList);
}

// In the tub
function wetherself3t() {
    console.log("test");
    let curtext = printListSelection(curtext, needs["wetherself"] ,range(14, 16));
    shyness += 10;
    if (shyness > 100) shyness = 100;
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

function spurtedherself(curtext) {
    bladder -= 50;
    spurtthresh -= 0.1 * spurtthresh;
    shespurted = 1;
    curtext.push(pickrandom(needs["spurtquote"]));
    curtext = displayneed(curtext);
    curtext = printChoicesList(curtext, [0, 28], needs["choices"]);
    return curtext;
}

function askspurted() {
    console.log("test");
    let curtext = [needs["askspurted"][0]];
    curtext.push(pickrandom(needs["spurtquote"]));
    curtext.push(pickrandom(needs["spurtdenyquote"]));
    curtext = displayneed(curtext);
    let choices = [];
    if (locstack[0] !== "thehottub")
        choices.push(29);
    choices.push(0);
    curtext = printChoicesList(curtext, choices, needs["choices"]);
    sayText(curtext);
}

function checkspurted() {
    let curtext = [needs["askspurted"][1]];
    let choices = [];
    if (attraction < 75) {
        curtext = printListSelection(curtext, needs["askspurted"], [2,3]);
        curtext = displayneed(curtext);
        attraction -= 10;
        shyness += 10;
    } else {
        if (pantycolor === "none") {
            curtext = printListSelection(curtext, needs["askspurted"], [4,5]);
        } else {
            curtext = printListSelection(curtext, needs["askspurted"], [6,7]);
        }
        if (bladder > blademer)
            curtext.push(pickrandom(needs["feelthigh"]));
        choices.push(30);
    }
    choices.push(0);
    curtext = printChoicesList(curtext, choices, needs["choices"]);
    sayText(curtext);
}

function smellspurted() {
    console.log("test");
    let curtext = [needs["askspurted"][8]];
    curtext.push(pickrandom(needs["smellpee"]));
    curtext = printChoicesList(curtext, [0], needs["choices"]);
    sayText(curtext);
}

//TODO make this more pleasurable/more BDSM like scolding?
function scoldher() {
    let curtext = printList([], needs["scoldher"]);
    attraction -= 20;
    curtext = printChoicesList(curtext, [31], needs["choices"]);
    sayText(curtext);
}

//Comfort her after hurting her feelings by scolding her.for wetting.
function comforther() {
    let curtext = printList([], needs["comforther"]);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    attraction += 5;
    shyness -= 2;
    sayText(curtext);
}

//
//  It's coming out and she can't stop it
//  used to help describe various pees.
//
function itscomingout(curtext) {
    if (!sawherpee)
        curtext.push(girltalk + pickrandom(needs["outpeelook"]));
    else
        curtext.push(girltalk + pickrandom(needs["outpeehide"]));
    curtext.push(girlgasp + pickrandom(needs["outpeectrl"]));
    curtext.push(girltalk + pickrandom(needs["outpeecome"]));
    return curtext;
}

function pgirlsroom() {
    let curtext = printList([], peelines["pgirlsroom"][0]);
    let listenerList = [];
    if (attraction >= pwatchthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["pgirlsroom"][1]);
        curtext = displayneed(curtext);
        listenerList.push([[pGirlsRoom2, "Follow her..."], "Follow"]);
        listenerList.push([[indepee, "Change your mind..."], "changeMind"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, peelines["pgirlsroom"][2]);
        indepee(curtext);
    }
}

function pGirlsRoom2() {
    let curtext = printList([], peelines["pgirlsroom"][3]);
    if (bladder < bladlose - 10) bladder = bladlose - 10;
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["pgirlsroom"][4]);
    sayText(curtext);
    cListenerGen([pTogether3, "Continue..."], "pTogether");
}

//TODO option for you to pee as well
function ptogether() {
    let curtext = printList([], peelines["ptogether"][0]);
    pushloc("ptogether");
    let listenerList = [];
    if (attraction >= ptogetherthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["ptogether"][1]);
        curtext = displayneed(curtext);
        listenerList.push([[pTogether2, "Follow her..."], "Follow"]);
        listenerList.push([[indepee, "Change your mind..."], "changeMind"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, peelines["ptogether"][2]);
        indepee(curtext);
    }
}

//TODO option to make out
//TODO Actually check if she's desperate in the situation where the line's too long
function pTogether2() {
    let curtext = printList([], peelines["ptogether"][3]);
    // s(girlname + " leads you back to the restrooms.");
    let listenerList = [];
    if (!randomchoice(rrlockedthresh)) {
        curtext = printList(curtext, peelines["ptogether"][4]);
        // s("She looks right, looks left, and peeks in the door before quickly pulling you into a very cramped stall.");
        if (bladder < bladlose - 10) bladder = bladlose - 10;
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["ptogether"][5]);
        // s("The sight of the toilet seems to have increased her urgency.");
        listenerList.push([[pTogether3, "Continue..."], "peeTogether"]);
    } else {
        curtext = printList(curtext, peelines["ptogether"][6]);
        // s("There's a long line for the womens restrooms.  You notice they're mostly young, dressed to the nines, and in various stages of extreme urinary urgency.  Your daydreams are interrupted quickly.");
        // s(girlname + " squeezes your hand: I can't hold it!  What are we gonna do?");
        listenerList.push([[pTogether4, "Invite her into the mens room"], "mensRoom"]);
        listenerList.push([[pTogether5, "Take her out the nearby back door."], "outBack"]);
        listenerList.push([[pTogether6, "Stand around looking dumb."], "giveUp"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function pTogether3() {
    let curtext = [];
    if (pantycolor !== "none")
        curtext.push(girlname + appearance["clothes"][heroutfit]["ptogetherquote"].format([pantycolor]));
    else
        curtext.push(girlname + appearance["clothes"][heroutfit]["ptogetherquotebare"]);
    curtext = printList(curtext, peelines["ptogether"][7]);
    flushdrank();
    sawherpee = 1;
    let listenerList = [
        [[pTogether3b, "Feel the stream."], "feelStream"],
        [[pTogether3c, "Kiss her thighs."], "kissThighs"],
        [[pTogether3d, "You're too shy."], "tooShy"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

function pTogether3b() {
    sayText(peelines["ptogether"][8]);
    cListenerGen([pTogether3d, "Continue..."], "pTog");
}

function pTogether3c() {
    sayText(peelines["ptogether"][9]);
    cListenerGen([pTogether3d, "Continue..."], "pTog");
}

function pTogether3d() {
    sayText(peelines["ptogether"][10]);
    cListenerGen([pTogether3e, "Continue..."], "goBack");
}

function pTogether3e(){
    let curtext = [];
    if (locstack[0] === "pmensroom") {
        curtext = printList(curtext, peelines["ptogether"][19]);
        poploc();
    } else
        curtext = printList(curtext, peelines["ptogether"][18]);
    poploc();
    kissher(curtext);
}

// You take her into the mens room
function pTogether4() {
    sayText(peelines["ptogether"][11]);
    pushloc("pmensroom");
    cListenerGenList([
        [[pTogether4b, "I'm a guy, and I'm giving you permission!"], "permission"],
        [[function () {
            poploc();
            poploc();
            doDance();
        }, "Okay, then I guess you'll just have to hold it."], "holdit"]
    ]);
}

function pTogether4b() {
    let curtext = printList([], peelines["ptogether"][12]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][13]);
    sayText(curtext);
    cListenerGen([pTogether3, "Continue..."], "pTog");
}

// You take her out back
function pTogether5() {
    let curtext = printList([], peelines["ptogether"][14]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][15]);
    let listenerList = [
        [[pTogether5a, "Tell " + girlname + " to pee behind the dumpster."], "tellHer"],
        [[pTogether5b, "Help her."], "helpHer"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);
}

function pTogether5a() {
    let curtext = printList([], peelines["ptogether"][16]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][17]);
    const listenerList = [
        [[pTogether5a2, "Oh, Yes!"], "helpHer"],
        [[ptogether, "Nevermind - let's go back inside."], "goBack"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);
}

function pTogether5a2() {
    let curtext = printList([], peelines["ptogether"][20]);
    curtext = displayneed(curtext);
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit]["ptogetheroutquote"]);
    else curtext.push(appearance["clothes"][heroutfit]["ptogetheroutquotebare"]);
    curtext = printList(curtext, peelines["ptogether"][21]);
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit]["finishtogetheroutquote"].format([pantycolor]));
    else
        curtext.push(appearance["clothes"][heroutfit]["finishtogetheroutquotebare"]);
    flushdrank();
    sawherpee = 1;
    sayText(curtext);
    cListenerGen([pTogether5d, "Continue..."], "goback");
}

function pTogether5b() {
    let curtext = printList([], peelines["ptogether"][22]);
    if (pantycolor !== "none") {
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquote"].format([pantycolor]));
        curtext = printList(curtext, peelines["ptogether"][23]);
    } else {
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquotebare"]);
        curtext = printList(curtext, peelines["ptogether"][24]);
    }
    sayText(curtext);
    cListenerGen([pTogether5c, "\"Go.  Let it all out.\""], "tellPee");
}


function pTogether5c() {
    let curtext = printList([], peelines["ptogether"][25]);
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquote"].format([pantycolor]));
    else
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquotebare"]);
    flushdrank();
    attraction += 6;
    shyness -= 6;
    sawherpee = 1;
    curtext = printList(curtext, peelines["ptogether"][26]);
    sayText(curtext);
    cListenerGen([doDance, "Continue..."], "doDance");
    poploc();
}

function pTogether5d(){
    poploc();
    kissher(["You quickly compose yourselves and head back out to the club, but first..."]);
}

// You stand around looking dumb.
function pTogether6() {
    let curtext = printList([], peelines["ptogether"][27]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][28]);
    sayText(curtext);
    poploc();
    attraction -= 3;
    cListenerGen([doDance, "Continue..."], "doDance");
}

//TODO let her choose.
function pnorestroom() {
    let curtext = printList([], theatre["noRest"][0]);
    if (attraction >= pnorestroomthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, theatre["noRest"][1]);
        curtext = displayneed(curtext);
        sayText(curtext);
        let listenerList = [];
        Object.keys(theatre["noToilet"]).forEach(option => {
            const temp = function (){
                noToiletPee(option);
            }
            listenerList.push([[temp, theatre["noToilet"][option]["text"]], option]);
        });
        listenerList.push([[indepee, "Change your mind..."], "indePee"]);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, theatre["noRest"][2]);
        indepee(curtext);
    }
}

function noToiletPee(choice){
    let quotes = theatre["noToilet"][choice]["quotes"];
    let curtext = printList([], quotes[0]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, quotes[1]);
    curtext = displayyourneed(curtext);
    if (pantycolor === "none")
        curtext.push(appearance["clothes"][heroutfit]["peeprepquotebare"]);
    else
        curtext.push(appearance["clothes"][heroutfit]["peeprepquotebare"]);
    curtext = printList(curtext, quotes[2]);
    sayText(curtext);
    sawherpee = 1;
    flushdrank();
    cListenerGen([noToiletPee2, "Continue..."]);
}

function noToiletPee2(){
    let curtext = printList([], theatre["noRest"][3]);
    kissher(curtext);
}