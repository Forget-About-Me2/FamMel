import { loadLocationScene, printAlways, printAllChoices, sayText } from './quotes';
import { pushloc } from './shims';
import { displayyourneed } from './yourbladder';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';

// Buy stuff at the store.
export function goStore() {
    allowItems = 1;
    if (locStack[0] !== "gostore") {
        pushloc("gostore");
        shopping = 1;
    }
    loadLocationScene("yourhome", "store");
    if (askholditcounter > 0 && gameState.Companion.bladderState >= BladderState.Emergency && gameState.Companion.bladderState < BladderState.Lose && !waitcounter) {
        cellphone();
    } else {
        if (!askholditcounter && gameState.Companion.bladderState >= BladderState.Need) {
            bladder = 0;
        }
        if (gameState.Companion.bladderState >= BladderState.Lose) {
            bladder = 0;
            prepeed = 1;
        }
        let curText: string[] = [];
        curText = printAlways(curText);
        curText = displayyourneed(curText);
        curText = printAllChoices(curText);
        sayText(curText);
    }
}

export function exposeStoreOnWindow(): void {
    const w = window as any;
    w.goStore = goStore;
    w.gostore = goStore;
}