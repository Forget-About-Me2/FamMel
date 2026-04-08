import { pantycolor, girltalk, setPantycolor } from './quotes';
import { printFormatDialogue, printChoices, sayText } from './quotes';
import { printDialogue } from './shims';

//TODO implement option to match colours to descriptions (maybe type it in yourself?)
let pantydescriptions = [
    "lacy black",
    "white cotton",
    "blue silk",
    "red thong",
    "none"
]


export function changepanties(choice: number) {
    const newcolor = pantydescriptions[choice];
    let curtext: any[] = [];
    if (pantycolor === newcolor) {
        curtext = printDialogue(curtext, "changepanties", 1);
    } else {
        if (pantycolor === "none") {
            curtext = printFormatDialogue(curtext, "changepanties", 0, 0, 0, [girltalk, newcolor])
        } else {
            curtext = printFormatDialogue(curtext, "changepanties", 2, 0, 0, [girltalk, pantycolor])
            if (newcolor !== "none")
                curtext = printFormatDialogue(curtext, "changepanties", 3, 0, 0, [girltalk, newcolor])
            else
                curtext = printDialogue(curtext, "changepanties", 4);
        }
    }
    setPantycolor(newcolor);
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

export function exposeClothesOnWindow(): void {
    (window as any).changepanties = changepanties;
}

