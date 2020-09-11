//This contains everything you can do from your home before you pick-up your date

//TODO different scene if you're desperate and go pee at your house
//TODO you can actually wet yourself in the house
//TODO decide whether you can always go to the bathroom(maybe like a certain percentage filled)
//TODO refactor
function yourhome() {
    let curtext = [];
    if (didintro === 0) {
        locationMSetup("yourhome", "yourhome");
        setupquotes();
        setupQuotes();
        if (debugmode) magic();
        didintro = 1;
        slopen = 0;
        curtext = printIntro(curtext, 0);
    } else {
        if (locstack[0] !== "yourhome" || onphone){
            poploc();
            locationMSetup("yourhome", "yourhome");
            onphone = 0;
        }
        curtext = printIntro(curtext, 1);
    }
    curtext = printAlways(curtext);
    displayyourneed();
    curtext = printAllChoices(curtext);
    sayText(curtext)
}


// Buy stuff at the store.
function gostore() {
    if (locstack[0] !== "gostore") {
        pushloc("gostore");
        locationMSetup("yourhome", "store");
    }
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
        displayyourneed();
        let curtext = [];
        curtext = printAlways(curtext);
        curtext = printAllChoices(curtext);
        sayText(curtext);
    }
}

function buy(number){
    const item = locjson.buying[number];
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
        curtext = printDialogue(curtext, "callher",0)
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
    if (shyness > 80) {
        s(girltalk + "Nope.");
        attraction -= 2;
        shyness += 5;
    } else if (bladder < bladurge) {
        s(girltalk + "Not especially.  Why do you ask?");
    } else {
        if (bladder < bladneed || shyness > 75) {
            s(girltalk + "Yeah, I sorta do have to go.  How'd you know?");
        } else {
            s(girltalk + "Actually, I have to pee pretty bad.  How'd you know?");
        }
    }

    c("ohreally", "You just sounded distracted, that's all.");
    c("waitpickup", "Do you mind waiting to pee until I come and pick you up?");
    if (bladder >= bladneed && shyness <= 75) {
        c("peephone", "Well, since you have to pee so bad, would you take the phone with you into the bathroom?");
    }
    c(locstack[0], "Never mind.");
}

function waitpickup() {
    if (attraction > 13) {
        s(girlname + " sounds uncertain: I don't know about that...");
        s(girlname + " brightens up: Convince me.");

        if (randomchoice(phoneholdthresh) && attraction > 60) {
            c("luckybribe", "It'll be <i>so</i> sexy!");
        } else {
            c("declinebribe", "It'll be <i>so</i> sexy!");
        }

        c("declinebribe", "Pretty please!");
        if (earrings > 0)
            c("acceptbribe", "I'll bring you diamonds!");
        if (roses > 0)
            c("declinebribe", "I'll bring you roses!");
    } else {
        s(girltalk + "I don't think so, mister.");
        flushdrank();
        attraction = 0;
        c(locstack[0], "Continue...");
    }
}

function acceptbribe() {
    s(girltalk + "For diamonds, I'll give it a try...");
    s(girltalk + "Make sure you're on time, okay?");
    askholditcounter++;
    c(locstack[0], "Continue...");
}

function luckybribe() {
    s(girltalk + "You'd think it was sexy?  Then I'll do it!");
    s(girltalk + "Make sure you're on time, okay?");
    askholditcounter++;
    c(locstack[0], "Continue...");
}

function declinebribe() {
    s(girltalk + "That's not going to be good enough....");
    s(girltalk + "See you soon, though.");
    c(locstack[0], "Continue...");
}

function peephone() {
    gottagoflag = 0;
    if (attraction > 30) {
        if (bladder > blademer && shyness < 75) {
            s(girltalk + "You're a naughty boy, aren't you?");
            s(girltalk + "But I'm about to wet my panties if I don't go, so you can come too - but no peeking.");
            displaygottavoc();
            s("There's a bunch of clanking on the other end, quick footsteps, and a door closes.  You hear the toilet seat being lifted up, and the rustle of clothing.");
            s(girltalk + "Are you ready?  Want me to put the phone down there so you can hear?  Oh!  It's coming!");
            s("The hisssssssss of a huge pee fills your receiver for nearly a minute before you hear a couple of last squirts and the wiping of toilet paper against pussy lips.");
            s(girltalk + "Damn.  That's soooo much better.");
            attraction += 10;
            flushdrank();
        } else {
            s(girltalk + "Oooooo....  that's pretty kinky.  But I think I can hold it until I'm off the phone.");
        }
    } else {
        s(girltalk + "Somehow, I don't think that's happening.  Bye now.");
        bladder = 0;
    }
    c(locstack[0], "Continue...");
}

function pantyq() {
    if (attraction < 10 || shyness > 85) {
        s(girltalk + "You're just going to have to guess... I'm not telling.");
        c(locstack[0], "Continue...");
    } else {
        if (attraction < 20 || shyness > 80) {
            s(girltalk + "They're black ... and lacy.");
            c(locstack[0], "Continue...");
        } else {
            s(girltalk + "What color do you want me to wear tonight?");
            c("pantiesblack", "Black and lacy.");
            c("pantieswhite", "White cotton.");
            c("pantiesblue", "Blue silk.");
            c("pantiesred", "Red thong.");
            c("nopanties", "No panties.");
        }
    }
}

function changepanties(newcolor) {
    if (pantycolor === newcolor) {
        s(girltalk + "That's what I have on already!");
    } else {
        if (pantycolor === "none") {
            s(girltalk + "Okay, I'll put on my " + newcolor + " panties for you.");
        } else {
            s(girltalk + "I'm peeling off my " + pantycolor + " panties...");
            if (newcolor !== "none")
                s(girltalk + "and slipping into on my " + newcolor + " ones.");
            else
                s(girltalk + "but you have to promise not to peek at me!");
        }
    }
    pantycolor = newcolor;
    setupquotes();  // quotes rely heavily on panty color...
    c(locstack[0], "Continue...");
}

//TODO make one function for this
function pantiesblack() {
    changepanties("lacy black");
}

function pantieswhite() {
    changepanties("white cotton");
}

function pantiesblue() {
    changepanties("blue silk");
}

function pantiesred() {
    changepanties("red thong");
}

function nopanties() {
    changepanties("none");
}

function predrink() {
    if (attraction < 10) {
        s(girltalk + "I don't get what you're talking about.");
        attraction = 0;
    } else {
        if (tummy < maxtummy / 2 && attraction > 12) {
            s(girltalk + "Well, I guess it's good to stay hydrated.");
            s("She drinks two glasses of refreshing water.");
            tummy += 200;
            drankwaters += 2;
        } else if (tummy < maxtummy && attraction > 15) {
            s(girltalk + "Well, if you want me to, I'll do it.");
            s("She drinks two glasses of refreshing water.");
            tummy += 200;
            drankwaters += 2;
        } else {
            s(girltalk + "I just don't feel thirsty right now.");
        }
    }
    c(locstack[0], "Continue...");
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

function ypredrink() {
    if (yourtummy < ymaxtummy) {
        s("You drink two glasses of water, hoping it will go through you quickly.");
        yourtummy += 200;
        ydrankwaters += 2;
    } else {
        s("You considering drinking some water to get your bladder filled quicker.");
        s("But your stomach feels way to full to add more.")
    }
    c(locstack[0], "Continue...");
}