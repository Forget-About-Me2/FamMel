import { formatAllVarsList, formatAllVars, printList, sayText, cListenerGen, cListenerGenList, callChoice, sexLines, setSexLines, appearance, pantycolor } from './quotes';
import { pickrandom, pushloc, poploc, locStack, thetime } from './shims';
import { showneed, displayneed, flushdrank, holdit, allowpee, bladder, bladlose, gottagoflag, wetherpanties, lastpeetime, timeheld, setTimeheld } from './bladder';
import { displayyourneed } from './yourbladder';
import { kissher } from './actions';
import { gameOver, gameWet, gameSexBoth, gameWon } from './main';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';
import { heroutfit, multiplemoves, rstmoves } from './settings';
import { herHome } from './herhome';

// Fucking Parameters — now owned by gameState.Romance
export function setArousal(val: number) { gameState.Romance.Arousal = val; }
export function setKisscounter(val: number) { gameState.Romance.KissCounter = val; }
export function setFeelcounter(val: number) { gameState.Romance.FeelCounter = val; }
export function setFuckingnow(val: number) { gameState.Romance.FuckingNow = val; }
export function setChampagnecounter(val: number) { gameState.Romance.ChampagneCounter = val; }
export let drankChamp = 0; // Time since last champagne glass was drunk.
export function setDrankChamp(val: number) { drankChamp = val; }
export function setSexActions(val: any) { sexActions = val; }

export function deepClone(value: any) {
    return JSON.parse(JSON.stringify(value));
}

// Store initial primitive/array/object values and recursively init nested action objects.
export function objInit(this: any) {
    this.initVal = {};
    Object.keys(this).forEach(key => {
        const value = this[key];
        if (typeof value === "function" || key === "initVal")
            return;
        if (value && typeof value === "object" && typeof value.init === "function") {
            value.init();
            return;
        }
        this.initVal[key] = deepClone(value);
    });
}

// Reset this object and nested objects back to their initialized state.
export function objReset(this: any) {
    if (!this.initVal)
        this.init();
    Object.keys(this.initVal).forEach(key => {
        this[key] = deepClone(this.initVal[key]);
    });
    Object.keys(this).forEach(key => {
        const value = this[key];
        if (key !== "initVal" && value && typeof value === "object" && typeof value.reset === "function") {
            value.reset();
        }
    });
}

