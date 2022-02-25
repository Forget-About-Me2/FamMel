let bar;
let bartopic = 0; // Topics of discussion at the bar.

function theBarSetup(){
    getjson("locations/theBar", barJsonSetup);
    return {
        "visit": [thebar, "Go to the bar"],
        "wantVisit": [thebar, "Go to the bar like she asked."],
        "group": 4,
        "visited": 0,
        "keyChance": 1,
        foundKey: 0
    }
}

function barJsonSetup(){
    json["theBar"] = formatAllVarsList(json["theBar"]);
    json["barResp"] = formatAllVarsList(json["barResp"]);
    json["barQuotes"] = formatAllVars(json["barQuotes"]);
    json["darkBar"] = formatAllVarsList(json["darkBar"]);
    json["drinkingGame"] = formatAllVarsList(json["drinkingGame"]);
    json["postGame"] = formatAllVarsList(json["postGame"]);
    json["postGameHer"] = formatAllVarsList(json["postGameHer"]);
    json["postGameYou"] = formatAllVarsList(json["postGameYou"]);
    json["holdYourself"] = formatAllVarsList(json["holdYourself"]);
    bar = json;
    talkUnused = bar["barTalk"];
}

function thebar(){
    let curtext = [];
    let listenerList = [];
    if (locstack[0] === "driveout" && locations.theBar.visited && thetime < barclosingtime){
        curtext = printList(curtext, bar["theBar"][0]);
        sayText(curtext);
        if (haveItem("theBarKey")) {
            listenerList.push([[rebar, "But I found this key I have to return!"], "reBar"]);
            cListener([rebar, "But I found this key I have to return!"], "reBar");
        }
        listenerList.push([[driveout, "Continue..."], "driveOut"]);
        cListener([driveout, "Continue..."], "driveOut");
    } else if (!((thetime < barclosingtime) || locstack[0] === "thebar")) itsClosed("theBar", darkBar, "darkBar");
    else {
        if (locstack[0] !== "thebar"){
            curtext = printList(curtext, bar["theBar"][1]);
            pushloc("thebar");
            locations.theBar.visited = 1;
        } else
            curtext = printList(curtext, bar["theBar"][2]);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        curtext = showneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (gottagoflag > 0) {
                curtext = preventpee(curtext);
                sayText(curtext);
            } else {
                listenerList = barTalk(curtext);
                listenerList.push([[function () {
                    buyItem("beer")
                }], "buybeer"]);
                cListener([function () {
                    buyItem("beer")
                }, "Buy beer."], "buybeer");
                if (!locations.theBar.foundKey) {
                    listenerList.push([[function () {
                        lookAround("theBar")
                    }], "lookAround"]);
                    cListener(["", "Look around."], "lookAround");
                }
                curtext = standobjs([]);
                addSayText(curtext);
                if (yourbladder > yourbladurge) {
                    listenerList.push([[youpee], "youpee"],);
                    cListener([youpee, "Go to the bathroom."], "youpee");
                }
            }
            listenerList.push([[leavehm], "leavehm"]);
            cListener([leavehm, "Leave the bar."], "leavehm");
        }
    }
    addListenersList(listenerList);
}

//You use the key you found as excuse to go to the bar another time
function rebar(){
    objects.theBarKey.value = 0;
    pushloc("thebar");
    thebar();
}

let talkUnused; //Bar talk topics that have not been covered yet
let curTopicI; //The current chosen index.
//This generates the conversation returns the listeners and prints the curtext
function barTalk(curtext){
    if (bartopic < 5){
        curTopicI = randomIndex(talkUnused);
        let curTopic = talkUnused[curTopicI];
        let order = [1,2,3]; //Used to determine the order of good,bad, med answers.
        curtext.push(curTopic[0]);
        let listenerList = [];
        sayText(curtext);
        while (order.length !== 0){
            let i = randomIndex(order);
            let cur = order[i];
            order.splice(i, 1);
            listenerList.push([[function () {
                barResp(cur);
            }], "barResp"+cur]);
            cListener(["", curTopic[cur]], "barResp"+cur);
        }
        return listenerList;
    } else
        sayText(curtext);
    return [];
}

