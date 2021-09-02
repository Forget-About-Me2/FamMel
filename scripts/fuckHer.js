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
            reset: objReset,
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
        init: objInit,
        reset: objReset
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
            needOff: ["skirt"],
            clothesArousal: [
                ["skirt", 0, "emer"],
                ["panties", 8, "lose"],
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
                ["skirt", 2, "none"],
                ["none", 10, "emer"],
            ],
            noTub: 0,
            choiceLine: "Touch her thigh",
            init: objInit,
            reset: objReset,
        },
        tPussy: {
            performed: 0,
            needOff: ["skirt"],
            clothesArousal: [
                [["skirt", "notpanties"], 4, "none"],
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
        reset: objReset
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
        curtext.push(pickrandom(sexLines[location]["arousal"]));
    else
        curtext.push(pickrandom(sexLines["arousal"][choice]));
    curtext.push("What will you do?");
    listenerList.push([[kissher, "Kiss her on the mouth."], "kissHer"]);
    Object.keys(sexActions.clothes).forEach(item => {
        if (sexActions.isOn(item)) {
            listenerList.push([[function () {
                takeOff(item, location);
            }, appearance["clothes"][heroutfit]["sextakeoff" + item]], item]);
        }});

    Object.keys(sexActions.actions).forEach(action => {
        if (!sexActions.getPerformed(action) && !(location === "theTub" && sexActions.noTubUse(action))){
            let preReq = true;
            sexActions.actions[action].needOff.forEach(item => preReq = preReq && !sexActions.isOn(item));
            if (preReq)
                listenerList.push([[function () {
                    performAction(action, location);
                }, sexActions.actions[action].choiceLine], "action"]);
        }
    });
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
        listenerList.push([[gameOver, "Say goodnight"], "gameOVer"]);
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
        curtext.push(appearance["clothes"][heroutfit]["sextoskirtquoteemer"]);
    for (let i = 0; !processed; i++){
        let clothesInfo = info.takeOffInfo[i];
        if (clothesInfo[0] === "none"){
            let temp;
            temp = appearance["clothes"]["sex"+item+clothesInfo[0]];
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
        } else if (clothesInfo[0] === item){
            let temp;
            temp = appearance["clothes"]["sex"+item+clothesInfo[0]];
            if (typeof temp !== "undefined")
                curtext.push(temp)
            curtext = printList(curtext, sexLines["clothes"][item][i][0]);
            failTakeOff = clothesInfo[2] === "fail";
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
    curtext = callChoice([location, "Continue..."], curtext);
    sayText(curtext);
}

function performAction(action, location){
    let info = sexActions.actions[action];
    let processed = false;
    let curtext = [];
    for (let i = 0; !processed; i++){
        let arousal = info.clothesArousal[i];
        if (Array.isArray(arousal[0])){
            let met = true;
            arousal[0].forEach(item => {
                if (item.contains("not")){
                    let temp = item.splice(3);
                    met = met && !sexActions.isOn(temp);
                } else
                    met = met && sexActions.isOn(item);
            });
        } if (arousal[0]=== "none"){
            arousal += arousal[i];
            curtext = printList(curtext, sexLines["actions"][action][i][0]);
            if (arousal[2] === "emer") {
                if (bladder > blademer)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else {
                    if (action === "kPussy" && wetherpanties)
                        curtext = printList(curtext, sexLines["actions"][action][i][3]);
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
                }
            } else if (arousal[2] === "lose"){
                if (bladder > bladlose)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
            }
            if (action === "kPussy" && bladder > bladlose)
                curtext = printList(curtext, sexLines["actions"][action][i][4]);
            processed = true;
        } else if(sexActions.isOn(arousal[0])){
            arousal += arousal[i];
            let temp;
            if (info.clothesArousal.length > 2)
                temp = appearance["clothes"]["sex"+action+arousal[0]];
            else
                temp = appearance["clothes"]["sex"+action];
            if (typeof temp !== "undefined")
                curtext.push(temp)
            curtext = printList(curtext, sexLines["actions"][action][i][0]);
            if (arousal[2] === "emer") {
                if (bladder > blademer)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else if (action !== "kPussy" || wetherpanties)
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
            } else if (arousal[2] === "lose"){
                if (bladder > bladlose)
                    curtext = printList(curtext, sexLines["actions"][action][i][1]);
                else {
                    curtext = printList(curtext, sexLines["actions"][action][i][2]);
                    if (action === "kPussy" && wetherpanties)
                        curtext = printList(curtext, sexLines["actions"][action][i][3]);
                }
            }
            processed = true;
        }
    }
    if (multiplemoves === 0)
        sexActions.setPerformed(action);
    curtext = callChoice([location, "Continue..."], curtext);
    sayText(curtext);
}

function leaveSex(location){
    let curtext = printList([], sexLines[location]["leaveSex"]);
    curtext = callChoice([location, "Continue..."], curtext);
    sexActions.clothes.reset();
    if (rstmoves === 1) sexActions.actions.reset();
    poploc();
    sayText(curtext);
}
//
// function tubsex() {
//     if (locstack[0] !== "tubsex") {
//         kisscounter = 0;
//         pushloc("tubsex");
//         arousal = 0;
//         s("You pull " + girlname + " on your lap.");
//         xskirt = 1;
//         xtop = 1;
//         xbra = 1;
//         xpanties = 1;
//     } else {
//         s(girlname + " is sitting on your lap... naked.")
//     }
//
//     if (kisscounter > maxkiss) {
//         s(girlname + " suddenly pulls away to sit back next to you.");
//         s(girltalk + "You know, this just isn't working out.");
//         resetclothes();
//         if (rstmoves === 1) {
//             resetmoves();
//         }
//         c("goback", "Continue...");
//     }
//
//     displayneed();
//     displayyourneed();
//
//     if (arousal < 40) {
//         s("She seems very aroused.");
//     } else if (arousal < 70) {
//         s("She seems extremely aroused.");
//     } else if (arousal < 100) {
//         s("She seems unbelievably aroused.");
//     } else if (arousal < 140) {
//         s("She seems earthshatterinly aroused.");
//     } else {
//         s("She seems madly hot, but still reluctant to take that last step here in the hot tub.");
//     }
//
//     s("What will you do?");
//
//     c("kissher", "Kiss her on the mouth.");
//     if (!tthigh) c("touchthigh", "Touch her thigh");
//     if (!tbreast) c("touchbreast", "Touch her breasts");
//     if (!tass) c("touchass", "Touch her ass");
//     if (!tpussy) c("touchpussy", "Touch her pussy");
//     if (!kneck) c("kissneck", "Kiss her on the neck");
//     if (!kbreast) c("kissbreast", "Kiss her on the nipple");
//     if (arousal > 120) c("fucktry", "Fuck her");
//     c("goback", "Lift her off of your lap.");
//
// }
//
// //TODO when making out attraction and shyness are updated?
// function beachsex() {
//     if (locstack[0] !== "beachsex") {
//         kisscounter = 0;
//         pushloc("beachsex");
//         arousal = 0;
//         if (bladder > bladlose)
//             s(girlname + " collapses onto the soft sand, pulling you on top of her.");
//         else
//             s(girlname + " pulls you down onto the soft sand.");
//     } else {
//         s("You are lying on the beach with " + girlname);
//     }
//
//     if (kisscounter > maxkiss) {
//         s(girlname + " suddenly pulls away from you and sits up.");
//         s(girltalk + "You know, this just isn't working out.");
//         c("goback", "Continue...");
//         resetclothes();
//         if (rstmoves === 1) {
//             resetmoves()
//         }
//     } else {
//
//         displayneed();
//         displayyourneed();
//         if (pantycolor === "none") xpanties = 1;
//
//         if (arousal < 40) {
//             s("She seems very aroused.");
//         } else if (arousal < 70) {
//             s("She seems extremely aroused.");
//         } else if (arousal < 100) {
//             s("She seems unbelievably aroused.");
//         } else if (arousal < 140) {
//             s("She seems earthshatterinly aroused.");
//         } else {
//             s("She seems madly hot, but still reluctant to take that last step out here on the beach.");
//         }
//
//         s("What will you do?");
//
//         c("kissher", "Kiss her on the mouth.");
//         if (!tthigh && xskirt) c("touchthigh", "Touch her thigh");
//         if (!tbreast && xtop) c("touchbreast", "Touch her breasts");
//         if (!tass && xskirt) c("touchass", "Touch her ass");
//         if (!tpussy && xskirt) c("touchpussy", "Touch her pussy");
//         if (!kneck) c("kissneck", "Kiss her on the neck");
//         if (!kbreast && xbra) c("kissbreast", "Kiss her on the nipple");
//         if (!kthigh && xskirt) c("kissthigh", "Kiss her on the thigh");
//         if (!kpussy && xskirt) c("kisspussy", "Kiss her on the pussy");
//         if (!xskirt) c("toskirt", sextakeoffskirt);
//         if (!xtop) c("totop", sextakeoffblouse);
//         if (!xbra && xtop) c("tobra", "Take off her bra");
//         if (!xpanties && xskirt) c("topanties", "Take off her panties");
//         if (arousal > 120 && xskirt && xpanties) c("fucktry", "Fuck her");
//         c("goback", "Get back up and dust yourself off.");
//     }
// }

function fuckTry(location) {
    let curtext = printList([], sexLines["fuckTry"]);
    // s("You try to put it in, but she pushes you away");
    // s(girltalk + " Not here.  Later.");
    sayText(curtext);
    cListenerGen([function(){leaveSex(location)}, "Continue..."], "leaveSex");
    // c("goback", "Continue...");
}

// //TODO something with your own desperation to pee
// function thebed() {
//     if (locstack[0] !== "thebed") {
//         kisscounter = 0;
//         pushloc("thebed");
//         arousal = 0;
//         if (bladder > bladlose)
//             s(girlname + " collapses on the bed, pulling you on top of her.");
//         else
//             s(girlname + " pulls you down onto the bed.");
//     } else {
//         s("You are in bed with " + girlname);
//     }
//
//     if (kisscounter > maxkiss) {
//         s(girlname + " suddenly pulls away from you and sits up in bed.");
//         s(girltalk + "You know, this just isn't working out.");
//         s(girltalk + "I'm afraid we're going to have to call it a night.");
//         c("gameover", "Continue...");
//     } else {
//
//         displayneed();
//         displayyourneed();
//         if (pantycolor === "none") xpanties = 1;
//
//         if (arousal < 20) {
//             s("She seems very aroused.");
//         } else if (arousal < 40) {
//             s("She seems very aroused.");
//         } else if (arousal < 70) {
//             s("She seems extremely aroused.");
//         } else if (arousal < 100) {
//             s("She seems unbelievably aroused.");
//         } else if (arousal < 140) {
//             s("She seems earthshatterinly aroused.");
//         } else {
//             s(girltalk + "<i>Hurry!</i> Fuck me <b>NOW</b>!");
//         }
//
//         s("What will it be?");
//
//         c("kissher", "Kiss her on the mouth.");
//         if (!tthigh && xskirt) c("touchthigh", "Touch her thigh");
//         if (!tbreast && xtop) c("touchbreast", "Touch her breasts");
//         if (!tass && xskirt) c("touchass", "Touch her ass");
//         if (!tpussy && xskirt) c("touchpussy", "Touch her pussy");
//         if (!kneck) c("kissneck", "Kiss her on the neck");
//         if (!kbreast && xbra) c("kissbreast", "Kiss her on the nipple");
//         if (!kthigh && xskirt) c("kissthigh", "Kiss her on the thigh");
//         if (!kpussy && xskirt) c("kisspussy", "Kiss her on the pussy");
//         if (!xskirt) c("toskirt", sextakeoffskirt);
//         if (!xtop) c("totop", sextakeoffblouse);
//         if (!xbra && xtop) c("tobra", "Take off her bra");
//         if (!xpanties && xskirt) c("topanties", "Take off her panties");
//         if (arousal >= 140 && xpanties && xskirt) c("fucknow", "Fuck her <b>NOW</b>.");
//         else if (arousal > 120 && xpanties && xskirt) c("fucknow", "Fuck her");
//         c("gameover", "Say goodnight.");
//     }
// }


// function touchthigh() {
//     if (!xskirt) {
//         arousal += 6;
//         s(sextouchthighquote);
//         if (bladder > blademer) {
//             s("They are wet and slippery.  You pull your hand back out and smell her sweat.  No pee yet, you think.");
//         } else {
//             s("She moans and quivers with delight.");
//             s(girltalk + "That feels <i>so</i> good!");
//         }
//
//     } else {
//         s("You slide your hand up her inner thighs.");
//         if (bladder > blademer) {
//             s("She suddenly clamps her legs together, trapping your fingers.");
//             s("She squirms back and forth, trying to find a comfortable position, and pulling your arm around as she does it.");
//             s(girltalk + "Oops.  I have to go sooooo bad I almost lost it for a second there.  Here's your arm back.");
//         } else {
//             s("She moans and quivers with delight.");
//             s(girltalk + "That feels <i>so</i> good!");
//         }
//         arousal += 20;
//     }
//     if (multiplemoves === 0) {
//         tthigh = 1;
//     }
//     c(locstack[0], "Continue...");
// }
//
//
// function touchbreast() {
//     if (xtop === 0) {
//         arousal += 4;
//         s("You massage her breasts through the thin fabric of her blouse.");
//     } else if (xbra === 0) {
//         s("You rub her nipples through the silky lace of her bra.");
//         arousal += 2;
//     } else {
//         arousal += 20;
//         s("You twirl your finger around her erect nipples and she moans in pleasure.");
//         if (bladder > bladlose) {
//             s(girlname + " moans: Yes! Harder! I can't control it much longer.");
//         } else {
//             s("You didn't think it was possible, but her nipples are now even harder and sticking out even further.");
//         }
//     }
//     if (multiplemoves === 0) {
//         tbreast = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function touchass() {
//     if (!xskirt) {
//         arousal += 2;
//         s(sextouchassquote);
//         if (bladder > blademer) {
//             s("Her butt cheeks are clenching and releasing, as she struggles to hold her bursting bladder.");
//         } else {
//             s("The silky cloth slides easily over her smooth cheeks and she presses into your hands.");
//         }
//     } else if (!xpanties) {
//         arousal += 4;
//         s("You rub her ass though the silky fabric of her panties.");
//         if (bladder > blademer) {
//             s("The panties are damp with her sweat.");
//         } else {
//             s("The thin cloth slides easily over her smooth cheeks and your fingers find their way underneath.");
//         }
//     } else {
//         arousal += 10;
//         s("You grab her ass and your fingers slide towards her hot cunt from the rear.");
//         if (bladder > blademer) {
//             s("Her butt clenches and your fingers seem stuck before they slide back out, lubricated by her sweat.");
//         } else {
//             s("She gasps: That's so <i>good</i>!");
//         }
//     }
//     if (multiplemoves === 0) {
//         tass = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function touchpussy() {
//     if (xskirt === 0 && xpanties !== 0) {
//         arousal += 4;
//         s(sextouchpussyquote);
//     } else if (xpanties === 0) {
//         arousal += 12;
//         s("You stroke her burning pussy though the silky wet fabric of her panties.");
//         if (bladder > bladlose) {
//             s("She grabs your hand and presses it into her crotch.  You can feel her pee hole as a tight quivering bump right under your index finger.");
//             s(girltalk + "You have to help me hold it!");
//         } else {
//             s("She presses her cunt into your hand and reaches over to massage your dick.");
//         }
//     } else {
//         arousal += 20;
//         s("Your hand reaches up to firmly massage her dripping cunt as she moans in pleasure.");
//         if (bladder > bladlose) {
//             s("She grabs your hand and presses it more firmly into her crotch.  You can feel her pee hole as a tight quivering bump right under your index finger.");
//             s(girltalk + "You have to help me hold it!");
//         } else {
//             s("You feel the bump of her erect clit pulsing beneath your fingers.");
//         }
//     }
//     if (multiplemoves === 0) {
//         tpussy = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function kissneck() {
//     arousal += 4;
//     s("You nibble delicately on her neck.");
//     if (bladder > blademer) {
//         s("Goosebumps suddenly form and her whole body shakes uncontrollable for a second.");
//     } else {
//         s("She seems to like it.");
//     }
//     if (multiplemoves === 0) {
//         kneck = 1;
//     }
//     c(locstack[0], "Continue...");
// }
//
// function kissbreast() {
//     if (!xtop) {
//         arousal += 4;
//         s("You bring your mouth up to her breasts and blow warm air through thin fabric of her blouse.  You can feel her nipples stiffen at the contact.");
//     } else if (!xbra) {
//         arousal += 10;
//         s("You lick her nipples through the rough lace of her bra.");
//     } else {
//         arousal += 20;
//         s("You suck and lick her stiff nipples and she moans in pleasure.");
//         if (bladder > blademer) {
//             s("They taste salty and sweet with her sweat.");
//         }
//     }
//     if (multiplemoves === 0) {
//         kbreast = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function kissthigh() {
//     if (xskirt === 0) {
//         arousal += 2;
//         s(sexkissthighquote);
//     } else {
//         arousal += 10;
//         s("You slide your cheek up her inner thighs, licking and kissing them passionately until you feel the heat of her pussy on your forhead.");
//         if (bladder > blademer) {
//             s("Her thighs are quivering with the effort keep her legs open and still clamp her pee hole shut.");
//         }
//     }
//     if (multiplemoves === 0) {
//         kthigh = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function kisspussy() {
//     if (!xskirt) {
//         s(sexkisspussyquote);
//         if (bladder > blademer) {
//             s("She groans and tries to push your head away");
//         } else if (wetherpanties) {
//             s("You smell the fragrance of her pee remaining from when she wet herself.");
//         }
//     } else if (!xpanties) {
//         arousal += 8;
//         s("You lay your face in her lap and tongue her pussy though the silky wet fabric of her panties.");
//         if (bladder > bladlose) {
//             s("She suddenly squeezes her legs together and pushes your head out.");
//             s(girltalk + "Sorry!  I just had to do that.  I'm losing control!");
//         } else {
//             s("Your tongue finds her swollen clit through the thin cloth.");
//             if (wetherpanties)
//                 s("You smell the fragrance of her pee remaining from when she wet herself.");
//         }
//     } else {
//         arousal += 20;
//         s("You brush your lips over her fragrant pussy before burying your tongue in her dripping cunt.");
//         if (bladder > blademer) {
//             s("The quivering you feel through your tounge reminds you of the overfilled reservoir of pee that is barely controlled just inches away from your lips.");
//         } else {
//             if (wetherpanties)
//                 s("You smell the fragrance of her pee remaining from when she wet herself.");
//             s("It tastes of salt, and slightly sweet.  She gasps with sudden pleasure.");
//         }
//         if (bladder > bladlose) {
//             s(girltalk + "Oh God! Oh God! Stop stop stop stop.");
//             s("She suddenly slams her thighs together and pushes your head out.");
//             s(girltalk + "Sorry sorry sorry.  I almost let a squirt out.  I'm <i>so</i> full!");
//         }
//     }
//     if (multiplemoves === 0) {
//         kpussy = 1;
//     }
//     c(locstack[0], "Continue...");
// }


// function totop() {
//     arousal += 4;
//     s("You slowly unbutton and remove her top, making sure to feel her up on the way past her breasts.  Her breasts are gorgeous and firm beneath the lace of her bra.");
//     if (bladder > bladlose) {
//         s(girltalk + "<i>HURRY</i> - I can't hold it much longer.");
//         s("She looks like she's going to burst any second.");
//     } else {
//         s(girlname + " rubs her hands over your chest and begins to unbutton your shirt.");
//     }
//     xtop = 1;
//     c(locstack[0], "Continue...");
// }

// function toskirt() {
//     arousal += 4;
//     if (bladder > blademer) {
//         s(sextoskirtquoteemer);
//     }
//     if (!xpanties) {
//         s(sextoskirtquote);
//         if (bladder > blademer) {
//             s("She momentarily catches her breath as a small bit of the pressure is reduced.")
//         } else {
//             s(girlname + " works at unzipping your pants, stroking your shaft through the cloth.");
//         }
//         if (bladder > bladlose) {
//             s("The waistband is soaked with sweat from her exertions.");
//         }
//     } else {
//         s(sextoskirtquotebare);
//         if (bladder > bladlose) {
//             s("It's spasmodically contracting as she fights to hold her pee.");
//         } else {
//             s(girlname + " unfastens your pants and pulls at your boxers, freeing your dick and stroking the shaft lightly.");
//         }
//     }
//     xskirt = 1;
//     c(locstack[0], "Continue...");
// }

// function tobra() {
//     arousal += 4;
//     if (xtop === 0) {
//         s("You pull at her bra to very little effect.  Could it be she's still wearing her blouse?");
//         if (bladder > bladlose) {
//             s("UNGGGGHHHH! She grunts with the effort of holding it in.");
//         } else {
//             s(girltalk + "Having some technical difficulties?");
//             s("She giggles.");
//         }
//     } else {
//         s("You reach around behind her and find... that it's a front snap bra.  Problem is quickly solved ( good thinking! ) and you unsnap between her shapely round breasts.");
//         if (bladder > bladlose) {
//             s("Her chest is flushed, rising and falling quickly as she pants.");
//         } else {
//             s("She rips at your shirt and runs her cool hands all over your chest.");
//         }
//         xbra = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function topanties() {
//     arousal += 4;
//     if (!xskirt) {
//         s(sextopantiesquote);
//         if (bladder > bladlose) {
//             s("She suddenly slams her legs together.");
//             s(girltalk + "What are you doing? I'm nearly wetting myself!");
//         }
//     } else {
//         if (bladder > bladlose)
//             s("Her panties are stretched around the bulge of her unbelievably round and hard bladder.");
//         s("You slip her damp panties down to reveal her curly pubes and moist warm pussy.");
//         if (bladder > blademer) {
//             s("It's spasmodically contracting as she fights to hold her pee.");
//         } else {
//             s(girlname + " pulls at your boxers, freeing your dick and stroking the shaft lightly.");
//         }
//         xpanties = 1;
//     }
//     c(locstack[0], "Continue...");
// }

// function resetclothes() {
//     xpanties = 0;
//     xbra = 0;
//     xskirt = 0;
//     xtop = 0
// }
//
// function resetmoves() {
//     kneck = 0;
//     kthigh = 0;
//     kpussy = 0;
//     kbreast = 0;
//     tthigh = 0;
//     tpussy = 0;
//     tbreast = 0;
//     tass = 0;
// }

//TODO chance of failure upon pausing(still cuming)
function fuckNow() {
    fuckingnow = 1;
    let curtext = printList([], sexLines["fuckNow"][0]);
    // s("You pull her on top of you and stick it into her soft, wet snatch.  It feels <i>so</i> good.");
    if (bladder > bladlose) {
        curtext = printList(curtext, sexLines["fuckNow"][1]);
        // s("Her rock hard bladder rubs on your shaft through the thin wall of her vagina.");
    }
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][2]);
        // s("The spasms as she fights her impulse to pee combined with the thought that she's within seconds of wetting the bed with you inside her bring you to the edge.  You're about to cum!");
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][3]);
        // s("She moans with pleasure and you feel like you're about to cum already!");
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
    // s("You keep pumping.");
    // s("And you can't hold back.  You shoot your load and ram deep inside her.");
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][5]);
        // s("The sudden shock is too much for her and you feel the pee flowing from her cunt and filling the space above your shaft.");
        // s("You relax just a little bit, and pee cascades onto the bed.");
        // s("She's wet the bed.");
        sayText(curtext);
        cListenerGen([wetBed, "Continue..."], "wetBed");
    } else {
        bothCum(curtext);
    }
}

