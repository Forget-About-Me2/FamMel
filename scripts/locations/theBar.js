let bar;

function theBarSetup(){
    getjson("locations/theBar", barJsonSetup);
    return {
        "visit": [theBar, "Go to the bar"],
        "wantVisit": [theBar, "Go to the bar like she asked."],
        "group": 1,
        "visited": 0,
    }
}

function barJsonSetup(){
    json["theBar"] = formatAllVarsList(json["theBar"]);
    bar = json;
}

function theBar(){
    let curtext = [];
    if (locstack[0] === "driveout" && beenbar && thetime < barclosingtime){
        curtext = printList(curtext, bar["theBar"][0]);
        curtext = callChoice(["curtext", "Continue..."], curtext);
        sayText(curtext);
        if (haveItem("barKey"))
            cListenerGen([rebar, "But I found this key I have to return!"]);
    }
}

function rebar(){
    
}
