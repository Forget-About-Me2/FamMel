import { fetchJson, printList, sayText, cListenerGen, cListenerGenList, general, appearance, girlname, pantycolor, setPantycolor } from '../quotes';
import { pickrandom, randomchoice, pushloc, poploc, formatAll, getCurrentLocationTag, attraction, setAttraction, shyness, setShyness, flirtcounter, setFlirtcounter, playerbladder } from '../shims';
import { showneed, displayneed, noteholding, interpbladder, wetherself, preventpee, gomakeoutthresh, hottubthresh, flushdrank, bladder, setBladder, tummy, setTummy, gottagoflag, blademer } from '../bladder';
import { displayyourneed, wetyourself, ypeeoutside, yPeeInTub, yourbladder, setYourbladder, yourtummy, setYourtummy, yourblademer } from '../yourbladder';
import { standobjs, backPackItems, allowItems, setAllowItems } from '../backPackItems';
import { kissher, feelup, checkherout } from '../actions';
import { leavehm, driveout } from '../drive';
import { lookAround, locations, sharedLoc } from '../locations';
import { haveSex } from '../fuckHer';
import { gameState } from '../gameState/gameState';
import { BladderState } from '../gameState/bladderState';
import { heroutfit } from '../settings';

export let makeOut; //This stores the JSON quotes regarding the makeOut
export let askedswim = 0; // She's asked about a swim
export function setAskedswim(val: number) { askedswim = val; }
export let walkcounter = 0; // How far have you walked
export function setWalkcounter(val: number) { walkcounter = val; }
export function setMakeOut(val: any) { makeOut = val; }

export function makeOutSetup(){
    fetchJson("locations/makeOut").then(makeOutJson);
    return {
        "visit": [theMakeOut, "Go to the make-out spot"],
        "wantVisit": [theMakeOut, "Take her up to the make-out spot"],
        "group": 1,
        "visited": 0
    }
}

function makeOutJson(data: any){
    makeOut = data;
}

