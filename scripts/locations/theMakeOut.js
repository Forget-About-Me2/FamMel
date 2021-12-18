let makeOut; //This stores the JSON quotes regarding the makeOut

function makeOutSetup(){
    getjson("locations/makeOut", makeOutJson);
    return {
        "visit": [theMakeOut, "Go to the make-out spot"],
        "wantVisit": [theMakeOut, "Take her up to the make-out spot"],
        "group": 1,
        "visited": 0
    }
}

function makeOutJson(){
    makeOut = json;
    makeOut["theMakeOut"] = formatAllVarsList(makeOut["theMakeOut"]);
    makeOut["viewStars"] = formatAllVarsList(makeOut["viewStars"]);
    makeOut["theWalk"] = formatAllVarsList(makeOut["theWalk"]);
    makeOut["theYard"] = formatAllVarsList(makeOut["theYard"]);
    makeOut["theBeach"] = formatAllVarsList(makeOut["theBeach"]);
}

function theMakeOut() {
    let curtext = [];
    let listenerList = [];
    if (locstack[0] !== "theMakeOut") {
        if (attraction > gomakeoutthresh) {
            curtext = printList(curtext, makeOut["theMakeOut"][0]);
            // s("You and " + girlname + " drive up to the make-out spot.  It's dark and deserted, but has a beautiful view of the stars.");
            pushloc("theMakeOut");
        } else {
            curtext = printList(curtext, makeOut["theMakeOut"][1]);
            // s("You start to drive out to the makeout spot, up a winding hilly road.");
            // s(girltalk + "Hey! Where are we going?");
            sayText(curtext);
            listenerList.push([[failMakeOut, "There's this nice secluded spot I know..."], "failMakeOut"]);
            listenerList.push([[driveout, "Ummmm... Actually I'm not sure."]]);
            cListenerGenList(listenerList);
            return
        }
    } else {
        curtext = printList(curtext, makeOut["theMakeOut"][2]);
        // s("You and " + girlname + " are at the make-out spot.");
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
    }
    locations.makeOut.visited = 1;
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
            listenerList.push([[peeoutside, "Suggest that she pees outside."], "peeOutside"]);
        } else {
            listenerList.push([[viewStars, "Suggest that you gaze at the stars."], "viewStars"]);
            listenerList.push([[theWalk, "Invite " + girlname + " to take a walk."], "theWalk"]);
            if (!locations.theTheatre.foundKey) {
                listenerList.push([[function () {lookAround("theTheatre")}, "look around."], "lookAround"]);
            }
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                listenerList.push([[ypeeoutside, "Pee outside."], "ypeeOutside"])
        }
        listenerList.push([[leavehm, "Drive off."], "leaveHm"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function failMakeOut() {
    shyness += 10;
    attraction -= 10;
    let curtext = printList([], makeOut["theMakeOut"][3]);
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGen([driveout, "Okay. Sorry"], "driveOut");
}

//Watch the stars with her.
//When watching the stars a bladder will be filled to emergency if the tummy is sufficiently filled
//When playerbladder is turned on, there's a 30% chance your bladder will be filled.
function viewStars() {
    let curtext = printList([], makeOut["viewStars"][0]);
    // s("You hold hands and stare into the sky together.");
    curtext = displayneed(curtext);
    let rand = 1;
    if (playerbladder)
        rand = randomchoice(7);
    if (rand) {
        if (bladder < blademer && tummy > 30) {
            if (tummy >= blademer - bladder) {
                tummy -= (blademer - bladder);
                bladder = blademer;
            } else {
                bladder += tummy;
                tummy = 0;
            }
            curtext = printList(curtext, makeOut["viewStars"][1]);
            // s("The cold weather works some magic on " + girlname + "'s bladder.");
            curtext = displayneed(curtext);
        }
    } else {
        if (yourbladder < yourblademer && tummy > 30) {
            if (yourtummy >= yourblademer - yourbladder) {
                yourtummy -= (yourblademer - yourbladder);
                yourbladder = yourblademer;
            } else {
                yourbladder += yourtummy;
                yourtummy = 0;
            }
            //TODO better description
            curtext = printList(curtext, makeOut["viewStars"][2]);
            // s("The cold weather works some magic on your bladder.");
            curtext = displayyourneed(curtext);
        }
    }
    if (flirtcounter < 1) attraction += 5;
    flirtcounter += 4;
    sayText(curtext);
    cListenerGen([theMakeOut, "Continue..."], "Continue...");
}

function theWalk() {
    let curtext = [];
    if (locstack[0] !== "theWalk") {
        curtext = printList(curtext, makeOut["theWalk"][0]);
        // s("You and " + girlname + " decide to take a walk.  It's a warm, still night.");
        walkcounter = 0;
        pushloc("theWalk");
    } else {
        curtext = printList(curtext, makeOut["theWalk"][1]);
        // s("You and " + girlname + " are talking a walk together.");
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext)
    let darkYard = randomchoice(2); //There's a 20 percent chance you stumble upon the dark yard.
    if (darkYard)
        curtext.push(pickrandom(makeOut["walkDesc"][1]));
    else
        curtext.push(pickrandom(makeOut["walkDesc"][0]));
    walkcounter++;
    let listenerList = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
            listenerList.push([[peeoutside, "Suggest that she pees on the ground."]]);
        } else {
            if (darkYard) {
                listenerList.push([[examineGate, "Investigate the open gate."], "examineGate"]);
            }
            if (yourbladder > yourbladurge)
                listenerList.push([[ypeeoutside, "Pee outside."], "yPeeOutside"]);
                // c("ypeeoutside", "Pee outside.");
            curtext = standobjs(curtext);
            listenerList.push([[theWalk, "Keep walking..."], "theWalk"]);
        }
        listenerList.push([[exitWalk, "Walk back to the car."], "exitWalk"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

function exitWalk(){
    let curtext = makeOut["exitWalk"].formatVars();
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    poploc();
    sayText(curtext);
    cListenerGen([theMakeOut, "Continue..."], "theMakeOut");
}

function examineGate() {
    let curtext = printList([], makeOut["theWalk"][2]);
    // s("You slowly open the gate and peer behind.");
    let listenerList = [];
    if (walkcounter < 10) {
        curtext = printList(curtext, makeOut["theWalk"][3]);
        // s("The yard beyond is dark, illuminated only by starlight.");
        if (shyness < 30 && attraction > 75) {
            curtext = printList(curtext, makeOut["theWalk"][4]);
            // s(girltalk + "Hey!  Let's check it out.");
            listenerList.push([[theYard, "Take her into the dark yard."], "theYard"]);
        }
    } else {
        curtext = printList(curtext, makeOut["theWalk"][5]);
        // s(girlname + " gasps: We've made it to the beach!");
        // s("There's sand beyond the gate, and you can hear the calm waves breaking on the shore.");
        listenerList.push([[theBeach, "Visit the beach."], "theBeach"]);
    }
    listenerList.push([[theWalk, "Continue onward..."], "theWalk"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

function theYard() {
    let curtext = [];
    if (locstack[0] !== "theYard") {
        curtext = printList(curtext, makeOut["theYard"][0]);
        // s("You and " + girlname + " quietly enter the yard.  The grass is soft and slightly damp under your feet.");
        pushloc("theYard");
    } else {
        curtext = printList(curtext, makeOut["theYard"][1]);
        // s("You and " + girlname + " are in somebody's back yard.");
    }

    curtext = printList(curtext, makeOut["theYard"][2]);
    // s("There is a hot tub here.");

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    let listenerList = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
            listenerList.push([[peeoutside, "Suggest that she pee on the ground."], "peeOutside"]);
        } else {
            listenerList.push([[preHotTub, "Suggest you take a dip in the tub."], "preHotTub"]);
            listenerList.push([[kissher, "Kiss her."], "kissHer"]);
            listenerList.push([[feelup, "Feel her up."], "FeelUp"]);
            curtext = standobjs(curtext);
            if (!checkedherout) listenerList.push([[checkherout, "Check her out."], "checkHerOut"]);
            if (yourbladder > yourbladurge) listenerList.push([[ypeeoutside, "Pee outside."], "yPeeOutside"]);
        }
        listenerList.push([[exitYard, "Leave the yard."], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

function exitYard(){
    let curtext = [makeOut["exitYard"].formatVars()];
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theWalk, "Continue..."], "theWalk");
}

function preHotTub() {
    let curtext = [];
    let listenerList = [];
    if (attraction > hottubthresh && shyness < 12) {
        curtext = printList(curtext, makeOut["theYard"][3]);
        // s(girltalk + "Are you sure it's going to be alright?  What if somebody sees us?");
        curtext = showneed(curtext);
        curtext = displayyourneed(curtext);
        listenerList.push([[theHotTub, "Don't worry - it's really dark out here."], "theHotTub"]);
        listenerList.push([[theYard, "I'm not so sure..."]]);
    } else {
        curtext = printList(curtext, makeOut["theYard"][4]);
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
function theHotTub() {
    let curtext = []
    if (locstack[0] !== "theHotTub") {
        curtext = printList(curtext, makeOut["theYard"][5]);
        // s("You and " + girlname + " quickly strip off your clothes in the cover of the dark yard.");
        // s("You slip into the warm water of the hot tub, and watch as " + girlname + ", now completely nude, steps in to join you.");
        // s("She looks so sexy in the starlight, her pussy masked in darkness and her erect nipples silhouetted against the dim sky.");
        // s("Though it is dark, your eyes caress the shadows of her tight curves as they slowly submerge next to you.");
        pushloc("theHotTub");
    } else {
        curtext = printList(curtext, makeOut["theYard"][6]);
        // s("You and " + girlname + " are in the hot tub.");
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    let listenerList = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
            listenerList.push([[peeintub, "Suggest that she pees in the tub."], "peeInTub"]);
        } else {
            listenerList.push([[kissher, "Kiss her."], "kissHer"]);
            listenerList.push([[feelup, "Feel her up."], "FeelUp"]);
            if (attraction >= 130 && shyness <= 0) {
                listenerList.push([[function () {haveSex("theTub")}, "Make out with her."], "sexTub"]);
            }
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                listenerList.push([[yPeeInTub, "Pee in the hot tub"], "ypeetub"]);
        }
        listenerList.push([[exitHotTub, "Get out of the tub."], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

function exitHotTub(){
    let curtext = printList([], makeOut["exitHotTub"]);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();

}

function theBeach() {
    let curtext = [];
    if (locstack[0] !== "theBeach") {
        curtext = printList(curtext, makeOut["theBeach"][0]);
        // s("You and " + girlname + " walk out onto the sand.  It makes a soft swooshing noise as you step, like boots on dry snow.");
        pushloc("theBeach");
        askedswim = 0;
    } else {
        curtext = printList(curtext, makeOut["theBeach"][1]);
        // s("You and " + girlname + " are on the dark beach.");
        if (askedswim > 0) askedswim--;
    }

    let listenerList = [];
    if ((bladder > blademer && (shyness > 15 || randomchoice(1)) && !askedswim)) {
        curtext = displayneed(curtext);
        askedswim = 7;
        curtext = printList(curtext, makeOut["theBeach"][2]);
        // s(girltalk + " Hey!  Want to go for a swim together?");
        // s(girlname + " seems strangely insistent.  You realize that neither of you has swimming gear, so this means you get to see her naked.  Or at least see as much as you can in the dark.");
        listenerList.push([[beachSwim, "Sure, let's go for a swim!"], "beachSwim"]);
        listenerList.push([[theBeach, "Nah. We didn't bring swimsuits."], "theBeach"]);
    } else {
        curtext = showneed(curtext);
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) {
            wetherself();
            return;
        }
        else if (yourbladder > yourbladlose) {
            wetyourself();
            return;
        }
        else {
            if (gottagoflag > 0) {
                curtext = preventpee(curtext);
                listenerList.push([[peeoutside, "Suggest that she pees on the sand."], "peeOutside"]);
            } else {
                listenerList.push([[kissher, "Kiss her."], "kissHer"]);
                listenerList.push([[feelup, "Feel her up."], "FeelUp"]);
                curtext = standobjs(curtext);
                if (!checkedherout) listenerList.push([[checkherout, "Check her out."], "checkHerOut"]);
                if (yourbladder > yourbladurge) listenerList.push([[ypeeoutside, "Pee outside."], "yPeeOutside"]);
                if (attraction > 100 && shyness < 10)
                    listenerList.push([[function () {haveSex("theBeach")}, "Make out with her."], "sexTub"]);
            }
            listenerList.push([[leaveBeach, "Leave the beach."], "goBack"]);
        }
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function beachSwim() {
    let curtext = [girlname + appearance["clothes"][heroutfit]["swimstripquote"]];
    if (pantycolor === "none")
        curtext.push(appearance["clothes"][heroutfit]["swimstripquotebare"]);
    else
        curtext.push(appearance["clothes"][heroutfit]["swimstripquotepanties"].format([pantycolor]));
    let listenerList = [];
    listenerList.push([[beachSwim2, "Join her."], "join"]);
    if (pantycolor !== "none")
        listenerList.push([[beachSwim2b, "Tell her that her panties are going to get wet."], "panties"]);
    listenerList.push([[beachSwim2c, "Stand and watch."], "stand"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

function beachSwim2() {
    let curtext = printList([], makeOut["theBeach"][3]);
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

function beachSwim2b() {
    sayText(makeOut["theBeach"][4]);
    // s("<b>YOU:</b> But your panties - they'll get wet!");
    // s(girltalk + " How do you know they're not already wet?");
    // s("She has a point there.");
    cListenerGen([beachSwim2, "Continue..."], "beachSwim");
}

function beachSwim2c() {
    let curtext = [];
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][5]);
        // s(girlname + " is standing beside you naked in the dark.");
    else {
        let list = new Array(makeOut["theBeach"][6].length).fill(pantycolor);
        curtext = printList(curtext, formatAll(makeOut["theBeach"][6], list));
        // s(girlname + " is standing beside you in her " + pantycolor + " panties in the dark.");
    }
    curtext = printList(curtext, makeOut["theBeach"][7]);
    // s(girltalk + " Aren't you going to come with me?");
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    // s("How can you resist the invitation of a sexy, naked girl to join her swimming?");
    sayText(curtext);
    cListenerGen([beachSwim2, "Of course I'll come with you."], "ofCourse");
}

function beachSwim3() {
    let curtext = printList([], makeOut["theBeach"][8]);
    // s("You walk hand in hand with " + girlname + " until you're waist deep in the calm water.");
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][9]);
        // s(girlname + " gasps as a wave touches her naked crotch.");
    else{
        let list = new Array(makeOut["theBeach"][10].length).fill(pantycolor);
        curtext = printList(curtext, formatAll(makeOut["theBeach"][10], list));
        // s(girlname + " gasps as a wave soaks the crotch of her " + pantycolor + " panties.");
    }
    curtext = printList(curtext, makeOut["theBeach"][11]);
    // s("She squeezes your hand and you sense a shiver running up her spine.");
    const listenerList = [
      [[beachSwim4b, "Feel her up."], "feelHer"],
      [[beachSwim4, "Continue..."], "beachSwim"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO tell her you got to go too.
function beachSwim3b() {
    let curtext = printList([], makeOut["theBeach"][12]);
    // s("You take " + girlname + " in your arms and hug her close to you, standing knee-deep in the calm water.");
    // s("She pulls her belly away from you and gasps, but you grab her butt and press it into your thigh.");
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][13]);
        // s("Her quivering bare pussy lips feel so wonderful pressed into your upper leg.");
    else
        curtext = printList(curtext, makeOut["theBeach"][14]);
        // s("Her warm, wet panties feel wonderful pressed into your upper leg.");
    curtext = printList(curtext, makeOut["theBeach"][15]);
    // s("<b>I've <u>really</u> got to pee!</b> she confesses, whispering in your ear.");
    const listenerList = [
        [[beachSwim4b, "Hold her close."], "holdHer"],
        [[beachSwim4, "Let her go."], "letGo"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);
}

function beachSwim4() {
    let curtext = printList([], makeOut["theBeach"][16]);
    // s(girlname + " pauses for a moment, and over the sound of the surf, you can barely hear the hiss of her urine hitting the water.");
    flushdrank();
    if (pantycolor === "none")
        curtext = printList(curtext, makeOut["theBeach"][17]);
        // s("She's right there beside you in the dark, naked and peeing into the water.");
    else
        curtext = printList(curtext, makeOut["theBeach"][18]);
        // s("She's right there beside you in the dark, peeing through her wet panties into the water.");
    sayText(curtext);
    cListenerGen([beachSwim5, "Continue..."], "beachSwim");
}

function beachSwim4b() {
    let curtext = printList([], makeOut["theBeach"][19]);
    // s(girlname + " pauses for a moment.");
    // s("You run your hand up her smooth leg under the water.");
    // s("The water is even warmer around her crotch.  Probing closer, you feel a jet of hot pee escaping from between her pussy lips, passing through your fingers and warming your leg.");
    flushdrank();
    // s("You feel it slow, spurt a couple of times, and finally come to a stop.");
    sayText(curtext);
    cListenerGen([beachSwim5, "Continue..."], "beachSwim");
}

function beachSwim5() {
    let curtext = printList([], makeOut["theBeach"][20]);
    // s(girltalk + " maybe we should go back.  Could be sharks, you know!");
    // s("You take her hand and lead her back to the beach where you dry off as well as you can and put your clothes back on.");
    if (pantycolor !== "none") {
        curtext = printList(curtext, makeOut["theBeach"][21]);
        // s("She hands you her wet panties.");
        // s(girltalk + "Is there someplace you can put these?");
        objects.wetPanties.value += 1;
        pantycolor = "none";
    }
    sayText(curtext);
    cListenerGen([theBeach, "Continue..."], "theBeach");
}

function leaveBeach(){
    let curtext = [makeOut["leaveBeach"].formatVars()];
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theWalk, "Continue..."], "theWalk");
}

