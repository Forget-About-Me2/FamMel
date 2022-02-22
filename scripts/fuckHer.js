// Fucking Parameters
let arousal = 0;
let kisscounter = 0;
let feelcounter = 0;
let fuckingnow = 0; // You are in the middle of fucking.

let champagnecounter = 0; // Number of glasses of champagne served.
let drankChamp = 0; // Time since last champagne glass was drunk.

//This object is used to keep track of everything related to the sexActions
let sexActions = {
    clothes:{
        skirt:{
            on: 1,
            takeOffInfo:[
                ["panties", "emer", "succ"],
                ["none", "lose", "succ"]
            ],
            init: objInit,
            reset: objReset,
        },
        top:{
            on: 1,
            takeOffInfo: [
                ["none", "lose", "succ"]
            ],
            init: objInit,
            reset: objReset,
        },
        bra:{
            on: 1,
            takeOffInfo: [
              ["top", "lose", "fail"],
              ["none", "lose", "succ"]
            ],
            init: objInit,
            reset: function () {

            },
        },
        panties:{
            on: 1,
            takeOffInfo: [
                ["skirt", "lose", "fail"],
                ["none", "emer", "succ"]
            ],
            init: objInit,
            reset: objReset,
        },
        clothNames: ["skirt", "top", "bra", "panties"],
        init: objInit,
        reset: function (){
            this.clothNames.forEach(item => this[item].on = 1);
        }
    },
    actions:{
        kNeck: {
            performed: 0,
            needOff: [],
            clothesArousal: [
              ["none", 4, "emer"],
            ],
            noTub: 0,
            choiceLine: "Kiss her on the neck",
            init: objInit,
            reset: objReset,
        },
        kThigh: {
            performed: 0,
            needOff: ["skirt"],
            clothesArousal: [
                ["skirt", 6, "emer"],
                ["none", 20, "emer"]
            ],
            noTub: 1,
            emer: 1,
            choiceLine: "Kiss her on the thigh",
            init: objInit,
            reset: objReset,
        },
        kPussy: {
            performed: 0,
            needOff: [],
            clothesArousal: [
                ["skirt", 0, "emer"],
                ["none", 20, "emer"]
            ],
            noTub: 1,
            choiceLine: "Kiss her on the pussy",
            init: objInit,
            reset: objReset,
        },
        kBreast: {
            performed: 0,
            needOff: ["bra"],
            clothesArousal: [
                ["top", 4, "none"],
                ["bra", 10, "none"],
                ["none", 20, "emer"]
            ],
            noTub: 0,
            choiceLine: "Kiss her on the nipple",
            init: objInit,
            reset: objReset,
        },
        tThigh: {
            performed: 0,
            needOff: ["skirt"],
            clothesArousal: [
                ["skirt", 3, "none"],
                ["none", 10, "emer"],
            ],
            noTub: 0,
            choiceLine: "Touch her thigh",
            init: objInit,
            reset: objReset,
        },
        tPussy: {
            performed: 0,
            needOff: [],
            clothesArousal: [
                [["skirt", "notpanties"], 6, "none"],
                [["skirt", "panties"], 4, "none"],
                ["panties", 12, "lose"],
                ["none", 20, "lose"]
            ],
            noTub: 0,
            choiceLine: "Touch her pussy",
            init: objInit,
            reset: objReset,
        },
        tAss: {
            performed: 0,
            needOff: ["skirt"],
            clothesArousal: [
                ["skirt", 2, "emer"],
                ["panties", 4, "emer"],
                ["none", 10, "emer"]
            ],
            noTub: 0,
            choiceLine: "Touch her ass",
            init: objInit,
            reset: objReset,
        },
        tBreast: {
            performed: 0,
            needOff: ["top"],
            clothesArousal: [
                ["top", 4, "none"],
                ["bra", 2, "none"],
                ["none", 20, "lose"]
            ],
            noTub: 0,
            choiceLine: "Touch her breasts",
            init: objInit,
            reset: objReset,
        },
        init: objInit,
        reset: objReset,
        actionList: function (){
            let result = [];
            Object.keys(this).forEach(item => {
                if (typeof this[item] === "object" && item !== "initVal")
                    result.push(item);
            }
            );
            return result;
        }
    },
    fuckingNow: 0,
    init: objInit,
    reset: objReset,
    isOn: function (item) {
        return this.clothes[item].on;
    },
    takeOff: function (item) {
        this.clothes[item].on = 0;
    },
    naked: function () {
        this.clothes.skirt.on = 0;
        this.clothes.top.on = 0;
        this.clothes.bra.on = 0;
        this.clothes.panties.on = 0;
    },
    getPerformed: function (item) {
        return this.actions[item].performed;
    },
    setPerformed: function(item) {
      this.actions[item].performed = 1;
    },
    noTubUse: function(item){
        return this.actions[item].noTub;
    }
}
function fuckHerSetup(){
    sexLines = json;
    Object.keys(sexLines).forEach(loc => {
        if (typeof loc === "object" && (loc !== "clothes" || loc !== "actions")) {
            const obj = sexLines[loc];
            obj["intro"][0] = formatAllVarsList(obj["intro"][0]);
            obj["intro"][1] = formatAllVars(obj["intro"][1]);
            obj["maxKiss"] = formatAllVars(obj["maxKiss"]);
            obj["leaveSex"] = formatAllVars(obj["leaveSex"]);
        } else if (loc === "actions" || loc === "clothes") {
            Object.keys(sexLines[loc]).forEach(action => {
                for (let i = 0; i < sexLines[loc][action].length; i++) {
                    sexLines[loc][action][i] = formatAllVarsList(sexLines[loc][action][i]);
                }
            });
        }
    sexLines["fuckTry"] = formatAllVars(sexLines["fuckTry"]);

    sexActions.init();
});
}

