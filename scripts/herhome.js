// All functions connected to her house. This is both pickup and endgame
let herHome; //Json with quotes for herHome.

function herHomeSetup() {
    getjson("herhome", function () {
        herHome = json["theHome"];
    });
    return {
        visit: [herhome, herHome["choices"]["visit"]],
        wantVisit: [herhome, herHome["choices"]["wantVisit"]],
        group: 4
    }
}

function homeConditions() {
    return shyness < 50 && attraction > 100 && locations.makeOut.visited &&
        locations.theBar.visited && locations.theClub.visited && seenmovie;
}

function herhome() {
    //TODO switch?
    //This chooses the appropriate function to continue in the location herhome
    if (locstack[0] === "yourhome")
        getjson("appearance", function (){
            appearance = json;
            pickup();
        });
    else takeHerHome();
}

//TODO fix this scene
//The dialogues is fucked if you asked her to hold it
function pickup() {
    let curtext = [];
    if (locstack[0] !== "pickup") { // happens first time only.
        locationMSetup("herhome", "pickup");
        pushloc("pickup");
        curtext = printIntro(curtext, 0);
        curtext.push(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        if (pantycolor !== "none") {
            //TODO make this more graceful
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquote"].format([pantycolor]));
        }else
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquotebare"]);
        if (thetime < 55) {
            curtext = printIntro(curtext, 1);
        } else if (!askholditcounter && bladder >= bladneed) {
            flushdrank(); // You did not ask her to wait.
        }
        if (bladder > blademer)
            curtext = printIntro(curtext, 2);
        if (thetime > 75 || (bladder > bladneed && thetime > 60)) {
            curtext = printIntro(curtext, 3);
            curtext =  showneed(curtext);
            curtext = printIntro(curtext, 4);
            attraction -= 5;
            shyness -= 10;
        }
        curtext = displayneed(curtext);
        if (prepeed) {
            curtext = printIntro(curtext, 5);
            curtext = displaygottavoc(curtext);
        } else if (bladder > bladneed && askholditcounter) {
            if (thetime > 60)
                curtext = printIntro(curtext, 6);
            else
                curtext = printIntro(curtext, 7);
            curtext = displayneed(curtext);
            askholditcounter = 0;
            waitcounter = 0;
            gottagoflag = 1;
        } else if (askholditcounter) {
            curtext = printIntro(curtext, 8);
            curtext = showneed(curtext);
            askholditcounter = 0;
            waitcounter = 0;
        }
    } else {
        curtext = printIntro(curtext, 9);
        curtext = showneed(curtext);
    }
    curtext = displayyourneed(curtext);
    sayText(curtext);
    curtext = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
        } else {
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                curtext = c(["youpee", "Ask if you can use her toilet."], curtext);
        }
        curtext = c(["leavehm", "Say let's get going."], curtext);
    }
    addSayText(curtext);
}

