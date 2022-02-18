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
            cListener([drivetell, "Tell her you need to go."], "drivetell");
        }
        // c("drivetell", "Tell her you need to go.");
        if (gottagoflag > 0) {
            curtext = preventpee(curtext);
        } else curtext = standobjs(curtext);
        if (gasStation) {
            listenerList.push([[station], "gasStation"]);
            cListener([station, "Stop at the gas station"], "gasStation");
        }
        curtext = c([locstack[0], "Continue..."], curtext);
        addSayText(curtext);
        addListenersList(listenerList);
    }
}

//TODO refactor
function nextstop() {
    s("<b>YOU:</b> I'll definitely stop at the next place I see.");
    s(girltalk + "Thanks!");
    displayneed();
    c(locstack[0], "Continue...");
}

function drivetell() {
    s("You shift uncomfortably in your seat, trying to focus on the road.");
    s("YOU: I'm bursting for a pee.");
    s(girltalk + "Then you better stop somewhere so you can go.");
    c("drivepee", "I can't wait.");
    c(locstack[0], "I'll stop at the next place I see.");
}

function drivepee() {
    s(girltalk + "Do you have anything you can pee in? A cup or something?");
    if (shotglass > 0) c("ypeeshot", "Pee in the shot glass.");
    //TODO figure out how towels would work for you
    // if ( ptowels > 0 ) c("peetowels" , "Pee in the roll of paper towels.");
    if (vase > 0) c("ypeevase", "Pee in the vase.");
    c(locstack[0], "No, I got nothing!")
}

function station(){
    //TODO create
    let curtext = ["You approach the station, only to see that it's under construction.",
    "Unfortunately, you can't stop here."];
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

