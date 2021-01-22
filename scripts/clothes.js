//TODO implement option to match colours to descriptions (maybe type it in yourself?)
let pantydescriptions = [
    "lacy black",
    "white cotton",
    "blue silk",
    "red thong",
    "none"
]


function changepanties(choice) {
    const newcolor = pantydescriptions[choice];
    let curtext = [];
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
    pantycolor = newcolor;
    curtext = printChoices(curtext, [10]);
    sayText(curtext);
}

