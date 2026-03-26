//Your bladder variables
let yourbladder = 500;
let yourtummy = 200;
let yourtumavg = yourtummy;
let holdself = 0;
const holdpeethresh = 3; //Chance you'll still pee yourself even though you're holding your dick.

let yourbladurge = 500; // Level where you feel the first urge
let yourbladneed = yourbladurge * 2; // Level where you continuously needs to go
let yourblademer = yourbladurge * 3; // Level where it becomes an emergency
let yourbladlose = yourbladurge * 3 + 150; // Level where you lose control
let yourbladcumlose = yourbladurge * 4; // Level where you lose it as you cum
let yourbladsexlose = yourbladurge * 5; // Level where you can't control it during sex

let ymaxtummy = 500; // Drink capacity of stomach
let ymaxbeer = 1000; // Beer capacity of stomach

let yourcustomurge = 500;
let yminurge = 375; // min bladder urge
let ynowpeeing = 0; // flag: you are currently peeing

//  The following are used to keep track of what you drank and when you last went
// Might be used later on.
let ylastpeetime = 0;  // When did you last go?
let ytimeheld = 0; // for stats

let ydrankcocktails = 0;
let ydranksodas = 0;
let ydrankwaters = 0;
let ydrankbeers;

let ydrankbeer = 0; //Did you drink beer? changes capacities and rates.

let yrrlockedflag = 0; //Restroom was locked last time you went

//Initializes the bladder values for you
function initYUrge(urge: number){
    yminurge = urge * minperc/100;
    updateyoururge(urge);
}

function updateyoururge(newurge: number) {
    if (newurge < yminurge) newurge = yminurge;
    newurge = Math.round(newurge);
    yourbladurge = newurge;
    yourbladneed = newurge * 2;
    yourblademer = newurge * 3;
    yourbladlose = newurge * 3 + 150;
    yourbladcumlose = newurge * 4;
    yourbladsexlose = newurge * 5
}

function flushyourdrank() {
    //  Derate bladder capacity if you loses it...
    if (bladDec) {
        if (yourbladder >= yourbladlose) updateyoururge(yourbladurge * 9 / 10);
        else if (yourbladder >= yourblademer && bladDespDec) updateyoururge(yourbladurge * 9.5 / 10);
        //bladder decays based on breaking the seal can only happen once an hour
        else if (seal && ydrankbeer > 15 && ybeerdecCounter > 30) {
            updateyoururge(yourbladurge * 9.5 / 10);
            ybeerdecCounter = 0;
        }
    }

    yourbladder = 0;
    ydrankwaters = 0;
    ydrankcocktails = 0;
    ydrankbeers = 0;
    ydranksodas = 0;
    ylastpeetime = thetime;
    yrrlockedflag = 0;
    ynowpeeing = 1;
}

//TODO lose control when bursting on the way
//TODO add a chance of her denying you
function youpee() {
    let curtext = [];
    gottagoflag = 0;
    let peed = 0;
    const currentLocation = locStack[0];
    // ypeelines["thehome"]: [0]=asking to use toilet, [1]=peeing description
    const [askToiletLines, peeDescription] = ypeelines["thehome"];

    if (currentLocation === "yourhome") {
        curtext = printList(curtext, ypeelines["yourhome"]);
        peed = 1
    } else if (currentLocation === "theHome" ||
        currentLocation === "thebedroom" || currentLocation === "pickup" || currentLocation === "fuckher6") {
        if(currentLocation !== "fuckher6") {
            curtext = printList(curtext, askToiletLines);
        }
        curtext = printList(curtext, peeDescription);
        peed = 1
    } else {
        curtext = printList(curtext, ypeelines["remaining"]);
    }

    if ((currentLocation === "thebar" && randomchoice(rrlockedthresh) ) ||
        ((currentLocation === "theclub" || currentLocation === "dodance") && randomchoice(rrlinethresh)) ||
        (currentLocation === "themovie" && randomchoice(rrMovieLineThresh) || currentLocation === "domovie" && randomchoice(rrMovieLineThresh))) {
        allowItems = 1;
        curtext = youbathroomlocked(curtext);
    } else if (currentLocation === "darkBar" || currentLocation === "darkTheatre" || currentLocation === "darkclub") {
        //TODO potentially cycle between quotes
        if (yourbladder > yourbladlose - 25)
            curtext.push(ypeelines["youpeeprivate"][0]);
        else
            curtext.push(ypeelines["youpeeprivate2"][0]);
        flushyourdrank();
    } else {
        if (yourbladder > yourbladlose - 25 && !peed)
            curtext.push(pickrandom(ypeelines["youpeeprivate"]));
        else if (!peed)
            curtext.push(pickrandom(ypeelines["youpeeprivate2"]));
        flushyourdrank();
    }
    if (yourbladder >= yourbladlose - 25 && currentLocation !== "thehottub") curtext = youbegtoilet(curtext);
    else {
        curtext = c([currentLocation, "Continue..."], curtext);
    }
    sayText(curtext);
}

