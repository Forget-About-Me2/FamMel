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
                locations.theClub.value = 1;
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
                if (yourbladder > yourbladurge){
                    listenerList.push([[youpee], "youpee"],);
                    cListener([youpee, "Go to the bathroom."], "youpee");
                }
                listenerList.push([[leavehm], "leavehm"]);
                cListener([leavehm, "Leave the Club."], "leavehm");
            }
        } else itsClosed("theClub", darkClub, "darkClub");
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function flirtBarGirl() {
    s("<b>YOU:</b>" + bargirlflirt[randcounter]);
    s(bargirldesc[randcounter]);
    s("<b>BARTENDER:</b> " + bargirlresp[randcounter]);
    incrandom();
    s(girlname + " seems to be glaring at you.");
    externalflirt++;
    c(locstack[0], "Continue...");
}


function breakclub() {
    s("You try the door with your key...");
    if (bladder > blademer) {
        s(girltalk + sayhero[randcounter]);
        attraction += 3;
    }
    displayneed();
    displayyourneed();
    c("darkclub", "Continue...");
}

function reclub() {
    clubkey = 0;
    pushloc("theclub");
    theclub();
}

function darkclub() {
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




function godance() {
    pushloc("dodance");
    changevenueflag = 1;
    showneed();
    displayyourneed();
    if (gottagoflag > 0) {
        c("holdit", "Ask her to hold it.");
        c("allowpee", "Let her go.");
    } else {
        s(girltalk + "Okay.  Let's dance.");
        s("You head out to the dancefloor to cut up the rug.");
        c(locstack[0], "Continue...");
    }
}

function dodance() {
    pushloc("dodance");
    s("You are dancing with " + girlname + " in your arms.");
    showneed();
    displayyourneed();
    if (randomchoice(3)) noteholding();
    else if (randomchoice(5)) interpbladder();

    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            preventpee();
        } else {
            c(locstack[0], "Keep Dancing.");
            c("kissher", "Kiss her.");
            c("feelup", "Feel her up.");
            standobjs();
            if (yourbladder > yourbladurge)
                c("youpee", "Go to the bathroom.");
        }
        c("goback", "Leave the dancefloor.");
    }
}


function pgirlsroom() {
    if (locstack[0] === "pgirlsroom") {
        poploc();
        eval(locstack[0] + "()");
    } else {
        pushloc("pgirlsroom");
        s("<b>YOU:</b> Can I watch?  It would be <u>so</u> sexy!");
        if (attraction >= pwatchthreshold) {
            displayneed();
            s(girltalk + "Really?  Well.... okay.  I guess there's nobody around.");
            s("She grabs you by the hand and heads for the ladies room.");
            displayneed();
            c("pgirlsroom2", "Follow her...");
            c("indepee", "Change your mind...");
        } else {
            s(girltalk + "I don't think so, buddy.");
            indepee();
        }
    }
}

function pgirlsroom2() {
    s("She looks right, looks left, and peeks in the door before quickly pulling you into a very cramped stall.");
    if (bladder < bladlose - 10) bladder = bladlose - 10;
    displayneed();
    s("The sight of the toilet seems to have increased her urgency.");
    c("ptogether3", "Continue...");
}

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

//TODO option for you to pee as well
function ptogether() {
    if (locstack[0] === "ptogether") {
        poploc();
        eval(locstack[0] + "()");
    } else {
        pushloc("ptogether");
        s("<b>YOU:</b> Don't go and leave me alone!");
        if (attraction >= ptogetherthreshold) {
            displayneed();
            s(girltalk + "Really?  You want to come with me?");
            s("She grabs you by the hand and heads for the back of the club.");
            displayneed();
            c("ptogether2", "Follow her...");
            c("indepee", "Change your mind...");
        } else {
            s(girltalk + "You're a big boy.  You can take care of yourself.");
            indepee();
        }
    }
}

//TODO option to make out
function ptogether2() {
    s(girlname + " leads you back to the restrooms.");

    if (!randomchoice(rrlockedthresh)) {
        s("She looks right, looks left, and peeks in the door before quickly pulling you into a very cramped stall.");
        if (bladder < bladlose - 10) bladder = bladlose - 10;
        displayneed();
        s("The sight of the toilet seems to have increased her urgency.");
        c("ptogether3", "Continue...");
    } else {
        s("There's a long line for the womens restrooms.  You notice they're mostly young, dressed to the nines, and in various stages of extreme urinary urgency.  Your daydreams are interrupted quickly.");
        s(girlname + " squeezes your hand: I can't hold it!  What are we gonna do?");
        c("ptogether4", "Invite her into the mens room.");
        c("ptogether5", "Take her out the nearby back door.");
        c("ptogether6", "Stand around looking dumb.");
    }
}

