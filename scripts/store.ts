import { printAlways, printAllChoices, sayText, locjson } from './quotes';
import { pushloc, getCurrentLocationTag, shopping, setShopping } from './shims';
import { displayyourneed } from './yourbladder';
import { runtimeContext } from './gameState/runtimeContext';
import { BladderLevel } from './gameState/bladderLevel';
import { allowItems, setAllowItems } from './backPackItems';
import { askholditcounter, setAskholditcounter, waitcounter, setWaitcounter, bladder, setBladder } from './bladder';
import { prepeed, setPrepeed } from './herhome';
import storeJson from '../Json/store.json';

function loadStoreScene() {
    const data = JSON.parse(JSON.stringify(storeJson.store));
    data.always = data.always.map((line: string) => line.replace("$money", String(runtimeContext.Money)));
    Object.assign(locjson, data);
}

// Buy stuff at the store.
export function goStore() {
    setAllowItems(1);
    if (getCurrentLocationTag() !== "gostore") {
        pushloc("gostore");
        setShopping(1);
    }
    loadStoreScene();
    if (askholditcounter > 0 && runtimeContext.Companion.bladderState >= BladderLevel.Emergency && runtimeContext.Companion.bladderState < BladderLevel.Lose && !waitcounter) {
        cellphone();
    } else {
        if (!askholditcounter && runtimeContext.Companion.bladderState >= BladderLevel.Need) {
            setBladder(0);
        }
        if (runtimeContext.Companion.bladderState >= BladderLevel.Lose) {
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