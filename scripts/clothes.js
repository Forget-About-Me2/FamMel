//TODO implement option to match colours to descriptions (maybe type it in yourself?)
pantydescriptions = [
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
        // s(girltalk + "That's what I have on already!");
    } else {
        if (pantycolor === "none") {
            curtext = printFormatDialogue(curtext, "changepanties", 0, 0, 0, [girltalk, newcolor])
            // s(girltalk + "Okay, I'll put on my " + newcolor + " panties for you.");
        } else {
            curtext = printFormatDialogue(curtext, "changepanties", 2, 0, 0, [girltalk, pantycolor])
            // s(girltalk + "I'm peeling off my " + pantycolor + " panties...");
            if (newcolor !== "none")
                curtext = printFormatDialogue(curtext, "changepanties", 3, 0, 0, [girltalk, newcolor])
            // s(girltalk + "and slipping into on my " + newcolor + " ones.");
            else
                curtext = printDialogue(curtext, "changepanties", 4);
            // s(girltalk + "but you have to promise not to peek at me!");
        }
    }
    pantycolor = newcolor;
    curtext = printChoices(curtext, [10]);
    // c(locstack[0], "Continue...");
    sayText(curtext);
}