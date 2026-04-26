import { fetchJson, printList, callChoice, sayText, cListenerGen, cListenerGenList, addSayText, c } from '../quotes';
import { randomchoice } from '../shims';
import { showneed, displayneed, wetherself, preventpee } from '../bladder';
import { displayyourneed, wetyourself, ypeein } from '../yourbladder';
import { standobjs, haveItem, setAllowItems } from '../backPackItems';
import { driveout } from '../drive';
import { gottagoflag } from '../bladder';
import { getCurrentLocationTag } from '../shims';
import { runtimeContext } from '../gameState/runtimeContext';
import { BladderLevel } from '../gameState/bladderLevel';

let driveRound: any; //JSON quotes for location

export function driveAroundSetup(){
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
export let gasStation;
export function setGasStation(val: any) { gasStation = val; }

export function driveAround(){
    setAllowItems(1);
    // driveAround: [0]=driving narration, [1]=gas station spotted
    const [drivingNarration, gasStationSpotted] = driveRound["driveAround"];
    let curtext = printList([], drivingNarration);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    gasStation = randomchoice(gasChance);
    if(gasStation)
        curtext = printList(curtext, gasStationSpotted);
    if (runtimeContext.Companion.bladderState >= BladderLevel.Lose) {
        sayText(curtext);
        wetherself();
    }
    else if (runtimeContext.Player.bladderState >= BladderLevel.Lose) {
        sayText(curtext);
        wetyourself();
    }
    else {
        //list of locations that need a listener added.
        let listenerList: any[] = []
        sayText(curtext);
        curtext = [] as any[]
        if (runtimeContext.Player.bladderState >= BladderLevel.Emergency) {
            listenerList.push([[drivetell, "Tell her you need to go."], "drivetell"]);
        }
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else curtext = standobjs(curtext, listenerList);
        if (gasStation) {
            listenerList.push([[station, "Stop at the gas station"], "gasStation"]);
        }
        curtext = c([getCurrentLocationTag(), "Continue..."], curtext);
        addSayText(curtext);
        cListenerGenList(listenerList);
    }
}

export function nextstop() {
    let curtext = printList([], driveRound["nextStop"]);
    curtext = displayneed(curtext);
    sayText(curtext);
    cListenerGen([driveout, "Continue..."], "driveAround");
}

export function drivetell() {
    setAllowItems(1);
    let curtext = printList([], driveRound["driveTell"]);
    curtext = displayyourneed(curtext);
    sayText(curtext);
    cListenerGenList ([
        [[drivePee, driveRound["choices"]["youCanNotHold"]], "drivePee"],
        [[driveout, driveRound["choices"]["youNextStop"]], "driveOut"]
    ]);
}

//TODO maybe have an attraction cut for this?
export function drivePee() {
    let curtext = [driveRound["drivePee"]];
    let listenerList: any[] = []
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

export function station(){
    setAllowItems(1);
    //TODO create properly
    let curtext = printList([], driveRound["station"]);
    curtext = callChoice(["curloc", "Continue ..."], curtext);
    sayText(curtext);
}

export function exposeDriveAroundOnWindow(): void {
    const w = window as any;
    Object.defineProperty(w, 'gasStation', {
        get() { return gasStation; },
        set(v) { gasStation = v; },
        configurable: true, enumerable: true,
    });
    w.driveAroundSetup = driveAroundSetup;
    w.driveAround = driveAround;
    w.nextstop = nextstop;
    w.drivetell = drivetell;
    w.drivePee = drivePee;
    w.station = station;
}