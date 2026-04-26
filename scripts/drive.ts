import { printChoicesList, printIntro, printAlways, sayText, locationMCSetup, appearance, drive, girltalk, printDialogue } from './quotes';
import { pickrandom, incrandom, randomchoice, pushloc, getCurrentLocationTag, flirtedflag, setFlirtedflag } from './shims';
import { showneed, displayneed, gottagoflag, rrlockedflag, setRrlockedflag } from './bladder';
import { displayyourneed } from './yourbladder';
import { updateSuggestedLocation, printLocationMenu } from './locations';
import { allowItems, setAllowItems } from './backPackItems';
import { runtimeContext } from './gameState/runtimeContext';
import { externalflirt, setExternalflirt } from './locations/theClub';
import { suggestedloc, setSuggestedloc, heroutfit } from './settings';

export let hasWetTheCar = 0; // Seat of the car is wet
/**
 * Compatibility setter for legacy/global `wetthecar` writes.
 *
 * Post-init, canonical owner is `gameState.HasWetTheCar`. Pre-init writes stay
 * in legacy module scope to preserve startup bridge behavior.
 */
export function setHasWetTheCar(val: number) {
    const nextValue = Number(val);
    if (!Number.isFinite(nextValue)) {
        return;
    }

    if (runtimeContext.isInitialized) {
        runtimeContext.HasWetTheCar = nextValue;
        hasWetTheCar = runtimeContext.HasWetTheCar;
        return;
    }

    hasWetTheCar = nextValue;
}

function getHasWetTheCar(): number {
    return runtimeContext.isInitialized ? runtimeContext.HasWetTheCar : hasWetTheCar;
}

//
//  This function is used to leave ANY location and drive off.
//
export function leavehm() {
    runtimeContext.Interactions.ChangeVenueFlag = true;
    runtimeContext.Interactions.CheckedHerOut = false;
    runtimeContext.Romance.KissCounter = 0;
    runtimeContext.Romance.FeelCounter = 0;
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
        if (getHasWetTheCar())
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
        get() { return getHasWetTheCar(); },
        set(v) { setHasWetTheCar(v); },
        configurable: true, enumerable: true,
    });
    w.__getLegacyHasWetTheCarValue = () => hasWetTheCar;
    w.leavehm = leavehm;
    w.driveout = driveout;
}