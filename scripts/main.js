//Functions and variables that don't belong to anything specific

let randcounter = 0; // text randomizer
let playerbladder = 1; //Whether playerBladder has been enabled.
let playerGame = 0; //Whether the playerBladder is enabled in the drinking game
let statsBars; //JSON of the status bars depending on which setting has been chosen
let endScreens; //JSON of the endScreens used at the end of the game.

let money = 200;
let attraction = 10;
let tummy = 100;
let bladder = 300;
let shyness = 90;

const clubclosingtime = 7 * 60; // 2:00AM
const theaterclosingtime = 3 * 60; // 10:00PM last showing
const barclosingtime = 6 * 60; // 1:00AM

let lastmoney = money;
let lastattraction = attraction;
let lastshyness = shyness;

let hour = 7;
let minute = 0;
let meridian = "PM";
const timespeed = 2;
let thetime = 0;

//Counter Parameters
const maxkiss = 7; // maximum number of kisses that have effect.
const maxfeel = 7; // maximum number of feel-ups that have effect

//  Location handling stack
//  initialized at the start.
const locstack = []; //The first element in the Array is the current location

let didintro = 0; // Flag for having done introduction
let flirtedflag = 0; // Actually a counter.  Keeps track of flirting.
const maxflirts = 2; // Maximum flirt points per venue
let haveherpurse = 0; // You're holding her purse
let late = 0; //You are late to pick her up
let noflirtflag = 0; // Suppress flirty options

// Girl stats(Counter and Flags)
let owedfavor = 0; // she owes you a favor
let flirtcounter = 0; // time since last flirt ( counts by 2 )
let changevenueflag = 0; // you are changing venue - makes her easily ask to pee.
let checkedherout = 0; // Flags that you just checked her out.


function range(start, end) {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}

function objInit(){
    let initVal = [];
    Object.keys(this).forEach(prop => {
        if (prop !== "initVal")
            initVal[prop] = this[prop];
            if (typeof this[prop] === "object" && !Array.isArray(this[prop]))
                this[prop].init();
    });
    this.initVal = initVal;
}

function objReset(){
    Object.keys(this).forEach(prop => {
        if (typeof this[prop] === "object" && !Array.isArray(this[prop]) && prop !== "initVal")
            this[prop].reset();
        else
            this[prop] = this.initVal[prop];
    });
    this.init();
}

function goback() {
    poploc();
    eval(locstack[0] + "()");
}

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
    if(playerbladder) {
        document.getElementById("ytum").innerText = yourtummy.toString();
        document.getElementById("yblad").innerText = yourbladder;
    }
    if (!showstats) {
        document.getElementById("tum").innerText = "?";
        document.getElementById("blad").innerText = "?";
        if(playerbladder) {
            document.getElementById("ytum").innerText = "?";
            document.getElementById("yblad").innerText = "?";
        }
    }
    if (attraction < lastattraction) {
        setColour("att", "red", "white");
    } else if (attraction > lastattraction)
        setColour("att", "green", "white");
    if (attraction > 130)

    if (shyness < lastshyness) {
        setColour("shy", "green", "blue");
    } else if (shyness > lastshyness)
        setColour("shy", "red", "blue");

    if (money < lastmoney) {
        setColour("mon", "red", "blue");
    } else if (money > lastmoney)
        setColour("mon", "green", "blue");

    //  Hard Limits on shyness and attraction
    if (shyness < 0) {
        shyness = 0;
        valueChange("shy", 0);
    } if (shyness > 100) {
        shyness = 100;
        valueChange("shy", 100);
    } if (attraction < 0) {
        attraction = 0;
        valueChange("att", 0);
    } if (attraction > 130) {
        attraction = 130;
        valueChange("att", 130);
    }
}

//Sets the given colour to the given id attribute for half a second
function setColour(id, colour, original){
    let elem = document.getElementById(id);
    elem.className = "stats-cells-"+colour;
    setTimeout(function () {
        elem.className = "stats-cells-"+original;
    }, 500);
}

