let bar;

function theBarSetup(){
    getjson("locations/theBar", barJsonSetup);
    return {
        "visit": [thebar, "Go to the bar"],
        "wantVisit": [thebar, "Go to the bar like she asked."],
        "group": 1,
        "visited": 0,
        "keyChance": 1
    }
}

function barJsonSetup(){
    json["theBar"] = formatAllVarsList(json["theBar"]);
    json["barResp"] = formatAllVarsList(json["barResp"]);
    json["barQuotes"] = formatAllVars(json["barQuotes"]);
    json["darkBar"] = formatAllVarsList(json["darkBar"]);
    json["drinkingGame"] = formatAllVarsList(json["drinkingGame"]);
    bar = json;
    talkUnused = bar["barTalk"];
}

function thebar(){
    let curtext = [];
    if (locstack[0] === "driveout" && beenbar && thetime < barclosingtime){
        curtext = printList(curtext, bar["theBar"][0]);
        curtext = callChoice([driveout, "Continue..."], curtext);
        sayText(curtext);
        if (haveItem("barKey"))
            cListenerGen([rebar, "But I found this key I have to return!"]);
    } else if (!((thetime < barclosingtime) || locstack[0] === "thebar")) itsClosed("theBar", darkBar, "darkBar");
    else {
        if (locstack[0] !== "thebar"){
            curtext = printList(curtext, bar["theBar"][1]);
            pushloc("thebar");
            beenbar = 1;
        } else {
            curtext = printList(curtext, bar["theBar"][2]);
            if (randomchoice(3)) curtext = noteholding(curtext);
            else if (randomchoice(5)) curtext = interpbladder(curtext);
            curtext = displayyourneed(curtext);
        }
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (gottagoflag > 0){
                preventpee();
            }
            let listenerList = barTalk(curtext);
            listenerList.push([[buybeer], "buybeer"]);
            cListener([buybeer, "Buy a beer."], "buybeer");
            if (!haveItem("theBarKey")){
                listenerList.push([[function () {lookAround("theBar")}], "lookAround"]);
                cListener(["", "Look around."], "lookAround");
            }
            curtext = standobjs([]);
            addSayText(curtext);
            if (yourbladder > yourbladurge){
                listenerList.push([[youpee], "youpee"],);
                cListener([youpee, "Go to the bathroom."], "youpee");
            }
            listenerList.push([[leavehm], "leavehm"]);
            cListener([leavehm, "Leave the bar."], "leavehm");
            addListenersList(listenerList);
        }
    }
}

let talkUnused; //Bar talk topics that have not been covered yet
let curTopicI; //The current chosen index.
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

//TODO turn this into a JSON
function buybeer() {
    let curtext = [];
    if (randomchoice(3)) curtext = noteholding(curtext);
    else if (randomchoice(5)) curtext = interpbladder(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curtext);
        let listenerList = [];
        if (money >= 3) {
            curtext.push("You buy a beer for $3.00.");
            objects.beer.value++;
            money -= 3;
            const i = randomIndex(bar["barQuotes"]);
            curtext.push(bar["barQuotes"][i]);
            sayText(curtext);
            curtext = [];
            if (haveItem("wetPanties") && i === 3) {
                listenerList.push([[sellPanties], "sellPanties"]);
                cListener([sellPanties, "Sell wet panties to the bartender."], "sellPanties");
            }
        } else curtext.push("You don't have enough money!");
        addSayText(curtext);
        listenerList.push([[buybeer], "buybeer"]);
        listenerList.push([[thebar], "theBar"]);
        cListener([buybeer, "Buy another beer"], "buybeer");
        cListener([thebar, "Continue..."], "theBar");
        addListenersList(listenerList);
    }
}

