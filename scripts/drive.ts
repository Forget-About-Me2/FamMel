import { printChoicesList, printIntro, printAlways, sayText, locationMCSetup } from './quotes';
import { pickrandom, incrandom, randomchoice, pushloc, printDialogue } from './shims';
import { showneed, displayneed } from './bladder';
import { displayyourneed } from './yourbladder';
import { updateSuggestedLocation, printLocationMenu } from './locations';

export let wetthecar = 0; // Seat of the car is wet

//
//  This function is used to leave ANY location and drive off.
//
export function leavehm() {
    changevenueflag = 1;
    checkedherout = 0;
    kisscounter = 0;
    feelcounter = 0;
    rrlockedflag = 0;
    externalflirt = 0;

    let curtext = showneed([]);

    if (gottagoflag > 0) {
        // choices: [0]=hold it, [1]=let her go, [2]=let's go
        curtext = printChoicesList(curtext, [0,1], drive["leavehm"]["choices"]);
    } else {
        flirtedflag = 0;
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
    allowItems = 1;
    let curtext: any[] = [];
    if (locStack[0] !== "driveout") {
        pushloc("driveout");
        locationMCSetup("driveout", drive);
        curtext = printIntro(curtext, 0);
        suggestedloc = "none";
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