//This object is used to keep track of everything related to the sexActions
export let sexActions = {
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
                ["panties", 4, "lose"],
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
            let result: any[] = [];
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
export function fuckHerSetup(data: any){
    setSexLines(data);
    Object.keys(sexLines).forEach(loc => {
        if (typeof loc === "object" && (loc !== "clothes" || loc !== "actions")) {
            const obj = sexLines[loc];
            // intro: [0]=first-time intro variants, [1]=returning intro
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

export function haveSex(location: string){
    let curtext: any[] = [];
    let sexQuotes = sexLines[location];
    if (locStack[0]!== "haveSex"){
        gameState.Romance.KissCounter = 0;
        gameState.Romance.Arousal = 0;
        pushloc("haveSex");
        // intro[0]: first-time intro variants - [0][0]=hot tub/losing, [0][1]=normal
        // intro[1]: returning intro
        const [firstIntroVariants, returningIntro] = sexQuotes["intro"];
        if (location === "theHotTub"){
            sexActions.naked();
            curtext = printList(curtext, firstIntroVariants[0]);
        } else {
            if (pantycolor === "none") sexActions.takeOff("panties");
            if (gameState.Companion.bladderState >= BladderState.Lose)
                curtext = printList(curtext, firstIntroVariants[0]);
            else
                curtext = printList(curtext, firstIntroVariants[1]);
        }
    } else {
        curtext = printList(curtext, sexQuotes["intro"][1]); // returningIntro
    }
    let listenerList: any[] = [];
    if (gameState.Romance.KissCounter > gameState.Romance.MaxKiss){
        curtext = printList(curtext, sexQuotes["maxKiss"]);
        if (location === "theBed")
            listenerList.push([[gameOver, "Continue..."], "gameOver"]);
        else
            listenerList.push([[function (){leaveSex(location)}, "Continue..."], "leaveSex"]);
    }

    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);

    let choice = 4;
    if (gameState.Romance.Arousal < 40)
        choice = 0;
    else if (gameState.Romance.Arousal < 70)
        choice = 1;
    else if (gameState.Romance.Arousal < 100)
        choice = 2;
    else if (gameState.Romance.Arousal < 140)
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
        if (!sexActions.getPerformed(action) && !(location === "theHotTub" && sexActions.noTubUse(action))){
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
    if (gameState.Romance.Arousal > 120 && !sexActions.isOn("skirt") && !sexActions.isOn("panties")) {
        if (location === "theBed")
            if (gameState.Romance.Arousal >= 140)
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

export function takeOff(item: string, location: string){
    gameState.Romance.Arousal += 4;
    let info = sexActions.clothes[item];
    let processed = false;
    let failTakeOff = false;
    let curtext: any[] = [];
    if (item === "skirt" && gameState.Companion.bladderState >= BladderState.Emergency)
        curtext.push(appearance["clothes"][heroutfit]["sextoskirtquoteemer"].formatVars());
    for (let i = 0; !processed; i++){
        // clothesInfo tuple: [prerequisite, bladderCheck, failMode]
        //   prerequisite: "none" or clothing item name
        //   bladderCheck: "lose" or "emer" - threshold for variant text
        //   failMode: "fail" if takeoff should be blocked
        let clothesInfo = info.takeOffInfo[i];
        const [prerequisite, bladderCheck, failMode] = clothesInfo;
        // sexLines["clothes"][item][i]: [baseText, desperateText, normalText, extraText]
        if (prerequisite === "none"){
            let temp;
            temp = appearance["clothes"][heroutfit]["sex"+item+prerequisite.formatVars()];
            if (typeof temp !== "undefined")
                curtext.push(temp);
            if (item === "panties" && gameState.Companion.bladderState >= BladderState.Lose)
                curtext = printList(curtext, sexLines["clothes"][item][i][3]); // extraText
            curtext = printList(curtext, sexLines["clothes"][item][i][0]); // baseText
            if (bladderCheck === "lose") {
                if (gameState.Companion.bladderState >= BladderState.Lose)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]); // desperateText
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]); // normalText
            } else if (bladderCheck === "emer"){
                if (gameState.Companion.bladderState >= BladderState.Emergency)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]); // desperateText
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]); // normalText
            }
            processed = true;
        } else if (sexActions.isOn(prerequisite)){
            let temp;
            temp = appearance["clothes"][heroutfit]["sex"+item+prerequisite];
            if (typeof temp !== "undefined")
                curtext.push(temp.formatVars())
            curtext = printList(curtext, sexLines["clothes"][item][i][0]); // baseText
            failTakeOff = failMode === "fail";
            if (item === "panties")
                curtext.push(appearance["clothes"][heroutfit]["sexPantiesTOSkirt"]);
            if (bladderCheck === "lose") {
                if (gameState.Companion.bladderState >= BladderState.Lose)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]); // desperateText
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]); // normalText
            } else if (bladderCheck === "emer"){
                if (gameState.Companion.bladderState >= BladderState.Emergency)
                    curtext = printList(curtext, sexLines["clothes"][item][i][1]); // desperateText
                else
                    curtext = printList(curtext, sexLines["clothes"][item][i][2]); // normalText
            }
            if (item === "skirt" && gameState.Companion.bladderState >= BladderState.Lose)
                curtext = printList(curtext, sexLines["clothes"][item][i][3]); // extraText
            processed = true;
        }
    }
    if (!failTakeOff)
        sexActions.takeOff(item);
    sayText(curtext);
    cListenerGen([function () {haveSex(location)}, "Continue..."], "haveSex");
}