//Sets the value of the given id after half a second.
function valueChange(id, value){
    setTimeout(function () {
        document.getElementById(id).innerText = value;
    }, 500);
}


// Main program loop.  Refreshes display, recalculates
// time passage and so on.
//    tag - name of function to go to next.
function go(tag) {
    allowItems = 0;

    if (tag !== "options" && tag !== "explainimgs" && tag !== "hidescreen" && tag !== "customgirl" && !enablehide) {
        showedneed = 0; // clear showed need - only active in the current window.
        changevenueflag = 0; // clear venue change.
        noflirtflag = 0; // clear no flirting flag.
        nowpeeing = 0; // clear the currently peeing flag.


        let tuminc = calcTuminc();

        tummy -= tuminc;
        if (tummy < 0) tummy = 0;
        bladder += tuminc;

        //  If she's not with you, then she can go pee
        if (playOnly.includes(locstack[0]) && bladder > blademer && !askholditcounter)
            if (locstack[0] !== "callher")
                flushdrank();

        if (playerbladder || (locstack[0]==="drinkinggame" && playerGame)) {
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
        }
        if (flirtcounter > 0) {
            flirtcounter -= 1;
        }
        if (waitcounter > 0) {
            waitcounter -= 1;
        }
        if (seal) {
            beerdecCounter++;
            ybeerdecCounter++;
        }

        if (champagnecounter > 0) {
            drankChamp++;
            if (drankChamp > 10) {
                champagnecounter--;
                drankChamp = 0;
            }
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
    if (bladder < 0) bladder = 0;
    if (tummy < 0) tummy = 0;
    if (money < 0) money = 0;

    document.getElementById('textsp').innerText = "";
    if (didintro) {
        displaystats();
    }

    // Flash changed stuff...
    lastmoney = money;
    lastattraction = attraction;
    lastshyness = shyness;

    if (tag === "hidescreen") {
        enablehide = 1;
        document.getElementById('statsp').innerHTML = "";
        document.getElementById('objsp').innerHTML = "";
        document.getElementById('thepic').innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></table>";
    }

    if (typeof tag === "function")
        tag();
    else if(jsonlocs.includes(tag)&&!calledjsons.hasOwnProperty(tag)){
        //checks whether the given location has a corresponding JSON file and calls it if it hasn't been called before
        getjsonT(tag);
    } else if (tag.includes("(")){
        //this is a terrible way to deal with choice functions but it works so hey
        //TODO alternative way is just giving all choices the () from the getgo, but that might break other things
        eval(tag);
    } else {
        eval(tag + "()");
    }
}

//Calculates her current tuminc
function calcTuminc(){
    tumavg = Math.round((tumavg * (tumdecay - 1) + tummy) / tumdecay);
    let tuminc = Math.round(tumavg / 10);
    if (drankbeer === 0 && tuminc > 12) tuminc = 12;
    if (drankbeer > 0 && tuminc > 18) tuminc = 18;
    if (tuminc < 1) tuminc = 2;
    return randtuminc(tuminc);
}

/*
//TODO update comments
Location handling.
curloc is ALWAYS the current location, but...
   curloc is ONLY set under certain circumstances:
     1)  Leaving car to go to a destination _and_ the
     destination is not a repeat and still open.
 2)  Special locations such as the dancefloor.

nextloc is the INTENDED destination.  Meaning you set it
   when you choose to head somewhere.

*/
function pushloc(newloc) {
    if (newloc !== locstack[0]) {
        locstack.unshift(newloc);
    }
}

function poploc() {
    if (locstack[0] !== locstack[1]) {
        locstack.shift();
    }
}

//  increment the random number counter.
const randmax = 5; // Maximum value of random counter
function incrandom() {
    randcounter += Math.floor(Math.random() * 2) + 1;
    if (randcounter > randmax) randcounter -= (randmax + 1);
}

//  Randomness Chooser
//  1 corresponds to 10% likelihood.
//  10 corresponds to 100% likelihood.
function randomchoice(probability) {
    let x = Math.floor(Math.random() * 10);
    if (x < probability)
        return 1;
    else
        return 0;
}

//TODO potentially use this to choose quotes instead of randomchoice
//Picks a random value from the given list
function pickrandom(list) {
    return list[randomIndex(list)];
}

//Picks a random index from a list.
function randomIndex(list){
    let number = Math.random() * list.length;
    return Math.floor(number);
}

//Randomizes the given list
function randomize(list){
    let deepCopy = getDeepCopy(list);
    let result = [];
    while(deepCopy.length !== 0){
        let temp = randomIndex(deepCopy);
        result.push(deepCopy[temp]);
        deepCopy.splice(temp, 1);
    }
    return result;
}

//Returns a deepCopy of the given list
function getDeepCopy(list){
    let result = [];
    list.forEach(item => result.push(item));
    return result;
}

//This setups the game when you click start
//Main reason we have a seperate function is because we need have to wait for yneeds to be assigned for the first scene
//as it's called in there and this is the cleanest solution I can think of
function gamestart(){
    if (!playerbladder) {
        const stats = document.getElementById("stats-bar");
        let result = "";
        statsBars["noplayer"].forEach(item => result += item);
        stats.innerHTML = result;
        yourbladder = 0;
    }
    displaystats();
    getjsonTF("yourhome", yourhome);
    setupQuotes();
}


function changeLog(){
    let result;
    $.ajax(
        { url: "CHANGELOG.md",
            type: 'get',
            dataType: 'html',
            async: false,
            success: function(data) { result = data; }
        }
    );
    const converter = new showdown.Converter();
    document.getElementById("pop-up-title").innerText = "Changelog";
    document.getElementById("pop-up-text").innerHTML = converter.makeHtml(result);
    openPopUp();
}

function showCredits(){
    if (!credits){
        getjson("credits", function (){
            credits = json;
            showCredits();
        });
        return
    }
    document.getElementById("pop-up-title").innerText = "Credits";
    const textElem = document.getElementById("pop-up-text");
    textElem.innerHTML = "";
    credits["page"].forEach(line => textElem.innerHTML += line);
    openPopUp();
}

function handleDisclaimer(){
    if (!localStorage.disclaimer || localStorage.disclaimer === "true") {
        if (!credits) {
            getjson("credits", function () {
                credits = json;
                handleDisclaimer();
            });
            return
        }
        document.getElementById("pop-up-title").innerText = "Disclaimer";
        const textElem = document.getElementById("pop-up-text");
        textElem.innerHTML = "";
        credits["disclaimer"].forEach(line => textElem.innerHTML += line);
        openPopUpTemp();
    }
}

// Introduction page.
function start() {
    handleDisclaimer();
// See random number generator from the date
    anim8();
    randcounter = Math.floor(Math.random() * 5);
    incrandom();
    setup();
    pushloc("yourhome");
    locationSetup("start");
    let curtext = locjson["always"];
    curtext = printAllChoices(curtext);
    sayText(curtext);
    //the start of the game is dependent on yneeds, to save loading time it is called as soon as you move from the main screen
    //And then the variables will be added when the game actually starts, but that's not necessary for the begin scene so this should be fine.
    getjson("yneeds", function () {yneeds = json});
}

function gameOver() {
    setText(endScreens["gameOver"]);
}

//TODO maybe combine the game ending function into one
//Basically you got her into bed but not desperate
function gameSexBoth(){
    let curtext = printList([], endScreens["gameSexBoth"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

//It's just who who came. You selfish bastard
function gameSexYou(){
//TODO
}

function gameWet() {
    let curtext = printList([], endScreens["gameWet"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}

function gameWon() {
    let curtext = printList([], endScreens["gameWon"]);
    curtext = printList(curtext, endScreens["stats"]);
    setText(curtext);
}