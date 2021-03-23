// All functions connected to her house. This is both pickup and endgame

function herhome() {
    //TODO switch?
    //This chooses the appropriate function to continue in the location herhome
    if (locstack[0] === "yourhome")
        getjson("appearance", function (){
            appearance = json;
            pickup()
        });
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
            bladder = 0; // You did not ask her to wait.
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
        curtext = showneed(curtext);
        if (prepeed) {
            curtext = printIntro(curtext, 5);
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
            askholditcounter = 0;
            waitcounter = 0;
        }
    } else {
        curtext = printIntro(curtext, 9);
    }
    curtext = displaygottavoc(curtext);
    curtext = displayyourneed(curtext);
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
    sayText(curtext);
}
