let theatre;
let rrMovieLineThresh = 7; // Likelihood of line for restroom in the movie theatre.

function theatreSetup(){
    getjson("locations/theatre", theatreJsonSetup);
    return {
        "visit": [theTheatre, "Go to the theatre"],
        "wantVisit": [theTheatre, "Go to see a movie as she suggested."],
        "group": 3,
        "visited": 0
    }
}

function theatreJsonSetup(){
    theatre = json;
    theatre["theatre"] = formatAllVarsList(theatre["theatre"]);
    theatre["darkTheatre"] = formatAllVarsList(theatre["darkTheatre"]);
    theatre["noRest"] = formatAllVarsList(theatre["noRest"]);
    Object.keys(theatre["noToilet"]).forEach(key => {
        const item = theatre["noToilet"][key];
        item["quotes"] = formatAllVarsList(item["quotes"]);
    });
}

function theTheatre(){
    let curtext = [];
    let listenerList = [];
    if (seenmovie && locstack[0] === "driveout" && thetime < theaterclosingtime){
        curtext = printList(curtext, theatre["theatre"][0]);
        sayText(curtext);
        listenerList.push([[driveout, "Continue..."], "driveOut"]);
        if (haveItem("theTheatreKey")) {
            listenerList.push([[reTheatre, "But I found this key I have to return!"], "reTheatre"]);
        }
    } else if ((thetime < theaterclosingtime) || locstack[0] === "themovie"){
        if (locstack[0] !== "theTheatre") {
            curtext = printList(curtext, theatre["theatre"][1]);
            pushloc("theTheatre");
            locations.theatre.visited = 1;
        } else
            curtext = printList(curtext, theatre["theatre"][2]);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else if (gottagoflag > 0){
            curtext = preventpee(curtext);
            sayText(curtext);
        } else {
            listenerList.push([[buySoda, "Buy soda."], "buySoda"]);
            listenerList.push([[askMovie, "Ask her which movie she wants to watch."], "askMovie"]);
            if (yourbladder > yourbladurge)
                listenerList.push([[youpee, "Go to the bathroom."], "youPee"]);
            listenerList.push([[leavehm, "Leave the Movie Theatre."], "leaveHm"]);
            curtext = standobjs(curtext);
            sayText(curtext);
        }
    } else itsClosed("theTheatre", darkTheatre, "darkTheatre");
    cListenerGenList(listenerList);
}

function reTheatre() {
    objects.theTheatreKey.value = 0;
    pushloc("theTheatre");
    theTheatre();
}

function buySoda() {
    if (money >= 5) {
        s("You buy a soda for $5.00.");
        soda += 1;
        money -= 5;
    } else s("You don't have enough money!");
    c("buysoda", "Buy another soda" )
    c(locstack[0], "Continue...");
}


function askMovie() {
    if (moviecounter === 0) {
        askedfavourite = 1;
        let moviename = theatre["favouriteMovie"][favoritemovie]["name"];
        s(girlname + " smiles at you.");
        s(girltalk + "I'd love to see " + moviename + ".");
        c("moviefavor", "Let's watch that then.");
        if (favoritemovie === "theurge")
            c("chooseothermovie", "Nah. Horror flicks are boring.");
        if (favoritemovie === "thedesp")
            c("chooseothermovie", "Nah. That's a chick flick!");
        if (favoritemovie === "thectrl")
            c("chooseothermovie", "Nah. College films are stupid.");
        if (favoritemovie === "thelitr")
            c("chooseothermovie", "Nah. I'm really not into crime and punishment.");
    } else {
        s(girlname + " laughs: Two movies in one night?  Let's go do something else!");
        c(locstack[0], "Continue...");
    }
}

function chooseothermovie() {
    s("The other movies that are playing:");
    if (favoritemovie !== "theurge")
        c("movieurge", "The Urge - <i>A horror flick</i>");
    if (favoritemovie !== "thedesp")
        c("moviedesp", "Desperate Housewives : The Movie");
    if (favoritemovie !== "thectrl")
        c("moviectrl", "Control Yourself - <i>A romantic comedy</i>");
    if (favoritemovie !== "thelitr")
        c("movielitr", "2 Liters, 25 Hours - <i>A police drama</i>");

}

function choosemovie() {
    if (moviecounter === 0) {
        s("There are many movies playing:");
        c("movieurge", "The Urge - <i>A horror flick</i>");
        c("moviedesp", "Desperate Housewives : The Movie");
        c("moviectrl", "Control Yourself - <i>A romantic comedy</i>");
        c("movielitr", "2 Liters, 25 Hours - <i>A police drama</i>");
    } else {
        s(girlname + " laughs: Two movies in one night?  Let's go do something else!");
        c(locstack[0], "Continue...");
    }
}

function movieurge() {
    moviechoice = 0;
    if (favoritemovie === "theurge") premoviepee(); else movieargue();
}

function moviedesp() {
    moviechoice = 1;
    if (favoritemovie === "thedesp") premoviepee(); else movieargue();
}

function moviectrl() {
    moviechoice = 2;
    if (favoritemovie === "thectrl") premoviepee(); else movieargue();
}

