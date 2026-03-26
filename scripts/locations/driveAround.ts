let driveRound; //JSON quotes for location

function driveAroundSetup(){
    fetchJson("locations/driveAround").then(driveJsonSetup)
    return {
        "visit": [driveAround, "Just drive around"],
        "group": 0,
        "visited": -1,
   }
}

function driveJsonSetup(data: any){
    driveRound = data;
}

const gasChance = 3; //Chance you'll encounter a gas station
let gasStation;

function driveAround(){
    allowItems = 1;
    // driveAround: [0]=driving narration, [1]=gas station spotted
    const [drivingNarration, gasStationSpotted] = driveRound["driveAround"];
    let curtext = printList([], drivingNarration);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    gasStation = randomchoice(gasChance);
    if(gasStation)
        curtext = printList(curtext, gasStationSpotted);
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
            listenerList.push([[drivetell, "Tell her you need to go."], "drivetell"]);
        }
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else curtext = standobjs(curtext, listenerList);
        if (gasStation) {
            listenerList.push([[station, "Stop at the gas station"], "gasStation"]);
        }
        curtext = c([locStack[0], "Continue..."], curtext);
        addSayText(curtext);
        cListenerGenList(listenerList);
    }
}

function nextstop() {
    let curtext = printList([], driveRound["nextStop"]);
    curtext = displayneed(curtext);
    sayText(curtext);
    cListenerGen([driveout, "Continue..."], "driveAround");
}

function drivetell() {
    allowItems = 1;
    let curtext = printList([], driveRound["driveTell"]);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList ([
        [[drivePee, driveRound["choices"]["youCanNotHold"]], "drivePee"],
        [[driveout, driveRound["choices"]["youNextStop"]], "driveOut"]
    ]);
}

//TODO maybe have an attraction cut for this?
function drivePee() {
    let curtext = [driveRound["drivePee"]];
    let listenerList = []
    if (haveItem("shotglass"))
        listenerList.push([[function () {
            ypeein("shotglass");
        }, driveRound["choices"]["yPeeShot"]], "yPeeShot"]);
    //TODO figure out how towels would work for you
    // if ( ptowels > 0 ) c("peetowels" , "Pee in the roll of paper towels.");
    if (haveItem("vase"))
        listenerList.push([[function () {
        ypeein("vase");
    }, driveRound["choices"]["yPeeVase"]], "yPeeVase"]);
    listenerList.push([[driveout, driveRound["choices"]["yHaveNothing"]], "yHaveNothing"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

function station(){
    allowItems = 1;
    //TODO create properly
    let curtext = printList([], driveRound["station"]);
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}