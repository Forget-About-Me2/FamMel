//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
let locations = {
    "driveAround": driveAroundSetup(),
    "theBar" :theBarSetup(),
    "theClub": theClubSetup(),
    "theTheatre": theatreSetup(),
    "makeOut": makeOutSetup(),
    "theHome": herHomeSetup()
};

let sharedLoc;
fetchJson("locations/locations").then(locJsonSetup);

function locJsonSetup(data: any){
    sharedLoc = data;
    sharedLoc["itsClosed"] = formatAllVarsList(sharedLoc["itsClosed"]);
    sharedLoc["sayHero"] = formatAllVarsList(sharedLoc["sayHero"]);
}

//Determines whether the wants to visit a location.
function updateSuggestedLocation(){
    if (shyness < 30 && attraction > 50 && !locations.makeOut.visited) {
        suggestedloc = "themakeout";
    } else if (homeConditions()) {
        suggestedloc = "thehome";
    } else if (shyness > 80 && attraction < 30 && !seenmovie) {
        suggestedloc = "themovie";
    } else if (shyness < 60 && attraction > 30 && !locations.theClub.visited) {
        suggestedloc = "theclub";
    } else if (bladder > bladneed && shyness < 50 && !locations.theBar.visited) {
        suggestedloc = "thebar";
    }
}

// Prints all locations that can be visited
function printLocationMenu(){
    Object.keys(locations).forEach(loc => {
        if (suggestedloc === loc.toLowerCase())
            cListener(locations[loc].wantVisit, loc);
        else
            cListener(locations[loc].visit, loc);
    });
    Object.keys(locations).forEach(loc => {
        addListeners(locations[loc].visit, loc)
    });
}

function lookAround(loc: string){
    const findkey = randomchoice(locations[loc].keyChance);
    let curtext = [];
    curtext.push(pickrandom(sharedLoc["lookAround"]));
    // Location data: [0]=random observations array, [1]=key discovery text
    const randomObservations = sharedLoc[loc][0];
    const keyDiscoveryText = sharedLoc[loc][1];
    let listenerList = [];
    if (findkey){
        curtext.push(keyDiscoveryText);
        sayText(curtext);
        listenerList.push([[function () {lookKey(loc)}], "lookKey"]);
        cListener(["", "Investigate..."], "lookKey");
    } else {
        curtext.push(pickrandom(randomObservations));
        sayText(curtext);
        //Increase the chance to find the key you were looking for by 20%.
        //Success is guaranteed on the 5th try.
        locations[loc].keyChance += 2;
    }
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

function lookKey(loc: string){
    let curtext = [pickrandom(sharedLoc["lookKey"])];
    let listenerList = [];
    sayText(curtext);
    listenerList.push([[function () {getKey(loc)}], "getKey"]);
    cListener(["", "Pick it up."], "getKey");
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

function getKey(loc: string){
    locations[loc].foundKey = 1;
    let curtext = [pickrandom(sharedLoc["getKey"])];
    backPackItems[loc+"Key"].value++;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO fix the double desperate
function itsClosed(locname: string, fun: () => void, curloc: string) {
    let theloc;
    if (locname === "theBar") theloc = "bar";
    else if (locname === "theClub") theloc = "night club";
    else  theloc = "movie theater";

    // itsClosed: [0]=arrival text, [1]=bladder emergency quote, [2]=confirmed closed text
    const [arrivalLines, emergencyQuote, confirmedClosedLines] = sharedLoc["itsClosed"];

    let curtext = []
    let list = new Array(arrivalLines.length).fill([theloc]);
    let temp = formatAll(arrivalLines, list);
    curtext = printList(curtext, temp);
    if (bladder > blademer) {
        curtext = printList(curtext, emergencyQuote);
        curtext = displaygottavoc(curtext);
    }
    list = new Array(confirmedClosedLines.length).fill([theloc]);
    temp = formatAll(confirmedClosedLines, list);
    curtext = printList(curtext, temp);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    let listenerList = []
    if (haveItem(locname+"Key")){
        let breakFun = function () {
            breakLoc(fun, curloc);
        }
        listenerList.push([[breakFun], locname]);
        cListener(["", "Try to break in with your key."], locname);
    }
    addSayText(callChoice(["curloc", "Continue..."], []));
    addListenersList(listenerList);
}

let emerBreak; //True if she rushed to the toilet after you opened the door
let emerHold; //True if you asked her to hold it.
function breakLoc(loc: any, curloc: string){
    // breakLoc: [0]=trying the key, [1]=she rushes past you
    const [tryingKey, sheRushesPast] = sharedLoc["breakLoc"];
    // sayHero: [0]=hero compliments (calm), [1]=rushed hero thanks (urgent)
    const [heroCompliments, heroThanksUrgent] = sharedLoc["sayHero"];

    let curtext = printList(tryingKey, []);
    let listenerList = [];
    if (bladder > blademer){
        //There's a 30% chance she'll run to the bathroom as soon as you break in.
        if (randomchoice(3)) {
            curtext.push(pickrandom(heroThanksUrgent));
            curtext = printList(sheRushesPast, curtext);
            curtext = displayneed(curtext);
            curtext = displayyourneed(curtext);
            pushloc(curloc);
            sayText(curtext);
            let holdFun = function () {
                emerHold = 1;
                holdit();
            }
            let peeFun = function () {
                emerBreak = 1;
                indepee();
            }
            listenerList.push([[holdFun], "holdit"]);
            listenerList.push([[peeFun], "indepee"]);
            cListener([holdFun, "Grab her arm to stop her."], "holdit");
            cListener([peeFun, "Let her go."], "indepee");
            addListenersList(listenerList);
            return
        } else
            curtext.push(pickrandom(heroCompliments));
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGen([loc, "Continue..."], "curloc");
}