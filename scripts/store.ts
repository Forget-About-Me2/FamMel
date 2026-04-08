import { loadLocationScene, printAlways, printAllChoices, sayText } from './quotes';
import { pushloc, locStack, setLocStack, shopping, setShopping } from './shims';
import { displayyourneed } from './yourbladder';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';
import { allowItems, setAllowItems } from './backPackItems';
import { askholditcounter, setAskholditcounter, waitcounter, setWaitcounter, bladder, setBladder } from './bladder';
import { prepeed, setPrepeed } from './herhome';

// Buy stuff at the store.
export function goStore() {
    setAllowItems(1);
    if (locStack[0] !== "gostore") {
        pushloc("gostore");
        setShopping(1);
    }
    loadLocationScene("yourhome", "store");
    if (askholditcounter > 0 && gameState.Companion.bladderState >= BladderState.Emergency && gameState.Companion.bladderState < BladderState.Lose && !waitcounter) {
        cellphone();
    } else {
        if (!askholditcounter && gameState.Companion.bladderState >= BladderState.Need) {
            setBladder(0);
        }
        if (gameState.Companion.bladderState >= BladderState.Lose) {
            setBladder(0);
            setPrepeed(1);
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