function sellPanties(){
    const price = 20 + Math.floor(Math.random() * 20);
    sayText(["BARTENDER: I'll give you $" + price + " for those."]);
    money += price;
    objects.wetPanties.value -= 1;
    let listenerList = [];
    listenerList.push([[buybeer], "buybeer"]);
    listenerList.push([[thebar], "theBar"]);
    cListener([buybeer, "Buy another beer"], "buybeer");
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


//You use the key you found as excuse to go to the bar another time
function rebar(){
    objects.barKey.value = 0;
    pushloc("thebar");
    thebar();
}

function darkBar(){
    let curtext = [];
   if (emerBreak || emerHold && bladder < 20)
       curtext = printList(curtext, bar["darkBar"][0]);
   else if (emerHold)
       curtext = printList(curtext, bar["darkBar"][1]);
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
    let curtext = printList(bar["drinkingGame"][0]);
    // s("<b>YOU:</b> Why don't you go ahead and go.  But afterwards let's play a little drinking game.");
    // s(girltalk + "What <u>kind</u> of drinking game?");
    // s("<b>YOU:</b> We'll pace each other drinking beers.  First one to pee is the loser.");
    if (attraction >= drinkinggamethreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, bar["drinkingGame"][1]);
        // s(girltalk + "Okay.  But let's go pee first.");
        curtext = displayneed(curtext);
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
    s("You both head off to the restrooms to empty your bladders.");
    s("Standing in front of the urinal, you imagine her sitting and peeing on the other side of the wall as you drain your bladder of every last drop.");
    s("You hear the muffled flush of a toilet from the ladies room and walk back out to meet her coming out of the restroom.");
    s("She seems really relieved, and a bit aroused.");
    flushdrank();
    yourbladder = 0;
    c("pdrinkinggame3", "Continue...");
}

function pdrinkinggame3() {
    pushloc("drinkinggame");
    s("<b>YOU:</b> Okay.  All better now?");
    s("<b>YOU:</b> Here's the rules: we both drink shots of beer until one of us can't hold it.  There's no holding, no tickling, and you have to drain the glass in one go.  Any questions?");
    s(girltalk + "Okay.  But you're going <i>DOWN</i>!");
    c(locstack[0], "Continue...");
}

//TODO more interactions
//TODO  choose what happenes when both lose at the same time
//TODO have a chance to have it escalate
function drinkinggame() {
    s("You're playing a drinking game with " + girlname + ".");
    let peedself = 0; //This flag is purely used to prevent the dialog of the drinking game from popping up if you lost
    if (yourbladder >= yourbladlose) {
        if (!holdself || randomchoice(holdpeethresh)) {
            peedself = 1;
            poploc();
            pushloc("postgamelose");
            wetyourself();
        }
    }
    if (bladder >= bladlose) {
        poploc();
        pushloc("postgame");
        wetherself();
    } else if (!peedself) {
        displayneed();
        displayyourneed();
        s("<b>YOU:</b> It's time to drink up!");
        s("You pull two beers, toast, and both drain the glasses.");
        tummy += 40;
        yourtummy += 40;
        holdself = 0;
        drankbeer = 2;
        ydrankbeer = 2;
        if (yourbladder > yourblademer)
            c("holdyourself", "You grab your dick.");
        c("feelup", "You feel her up.");
        c("askcanhold", "You ask her how she's doing.");
        c("pstory", "Ask her if she's ever wet herself.");
        c("drinkinggamewait", "Continue...");
    }
}

//TODO don't pee with her if you're not desperate
function postgame() {
    notdesperate = 0;
    notydesperate = 0;
    nothdesperate = 0;
    if (shespurted) {
        s("<b>YOU:</b>You lost it, didn't you? You spurted!");
        s("<b>YOU:</b>What were we playing for again?");
    } else {
        s("<b>YOU:</b> Ha!  You lose!  What were we playing for again?");
    }
    s("<b>" + girlname + " laughs:</b>  We didn't really think of that, did we?  How about a kiss?");
    if (bladder > blademer && yourbladder > yourblademer) {
        //TODO fix this scene
        s("You reach out to take her in your arms... hoping to squeeze her really tight.");
        s(girltalk + "But I gotta pee <b>FIRST</b>.");
        s("You both head off to the restrooms to relieve yourselves and clean up.");
        flushdrank();
        flushyourdrank();
    } else if(bladder > blademer){
        notydesperate=1;
        s("You reach out to take her in your arms... hoping to squeeze her really tight.");
        s(girltalk + "But I gotta pee <b>FIRST</b>.");
        s("She heads towards the bathroom, you stay behind waiting for her to come back.");
        flushdrank();
    } else {
        if (yourbladder > yourblademer) {
            nothdesperate=1;
            s("She reaches towards you, and you want to stay, but you simply have to head off to the restrooms to relieve yourself.");
            flushyourdrank();
        } else {
            s("She reaches towards you and you pull her on your lap, kissing her soundly while cupping a feel.");
            attraction += 5;
            shyness -= 7;
            notdesperate = 1;
        }
    }
    c("goback", "Continue...");
}

//TODO you spurted.
function postgamelose() {
    s(girltalk + "Ha!  You lose!  What were we playing for again?");
    s("<b>" + girlname + " laughs:</b>  We didn't really think of that, did we?  How about a kiss?");
    s("You reach out to take her in your arms... hoping to squeeze her really tight.");
    s(girltalk + "But I gotta pee <b>FIRST</b>.  And you've got to clean up.");
    s("You both head off to the restrooms.  You to clean up and her to find sweet relief.");
    flushdrank();
    flushyourdrank();
    c("goback", "Continue...");
}

function holdyourself() {
    s("You surreptitiously sneak your hand down into your crotch and massage.");
    if (randomchoice(7)) {
        s(girlname + " doesn't seem to notice.");
        holdself = 1;
    } else {
        s(girlname + " sees you and pulls your hand back away from your dick.");
    }
    showneed();
    c("drinkinggame", "Continue...");
}

function drinkinggamewait() {
    s("You and " + girlname + " stare at each other as your feel the beer taking effect.");
    displayneed();
    c("drinkinggame", "Continue...");
}
