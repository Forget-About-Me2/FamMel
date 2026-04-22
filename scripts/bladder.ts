import { printList, printListSelection, printLList, printChoicesList, callChoice, sayText, c, cListener, cListenerGen, cListenerGenList, addSayText, addListenersList, voccurse, needs, peelines, appearance, girlname, girltalk, girlgasp, pantycolor, setPantycolor, general } from './quotes';
import { pickrandom, randomchoice, range, gameRandom, randomInt, incrandom, pushloc, poploc, locStack, attraction, setAttraction, shyness, setShyness, thetime, haveherpurse, setHaveherpurse, owedfavor, setOwedfavor, randcounter, showedneed, setShowedneed } from './shims';
import { haveItem, backPackItems, displaydrank, holdpurse, giveHer } from './backPackItems';
import { nextstop } from './locations/driveAround';
import { pdrinkinggame } from './locations/theBar';
import { doDance, pphotogame, externalflirt } from './locations/theClub';
import { displayyourneed } from './yourbladder';
import { kissher } from './actions';
import { gameState } from './gameState/gameState';
import { assertExists } from './helperFiles/helperFunctions';
import { heroutfit } from './settings';
import { theatre, rrMovieLineThresh } from './locations/theatre';
import { gasStation } from './locations/driveAround';
import { setHasWetTheCar } from './drive';

//This file contains all functions related to peeing
//TODO organize this better

//Her bladder variables
export let customurge = 250;
export function setCustomurge(val: number) { customurge = val; }
export let minurge = 187; //Bladder never decays below this

export let minperc = 75; //Percentage of the minimumvalue of the bladder
export function setMinperc(val: number) { minperc = val; }

export let bladurge = 250; // Level where she feels the first urge
export function setBladurge(val: number) { updateurge(val); }
export let bladneed = bladurge * 2; // Level where she continuously needs to go
export let blademer = bladurge * 3; // Level where it becomes an emergency
export let bladlose = bladurge * 3 + 150; // Level where she loses control
export let bladcumlose = bladurge * 4; // Level where she spurts as she cums
export let bladsexlose = bladurge * 5; // Level where she can't control it during sex

export let maxtummy = 250; // Drink capacity of stomach
export function setMaxtummy(val: number) {
    maxtummy = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.MaxTummy = maxtummy;
    }
}
export let maxbeer = 500; // Beer capacity of stomach
export function setMaxbeer(val: number) {
    maxbeer = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.MaxAlcohol = maxbeer;
    }
}

// Legacy global state used across script-style JS files.
export let tummy = 0;
/**
 * Compatibility setter for companion tummy volume.
 *
 * Usage:
 * - Use this when code writes the shared companion tummy value.
 * - Do not assign `tummy = ...` directly in gameplay logic.
 *
 * Relevance:
 * - Canonical owner is `gameState.Companion.Tummy` once gameState is initialized.
 * - Legacy `tummy` remains as a mirror for script-style code that still reads globals.
 */
export function setTummy(val: number) {
    const nextTummy = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.Tummy = nextTummy;
        tummy = gameState.Companion.Tummy;
        return;
    }
    tummy = nextTummy;
}
export let bladder = 0;
/**
 * Compatibility setter for companion bladder volume.
 *
 * Usage:
 * - Use this for all runtime writes to companion bladder state.
 * - Do not assign `bladder = ...` directly in gameplay logic.
 *
 * Relevance:
 * - Canonical owner is `gameState.Companion.Bladder` once gameState is initialized.
 * - Legacy `bladder` stays in sync as a mirror for unmigrated global-scope code.
 */
export function setBladder(val: number) {
    const nextBladder = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.Bladder = nextBladder;
        bladder = gameState.Companion.Bladder;
        return;
    }
    bladder = nextBladder;
}

export function drainBladderBy(amount: number) {
    const drainAmount = Math.max(0, Number(amount) || 0);
    setBladder(bladder - drainAmount);
}

export let bladDec = 1;
export function setBladDec(val: number) { bladDec = val; }
export let bladDespDec = 1;
export function setBladDespDec(val: number) { bladDespDec = val; }
export let seal = 1;
export function setSeal(val: number) { seal = val; }
export let beerdecCounter = 0; //How long has it been since her bladder capacity has been decayed by beer
export let ybeerdecCounter = 0; //How long has it been since your bladder capacity has been decayed by beer
export function setYbeerdecCounter(val: number) { ybeerdecCounter = val; }

//  So she doesn't seem unfamiliar with the concept after the first time.
export let peedtowels = 0; // has she peed in your paper towels
export let peedvase = 0; // has she peed in your vase
export let peedshot = 0; // has she peed in the shot glass
export let peedoutside = 0; // has she peed outside

//  The following are used by her to complain about how long she's
// been waiting and how much she's drunk.
export let lastpeetime = 0;  // When did she last go?
export function setLastpeetime(val: number) {
    const nextLastPeeTime = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.LastPeeTime = nextLastPeeTime;
        lastpeetime = gameState.Companion.LastPeeTime;
        return;
    }
    lastpeetime = nextLastPeeTime;
}
export let timeheld = 0; // for stats
export function setTimeheld(val: number) { timeheld = val; }

export let drankbeer = 0; // has she drunk beer?  Changes capacities and rates.
export function setDrankbeer(val: number) { drankbeer = val; }

// Flags for drinking game.
export let notdesperate = 0; //neither you or her are desperate after drinking game.
export function setNotdesperate(val: number) { notdesperate = val; }
export let notydesperate = 0; //You aren't desperate but she is after drinking game.
export function setNotydesperate(val: number) { notydesperate = val; }
export let nothdesperate = 0; //She isn't desperate but you are after drinking game
export function setNothdesperate(val: number) { nothdesperate = val; }

//  Randomness thresholds 1-10.
//  1 corresponds to 10% likelihood.
//  10 corresponds to 100% likelihood.
export const rrlockedthresh = 7; // Likelihood of bar restroom locked ( occupied )
export const rrlinethresh = 7; // Likelihood of line for restroom in club
export const phoneholdthresh = 7; // Likelihood of her holding it for you on the phone
export let spurtthresh = 5; // Likelihood of her spurting rather than wetting
export function setSpurtthresh(val: number) { spurtthresh = val; }
export let yspurtthresh = 3; // Likelihood of you spurting rather than wetting
export function setYspurtthresh(val: number) { yspurtthresh = val; }
export let bribeaskthresh = 7; //Likelihood she'll hold it if you ask her when desperate
export function setBribeaskthresh(val: number) { bribeaskthresh = val; }
export let bribeAskBase = 7; //The base likelihood that the asks works, this is used to reset the askthresh when she pees
export function setBribeAskBase(val: number) { bribeAskBase = val; }

export let tumavg = tummy; // Average blood water level
export const tumdecay = 6; // Number of calculation cycles to average bladder filling


//  Attraction thresholds
export const ptogetherthreshold = 100; // She'll take you with her to the bathroom.
export const pnorestroomthreshold = 110; // She'll pee outside of the restroom.
export const pwatchthreshold = 90; // You can watch her pee in a closed place.
export const drinkinggamethreshold = 90; // She'll play your silly drinking game.
export const photoGameThresholds = {
    snapshots: 90, // She'll play your silly photo game
    costume: 100, // She'll play your silly photo game in costume
    nudes: 110  // She'll play your silly photo game nude
};
export const hottubthresh = 90; //  She'll strip and go into the hot tub
export const holditneedthresh = 30; // She'll hold it for need
export const holditemerthresh = 60; // She'll hold it for emergency
export const holditlosethresh = 90; // She'll try to hold it for lose
export const gomakeoutthresh = 40; // She'll go to the makeout spot

