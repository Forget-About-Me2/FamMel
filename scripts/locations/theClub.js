let club;

function theClubSetup(){
    getjson("locations/theClub", clubJsonSetup);
    return {
        visit: [theClub, "Go to the nightclub"],
        wantVisit: [theClub, "Stop by the nightclub for her."],
        group: 3,
        visited: 0,
        keyChance: 1
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
                if (!haveItem("theTheatreKey"))
                    listenerList.push([[function () {lookAround("theClub")}, "Look around."], "lookAround"]);
                curtext = standobjs(curtext);
                if (yourbladder > yourbladurge)
                    listenerList.push([[youpee, "Go to the bathroom."], "youpee"]);
                listenerList.push([[leavehm, "Leave the Club."], "leavehm"]);
            }
        } else itsClosed("theClub", darkClub, "darkClub");
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
    cListener([theClub, "Continue..."], "club");
}

function darkClub() {
    if (locstack[0] !== "darkclub") {
        s("You and " + girlname + " enter the nightclub.  It's dark, silent and deserted.");
        pushloc("darkclub");
    } else {
        s("You are with " + girlname + " in the closed nightclub.");
    }

    showneed();
    displayyourneed();
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else if (gottagoflag > 0) preventpee();
    else {
        standobjs();
        if (!checkedherout) c("checkherout", "Check her out.");
        c("youpee", "Go to the bathroom.");
        c("leavehm", "Leave the club.");
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
    s("<b>YOU:</b> I know you really need to go, but can I take just a couple snapshots first?");
    displayneed();
    s(girltalk + "What <u>kind</u> of pictures?");
    c("photogame2", "Just a couple snapshots of you up on the stage there.");
    c("photogame2c", "How about a few costume pics?");
    c("photogame2n", "Well - nobody's around, so I'd really love it if you would do a few nudes.");
}

function photogame2() {
    if (attraction >= photogamethreshold) {
        displayneed();
        s(girltalk + "Okay.  But can I please go pee first?");
        displayneed();
        photolevel = 0;
        c("photogame", "I'd really like it if you'd wait...");
        c("indepee", "Alright - go ahead and pee.");
    } else {
        s(girltalk + "No way, dude.  I'm outta here.");
        indepee();
    }
}

function photogame2c() {
    if (attraction >= photogamecthreshold) {
        displayneed();
        s(girltalk + "Well, okay.  It would be neat to play dressup.  But can I please go pee first?");
        displayneed();
        photolevel = 1;
        c("photogame", "I'd really like it if you'd wait...");
        c("indepee", "Alright - go ahead and pee first.");
    } else {
        s(girltalk + "No way, dude.  I'm outta here.");
        indepee();
    }
}

function photogame2n() {
    if (attraction >= photogamenthreshold) {
        displayneed();
        s(girltalk + "That's naughty.  Very naughty.  But can I please go pee first?");
        displayneed();
        photolevel = 2;
        c("photogame", "I'd really like it if you'd wait...");
        c("indepee", "Alright - go ahead and pee first.");
    } else {
        s(girltalk + "No way, dude.  I'm outta here.");
        indepee();
    }
}

//TODO show your need
//TODO fix wetherself when naked
//TODO not running to the bathroom if she wet herself
function photogame() {
    if (locstack[0] !== "photogame") {
        pushloc("photogame");
        displayholdquip();
        posectr = 0;
        askholditcounter++;
        s("<b>YOU:</b> Thanks.  You're very sexy.");
        s("You motion " + girlname + " up onto the nightclub stage.");
        s("She carefully ascends the stairs, and you find a switch that turns on some stage lights.");
    } else {
        s("You're taking snapshots of " + girlname + " up on the nightclub stage.");
        if (photolevel === 3) s("She's completely nude.");
        if (photolevel === 1) s("She's wearing " + poseoutfit[outfitctr] + ".");
        if (bladder > blademer) {
            interpbladder();
            noteholding();
        }
    }
    showneed();
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (posectr <= posemax) c("photopose", "Ask her to pose.");
        if (photolevel === 1 && outfitctr < outfitmax) c("photochange", "Ask her to change.");
        if (photolevel === 2) c("photonude", "Ask her to disrobe.");
        c("goback", "Photo session is over...");
    }
}

function photopose() {
    s("<b>YOU:</b> How about striking a pose?");
    if (photolevel === 3)
        s(girlname + " " + posenude[posectr]);
    else
        s(girlname + " " + posenorm[posectr]);
    posectr++;
    if (bladder > blademer) {
        s(poseemer[randcounter]);
        incrandom();
    }
    c(locstack[0], "Take a photo...");
}

function photochange() {
    s("<b>YOU:</b> How about changing into a costume?");
    if (bladder > blademer) {
        s(girlname + " is almost doubled over as she takes little baby steps back to the closet and returns with a " + poseoutfit[outfitctr]);
        s(donemer[outfitctr]);
    } else {
        s(girlname + " walks back to the closet and returns with a" + poseoutfit[outfitctr]);
        s(donoutfit[outfitctr]);
    }
    outfitctr++;
    c(locstack[0], "Continue...");
}

function photonude() {
    s("<b>YOU:</b> Okay - so you can take off your clothes.");
    if (bladder > blademer) {
        s(girlname + undressquoteemer);
        s("<i>You can see her face filled with a look of concentration as she waits for an opportune moment to continue.</i>");
        s("She then shyly unclasps her bra, revealing her breasts briefly before turning her back to you.  Her thighs are rubbing together.");
        if (pantycolor === "none") {
            s("She quickly crosses her legs and squeezes tightly - she was not wearing any panties.");
        } else {
            s("She hesitates and looks to you for confirmation before spreading her legs slightly, giving her pussy a firm press, and quickly slipping her panties off then tightly crossing her legs.");
        }
    } else {
        s(girlname + undressquote);
        if (pantycolor === "none") {
            s("She's not wearing any panties.");
        } else {
            s("She hesitates and looks to you for confirmation before slipping her panties off and placing them on the floor next to her.");
        }
    }
    s("She's standing on stage completely nude.");
    incrandom();
    photolevel = 3;
    c(locstack[0], "Continue...");
}

