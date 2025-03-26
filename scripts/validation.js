function validateListenerList(list){
    if (!isValidList(list)){
        setErrorPopup("Listener list poorly defined:\n"+
        list);
    }
}

function isValidList(list) {
    if (!Array.isArray(list)) return false;
    for (const index in list){
        const item = list[index]
        if (!Array.isArray(item)) return false;
        if (item.length !== 2) return false;
        const choiceDefinition = item[0]
        if (!Array.isArray(choiceDefinition)) return false;
        if (choiceDefinition.length !== 2) return false;
        if (typeof choiceDefinition[0] !== "function") return false;
        if (typeof choiceDefinition[1] !== "string") return false;
        if (typeof item[1] !== "string") return false;
    }
    return true;
}