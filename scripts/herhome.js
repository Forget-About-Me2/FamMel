// All functions connected to her house. This is both pickup and endgame

function herhome() {
    //TODO switch?
    //This chooses the appropriate function to continue in the location herhome
    if (locstack[0] === "yourhome") pickup();
}

//TODO fix this scene
function pickup() {
    if (locstack[0] !== "pickup") { // happens first time only.
        locationMSetup("herhome", "pickup");
        pushloc("pickup");
        // s("You get in your car and drive over to " + girlname + "'s place.");
        // s(girlname + appearance["clothes"][heroutfit]["firstmtgquote"]);
        if (pantycolor !== "none")
            // s(firstmtgtightquote);
        // else s(firstmtgtightquotebare);
        if (thetime < 55) {
            // s(girltalk + "Oh! You're early!  I wasn't expecting you to show up on time!");
        } else if (!askholditcounter && bladder >= bladneed) {
            bladder = 0; // You did not ask her to wait.
        }
        if (bladder > blademer)
            // s("You also see the bulge of her overfull bladder.");

        if (thetime > 75 || (bladder > bladneed && thetime > 60)) {
            // s(girltalk + "Where have you been?");
            // s(girltalk + "You're late.");
            showneed();
            // s("She seems pretty upset.");
            attraction -= 5;
            shyness -= 10;
        }
        showneed();
        if (prepeed) {
            // s(girltalk + "I know you asked me to wait, but I couldn't hold it - I <b>had</b> to pee.");
        } else if (bladder > bladneed && askholditcounter) {
            // if (thetime > 60)
                // s(girlname + " whispers shyly: I've been bursting my bladder waiting for you.");
            // else
                // s(girlname + " whispers shyly: I'm so glad you're finally here - I've <i>really</i> got to pee!");
            displayneed();
            askholditcounter = 0;
            waitcounter = 0;
            gottagoflag = 1;
        } else if (askholditcounter) {
            // s(girltalk + "I waited to pee just like you asked.");
            askholditcounter = 0;
            gottagoflag = 1;
            waitcounter = 0;
        }
    } else {
        s("You're at " + girlname + "'s place to pick her up.");
    }
    displayyourneed();
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            preventpee();
        } else {
            standobjs();
            if (yourbladder > yourbladurge)
                c("youpee", "Ask if you can use her toilet.");
        }
        c("leavehm", "Say let's get going.");
    }
}

function callPickup(){

}