function haveSex(location){
    let curtext = [];
    let sexQuotes = sexLines[location];
    if (locstack[0]!== "haveSex"){
        kisscounter = 0;
        arousal = 0;
        pushloc("haveSex");
        if (location === "theTub"){
            sexActions.naked();
            curtext = printList(curtext, sexQuotes["intro"][0][0]);
        } else {
            if (pantycolor === "none") sexActions.takeOff("panties");
            if (bladder > bladlose)
                curtext = printList(curtext, sexQuotes["intro"][0][0]);
            else
                curtext = printList(curtext, sexQuotes["intro"][0][1]);
        }
    } else {
        curtext = printList(curtext, sexQuotes["intro"][1]);
    }
    let listenerList = [];
    if (kisscounter > maxkiss){
        curtext = printList(curtext, sexQuotes["maxKiss"]);
        if (location === "theBed")
            listenerList.push([[gameOver, "Continue..."], "gameOver"]);
        else
            listenerList.push([[function (){leaveSex(location)}, "Continue..."], "leaveSex"]);
    }

    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);

    let choice = 4;
    if (arousal < 40)
        choice = 0;
    else if (arousal < 70)
        choice = 1;
    else if (arousal < 100)
        choice = 2;
    else if (arousal < 140)
        choice = 3;

    //The only quote here that is location dependent is if her arousal is through the roof.
    if (choice === 4)
        curtext.push(pickrandom(sexLines[location]["arousal"]).formatVars());
    else
        curtext.push(pickrandom(sexLines["arousal"][choice]).formatVars());
    curtext.push("What will you do?");
    listenerList.push([[function () {kissher([], location)}, "Kiss her on the mouth."], "kissHer"]);
    sexActions.actions.actionList().forEach(action => {
        const actObj = sexActions.actions[action]
        if (!sexActions.getPerformed(action) && !(location === "theTub" && sexActions.noTubUse(action))){
            let preReq = true;
            actObj.needOff.forEach(item => preReq = preReq && !sexActions.isOn(item));
            if (preReq)
                listenerList.push([[function () {
                    performAction(action, location);
                }, actObj.choiceLine], action]);
        }
    });
    sexActions.clothes.clothNames.forEach(item => {
        if (sexActions.isOn(item)) {
            listenerList.push([[function () {
                takeOff(item, location);
            }, appearance["clothes"][heroutfit]["sextakeoff" + item]], item]);
        }});
    if (arousal > 120 && !sexActions.isOn("skirt") && !sexActions.isOn("panties")) {
        if (location === "theBed")
            if (arousal >= 140)
                listenerList.push([[fuckNow, "Fuck her <b>NOW</b>."], "fuckNow"]);
            else
                listenerList.push([[fuckNow, "Fuck her"], "fuckNow"]);
        else
            listenerList.push([[function () {fuckTry(location)}, "Fuck her"], "fuckTry"]);
    }
    if (location === "theBed")
        listenerList.push([[gameOver, "Say goodnight"], "gameOver"]);
    else
        listenerList.push([[function (){leaveSex(location)}, sexLines[location]["leave"]], "leaveSex"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}

function takeOff(item, location){
    arousal += 4;
    let info = sexActions.clothes[item];
    let processed = false;
    let failTakeOff = false;
    let curtext = [];
    if (item === "skirt" && bladder > blademer)
        curtext.push(appearance["clothes"][heroutfit]["sextoskirtquoteemer"].formatVars());
    for (let i = 0; !processed; i++){
        let clothesInfo = info.takeOffInfo[i];
        if (clothesInfo[0] === "none"){
            let temp;
            temp = appearance["clothes"][heroutfit]["sex"+item+clothesInfo[0].formatVars()];
            if (typeof temp !== "undefined")
                curtext.push(temp);
            if (item === "panties" && bladder > bladlose)
                curtext = printList(curtext, sexLines["clothes"][item][i][3]);
            curtext = printList(curtext, sexLines["clothes"][item][i][0]);
            if (clothesInfo[1] === "lose") {
                if (bladder > bladlose)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]);
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]);
            } else if (clothesInfo[1] === "emer"){
                if (bladder > blademer)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]);
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]);
            }
            processed = true;
        } else if (sexActions.isOn(clothesInfo[0])){
            let temp;
            temp = appearance["clothes"][heroutfit]["sex"+item+clothesInfo[0]];
            if (typeof temp !== "undefined")
                curtext.push(temp.formatVars())
            curtext = printList(curtext, sexLines["clothes"][item][i][0]);
            failTakeOff = clothesInfo[2] === "fail";
            if (item === "panties")
                curtext.push(appearance["clothes"][heroutfit]["sexPantiesTOSkirt"].formatVars());
            if (clothesInfo[1] === "lose") {
                if (bladder > bladlose)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]);
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]);
            } else if (clothesInfo[1] === "emer"){
                if (bladder > blademer)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]);
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]);
            }
            if (item === "skirt" && bladder > bladlose)
                curtext = printList(curtext, sexLines["clothes"][item][i][3]);
            processed = true;
        }
    }
    if (!failTakeOff)
        sexActions.takeOff(item);
    sayText(curtext);
    cListenerGen([function () {haveSex(location)}, "Continue..."], "haveSex");
}

