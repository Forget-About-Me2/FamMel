// All functions connected to her house. This is both pickup and endgame
let herHome; //Json with quotes for herHome.

function herHomeSetup(){
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
        herHome = locjson["theHome"];
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
        if (bladder > blademer && !haveItem("herKeys"))
            curtext.push(herHome["sheHasKeys"].formatVars());
            // s(girltalk + "Good thing I haven't lost my keys, huh?");
        listenerList.push([[theHome, "Continue..."], "theHome"]);
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

//TODO offer beer
function theHome() {
    if (locstack[0] !== "theHome") {
        kisscounter = 0;
        feelcounter = 0;
        pushloc("theHome");
        s("You and " + girlname + " arrive at her place.");
        s("It's a 3rd floor apartment in a nice complex.");

        if (homeConditions()) {
            showneed();
            displayyourneed();
            s("She invites you to come up for a drink...");
            c("theelevator", "Go up with her.");
            c("gameover", "Say goodnight.");
        } else {
            s(girltalk + "Good Night...  see you soon?");
            locstack[0] = "gameover";
            c("gameover", "Continue...");
        }
    } else if (herkeys) {
        s(girlname + " searches through her purse for her keys.");
        displayneed();
        voccurse();
        s(girltalk + "I can't find my keys!");
        showneed();
        displayyourneed();
        c("givekeys", "Offer her her keys.");
        c("lookforkeys", "Offer to look for her keys.");
    } else {
        s("You are with " + girlname + " at her home.");

        if (kisscounter > maxkiss) {
            s(girlname + " suddenly pulls away from you and sits straight up.");
            s(girltalk + "You know, this just isn't working out.");
            s(girltalk + "I'm afraid we're going to have to call it a night.");
            c("gameover", "Continue...");
        } else {
            displaygottavoc();
            displayneed();
            displayyourneed();
            //TODO figure out what the hell this is
            if (champagnecounter > 5) {
                if (bladder > bladlose)
                    s(girlname + " gasps: I'm going ... bathroom");
                else
                    s("She invites you to come back to her bedroom.");
                c("thebedroom", "Follow her closely to her bedroom.");
                c("gameover", "Say goodnight.");
            } else {
                if (gottagoflag) {
                    c("allowpee", "Tell her she should go and pee.");
                }
                c("youpee", "Ask if you can use her bathroom.");
                c("kissher", "Kiss her on the lips.");
                if (champagne > 0) {
                    c("champagnenow", "Offer her champagne.");
                }
                if (soda > 0) {
                    c("sodanow", "Offer her soda.");
                }
                c("gameover", "Say goodnight.");
            }
        }
    }
}