export function performAction(action: string, location: string){
    let info = sexActions.actions[action];
    let processed = false;
    let curtext: any[] = [];
    for (let i = 0; !processed; i++){
        // arousalInfo tuple: [prerequisite, arousalBonus, bladderCheck]
        //   prerequisite: "none", clothing item name, or array of items ("notX" means item must be off)
        //   arousalBonus: number added to arousal
        //   bladderCheck: "emer" or "lose" - threshold for variant text
        let arousalInfo = info.clothesArousal[i];
        const [prerequisite, arousalBonus, bladderCheck] = arousalInfo;
        // sexLines["actions"][action][i]: [baseText, desperateText, normalText, wetPantiesText, bladderLoseExtraText]
        if (Array.isArray(prerequisite)){
            let met = true;
            let sumName = "";
            prerequisite.forEach(item => {
                if (item.includes("not")){
                    let temp = item.substring(3);
                    met = met && !sexActions.isOn(temp);
                } else {
                    met = met && sexActions.isOn(item);
                }
                sumName += item;
            });
            if (met){
                gameState.Romance.Arousal += arousalBonus;
                processed = true;
                let temp;
                if (info.clothesArousal.length > 2)
                    temp = appearance["clothes"][heroutfit]["sex"+action+sumName];
                else
                    temp = appearance["clothes"][heroutfit]["sex"+action];
                if (typeof temp !== "undefined")
                    curtext.push(temp)
            }
        }else if (prerequisite === "none" || sexActions.isOn(prerequisite)){
            gameState.Romance.Arousal += arousalBonus;
            if (prerequisite !== "none"){
                let temp;
                if (info.clothesArousal.length > 2)
                    temp = appearance["clothes"][heroutfit]["sex"+action+prerequisite];
                else
                    temp = appearance["clothes"][heroutfit]["sex"+action];
                if (typeof temp !== "undefined")
                    curtext.push(temp)
            }
            curtext = printList(curtext, sexLines["actions"][action][i][0]); // baseText
            if (bladderCheck === "emer") {
                if (gameState.Companion.bladderState >= BladderState.Emergency)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]); // desperateText
                else {
                    if (action === "kPussy" && wetherpanties)
                        curtext = printList(curtext, sexLines["actions"][action][i][3]); // wetPantiesText
                    curtext = printList(curtext, sexLines["actions"][action][i][2]); // normalText
                }
            } else if (bladderCheck === "lose"){
                if (gameState.Companion.bladderState >= BladderState.Lose)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]); // desperateText
                else
                    if (action === "kPussy" && wetherpanties && prerequisite==="none")
                        curtext = printList(curtext, sexLines["actions"][action][i][3]); // wetPantiesText
                    curtext = printList(curtext, sexLines["actions"][action][i][2]); // normalText
            }
            if (action === "kPussy" && gameState.Companion.bladderState >= BladderState.Lose && prerequisite === "none")
                curtext = printList(curtext, sexLines["actions"][action][i][4]); // bladderLoseExtraText

            processed = true;
        }
    }
    if (multiplemoves === 0)
        sexActions.setPerformed(action);
    sayText(curtext);
    cListenerGen([function () {haveSex(location)}, "Continue..."], "haveSex");
}

export function leaveSex(location: string){
    let curtext = printList([], sexLines[location]["leaveSex"]);
    curtext = callChoice([location, "Continue..."], curtext);
    sexActions.clothes.reset();
    if (rstmoves === 1) sexActions.actions.reset();
    poploc();
    sayText(curtext);
}

export function fuckTry(location: string) {
    let curtext = printList([], sexLines["fuckTry"]);
    sayText(curtext);
    cListenerGen([function(){leaveSex(location)}, "Continue..."], "leaveSex");
}