function wetBed() {
    flushdrank();
    sayText(sexLines["fuckNow"][6]);
    // s("You both lie there catching your breath.");
    // s("The sheets are warm and soaked, her fragrance heavy in the air.");
    // s(girltalk + "Well.... that was interesting.");
    cListenerGen([gameWet, "Continue..."]);
    // c("gamewet", "Continue...");  // Wet the bed.
}

function bothCum() {
    let curtext = printList([], sexLines["fuckNow"][7]);
    // s("She arches her back and screams in ecstasy and collapses back onto the bed, breathing hard.");
    // s("You both lie there in bed together, catching your breath.");
    if (bladder > bladneed)
        curtext = printList(curtext, sexLines["fuckNow"][8]);
        // s("You cup her belly in your hand and feel a slight bulge, but " + girlname + " makes no move to get up right away.  You feel a slight regret that she wasn't absolutely desperate when she came.");
    else
        curtext = printList(curtext, sexLines["fuckNow"][9]);
        // s("You run your hand over her tight belly, but you don't feel much of a bulge from her bladder.  She seems in no hurry to get up.  Sex without desperation is still sex.");
    sayText(curtext)
    cListenerGen([gameSex, "Continue..."], "gameSex");
}

function fuckHer2b() {
    let curtext = printList([], sexLines["fuckNow"][10]);
    // s("You pull out for a second and regain a measure of control.");
    if (bladder > blademer)
        curtext = printList(curtext, sexLines["fuckNow"][11]);
        // s(girlname + " whispers: Hurry! It's coming out!!!");
    else
        curtext = printList(curtext, sexLines["fuckNow"][12]);
        // s(girlname + " whispers in your ear: No! Don't stop.");
    sayText(curtext);
    cListenerGen([fuckHer3, "Continue..."], "fuckHer");
}

