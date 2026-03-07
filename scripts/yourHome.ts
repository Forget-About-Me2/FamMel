import yourHomeJson from "../Json/yourhome.json"
import { gameState, LocationCategory } from "./gameState/gameState";
import { gameSettings } from "./settings/gameSettings";

//This contains everything you can do from your home before you pick-up your date

//TODO different scene if you're desperate and go pee at your house
//TODO you can actually wet yourself in the house
//TODO decide whether you can always go to the bathroom(maybe like a certain percentage filled)
//TODO refactor
export function yourHome() {
    allowItems = 1;
    let curText: string[] =[];
    if (!gameState.DidIntro) {
        gameState.DidIntro = true;
        curText.push(...yourHomeJson.intro);
    } else {
        if (!gameState.isCurrentLocation(LocationCategory.YourHome)){
            locationMSetup("yourhome", "yourhome");
        }
    }
    curText.push(yourHomeJson.actionQuestion);
    curText = displayyourneed(curText);
    const listenerList : [[Function, string], string][] = [];
    listenerList.push([[goStore, yourHomeJson.goStore], "goStore"]);
    listenerList.push([[callHer, yourHomeJson.callHer], "callHer"]);
    if (gameSettings.PlayerBladder) {
        if (yourbladder > yourbladlose) {
            wetyourself();
            return;
        }
        if (yourbladder > yourbladurge) {
            listenerList.push([[youpee, yourHomeJson.youPee], "youPee"]);
        }
        listenerList.push([[yPreDrink, yourHomeJson.yPreDrink], "yPreDrink"]);
    }
    listenerList.push([[herhome, yourHomeJson.herHome], "pickup"]);
    sayText(curText)
    cListenerGenList(listenerList);
}



function buy(number){
    const item = locjson["buying"][number];
    const price = Number(item[1]);
    let curtext = [];
    let obj = backPackItems[item[2]];
    if (money >= price){
        curtext.push("You buy a "+ item[0]+ ".")
        obj.value += 1;
        money -= price;
        if (obj.hasOwnProperty("bottles"))
            obj.bottles.push(6);
    } else curtext.push("You don't have enough money!");
    curtext = c(["gostore", "Back to store"], curtext);
    sayText(curtext);
}

//
//  You call her on the phone.
//  This is a subroutine - valid location with push and pop.
//
//TODO you can't see her looking away on the phone
//TODO show your need?
function callHer() {
    allowItems = 1;
    let curtext = [];
    if (locStack[0] !== "callher") {
        flirtedflag = 0;
        pushloc("callher");
        locationMSetup("yourhome", "callher")
        curtext = printIntro(curtext, 0);
        if (thetime > 75 && bladder < blademer) {
            late = 1;
        }
    } else {
        curtext = printIntro(curtext, 1);
    }

    var listenerList = [];
    if (late) {
        let startI = curtext.length;
        curtext = printDialogue(curtext, "callher",0);
        if (askholditcounter) curtext = displaygottavoc(curtext, startI+2);
        attraction -= 5;
        shyness -= 10;
        curtext = printChoices(curtext, [0]);
    } else if (thetime > 75 && bladder < blademer) {
        curtext = printDialogue(curtext,"callher", 1);
        curtext = printChoices(curtext, [0]);
    } else if (bladder > blademer && !askholditcounter) {
        curtext = printDialogue(curtext, "callher", 2);
        curtext = printChoices(curtext, [0]);
        flushdrank();
    } else if (bladder > blademer && askholditcounter && waitcounter === 0) {
        curtext = cantwait(curtext);
    } else {
        if (shyness > 80) shyness -= 1;
        //TODO This also prints highflirts while in the original that can't happen over the phone
        if(flirtedflag < maxflirts){
            curtext = handleFlirt(listenerList);
        }
        incrandom();
        curtext = printChoices(curtext, [1,2]);
    }

    sayText(curtext);
}

function favor() {
    let curtext = printDialogue([], "favor", 0);
    curtext = printChoices(curtext, [3,4,5,6]);
    sayText(curtext);
}

