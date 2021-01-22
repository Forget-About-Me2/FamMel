//This contains everything you can do from your home before you pick-up your date

//TODO different scene if you're desperate and go pee at your house
//TODO you can actually wet yourself in the house
//TODO decide whether you can always go to the bathroom(maybe like a certain percentage filled)
//TODO refactor
function yourhome() {
    let curtext = [];
    if (didintro === 0) {
        locationMSetup("yourhome", "yourhome");
        didintro = 1;
        slopen = 0;
        curtext = printIntro(curtext, 0);
    } else {
        if (locstack[0] !== "yourhome" || onphone || shopping){
            locationMSetup("yourhome", "yourhome");
            onphone = 0;
            shopping = 0;
        }
        curtext = printIntro(curtext, 1);
    }
    curtext = printAlways(curtext);
    curtext = displayyourneed(curtext);
    curtext = printAllChoices(curtext);
    sayText(curtext)
}


// Buy stuff at the store.
function gostore() {
    if (locstack[0] !== "gostore") {
        pushloc("gostore");
        shopping=1;
    }
    locationMSetup("yourhome", "store");
    if (askholditcounter > 0 && bladder > blademer && bladder < bladlose && !waitcounter) {
        cellphone();
    } else {
        if (!askholditcounter && bladder > bladneed) {
            bladder = 0;
        }
        if (bladder > bladlose) {
            bladder = 0;
            prepeed = 1;
        }
        let curtext = [];
        curtext = printAlways(curtext);
        curtext = displayyourneed(curtext);
        curtext = printAllChoices(curtext);
        sayText(curtext);
    }
}

function buy(number){
    console.log(number);
    const item = locjson.buying[number];
    console.log(item);
    const price = Number(item[1]);
    let curtext = [];
    if (money >= price){
        curtext.push("You buy a "+ item[0]+ ".")
        objects[item[2]].value += 1;
        money -= price;
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
function callher() {
    let curtext = [];
    if (locstack[0] !== "callher") {
        flirtedflag = 0;
        pushloc("callher");
        locationMSetup("yourhome", "callher")
        curtext = printIntro(curtext, 0);
        if (thetime > 75 && bladder < blademer) {
            late = 1;
        }
        onphone = 1;
    } else {
        curtext = printIntro(curtext, 1);
    }

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
        cantwait();
    } else {
        if (shyness > 80) shyness -= 1;
        if(flirtedflag < maxflirts){
            curtext = handleFlirt(curtext);
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
        console.log(haveItem("earrings"));
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

function peephone() {
    let curtext = [];
    gottagoflag = 0;
    if (attraction > 30) {
        if (bladder > blademer && shyness < 75) {
            curtext = printDialogue(curtext, "peephone", 0);
            attraction += 10;
            flushdrank();
        } else {
            curtext = printDialogue(curtext, "peephone", 1);
        }
    } else {
        curtext = printDialogue(curtext, "peephone", 2);
        bladder = 0;
    }
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
            drankwaters += 2;
        } else if (tummy < maxtummy && attraction > 15) {
            curtext = printDialogue(curtext, "predrink", 2);
            tummy += 200;
            drankwaters += 2;
        } else {
            curtext = printDialogue(curtext, "predrink", 3);
        }
    }
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

function cellphone() {
    s("Your cellphone rings.");
    waitcounter += 3;
    c("anscell", "Answer it.");
    c("ignorcell", "Ignore it.");
}

function anscell() {
    s("<b>YOU:</b> Hello?  Hello?");
    cantwait();
}

function ignorcell() {
    s("You decline to take the call.");
    attraction -= 1;
    c(locstack[0], "Continue...");
}

function cantwait() {
    waitcounter += 4;
    s(girltalk + "Hey!  I've been trying to wait to pee like you asked.");
    displaygottavoc();
    c("holdit", "Ask her to hold it longer.");
    c("peephone", "Ask her to take the phone into the bathroom with her");
    c("allowpee", "Let her pee.");
}
