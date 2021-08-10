//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
let locations = {
    "driveAround": driveAroundSetup(),
    "theBar" :theBarSetup()
};

let locJson;
getjson("/locations/locations", locJsonSetup);

function locJsonSetup(){
    locJson = json;
    locJson["itsClosed"] = formatAllVarsList(locJson["itsClosed"]);
}

//Determines whether the wants to visit a location.
function updateSuggestedLocation(){
    if (shyness < 30 && attraction > 50 && !beenmakeout) {
        suggestedloc = "themakeout";
    } else if (shyness < 50 && attraction > 100 && beenmakeout &&
        beenbar && beenclub && seenmovie) {
        suggestedloc = "thehome";
    } else if (shyness > 80 && attraction < 30 && !seenmovie) {
        suggestedloc = "themovie";
    } else if (shyness < 60 && attraction > 30 && !beenclub) {
        suggestedloc = "theclub";
    } else if (bladder > bladneed && shyness < 50 && !beenbar) {
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
    })
}



function lookAround(loc){
    const findkey = randomchoice(locations[loc].keyChance);
    let curtext = [];
    curtext.push(pickrandom(locJson["lookAround"]));
    let listenerList = [];
    if (findkey){
        curtext.push(locJson[loc][1]);
        sayText(curtext);
        listenerList.push([[function () {lookKey(loc)}], "lookKey"]);
        cListener(["", "Investigate..."], "lookKey");
    } else {
        curtext.push(pickrandom(locJson[loc][0]));
        sayText(curtext);
        //Increase the chance to find the key you were looking for by 20%.
        //Success is guaranteed on the 5th try.
        locations[loc].keyChance += 2;
    }
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

function lookKey(loc){
    let curtext = [pickrandom(locJson["lookKey"])];
    let listenerList = [];
    sayText(curtext);
    listenerList.push([[function () {getKey(loc)}], "getKey"]);
    cListener(["", "Pick it up."], "getKey");
    curtext = callChoice(["curloc", "Continue..."], []);
    addSayText(curtext);
    addListenersList(listenerList);
}

function getKey(loc){
    let curtext = [pickrandom(locJson["getKey"])];
    objects[loc+"Key"].value++;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

//TODO fix the double desperate
function itsClosed(locname, fun, curloc) {
    let theloc;
    if (locname === "theBar") theloc = "bar";
    if (locname === "theClub") theloc = "night club";
    if (locname === "makeOut") theloc = "movie theater";
    let curtext = []
    let list = new Array(locJson["itsClosed"][0].length).fill([theloc]);
    let temp = formatAll(locJson["itsClosed"][0], list);
    curtext = printList(curtext, temp);
    if (bladder > blademer) {
        curtext = printList(curtext, locJson["itsClosed"][1]);
        curtext = displaygottavoc(curtext);
    }
    list = new Array(locJson["itsClosed"][2].length).fill([theloc]);
    temp = formatAll(locJson["itsClosed"][2], list);
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
function breakLoc(loc, curloc){
    let curtext = printList(locJson["breakLoc"][0], []);
    let listenerList = [];
    if (bladder > blademer){
        //There's a 30% chance she'll run to the bathroom as soon as you break in.
        if (randomchoice(3)) {
            curtext.push(pickrandom(locJson["sayHero"][1]));
            curtext = printList(locJson["breakLoc"][1], curtext);
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
            curtext.push(pickrandom(locJson["sayHero"][0]));
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGen([loc, "Continue..."], "curloc");
}






