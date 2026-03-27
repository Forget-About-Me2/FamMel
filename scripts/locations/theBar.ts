import { fetchJson } from '../quotes';

export let bar;
export let bartopic = 0; // Topics of discussion at the bar.

export function theBarSetup(){
    fetchJson("locations/theBar").then(barJsonSetup);
    return {
        "visit": [thebar, "Go to the bar"],
        "wantVisit": [thebar, "Go to the bar like she asked."],
        "group": 4,
        "visited": 0,
        "keyChance": 1,
        foundKey: 0
    }
}

function barJsonSetup(data: any){
    bar = data;
    talkUnused = bar["barTalk"];
}

export function thebar(){
    allowItems = 1;
    let curtext = [];
    let listenerList = [];
    // theBar: [0]=revisit from drive, [1]=first arrival, [2]=ambient narration
    const [barRevisit, barArrival, barAmbient] = bar["theBar"];
    if (locStack[0] === "driveout" && locations.theBar.visited && thetime < barclosingtime){
        curtext = printList(curtext, barRevisit);
        sayText(curtext);
        if (haveItem("theBarKey")) {
            listenerList.push([[rebar, sharedLoc["choices"]["returnKey"]], "reBar"]);
        }
        listenerList.push([[driveout, general["continue"]], "driveOut"]);
    } else if (!((thetime < barclosingtime) || locStack[0] === "thebar")) itsClosed("theBar", darkBar, "darkBar");
    else {
        if (locStack[0] !== "thebar"){
            curtext = printList(curtext, barArrival);
            pushloc("thebar");
            locations.theBar.visited = 1;
        } else
            curtext = printList(curtext, barAmbient);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        curtext = showneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (gottagoflag > 0) {
                listenerList = preventpee(listenerList);
                sayText(curtext);
            } else {
                listenerList = barTalk(curtext);
                listenerList.push([[function () {
                    buyItem("beer")
                },objQuotes["buyChoices"]["beer"] ], "buybeer"]);
                if (!locations.theBar.foundKey) {
                    listenerList.push([[function () {
                        lookAround("theBar")
                    }, sharedLoc["choices"]["lookAround"]], "lookAround"]);
                }
                curtext = standobjs([], listenerList);
                addSayText(curtext);
                if (yourbladder > yourbladurge) {
                    listenerList.push([[youpee, bar["choices"]["youPee"]], "youpee"]);
                }
            }
            listenerList.push([[leavehm, bar["choices"]["leaveHm"]], "leavehm"]);
        }
    }
    cListenerGenList(listenerList);
}

//You use the key you found as excuse to go to the bar another time
export function rebar(){
    backPackItems.theBarKey.value = 0;
    pushloc("thebar");
    thebar();
}

export let talkUnused; //Bar talk topics that have not been covered yet
export let curTopicI; //The current chosen index.
//This generates the conversation returns the listeners and prints the curtext
export function barTalk(curtext: any[]){
    if (bartopic < 5){
        curTopicI = randomIndex(talkUnused);
        let curTopic = talkUnused[curTopicI];
        // Response quality: 1=good, 2=neutral, 3=bad (shuffled to randomize button order)
        let order = [1,2,3];
        curtext.push(girltalk+curTopic[0]);
        let listenerList = [];
        sayText(curtext);
        while (order.length !== 0){
            let i = randomIndex(order);
            let responseQuality = order[i];
            order.splice(i, 1);
            listenerList.push([[function () {
                barResp(responseQuality);
            }, curTopic[responseQuality]], "barResp"+responseQuality]);
        }
        return listenerList;
    } else
        sayText(curtext);
    return [];
}

export function barResp(choice: number){
    // barResp: [0]=positive/interested, [1]=neutral, [2]=negative/disinterested
    const GOOD = 1, NEUTRAL = 2, BAD = 3;
    let curtext = [pickrandom(bar["barResp"][choice-1]).formatVars()];
    if (choice === GOOD && randomchoice(7))
        curtext.push(pickrandom(appearance["girls"][basegirl]["stareather"][heroutfit]));
    attraction += 6 - 3*choice; // good=+3, neutral=0, bad=-3
    bartopic++;
    talkUnused.splice(curTopicI,1);
    sayText(curtext);
    cListenerGen([thebar, "Continue..."], "theBar");
}

export function sellPanties(){
    const price = 20 + randomInt(20);
    sayText(["BARTENDER: I'll give you $" + price + " for those."]);
    money += price;
    backPackItems.wetPanties.value -= 1;
    let listenerList = [
        [[function () {buyItem("beer")}, objQuotes["buyChoices"]["beer"]], "buybeer"],
        [[thebar, general["continue"]], "theBar"]
    ];
    listenerList.push([[thebar], "theBar"]);
    listenerList.push([[function () {buyItem("beer")}], "buybeer"]);
    cListener([function () {buyItem("beer")}, "Buy more beer."], "buybeer");
    cListener([thebar, "Continue..."], "theBar");
    addListenersList(listenerList);
}