export function theBedroom() {
    let curtext: any[] = [];
    if (locStack[0] !== "theBedroom") {
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
    let listenerList: any[] = [];
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
export function fuckNow() {
    gameState.Romance.FuckingNow = 1;
    let curtext = printList([], sexLines["fuckNow"][0]);
    if (gameState.Companion.bladderState >= BladderState.Lose) {
        curtext = printList(curtext, sexLines["fuckNow"][1]);
    }
    if (gameState.Companion.bladderState >= BladderState.Emergency) {
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

export function fuckHer2() {
    let curtext = printList([], sexLines["fuckNow"][4]);
    if (gameState.Companion.bladderState >= BladderState.Emergency) {
        curtext = printList(curtext, sexLines["fuckNow"][5]);
        sayText(curtext);
        cListenerGen([wetBed, "Continue..."], "wetBed");
    } else {
        bothCum();
    }
}

export function wetBed() {
    flushdrank();
    sayText(sexLines["fuckNow"][6]);
    cListenerGen([gameWet, "Continue..."], "gameWet");
}

export function bothCum() {
    let curtext = printList([], sexLines["fuckNow"][7]);
    if (gameState.Companion.bladderState >= BladderState.Need)
        curtext = printList(curtext, sexLines["fuckNow"][8]);
    else
        curtext = printList(curtext, sexLines["fuckNow"][9]);
    sayText(curtext)
    cListenerGen([gameSexBoth, "Continue..."], "gameSex");
}

export function fuckHer2b() {
    let curtext = printList([], sexLines["fuckNow"][10]);
    if (gameState.Companion.bladderState >= BladderState.Emergency)
        curtext = printList(curtext, sexLines["fuckNow"][11]);
    else
        curtext = printList(curtext, sexLines["fuckNow"][12]);
    sayText(curtext);
    cListenerGen([fuckHer3, "Continue..."], "fuckHer");
}

export function fuckHer3() {
    let curtext: any[] = [], listenerList: any[] = [];
    if (gameState.Companion.bladderState >= BladderState.Emergency) {
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

export function preWet(curtext: any[] = []) {
    printList(curtext, sexLines["fuckNow"][15])
    sayText(curtext);
    cListenerGen([wetBed, "Continue..."], "wetBed");
}

export function fuckHer4() {
    pushloc("fuckher6");
    sayText(sexLines["fuckNow"][16]);
    let listenerList: any[] = [];
    let func;
    if (gameState.Companion.bladderState < BladderState.SexLose)
        func = fuckHer5;
    else
        func = fuckHer5b;
    listenerList.push([[func, "\"But it will be so much better if you just hold it another minute.\""], "fuckBetter"]);
    listenerList.push([[fuckHer5b, "\"You can hold on for just another minute - I know you can.\""], "fuckCan"]);
    listenerList.push([[allowpee, "Stop and let her pee."], "allowPee"]);
    cListenerGenList(listenerList);
}

export function fuckHer5() {
    sayText(sexLines["fuckNow"][17]);
    cListenerGen([fuckHer6, "I promise..."], "fuckHer");
}

export function fuckHer5b() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    preWet(curtext);
}

export function fuckHer6() {
    let curtext: any[] = [];
    let listenerList: any[] = [];
    if (gameState.Companion.bladderState < BladderState.Need) {
        curtext = printList(curtext, sexLines["fuckNow"][19]);
        listenerList.push([[gameSexBoth, "Continue..."], "gameSex"]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][20]);
        if (gameState.Companion.bladderState >= BladderState.CumLose)
            curtext = printList(curtext, sexLines["fuckNow"][21]);
        curtext = printList(curtext, sexLines["fuckNow"][22]);
        if (gameState.Companion.bladderState >= BladderState.CumLose)
            curtext = printList(curtext, sexLines["fuckNow"][23]);
        curtext = printList(curtext, sexLines["fuckNow"][24]);
        listenerList.push([[fuckHer7, "Continue..."], "fuckHer"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function fuckHer7() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    sayText(curtext);
    setTimeheld(thetime - lastpeetime);
    cListenerGen([gameWon, "Continue..."], "gameWon");
}

export function exposeFuckHerOnWindow(): void {
    const w = window as any;
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['arousal', () => gameState.Romance.Arousal, (v) => { gameState.Romance.Arousal = v; }],
        ['kisscounter', () => gameState.Romance.KissCounter, (v) => { gameState.Romance.KissCounter = v; }],
        ['feelcounter', () => gameState.Romance.FeelCounter, (v) => { gameState.Romance.FeelCounter = v; }],
        ['fuckingnow', () => gameState.Romance.FuckingNow, (v) => { gameState.Romance.FuckingNow = v; }],
        ['champagnecounter', () => gameState.Romance.ChampagneCounter, (v) => { gameState.Romance.ChampagneCounter = v; }],
        ['drankChamp', () => drankChamp, (v) => { drankChamp = v; }],
        ['sexActions', () => sexActions, (v) => { sexActions = v; }],
    ];
    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, { get: getter, set: setter, configurable: true, enumerable: true });
    }
    w.deepClone = deepClone;
    w.objInit = objInit;
    w.objReset = objReset;
    w.fuckHerSetup = fuckHerSetup;
    w.haveSex = haveSex;
    w.takeOff = takeOff;
    w.performAction = performAction;
    w.leaveSex = leaveSex;
    w.fuckTry = fuckTry;
    w.theBedroom = theBedroom;
    w.fuckNow = fuckNow;
    w.fuckHer2 = fuckHer2;
    w.wetBed = wetBed;
    w.bothCum = bothCum;
    w.fuckHer2b = fuckHer2b;
    w.fuckHer3 = fuckHer3;
    w.preWet = preWet;
    w.fuckHer4 = fuckHer4;
    w.fuckHer5 = fuckHer5;
    w.fuckHer5b = fuckHer5b;
    w.fuckHer6 = fuckHer6;
    w.fuckHer7 = fuckHer7;
}