function takeHerHome(){
    getjson("endScreens", function (){
        endScreens = json;
    });
    let curtext = printList([], herHome["arrive"]);
    let listenerList = [];
    if (homeConditions()){
        curtext.push(herHome["inviteUp"]);
        listenerList.push([[elevatorWait, herHome["choices"]["elevator"]], "elevator"]);
    } else
        curtext.push(herHome["goodnight"].formatVars());
    listenerList.push([gameOver, herHome["choices"]["goodNight"]]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

let floorcounter = 0;
function elevatorWait() {
    let curtext = [];
    let listenerList = [];
    if (locstack[0] !== "theElevator") {
        pushloc("theElevator");
        curtext.push(herHome["goElevator"].formatVars());
        // s("You take " + girlname + " by the hand and go to wait in front of the elevator.");
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        listenerList.push([[elevatorWait, "Continue..."], "elevatorWait"]);
        // c(locstack[0], "Continue...");
    } else {
            if (randomchoice(3)) {
                if (elevatorwaitcounter > 2 && bladder > blademer) {
                    curtext = printList(curtext, herHome["elevArriveEmer"]);
                    // s("The elevator finally appears, and " + girlname + " rushes to enter as the door opens.  She suddenly steps back and stands still, trembling with the effort to conceal her desperation, as a pretty woman walks out.");
                    // s(girlname + " lunges into the elevator and mashes the 3rd floor button with one hand while openly holding herself with the other.");
                } else {
                    curtext.push(herHome["elevArrive"].formatVars());
                    // s("The elevator appears, so you step inside with " + girlname + " and hit the button for the 3rd floor.");
                }
                listenerList.push([[theElevator, "Continue..."], "theElevator"]);
                poploc();
            } else {
                // s("The elevator has not yet arrived.");
                // s("You wait patiently with " + girlname + ".");
                curtext = printList(curtext, herHome["elevWait"]);
                listenerList.push([[elevatorWait, "Continue..."], "elevatorWait"]);
                elevatorwaitcounter++;
            }
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function theElevator(){
    let curtext = [];
    let listenerList = [];
    if (floorcounter === 3) {
        curtext = printList(curtext, herHome["elev3rdFloor"])
        // s("The elevator finally reaches the 3rd floor.");
        // s("You and " + girlname + " walk across the hall to the door of her apartment.");
        if (bladder > blademer && !haveItem("herKeys")) {
            curtext.push(herHome["sheHasKeys"].formatVars());
            // s(girltalk + "Good thing I haven't lost my keys, huh?");
            listenerList.push([[theHome, "Continue..."], "theHome"]);
        } else
            listenerList.push([[stolenKeys, "Continue..."], "stolenKeys"]);
    } else {
        curtext.push(herHome["inElev"].formatVars());
        // s("You're in the elevator with " + girlname + ".");
        curtext = noteholding(curtext);
        listenerList.push([[theElevator, "Continue..."], "theElevator"]);
    }
    curtext =  showneed(curtext);
    curtext = displayyourneed(curtext);
    if (floorcounter >= 3) {
        poploc();
    } else  {
        floorcounter += 1;
    }
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

function stolenKeys(){
    let curtext = [herHome["searchKeys"].formatVars()];
    // s(girlname + " searches through her purse for her keys.");
    curtext = displayneed(curtext);
    curtext = voccurse(curtext);
    curtext.push(herHome["lostKeys"].formatVars());
    // s(girltalk + "I can't find my keys!");
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList([
        [[giveKeys, herHome["giveKeys"]], "giveKeys"],
        [[lookForKeys, herHome["lookKeys"]], "lookKeys"]
    ]);
    // c("givekeys", "Offer her her keys.");
    // c("lookforkeys", "Offer to look for her keys.");
}

function giveKeys() {
    objects.herKeys.value=0;
    let curtext = [herHome["getKeys"]];
    let listenerList = [];
    // s("You pull her keys from your pocket.");
    if (bladder >= blademer) {
        curtext = displayneed(curtext);
        curtext.push(herHome["giveKeysDesp"].formatVars());
        // s(girlname + " grabs the keys and opens the door.");
        listenerList.push([[theHome, "Continue..."], "theHome"]);
        // c(locstack[0], "Continue...");
    } else {
        curtext.push(herHome["giveKeysQuest"].formatVars());
        // s(girltalk + " Where'd you get those?");
        let excuses = [
            [ [keyNevermind, herHome["choices"]["keyNvm"]], "keyNvm"],
            [ [keyGoodExcuse, herHome["choices"]["keyGood"]], "keyGood"],
            [ [keyBadExcuse, herHome["choices"]["keyBad"]], "keyBad"]
        ];
        randomize(excuses).forEach(item => listenerList.push(item));
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function keyNevermind() {
    let curtext = printList([], herHome["keysNvm"])
    sayText(curtext);
    cListenerGen([theHome, "Continue..."], "theHome");
}

function keyGoodExcuse(){
    let curtext = printList([], herHome["keysGood"]);
    sayText(curtext);
    attraction += 10;
    cListenerGen([theHome, "Continue..."], "theHome");
}

function keyBadExcuse(){
    let curtext = printList([], herHome["keysBad"]);
    sayText(curtext);
    attraction = 0;
    cListenerGen([gameOver, herHome["choices"]["keySlap"]], "gameOver");
}

function lookForKeys() {
    let curtext = [];
    if (locstack[0] !== "lookForKeys"){
        pushloc("lookForKeys");
        curtext = printList(curtext, herHome["offersPurse"]);
        curtext = showneed(curtext);
    } else {
        curtext = showneed(curtext);
        curtext.push(herHome["rummagePurse"]);
    }
    // s(girlname + " offers you her purse.");
    // showneed();
    // s("You palm the keys in your pocket, take her purse and rummage through it.");
    objects.herKeys.value = 0;
    sayText(curtext);
    cListenerGenList([
        [[lookForKeys, herHome["choices"]["keysNotFound"]],"lookForKeys"],
        [[function () {
            poploc();
            theHome();
        }, herHome["choices"]["foundThem"]], "theHome"]
    ]);
}

//TODO offer beer
function theHome() {
    if (locstack[0] !== "theHome")
        pushloc("theHome")
    let curtext = [herHome["atHome"].formatVars()];
    let listerList = [];
    // s("You are with " + girlname + " at her home.");
    if (kisscounter > maxkiss) {
        curtext = printList(curtext, herHome["kissExceeded"]);
        // s(girlname + " suddenly pulls away from you and sits straight up.");
        // s(girltalk + "You know, this just isn't working out.");
        // s(girltalk + "I'm afraid we're going to have to call it a night.");
        listerList.push([[gameOver, "Continue..."], "gameOver"]);
    } else {
        curtext = displaygottavoc(curtext);
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        //TODO figure out what the hell this is
        if (champagnecounter > 5) {
            if (bladder > bladlose-25)
                curtext = printList(curtext, herHome["champagneLose"]);
                // s(girlname + " gasps: I'm going ... bathroom");
            else
                curtext.push(herHome["inviteBedroom"]);
                // s("She invites you to come back to her bedroom.");
            listerList.push([[theBedroom, herHome["choices"]["followHer"]], "theBedroom"]);
            listerList.push([[gameOver, herHome["choices"]["goodNight"]], "gameOver"]);
        } else {
            if (gottagoflag)
                listerList.push([[allowpee, herHome["choices"]["allowPee"]], "allowPee"]);
            else if (yourbladder > yourbladurge)
                listerList.push([[youpee, herHome["choices"]["askBathroom"]], "youPee"]);
            listerList.push([[kissher, herHome["choices"]["kissHer"]], "kissHer"]);
            listerList.push([[gameOver, herHome["choices"]["goodNight"]],"gameOver"]);
        }
        sayText(curtext);
        cListenerGenList(listerList);
    }
}