function barResp(choice){
    let curtext = [pickrandom(bar["barResp"][choice-1])];
    if (choice === 1 && randomchoice(7))
        curtext.push(pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit]));
    attraction += 6 - 3*choice;
    bartopic++;
    talkUnused.splice(curTopicI,1);
    sayText(curtext);
    cListenerGen([thebar, "Continue..."], "theBar");
}

function sellPanties(){
    const price = 20 + Math.floor(Math.random() * 20);
    sayText(["BARTENDER: I'll give you $" + price + " for those."]);
    money += price;
    objects.wetPanties.value -= 1;
    let listenerList = [];
    listenerList.push([[thebar], "theBar"]);
    listenerList.push([[function () {buyItem("beer")}], "buybeer"]);
    cListener([function () {buyItem("beer")}, "Buy more beer."], "buybeer");
    cListener([thebar, "Continue..."], "theBar");
    addListenersList(listenerList);
}

//TODO turn this into a JSON
function stealbeer() {
    let curtext = [];
    curtext.push("You climb behind the bar and find a clean glass.  Holding it under the tap, you carefully pull the lever and watch as the frothy amber liquid fills the glass.");
    objects.beer.value++;
    sayText(curtext);
    cListener([stealbeer2, "Steal another beer"], "stealbeer");
    cListener([darkBar, "Continue..."], "darkbar");
    addListeners([stealbeer2, "Steal another beer"], "stealbeer");
    addListeners([darkBar, "Continue..."], "darkbar");
}

//TODO put a limit on this/ Game update
//TODO Randomize quotes
function stealbeer2(){
    let curtext = [];
    if (randomchoice(3)) curtext = noteholding(curtext);
    else if (randomchoice(5)) curtext = interpbladder(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        curtext.push("You find another clean glass, and fill it up in a similar way as the previous one.");
        objects.beer.value++;
        sayText(curtext);
        cListener([stealbeer2, "Steal another beer"], "stealbeer");
        cListener([darkBar, "Continue..."], "darkbar");
        addListeners([stealbeer2, "Steal another beer"], "stealbeer");
        addListeners([darkBar, "Continue..."], "darkbar");
    }
}

function darkBar(){
   let curtext = [];
   if (emerBreak || emerHold && bladder < 20) {
       curtext = printList(curtext, bar["darkBar"][0]);
       emerHold = 0;
       emerBreak = 0;
   }
   else if (emerHold) {
       curtext = printList(curtext, bar["darkBar"][1]);
       emerHold = 0;
   }
   else if (locstack[0] !== "darkBar") {
       curtext = printList(curtext, bar["darkBar"][2]);
       pushloc("darkBar");
   }
   else {
       curtext = printList(curtext, bar["darkBar"][3]);
   }
   curtext = showneed(curtext);
   curtext = displayyourneed(curtext);
   if (bladder > bladlose) wetherself();
   else if (yourbladder > yourbladlose) wetyourself();
   else if (gottagoflag > 0) {
       preventpee(curtext);
       sayText(curtext);
   }
   else {
       let listenerList = [];
       curtext = standobjs(curtext);
       sayText(curtext);
       listenerList.push([[stealbeer], "stealBeer"]);
       cListener([stealbeer, "Get a beer."], "stealBeer");
       listenerList.push([[kissher], "kissHer"]);
       cListener([kissher, "Kiss her."], "kissHer");
       listenerList.push([[feelup], "feelUp"]);
       cListener([feelup, "Feel her up."], "feelUp");
       listenerList.push([[playDarts], "playDarts"]);
       cListener([playDarts, "Play a game of darts"], "playDarts");
       if (!checkedherout){
           listenerList.push([[checkherout], "checkOut"]);
           cListener([checkherout, "Check her out."], "checkOut");
       }
       if (yourbladder > yourbladurge) {
           listenerList.push([[youpee], "youPee"]);
           cListener([youpee, "Go to the bathroom."], "youPee");
       }
       listenerList.push([[leavehm], "leaveHm"]);
       cListener([leavehm, "Leave the bar."], "leaveHm");
       addListenersList(listenerList);
   }

}

