let driveRound; //JSON quotes for location

function driveAroundSetup(){
    getjson("locations/driveAround", driveJsonSetup)
    return {
        "visit": [driveAround, "Just drive around"],
        "group": 0,
        "visited": -1,
   }
}

function driveJsonSetup(){
    json["driveAround"] = formatAllVarsList(json["driveAround"]);
    driveRound = json;
}

const gasChance = 3; //Chance you'll encounter a gas station
let gasStation;

function driveAround(){
    locations.driveAround.visited = 1;
    let curtext = printList([], driveRound["driveAround"][0]);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    gasStation = randomchoice(gasChance);
    if(gasStation)
        curtext = printList(curtext,driveRound["driveAround"][1]);
    if (bladder > bladlose) {
        sayText(curtext);
        wetherself();
    }
    else if (yourbladder > yourbladlose) {
        sayText(curtext);
        wetyourself();
    }
    else {
        //list of locations that need a listener added.
        let listenerList = []
        sayText(curtext);
        curtext = []
        if (yourbladder > yourblademer) {
            listenerList.push([[drivetell], "drivetell"]);
            cListenerGen([drivetell, "Tell her you need to go."], "drivetell");
        }
        // c("drivetell", "Tell her you need to go.");
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
        } else curtext = standobjs(curtext);
        if (gasStation) {
            listenerList.push([[station], "gasStation"]);
            cListenerGen([station, "Stop at the gas station"], "gasStation");
        }
        curtext = c([locstack[0], "Continue..."], curtext);
        addSayText(curtext);
        addListenersList(listenerList);
    }
}

function station(){
    //TODO create
    let curtext = ["You approach the station, only to see that it's under construction.",
    "Unfortunately, you can't stop here."];
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

