let bar;

function theBarSetup(){
    getjson("locations/theBar", barJsonSetup);
    return {
        "visit": [theBar, "Go to the bar"],
        "wantVisit": [theBar, "Go to the bar like she asked."],
        "group": 1,
        "visited": 0,
    }
}

function barJsonSetup(){
    json["theBar"] = formatAllVarsList(json["theBar"]);
    json["barResp"] = formatAllVarsList(json["barResp"]);
    json["barQuotes"] = formatAllVars(json["barQuotes"]);
    bar = json;
    talkUnused = bar["barTalk"];
}

function theBar(){
    let curtext = [];
    if (locstack[0] === "driveout" && beenbar && thetime < barclosingtime){
        curtext = printList(curtext, bar["theBar"][0]);
        curtext = callChoice(["curtext", "Continue..."], curtext);
        sayText(curtext);
        if (haveItem("barKey"))
            cListenerGen([rebar, "But I found this key I have to return!"]);
    } else if (!((thetime < barclosingtime) || locstack[0] === "thebar")) itsclosed("thebar");
    else {
        if (locstack[0] !== "thebar"){
            curtext = printList(curtext, bar["theBar"][1]);
            pushloc("thebar");
            beenbar = 1;
        } else {
            curtext = printList(curtext, bar["theBar"][2]);
            if (randomchoice(3)) curtext = noteholding(curtext);
            else if (randomchoice(5)) curtext = interpbladder(curtext);
        }
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else {
            if (gottagoflag > 0){
                preventpee();
            }
            barTalk(curtext);
            let listenerList = [];
            listenerList.push([buybeer], "buybeer");
            cListener([buybeer, "Buy a beer."], "buybeer");
            if (!haveItem("barKey")){
                listenerList.push([[lookAround], "lookAround"]);
                cListener([lookAround, "Look around."], "lookAround");
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
        while (order){
            let i = randomIndex(order);
            let f = function () {
                barResp(i);
            }
            listenerList.push([f], "barResp"+i);
            cListener([f, curTopic[i]], "barResp"+i);
        }
        addListenersList(listenerList);
    } else
        sayText(curtext);
}

function barResp(choice){
    let curtext = [pickrandom(bar["barResp"][choice-1])];
    if (choice === 1 && randomchoice(7))
        curtext.push(pickrandom(appearance[basegirl]["stareather"][heroutfit]));
    attraction += 6 - 3*choice;
    bartopic++;
    talkUnused.remove(curTopicI);
    sayText(curtext);
    cListenerGen([theBar, "Continue..."], "theBar");
}

//TODO turn this into a JSON
function buybeer() {
    let curtext = [];
    sayText(curtext);
    let listenerList = [];
    if (money >= 3) {
        curtext.push("You buy a beer for $3.00.");
        objects.beer.value++;
        money -= 3;
        const i = randomIndex(bar["barquotes"]);
        curtext.push(bar["barquotes"][i]);
        sayText(curtext);
        curtext = [];
        if (haveItem("wetPanties") && i === 3) {
            listenerList.push([[sellPanties], "sellPanties"]);
            cListener([sellPanties, "Sell wet panties to the bartender."], "sellPanties");
        }
    } else curtext.push("You don't have enough money!");
    addSayText(curtext);
    listenerList.push([[buybeer], "buybeer"]);
    listenerList.push([[theBar], "theBar"]);
    cListener([buybeer, "Buy another beer"], "buybeer");
    cListener([theBar, "Continue..."], "theBar");
    addListenersList(listenerList);
}

function sellPanties(){
    const price = 20 + Math.floor(Math.random() * 20);
    sayText(["BARTENDER: I'll give you $" + price + " for those."]);
    money += price;
    objects.wetPanties.value -= 1;
    cListenerGen([buybeer, "Buy another beer"], "buybeer");
    cListenerGen([theBar, "Continue"], "theBar");
}

//TODO turn this into a JSON
function stealbeer() {
    s("You climb behind the bar and find a clean glass.  Holding it under the tap, you carefully pull the lever and watch as the frothy amber liquid fills the glass.");
    beer += 1;
    c("stealbeer2", "Steal another beer");
    c(locstack[0], "Continue...");
}

//Use the key to open the closed bar
function breakBar(){

}

//You use the key you found as excuse to go to the bar another time
function rebar(){
    objects.barKey.value = 0;
    pushloc("thebar");
    theBar();
}
