//Functions and variables that don't belong to anything specific

let randcounter = 0; // text randomizer

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

    //TODO don't pull same json twice
    if(jsonlocs.includes(tag)){
        getjsonT(tag);
    } else if (tag.includes("(")){
        //this is a terrible way to deal with choice functions but it works so hey
        //TODO alternative way is just giving all choices the () from the getgo, but that might break other things
        eval(tag);
    } else {
        eval(tag + "()");
    }

//TODO comment
    // if (slopen && ulopen) slopen=0;
    //
    // if (ulopen) {
    //   ulopen = 0;
    //   document.getElementById('textsp').innerHTML += "</ul>";
    // }

    if (tag !== "hidescreen") {
        comma = 0;
        document.getElementById('objsp').innerHTML = "You are carrying: ";
        const obj = Object.values(objects);
        obj.forEach(value => displaypos(value));
        //
        // if (earrings > 0) displaypos(earrings, "earrings", "pair", "s");
        // if (roses > 0) displaypos(roses, "roses", "boquet", "s");
        // if (panties > 0) displaypos(panties, "sexy panties", "pair", "s");
        // if (vase > 0) displaypos(vase, "vase", "", "s");
        // if (shotglass > 0) displaypos(shotglass, "shotglass", "", "es");
        // if (ptowels > 0) displaypos(ptowels, "paper towels", "roll", "s");
        // if (water > 0) displaypos(water, "water", "bottle", "s");
        // if (beer > 0) displaypos(beer, "beer", "bottle", "s");
        // if (soda > 0) displaypos(soda, "soda", "cup", "s");
        // if (cocktail > 0) displaypos(cocktail, "cocktail", "glass", "es");
        // if (wetpanties > 0) displaypos(wetpanties, "wet panties", "pair", "s");
        // if (champagne > 0 && champagnecounter === 0) displaypos(champagne, "champagne", "bottle", "s");
        // else if (champagne > 0 && champagnecounter < 6) displaypos(champagne, "champagne", "half-empty bottle", "s");
        // else if (champagne > 0) displaypos(champagne, "champagne", "empty bottle", "s");
        // if (barkey > 0) displaypos(barkey, "key to the bar", "", "s");
        // if (clubkey > 0) displaypos(clubkey, "key to the club", "", "s");
        // if (theaterkey > 0) displaypos(theaterkey, "key to the theater", "", "s");
        // if (herkeys > 0) displaypos(herkeys, "keys", "set", "s");
        // if (hercellphone > 0) displaypos(hercellphone, "cellphone", "", "s");
        if (comma === 0) {
            document.getElementById('objsp').innerHTML += " nothing.";
        }
    }
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
    console.log("hallo?")
    //TODO it's a very bad idea to have two functions with almost identical names
    setupquotes();
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