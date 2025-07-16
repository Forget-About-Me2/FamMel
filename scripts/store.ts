// Buy stuff at the store.
function goStore() {
    allowItems = 1;
    if (locStack[0] !== "gostore") {
        gameState.pushLoc("gostore");
    }
    locationMSetup("yourhome", "store");
    if (askholditcounter > 0 && bladder > blademer && bladder < bladlose && !waitcounter) {
        cellphone();
    } else {
        if (!askholditcounter && bladder > bladneed) {
            bladder = 0;
        }
        if (bladder > bladlose) {
            bladder = 0;
            prepeed = 1;
        }
        let curText: string[] = [];
        curText = printAlways(curText);
        curText = displayyourneed(curText);
        var listenerList = [];
        sayText(curText);
    }
}