function performAction(action, location){
    let info = sexActions.actions[action];
    let processed = false;
    let curtext = [];
    for (let i = 0; !processed; i++){
        let arousalInfo = info.clothesArousal[i];
        if (Array.isArray(arousalInfo[0])){
            let met = true;
            let sumName = ""; //The name used to query clothing related quotes later on
            arousalInfo[0].forEach(item => {
                if (item.includes("not")){
                    let temp = item.substring(3);
                    met = met && !sexActions.isOn(temp);
                } else {
                    met = met && sexActions.isOn(item);
                }
                sumName += item;
            });
            if (met){
                arousal += arousalInfo[1];
                processed = true;
                let temp;
                if (info.clothesArousal.length > 2)
                    temp = appearance["clothes"][heroutfit]["sex"+action+sumName];
                else
                    temp = appearance["clothes"][heroutfit]["sex"+action];
                if (typeof temp !== "undefined")
                    curtext.push(temp)
            }
        }else if (arousalInfo[0] === "none" || sexActions.isOn(arousalInfo[0])){
            arousal += arousalInfo[1];
            if (arousalInfo[0] !== "none"){
                let temp;
                if (info.clothesArousal.length > 2)
                    temp = appearance["clothes"][heroutfit]["sex"+action+arousalInfo[0]];
                else
                    temp = appearance["clothes"][heroutfit]["sex"+action];
                if (typeof temp !== "undefined")
                    curtext.push(temp)
            }
            curtext = printList(curtext, sexLines["actions"][action][i][0]);
            if (arousalInfo[2] === "emer") {
                if (bladder > blademer)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else {
                    if (action === "kPussy" && wetherpanties)
                        curtext = printList(curtext, sexLines["actions"][action][i][3]);
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
                }
            } else if (arousalInfo[2] === "lose"){
                if (bladder > bladlose)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else
                    if (action === "kPussy" && wetherpanties && arousalInfo[0]==="none")
                        curtext = printList(curtext, sexLines["actions"][action][i][3]);
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
            }
            if (action === "kPussy" && bladder > bladlose)
                curtext = printList(curtext, sexLines["actions"][action][i][4]);
            processed = true;
        }
    }
    if (multiplemoves === 0)
        sexActions.setPerformed(action);
    sayText(curtext);
    cListenerGen([function () {haveSex(location)}, "Continue..."], "haveSex");
}

function leaveSex(location){
    let curtext = printList([], sexLines[location]["leaveSex"]);
    curtext = callChoice([location, "Continue..."], curtext);
    sexActions.clothes.reset();
    if (rstmoves === 1) sexActions.actions.reset();
    poploc();
    sayText(curtext);
}

function fuckTry(location) {
    let curtext = printList([], sexLines["fuckTry"]);
    sayText(curtext);
    cListenerGen([function(){leaveSex(location)}, "Continue..."], "leaveSex");
}

