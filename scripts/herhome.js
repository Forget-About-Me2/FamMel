// All functions connected to her house. This is both pickup and endgame

function herhome() {
    //TODO switch?
    //This chooses the appropriate function to continue in the location herhome
    if (locstack[0] === "yourhome")
        getjson("appearance", function (){
            console.log("This is illegal");
            appearance = json;
            console.log(appearance);
            pickup()
        });
}

//TODO fix this scene
function pickup() {
    let curtext = [];
    if (locstack[0] !== "pickup") { // happens first time only.
        locationMSetup("herhome", "pickup");
        pushloc("pickup");
        curtext = printIntro(curtext, 0);
        // s("You get in your car and drive over to " + girlname + "'s place.");
        curtext.push(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        // s(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        if (pantycolor !== "none") {
            //TODO make this more graceful
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquote"].format([pantycolor]));
            // s(firstmtgtightquote);
        }else
            curtext.push(appearance["clothes"][heroutfit]["firstmtgtightquotebare"]);
        if (thetime < 55) {
            curtext = printIntro(curtext, 1);
            // s(girltalk + "Oh! You're early!  I wasn't expecting you to show up on time!");
        } else if (!askholditcounter && bladder >= bladneed) {
            bladder = 0; // You did not ask her to wait.
        }
        if (bladder > blademer)
            curtext = printIntro(curtext, 2);
            // s("You also see the bulge of her overfull bladder.");

        if (thetime > 75 || (bladder > bladneed && thetime > 60)) {
            curtext = printIntro(curtext, 3);
            // s(girltalk + "Where have you been?");
            // s(girltalk + "You're late.");
            curtext =  showneed(curtext);
            curtext = printIntro(curtext, 4);
            // s("She seems pretty upset.");
            attraction -= 5;
            shyness -= 10;
        }
        curtext = showneed(curtext);
        if (prepeed) {
            curtext = printIntro(curtext, 5);
            // s(girltalk + "I know you asked me to wait, but I couldn't hold it - I <b>had</b> to pee.");
        } else if (bladder > bladneed && askholditcounter) {
            if (thetime > 60)
                curtext = printIntro(curtext, 6);
                // s(girlname + " whispers shyly: I've been bursting my bladder waiting for you.");
            else
                curtext = printIntro(curtext, 7);
                // s(girlname + " whispers shyly: I'm so glad you're finally here - I've <i>really</i> got to pee!");
            curtext = displayneed(curtext);
            askholditcounter = 0;
            waitcounter = 0;
            gottagoflag = 1;
        } else if (askholditcounter) {
            curtext = printIntro(curtext, 8);
            // s(girltalk + "I waited to pee just like you asked.");
            askholditcounter = 0;
            gottagoflag = 1;
            waitcounter = 0;
        }
    } else {
        curtext = printIntro(curtext, 9);
        // s("You're at " + girlname + "'s place to pick her up.");
    }
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            preventpee();
        } else {
            curtext = standobjs(curtext);
            if (yourbladder > yourbladurge)
                curtext = c(["youpee", "Ask if you can use her toilet."], curtext);
        }
        curtext = c(["leavehm", "Say let's get going."], curtext);
    }
    sayText(curtext);
}

function callPickup(){

}