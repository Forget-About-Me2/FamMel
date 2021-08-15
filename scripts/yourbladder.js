//Your bladder variables
let yourbladder = 500;
let yourtummy = 200;
let yourtumavg = yourtummy;
let holdself = 0;
const holdpeethresh = 3; //Chance you'll still pee yourself even though you're holding your dick.

let yourbladurge = 500; // Level where you feel the first urge
let yourbladneed = yourbladurge * 2; // Level where you continuously needs to go
let yourblademer = yourbladurge * 3; // Level where it becomes an emergency
let yourbladlose = yourbladurge * 3 + 150; // Level where you lose control
let yourbladcumlose = yourbladurge * 4; // Level where you lose it as you cum
let yourbladsexlose = yourbladurge * 5; // Level where you can't control it during sex

let ymaxtummy = 500; // Drink capacity of stomach
let ymaxbeer = 1000; // Beer capacity of stomach

let yourcustomurge = 500;
let yminurge = 375; //Bladder never decays below this

//  The following are used to keep track of what you drank and when you last went
// Might be used later on.
let ylastpeetime = 0;  // When did you last go?
let ytimeheld = 0; // for stats

let ydrankcocktails = 0;
let ydranksodas = 0;
let ydrankwaters = 0;
let ydrankbeers;

let ydrankbeer = 0; //Did you drink beer? changes capacities and rates.

//Initializes the bladder values for you
function initYUrge(urge){
    yminurge = urge * minperc/100;
    updateyoururge(urge);
}

function updateyoururge(newurge) {
    if (newurge < yminurge) newurge = yminurge;
    newurge = Math.round(newurge);
    yourbladurge = newurge;
    yourbladneed = newurge * 2;
    yourblademer = newurge * 3;
    yourbladlose = newurge * 3 + 150;
    yourbladcumlose = newurge * 4;
    yourbladsexlose = newurge * 5
}

function flushyourdrank() {
    //  Derate bladder capacity if you loses it...
    if (bladDec) {
        if (yourbladder >= yourbladlose) updateyoururge(yourbladurge * 9 / 10);
        else if (yourbladder >= yourblademer && bladDespDec) updateyoururge(yourbladurge * 9.5 / 10);
        //bladder decays based on breaking can only once an hour
        else if (seal && ydrankbeer > 15 && ybeerdecCounter > 30) {
            updateyoururge(yourbladurge * 9.5 / 10);
            ybeerdecCounter = 0;
        }
    }

    yourbladder = 0;
    ydrankwaters = 0;
    ydrankcocktails = 0;
    ydrankbeers = 0;
    ydranksodas = 0;
    ylastpeetime = thetime;
    yrrlockedflag = 0;
    ynowpeeing = 1;
}

//TODO lose control when bursting on the way
//TODO add a chance of her denying you
function youpee() {
    let curtext = [];
    gottagoflag = 0;
    let peed = 0;
    if (locstack[0] === "yourhome") {
        curtext = printList(curtext, ypeelines["yourhome"]);
        peed = 1
    } else if (locstack[0] === "thehome" ||
        locstack[0] === "thebedroom" || locstack[0] === "pickup" || locstack[0] === "fuckher6") {
        if(locstack[0] !== "fuckher6") {
            curtext = printList(curtext, ypeelines["thehome"][0]);
        }
        curtext = printList(curtext, ypeelines["thehome"][1]);
        peed = 1
    } else {
        curtext = printList(curtext, ypeelines["remaining"]);
    }

    if ((locstack[0] === "thebar" && randomchoice(rrlockedthresh) ) ||
        ((locstack[0] === "theclub" || locstack[0] === "dodance") && randomchoice(rrlinethresh)) ||
        (locstack[0] === "themovie" && randomchoice(rrMovieLineThresh) || locstack[0] === "domovie" && randomchoice(rrMovieLineThresh))) {
        curtext = youbathroomlocked(curtext);
    } else if (locstack[0] === "darkBar" || locstack[0] === "darkTheatre" || locstack[0] === "darkclub") {
        //TODO potentially cycle between quotes
        if (yourbladder > yourbladlose - 25)
            curtext.push(ypeelines["youpeeprivate"][0]);
        else
            curtext.push(ypeelines["youpeeprivate2"][0]);
        flushyourdrank();
    } else {
        if (yourbladder > yourbladlose - 25 && !peed)
            curtext.push(pickrandom(ypeelines["youpeeprivate"]));
        else if (!peed)
            curtext.push(pickrandom(ypeelines["youpeeprivate2"]));
        flushyourdrank();
    }
    if (yourbladder >= yourbladlose - 25 && locstack[0] !== "thehottub") curtext = youbegtoilet(curtext);
    else {
        curtext = c([locstack[0], "Continue..."], curtext);
    }
    sayText(curtext);
}