export function stealbeer() {
    let curtext = [];
    curtext.push(bar["stealBeer"]);
    backPackItems.beer.value++;
    sayText(curtext);
    let listenerList = [
        [[stealbeer2, objQuotes["stealChoices"]["moreBeer"]], "stealbeer"],
        [[darkBar, general["continue"]], "darkbar"]
    ]
    cListenerGenList(listenerList);
}

//TODO put a limit on this/ Game update
//TODO Randomize quotes
export function stealbeer2(){
    let curtext = [];
    if (randomchoice(3)) curtext = noteholding(curtext);
    else if (randomchoice(5)) curtext = interpbladder(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        curtext.push(bar["stealMoreBeer"]);
        backPackItems.beer.value++;
        sayText(curtext);
        let listenerList = [
            [[stealbeer2, objQuotes["stealChoices"]["moreBeer"]], "stealbeer"],
            [[darkBar, general["continue"]], "darkbar"]
        ]
        cListenerGenList(listenerList);
    }
}

export function darkBar(){
    allowItems = 1;
   let curtext = [];
   // darkBar: [0]=rushes to toilet after emergency, [1]=still needs to go badly,
   //          [2]=first entry into closed bar, [3]=ambient/idle
   const [rushesToToilet, stillNeedsToPee, enterClosedBar, darkBarAmbient] = bar["darkBar"];
   if (emerBreak || emerHold && bladder < 20) {
       curtext = printList(curtext, rushesToToilet);
       emerHold = 0;
       emerBreak = 0;
   }
   else if (emerHold) {
       curtext = printList(curtext, stillNeedsToPee);
       emerHold = 0;
   }
   else if (locStack[0] !== "darkBar") {
       curtext = printList(curtext, enterClosedBar);
       pushloc("darkBar");
   }
   else {
       curtext = printList(curtext, darkBarAmbient);
   }
   curtext = showneed(curtext);
   curtext = displayyourneed(curtext);
   let listenerList = []
   if (bladder > bladlose) wetherself();
   else if (yourbladder > yourbladlose) wetyourself();
   else if (gottagoflag > 0) {
       listenerList = preventpee(listenerList);
       sayText(curtext);
   }
   else {
                curtext = standobjs(curtext, listenerList);
       sayText(curtext);
       listenerList.push(
           [[stealbeer, objQuotes["stealChoices"]["beer"]], "stealBeer"],
           [[kissher, general["kissHer"]], "kissHer"],
           [[feelup, general["feelUp"]], "feelUp"],
           [[playDarts, bar["choices"]["playDarts"]], "playDarts"]
           );
       if (!checkedherout){
           listenerList.push([[checkherout, general["checkHerOut"]], "checkOut"]);
       }
       if (yourbladder > yourbladurge) {
           listenerList.push([[youpee, bar["choices"]["youPee"]], "youPee"]);
       }
       listenerList.push([[leavehm, bar["choices"]["leaveHm"]], "leaveHm"]);
   }
    cListenerGenList(listenerList);
}

export function pdrinkinggame() {
    // drinkingGame: [0]=proposal, [1]=she needs to pee first, [2]=rejection,
    //               [3]=bathroom scene, [4]=rules, [5]=status recap,
    //               [6]=drink round, [7]=staring/waiting
    const [gameProposal, needsToPeeFirst, gameRejection, bathroomScene,
           gameRules, gameStatus, drinkRound, staringWaiting] = bar["drinkingGame"];
    let curtext = printList([], gameProposal);
    if (attraction >= drinkinggamethreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, needsToPeeFirst);
        curtext = displayneed(curtext);
        sayText(curtext);
        cListenerGen([pDrinkingGame2, "Continue..."], "pdrinking");
    } else {
        curtext = printList(curtext, gameRejection);
        if (attraction < 50)
            attraction -= 2;
        indepee(curtext);
    }

}

export function pDrinkingGame2() {
    let curtext = printList([], bar["drinkingGame"][3]); // bathroomScene
    flushyourdrank();
    flushdrank();
    yourbladder = 0;
    sayText(curtext);
    cListenerGen([pDrinkingGame3, "Continue..."], "pdrinking");
}

export function pDrinkingGame3() {
    pushloc("drinkinggame");
    let curtext = printList([], bar["drinkingGame"][4]); // gameRules
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}

