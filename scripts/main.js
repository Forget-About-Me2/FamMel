//Functions and variables that don't belong to anything specific

let randcounter = 0; // text randomizer

//TODO this is called way too often
//  Updates the information on the stats
function displaystats() {
    let textminutes = minute;

    if (minute < 10) textminutes = "0" + minute;

    document.getElementById("mon").innerText = "$" + money;
    document.getElementById("att").innerText = attraction;
    document.getElementById("shy").innerText = shyness;
    document.getElementById("tum").innerText = tummy;
    document.getElementById("blad").innerText = bladder;
    document.getElementById("time").innerText = hour + ":" + textminutes + " " + meridian;
    document.getElementById("ytum").innerText = yourtummy;
    document.getElementById("yblad").innerText = yourbladder;
    if (debugmode) {
        document.getElementById("bladu").innerText = bladurge;
        document.getElementById("bladn").innerText = bladneed;
        document.getElementById("blade").innerText = blademer;
        document.getElementById("bladl").innerText = bladlose;
        document.getElementById("maxt").innerText = maxtummy;
        document.getElementById("randc").innerText = randcounter;
    } else if (!showstats) {
        document.getElementById("tum").innerText = "?";
        document.getElementById("blad").innerText = "?";
    }
    if (attraction !== lastattraction) {
        document.getElementById("att").className="stats-cells-green";
        console.log("why?");
    } else {
        document.getElementById("att").className="stats-cells-white";
    }
    if (shyness !== lastshyness) {
        console.log("why?");
        document.getElementById("shy").className="stats-cells-green";
    } else {
        document.getElementById("shy").className="stats-cells-blue";
    }
    if (money !== lastmoney) {
        document.getElementById("mon").className="stats-cells-green";
    } else {
        console.log("Fuck?");
        document.getElementById("mon").className="stats-cells-blue";
    }
}


// Main program loop.  Refreshes display, recalculates
// time passage and so on.
//    tag - name of function to go to next.
function go(tag) {

    if (tag !== "options" && tag !== "explainimgs" && tag !== "hidescreen" && tag !== "customgirl" && !enablehide) {
        showedneed = 0; // clear showed need - only active in the current window.
        changevenueflag = 0; // clear venue change.
        noflirtflag = 0; // clear no flirting flag.
        nowpeeing = 0; // clear the currently peeing flag.

        // Flash changed stuff...
        lastmoney = money;
        lastattraction = attraction;
        lastshyness = shyness;

        tumavg = Math.round((tumavg * (tumdecay - 1) + tummy) / tumdecay);
        let tuminc = Math.round(tumavg / 10);
        if (drankbeer === 0 && tuminc > 12) tuminc = 12;
        if (drankbeer > 0 && tuminc > 18) tuminc = 18;
        if (tuminc < 1) tuminc = 2;
        tuminc = randtuminc(tuminc);
        tummy -= tuminc;
        if (tummy < 0) tummy = 0;
        bladder += tuminc;

        //  If she's not with you, then she can go pee
        if (!withgirl && bladder > blademer) bladder = 0;

        yourtumavg = Math.round((yourtumavg * (tumdecay - 1) + yourtummy) / tumdecay);
        let yourtuminc = Math.round(yourtumavg / 10);
        if (ydrankbeer === 0 && yourtuminc > 12) yourtuminc = 12;
        if (ydrankbeer > 0 && yourtuminc > 18) yourtuminc = 18;
        if (yourtuminc < 1) yourtuminc = 2;
        yourtuminc = randtuminc(yourtuminc);
        yourtummy -= yourtuminc;
        if (yourtummy < 0) yourtummy = 0;
        yourbladder += yourtuminc;

        if (ydrankbeer > 0) ydrankbeer -= 1;
        if (drankbeer > 0) {
            drankbeer -= 1;
        }
        if (flirtcounter > 0) {
            flirtcounter -= 1;
        }
        if (waitcounter > 0) {
            waitcounter -= 1;
        }

        thetime += timespeed;
        minute += timespeed;
        if (minute > 59) {
            hour += 1;
            minute = 0
        }
        if (hour > 12) {
            hour = 1;
            if (meridian === "PM") meridian = "AM"; else meridian = "PM";
        }
    }

    enablehide = 0; // clear the hide screen flag.

    //  Hard Limits on shyness and attraction
    if (shyness < 0) shyness = 0;
    if (shyness > 100) shyness = 100;
    if (attraction < 0) attraction = 0;
    if (attraction > 130) attraction = 130;
    if (bladder < 0) bladder = 0;
    if (tummy < 0) tummy = 0;
    if (money < 0) money = 0;

    document.getElementById('textsp').innerText = "";
    if (didintro) {
        displaystats();
    }

    if (tag === "hidescreen") {
        enablehide = 1;
        document.getElementById('statsp').innerHTML = "";
        document.getElementById('objsp').innerHTML = "";
        document.getElementById('thepic').innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></table>";
    }

    if(jsonlocs.includes(tag)&&!calledjsons.hasOwnProperty(tag)){
        //checks whether the given location has a corresponding JSON file and calls it if it hasn't been called before
        getjsonT(tag);
    } else if (tag.includes("(")){
        //this is a terrible way to deal with choice functions but it works so hey
        //TODO alternative way is just giving all choices the () from the getgo, but that might break other things
        eval(tag);
    } else {
        eval(tag + "()");
    }

    if (tag !== "hidescreen") {
        comma = 0;
        document.getElementById('objsp').innerHTML = "You are carrying: ";
        const obj = Object.values(objects);
        obj.forEach(value => displaypos(value));
        if (comma === 0) {
            document.getElementById('objsp').innerHTML += " nothing.";
        }
    }
}

//  increment the random number counter.
function incrandom() {
    const now = new Date();
    const seed = now.getSeconds();
    //TODO figure out random + seed
    randcounter += Math.floor(Math.random(seed) * 2) + 1;
    if (randcounter > randmax) randcounter -= (randmax + 1);
}

//  Randomness Chooser
//  1 corresponds to 10% likelihood.
//  10 corresponds to 100% likelihood.
function randomchoice(probability) {
    if (Math.floor(Math.random() * 10) <= probability)
        return 1;
    else
        return 0;

}

//TODO potentially use this to choose quotes instead of randomchoice
//Picks a random value from the given list
function pickrandom(list) {
    let number = Math.random() * list.length;
    number = Math.floor(number);
    return list[number];
}



//This setups the game when you click start
//Main reason we have a seperate function is because we need have to wait for yneeds to be assigned for the first scene
//as it's called in there and this is the cleanest solution I can think of
function gamestart(){
    setupQuotes();
    if (debugmode) magic();
}


// Croaks on exit.
//TODO why the fuck is this even a thing? if we keep this make it more fun though
function under18() {
    s("Sorry.");
}

// Introduction page.
function start() {
// See random number generator from the date
    const now = new Date();
    const seed = now.getSeconds();
    anim8();
    randcounter = Math.floor(Math.random(seed) * 5);
    pstorycounter = Math.floor(Math.random() * 5);
    incrandom();
    setup();
    pushloc("yourhome");
    locationSetup("start");
    let curtext = locjson.always;
    curtext = printAllChoices(curtext);
    sayText(curtext);
}