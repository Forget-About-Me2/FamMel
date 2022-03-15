// All functions connected to her house. This is both pickup and endgame
let herHome; //Json with quotes for herHome.
let prepeed = 0; // did she pee before you picked her up
let elevatorwaitcounter = 0;

function herHomeSetup() {
    getjson("herhome", herHomeJsonSetup);
    return {
        visit: [],
        wantVisit: [],
        group: 4
    }
}

function herHomeJsonSetup(){
    herHome = json["theHome"];
    locations.theHome.visit = [herhome, herHome["choices"]["visit"]];
    locations.theHome.wantVisit = [herhome, herHome["choices"]["wantVisit"]]
}

function homeConditions() {
    return shyness < 50 && attraction > 100 && locations.makeOut.visited &&
        locations.theBar.visited && locations.theClub.visited && seenmovie;
}

function herhome() {
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
        getMLocations("herhome", "pickup");
        pushloc("pickup");
        curtext.push(locjson["goOver"].formatVars());
        curtext.push(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        if (pantycolor !== "none") {
            //TODO make this more graceful
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquote"].formatVars());
        }else
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquotebare"]);
        if (thetime < 55) {
            curtext.push(locjson["earlyComment"].formatVars());
        } else if (!askholditcounter && bladder >= bladneed) {
            flushdrank(); // You did not ask her to wait.
        }
        if (bladder > blademer)
            curtext.push(pickrandom(locjson["bladderBulgeDesc"]));
        if (thetime > 75 || (bladder > bladneed && thetime > 60)) {
            curtext = printList(curtext, locjson["lateComment"]);
            curtext =  showneed(curtext);
            curtext.push(pickrandom(locjson["upsetDesc"]));
            attraction -= 5;
            shyness -= 10;
        }
        curtext = displayneed(curtext);
        if (prepeed) {
            curtext.push(locjson["prePeed"].formatVars());
            curtext = displaygottavoc(curtext);
        } else if (bladder > bladneed && askholditcounter) {
            if (thetime > 60)
                curtext.push(pickrandom(locjson["lateHold"]).formatVars());
            else
                curtext.push(pickrandom(locjson["arriveHold"]).formatVars());
            curtext = displayneed(curtext);
            askholditcounter = 0;
            waitcounter = 0;
            gottagoflag = 1;
        } else if (askholditcounter) {
            curtext.push(pickrandom(locjson["askedHold"]).formatVars());
            curtext = showneed(curtext);
            askholditcounter = 0;
            waitcounter = 0;
        }
    } else {
        curtext.push(locjson["pickupMsg"].formatVars());
        curtext = showneed(curtext);
    }
    curtext = displayyourneed(curtext);
    sayText(curtext);
    curtext = [];
    let listenerList = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
        } else {
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                listenerList.push([[youpee, locjson["choices"]["askToilet"]], "youpee"]);
        }
        listenerList.push([[leavehm, locjson["choices"]["letsGo"]], "leavehm"]);
    }
    addSayText(curtext);
    cListenerGenList(listenerList);

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
    listenerList.push([[gameOver, herHome["choices"]["goodNight"]], "gameOver"]);
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
        if (!haveItem("herKeys")) {
            if (bladder > blademer)
                curtext.push(herHome["sheHasKeys"].formatVars());
            listenerList.push([[theHome, "Continue..."], "theHome"]);
        } else
            listenerList.push([[stolenKeys, "Continue..."], "stolenKeys"]);
    } else {
        curtext.push(herHome["inElev"].formatVars());
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
    curtext = displayneed(curtext);
    curtext = voccurse(curtext);
    curtext.push(herHome["lostKeys"].formatVars());
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList([
        [[giveKeys, herHome["giveKeys"]], "giveKeys"],
        [[lookForKeys, herHome["lookKeys"]], "lookKeys"]
    ]);
}

function giveKeys() {
    objects.herKeys.value=0;
    let curtext = [herHome["getKeys"]];
    let listenerList = [];
    if (bladder >= blademer) {
        curtext = displayneed(curtext);
        curtext.push(herHome["giveKeysDesp"].formatVars());
        listenerList.push([[theHome, "Continue..."], "theHome"]);
    } else {
        curtext.push(herHome["giveKeysQuest"].formatVars());
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
    if (kisscounter > maxkiss) {
        curtext = printList(curtext, herHome["kissExceeded"]);
        listerList.push([[gameOver, "Continue..."], "gameOver"]);
    } else {
        curtext = displaygottavoc(curtext);
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        //TODO figure out what the hell this is
        if (champagnecounter > 5) {
            if (bladder > bladlose-25)
                curtext = printList(curtext, herHome["champagneLose"]);
            else
                curtext.push(herHome["inviteBedroom"]);
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
    }
    sayText(curtext);
    cListenerGenList(listerList);
}