function pdrinkinggame() {
    let curtext = printList([], bar["drinkingGame"][0]);
    // s("<b>YOU:</b> Why don't you go ahead and go.  But afterwards let's play a little drinking game.");
    // s(girltalk + "What <u>kind</u> of drinking game?");
    // s("<b>YOU:</b> We'll pace each other drinking beers.  First one to pee is the loser.");
    if (attraction >= drinkinggamethreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, bar["drinkingGame"][1]);
        // s(girltalk + "Okay.  But let's go pee first.");
        curtext = displayneed(curtext);
        sayText(curtext);
        cListenerGen([pDrinkingGame2, "Continue..."], "pdrinking");
    } else {
        curtext = printList(curtext, bar["drinkingGame"][2]);
        // s(girltalk + "No way, dude.  I'm outta here.");
        if (attraction < 50)
            attraction -= 2;
        indepee(curtext);
    }

}

function pDrinkingGame2() {
    let curtext = printList([], bar["drinkingGame"][3]);
    // s("You both head off to the restrooms to empty your bladders.");
    // s("Standing in front of the urinal, you imagine her sitting and peeing on the other side of the wall as you drain your bladder of every last drop.");
    // s("You hear the muffled flush of a toilet from the ladies room and walk back out to meet her coming out of the restroom.");
    // s("She seems really relieved, and a bit aroused.");
    flushyourdrank();
    flushdrank();
    yourbladder = 0;
    sayText(curtext);
    cListenerGen([pDrinkingGame3, "Continue..."], "pdrinking");
}

function pDrinkingGame3() {
    pushloc("drinkinggame");
    let curtext = printList([], bar["drinkingGame"][4]);
    // s("<b>YOU:</b> Okay.  All better now?");
    // s("<b>YOU:</b> Here's the rules: we both drink shots of beer until one of us can't hold it.  There's no holding, no tickling, and you have to drain the glass in one go.  Any questions?");
    // s(girltalk + "Okay.  But you're going <i>DOWN</i>!");
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}

