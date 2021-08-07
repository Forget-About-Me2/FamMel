//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
let locations = {
    "driveAround": driveAroundSetup(),
    "theBar" :theBarSetup()
};

let locJson;
getjson("/locations/locations", function () {locJson = json});

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