function ptogether3() {
    if (pantycolor !== "none")
        s(girlname + ptogetherquote);
    else
        s(girlname + ptogetherquotebare);
    s("You try not to stare too much as the torrent cascades from between her thighs.  You hear the violent hissing and splashing of her pee, and the scent fills the tiny cubicle.  You want to touch her so badly.");
    flushdrank();
    sawherpee = 1;
    c("ptogether3d", "Feel the stream.");
    c("ptogether3c", "Kiss her thighs.");
    c("ptogether3b", "You're too shy.");
}

function ptogether3b() {
    s("As the torrent subsides, you offer her some tissue.");
    s(girltalk + "Thanks - I've never had to go so bad in my life!");
    s("<i>She seems relaxed, radiant ... and aroused.</i>");
    c("goback", "Continue...");
}

function ptogether3c() {
    s("You lay your head in her lap, the warmth of her thighs on your cheek.");
    s("The hissing is louder down there, and you feel the small droplets of her pee spray landing on your upper lips.");
    s("You can sense the heat from the stream, and the smell of her is overpowering.");
    c("ptogether3b", "Continue...");
}

function ptogether3d() {
    s("You caress her, running your hand down her back and along the line of her butt crack.");
    s("Her crack is warm and soft, and as your fingers reach the edge of her pussy lips, you feel small droplets from the urine stream wetting your hand.");
    s("You carefully put just one finger into the edge of her stream - it feels hot and wet.");
    c("ptogether3b", "Continue...");
}


// You take her into the mens room
function ptogether4() {
    s("<b>YOU:</b> Quick!  In here!");
    s("You pull her across the hall towards the men's room.");
    s(girltalk + "But I can't go in there!");
    c("ptogether4b", "I'm a guy, and I'm giving you permission!");
    c(locstack[0], "Okay, then I guess you'll just have to hold it.");
}

function ptogether4b() {
    s("She follows you into the mens room, and you carefully avoid any eye contact with the two dudes using the urinals.");
    displayneed();
    s("You find a reasonably clean stall and pull her in with you.");
    c("ptogether3", "Continue...");
}

// You take her out back
function ptogether5() {
    s("<b>YOU:</b> Quick!  In here!");
    s("You pull her towards the back door at the end of the hall.");
    s(girltalk + "Where are we going?");
    s("<b>YOU:</b> I know a place!");
    displayneed();
    s("You emerge together into a poorly lit parking lot.");
    c("ptogether5a", "Tell " + girlname + " to pee behind the dumpster.");
    c("ptogether5b", "Tell " + girlname + " you'll help her.");
}

function ptogether5a() {
    s("<b>YOU:</b>  You can go behind that dumpster over there!");
    s(girltalk + "<b>This</b> is your solution???");
    displayneed();
    s("You can see the struggle in her eyes as she makes up her mind what to do.");
    s(girltalk + "Can you hold me so I don't fall over?");
    c("ptogether5a2", "Okay...");
    c(locstack[0], "Nevermind - let's go back inside.");
}

function ptogether5a2() {
    s("You don't have to be asked twice.");
    s("You take her hand and lead her behind the dumpster.  She seems nervous.");
    displayneed();
    if (pantycolor !== "none") s(ptogetheroutquote);
    else s(ptogetheroutquotebare);
    s("You steady her and the stream starts immediately, first as an incoherent spray which slightly wets her shoes, and quickly building into a powerful stream.");
    s("By the time she finally cuts it off, the pee has pooled into a pond which is seeping under the dumpster.");
    if (pantycolor !== "none")
        s(finishtogethroutquote);
    else
        s(finishtogetheroutquotebare);
    flushdrank();
    sawherpee = 1;
    c("goback", "Continue...");
}

function ptogether5b() {
    s("<b>YOU:</b>  Here!  I'll help you.");
    s("You push her up against the wall, in the shadows a little ways from the door.");
    s(girltalk + "I can't...");
    if (pantycolor !== "none") {
        s(ptogetherdumpquote);
        s("Her pussy is warm and pulsing underneath the thin fabric as she struggles to control her bladder.");
        s("You pull the gusset aside and spread her lips with your fingers.");
    } else {
        s(ptogetherdumpquotebare);
        s("Her pussy is warm and pulsing aginst your hand as she struggles to control her bladder.");
        s("You carefully spread her lips between your fingers.");
    }
    c("ptogether5c", "Continue...");
}

function ptogether5c() {
    s("<b>YOU:</b>  Go.  Let it all out.");
    s("She protests, but not too strongly, and you feel her pussy tense just as the flow starts, running between your fingers and slightly wetting them before spattering onto the ground in front.");
    if (pantycolor !== "none")
        s(finishtogetherdumpquote);
    else
        s(finishtogetherdumpquotebare);
    s("She gives you a long, hard kiss before you head back inside together.");
    flushdrank();
    sawherpee = 1;
    c("goback", "Continue...");
}

// You stand around looking dumb.
function ptogether6() {
    s("<b>YOU:</b> Duhhhhh...");
    displayneed();
    s("She stamps her foot in impatience.");
    s(girltalk + "You're no help!");
    s("You head back to the dance floor together.");
    c(locstack[0], "Continue...");
}