function fuckHer3() {
    let curtext = [], listenerList = [];
    if (bladder > blademer) {
        curtext = printList(curtext, sexLines["fuckNow"][13]);
        // s("You thurst it back in, feeling the same unbearably stimulating combination of her struggle for control and the knowledge that she's on the edge of wetting the bed.");
        // s(girltalk + "Please.  Stop.  It's <b>so</b> good, but I can't hold it anymore!");
        listenerList.push([[preWet, "Keep fucking her"], "preWet"]);
        listenerList.push([[fuckHer4, "Pause for a second"], "fuckHer"]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][14]);
        // s("You thurst it back in, feeling the her tight, wet pussy close around your shaft, and holding her heaving chest in your arms.");
        // s("She starts moaning with each stroke: oh! oh! ungh! fuck! I'm going to cummmm!");
        listenerList.push([[bothCum, "Keep going."], "bothCum"]);
        listenerList.push([[fuckHer2b, "Pause for a second."], "pause"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function preWet(curtext = []) {
    printList(curtext, sexLines["fuckNow"][15])
    sayText(curtext);
    // s(girlname + " squeals: <b>NO!</b> <i>It's coming out!</i>");
    // s("First a long squirt escapes from her throbbing pussy, and then another.");
    // s("She collapses onto the bed as a thick stream cascades down to drench the sheets for almost a minute.");
    // s("She lies there in relief ... not caring that much.");
    // s("She's wet the bed.");
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
    // s(girlname + " takes a deep breath, and you hear her quietly counting to 3 as a calm takes over her body.");
    // s(girltalk + "That would be more fun, wouldn't it?");
    // s(girltalk + "Okay.  I'm going to try.");
    // s(girltalk + "But promise you won't be mad if I can't hold it.");
    cListenerGen([fuckHer6, "I promise..."], "fuckHer");
}

function fuckHer5b() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    // s(girlname + " takes a deep breath.  Then she gasps.");
    preWet(curtext);
}

function fuckHer6() {
    let curtext = [];
    let listenerList = [];
    if (bladder < bladneed) {
        curtext = printList(curtext, sexLines["fuckNow"][19]);
        // s(girlname + " smiles seductively at you as she slowly climbs back on the bed.");
        // s("She wastes no time with climbing back on top of you and you quickly push your dick in again.");
        // s("She's moaning and bucking her hips in seconds - and you can feel yourself on the verge of shooting your load.");
        // s("Suddenly " + girlname + " cries out and you feel her pussy grip your shaft hard. You can't hold out one second longer. Her orgasmic spasms are massaging your penis, and she's absolutely the sexiest thing you've ever seen in the throas of her ecstasy.");
        // s("You both lie there in bed together, catching your breath.");
        // s("You run your hand over her tight belly, maybe you should've let her hold it after all.");
        // s("Maybe next time.");
        listenerList.push([[gameSex, "Continue..."], "gameSex"]);
    } else {
        curtext = printList(curtext, sexLines["fuckNow"][20]);
        // s(girlname + " pulls you back into her like a possessed woman and you start pumping quickly.");
        // s("She's moaning and bucking her hips in seconds - and you can feel yourself on the verge of shooting your load.");
        if (bladder >= bladcumlose)
            curtext = printList(curtext, sexLines["fuckNow"][21]);
        // if (bladder < bladcumlose)
        //     s("Suddenly " + girlname + " cries out and you feel her pussy grip your shaft hard.  You can't hold out one second longer.  " +
        //         "Her orgasmic spasms are massaging your penis, she's fighting an overwhelming impulse to pee just for you, " +
        //         "and she's absolutely the sexiest thing you've ever seen in the throes of her ecstasy.");
        // else
        //     s("Suddenly " + girlname + " cries out and you feel her pussy grip your shaft hard.  She momentarily loses control and a hot jet of pee squirts out." +
        //         "<br>You can't hold out one second longer.  Her orgasmic spasms are massaging your penis, she's fighting an overwhelming impulse to pee just for you," +
        //         " and she's absolutely the sexiest thing you've ever seen in the throes of her ecstasy.");
        curtext = printList(curtext, sexLines["fuckNow"][22]);
        if (bladder >= bladcumlose)
            curtext = printList(curtext, sexLines["fuckNow"][23]);
        curtext = printList(curtext, sexLines["fuckNow"][24]);
        // s("It's over.");
        // s("You both lie there for about 20 seconds as you catch your breath and the contractions subside.");
        // if (bladder >= bladcumlose)
        //     s("You feel the spurt of pee she released slowly trickle down and form a wet spot on the bed.");
        listenerList.push([[fuckHer7, "Continue..."], "fuckHer"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function fuckHer7() {
    let curtext = printList([], sexLines["fuckNow"][18]);
    sayText(curtext);
    // s("You hug her close to your body, but she gasps and struggles... 20 seconds was as long as she could take.");
    // s(girltalk + "It's coming out - I can't stop it!");
    // s("You quickly release her and she bounces out of bed, both hands pressed into her crotch.  You know the only thing holding in her pee now is her finger jammed into her pee hole.");
    // s("She doesn't have far to go - the bathroom is steps from the bed.");
    // s("She doesn't stop to close the door, and her pee begins flowing in a waterfall even before she sits on the toilet.  Her legs are open towards you and she's bent slightly forward, letting her firm breasts hang down.");
    // s("The hissing is loud, and even from the bed you can smell a slight fragrance from the hot pee she held just for you.");
    // s("You stare at the stream as it cascades from her crotch for nearly a minute, and you start to feel yourself getting hard again....");
    timeheld = thetime - lastpeetime;
    cListenerGen([gameWon, "Continue..."], "gameWon");
    c("gamewon", "Continue...");
}