function youbathroomlocked(curtext) {
    const locked = ypeelines["locked"];
    //Description of the situation
    if (locstack[0] === "thebar")
        curtext.push(locked["bar"]);
    else {
        curtext.push(locked["club"]);
    }
    //Description of your reaction, based on how badly you have to go
    if (yourbladder > yourblademer)
        curtext.push(locked["urgency"][0]);
    else if (yourbladder > yourbladneed)
        curtext.push(locked["urgency"][1]);
    else
        curtext.push(locked["urgency"][2]);
    if(locstack[0] === "thebar") {
        //Tell her the bathroom was locked, depending on how often you tried already
        if (yrrlockedflag > 3) {
            curtext.push(locked["cbar"][0]);
        } else if (yrrlockedflag > 2) {
            curtext.push(locked["cbar"][1]);
        } else if (yrrlockedflag) {
            curtext.push(locked["cbar"][2]);
        } else {
            curtext.push(locked["cbar"][3]);
        }
    } else {
        //Tell her the line was too long, depending on how often you tried already
        if (yrrlockedflag > 3) {
            curtext.push(locked["cclub"][0]);
        } else if (yrrlockedflag > 2) {
            curtext.push(locked["cclub"][1]);
        } else if (yrrlockedflag) {
            curtext.push(locked["cclub"][2]);
        } else {
            curtext.push(locked["cclub"][3]);
        }
    }
    yrrlockedflag++; //Increase how often you tried
    curtext = displayneed(curtext);
    return curtext;
}

//TODO make this more fancy
function youbegtoilet(curtext) {
    curtext.push(ypeelines["beg"][0]);
    if (shotglass > 0) curtext = callChoice(ypeelines["beg"][1][0], curtext);
    if (vase > 0) curtext = callChoice(ypeelines["beg"][1][1], curtext);
    curtext = callChoice(ypeelines["beg"][1][2], curtext);
    return curtext;
}

function displayyourneed(curtext) {
    if (yourbladder >= yourbladlose && !holdself) {
        curtext.push(pickrandom(yneeds["burst"]));
    } else if (yourbladder > yourblademer) {
        curtext.push(pickrandom(yneeds["desperate"]));
    } else if (yourbladder > yourbladneed) {
        curtext.push(pickrandom(yneeds["need"]));
    } else if (yourbladder > yourbladurge) {
        curtext.push(pickrandom(yneeds["urge"]));
    } else if (locstack[0] === "drinkinggame") {
        curtext.push(pickrandom(yneeds["empty"]));
    }
    return curtext
}

function ypeein(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("backpack-cnt");
    backpackcnt.style.display = "none";
    const list = yneeds[item];
    let curtext = [];
    let yneedtype = 0;
    if (yourbladder>yourblademer)
        yneedtype = 2;
    else if (yourbladder>yourbladneed)
        yneedtype = 1;
    //Prints a quote about how full you are and what you are planning to do.
    curtext.push(list[0][yneedtype]);
    //If she doesn't like you enough she'll act embarrassed and prevent you from doing this.
    if (yneedtype === 0 && attraction > 100 ||
        yneedtype === 1 && attraction > 70 ||
        yneedtype === 2 && attraction > 30){
        if (yneedtype === 2) {
            // if your desperate print a quote about giving her the item so you can focus on your trousers
            if (locstack[0] === "driveout")
                //The quote is slightly different when you're driving
                curtext = printList(curtext, list[1]);
            else
                curtext = printList(curtext, list[2]);

        }
        //Prints a description of undoing your pants, depending on how bad you have to go.
        curtext = printList(curtext, list[3][yneedtype]);
        curtext = callChoice(["ypeein2(&quot;" +item+ "&quot;," + yneedtype + ")", "Continue..."], curtext);
    } else {
        curtext.push("\"Are you out of your mind!?\" She hisses urgently. \"You can't do that! What if someone sees?!\"");
        curtext.push("You sigh, but put away the " + objects[item].bpname.toLowerCase() + ".");
        curtext = callChoice(["curloc", "Continue..."], curtext);
        attraction -= Math.round(10 / (yneedtype + 1));
    }
    sayText(curtext);
}

function ypeein2(item, yneedtype){
    let curtext = [];
    if (yneedtype === 2)
        curtext = printList([], yneeds[item][4]);
    else
        curtext = printList(curtext, yneeds[item][5]);
    curtext = callChoice(["ypeein3(&quot;" +item+ "&quot;," + yneedtype + ")", "Continue..."], curtext);
    sayText(curtext);
}

