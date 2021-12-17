let club;

function theClubSetup(){
    getjson("locations/theClub", clubJsonSetup);
    return {
        visit: [theClub, "Go to the nightclub"],
        wantVisit: [theClub, "Stop by the nightclub for her."],
        group: 3,
        visited: 0,
        keyChance: 1,
        foundKey: 0
    }
}

function clubJsonSetup(){
    club = json;
    club["theClub"] = formatAllVarsList(club["theClub"]);
}

function theClub() {
    let curtext = [];
    let listenerList = []
    if (locations.theClub.visited && locstack[0] === "driveout" && thetime < clubclosingtime) {
        curtext = printList(curtext, club["theClub"][0]);
        // s(girlname + " giggles: But we've already been to the club, silly!");
        if (haveItem("theClubKey"))
            listenerList.push([[reClub, "But I found this key I have to return!"], "reClub"]);
        listenerList.push([[driveout, "Continue..."], "driveOut"]);
    } else {
        if ((thetime < clubclosingtime) || locstack[0] === "theClub") {
            if (locstack[0] !== "theClub" && locstack[0] !== "doDance") {
                curtext = printList(curtext, club["theClub"][1]);
                // s("You and " + girlname + " enter the Night Club.");
                pushloc("theClub");
                locations.theClub.visited = 1;
            } else {
                curtext = printList(curtext, club["theClub"][2]);
                // s("You are with " + girlname + " in the Night Club.");
                if (randomchoice(3)) curtext = noteholding(curtext);
                else if (randomchoice(5)) curtext = interpbladder(curtext);
            }

            curtext = displayyourneed(curtext);
            curtext = showneed(curtext);
            if (bladder > bladlose) wetherself();
            else if (yourbladder > yourbladlose) wetyourself();
            else if (gottagoflag > 0)
                curtext = preventpee(curtext);
            else {
                listenerList.push([[function () {buyItem("cocktail")}, "Buy  a drink."], "buyDrink"]);
                listenerList.push([[goDance, "Ask her to dance."], "goDance"]);
                if (!locations.theClub.foundKey)
                    listenerList.push([[function () {lookAround("theClub")}, "Look around."], "lookAround"]);
                curtext = standobjs(curtext);
                if (yourbladder > yourbladurge)
                    listenerList.push([[youpee, "Go to the bathroom."], "youpee"]);
                listenerList.push([[leavehm, "Leave the Club."], "leavehm"]);
            }
        } else {
            itsClosed("theClub", darkClub, "darkClub");
            return;
        }
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function flirtBarGirl() {
    let curtext = [pickrandom(club["barGirlFlirt"])];
    curtext.push(pickrandom(club["barGirlDesc"]));
    curtext.push(pickrandom(club["barGirlResp"]));
    curtext.push(girlname + " seems to be glaring at you.");
    externalflirt++;
    sayText(curtext);
    cListenerGen([theClub, "Continue..."], "theClub");
}

function reClub() {
    objects.theClubKey.value = 0;
    pushloc("theClub");
    theClub();
}

function goDance(){
    pushloc("doDance");
    changevenueflag = 1;
    let curtext = showneed();
    curtext = displayyourneed(curtext);
    let listenerList = [];
    if (gottagoflag > 0) {
        listenerList.push([[holdit, "Ask her to hold it."], "holdit"]);
        listenerList.push([[allowpee, "Let her go."], "allowpee"]);
    } else {
        curtext = printList(curtext, club["theClub"][3]);
        listenerList.push([[doDance, "Continue..."], "doDance"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function doDance(){
    let curtext = [club["Dancing"].formatVars()];
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (randomchoice(3)) curtext = noteholding(curtext);
    else if (randomchoice(5)) curtext = interpbladder(curtext);

    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        let listenerList = [];
        if (gottagoflag > 0)
            curtext = preventpee(curtext);
        else{
            listenerList.push([[doDance, "Keep Dancing."], "doDance"]);
            listenerList.push([[kissher,  "Kiss her."], "kissHer"]);
            listenerList.push([[feelup, "Feel her up."], "feelup"]);
            if (yourbladder > yourbladurge)
                listenerList.push([[youpee, "Go to the toilet."], "youpee"]);
        }
        listenerList.push([[leaveDance, "Leave the dancefloor."], "leaveDance"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

function leaveDance(){
    let curtext = [club["leaveDance"].formatVars()];
    // s("You pull " + girlname + " off the dancefloor.");
    curtext = showneed(curtext);
    sayText(curtext);
    poploc();
    cListenerGen([theClub, "Continue..."], "club");
}

function darkClub() {
    let curtext = [];
    if (emerBreak || emerHold && bladder < 20){
        curtext = printList(curtext, club["emerBreak"]);
        emerHold = 0;
        emerBreak = 0;
    } else if (emerHold) {
        curtext.push(club["emerHold"].formatVars());
        emerHold = 0;
    }
    else if (locstack[0] !== "darkClub") {
        curtext.push(club["darkClubEnter"].formatVars());
        // s("You and " + girlname + " enter the nightclub.  It's dark, silent and deserted.");
        pushloc("darkClub");
    } else {
        curtext.push(club["darkClubBe"].formatVars());
        // s("You are with " + girlname + " in the closed nightclub.");
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else if (gottagoflag > 0) {
        curtext = preventpee(curtext);
        sayText(curtext);
    }
    else {
        let listenerList = [];
        curtext = standobjs(curtext);
        sayText(curtext);
        listenerList.push([[kissher, "Kiss her."], "kissHer"]);
        listenerList.push([[feelup, "Feel her up."], "feelUp"]);
        if (!checkedherout)
            listenerList.push([[checkherout, "Check her out."], "checkOut"]);
        if (yourbladder > yourbladurge)
            listenerList.push([[youpee, "Go to the bathroom."], "youPee"]);
        listenerList.push([[leavehm, "Leave the club."], "LeaveHm"]);
        cListenerGenList(listenerList);
    }
}
//
// function godance() {
//     pushloc("dodance");
//     changevenueflag = 1;
//     showneed();
//     displayyourneed();
//     if (gottagoflag > 0) {
//         c("holdit", "Ask her to hold it.");
//         c("allowpee", "Let her go.");
//     } else {
//         s(girltalk + "Okay.  Let's dance.");
//         s("You head out to the dancefloor to cut up the rug.");
//         c(locstack[0], "Continue...");
//     }
// }

// function dodance() {
//     pushloc("dodance");
//     s("You are dancing with " + girlname + " in your arms.");
//     showneed();
//     displayyourneed();
//     if (randomchoice(3)) noteholding();
//     else if (randomchoice(5)) interpbladder();
//
//     if (bladder > bladlose) wetherself();
//     else if (yourbladder > yourbladlose) wetyourself();
//     else {
//         if (gottagoflag > 0) {
//             preventpee();
//         } else {
//             c(locstack[0], "Keep Dancing.");
//             c("kissher", "Kiss her.");
//             c("feelup", "Feel her up.");
//             standobjs();
//             if (yourbladder > yourbladurge)
//                 c("youpee", "Go to the bathroom.");
//         }
//         c("goback", "Leave the dancefloor.");
//     }
// }

function pphotogame() {
    let curtext = [club["photoGameConvince"]];
    // s("<b>YOU:</b> I know you really need to go, but can I take just a couple snapshots first?");
    curtext = displayneed(curtext);
    curtext.push(club["questPic"].formatVars());
    // s(girltalk + "What <u>kind</u> of pictures?");
    sayText(curtext);
    cListenerGenList([
        [function () {photoConvince("snapshots")}, club["choices"]["snapshots"], "snapshots"],
        [function () {photoConvince("costume")}, club["choices"]["costume"], "costume"],
        [function () {photoConvince("nudes")}, club["choices"]["nudes"], "nudes"]
    ])
    // c("photogame2", "Just a couple snapshots of you up on the stage there.");
    // c("photogame2c", "How about a few costume pics?");
    // c("photogame2n", "Well - nobody's around, so I'd really love it if you would do a few nudes.");
}


function photoConvince(choice) {
    let curtext = [];
    if (attraction >= photoGameThresholds[choice]) {
        curtext = displayneed(curtext);
        curtext.push(club["gameAccept"][choice].formatVars());
        // s(girltalk + "Okay.  But can I please go pee first?");
        curtext = displayneed(curtext);
        photoChoice = choice;
        sayText(curtext);
        cListenerGenList([
            [[photoGame, club["choices"]["startGame"]], "photogame"],
            [[indepee, club["choices"]["indepee"]], "indepee"]
        ]);
    } else {
        curtext.push(club["gameFail"]);
        attraction -= 2;
        // s(girltalk + "No way, dude.  I'm outta here.");
        indepee(curtext);
    }
}

let wetPhoto = 0;
let isNude = 0;
function photoGame() {
    let curtext = [];
    if (wetPhoto) {
        wetPhoto = 0;
        go("goback");
    } else if (locstack[0] !== "photogame") {
        pushloc("photogame");
        curtext = displayholdquip(curtext);
        posectr = 0;
        askholditcounter++;
        curtext = printList(curtext, club["photoGameStart"]);
        // s("<b>YOU:</b> Thanks.  You're very sexy.");
        // s("You motion " + girlname + " up onto the nightclub stage.");
        // s("She carefully ascends the stairs, and you find a switch that turns on some stage lights.");
    } else {
        curtext.push(club["midPhotoGame"]["common"].formatVars());
        // s("You're taking snapshots of " + girlname + " up on the nightclub stage.");
        if (photoChoice === "nudes" && isNude)
            curtext.push(club["midPhotoGame"]["nude"]);
            // s("She's completely nude.");
        if (photolevel === "costumes")
            curtext.push(club["midPhotoGame"]["costume"].format(appearance["clothes"][heroutfit][outfitctr]));
            // s("She's wearing " + poseoutfit[outfitctr] + ".");
        if (bladder > blademer) {
            curtext = interpbladder(curtext);
            curtext = noteholding(curtext);
        }
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) {
        wetPhoto = 1;
        wetherself();
    }
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curtext);
        let listenerList = [];
        if (posectr <= posemax)
            listenerList.push([[photoPose, club["choices"]["photoPose"]], "photoPose"]);
        if (photoChoice === "costume" && outfitctr < outfitmax)
            listenerList.push([[photoChange, club["choices"]["photoChange"]], "photoChange"]);
        if (photoChoice === "nudes" && !isNude)
            listenerList.push([[photoNude, club["choices"]["photoNude"]], "photoNude"]);
        listenerList.push([[goback, club["choices"]["goback"]], "goback"]);
        cListenerGenList(listenerList);
    }
}

function photoPose() {
    let curtext = [club["askPose"]];
    // s("<b>YOU:</b> How about striking a pose?");
    if (photoChoice === "nudes")
        curtext.push(club["poseNude"][posectr].formatVars());
    else
        curtext.push(appearance["clothes"][heroutfit]["posenorm"][posectr].formatVars());
    posectr++;
    if (bladder > blademer) {
        curtext.push(pickrandom(club["poseEmer"]));
        // s(poseemer[randcounter]);
        // incrandom();
    }
    sayText(curtext);
    cListenerGen([photoGame, club["choices"]["takePhoto"]], "takePhoto");
}

function photoChange() {
    let curtext = [club["photoChange"]["common"]];
    // s("<b>YOU:</b> How about changing into a costume?");
    if (bladder > blademer) {
        curtext.push(club["photoChange"]["emer"].formatVars().format([appearance["clothes"][heroutfit]["poseoutfit"][outfitctr]]));
        // s(girlname + " is almost doubled over as she takes little baby steps back to the closet and returns with a " + poseoutfit[outfitctr]);
        curtext.push(appearance["clothes"][heroutfit]["donemer"][outfitctr]);
        // s(donemer[outfitctr]);
    } else {
        curtext.push(club["photoChange"]["normal"].formatVars().format([appearance["clothes"][heroutfit]["poseoutfit"][outfitctr]]));
        // s(girlname + " walks back to the closet and returns with a" + poseoutfit[outfitctr]);
        curtext = printList(curtext, appearance["clothes"][heroutfit]["donoutfit"][outfitctr]);
        // s(donoutfit[outfitctr]);
    }
    outfitctr++;
    sayText(curtext);
    cListenerGen([photoGame, "Continue..."], "Cont");
}

function photoNude() {
    let curtext = [club["photoNude"]["common"]];
    // s("<b>YOU:</b> Okay - so you can take off your clothes.");
    if (bladder > blademer) {
        curtext.push(girlname + appearance["clothes"][heroutfit]["undressquoteemer"]);
        curtext = printList(curtext, club["photoNude"]["emerStart"]);
        // s("<i>You can see her face filled with a look of concentration as she waits for an opportune moment to continue.</i>");
        // s("She then shyly unclasps her bra, revealing her breasts briefly before turning her back to you.  Her thighs are rubbing together.");
        if (pantycolor === "none") {
            curtext.push(club["photoNude"]["emerNoPanty"]);
            // s("She quickly crosses her legs and squeezes tightly - she was not wearing any panties.");
        } else {
            curtext.push(club["photoNude"]["emerPanty"]);
            // s("She hesitates and looks to you for confirmation before spreading her legs slightly, giving her pussy a firm press, and quickly slipping her panties off then tightly crossing her legs.");
        }
    } else {
        curtext.push(girlname + appearance["clothes"][heroutfit]["undressquote"]);
        if (pantycolor === "none") {
            curtext.push(club["photoNude"]["normNoPanty"]);
            // s("She's not wearing any panties.");
        } else {
            curtext.push(club["photoNude"]["normPanty"]);
            // s("She hesitates and looks to you for confirmation before slipping her panties off and placing them on the floor next to her.");
        }
    }
    curtext.push(club["photoNude"]["stage"]);
    // s("She's standing on stage completely nude.");
    isNude = 1;
    sayText(curtext);
    cListenerGen([photoGame, "Continue..."], "Cont");
}

function photoFinish(){
    let curtext = [];
    if (isNude){
        if (bladder > blademer)
            curtext.push(club["photoFinish"]["nudeDesp"]);
        curtext.push(club["photoFinish"]["nude"]);
    } else if (photoChoice==="costume"){
        if (bladder > blademer)
            curtext.push(club["photoFinish"]["costumeDesp"]);
        curtext.push(club["photoFinish"]["costume"]);
    } else curtext.push(club["photoFinish"]["normal"]);
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    poploc();
    sayText(curtext);
    if (bladder > bladneed)
        cListenerGen([indepee, "Continue..."], "indepee");
    else
        cListenerGen([darkClub, "Continue..."], "darkClub");
}