export function theMakeOut() {
    setAllowItems(1);
    let curtext: any[] = [];
    let listenerList: any[] = [];
    // theMakeOut: [0]=arrival (attraction high enough), [1]=attraction too low, [2]=ambient, [3]=rejection
    const [makeOutArrival, attractionLow, makeOutAmbient, makeOutRejection] = makeOut["theMakeOut"];
    if (getCurrentLocationTag() !== "theMakeOut") {
        if (attraction > gomakeoutthresh) {
            curtext = printList(curtext, makeOutArrival);
            pushloc("theMakeOut");
        } else {
            curtext = printList(curtext, attractionLow);
            sayText(curtext);
            listenerList.push([[failMakeOut, "There's this nice secluded spot I know..."], "failMakeOut"]);
            listenerList.push([[driveout, "Ummmm... Actually I'm not sure."]]);
            cListenerGenList(listenerList);
            return
        }
    } else {
        curtext = printList(curtext, makeOutAmbient);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
    }
    locations.makeOut.visited = 1;
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else {
            listenerList.push([[viewStars, makeOut["choices"]["viewStars"]], "viewStars"]);
            listenerList.push([[theWalk, makeOut["choices"]["inviteWalk"]], "theWalk"]);
            if (!locations.theTheatre.foundKey) {
                listenerList.push([[function () {lookAround("theTheatre")}, sharedLoc["choices"]["lookAround"]], "lookAround"]);
            }
            curtext = standobjs(curtext, listenerList);
            if (gameState.Player.bladderState >= BladderState.Urge)
                listenerList.push([[ypeeoutside, makeOut["choices"]["youPeeOutside"]], "ypeeOutside"])
        }
        listenerList.push([[leavehm, makeOut["choices"]["leaveHm"]], "leaveHm"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function failMakeOut() {
    setShyness(shyness + 10);
    setAttraction(attraction - 10);
    const makeOutRejection = makeOut["theMakeOut"][3];
    let curtext = printList([], makeOutRejection);
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGen([driveout, "Okay. Sorry"], "driveOut");
}

//Watch the stars with her.
//When watching the stars a bladder will be filled to emergency if the tummy is sufficiently filled
//When playerbladder is turned on, there's a 30% chance your bladder will be filled.
export function viewStars() {
    // viewStars: [0]=stargazing, [1]=her bladder reacts to cold, [2]=your bladder reacts to cold
    const [stargazing, herBladderCold, yourBladderCold] = makeOut["viewStars"];
    let curtext = printList([], stargazing);
    // s("You hold hands and stare into the sky together.");
    curtext = displayneed(curtext);
    let rand: number | boolean = 1;
    if (playerbladder)
        rand = randomchoice(7);
    if (rand) {
        if (bladder < blademer && tummy > 30) {
            if (tummy >= blademer - bladder) {
                setTummy(tummy - (blademer - bladder));
                setBladder(blademer);
            } else {
                setBladder(bladder + tummy);
                setTummy(0);
            }
            curtext = printList(curtext, herBladderCold);
            // s("The cold weather works some magic on " + girlname + "'s bladder.");
            curtext = displayneed(curtext);
        }
    } else {
        if (yourbladder < yourblademer && tummy > 30) {
            if (yourtummy >= yourblademer - yourbladder) {
                setYourtummy(yourtummy - (yourblademer - yourbladder));
                setYourbladder(yourblademer);
            } else {
                setYourbladder(yourbladder + yourtummy);
                setYourtummy(0);
            }
            //TODO better description
            curtext = printList(curtext, yourBladderCold);
            // s("The cold weather works some magic on your bladder.");
            curtext = displayyourneed(curtext);
        }
    }
    if (flirtcounter < 1) setAttraction(attraction + 5);
    setFlirtcounter(flirtcounter + 4);
    sayText(curtext);
    cListenerGen([theMakeOut, "Continue..."], "Continue...");
}

export function theWalk() {
    setAllowItems(1);
    let curtext: any[] = [];
    // theWalk: [0]=first walk, [1]=ambient, [2]=examine gate, [3]=gate locked,
    //          [4]=gate inviting, [5]=gate leads to beach
    const [walkStart, walkAmbient, gateExamine, gateLocked,
           gateInviting, gateToBeach] = makeOut["theWalk"];
    if (getCurrentLocationTag() !== "theWalk") {
        curtext = printList(curtext, walkStart);
        walkcounter = 0;
        pushloc("theWalk");
    } else {
        curtext = printList(curtext, walkAmbient);
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext)
    let darkYard = randomchoice(2); //There's a 20 percent chance you stumble upon the dark yard.
    // walkDesc: [0]=normal descriptions, [1]=darkYard sighting descriptions
    if (darkYard)
        curtext.push(pickrandom(makeOut["walkDesc"][1]));
    else
        curtext.push(pickrandom(makeOut["walkDesc"][0]));
    walkcounter++;
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else {
            if (darkYard) {
                listenerList.push([[examineGate, makeOut["choices"]["examineGate"]], "examineGate"]);
            }
            if (gameState.Player.bladderState >= BladderState.Urge)
                listenerList.push([[ypeeoutside, makeOut["choices"]["youPeeOutside"]], "yPeeOutside"]);
            curtext = standobjs(curtext, listenerList);
            listenerList.push([[theWalk, makeOut["choices"]["keepWalking"]], "theWalk"]);
        }
        listenerList.push([[exitWalk, makeOut["choices"]["exitWalk"]], "exitWalk"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function exitWalk(){
    let curtext = [makeOut["exitWalk"].formatVars()];
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    poploc();
    sayText(curtext);
    cListenerGen([theMakeOut, "Continue..."], "theMakeOut");
}

export function examineGate() {
    const [,,gateExamine, gateLocked, gateInviting, gateToBeach] = makeOut["theWalk"];
    let curtext = printList([], gateExamine);
    let listenerList: any[] = [];
    if (walkcounter < 10) {
        curtext = printList(curtext, gateLocked);
        if (shyness < 30 && attraction > 75) {
            curtext = printList(curtext, gateInviting);
            listenerList.push([[theYard, "Take her into the dark yard."], "theYard"]);
        }
    } else {
        curtext = printList(curtext, gateToBeach);
        listenerList.push([[theBeach, "Visit the beach."], "theBeach"]);
    }
    listenerList.push([[theWalk, "Continue onward..."], "theWalk"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function theYard() {
    setAllowItems(1);
    let curtext: any[] = [];
    // theYard: named properties for each quote group
    const yardEntry = makeOut["theYard"]["entry"];
    const yardAmbient = makeOut["theYard"]["ambient"];
    const yardDesc = makeOut["theYard"]["description"];
    if (getCurrentLocationTag() !== "theYard") {
        curtext = printList(curtext, yardEntry);
        pushloc("theYard");
    } else {
        curtext = printList(curtext, yardAmbient);
    }

    curtext = printList(curtext, yardDesc);

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (gottagoflag > 0) {
             listenerList = preventpee(listenerList);
        } else {
            listenerList.push([[preHotTub, "Suggest you take a dip in the tub."], "preHotTub"]);
            listenerList.push([[kissher, "Kiss her."], "kissHer"]);
            listenerList.push([[feelup, "Feel her up."], "FeelUp"]);
                curtext = standobjs(curtext, listenerList);
            if (!gameState.Interactions.CheckedHerOut) listenerList.push([[checkherout, "Check her out."], "checkHerOut"]);
            if (gameState.Player.bladderState >= BladderState.Urge) listenerList.push([[ypeeoutside, "Pee outside."], "yPeeOutside"]);
        }
        listenerList.push([[exitYard, "Leave the yard."], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function exitYard(){
    let curtext = [makeOut["exitYard"].formatVars()];
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theWalk, "Continue..."], "theWalk");
}

export function preHotTub() {
    const tubWilling = makeOut["theYard"]["tubWilling"];
    const tubRefused = makeOut["theYard"]["tubRefused"];
    let curtext: any[] = [];
    let listenerList: any[] = [];
    if (attraction > hottubthresh && shyness < 12) {
        curtext = printList(curtext, tubWilling);
        // s(girltalk + "Are you sure it's going to be alright?  What if somebody sees us?");
        curtext = showneed(curtext);
        curtext = displayyourneed(curtext);
        listenerList.push([[theHotTub, "Don't worry - it's really dark out here."], "theHotTub"]);
        listenerList.push([[theYard, "I'm not so sure..."], "theYard"]);
    } else {
        curtext = printList(curtext, tubRefused);
        // s(girltalk + "But I didn't bring a bathing suit!");
        curtext = showneed(curtext);
        curtext = displayyourneed(curtext);
        listenerList.push([[theYard, "I guess not..."], "theYard"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO she can pee in the hottub if she's not about to burst
//TODO fix need dialogue
export function theHotTub() {
    setAllowItems(1);
    const tubEntry = makeOut["theYard"]["tubEntry"];
    const tubAmbient = makeOut["theYard"]["tubAmbient"];
    let curtext: any[] = []
    if (getCurrentLocationTag() !== "theHotTub") {
        curtext = printList(curtext, tubEntry);
        pushloc("theHotTub");
    } else {
        curtext = printList(curtext, tubAmbient);
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Lose) wetherself();
    else if (gameState.Player.bladderState >= BladderState.Lose) wetyourself();
    else {
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else {
            listenerList.push([[kissher, general["kissHer"]], "kissHer"]);
            listenerList.push([[feelup, general["feelUp"]], "FeelUp"]);
            if (attraction >= 130 && shyness <= 0) {
                listenerList.push([[function () {haveSex("theHotTub")}, makeOut["choices"]["makeOut"]], "sexTub"]);
            }
            curtext = standobjs(curtext, listenerList);
            if (gameState.Player.bladderState >= BladderState.Urge)
                listenerList.push([[yPeeInTub, makeOut["choices"]["youPeeInTub"]], "ypeetub"]);
        }
        listenerList.push([[exitHotTub, makeOut["choices"]["exitHotTub"]], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function exitHotTub(){
    let curtext = printList([], makeOut["exitHotTub"]);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theYard, "Continue..."], "theYard");

}

// theBeach indices legend:
//  [0]=first arrival, [1]=ambient, [2]=she asks to swim,
//  [3]=you join swim, [4]=panty warning response, [5]=standing naked,
//  [6]=standing in panties (formatted w/ color), [7]=invites you in,
//  [8]=waist-deep walk, [9]=wave hits bare crotch, [10]=wave soaks panties (formatted),
//  [11]=she squeezes your hand, [12]=take her in arms, [13]=bare pressed against leg,
//  [14]=wet panties pressed against leg, [15]=she confesses need to pee,
//  [16]=she swims away, [17]=pees naked, [18]=pees in panties,
//  [19]=hold her close (she pees against you), [20]=dry off,
//  [21]=she gives you wet panties
export function theBeach() {
    setAllowItems(1);
    let curtext: any[] = [];
    const [beachArrival, beachAmbient, askSwim] = makeOut["theBeach"];
    if (getCurrentLocationTag() !== "theBeach") {
        curtext = printList(curtext, beachArrival);
        pushloc("theBeach");
        askedswim = 0;
    } else {
        curtext = printList(curtext, beachAmbient);
        if (askedswim > 0) askedswim--;
    }

    let listenerList: any[] = [];
    if ((gameState.Companion.bladderState >= BladderState.Emergency && (shyness > 15 || randomchoice(1)) && !askedswim)) {
        curtext = displayneed(curtext);
        askedswim = 7;
        curtext = printList(curtext, askSwim);
        listenerList.push([[beachSwim, makeOut["choices"]["beachSwim"]], "beachSwim"]);
        listenerList.push([[theBeach, makeOut["choices"]["denySwim"]], "theBeach"]);
    } else {
        curtext = showneed(curtext);
        curtext = displayyourneed(curtext);
        if (gameState.Companion.bladderState >= BladderState.Lose) {
            wetherself();
            return;
        }
        else if (gameState.Player.bladderState >= BladderState.Lose) {
            wetyourself();
            return;
        }
        else {
            if (gottagoflag > 0) {
                listenerList = preventpee(listenerList);
            } else {
                listenerList.push([[kissher, general["kissHer"]], "kissHer"]);
                listenerList.push([[feelup, general["feelUp"]], "FeelUp"]);
                curtext = standobjs(curtext, listenerList);
                if (!gameState.Interactions.CheckedHerOut) listenerList.push([[checkherout, general["checkHerOut"]], "checkHerOut"]);
                if (gameState.Player.bladderState >= BladderState.Urge) listenerList.push([[ypeeoutside, makeOut["choices"]["youPeeOutside"]], "yPeeOutside"]);
                if (attraction > 100 && shyness < 10)
                    listenerList.push([[function () {haveSex("theBeach")}, makeOut["choices"]["makeOut"]], "sexTub"]);
            }
            listenerList.push([[leaveBeach, makeOut["choices"]["leaveBeach"]], "goBack"]);
        }
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function beachSwim() {
    let curtext = [girlname + appearance["clothes"][heroutfit]["swimstripquote"]];
    if (pantycolor === "none")
        curtext.push(appearance["clothes"][heroutfit]["swimstripquotebare"]);
    else
        curtext.push(appearance["clothes"][heroutfit]["swimstripquotepanties"].format([pantycolor]));
    let listenerList: any[] = [];
    listenerList.push([[beachSwim2, "Join her."], "join"]);
    if (pantycolor !== "none")
        listenerList.push([[beachSwim2b, "Tell her that her panties are going to get wet."], "panties"]);
    listenerList.push([[beachSwim2c, "Stand and watch."], "stand"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function beachSwim2() {
    let curtext = printList([], makeOut["theBeach"][3]); // you join swim
    // s("You peel off your clothes and take her hand, walking slowly into the warm water.");
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    // s("It's dark, so you can't really see what she's doing.  You hear the swooshing of the water as you walk together.");
    const listenerList = [
        [[beachSwim3b, "Take her in your arms ..."], "TakeArms"],
        [[beachSwim3, "Continue..."], "beachSwim3"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function beachSwim2b() {
    sayText(makeOut["theBeach"][4]); // panty warning response
    // s("<b>YOU:</b> But your panties - they'll get wet!");
    // s(girltalk + " How do you know they're not already wet?");
    // s("She has a point there.");
    cListenerGen([beachSwim2, "Continue..."], "beachSwim");
}

export function beachSwim2c() {
    let curtext: any[] = [];
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][5]); // standing naked
    else {
        let list = new Array(makeOut["theBeach"][6].length).fill(pantycolor);
        curtext = printList(curtext, formatAll(makeOut["theBeach"][6], list)); // standing in panties
    }
    curtext = printList(curtext, makeOut["theBeach"][7]); // invites you in
    // s(girltalk + " Aren't you going to come with me?");
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    // s("How can you resist the invitation of a sexy, naked girl to join her swimming?");
    sayText(curtext);
    cListenerGen([beachSwim2, "Of course I'll come with you."], "ofCourse");
}

export function beachSwim3() {
    let curtext = printList([], makeOut["theBeach"][8]); // waist-deep walk
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][9]); // wave hits bare crotch
    else{
        let list = new Array(makeOut["theBeach"][10].length).fill(pantycolor);
        curtext = printList(curtext, formatAll(makeOut["theBeach"][10], list)); // wave soaks panties
    }
    curtext = printList(curtext, makeOut["theBeach"][11]); // she squeezes your hand
    const listenerList = [
      [[beachSwim4b, "Feel her up."], "feelHer"],
      [[beachSwim4, "Continue..."], "beachSwim"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO tell her you got to go too.
export function beachSwim3b() {
    let curtext = printList([], makeOut["theBeach"][12]); // take her in arms
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][13]); // bare pressed against leg
    else
        curtext = printList(curtext, makeOut["theBeach"][14]); // wet panties pressed against leg
    curtext = printList(curtext, makeOut["theBeach"][15]); // confesses need to pee
    const listenerList = [
        [[beachSwim4b, "Hold her close."], "holdHer"],
        [[beachSwim4, "Let her go."], "letGo"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function beachSwim4() {
    let curtext = printList([], makeOut["theBeach"][16]); // she swims away
    flushdrank();
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][17]); // pees naked
    else
        curtext = printList(curtext, makeOut["theBeach"][18]); // pees in panties
    sayText(curtext);
    cListenerGen([beachSwim5, "Continue..."], "beachSwim");
}

export function beachSwim4b() {
    let curtext = printList([], makeOut["theBeach"][19]); // hold her close (pees against you)
    flushdrank();
    sayText(curtext);
    cListenerGen([beachSwim5, "Continue..."], "beachSwim");
}

export function beachSwim5() {
    let curtext = printList([], makeOut["theBeach"][20]); // dry off
    if (pantycolor !== "none") {
        curtext = printList(curtext, makeOut["theBeach"][21]); // gives you wet panties
        backPackItems.wetPanties.value += 1;
        setPantycolor("none");
    }
    sayText(curtext);
    cListenerGen([theBeach, "Continue..."], "theBeach");
}

export function leaveBeach(){
    let curtext = [makeOut["leaveBeach"].formatVars()];
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theWalk, "Continue..."], "theWalk");
}

export function exposeTheMakeOutOnWindow(): void {
    const w = window as any;
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['makeOut', () => makeOut, (v) => { makeOut = v; }],
        ['askedswim', () => askedswim, (v) => { askedswim = v; }],
        ['walkcounter', () => walkcounter, (v) => { walkcounter = v; }],
    ];
    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, { get: getter, set: setter, configurable: true, enumerable: true });
    }
    w.makeOutSetup = makeOutSetup;
    w.theMakeOut = theMakeOut;
    w.failMakeOut = failMakeOut;
    w.viewStars = viewStars;
    w.theWalk = theWalk;
    w.exitWalk = exitWalk;
    w.examineGate = examineGate;
    w.theYard = theYard;
    w.exitYard = exitYard;
    w.preHotTub = preHotTub;
    w.theHotTub = theHotTub;
    w.exitHotTub = exitHotTub;
    w.theBeach = theBeach;
    w.beachSwim = beachSwim;
    w.beachSwim2 = beachSwim2;
    w.beachSwim2b = beachSwim2b;
    w.beachSwim2c = beachSwim2c;
    w.beachSwim3 = beachSwim3;
    w.beachSwim3b = beachSwim3b;
    w.beachSwim4 = beachSwim4;
    w.beachSwim4b = beachSwim4b;
    w.beachSwim5 = beachSwim5;
    w.leaveBeach = leaveBeach;
}