function youbathroomlocked(curtext: any[]): any[] {
    const locked = ypeelines["locked"];
    //Description of the situation
    if (locStack[0] === "thebar")
        curtext = printList(curtext, locked["bar"]);
    else {
        curtext = printList(curtext, locked["club"]);
    }
    const [emergencyReaction, uncomfortableReaction, unfulfilledReaction] = locked["urgency"];

    //Description of your reaction, based on how badly you have to go
    if (yourbladder > yourblademer)
        curtext.push(emergencyReaction);
    else if (yourbladder > yourbladneed)
        curtext.push(uncomfortableReaction);
    else
        curtext.push(unfulfilledReaction);

    // Complaint arrays ordered from most frustrated (4+ attempts) to first attempt
    const isBar = locStack[0] === "thebar";
    const [fourthPlusAttempt, thirdAttempt, secondAttempt, firstAttempt] =
        isBar ? locked["cbar"] : locked["cclub"];

    if (yrrlockedflag > 3) {
        curtext.push(fourthPlusAttempt);
    } else if (yrrlockedflag > 2) {
        curtext.push(thirdAttempt);
    } else if (yrrlockedflag) {
        curtext.push(secondAttempt);
    } else {
        curtext.push(firstAttempt);
    }

    yrrlockedflag++; //Increase how often you tried
    curtext = displayneed(curtext);
    return curtext;
}

//TODO make this more fancy
function youbegtoilet(curtext: any[]): any[] {
    const [begDialogue, begChoices] = ypeelines["beg"];
    const [shotglassChoice, vaseChoice, noIdeasChoice] = begChoices;
    curtext = printList(curtext, begDialogue);
    if (haveItem("shotglass")) curtext = callChoice(shotglassChoice, curtext);
    if (haveItem("vase")) curtext = callChoice(vaseChoice, curtext);
    curtext = callChoice(noIdeasChoice, curtext);
    return curtext;
}

function displayyourneed(curtext: any[]): any[] {
    if (yourbladder >= yourbladlose && !holdself) {
        curtext.push(pickrandom(yneeds["burst"]));
    } else if (yourbladder > yourblademer) {
        curtext.push(pickrandom(yneeds["desperate"]));
    } else if (yourbladder > yourbladneed) {
        curtext.push(pickrandom(yneeds["need"]));
    } else if (yourbladder > yourbladurge) {
        curtext.push(pickrandom(yneeds["urge"]));
    } else if (locStack[0] === "drinkinggame") {
        curtext.push(pickrandom(yneeds["empty"]));
    }
    return curtext
}

function ypeein(item: string){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    const list = yneeds[item];
    let curtext = [];

    // Urgency levels used as indices into per-item dialogue arrays
    const URGENCY_MILD = 0;        // just an urge
    const URGENCY_MODERATE = 1;    // needs to go
    const URGENCY_DESPERATE = 2;   // emergency
    const URGENCY_ALONE = 3;       // alone, no interaction

    // yneeds[item] structure:
    //   [0] = initial quotes (indexed by urgency), [1] = driving handoff,
    //   [2] = non-driving handoff, [3] = unzipping description (indexed by urgency),
    //   [4] = desperate peeing, [5] = non-desperate peeing,
    //   [6] = result (indexed by urgency, then [0]=partial/[1]=full)
    const [initialQuotes, drivingHandoff, standingHandoff, unzipDescription,
           desperatePeeing, normalPeeing, peeResult] = list;

    let yneedtype = URGENCY_MILD;
    if (yourbladder>yourblademer)
        yneedtype = URGENCY_DESPERATE;
    else if (yourbladder>yourbladneed)
        yneedtype = URGENCY_MODERATE;
    //When you're alone you don't have an interaction with her.
    if (playOnly.includes(locStack[0])) {
        //TODO you call out to her when desperate in one of the quotes.
        curtext.push(initialQuotes[URGENCY_ALONE]);
        curtext = callChoice(["ypeein2(&quot;" + item + "&quot;," + yneedtype + ")", "Continue..."], curtext);
    } else {
        //Prints a quote about how full you are and what you are planning to do.
        curtext.push(initialQuotes[yneedtype]);
        //If she doesn't like you enough she'll act embarrassed and prevent you from doing this.
        if (yneedtype === URGENCY_MILD && attraction > 100 ||
            yneedtype === URGENCY_MODERATE && attraction > 70 ||
            yneedtype === URGENCY_DESPERATE && attraction > 30){
            if (yneedtype === URGENCY_DESPERATE) {
                // if you're desperate print a quote about giving her the item so you can focus on your trousers
                if (locStack[0] === "driveout")
                    //The quote is slightly different when you're driving
                    curtext = printList(curtext, drivingHandoff);
                else
                    curtext = printList(curtext, standingHandoff);

            }
            //Prints a description of undoing your pants, depending on how bad you have to go.
            curtext = printList(curtext, unzipDescription[yneedtype]);
            curtext = callChoice(["ypeein2(&quot;" +item+ "&quot;," + yneedtype + ")", "Continue..."], curtext);
        } else {
            curtext.push("\"Are you out of your mind!?\" She hisses urgently. \"You can't do that! What if someone sees?!\"");
            curtext.push("You sigh, but put away the " + backPackItems[item].bpname.toLowerCase() + ".");
            curtext = callChoice(["curloc", "Continue..."], curtext);
            attraction -= Math.round(10 / (yneedtype + 1));
        }
    }
    sayText(curtext);
}