function theBedroom() {
    let curtext = [];
    if (locstack[0] !== "theBedroom") {
        pushloc("theBedroom");
        curtext.push(sexLines["followBed"]);
        if (bladder > bladlose-25)
            curtext.push(sexLines["bedroomDesp"]);
        else
            curtext.push(sexLines["bedroomNorm"]);
    } else
        curtext.push(sexLines["areBedroom"]);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    let listenerList = [];
    if (gottagoflag) {
        listenerList.push([[allowpee, sexLines["choices"]["allowPee"]], "allowPee"]);
        listenerList.push([[holdit, sexLines["choices"]["holdIt"]], "holdIt"])
    }
    listenerList.push([[function() {haveSex("theBed")}, sexLines["choices"]["theBed"]], "haveSex"]);
    listenerList.push([[gameOver, herHome["choices"]["goodNight"]], "gameOver"]);
    sayText(curtext);
    cListenerGenList(listenerList);
}


//TODO chance of failure upon pausing(still cuming)
function fuckNow() {
    fuckingnow = 1;
    let curtext = printList([], sexLines["fuckNow"][0]);
    if (bladder > bladlose) {
        curtext = printList(curtext, sexLines["fuckNow"][1]);
    }
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][2]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][3]);
    }
    sayText(curtext);
    let listenerList =[
        [[fuckHer2, "Keep fucking her."], "keepGoing"],
        [[fuckHer2b, "Pause for a second to regain control"], "pause"]
    ]
    cListenerGenList(listenerList);
}

function fuckHer2() {
    let curtext = printList([], sexLines["fuckNow"][4]);
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][5]);
        sayText(curtext);
        cListenerGen([wetBed, "Continue..."], "wetBed");
    } else {
        bothCum(curtext);
    }
}

function wetBed() {
    flushdrank();
    sayText(sexLines["fuckNow"][6]);
    cListenerGen([gameWet, "Continue..."]);
}

function bothCum() {
    let curtext = printList([], sexLines["fuckNow"][7]);
    if (bladder > bladneed)
        curtext = printList(curtext, sexLines["fuckNow"][8]);
    else
        curtext = printList(curtext, sexLines["fuckNow"][9]);
    sayText(curtext)
    cListenerGen([gameSexBoth, "Continue..."], "gameSex");
}

function fuckHer2b() {
    let curtext = printList([], sexLines["fuckNow"][10]);
    if (bladder > blademer)
        curtext = printList(curtext, sexLines["fuckNow"][11]);
    else
        curtext = printList(curtext, sexLines["fuckNow"][12]);
    sayText(curtext);
    cListenerGen([fuckHer3, "Continue..."], "fuckHer");
}

function fuckHer3() {
    let curtext = [], listenerList = [];
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][13]);
        listenerList.push([[preWet, "Keep fucking her"], "preWet"]);
        listenerList.push([[fuckHer4, "Pause for a second"], "fuckHer"]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][14]);
        listenerList.push([[bothCum, "Keep going."], "bothCum"]);
        listenerList.push([[fuckHer2b, "Pause for a second."], "pause"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function preWet(curtext = []) {
    printList(curtext, sexLines["fuckNow"][15])
    sayText(curtext);
    cListenerGen([wetBed, "Continue..."], "wetBed");
}

function fuckHer4() {
    pushloc("fuckher6");
    sayText(sexLines["fuckNow"][16]);
    let listenerList = [];
    let func;
    if (bladder < bladsexlose)
        func = fuckHer5;
    else
        func = fuckHer5b;
    listenerList.push([[func, "\"But it will be so much better if you just hold it another minute.\""], "fuckBetter"]);
    listenerList.push([[fuckHer5b, "\"You can hold on for just another minute - I know you can.\""], "fuckCan"]);
    listenerList.push([[allowpee, "Stop and let her pee."], "allowPee"]);
    cListenerGenList(listenerList);
}

function fuckHer5() {
    sayText(sexLines["fuckNow"][17]);
    cListenerGen([fuckHer6, "I promise..."], "fuckHer");
}

function fuckHer5b() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    preWet(curtext);
}

function fuckHer6() {
    let curtext = [];
    let listenerList = [];
    if (bladder < bladneed) {
        curtext = printList(curtext, sexLines["fuckNow"][19]);
        listenerList.push([[gameSexBoth, "Continue..."], "gameSex"]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][20]);
        if (bladder >= bladcumlose)
            curtext = printList(curtext, sexLines["fuckNow"][21]);
        curtext = printList(curtext, sexLines["fuckNow"][22]);
        if (bladder >= bladcumlose)
            curtext = printList(curtext, sexLines["fuckNow"][23]);
        curtext = printList(curtext, sexLines["fuckNow"][24]);
        listenerList.push([[fuckHer7, "Continue..."], "fuckHer"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function fuckHer7() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    sayText(curtext);
    timeheld = thetime - lastpeetime;
    cListenerGen([gameWon, "Continue..."], "gameWon");
    c("gamewon", "Continue...");
}