let loser;
//TODO more interactions
//TODO  choose what happenes when both lose at the same time
//TODO have a chance to have it escalate
function drinkinggame() {
    let curtext = printList([], bar["drinkingGame"][5]);
    // s("You're playing a drinking game with " + girlname + ".");
    if (yourbladder >= yourbladlose) {
        if (!holdself || randomchoice(holdpeethresh)) {
            poploc();
            pushloc("postgame");
            wetyourself();
            loser = "You";
            return
        }
    }
    if (bladder >= bladlose) {
        poploc();
        pushloc("postgame");
        wetherself();
        loser = "Her"
    } else {
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        curtext = printList(curtext, bar["drinkingGame"][6]);
        // s("<b>YOU:</b> It's time to drink up!");
        // s("You pull two beers, toast, and both drain the glasses.");
        tummy += 40;
        yourtummy += 40;
        holdself = 0;
        drankbeer = 2;
        ydrankbeer = 2;
        let listenerList = [];
        if (yourbladder > yourblademer)
            listenerList.push([[holdYourself, "You grab your dick"], "grabDick"]);
        listenerList.push([[feelup, "You feel her up."], "feelUp"]);
        listenerList.push([[kissher, "Kiss her."], "kissHer"]);
        listenerList.push([[askcanhold, "You ask her how she's doing."], "askHold"]);
        listenerList.push([[playDarts, "Ask her to play darts"], "playDarts"]);
        listenerList.push([[pstory, "Ask her if she's ever wet herself."], "pStory"]);
        listenerList.push([[drinkinggamewait, "Continue..."], "drinkWait"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

//TODO don't pee with her if you're not desperate
function postgame() {
    notdesperate = 0;
    notydesperate = 0;
    nothdesperate = 0;
    let curtext = [];
    let situation = "none";
    let quoteList = bar["postGame"+loser];
    if ((shespurted && loser === "Her")||youSpurted && loser === "You")
        curtext = printList(curtext, quoteList[0]);
        // s("<b>YOU:</b>You lost it, didn't you? You spurted!");
        // s("<b>YOU:</b>What were we playing for again?");
    else
        curtext = printList(curtext, quoteList[1]);
        // s("<b>YOU:</b> Ha!  You lose!  What were we playing for again?");
    curtext = printList(curtext, quoteList[2]);
    // s("<b>" + girlname + " laughs:</b>  We didn't really think of that, did we?  How about a kiss?");
    if (bladder > blademer && yourbladder > yourblademer) {
        situation = "both";
        // s("You reach out to take her in your arms... hoping to squeeze her really tight.");
        // s(girltalk + "But I gotta pee <b>FIRST</b>.");
        // s("You both head off to the restrooms to relieve yourselves and clean up.");
        curtext = printList(curtext, quoteList[3]);
        flushdrank();
        flushyourdrank();
    } else if(bladder > blademer){
        situation = "you";
        curtext = printList(curtext, quoteList[4]);
        // s("You reach out to take her in your arms... hoping to squeeze her really tight.");
        // s(girltalk + "But I gotta pee <b>FIRST</b>.");
        // s("She heads towards the bathroom, you stay behind waiting for her to come back.");
        flushdrank();
    } else {
        if (yourbladder > yourblademer) {
            situation = "you";
            curtext = printList(curtext, quoteList[5]);
            // s("She reaches towards you, and you want to stay, but you simply have to head off to the restrooms to relieve yourself.");
            flushyourdrank();
        } else {
            curtext = printList(curtext, quoteList[6]);
            // s("She reaches towards you and you pull her on your lap, kissing her soundly while cupping a feel.");
            attraction += 5;
            shyness -= 7;
            notdesperate = 1;
        }
    }
    sayText(curtext);
    cListenerGen([function () {postGame2(situation)}, "Continue..."], "goback");
}

function postGame2(situation){
    let curtext = [];
    if (situation === "none") {
        curtext = printList(curtext, bar["postGame"][0]);
        // s("She smiles at you as she moves back to her own chair.");

    } else if(situation === "her"){
        //TODO move back to her own chair
        curtext = printList(curtext, bar["postGame"][1]);
        // s("When she finally emerges from the bathroom she sits down in your lap.");
        // s("She kissed you soundly, before whispering in your ear: <strong>I feel <i>so</i> naughty!</strong>");
        attraction += 5;
        shyness -= 7;
    } else if(situation === "you"){
        //TODO probably have a shyness/attraction check
        //Create a deepCopy of the dialogue that needs to be added so if you insert an element the bar variable itself won't be changed
        let temp = printList([], bar["postGame"][2]);
        if (loser === "her") temp.splice(2, 0, "<em>Yes, you won the game. But it had been a close one.</em>");
        // s("You dash towards the urinal, already pulling your dick out of your boxers.");
        // s("You don't bother holding back a moan as your bladder finally empties.");
        // if(loser === "her") s("<em>Yes, you won the game. But it had been a close one.</em>");
        // s("Suddenly the door to the men's room opens.");
        // s("Surprised you turn your head to see " + girlname + " entering the room with a sultry smile");
        // s("She moves over towards you and you can't help but jump a little as she grasps your still peeing dick");
        // s("She captures your lips before whispering: <strong>That was really hot!</strong>");
        curtext = printList([], temp);
        attraction += 10;
        shyness -= 10;
    }
    else{
        curtext = printList(curtext, bar["postGame"][3]);
        // s("You emerge from the restroom first, then " + girlname + " comes back, looking a little damp and very aroused.");
        // s(girltalk + "I feel <i>so</i> naughty!");
        poploc();
        kissher(curtext);
        return;
    }
    poploc();
    sayText(curtext);
    cListenerGen([darkBar, "Continue..."], "darkBar");
}


function holdYourself() {
    let curtext = printList([], bar["holdYourself"][0]);
    // s("You surreptitiously sneak your hand down into your crotch and massage.");
    if (randomchoice(7)) {
        curtext = printList(curtext, bar["holdYourself"][1]);
        // s(girlname + " doesn't seem to notice.");
        holdself = 1;
    } else
        curtext = printList(curtext, bar["holdYourself"][2]);
        // s(girlname + " sees you and pulls your hand back away from your dick.");
    curtext = showneed(curtext);
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}

function drinkinggamewait() {
    let curtext = printList([], bar["drinkinggame"][7]);
    // s("You and " + girlname + " stare at each other as your feel the beer taking effect.");
    curtext = displayneed(curtext);
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}
