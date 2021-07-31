// noinspection ES6UnusedImports
// because the functions are used through eval code inspection thinks the imports aren't used.
// This problem might get revolved later when locations is fleshed out more, but probably not.

import {driveAroundSetup, driveAround} from "./locations/driveAround.js";
import {theBarSetup, theBar} from "./locations/theBar.js";

//Object containing all locations and information connected to that location
//Initialised with all locations to be iterated over later.
export let locations = {
    "driveAround": {},
    "theBar" :{}
};

function setupLocations(){
    Object.keys(locations).forEach(loc => {
        locations[loc] = eval(loc + "Setup()");
    });
    console.log(locations);
}

setupLocations();