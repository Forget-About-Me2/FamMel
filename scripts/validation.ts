import { setErrorPopup } from './pop-up';

export function validateListenerList(list: any[]){
    const validationResult = isValidListenerList(list);
    if (validationResult.length > 0){
        setErrorPopup("Listener list poorly defined:\n"+ "Errors: "
            + isValidListenerList(list).join(",\n ")
        + "\n\nfull listener list: " + JSON.stringify(list));
    }
}

function isValidListenerList(list: any[]) {
    const errors = [];
    if (!Array.isArray(list)) {
        errors.push("List is not an array");
    } else {
    for (const index in list){
            const item = list[index];
            if (!Array.isArray(item)) errors.push("item at index " + index + " is not an array");
            else if (item.length !== 2) errors.push("item at index " + index + " does not have exactly two elements");
            else {
                const choiceDefinition = item[0];
                if (!Array.isArray(choiceDefinition)) errors.push("choiceDefinition for item at index " + index + " is not an array");
                else if (choiceDefinition.length !== 2) errors.push("choiceDefinition for item at index " + index + " does not have exactly two elements");
                else {
                    if (typeof choiceDefinition[0] !== "function") errors.push("choiceDefinition for item at index " + index + " does not have a function as the first element");
                    if (typeof choiceDefinition[1] !== "string") errors.push("choiceDefinition for item at index " + index + " does not have a string as the second element");
                }
                if (typeof item[1] !== "string") errors.push("item at index " + index + " does not have a string as the second element");
    }
        }
    }
    return errors;
}

export function exposeValidationOnWindow(): void {
    (window as any).validateListenerList = validateListenerList;
}