function ypeein2(item: string, yneedtype: number){
    const URGENCY_DESPERATE = 2;
    const [, , , , desperatePeeing, normalPeeing] = yneeds[item];
    let curtext = [];
    if (yneedtype === URGENCY_DESPERATE)
        curtext = printList([], desperatePeeing);
    else
        curtext = printList(curtext, normalPeeing);
    curtext = callChoice(["ypeein3(&quot;" +item+ "&quot;," + yneedtype + ")", "Continue..."], curtext);
    sayText(curtext);
}

function ypeein3(item: string, yneedtype: number){
    const URGENCY_DESPERATE = 2;
    let curtext = [];
    if (yourbladder < yourbladurge){
        curtext.push("You try your best, but you just can't manage to push anything out.");
        curtext.push("With a sigh, you zip your trousers back up.");
        curtext.push("<b>You:</b> It's not happening, I'll try again later when my bladder is a bit fuller.");
    } else {
        const container = backPackItems[item];
        const peeResult = yneeds[item][6]; // result text indexed by [urgency][0=partial/1=full]
        if (container.hasOwnProperty("volume")){
            if (container.volume < yourbladder){
                const PARTIAL_FILL = 0;
                const FULL_FILL = 1;
                if (yneedtype === URGENCY_DESPERATE)
                    curtext.push(peeResult[yneedtype][FULL_FILL]);
                else
                    curtext.push(peeResult[yneedtype][PARTIAL_FILL]);
                if (yourbladder > yourblademer)
                    curtext.push("YOU: Damn. That's not much better.");
                yourbladder -= container.volume;
            } else {
                //The item can hold your full bladder contents
                curtext.push(peeResult[yneedtype][1]);
                flushyourdrank();
            }
        } else{
            curtext = printList(curtext, peeResult[yneedtype]);
            flushyourdrank();
        }
        attraction += Math.round(10 / (yneedtype + 1));
    }
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO better scene
function yPeeInTub() {
    sayText(ypeelines["peeTub"]);
    flushyourdrank();
    cListenerGen([theHotTub, "Continue..."], "theHotTub");
}

// peeOutside array indices:
//   0=casual announcement, 1=desperate announcement, 2=she asks to watch,
//   3=step out of car, 4=standing unzip, 5=car strip tease, 6=freed + mesmerized,
//   7=standing strip tease, 8=pee by car, 9=slight turn away, 10=zip-up arousal,
//   11=watched pee car, 12=she touches you
function ypeeoutside() {
    let curtext = [];
    if (yourbladder < yourblademer)
        curtext = printList(curtext, ypeelines["peeOutside"][0]); // casual announcement
    else {
        curtext = printList(curtext, ypeelines["peeOutside"][1]); // desperate announcement
    }
    let listenerList = [];
    if (attraction > 100 && shyness < 10 && randomchoice(7)){
        curtext = printList(curtext, ypeelines["peeOutside"][2]); // she asks to watch
        listenerList.push([[ypeeOutsideWatch, "Of Course!"], "peeWatch"]);
    } else {
        listenerList.push([[yPeeOutside2, "Continue..."], "peeOutside"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

//She didn't ask to watch
function yPeeOutside2() {
    let curtext = [];
    let listenerList = [];
    if (locStack[0] === "theMakeOut"){
        curtext = printList(curtext, ypeelines["peeOutside"][3]); // step out of car
        listenerList.push([[yPeeOutsideCar, "Continue..."], "peeOutCar"]);
    } else {
        curtext = printList(curtext, ypeelines["peeOutside"][4]); // standing unzip
        listenerList.push([[yPeeOutside3, "Continue..."], "peeOutside"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function yPeeOutsideCar() {
    sayText(ypeelines["peeOutside"][8]); // pee by car
    flushyourdrank();
    cListenerGen([theMakeOut, "Continue..."], "theMakeOut");
}

//You're not in the car, either at the beach, dark yard, or on the walk. The text is located in the ypeeline json under the current location.
function yPeeOutside3(){
    let curtext = printList([], ypeelines["peeOutside"][9]); // slight turn away
    //TODO have different quotes for theWalk and theYard
    curtext = printList(curtext, ypeelines[locStack[0]][0]);
    curtext = printList(curtext, ypeelines["peeOutside"][10]); // zip-up arousal
    curtext = callChoice(["curloc", "Continue..."], curtext);
    flushyourdrank();
    sayText(curtext);
}

//She asked to watch
function ypeeOutsideWatch(){
    let curtext = [];
    let listenerList = [];
    if (locStack[0] === "theMakeOut"){
        curtext = printList(curtext, ypeelines["peeOutside"][5]); // car strip tease
        curtext = printList(curtext, ypeelines["peeOutside"][6]); // freed + mesmerized
        listenerList.push([[yPeeOutsideWatchCar, "Continue..."], "peeOutCar"]);
    } else {
        curtext = printList(curtext, ypeelines["peeOutside"][7]); // standing strip tease
        curtext = printList(curtext, ypeelines["peeOutside"][6]); // freed + mesmerized
        listenerList.push([[yPeeOutsideWatch2, "Continue..."], "peeOut"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function yPeeOutsideWatchCar() {
    sayText(ypeelines["peeOutside"][11]); // watched pee car
    flushyourdrank();
    cListenerGen([theMakeOut, "Continue..."], "theMakeOut");
}

//You're not in the car, either at the beach or on the walk. The text is located in the ypeeline json under the current location.
function yPeeOutsideWatch2(){
    let curtext = printList([], ypeelines["peeOutside"][12]); // she touches you
    curtext = printList(curtext, ypeelines[locStack[0]][1]);
    curtext = printList(curtext, ypeelines["peeOutside"][13]); // she strokes, arousal
    curtext = callChoice(["curloc", "Continue..."], curtext);
    flushyourdrank();
    sayText(curtext);
}


//Here's where we decide if you wet yourself or if you just spurted.
//TODO more original quotes (most are now stolen from her)
//TODO fix timings
function wetyourself() {
    let curtext = [pickrandom(yneeds["wetquote"])];
    sayText(curtext);
    if (randomchoice(yspurtthresh) && locStack[0] !== "thehottub") {
        spurtedyourself(curtext);
    } else {
        yspurtthresh = 3;
        if (locStack[0] === "driveout")
            cListenerGen([wetyourself2c, "Continue ..."], "wetyourself");
        else if (locStack[0] === "themakeout")
            cListenerGen([wetyourself2m, "Continue ..."], "wetyourself");
        else if (locStack[0] === "thehottub")
            cListenerGen([wetyourself2t, "Continue ..."],"wetyourself");
        else
            cListenerGen([wetyourself2, "Continue ..."], "wetyourself");
    }
}

//TODO register you wet your pants
function wetyourself2(curtext?: any[]) {
    if (!curtext)
        curtext = [];
    curtext = printList(curtext, yneeds["wetyourself"][0]);
    flushyourdrank();
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

//You're in the make out spot
function wetyourself2m() {
    let curtext = yneeds["wetyourself"][1];
    wetyourself2(curtext);
}

//You're in the hottub
function wetyourself2t() {
    let curtext = yneeds["wetyourself"][2];
    sayText(curtext);
    flushyourdrank();
    cListenerGen([wetyourself3t, "Continue ..."], "wetyourself");
}

//You're in the car
//TODO register you wet the car
function wetyourself2c() {
    let curtext = yneeds["wetyourself"][3];
    sayText(curtext);
    flushyourdrank();
    cListenerGen([wetyourself3c, "Continue ..."], "wetyourself");
}

function wetyourself3c() {
    let curtext = yneeds["wetyourself"][4];
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}


//In the tub
function wetyourself3t() {
    let curtext = yneeds["wetyourself"][5];
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

let youSpurted = 0;
//TODO more text options and her reponse
function spurtedyourself(curtext: any[]) {
    yourbladder -= 50;
    yspurtthresh -= 0.1 * yspurtthresh;
    youSpurted = 1;
    curtext.push(yneeds["spurtquote"]);
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}