export let rrlockedflag = 0; // Restroom was locked last time she went
export function setRrlockedflag(val: number) { rrlockedflag = val; }
export let shespurted = 0; // She only spurted
export function setShespurted(val: number) { shespurted = val; }
export let brokeice = 0; // She's previously brought up that she needs to pee
export function setBrokeice(val: number) { brokeice = val; }
export let sawherpee = 0; // You've seen her pee

export let wetlegs = 0; // her legs are wet
export function setWetlegs(val: number) { wetlegs = val; }
export let wetherpanties = 0; // did she ever wet herself?
export function setWetherpanties(val: number) { wetherpanties = val; }
export let nowpeeing = 0; // flag: she is currently peeing
export function setNowpeeing(val: number) {
    const nextNowPeeing = Number(val) || 0;
    if (gameState.Companion) {
        gameState.Companion.NowPeeing = !!nextNowPeeing;
        nowpeeing = gameState.Companion.NowPeeing ? 1 : 0;
        return;
    }
    nowpeeing = nextNowPeeing;
}

export let gottagoflag = 0; // has she just asked to use the restroom
export function setGottagoflag(val: number) { gottagoflag = val; }

export let askholditcounter = 0; // How many times have you asked her to hold it.
export function setAskholditcounter(val: number) { askholditcounter = val; }
export let waitcounter = 0; // how long ago did she ask to pee?
export function setWaitcounter(val: number) { waitcounter = val; }
                     //Reset positive when you ask her.

//Initializes the bladder values for the girl
export function initUrge(urge: number) {
    minurge = urge * minperc / 100;
    updateurge(urge);
}

// noinspection DuplicatedCode
export function syncCompanionLegacyThresholdsFromCanonical(urge: number) {
    const normalizedUrge = Math.round(Number(urge) || 0);
    bladurge = normalizedUrge;
    bladneed = normalizedUrge * 2;
    blademer = normalizedUrge * 3;
    bladlose = normalizedUrge * 3 + 150;
    bladcumlose = normalizedUrge * 4;
    bladsexlose = normalizedUrge * 5;
}

// noinspection DuplicatedCode
export function updateurge(newurge: number) {
    if (newurge < minurge) newurge = minurge;
    newurge = Math.round(newurge);
    gameState.Companion?.setUrge(newurge);
    bladurge = gameState.Companion?.bladderUrge ?? newurge;
    bladneed = gameState.Companion?.bladderNeed ?? newurge * 2;
    blademer = gameState.Companion?.bladderEmer ?? newurge * 3;
    bladlose = gameState.Companion?.bladderLose ?? (newurge * 3 + 150);
    bladcumlose = gameState.Companion?.bladderCumLose ?? newurge * 4;
    bladsexlose = gameState.Companion?.bladderSexLose ?? newurge * 5;
}

