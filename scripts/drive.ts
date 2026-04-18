import { printChoicesList, printIntro, printAlways, sayText, locationMCSetup, appearance, drive, girltalk, printDialogue } from './quotes';
import { pickrandom, incrandom, randomchoice, pushloc, getCurrentLocationTag, flirtedflag, setFlirtedflag } from './shims';
import { showneed, displayneed, gottagoflag, rrlockedflag, setRrlockedflag } from './bladder';
import { displayyourneed } from './yourbladder';
import { updateSuggestedLocation, printLocationMenu } from './locations';
import { allowItems, setAllowItems } from './backPackItems';
import { gameState } from './gameState/gameState';
import { externalflirt, setExternalflirt } from './locations/theClub';
import { suggestedloc, setSuggestedloc, heroutfit } from './settings';

export let wetthecar = 0; // Seat of the car is wet
export function setWetthecar(val: number) { wetthecar = val; }

//
//  This function is used to leave ANY location and drive off.
//
export function leavehm() {
    gameState.Interactions.ChangeVenueFlag = true;
    gameState.Interactions.CheckedHerOut = false;
    gameState.Romance.KissCounter = 0;
    gameState.Romance.FeelCounter = 0;
    setRrlockedflag(0);
    setExternalflirt(0);

    let curtext = showneed([]);

    if (gottagoflag > 0) {
        // choices: [0]=hold it, [1]=let her go, [2]=let's go
        curtext = printChoicesList(curtext, [0,1], drive["leavehm"]["choices"]);
    } else {
        setFlirtedflag(0);
        curtext.push("<b>YOU</b> " + pickrandom(drive["leavehm"]["outtahere"]));
        incrandom();
        curtext.push(girltalk + "Yeah! " + pickrandom(drive["leavehm"]["outtahere"]));
        curtext = displayneed(curtext);
        curtext = displayyourneed(curtext);
        // choices: [2]=let's go
        curtext = printChoicesList(curtext, [2], drive["leavehm"]["choices"]);
    }
    sayText(curtext);

}

//TODO fix the go to the bar like she asked
export function driveout() {
    setAllowItems(1);
    let curtext: any[] = [];
    if (getCurrentLocationTag() !== "driveout") {
        pushloc("driveout");
        locationMCSetup("driveout", drive);
        curtext = printIntro(curtext, 0);
        setSuggestedloc("none");
        if (wetthecar)
            curtext.push(appearance["clothes"][heroutfit]["soakedseatquote"]);
        else
            curtext = printIntro(curtext, 1);
        curtext = printIntro(curtext, 2);
    } else {
         curtext = printIntro(curtext, 4);
    }
    curtext = displayneed(curtext);
    //TODO can probably combine the printing things in the if statement
    if (suggestedloc === "none") {
        if (randomchoice(8)) {
            updateSuggestedLocation();
            if (suggestedloc !== "none")
                curtext = printDialogue(curtext, suggestedloc,0);
        }
    }
    curtext = displayyourneed(curtext);
    curtext = printAlways(curtext);
    sayText(curtext);
    printLocationMenu();
}

export function exposeDriveOnWindow(): void {
    const w = window as any;
    Object.defineProperty(w, 'wetthecar', {
        get() { return wetthecar; },
        set(v) { wetthecar = v; },
        configurable: true, enumerable: true,
    });
    w.leavehm = leavehm;
    w.driveout = driveout;
}