function ypeein3(item, yneedtype){
    let curtext = [];
    if (yourbladder < yourbladurge){
        curtext.push("You try your best, but you just can't manage to push anything out.");
        curtext.push("With a sigh, you zip your trousers back up.");
        curtext.push("<b>You:</b> It's not happening, I'll try again later when my bladder is a bit fuller.");
    } else {
        const container = objects[item];
        const list = yneeds[item];
        if (container.hasOwnProperty("volume")){
            if (container.volume < yourbladder){
                if (yneedtype === 2)
                    curtext.push(list[6][yneedtype][1]);
                else
                    curtext.push(list[6][yneedtype][0]);
                if (yourbladder > yourblademer)
                    curtext.push("YOU: Damn. That's not much better.");
                yourbladder -= container.volume;
            } else {
                //The item can hold your full bladder contents
                curtext.push(list[6][yneedtype][1]);
                flushyourdrank();
            }
        } else{
            curtext = printList(curtext, list[6][yneedtype]);
            flushyourdrank();
        }
        attraction += Math.round(10 / (yneedtype + 1));
    }
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO better scene
function ypeeintub() {
    s("You relax your muscles while acting as if nothing happens.");
    s("She doesn't notice that you're peeing right next to her.");
    s("You can't help but get a bit aroused.");
    flushyourdrank();
    c(locstack[0], "Continue");
}

//TODO a Can I watch option
function ypeeoutside() {
    if (yourbladder < yourblademer)
        s("<b>YOU:</b> Hang on I need a pee.");
    else {
        s("<b>YOU;</b> Hold up I really need to pee!");
        s("You are messaging your crotch to help you hold it.");
    }
    if (locstack[0] === "themakeout") c("ypeeoutside2", "Continue...");
    else c("ypeeoutside2b", "Continue...");
}

//In the car
function ypeeoutside2() {
    s("You step out of the car and lower your zipper. You check if no one is around before you pull your penis out.");
    c("ypeeoutside3", "Continue...");
}

function ypeeoutside2b() {
    s("You lower your zipper and check if no one is around before you pull your penis out");
    if (locstack[0] === "thebeach") c("ypeeoutside3c", "Continue...");
    else c("ypeeoutside3b", "Continue...");
}

//TODO determine if she would watch and arousal
function ypeeoutside3() {
    s("You subtly turn towards the car so she could watch if she wanted to. The pee hisses out of your tip and runs in a stream under the car.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}

function ypeeoutside3b() {
    s("You only turn away from her slightly, allowing her to watch if she wants to. The pee hisses out from of your tip and runs in a stream along the ground.");
    s("As you zip back up you can't help but feel aroused.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}

function ypeeoutside3c() {
    s("You only turn away from her slightly, allowing her to watch if she wants to. The pee hisses out from of your tip, it soaks quickly into the sand turning it dark.");
    s("As you zip back up you can't help but feel aroused.");
    flushyourdrank();
    c(locstack[0], "Continue...");
}

//Here's where we decide if you wet yourself or if you just spurted.
//TODO more original quotes (most are now stolen from her)
//TODO fix timings
function wetyourself() {
    let curtext = [pickrandom(yneeds["wetquote"])];
    sayText(curtext);
    if (randomchoice(yspurtthresh) && locstack[0] !== "thehottub") {
        spurtedyourself(curtext);
    } else {
        yspurtthresh = 3;
        if (locstack[0] === "driveout")
            cListenerGen([wetyourself2c, "Continue ..."], "wetyourself");
        else if (locstack[0] === "themakeout")
            cListenerGen([wetyourself2m, "Continue ..."], "wetyourself");
        else if (locstack[0] === "thehottub")
            cListenerGen([wetyourself2t, "Continue ..."],"wetyourself");
        else
            cListenerGen([wetyourself2, "Continue ..."], "wetyourself");
    }
}

//TODO register you wet your pants
function wetyourself2(curtext) {
    if (!curtext)
        curtext = [];
    curtext = printList(curtext, yneeds["wetyourself"][0]);
    // s("You are helpless as your bladder uncontrollably empties itself.");
    // s("Surely she can hear the hissing.");
    flushyourdrank();
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

//You're in the make out spot
//TODO test
function wetyourself2m() {
    console.log("test");
    let curtext = yneeds["wetyourself"][1];
    // s("You frantically look around, wanting to safe your car seat. You fumble with the seat belt, then wrench the door open and jump out of the car.");
    wetyourself2(curtext);
}

//You're in the hottub
//TODO test
function wetyourself2t() {
    console.log("test");
    let curtext = yneeds["wetyourself"][2];
    sayText(curtext);
    flushyourdrank();
    // s("You stiffen and let out a shaky breath.");
    // s("You sigh and slump back in the tub, letting the relieve course through you.");
    // s("When you are finally empty you open your eyes to meet hers");
    cListenerGen([wetyourself3t, "Continue ..."], "wetyourself");
}

//You're in the car
//TODO register you wet the car
function wetyourself2c() {
    let curtext = yneeds["wetyourself"][3];
    sayText(curtext);
    flushyourdrank();
    cListenerGen([wetyourself3c, "Continue ..."], "wetyourself");
}

function wetyourself3c() {
    let curtext = yneeds["wetyourself"][4];
    // s("YOU: I'm sorry about that. I really couldn't wait.");
    // s("You uncomfortably shift in the squishy wet seat.");
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}


//In the tub
//TODO test
function wetyourself3t() {
    console.log("test");
    let curtext = yneeds["wetyourself"][5];
/*    s("YOU: I'm <u>so</u> sorry... I just couldn't hold it.");
    s("The faint scent of your urine rises from the water.");
    s("YOU: I peed in the tub.");*/
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

let youSpurted = 0;
//TODO more text options and her reponse
function spurtedyourself(curtext) {
    yourbladder -= 50;
    yspurtthresh -= 0.1 * yspurtthresh;
    youSpurted = 1;
    curtext.push(yneeds["spurtquote"]);
    // s("You manage to get your control back but you still let out a little bit.");
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}