// Slightly randomizes the calculated tuminc
// so the bladder doesn't fill with a completely fixed amount each time
export function randtuminc(tempinc: number) {
    if (tempinc === 2)
        return tempinc;
    let choicearray: any[] = [];
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

// Calculate tummy increment per cycle. Ensures a sensible minimum and
// smooths using the running average `tumavg`. Returns a small integer
// which is then slightly randomized by `randtuminc`.
export function calcTuminc() {
    // Update running average of tummy
    tumavg = Math.round((tumavg * (tumdecay - 1) + tummy) / tumdecay);

    // Base increment scales with current tummy level; ensure minimum of 2
    let base = Math.max(2, Math.round((tummy / Math.max(1, maxtummy)) * 10));

    // Slightly bias base by recent average to avoid jitter when near empty/full
    if (tumavg > tummy) base = Math.max(2, base - 1);
    else if (tumavg < tummy) base = base + 0;

    return randtuminc(base);
}

//
//  Reset All Pee Counters ( this means she peed )
//
export function flushdrank() {

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

    Object.keys(backPackItems).forEach(key => {
        const item = backPackItems[key];
        if (item.hasOwnProperty("shedrank"))
            item.shedrank = 0;
    });
    setBladder(0);
    askholditcounter = 0;
    waitcounter = 0;
    gottagoflag = 0;
    setLastpeetime(thetime);
    rrlockedflag = 0;
    shespurted = 0;
    setNowpeeing(1);
    bribeaskthresh = bribeAskBase;
}

// Shyness thresholds for vocalization decisions
const SHYNESS_ALWAYS_VOCALIZE = 90;  // Below this, she vocalizes when about to wet
const SHYNESS_VENUE_ASK = 70;       // Below this, asks when changing venue
const SHYNESS_EMERGENCY_ASK = 80;   // Below this, asks during bladder emergency
const SHYNESS_NEED_ASK = 60;        // Below this, asks when needing badly
const SHYNESS_URGE_ASK = 40;        // Below this, lets you know at first urge

const WAIT_AFTER_VENUE_CHANGE = 4;
const WAIT_RECENT_THRESHOLD = 2;    // waitcounter <= this means she was recently told to wait

// Showneed calculates how she's going to indicate
// her current level of need ( if at all ) based on her situation
export function showneed(curtext: any[] = []): any[] {

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
    if (bladder >= (bladlose - 2 * tuminc) && shyness < SHYNESS_ALWAYS_VOCALIZE) {
        if (externalflirt) curtext = voccurse(curtext);
        curtext = displaygottavoc(curtext);
    } else if (gameState.Interactions.ChangeVenueFlag) {
        // She's almost always going to ask to go if you're off somewhere
        if ((bladder >= blademer) ||
            (bladder >= bladneed && shyness < SHYNESS_VENUE_ASK)) {
            if (waitcounter <= WAIT_RECENT_THRESHOLD) {
                curtext.push(girltalk + "Hey! Before we go...");
                waitcounter = WAIT_AFTER_VENUE_CHANGE;
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
        if (shyness < SHYNESS_EMERGENCY_ASK && bladder > blademer) {
            waitcounter = Math.max(Math.round(bladlose / 150), 6);
            curtext = displaygottavoc(curtext);
        } else if (shyness < SHYNESS_NEED_ASK && bladder > bladneed) {
            waitcounter = Math.max(Math.round(bladlose / 90), 9);
            curtext = displaygottavoc(curtext);
        } else if (shyness < SHYNESS_URGE_ASK && bladder > bladurge) {
            waitcounter = Math.max(Math.round(bladlose / 75), 12);
            curtext = displaygottavoc(curtext);
        } else if (showsRandomSymptom()) {
            curtext = displayneed(curtext);
        }
    } else if (showsRandomSymptom()) {
        curtext = displayneed(curtext);
    }
    gameState.Interactions.ChangeVenueFlag = false;
    return curtext;
}

/** Probabilistic check: higher bladder fill → more likely to show symptoms. */
function showsRandomSymptom(): boolean {
    return (gameRandom() * bladlose) < bladder;
}

// DisplayGottaVoc function prints a quasi-random vocalization from "+girlname+"
// indication her sincere hope to find a bathroom soon.
//TODO this probably should only be used by showneed
export function displaygottavoc(curtext: any[], index?: number): any[] {
    let textchoice: any[] = [];
    if (askholditcounter > 0 && waitcounter < 3 && bladder > bladurge && randomchoice(3)) {
        textchoice.push(pickrandom(needs["wantHold"]).formatVars());
    }

    if (bladder >= bladneed && !brokeice) {
        textchoice = printList(textchoice, needs["appolNeed"]);
    }

    if (locStack[0] === "driveout") {
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
    if (typeof index === "number") {
        let insertIndex = index;
        if (textchoice.length === 1) {
            curtext.splice(insertIndex, 0, textchoice[0]);
        } else {
            textchoice.forEach(text => {
                curtext.splice(insertIndex, 0, text);
                insertIndex++
            });
        }
    } else
        curtext = printList(curtext, textchoice);
    return curtext;
}

// Publish a note about her holding it for you.
// Depends on whether you asked her to hold it,
// and emergency bladder state
export function noteholding(curtext: any[]): any[] {
    if (bladder > blademer && askholditcounter) curtext.push(pickrandom(needs["sheholds"]));
    return curtext;
}

//
//  Publish a note about her looking like she has to go.
//
export function interpbladder(curtext: any[]): any[] {
    if (bladder > bladlose) curtext.push(pickrandom(needs["interplose"]));
    else if (bladder > blademer) curtext.push(pickrandom(needs["interpemer"]));
    else if (bladder > bladneed) curtext.push(pickrandom(needs["interpneed"]));
    return curtext;
}

const HOME_LOCATIONS = ["thehome", "theBedroom", "fuckher6"];
const NO_RESTROOM_LOCATIONS = ["theMakeOut", "theHotTub", "driveout", "thehome", "theBedroom", "theWalk", "theYard", "theBeach"];
const OUTDOOR_NO_RESTROOM = ["theWalk", "theYard", "theBeach", "theHotTub"];
const DESPERATE_PEE_OFFSET = 25; // bladder within this margin of bladlose triggers desperate text

//TODO lose control when bursting on the way
export function indepee(curtext: any[] = [], called: boolean = false) {
    gottagoflag = 0;
    const currentLocation = locStack[0];

    const [noRestroomHeading, noRestroomMakeOut, noRestroomCar, noRestroomGeneric] = peelines["noneavailable"];
    const [headsToBathroom, peesLoudly, peesQuietly] = peelines["thehome"];

    // Part 1: Heading text — what does she say/do on the way to the bathroom?
    //TODO the locstack aren't compeltely correct
    if (haveherpurse) {
        setHaveherpurse(0);
    } else if (HOME_LOCATIONS.includes(currentLocation) || currentLocation === "pickup") {
        curtext.push(headsToBathroom);
    } else if (NO_RESTROOM_LOCATIONS.includes(currentLocation)) {
        curtext.push(noRestroomHeading);
    } else {
        curtext = printList(curtext, peelines["remaining"]);
    }

    // Part 2: What actually happens — can she use the bathroom?
    if (isBathroomLocked(currentLocation)) {
        curtext = bathroomlocked(curtext);
    } else if (currentLocation === "theMakeOut") {
        curtext.push(noRestroomMakeOut);
        curtext = displayneed(curtext);
    } else if (currentLocation === "driveout") {
        curtext.push(noRestroomCar);
        curtext = displayneed(curtext);
    } else if (OUTDOOR_NO_RESTROOM.includes(currentLocation)) {
        curtext.push(noRestroomGeneric);
        curtext = displayneed(curtext);
        curtext = interpbladder(curtext);
    } else if (HOME_LOCATIONS.includes(currentLocation)) {
        curtext.push(peesLoudly);
        flushdrank();
    } else if (currentLocation === "pickup") {
        curtext.push(peesQuietly);
        flushdrank();
    } else {
        // Indoor venue with a restroom — she excuses herself to go
        const clothesKey = bladder > bladlose - DESPERATE_PEE_OFFSET ? "peeprivate" : "peeprivate2";
        curtext.push(pickrandom(appearance["clothes"][heroutfit][clothesKey]));
        flushdrank();
    }

    if (bladder >= bladlose - DESPERATE_PEE_OFFSET && locStack[0] !== "thehottub")
        curtext = begtoilet(curtext);
    else
        curtext = c([locStack[0], "Continue..."], curtext);

    //If the function has been called by another function, send the result back otherwise print it yourself
    if (called)
        return curtext;
    else
        sayText(curtext);
}

/** Check if the bathroom at the current location is randomly locked/occupied. */
function isBathroomLocked(location: string): boolean {
    return (location === "theBar" && randomchoice(rrlockedthresh)) ||
        ((location === "theClub" || location === "doDance") && randomchoice(rrlinethresh)) ||
        ((location === "theTheatre" || location === "domovie") && randomchoice(rrMovieLineThresh));
}

//TODO your and her bathroomlocked can probably be intertwened, only difference is start and the locked variable
export function bathroomlocked(curtext: any[]): any[] {
    const locked = peelines["locked"];
    const [emergencyReaction, uncomfortableReaction, unfulfilledReaction] = locked["urgency"];

    //Description of her reaction, based on how badly she has to go
    if (bladder > blademer)
        curtext.push(emergencyReaction);
    else if (bladder > bladneed)
        curtext.push(uncomfortableReaction);
    else
        curtext.push(unfulfilledReaction);

    // Complaint arrays ordered from most frustrated (4+ attempts) to first attempt
    const isBar = locStack[0] === "thebar";
    const [fourthPlusAttempt, thirdAttempt, secondAttempt, firstAttempt] =
        isBar ? locked["cbar"] : locked["cclub"];

    if (rrlockedflag > 3) {
        curtext.push(fourthPlusAttempt);
    } else if (rrlockedflag > 2) {
        curtext.push(thirdAttempt);
    } else if (rrlockedflag) {
        curtext.push(secondAttempt);
    } else {
        curtext.push(firstAttempt);
    }

    rrlockedflag++; //Increase how often she tried
    curtext = displayneed(curtext);
    return curtext;
}

//  Displayneed function prints a relatively random
//  indication of her level of pee urgency.
const SEATED_LOCATIONS = ["themakeout", "driveout", "drivearound", "domovie"];

export function displayneed(curtext: any[]): any[] {
    setShowedneed(1);
    // Pick the quote prefix based on whether she's seated, in the tub, or standing
    const prefix = (SEATED_LOCATIONS.includes(locStack[0]) || gameState.Romance.FuckingNow > 0) ? "sit"
        : locStack[0] === "thehottub" ? "tub"
        : "";
    const needKey =
        bladder >= bladlose ? `${prefix}needlose` :
        bladder > blademer  ? `${prefix}needemer` :
        bladder > bladneed  ? `${prefix}need` :
        bladder > bladurge  ? `${prefix}needurge` :
        null;
    if (needKey) curtext.push(needs[needKey][randcounter]);
    incrandom();
    return curtext;
}

//TODO add extra options like pee outside
//TODO make responses more realisitc
//TODO don't take her purse in certian situations
export function askpee() {
    const [askQuestion, shyBlush, casualResponse, consideringIt] = needs["askpee"];
    let curtext = [askQuestion];
    let listenerList: any[] = [];
    if (shyness > 60) curtext.push(shyBlush);
    else curtext.push(casualResponse);
    if (bladder > bladneed && bladder < blademer)
        curtext.push(consideringIt);
    if (((shyness < 50 && bladder > bladneed) ||
            bladder > blademer) &&
        (locStack[0] !== "drinkinggame" && !externalflirt)) {
        curtext = displaygottavoc(curtext);
        curtext = interpbladder(curtext);
        curtext = showneed(curtext);
        listenerList.push([[pstory, needs["choices"]["askWet"]], "askWet"]);
        listenerList = preventpee(listenerList);
    } else {
        curtext.push(girltalk + pickrandom(needs["deny"]));
        curtext = displayneed(curtext);
        curtext = interpbladder(curtext);
        curtext = callChoice(["curloc", "Continue..."], curtext);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO make her less demanding
export function preventpee(listenerList: any[] = []): any[] {

    // If she's not in obviously dire straits, your
    // admonitions, whatever they are, will effectively
    // have answered her request to pee.  So the flag
    // will be cleared.

    listenerList.push([[holdit, needs["preventpee"]["holdIt"]], "holdIt"]);
    listenerList.push([[indepee, needs["preventpee"]["indePee"]], "indePee"]);

    if (bladder < bladlose - 50)
        gottagoflag = 0;

    // These options can happen in addition to the standard allow pee, so not jumping to the else.
    if (locStack[0] === "doDance")
        listenerList.push([[ptogether, needs["preventpee"]["pTogether"]], "pTogether"]);
    if (locStack[0] === "darkBar" || locStack[0] === "darkTheatre" || locStack[0] === "darkClub")
        listenerList.push([[pgirlsroom, needs["preventpee"]["pGirlsRoom"]], "pGirlRoom"]);
    if (locStack[0] === "darkTheatre")
        listenerList.push([[pnorestroom, needs["preventpee"]["pNoRestroom"]], "pNoRestroom"]);
    if (locStack[0] === "darkBar")
        listenerList.push([[pdrinkinggame, needs["preventpee"]["pDrinkingGame"]], "pDrinkingGame"]);
    if (locStack[0] === "darkClub")
        listenerList.push([[pphotogame, needs["preventpee"]["pPhotoGame"]], "pPhotoGame"]);

    // Only one of these can be chosen and if none is it should go to the else.
    if (locStack[0] === "driveout" && !gasStation)
        listenerList.push([[nextstop, needs["preventpee"]["nextStop"]], "nextStop"]);
    else if (locStack[0] === "theYard" || locStack[0] === "theWalk")
        listenerList.push([[peeoutside, needs["preventpee"]["suggestPeeGround"]], "pOutside"]);
    else if (locStack[0] === "theMakeOut")
        listenerList.push([[peeoutside, needs["preventpee"]["suggestPeeOutside"]], "pOutside"]);
    else if (locStack[0] === "theBeach")
        listenerList.push([[peeoutside, needs["preventpee"]["suggestPeeSand"]], "pOutside"]);
    else if (locStack[0] === "theHotTub")
        listenerList.push([[peeintub, needs["preventpee"]["suggestPeeInTub"]], "suggestPeeInTub"]);
    else
        listenerList.push([[allowpee, needs["preventpee"]["allowPee"]], "allowPee"]);

    return listenerList;
}

//
//  Ask her to hold it in.
//
//TODO fix it that if you are at her place after you asked her and she doesn't have to go you always fail
export function holdit() {
    let curtext: any[] = [];
    curtext.push(pickrandom(needs["askhold"]));
    gottagoflag = 0;
    waitcounter = 6;
    const [holdUnsure, holdPhonePanic, holdPhoneLosing, holdPhoneWet,
           holdPhoneSorry, holdPhoneHangUp, holdRefusal] = needs["holdIt"];
    if ((bladder >= bladlose && attraction > holditlosethresh) ||
        (bladder >= blademer && attraction > holditemerthresh) ||
        (bladder >= bladneed && attraction > holditneedthresh)) {

        if (bladder >= blademer) {
            curtext.push(girltalk + pickrandom(needs["surpriseexcl"])); //TODO this shouldn't be allowed
            if (randomchoice(5))
                curtext = displaydrank(curtext);
            else
                curtext = displaywaited(curtext);
            curtext.push(holdUnsure);
            if (locStack[0] !== "gostore") curtext = displayneed(curtext);
            else curtext = displaygottavoc(curtext);
            curtext = convinceher(curtext);
        } else {
            curtext = displayholdquip(curtext);
            askholditcounter++;
            if (bladder >= bladlose) {
                if (locStack[0] === "gostore") {
                    //TODO maybe put in one thing to print all lines
                    curtext.push(holdPhonePanic);
                    curtext.push(holdPhoneLosing);
                    curtext.push(holdPhoneWet);
                    setBladder(0);
                    waitcounter = 0;
                    askholditcounter = 0;
                    setAttraction(0);
                } else {
                    curtext = displayneed(curtext);
                }
            }
            curtext = callChoice(["curloc", "Continue..."], curtext);
        }
    } else {
        if (locStack[0] === "gostore") {
            curtext.push(holdPhoneSorry);
            curtext.push(holdPhoneHangUp);
            //She's not holding it while on the phone
            setAttraction(attraction - 5);
            setBladder(0);
            curtext = callChoice(["curloc", "Continue..."], curtext);
        } else {
            curtext.push(holdRefusal);
            // she's not holding it for you
            setAttraction(attraction - 5);
            curtext = indepee(curtext, true) ?? curtext;
        }
    }
    sayText(curtext);
}

//  DisplayHoldQuip function prints a quasi-random quip from "+girlname+"
//  saying she's going to try to hold it for you.
export function displayholdquip(curtext: any[]): any[] {
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

export function askcanhold() {
    let curtext = printList([], needs["askcanhold"]);
    let needType = "holdokay";
    if (bladder >= bladlose) needType = "holdlose";
    else if (bladder >= blademer) needType = "holdemer";
    else if (bladder >= bladneed) needType = "holdneed";
    else if (bladder >= bladurge) needType = "holdurge";
    curtext.push(girltalk + pickrandom(needs[needType]));
    curtext = interpbladder(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export let toldstories: any[] = [];
export function setToldstories(val: any[]) { toldstories = val; }
export let lastStory;
export function setLastStory(val: any) { lastStory = val; }
export function setMinurge(val: number) { minurge = val; }

export function setBeerdecCounter(val: number) { beerdecCounter = val; }
export function setPeedtowels(val: number) { peedtowels = val; }
export function setPeedvase(val: number) { peedvase = val; }
export function setPeedshot(val: number) { peedshot = val; }
export function setPeedoutside(val: number) { peedoutside = val; }
export function setSawherpee(val: number) { sawherpee = val; }
export function setTumavg(val: number) { tumavg = val; }

export function pstory() {
    const askPeeStory = needs["pstory"][0]; // "Have you ever waited too long?"
    let curtext = [askPeeStory];
    let listenerList: any[] = [];
    curtext = displayneed(curtext);
    if (toldstories.length === 0) {
        toldstories = range(0, needs["peestory"].length - 1);
        toldstories.splice(toldstories.indexOf(lastStory), 1);
    }
    lastStory = pickrandom(toldstories);
    curtext.push(needs["peestory"][lastStory]);
    toldstories.splice(toldstories.indexOf(lastStory), 1);
    sayText(curtext);
    listenerList.push([[pstory2, needs["choices"]["askHappened"]], "askHappened"]);
    cListener([pstory2, needs["choices"]["askHappened"]], "askHappened");
    addSayText(callChoice(["curloc", "Continue..."], []));
    addListenersList(listenerList);
}

export function pstory2() {
    let curtext = printListSelection([], needs["pstory"], [1, 2])
    curtext.push(needs["peestory2"][lastStory]);
    curtext = displayneed(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

// If she begs you, you end up not leaving the venue.
export function begtoilet(curtext: any[]): any[] {
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
    if (locStack[0] === "themakeout")
        selection.push(3);
    selection.push(4);
    return printChoicesList(curtext, selection, needs["begtoilet"]["choices"]);
}

//
//  She says how long she's been waiting to pee.
//
export function displaywaited(curtext: any[]): any[] {
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
export function convinceher(curtext: any[]): any[] {
    let selection: any[] = []; //Used to keep track of which options need to be printed
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

export function bribeask() {
    let curtext: any[] = []
    let listenerList: any[] = [];
    curtext = printList(curtext, needs["bribeask"]);
    if (!randomInt(askholditcounter) && (
        (bladder >= bladlose && attraction > holditlosethresh) ||
        (bladder >= blademer && attraction > holditemerthresh) ||
        (bladder >= bladneed && attraction > holditneedthresh))) {
        curtext.push(girltalk + pickrandom(general["okayforyou"]));
        askholditcounter++;
        curtext = displayholdquip(curtext);
        curtext = callChoice(["curloc", "Continue..."], curtext);
        sayText(curtext);
    } else {
        //TODO format variable
        curtext.push(girltalk + "You've already asked me to hold it " + askholditcounter + " times.");
        curtext = displaygottavoc(curtext);
        sayText(curtext);
        listenerList.push([[indepee, "Continue..."], "indePee"]);
        cListener([indepee, "Continue..."], "indePee");
    }
    addListenersList(listenerList);
    bribeaskthresh -= askholditcounter * 0.1;
}

export function bribefavor() {
    let curtext = needs["bribefavor"]
    curtext = displayholdquip(curtext);
    curtext = interpbladder(curtext);
    setOwedfavor(owedfavor - 1);
    askholditcounter++;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function allowpee(): void {
    gottagoflag = 0;
    askholditcounter = 0;
    let curtext: any[] = [];
    let listenerList: any[] = [];
    const [allowResponse, allowRelief, allowOfferPurse] = needs["allowpee"];
    curtext.push(allowResponse);
    curtext.push(allowRelief);
    if (locStack[0] === "fuckher6" || locStack[0] === "thehome" || locStack[0] === "theBedroom" || locStack[0] === "darkbar"
        || locStack[0] === "pickup" || locStack[0] === "darkclub" || locStack[0] === "darkbar") {
        listenerList.push([[indepee, "Continue..."], "indePee"]);
    } else {
        curtext.push(allowOfferPurse);
        setAttraction(attraction + 7);
        listenerList.push([[indepee, "Continue..."], "indePee"]);
        listenerList.push([[holdpurse, needs["choices"]["holdPurse"]], "holdPurse"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function peephone() {
    let curtext: any[] = [];
    gottagoflag = 0;
    const PHONE_PEE_OPEN = 0;    // she pees openly on the phone
    const PHONE_PEE_PRIVATE = 1; // she excuses herself to pee
    const PHONE_PEE_HANGUP = 2;  // she hangs up to pee
    if (attraction > 30) {
        if (bladder > blademer && shyness < 75) {
            curtext = printLList(curtext, peelines["peephone"], PHONE_PEE_OPEN);
            setAttraction(attraction + 10);
            flushdrank();
        } else {
            curtext = printLList(curtext, peelines["peephone"], PHONE_PEE_PRIVATE);
        }
    } else {
        curtext = printLList(curtext, peelines["peephone"], PHONE_PEE_HANGUP);
        setBladder(0);
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

//Ask her to pee in a given item from your backpack
export function peein(item: string) {
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    const list = needs[item];
    let object = backPackItems[item];
    let curtext = [needs["suggestPeeIn"].format([object.bpname])];
    let itemAttr = 30;
    if (object.hasOwnProperty("attrThresh"))
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
                curtext = callChoice(["peein2(&quot;" + item + "&quot;)", "Continue..."], curtext);
            }
        } else if (bladder < blademer) {
            if (attraction < 100) {
                //She's not quite willing to try it but not against the idea.
                curtext = printList(curtext, list[2]);
                curtext = displayholdquip(curtext);
                curtext = callChoice(["curloc", "Continue..."], curtext);
            } else {
                //She likes you enough to do it.
                curtext = displayneed(curtext);
                curtext = printList(curtext, list[3]);
                curtext = callChoice(["peein2(&quot;" + item + "&quot;)", "Continue..."], curtext);
            }
        } else {
            //She's desperate so uses it.
            if (attraction < 70 && !backPackItems[item].peed) {
                //An exclamation about the idea of it
                curtext = printList(curtext, list[4]);
            }
            curtext = displayneed(curtext);
            curtext = printList(curtext, list[5]);
            curtext = callChoice(["peein2(&quot;" + item + "&quot;)", "Continue..."], curtext);
        }
    } else {
        //She outrightly refuses the idea.
        curtext = printList(curtext, list[6]);
        setAttraction(attraction - 3);
        if (attraction < 0) setAttraction(0);
        //TODO add check for makeout
        if (locStack[0] === "driveout") {
            //When in the car she'll throw the item out of the window.
            curtext.push("She throws it out of the window.");
            curtext.push("You sigh, not sure how to fix this.");
            backPackItems[item].value--;
        } else if (bladder > bladneed) {
            //If she actually has to go she'll go to the bathroom and take the item with her
            curtext.push("She grabs your " + backPackItems[item].bpname.toLowerCase() + " and runs to the bathroom");
            curtext.push("Leaving you to ponder your current situation.");
            flushdrank();
            backPackItems[item].value--;
        }
        curtext = callChoice(["curloc", "Continue..."], curtext);
    }
    sayText(curtext);
}

export function peein2(item: string) {
    let curtext: any[] = [];
    //print quote depending on the panties she wears.
    const quoteKey = assertExists(backPackItems[item].quote, `Item '${item}' is missing pee quote key`);
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit][quoteKey].format([pantycolor]));
    else
        curtext.push(appearance["clothes"][heroutfit][quoteKey + "bare"]);
    //prints certain quotes about it coming out if she is actually able to pee
    if (bladder > blademer)
        curtext = itscomingout(curtext);
    else if (bladder > bladurge)
        curtext.push(girltalk + pickrandom(needs["outpeecome"]));
    curtext = callChoice(["peein3(&quot;" + item + "&quot;)", "Continue..."], curtext);
    sayText(curtext);
}

export function peein3(item: string) {
    const list = needs[item];
    let curtext: any[] = [];
    //If her bladder is virtually empty she can't go even if she tries.
    if (bladder < bladurge) {
        curtext.push(girltalk + "I'm sorry. I really don't have to go.");
        curtext.push(girltalk + "I just can't. Maybe later.");
        setShyness(shyness + 1);
    } else {
        const container = backPackItems[item];
        const containerVolume = container.volume;
        if (containerVolume != null) {
            if (containerVolume < bladder) {
                if (bladder > blademer)
                    //She's desperate and it shows
                    curtext = printList(curtext, list[7]);
                else
                    //Not desperate but the item is too small to hold it all
                    curtext = printList(curtext, list[9]);
                drainBladderBy(containerVolume);
                waitcounter = 4;
            } else {
                //The item can hold her full bladder content
                curtext = printList(curtext, list[8]);
                flushdrank();
            }
        } else {
            if (bladder > blademer)
                //She's desperate and it shows
                curtext = printList(curtext, list[7]);
            else
                //She's doing it for you
                curtext = printList(curtext, list[8]);
            flushdrank();
        }
        sawherpee = 1;
        setAttraction(attraction + 4);
        container.peed = 1;
    }
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function peeintub() {
    let curtext: any[] = [];
    let listenerList: any[] = [];
    const tubConsent = needs["peeintub"][0];  // "Sure you're okay with it?"
    const tubRefusal = needs["peeintub"][1];  // "I'll just wait, thank you very much."
    if (bladder > blademer) {
        curtext = displaygottavoc(curtext);
        curtext.push(tubConsent);
        curtext = displayneed(curtext);
        listenerList.push([[peeintub2, "Continue..."], "peeinTub"]);
    } else {
        curtext.push(tubRefusal);
        curtext = callChoice(["curloc", "Continue..."], curtext);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function peeintub2() {
    let curtext = printListSelection([], needs["peeintub"], range(2, 5));
    flushdrank();
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO do something if you peed outside already(mention to follow your lead)
//TODO she pees outside if she's not bursting
//TODO fix the duplicate code
export function peeoutside() {
    let curtext: any[] = [];
    let listenerList: any[] = [];
    const outsideRepeat = needs["peeoutside"][0]; // embarrassed to pee outside again
    const outsideFirst = needs["peeoutside"][1];  // never gone outside before
    if (attraction > 30) {
        if (bladder > blademer) {
            if (peedoutside)
                curtext.push(outsideRepeat);
            else
                curtext.push(outsideFirst);
            curtext = printListSelection(curtext, needs["peeoutside"], [2, 3]);
            curtext = displayneed(curtext);
            if (locStack[0] === "theMakeOut") listenerList.push([[peeoutside2, "Continue..."], "peeoutside2"]);
            else listenerList.push([[peeoutside2b, "Continue..."], "peeoutside2b"]);

        } else {
            curtext = displaygottavoc(curtext);
            curtext = printListSelection(curtext, needs["peeoutside"], [4, 5]);
            curtext = displayholdquip(curtext);
            gottagoflag = 0;
            curtext = callChoice(["curloc", "Continue..."], curtext);
        }
    } else {
        //TODO this code is almost impossible to reach? since you need at least 40 attraction to get outside
        const outsideRefusal = needs["peeoutside"][6]; // "No way am I exposing my privates"
        curtext.push(outsideRefusal);
        setAttraction(attraction - 3);
        if (attraction < 0) setAttraction(0);
        curtext = callChoice(["curloc", "Continue..."], curtext);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

// In the car
export function peeoutside2() {
    console.log("test");
    let curtext: any[] = [];
    if (pantycolor !== "none") curtext.push(appearance["clothes"][heroutfit]["peeoutsidequote"].format([pantycolor]));
    else curtext.push(appearance["clothes"][heroutfit]["peeoutsidequotebare"]);
    // if (pantycolor !== "none") s(peeoutsidequote);
    // else s(peeoutsidequotebare);
    curtext.push(needs["peeoutside"][7]); // "Are you sure it's safe?"
    // s(girltalk + "Are you sure it's safe?");
    // c("peeoutside3", "Continue...");
    sayText(curtext);
    cListenerGen([peeoutside3, "Continue..."], "peeoutside3");
}

// Not in the car
export function peeoutside2b() {
    let curtext: any[] = [];
    if (pantycolor !== "none") curtext.push(appearance["clothes"][heroutfit]["peeoutsidebquote"]);
    else curtext.push(appearance["clothes"][heroutfit]["peeoutsidebquotebare"]);
    curtext.push(needs["peeoutside"][7]); // "Are you sure it's safe?"
    let listenerList: any[] = [];
    if (locStack[0] === "thebeach") listenerList.push([[peeoutside3c, "Continue..."], "peeoutisde3c"]);
    else listenerList.push([[peeoutside3b, "Continue..."], "peeoutside3b"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

// She was in the car
export function peeoutside3() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(8, 10));
    setAttraction(attraction + 3);
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//  Again, she's not in the car
export function peeoutside3b() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(11, 13));
    setAttraction(attraction + 3);
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//  Pee on the beach
export function peeoutside3c() {
    let curtext = itscomingout([]);
    curtext = printListSelection(curtext, needs["peeoutside"], range(14, 16));
    setAttraction(attraction + 3);
    flushdrank();
    peedoutside = 1;
    sawherpee = 1;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO chance with triggering each other into wetting when desperate
//TODO it's impossible to spurt more than once while it shouldn't be
//Here's actually where we decide if she wet or just spurted
export function wetherself() {
    let curtext = [pickrandom(needs["wetquote"])];
    let listenerList: any[] = [];
    if (randomchoice(spurtthresh) && locStack[0] !== "thehottub" && !shespurted) {
        [curtext, listenerList] = spurtedherself(curtext, listenerList);
    } else {
        spurtthresh = 5;
        if (locStack[0] === "driveout")
            listenerList.push([[wetherself2c, "Continue..."], "wetherself2c"]);
        else if (locStack[0] === "theMakeOut")
            listenerList.push([[wetherself2m, "Continue..."], "wetherself2m"]);
        else if (locStack[0] === "theHotTub")
            listenerList.push([[wetherself2t, "Continue..."], "wetherself2t"]);
        else
            listenerList.push([[wetherself2, "Continue..."], "wetherself2"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function wetherself2(curtext?: any[]) {
    if (!curtext)
        curtext = [];
    const wetHissing = needs["wetherself"][0]; // loud hissing as her bladder empties
    curtext.push(wetHissing);
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    curtext.push(girltalk + pickrandom(needs["embarquote"]));
    sayText(curtext);
    cListenerGen([wetherself3, "Continue..."], "wetherself3");
}

// She's in the makeout spot
export function wetherself2m() {
    const wetPanicMakeOut = needs["wetherself"][1]; // frantically looks around, jumps out of car
    let curtext = [wetPanicMakeOut];
    wetherself2(curtext);
}

// She's in the hottub
export function wetherself2t() {
    let curtext = printListSelection([], needs["wetherself"], range(2, 4));
    flushdrank();
    sayText(curtext);
    cListenerGen([wetherself3t, "Continue..."], "wetherself3t");
}

// She's in the car
export function wetherself2c() {
    let curtext = printListSelection([], needs["wetherself"], range(5, 8));
    flushdrank();
    wetlegs = 1;
    wetherpanties = 1;
    setHasWetTheCar(1);
    sayText(curtext);
    cListenerGen([wetherself3c, "Continue..."], "wetherself3c");
}

export function wetherself3c() {
    let curtext = printListSelection([], needs["wetherself"], [9, 10]);
    setShyness(shyness + 20);
    if (shyness > 100) setShyness(100);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO check this, for unfilled in variables
export function wetherself3() {
    let curtext: any[] = [];
    if (pantycolor !== "none" && shyness < 70) {
        curtext.push(appearance["clothes"][heroutfit]["wetherselfquote"].format([pantycolor]));
        if (attraction > 40) {
            curtext = printListSelection(curtext, needs["wetherself"], [11, 12]);
            backPackItems.wetPanties.value++
        }
        setPantycolor("none");
    } else if (pantycolor === "none")
        curtext.push(needs["wetherself"][13]);
    curtext.push(pickrandom(appearance["clothes"][heroutfit]["dryquote"]));
    if (locStack[0] !== "drinkinggame") {
        setShyness(shyness + 15);
        if (shyness > 100) setShyness(100);
    }
    let listenerList: any[] = [[[scoldher, "Scold her for wetting herself"]]];
    if (haveItem("ptowels")) {
        listenerList.push([[function () {
            giveHer("ptowels");
        }, "Offer her paper towels."], "pTowels"]);
    }
    if (haveItem("sexyPanties")) {
        listenerList.push([[function () {
            giveHer("sexyPanties");
        }, "Offer her a clean pair of panties."], "oPanties"]);
    }
    sayText(curtext);
    listenerList.forEach(item => cListener(item[0], item[1]));
    curtext = callChoice(["curloc", "Continue..."]);
    addSayText(curtext);
    addListenersList(listenerList);
}

// In the tub
export function wetherself3t() {
    let curtext = printListSelection([], needs["wetherself"], range(14, 16));
    setShyness(shyness + 10);
    if (shyness > 100) setShyness(100);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function spurtedherself(curtext: any[], listenerList: any[]): [any[], any[]] {
    console.log("test: spurtedherself");
    drainBladderBy(50);
    spurtthresh -= 0.1 * spurtthresh;
    shespurted = 1;
    curtext.push(pickrandom(needs["spurtquote"]));
    curtext = displayneed(curtext);
    listenerList.push([[askspurted, needs["choices"]["askSpurted"]], "askSpurted"]);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    return [curtext, listenerList];
}

export function askspurted() {
    console.log("askSpurted");
    const askDidYouPee = needs["askspurted"][0]; // "Did you just pee yourself?"
    let curtext = [askDidYouPee];
    curtext.push(pickrandom(needs["spurtquote"]));
    curtext.push(pickrandom(needs["spurtdenyquote"]));
    curtext = displayneed(curtext);
    let listenerList: any[] = [];
    if (locStack[0] !== "thehottub")
        listenerList.push([[checkspurted, needs["choices"]["checkSpurted"]], "checkSpurted"]);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function checkspurted() {
    const dontBelieveYou = needs["askspurted"][1]; // "I'm not sure I believe you."
    let curtext = [dontBelieveYou];
    let listenerList: any[] = [];
    if (attraction < 75) {
        curtext = printListSelection(curtext, needs["askspurted"], [2, 3]);
        curtext = displayneed(curtext);
        setAttraction(attraction - 10);
        setShyness(shyness + 10);
    } else {
        if (pantycolor === "none") {
            curtext = printListSelection(curtext, needs["askspurted"], [4, 5]);
        } else {
            curtext = printListSelection(curtext, needs["askspurted"], [6, 7]);
        }
        if (bladder > blademer)
            curtext.push(pickrandom(needs["feelthigh"]));
        listenerList.push([[smellspurted, needs["choices"]["smellSpurted"]], "smellSpurted"]);
    }
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function smellspurted() {
    console.log("test");
    const sniffFingers = needs["askspurted"][8]; // "You sniff your damp fingers."
    let curtext = [sniffFingers];
    curtext.push(pickrandom(needs["smellpee"]));
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO make this more pleasurable/more BDSM like scolding?
export function scoldher() {
    console.log("test: scoldHer");
    let curtext = printList([], needs["scoldher"]);
    setAttraction(attraction - 20);
    sayText(curtext);
    cListenerGen([comforther, needs["choices"]["comfortHer"]], "comfortHer");
}

//Comfort her after hurting her feelings by scolding her.for wetting.
export function comforther() {
    let curtext = printList([], needs["comforther"]);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    setAttraction(attraction + 5);
    setShyness(shyness - 2);
    sayText(curtext);
}

//
//  It's coming out and she can't stop it
//  used to help describe various pees.
//
export function itscomingout(curtext: any[]): any[] {
    if (!sawherpee)
        curtext.push(girltalk + pickrandom(needs["outpeelook"]));
    else
        curtext.push(girltalk + pickrandom(needs["outpeehide"]));
    curtext.push(girlgasp + pickrandom(needs["outpeectrl"]));
    curtext.push(girltalk + pickrandom(needs["outpeecome"]));
    return curtext;
}

export function pgirlsroom() {
    // pgirlsroom indices: 0=request to watch, 1=she agrees, 2=she refuses, 3=leads to stall, 4=toilet urgency
    let curtext = printList([], peelines["pgirlsroom"][0]); // Player asks "Can I watch?"
    let listenerList: any[] = [];
    if (attraction >= pwatchthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["pgirlsroom"][1]); // She agrees, takes hand
        curtext = displayneed(curtext);
        listenerList.push([[pGirlsRoom2, "Follow her..."], "Follow"]);
        listenerList.push([[indepee, "Change your mind..."], "changeMind"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, peelines["pgirlsroom"][2]); // She refuses
        indepee(curtext);
    }
}

export function pGirlsRoom2() {
    let curtext = printList([], peelines["pgirlsroom"][3]); // She pulls you into stall
    if (bladder < bladlose - 10) setBladder(bladlose - 10);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["pgirlsroom"][4]); // Toilet sight increases urgency
    sayText(curtext);
    cListenerGen([pTogether3, "Continue..."], "pTogether");
}

// ptogether indices: 0=ask not to leave, 1=agrees, 2=refuses, 3=leads to restrooms,
//                    4=peeks into stall, 5=toilet urgency, 6=long line + can't hold it
export function ptogether() {
    let curtext = printList([], peelines["ptogether"][0]); // Ask her not to leave alone
    let listenerList: any[] = [];
    if (attraction >= ptogetherthreshold) {
        pushloc("ptogether");
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["ptogether"][1]); // She agrees
        curtext = displayneed(curtext);
        listenerList.push([[pTogether2, "Follow her..."], "Follow"]);
        listenerList.push([[indepee, "Change your mind..."], "changeMind"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, peelines["ptogether"][2]); // She refuses
        indepee(curtext);
    }
}

//TODO option to make out
//TODO Actually check if she's desperate in the situation where the line's too long
export function pTogether2() {
    let curtext = printList([], peelines["ptogether"][3]); // She leads to restrooms
    let listenerList: any[] = [];
    if (!randomchoice(rrlockedthresh)) {
        curtext = printList(curtext, peelines["ptogether"][4]); // Peeks into stall
        if (bladder < bladlose - 10) setBladder(bladlose - 10);
        curtext = displayneed(curtext);
        curtext = printList(curtext, peelines["ptogether"][5]); // Toilet urgency
        listenerList.push([[pTogether3, "Continue..."], "peeTogether"]);
    } else {
        curtext = printList(curtext, peelines["ptogether"][6]); // Long line, can't hold it
        listenerList.push([[pTogether4, "Invite her into the mens room"], "mensRoom"]);
        listenerList.push([[pTogether5, "Take her out the nearby back door."], "outBack"]);
        listenerList.push([[pTogether6, "Stand around looking dumb."], "giveUp"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function pTogether3() {
    let curtext: any[] = [];
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

export function pTogether3b() {
    sayText(peelines["ptogether"][8]);
    cListenerGen([pTogether3d, "Continue..."], "pTog");
}

export function pTogether3c() {
    sayText(peelines["ptogether"][9]);
    cListenerGen([pTogether3d, "Continue..."], "pTog");
}

export function pTogether3d() {
    sayText(peelines["ptogether"][10]);
    cListenerGen([pTogether3e, "Continue..."], "goBack");
}

export function pTogether3e() {
    let curtext: any[] = [];
    if (locStack[0] === "pmensroom") {
        curtext = printList(curtext, peelines["ptogether"][19]);
        poploc();
    } else
        curtext = printList(curtext, peelines["ptogether"][18]);
    poploc();
    kissher(curtext);
}

// You take her into the mens room
export function pTogether4() {
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

export function pTogether4b() {
    let curtext = printList([], peelines["ptogether"][12]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][13]);
    sayText(curtext);
    cListenerGen([pTogether3, "Continue..."], "pTog");
}

// You take her out back
export function pTogether5() {
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

export function pTogether5a() {
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

export function pTogether5a2() {
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

export function pTogether5b() {
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


export function pTogether5c() {
    let curtext = printList([], peelines["ptogether"][25]);
    if (pantycolor !== "none")
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquote"].format([pantycolor]));
    else
        curtext.push(appearance["clothes"][heroutfit]["ptogetherdumpquotebare"]);
    flushdrank();
    setAttraction(attraction + 6);
    setShyness(shyness - 6);
    sawherpee = 1;
    curtext = printList(curtext, peelines["ptogether"][26]);
    sayText(curtext);
    cListenerGen([doDance, "Continue..."], "doDance");
    poploc();
}

export function pTogether5d() {
    poploc();
    kissher(["You quickly compose yourselves and head back out to the club, but first..."]);
}

// You stand around looking dumb.
export function pTogether6() {
    let curtext = printList([], peelines["ptogether"][27]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, peelines["ptogether"][28]);
    sayText(curtext);
    poploc();
    setAttraction(attraction - 3);
    cListenerGen([doDance, "Continue..."], "doDance");
}

//TODO let her choose.
export function pnorestroom() {
    let curtext = printList([], theatre["noRest"][0]);
    if (attraction >= pnorestroomthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, theatre["noRest"][1]);
        curtext = displayneed(curtext);
        sayText(curtext);
        let listenerList: any[] = [];
        Object.keys(theatre["noToilet"]).forEach(option => {
            const temp = function () {
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

export function noToiletPee(choice: string) {
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
    cListenerGen([noToiletPee2, "Continue..."], "noToiletPee2");
}

export function noToiletPee2() {
    let curtext = printList([], theatre["noRest"][3]);
    kissher(curtext);
}

export function exposeBladderOnWindow() {
    // Mutable variables — getter/setter so mutations stay in sync
    const mutableVars: [string, () => any, (v: any) => void][] = [
        ["customurge", () => customurge, (v) => { customurge = v; }],
        ["minurge", () => minurge, (v) => { minurge = v; }],
        ["minperc", () => minperc, (v) => { minperc = v; }],
        ["bladurge", () => bladurge, (v) => { setBladurge(v); }],
        ["maxtummy", () => maxtummy, (v) => { setMaxtummy(v); }],
        ["maxbeer", () => maxbeer, (v) => { setMaxbeer(v); }],
        ["tummy", () => tummy, (v) => { setTummy(v); }],
        ["bladder", () => bladder, (v) => { setBladder(v); }],
        ["bladDec", () => bladDec, (v) => { bladDec = v; }],
        ["bladDespDec", () => bladDespDec, (v) => { bladDespDec = v; }],
        ["seal", () => seal, (v) => { seal = v; }],
        ["beerdecCounter", () => beerdecCounter, (v) => { beerdecCounter = v; }],
        ["ybeerdecCounter", () => ybeerdecCounter, (v) => { ybeerdecCounter = v; }],
        ["peedtowels", () => peedtowels, (v) => { peedtowels = v; }],
        ["peedvase", () => peedvase, (v) => { peedvase = v; }],
        ["peedshot", () => peedshot, (v) => { peedshot = v; }],
        ["peedoutside", () => peedoutside, (v) => { peedoutside = v; }],
        ["lastpeetime", () => lastpeetime, (v) => { setLastpeetime(v); }],
        ["timeheld", () => timeheld, (v) => { timeheld = v; }],
        ["drankbeer", () => drankbeer, (v) => { drankbeer = v; }],
        ["notdesperate", () => notdesperate, (v) => { notdesperate = v; }],
        ["notydesperate", () => notydesperate, (v) => { notydesperate = v; }],
        ["nothdesperate", () => nothdesperate, (v) => { nothdesperate = v; }],
        ["spurtthresh", () => spurtthresh, (v) => { spurtthresh = v; }],
        ["yspurtthresh", () => yspurtthresh, (v) => { yspurtthresh = v; }],
        ["bribeaskthresh", () => bribeaskthresh, (v) => { bribeaskthresh = v; }],
        ["bribeAskBase", () => bribeAskBase, (v) => { bribeAskBase = v; }],
        ["tumavg", () => tumavg, (v) => { tumavg = v; }],
        ["rrlockedflag", () => rrlockedflag, (v) => { rrlockedflag = v; }],
        ["shespurted", () => shespurted, (v) => { shespurted = v; }],
        ["brokeice", () => brokeice, (v) => { brokeice = v; }],
        ["sawherpee", () => sawherpee, (v) => { sawherpee = v; }],
        ["wetlegs", () => wetlegs, (v) => { wetlegs = v; }],
        ["wetherpanties", () => wetherpanties, (v) => { wetherpanties = v; }],
        ["nowpeeing", () => nowpeeing, (v) => { setNowpeeing(v); }],
        ["gottagoflag", () => gottagoflag, (v) => { gottagoflag = v; }],
        ["askholditcounter", () => askholditcounter, (v) => { askholditcounter = v; }],
        ["waitcounter", () => waitcounter, (v) => { waitcounter = v; }],
        ["toldstories", () => toldstories, (v) => { toldstories = v; }],
        ["lastStory", () => lastStory, (v) => { lastStory = v; }],
    ];
    for (const [name, getter, setter] of mutableVars) {
        Object.defineProperty(window, name, { get: getter, set: setter, configurable: true });
    }
    // Derived thresholds are read-only — computed from urge, direct writes are illegal.
    for (const [name, getter] of [
        ["bladneed", () => bladneed],
        ["blademer", () => blademer],
        ["bladlose", () => bladlose],
        ["bladcumlose", () => bladcumlose],
        ["bladsexlose", () => bladsexlose],
    ] as [string, () => number][]) {
        Object.defineProperty(window, name, { get: getter, configurable: true });
    }

    // Constants — direct assignment
    Object.assign(window, {
        rrlockedthresh, rrlinethresh, phoneholdthresh, tumdecay,
        ptogetherthreshold, pnorestroomthreshold, pwatchthreshold,
        drinkinggamethreshold, photoGameThresholds, hottubthresh,
        holditneedthresh, holditemerthresh, holditlosethresh, gomakeoutthresh,
    });

    // Functions — direct assignment
    Object.assign(window, {
        syncCompanionLegacyThresholdsFromCanonical,
        initUrge, updateurge, interpbladder, calcTuminc, randtuminc,
        flushdrank, showneed, displayneed, displaygottavoc, displayholdquip,
        displaywaited, noteholding,
        askpee, pgirlsroom, pGirlsRoom2, bathroomlocked,
        peein, peein2, peein3, indepee,
        peeoutside, peeoutside2, peeoutside2b, peeoutside3, peeoutside3b, peeoutside3c,
        peeintub, peeintub2, peephone,
        preventpee, allowpee, convinceher, begtoilet,
        holdit, askcanhold, comforther, scoldher,
        bribeask, bribefavor,
        spurtedherself, checkspurted, askspurted, smellspurted,
        wetherself, wetherself2, wetherself2c, wetherself2m, wetherself2t,
        wetherself3, wetherself3c, wetherself3t,
        itscomingout,
        ptogether, pTogether2, pTogether3, pTogether3b, pTogether3c, pTogether3d, pTogether3e,
        pTogether4, pTogether4b,
        pTogether5, pTogether5a, pTogether5a2, pTogether5b, pTogether5c, pTogether5d,
        pTogether6,
        pnorestroom, noToiletPee, noToiletPee2,
        pstory, pstory2,
    });
}