function movielitr() {
    moviechoice = 3;
    if (favoritemovie === "thelitr") premoviepee(); else movieargue();
}

function movieargue() {
    if (askedfavourite) {
        s("She looks like she wants to argue, but doesn't.");
        attraction -= 5;
        premoviepee()
    } else {
        let moviename;
        if (favoritemovie === "theurge") moviename = "The Urge";
        if (favoritemovie === "thedesp") moviename = "Desperate Houswives";
        if (favoritemovie === "thectrl") moviename = "Control Yourself";
        if (favoritemovie === "thelitr") moviename = "2 Liters";
        s(girlname + " looks you directly in the eyes and a pout forms on her lips.");
        s(girltalk + "But I wanna watch " + moviename + "!");
        c("moviefavor", "Okay.  But you owe me one.");
        if (favoritemovie === "theurge")
            c("premoviepee", "Nah. Horror flicks are boring.");
        if (favoritemovie === "thedesp")
            c("premoviepee", "Nah. That's a chick flick!");
        if (favoritemovie === "thectrl")
            c("premoviepee", "Nah. College films are stupid.");
        if (favoritemovie === "thelitr")
            c("premoviepee", "Nah. I'm really not into crime and punishment.");
    }
}

//TODO figure out moviename
function moviefavor() {
    if (favoritemovie === "theurge") {
        moviename = "The Urge";
        moviechoice = 0;
    }
    if (favoritemovie === "thedesp") {
        moviename = "Desperate Houswives";
        moviechoice = 1;
    }
    if (favoritemovie === "thectrl") {
        moviename = "Control Yourself";
        moviechoice = 2;
    }
    if (favoritemovie === "thelitr") {
        moviename = "2 Liters";
        moviechoice = 3;
    }

    if (!askedfavourite) {
        owedfavor += 1;
    } else {
        attraction += 2;
    }
    premoviepee();
}

//TODO figure out duplicate continue's
function premoviepee() {
    pushloc("domovie");
    changevenueflag = 1;//TODO probs delete
    showneed();
    displayyourneed();
    if (gottagoflag > 0) {
        c("holdit", "Ask her to hold it.");
        c("allowpee", "Let her go.");
    } else if (yourbladder > yourbladneed) {
        c("youpee", "Use the bathroom before watching the movie.");
        c(locstack[0], "Buy the tickets and head over to find the auditorium.");
    } else {
        s("You buy tickets and head over to find the auditorium.");
        c(locstack[0], "Continue...");
    }
}

//TODO you can go to the bathroom if you're desperate
function domovie() {
    if (locstack[0] !== "domovie") {
        s("You and " + girlname + " enter the darkened theater.");
        pushloc("domovie");
        moviecounter = 0;
    } else {
        s("You are watching the movie.");
        moviecounter += 1;
    }

    seenmovie = 1;

    if (moviecounter >= 7) {
        s("The movie has ended.");
        poploc();
        changevenueflag = 1;
    } else {
        if (moviechoice === 0) s(moviedesc0[moviecounter]);
        else if (moviechoice === 1) s(moviedesc1[moviecounter]);
        else if (moviechoice === 2) s(moviedesc2[moviecounter]);
        else s(moviedesc3[moviecounter]);
    }

    s(girlname + " is sitting beside you.");
    if (randomchoice(4)) noteholding();

    showneed();
    displayyourneed();
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            preventpee();
        } else {
            c("movieromance", "Reach over and hold her hand.");
            c("moviesex", "Reach over and touch her thigh.");
            c("moviescary", "Lean closer to her.");
            c("moviedoh", "Look her in the eyes.");
        }
        if (moviecounter < 7) c("leavehm", "Leave the theater.");
    }
}

// moviedesc - 0 : Anticipate
//             1 : Strange
//             2 : Scary
//             3 : Sexy
//             4 : Romantic
//             5 : Sexy
//             6 : Romantic


function movieromance() {
    s("You reach over and hold your hand in hers.");
    if (moviecounter === 4 || moviecounter === 6 || attraction > 30) {
        s("She gives your hand a squeeze.");
        attraction += 3;
        shyness -= 3;
    } else {
        s("Her hand is kind of cold.");
    }
    c(locstack[0], "Continue...");
}

function moviesex() {
    s("You reach over and brush her thigh lightly with the back of your hand.");
    if (moviecounter === 3 || moviecounter === 5 || attraction > 70) {
        s(thighresp[randcounter]);
        incrandom();
        attraction += 3;
        shyness -= 3;
    } else {
        s("She firmly moves your hand off her leg.");
    }
    c(locstack[0], "Continue...");
}

function moviescary() {
    s("You lean towards her.");
    if (moviecounter === 2 || attraction > 40) {
        s("She leans back toward you and puts her hand in yours.");
        attraction += 3;
        shyness -= 3;
    } else {
        s("She doesn't seem to notice.");
    }
    c(locstack[0], "Continue...");
}