export let loser;
//TODO more interactions
//TODO  choose what happenes when both lose at the same time
//TODO have a chance to have it escalate
export function drinkinggame() {
    allowItems = 1;
    let curtext = printList([], bar["drinkingGame"][5]); // gameStatus
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
        curtext = printList(curtext, bar["drinkingGame"][6]); // drinkRound
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
        listenerList.push([[pstory, "Ask her if she's ever wet herself."], "pStory"]);
        listenerList.push([[drinkinggamewait, "Continue..."], "drinkWait"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

//TODO don't pee with her if you're not desperate
export function postgame() {
    notdesperate = 0;
    notydesperate = 0;
    nothdesperate = 0;
    let curtext = [];
    let situation = "none";
    // postGame[Her|You]: [0]=already spurted, [1]=didn't spurt, [2]=transition,
    //   [3]=both desperate, [4]=she's desperate, [5]=you're desperate, [6]=neither desperate
    let quoteList = bar["postGame"+loser];
    const [spurtedOpener, cleanOpener, transition,
           bothDesperate, sheDesperate, youDesperate, neitherDesperate] = quoteList;
    if ((shespurted && loser === "Her")||youSpurted && loser === "You")
        curtext = printList(curtext, spurtedOpener);
    else
        curtext = printList(curtext, cleanOpener);
    curtext = printList(curtext, transition);
    if (bladder > blademer && yourbladder > yourblademer) {
        situation = "both";
        curtext = printList(curtext, bothDesperate);
        flushdrank();
        flushyourdrank();
    } else if(bladder > blademer){
        situation = "her";
        curtext = printList(curtext, sheDesperate);
        flushdrank();
    } else {
        if (yourbladder > yourblademer) {
            situation = "you";
            curtext = printList(curtext, youDesperate);
            flushyourdrank();
        } else {
            curtext = printList(curtext, neitherDesperate);
            attraction += 5;
            shyness -= 7;
            notdesperate = 1;
        }
    }
    sayText(curtext);
    cListenerGen([function () {postGame2(situation)}, "Continue..."], "goback");
}

export function postGame2(situation: string){
    let curtext = [];
    // postGame: [0]=no one desperate, [1]=she was desperate, [2]=you were desperate, [3]=both desperate (kiss)
    const [pgNone, pgHerDesperate, pgYouDesperate, pgBothDesperate] = bar["postGame"];
    if (situation === "none") {
        curtext = printList(curtext, pgNone);

    } else if(situation === "her"){
        //TODO move back to her own chair
        curtext = printList(curtext, pgHerDesperate);
        attraction += 5;
        shyness -= 7;
    } else if(situation === "you"){
        //TODO probably have a shyness/attraction check
        //Create a deepCopy of the dialogue that needs to be added so if you insert an element the bar variable itself won't be changed
        let temp = printList([], pgYouDesperate);
        if (loser === "her") temp.splice(2, 0, "<em>Yes, you won the game. But it had been a close one.</em>");
        curtext = printList([], temp);
        attraction += 10;
        shyness -= 10;
    }
    else{
        curtext = printList(curtext, pgBothDesperate);
        poploc();
        kissher(curtext);
        return;
    }
    poploc();
    sayText(curtext);
    cListenerGen([darkBar, "Continue..."], "darkBar");
}


export function holdYourself() {
    // holdYourself: [0]=sneak hand down, [1]=unnoticed, [2]=caught
    const [sneakHand, holdUnnoticed, holdCaught] = bar["holdYourself"];
    let curtext = printList([], sneakHand);
    if (randomchoice(7)) {
        curtext = printList(curtext, holdUnnoticed);
        holdself = 1;
    } else
        curtext = printList(curtext, holdCaught);
    curtext = showneed(curtext);
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}

export function drinkinggamewait() {
    let curtext = printList([], bar["drinkinggame"][7]); // staringWaiting
    curtext = displayneed(curtext);
    sayText(curtext);
    cListenerGen([drinkinggame, "Continue..."], "pdrinking");
}
export function exposeTheBarOnWindow(): void {
    const w = window as any;
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['bar', () => bar, (v) => { bar = v; }],
        ['bartopic', () => bartopic, (v) => { bartopic = v; }],
        ['talkUnused', () => talkUnused, (v) => { talkUnused = v; }],
        ['curTopicI', () => curTopicI, (v) => { curTopicI = v; }],
        ['loser', () => loser, (v) => { loser = v; }],
    ];
    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, { get: getter, set: setter, configurable: true, enumerable: true });
    }
    w.theBarSetup = theBarSetup;
    w.thebar = thebar;
    w.rebar = rebar;
    w.barTalk = barTalk;
    w.barResp = barResp;
    w.sellPanties = sellPanties;
    w.stealbeer = stealbeer;
    w.stealbeer2 = stealbeer2;
    w.darkBar = darkBar;
    w.pdrinkinggame = pdrinkinggame;
    w.pDrinkingGame2 = pDrinkingGame2;
    w.pDrinkingGame3 = pDrinkingGame3;
    w.drinkinggame = drinkinggame;
    w.postgame = postgame;
    w.postGame2 = postGame2;
    w.holdYourself = holdYourself;
    w.drinkinggamewait = drinkinggamewait;
}