function gotta() {
    let curtext = []
    if (shyness > 80) {
        curtext = printSDialogue(curtext, "gotta", 0, 0, 0);
        attraction -= 2;
        shyness += 5;
    } else if (bladder < bladurge) {
        curtext = printSDialogue(curtext, "gotta", 0, 1, 1);
    } else {
        if (bladder < bladneed || shyness > 75) {
            curtext = printSDialogue(curtext, "gotta", 0, 2, 2);
        } else {
            curtext = printSDialogue(curtext, "gotta", 0, 3, 3);
        }
    }

    if (bladder >= bladneed && shyness <= 75)
        curtext = printChoices(curtext, [9])
    curtext = printChoices(curtext, [7,8,6]);
    sayText(curtext);
}

function ohreally() {
    attraction -= 5;
    let curtext = printDialogue([], "gotta", 1);
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

//TODO maybe option to bluff about bribe with consequences later
function waitpickup() {
    let curtext = []
    if (attraction > 13) {
        curtext = printSDialogue(curtext, "gotta", 2, 0, 1);
        let choice = [12]
        if (randomchoice(phoneholdthresh) && attraction > 60) {
            choice = [11];
        }
        choice.push(13);
        if (haveItem("earrings"))
            choice.push(14);
        if (haveItem("roses"))
            choice.push(15);
        curtext = printChoices(curtext, choice);
    } else {
        curtext = printSDialogue(curtext, "gotta", 2, 2, 2);
        flushdrank();
        attraction = 0;
        curtext = printChoices(curtext, [10]);
    }
    sayText(curtext);
}

function luckybribe() {
    let curtext = printDialogue([],"bribes", 0);
    askholditcounter++;
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

function declinebribe() {
    let curtext = printDialogue([], "bribes", 1);
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

function acceptbribe() {
    let curtext = printDialogue([], "bribes", 2);
    askholditcounter++;
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}


function pantyq() {
    let curtext = [];
    if (attraction < 10 || shyness > 85) {
        curtext = printDialogue(curtext, "panties", 0);
        curtext = printChoices(curtext, [10])
    } else {
        if (attraction < 20 || shyness > 80) {
            curtext = printDialogue(curtext, "panties", 1);
            curtext = printChoices(curtext, [10])
        } else {
            curtext = printDialogue(curtext, "panties", 2);
            let choices = [];
            for (let i = 16;i < 21; i++){
                choices.push(i);
            }
            curtext = printChoices(curtext, choices);
        }
    }
    sayText(curtext);
}

function predrink() {
    let curtext = [];
    if (attraction < 10) {
        curtext = printDialogue(curtext, "predrink", 0);
        attraction = 0;
    } else {
        if (tummy < maxtummy / 2 && attraction > 12) {
            curtext = printDialogue(curtext, "predrink", 1);
            tummy += 200;
            backPackItems.water.sheDrank += 2;
        } else if (tummy < maxtummy && attraction > 15) {
            curtext = printDialogue(curtext, "predrink", 2);
            tummy += 200;
            backPackItems.water.sheDrank += 2;
        } else {
            curtext = printDialogue(curtext, "predrink", 3);
        }
    }
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

function yPreDrink() {
    let curtext = []
    if (yourtummy < ymaxtummy) {
        curtext = printList(curtext, drinklines["yPreDrink"][0]);
        yourtummy += 200;
        backPackItems.water.yDrank += 2;
    } else {
        curtext = printList(curtext, drinklines["yPreDrink"][1]);
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

function cellphone() {
    let curtext = [calledjsons["yourHome"]["getcalled"]["getcalled"]]
    waitcounter += 3;
    curtext = printChoicesList(curtext, [0,1], calledjsons["yourHome"]["getcalled"]["choices"]);
    sayText(curtext);
}

function anscell() {
    //TODO this isn't very elegant
    let curtext = [calledjsons["yourHome"]["getcalled"]["anscell"]];
    curtext = cantwait(curtext);
    sayText(curtext);
}

function ignorecell() {
    let curtext = [calledjsons["yourHome"]["getcalled"]["ignorecell"]];
    attraction -= 1;
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

function cantwait(curtext) {
    waitcounter += 4;
    curtext.push(formatString(calledjsons["yourHome"]["getcalled"]["cantwait"], [girltalk]));
    curtext = displaygottavoc(curtext);
    curtext = printChoicesList(curtext, [2,3,4], calledjsons["yourHome"]["getcalled"]["choices"]);
    return curtext;
}