function moviedoh() {
    s("You look over at her sitting beside you.");
    if (moviecounter === 1 || attraction > 50) {
        s("... and find her staring back at you.");
        s("Your eyes meet, and she smiles.");
        attraction += 3;
        shyness -= 3;
    } else {
        s("... and see her intently watching the movie.");
    }
    c(locstack[0], "Continue...");
}

//TODO fix thehold my purse
function darkTheatre() {
    let curtext = [];
    let listenerList = [];
    if (locstack[0] !== "darkTheatre") {
        curtext = printList(curtext, theatre["darkTheatre"][0]);
        pushloc("darkTheatre");
    } else {
        curtext = printList(curtext, theatre["darkTheatre"][1])
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else if (gottagoflag > 0) {
        curtext = preventpee(curtext);
        sayText(curtext);
    } else {
        curtext = standobjs(curtext);
        sayText(curtext);
        listenerList.push([[stealSoda, "Get a soda."], "stealSoda"]);
        listenerList.push([[kissher, "Kiss her."], "kissHer"]);
        listenerList.push([[feelup, "Feel her up."], "feelUp"]);
        if (!checkedherout) listenerList.push([[checkherout, "Check her out."], "checkHerOut"]);
        if (yourbladder > yourbladurge) listenerList.push([[youpee, "Go to the bathroom."], "youPee"]);
        listenerList.push([[leavehm, "Leave the Theatre"], "leaveHm"]);
    }
    cListenerGenList(listenerList);
}

function stealSoda() {
    let curtext = printList([], theatre["stealSoda"][0]);
    // s("You climb behind the snack counter, grab a big paper cup.  You scoop a bit of ice and fill it to the top, capping it with a lid and a straw.");
    objects.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO put a limit on this/ Game update
//TODO randomize quotes
function stealSoda2(){
    let curtext = printList([], theatre["stealSoda"][1]);
    // s("You grab another paper cup, and fill it up in a similar way as the previous one.");
    objects.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO let her choose.
function pnorestroom() {
    let curtext = printList([], theatre["noRest"][0]);
    // s("<b>YOU:</b> Why don't you go ahead and go.  But not in the restrooms.");
    if (attraction >= pnorestroomthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, theatre["noRest"][1]);
        // s(girltalk + "What?  Then where am I supposed to go?");
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
        // s(girltalk + "No way, dude.  I'm outta here.");
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

// function ptrashcan() {
//     s("<b>YOU:</b> How about that trashcan?");
//     displayneed();
//     s(girlname + " looks around apprehensively before heading over to it.");
//     s(girltalk + "Am I gonna regret this?");
//     if (pantycolor === "none")
//         s(peeprepquotebare);
//     else
//         s(peeprepquote);
//     s("Quickly, " + girlname + " lowers herself over the trashcan and lets go.  Her pee hisses out and hits the trashcan liner with a loud clatter.");
//     flushdrank();
//     sawherpee = 1;
//     s("The bottom of the trashcan is a sea of fragrant pee.  You offer her a tissue, but she simply gets back up and gives you a hug.");
//     s(girltalk + "That's <u>so</u> much better.");
//     c("goback", "Continue...");
// }

// function psink() {
//     s("<b>YOU:</b> How about the sink over there?");
//     displayneed();
//     s(girlname + " looks around apprehensively before climbing over the snack counter.");
//     s(girltalk + "How am I gonna do this?");
//     if (pantycolor === "none")
//         s(peeprepquotebare);
//     else
//         s(peeprepquote);
//     s("Carefully, " + girlname + " lifts herself up onto the counter and positions her butt over the sink.  Even before she's settled into place, she lets go.  Her pee hisses out and hits the metal sink with a loud clatter.");
//     flushdrank();
//     sawherpee = 1;
//     c("goback", "Continue...");
// }

// function psodacup() {
//     s("<b>YOU:</b> How about a soda cup?");
//     displayneed();
//     s(girlname + " looks around apprehensively as you get a big plastic soda cup from behind the snack counter.");
//     s(girltalk + "Am I gonna regret this?");
//     if (pantycolor === "none")
//         s(peeprepquotebare);
//     else
//         s(peeprepquote);
//     s("Carefully, " + girlname + " brings the cup between her beautiful trembling thighs and lets go.  Her pee hisses out and foams into the cup.");
//     flushdrank();
//     sawherpee = 1;
//     s(girltalk + "That's better!");
//     s("She puts a lid on the cup and hands it to you.  The cup is warm with the heat of her urine, and her scent wafts from the straw hole.");
//     c("goback", "Continue...");
// }

// function pfloor() {
//     s("<b>YOU:</b> Why don't you pee right there on the carpet?");
//     displayneed();
//     s(girlname + " looks around apprehensively before squatting down.");
//     s(girltalk + "Are you sure we're not gonna get in trouble?");
//     if (pantycolor === "none")
//         s(peeprepquotebare);
//     else
//         s(peeprepquote);
//     s(girlname + " starts to pee immediately.  Her stream hisses out and spatters on the carpet, which soaks it up quickly, making a gurgling spattering noise.  The scent of her pee fills the air.");
//     flushdrank();
//     sawherpee = 1;
//     c("goback", "Continue...");
// }
