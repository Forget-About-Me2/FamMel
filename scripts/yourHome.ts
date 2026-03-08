import { gameState, LocationCategory } from "./gameState/gameState";
import { gameSettings } from "./settings/gameSettings";

//This contains everything you can do from your home before you pick-up your date

let onphone = 0; // Flag for being on the phone with her
// shopping flag is in shims.js (shared with store.ts)

//TODO different scene if you're desperate and go pee at your house
//TODO you can actually wet yourself in the house
//TODO decide whether you can always go to the bathroom(maybe like a certain percentage filled)
//TODO refactor
export function yourHome() {
    allowItems = 1;
    let curtext: string[] = [];
    if (!gameState.DidIntro) {
        loadLocationScene("yourhome", "yourhome");
        gameState.DidIntro = true;
        curtext = printIntro(curtext, 0);
    } else {
        if (locStack[0] !== "yourhome" || onphone || shopping) {
            loadLocationScene("yourhome", "yourhome");
            onphone = 0;
            shopping = 0;
        }
        curtext = printIntro(curtext, 1);
    }
    curtext = printAlways(curtext);
    curtext = displayyourneed(curtext);
    if (gameSettings.PlayerBladder && yourbladder > yourbladlose) {
        wetyourself();
        return;
    }
    // Build choices based on current game state
    let choices = [0, 1]; // Store, Call her
    if (gameSettings.PlayerBladder) {
        choices.push(2, 3); // Pee, Drink water
    }
    choices.push(4); // Pick her up
    curtext = printChoices(curtext, choices);
    sayText(curtext);
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
export function callHer() {
    allowItems = 1;
    let curtext = [];
    if (locStack[0] !== "callher") {
        flirtedflag = 0;
        pushloc("callher");
        loadLocationScene("yourhome", "callher")
        curtext = printIntro(curtext, 0);
        if (thetime > 75 && bladder < blademer) {
            late = 1;
        }
        onphone = 1;
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
            handleFlirt(listenerList);
        }
        incrandom();
        curtext = printChoices(curtext, [1,2]);
    }

    sayText(curtext);
    cListenerGenList(listenerList);
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
    // Guard against async loading and tolerate legacy/casing key variants
    const yDrinkLines = (typeof drinklines !== "undefined" && drinklines)
        ? (drinklines["ypredrink"] || drinklines["yPreDrink"] || [[], []])
        : [[], []];
    if (yourtummy < ymaxtummy) {
        curtext = printList(curtext, yDrinkLines[0] || ["You drink some water."]);
        yourtummy += 200;
        backPackItems.water.yDrank += 2;
    } else {
        curtext = printList(curtext, yDrinkLines[1] || ["Your stomach feels too full to drink more right now."]);
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

function getYourHomeCallData() {
    const fallback = {
        getcalled: "Your phone rings.",
        anscell: "You answer the call.",
        ignorecell: "You ignore the call for now.",
        cantwait: "{0} I can't wait much longer!",
        choices: ["Answer the phone", "Ignore the call", "Ask her to hold it", "Change the subject", "Hang up"]
    };

    try {
        const root = calledjsons?.["yourhome"]?.["getcalled"];
        if (!root) return fallback;
        return {
            getcalled: root["getcalled"] ?? fallback.getcalled,
            anscell: root["anscell"] ?? fallback.anscell,
            ignorecell: root["ignorecell"] ?? fallback.ignorecell,
            cantwait: root["cantwait"] ?? fallback.cantwait,
            choices: Array.isArray(root["choices"]) ? root["choices"] : fallback.choices
        };
    } catch {
        return fallback;
    }
}

function cellphone() {
    const callData = getYourHomeCallData();
    let curtext = [callData.getcalled]
    waitcounter += 3;
    curtext = printChoicesList(curtext, [0,1], callData.choices);
    sayText(curtext);
}

function anscell() {
    //TODO this isn't very elegant
    const callData = getYourHomeCallData();
    let curtext = [callData.anscell];
    curtext = cantwait(curtext);
    sayText(curtext);
}

function ignorecell() {
    const callData = getYourHomeCallData();
    let curtext = [callData.ignorecell];
    attraction -= 1;
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

function cantwait(curtext) {
    const callData = getYourHomeCallData();
    waitcounter += 4;
    curtext.push(formatString(callData.cantwait, [girltalk]));
    curtext = displaygottavoc(curtext);
    curtext = printChoicesList(curtext, [2,3,4], callData.choices);
    return curtext;
}

// Register yourHome-internal functions on window for JSON choice tag routing.
// The choice tags in yourhome.json use lowercase names (e.g. "callher", "gostore")
// which go() resolves via window[tag].
(window as any).yourhome = yourHome;
(window as any).callher = callHer;
(window as any).favor = favor;
(window as any).gotta = gotta;
(window as any).ohreally = ohreally;
(window as any).waitpickup = waitpickup;
(window as any).luckybribe = luckybribe;
(window as any).declinebribe = declinebribe;
(window as any).acceptbribe = acceptbribe;
(window as any).pantyq = pantyq;
(window as any).predrink = predrink;
(window as any).ypredrink = yPreDrink;
(window as any).cellphone = cellphone;
(window as any).anscell = anscell;
(window as any).ignorecell = ignorecell;