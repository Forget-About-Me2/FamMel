//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
let locations = {
    "driveAround": driveAroundSetup(),
    "theBar" :theBarSetup()
};

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
            cListener(goWrapper(locations[loc].wantVisit), loc);
        else
            cListener(goWrapper(locations[loc].visit), loc);
    });
    Object.keys(locations).forEach(loc => {
        addListeners(locations[loc].visit, loc)
    })
}

//Calls the given visit through go, aka it triggers a game tick.
function goWrapper(visit){
    let temp = visit[0];
    visit[0] = function () { go(temp);}
    return visit;
}



