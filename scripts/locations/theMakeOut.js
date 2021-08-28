let makeOut; //This stores the JSON quotes regarding the makeOut

function makeOutSetup(){
    getjson("locations/makeOut", makeOutJson);
    return {
        "visit": [theMakeOut, "Go to the make-out spot"],
        "wantVisit": [theMakeOut, "Take her up to the make-out spot"],
        "group": 1,
        "visited": 0,
        "keyChance": 1
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
            pushloc("themakeout");
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
    curtext = showneed();
    curtext = displayyourneed();
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
            listenerList.push([[peeoutside, "Suggest that she pees outside."], "peeOutside"]);
        } else {
            listenerList.push([[viewStars, "Suggest that you gaze at the stars."], "viewStars"]);
            listenerList.push([[theWalk, "Invite " + girlname + " to take a walk."], "theWalk"]);
            if (!haveItem("theTheatreKey")) {
                listenerList.push([[function () {lookAround("makeOut")}, "look around."], "lookAround"]);
            }
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                listenerList.push([[ypeeoutside, "Pee outside."], "ypeeOutside"])
                c("ypeeoutside", "Pee outside.")
        }
        listenerList.push([[leavehm, "Drive off."], "leaveHm"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function failMakeOut() {
    shyness += 10;
    attraction -= 10;
    let curtext = printList([], makeOut["theMakeOut"]);
    // s(girltalk + "I don't feel comfortable going up there with you.");
    // s(girltalk + "Please let's go somewhere else.");
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
        curtext.push(pickrandom(makeOut["walkDesk"][2]));
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
        listenerList.push([[goback, "Walk back to the car."]]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
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
        listenerList.push([[goback, "Leave the yard."], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
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
                listenerList.push([[ypeeintub, "Pee in the hot tub"], "ypeetub"]);
        }
        listenerList.push([[goback, "Get out of the tub."], "goBack"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}


function thebeach() {
    if (locstack[0] !== "thebeach") {
        s("You and " + girlname + " walk out onto the sand.  It makes a soft swooshing noise as you step, like boots on dry snow.");
        pushloc("thebeach");
        askedswim = 0;
    } else {
        s("You and " + girlname + " are on the dark beach.");
        if (askedswim > 0) askedswim--;
    }

    if (bladder > blademer && shyness > 15 && !askedswim) {
        displayneed();
        askedswim = 7;
        s(girltalk + " Hey!  Want to go for a swim together?");
        s(girlname + " seems strangely insistent.  You realize that neither of you has swimming gear, so this means you get to see her naked.  Or at least see as much as you can in the dark.");
        c("beachswim", "Sure, let's go for a swim!");
        c(locstack[0], "Nah.  We didn't bring swimsuits.");
    } else {
        showneed();
        displayyourneed();
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (gottagoflag > 0) {
                preventpee();
                c("peeoutside", "Suggest that she pee on the sand.");
            } else {
                c("kissher", "Kiss her.");
                c("feelup", "Feel her up.");
                if (attraction > 100 && shyness < 10)
                    c("beachsex", "Make out with her.");
                standobjs();
                if (!checkedherout) c("checkherout", "Check her out.");
                if (yourbladder > yourbladurge)
                    c("ypeeoutside", "Pee on the sand.");
            }
            c("goback", "Leave the beach.");
        }
    }
}

function beachswim() {
    pushloc("beachswim");
    s(girlname + swimstripquote);
    if (pantycolor === "none")
        s(swimstripquotebare);
    else
        s(swimstripquotepanties);
    c("beachswim2", "Join her.");
    if (pantycolor !== "none")
        c("beachswim2b", "Tell her that her panties are going to get wet.");
    c("beachswim2c", "Stand and watch.");
}

function beachswim2() {
    s("You peel off your clothes and take her hand, walking slowly into the warm water.");
    displayneed();
    displayyourneed();
    s("It's dark, so you can't really see what she's doing.  You hear the swooshing of the water as you walk together.");
    c("beachswim3b", "Take her in your arms ...");
    c("beachswim3", "Continue ...");
}

function beachswim2b() {
    s("<b>YOU:</b> But your panties - they'll get wet!");
    s(girltalk + " How do you know they're not already wet?");
    s("She has a point there.");
    c("beachswim2", "Continue ...");
}

function beachswim2c() {
    if (pantycolor === "none")
        s(girlname + " is standing beside you naked in the dark.");
    else
        s(girlname + " is standing beside you in her " + pantycolor + " panties in the dark.");
    s(girltalk + " Aren't you going to come with me?");
    displayneed();
    displayyourneed();
    s("How can you resist the invitation of a sexy, naked girl to join her swimming?");
    c("beachswim2", "Of course I'll come with you.");
}

function beachswim3() {
    s("You walk hand in hand with " + girlname + " until you're waist deep in the calm water.");
    if (pantycolor === "none")
        s(girlname + " gasps as a wave touches her naked crotch.");
    else
        s(girlname + " gasps as a wave soaks the crotch of her " + pantycolor + " panties.");
    s("She squeezes your hand and you sense a shiver running up her spine.");
    c("beachswim4b", "Feel her up.");
    c("beachswim4", "Continue...");
}

function beachswim3b() {
    s("You take " + girlname + " in your arms and hug her close to you, standing knee-deep in the calm water.");
    s("She pulls her belly away from you and gasps, but you grab her butt and press it into your thigh.");
    if (pantycolor === "none")
        s("Her quivering bare pussy lips feel so wonderful pressed into your upper leg.");
    else
        s("Her warm, wet panties feel wonderful pressed into your upper leg.");
    s("<b>I've <u>really</u> got to pee!</b> she confesses, whispering in your ear.");
    c("beachswim4b", "Hold her close.");
    c("beachswim4", "Let her go.");
}

function beachswim4() {
    s(girlname + " pauses for a moment, and over the sound of the surf, you can barely hear the hiss of her urine hitting the water.");
    flushdrank();
    if (pantycolor === "none")
        s("She's right there beside you in the dark, naked and peeing into the water.");
    else
        s("She's right there beside you in the dark, peeing through her wet panties into the water.");
    c("beachswim5", "Continue ...");
}

function beachswim4b() {
    s(girlname + " pauses for a moment.");
    s("You run your hand up her smooth leg under the water.");
    s("The water is even warmer around her crotch.  Probing closer, you feel a jet of hot pee escaping from between her pussy lips, passing through your fingers and warming your leg.");
    flushdrank();
    s("You feel it slow, spurt a couple of times, and finally come to a stop.");
    c("beachswim5", "Continue ...");
}

function beachswim5() {
    s(girltalk + " maybe we should go back.  Could be sharks, you know!");
    s("You take her hand and lead her back to the beach where you dry off as well as you can and put your clothes back on.");
    if (pantycolor !== "none") {
        s("She hands you her wet panties.");
        s(girltalk + "Is there someplace you can put these?");
        wetpanties += 1;
        pantycolor = "none";
    }
    c("goback", "Continue ... ");
}

