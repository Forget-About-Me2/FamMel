import { printList, printListSelection, printAllChoicesList, callChoice, sayText, c, cListener, cListenerGenList, addListenersList, addSayText, addGirlTalk, formatAllVarsList, fetchJson, setText, handleFlirt } from './quotes';
import { randomchoice, pickrandom, randomIndex, formatAll } from './shims';
import { peein, displayneed, displayholdquip, indepee, showneed } from './bladder';
import { ypeein } from './yourbladder';
import { openPopUp } from './pop-up';
import { sellPanties } from './locations/theBar';
import { flirtBarGirl } from './locations/theClub';

export interface IBackpackItem {
    bpName: string;
    price?: number;
    value: number;
    owned?: string;
    attr?: number;
    attrThresh?: number;
    attraction?: number;
    emerAttr?: number;
    holdCount?: number;
    banLocs?: string[];
    functions?: Array<[Function, string]>;
    yFunctions?: Array<[Function, string]>;
    togFunctions?: Array<[Function, string]>;
    locations?: string[];
    options?: string[];
    giveQuotes?: string[][];
    description?: string;
    quote?: string;
    shyness?: number;
    volume?: number;
    sheDrank?: number;
    yDrank?: number;
    drankBeer?: number;
    tumInc?: number;
    drinkQuote?: string;
    cDrinkQuote?: string[];
    cYouDrinkQuote?: string[];
    cTogDrinkQuote?: string[];
    yDrinkQuote?: string;
    bottles?: number[];
    [key: string]: any;
}

export interface IDrink extends IBackpackItem
{
    bottles?: number[];
    alhocolVolume: number; // TODO rename
    tumInc: number;
    drinkQuote?: string;
    cDrinkQuote?: string[];
    cYouDrinkQuote?: string[];
    cTogDrinkQuote?: string[];
    yDrinkQuote?: string;
    volume: number;
}

export interface IContainer extends IBackpackItem{
    volume?: number;
    peed?: number;
}

//TODO add keys and phone
export const backPackItems: { [key: string]: IBackpackItem } = {
    "water": {
        bpName: "Water bottle",
        price: 10,
        value: 0,
        owned: "{0} bottle{1} of water",
        volume: 250,
        sheDrank: 0,
        yDrank: 0,
        attr: 0,
        attrThresh: 0,
        attraction: 0,
        emerAttr: 0,
        holdCount: 0,
        alhocolVolume: 0,
        tumInc: 0,
        banLocs: [],
        functions: [
            [function (){
             drinkNow("water");
            }, "Give her a drink of water"]
        ]
    } as IDrink,
    "roses": {
        bpName: "Bouquet",
        price: 20,
        value: 0,
        owned: "{0} bouquet{1} of roses",
        emerAttr: 2,
        holdCount: 2,
        attr: 7,
        banLocs: ["theHotTub"],
        attraction: 0,
        attrThresh: 0,
        volume: 0,
        sheDrank: 0,
        yDrank: 0,
        functions: [
            [function (){
            giveHer("roses");
            }, "Give her a bouquet of roses"]
        ]
    },
    earrings: {
        bpName: "Earrings",
        price: 60,
        value: 0,
        owned: "{0} pair{1} of earrings",
        banLocs: ["theHotTub"],
        emerAttr: 4,
        holdCount: 4,
        attr: 14,
        functions: [
            [function () {
                giveHer("earrings");
            }, "Give her a pair of earrings"]
        ],
        giveQuotes: [
            ["You produce the earrings, offering them to her."],
            ["girltalk Oh! Those are beautiful. These are perfect! How did you know!?"],
            ["girltalk Thanks for the earrings, they are beautiful, but I'm bursting",
                "She takes the earrings from you, crossing her legs tightly."
            ]
        ],
        description: "Ooh shiny! {0} surely will love these. Giving these might make her more open to certain things."
    },
    vase: {
        bpName: "Vase",
        price: 30,
        value: 0,
        volume: 1500,
        peed: 0,
        functions: [
            [function () {
                peein("vase");
            }, "Suggests she pees into the vase."]
        ],
        yFunctions: [
            [function () {
                ypeein("vase");
            }, "Pee into the vase."]
        ],
        banLocs: ["drinkinggame", "theHotTub"],
        quote: "peevasequote",
        owned: "{0} vase{1}",
        description: "You're not quite sure how you managed to fit this in your backpack," +
            " but it can hold an insane amount of liquid. You wonder if it's bigger on the inside."
    } as IContainer,
    shotglass: {
        bpName: "Shotglass",
        price: 10,
        value: 0,
        volume: 100,
        peed: 0,
        functions: [
            [function () {
                peein("shotglass");
            }, "Suggests she pees into the shot glass."]
        ],
        yFunctions: [
            [function () {
                ypeein("shotglass");
            }, "Pee into the shot glass."]
        ],
        banLocs: ["drinkinggame", "theHotTub"],
        quote: "peeshotquote",
        owned: "{0} shotglass{1}",
        description: "You can't quite recall why you thought it was a good idea to bring this glass to your date. " +
            "It can hold about 100ml, maybe it will be of use?"
    } as IContainer,
    ptowels: {
        bpName: "Paper Towels",
        price: 10,
        value: 0,
        volume: 200,
        peed: 0,
        attrThresh: 50,
        attraction: 5,
        functions: [
            [function () {
                peein("ptowels");
            }, "Suggests she pees into the paper towels."]
        ],
        //TODO figure out how a scene where you pee into the towels works (yk male)
        // "yfunctions":[
        //     ["ypeein(&quot;ptowels&quot;)", "Pee into the paper towels."]
        // ],
        banLocs: ["drinkinggame", "theHotTub"],
        quote: "peetowelquote",
        giveQuotes: [[
            "girltalk Thanks",
            "She wipes the pee from her legs and pussy."
        ]],
        owned: "{0} roll{1} of paper towels",
        description: "One should always have paper towels handy."
    } as IContainer,
    sexyPanties: {
        bpName: "Sexy panties",
        price: 30,
        value: 0,
        giveQuotes: [
            ["girltalk Where did you get those?",
                "She slips into the clean panties with a smile."
            ],
            ["Her still dripping pussy dampens the crotch of the new panties"]],
        owned: "{0} pair{1} of sexy panties",
        description: "Whoo, someone's feeling a bit ambitious, aren't they?"
    },
    wetPanties: {
        bpName: "Wet Panties",
        value: 0,
        owned: "{0} pair{1} of wet panties",
        description: "The panties {0} gave you after wetting herself."
    },
    champagne: {
        bpName: "Champagne",
        price: 50,
        value: 0,
        volume: 50,
        alhocolVolume: 10,
        tumInc: 50,
        owned: "{0} {1} bottle{2} of champagne",
        options: [
            "half-empty ",
            "empty "
        ],
        functions: [
            [function () {
                champagneNow();
            }, "Offer her champagne."]
        ],
        //Each bottle you buy is represented as a number indicating how much uses it has left
        bottles: [],
        locations: ["theHome"],
        description: "Some nice champagne, maybe you can share it with {0}? " +
            "If you give it at the right moment, she'll probably be more willing to take things further."
    } as IDrink,
    "champ-glass": {
        bpName: "Champagne glass",
        price: 12,
        value: 0,
        volume: 180,
        peed: 0,
        attraction: 15,
        functions: [
            [function () {
                peein("champ-glass");
            }, "Suggests she pees into the champagne glass."]
        ],
        yFunctions: [
            [function () {
                ypeein("champ-glass");
            }, "Pee in the champagne glass."]
        ],
        banLocs: ["drinkinggame", "theHotTub"],
        quote: "peechampquote",
        owned: "{0} champagne glass{1}",
        description: "A standard champagne glass, can hold 180ml. Maybe use it to share some champagne with {0}"
    } as IContainer,
    beer: {
        bpName: "Beer",
        price: 3,
        value: 0,
        owned: "{0} bottle{1} of beer",
        volume: 250,
        alhocolVolume: 30,
        tumInc: 0,
        shyness: 5,
        functions: [
            [function () {
                drinkNow("beer");
            }, "Offer her a beer"]
        ],
        togFunctions: [
            [function () {
                drinkTogether("beer");
            }, "Offer to drink beer together."]],
        yFunctions: [
            [function () {
                yDrinkNow("beer");
            }, "Drink a beer."]
        ],
        banLocs: ["drinkinggame"],
        drinkQuote: "Bottoms up!.",
        description: "Beer is the route to every woman's heart. Or at least to the toilet."
    } as IDrink,
    soda: {
        bpName: "Soda",
        owned: "{0} cup{1} of soda",
        price: 5,
        value: 0,
        volume: 500,
        yDrank: 0,
        alhocolVolume: 0,
        tumInc: 0,
        functions: [
            [function () {
                drinkNow("soda");
            }, "Give her a soda"]
        ],
        togFunctions: [
            [function () {
                drinkTogether("soda");
            }, "Drink a soda with her."]],
        yFunctions: [
            [function () {
                yDrinkNow("soda");
            }, "Drink a soda."]
        ],
        //TODO deal with the difference in pronouns more efficiently
        cDrinkQuote: [
            "She chugs the cup of soda.  All 500ml.",
            "{0} That was refreshing!"
        ],
        cYouDrinkQuote: [
            "You chug the cup of soda.  All 500ml.",
            "<b>YOU:</b> That was refreshing!"
        ],
        cTogDrinkQuote: [
            "You both chug your cup of soda. All 500ml.",
            "{0} That was refreshing!"
        ],
        description: "A nice big cup of soda is all you need to stay hydrated."
    } as IDrink,
    cocktail: {
        bpName: "Cocktail",
        owned: "{0} cocktail glass{1}",
        value: 0,
        price: 9,
        volume: 150,
        alhocolVolume: 50,
        shyness: 10,
        tumInc: 100,
        functions: [
            [function () {
                drinkNow("cocktail");
            }, "Give her a cocktail."]
        ],
        togFunctions: [
            [function () {
                drinkTogether("cocktail");
            }, "Drink a cocktail with her."]],
        yFunctions: [
            [function () {
                yDrinkNow("cocktail");
            }, "Drink a cocktail."]
        ],
        drinkQuote: "Cheers.",
        description: "Hmmm, alcohol."
    } as IDrink,
    theBarKey: {
        bpName: "Bar Key",
        value: 0,
        description: "Key to the bar."
    },
    theClubKey: {
        bpName: "Club Key",
        value: 0,
        description: "Key to the club."
    },
    theTheatreKey: {
        bpName: "Theatre key",
        value: 0,
        description: "Key to the Movie Theatre."
    },
    herKeys: {
        bpName: "Set of Keys",
        value: 0,
        description: "{0}'s keys which you stole earlier, maybe you should give them back?"
    },
    herPhone: {
        bpName: " A cellphone",
        value: 0,
        description: "{0}'s phone you stole earlier, maybe you can crack the passcode or " +
            "make some nice pictures?"
    }
}

export const herpurse = {
    "herKeys": {
        "desc": "set of keys",
        "funDesc": "her keys"
    },
    "herPhone": {
        "desc": "smartphone",
        "funDesc": "her smartphone"
    },
    "makeup": {
        "desc":"compact makeup kit"
    },
    "comb": {
        "desc":"comb"
    }
}

//List of locations where there is never an opportunity to use an item
export const noItemLoc = ["start2", "beachsex", "tubsex", "pnorestroom", "thebed"]

//List of locations where just the playerrelated options work
export const playOnly = ["yourhome", "gostore", "callher"]

//Locations where drinkitems can be used
//This isn't used, but it's a handy list, might be useful for later
export const drinkLoc = ["pickup", "driveout", "domovie",
    "thebar", "theclub", "themakeout", "thewalk", "thebeach", "theyard",
    "thehottub", "darkmovie", "photogame", "drinkinggame", "thehome"]

export let allowItems= 1; //Are you currently allowed to use items?

//TODO add a mention need option
// standobjs function allows one to use the normal objects.
export function standobjs(curtext: any[], listenerList: any[] = []) {
    if (randomchoice(5) && gottagoflag < 1 && showedneed > 0 && !askholditcounter)
        curtext = c(["askpee", "Ask her if she has to pee."], curtext);
    if (flirtedflag < maxflirts && noflirtflag < 1)
        listenerList = handleFlirt(listenerList);
    if (gottagoflag < 1 && askholditcounter)
        curtext = c(["askcanhold", "You ask her how she's doing."],curtext);
    return curtext;
}

export let previousbtn;
export let itemtext;
export function backpack(){
    if (!objQuotes){
        fetchJson("objects").then(function (data) {
            objQuotes = data;
            objQuotes["buyItem2"] = formatAllVarsList(objQuotes["buyItem2"]);
            backpack();
        });
        return;
    }
    const popUpCnt = document.GetRequiredElementById<HTMLElement>("pop-up-text");
    document.GetRequiredElementById<HTMLElement>("pop-up-title").innerText = "backpack";
    popUpCnt.innerHTML = "";
    objQuotes["backpack"].forEach(item => popUpCnt.innerHTML += item);
    let itemlist = createItemButtonList();
    let items = "";
    const backpackitem = document.GetRequiredElementById<HTMLElement>("backpackitems");
    if (itemlist.length > 0) {
        itemlist.forEach(item => items += item);
        backpackitem.innerHTML = items;
    } else {
        backpackitem.innerHTML = "<b>Your backpack is empty :(</b>";
    }
    openPopUp();
    itemtext = document.GetRequiredElementById<HTMLElement>("item-text");
    itemtext.innerHTML = "";
}

export function buyItem(item){
    let html = printList([], objQuotes["buyItem"]);
    let formatList = [[item],[], []];
    let temp = [item, item];
    let obj = backPackItems[item];
    let value = 1;
    let price = obj.price ?? 0;
    temp.push(displaypos(obj, value, true));
    formatList.push(temp);
    formatList.push([price]);
    formatList.push([]);
    formatList.push([]);
    formatList.push([]);
    html = formatAll(html, formatList);
    setText(html);
    const itemElem = document.GetRequiredElementById<HTMLInputElement>(item+"Am");
    let listenerList: any[] = [];
    if (item === "beer"){
        const i = randomIndex(bar["barQuotes"]);
        document.GetRequiredElementById<HTMLElement>("addQuote").innerHTML = bar["barQuotes"][i].formatVars();
        if (haveItem("wetPanties") && i === 3) {
            document.GetRequiredElementById<HTMLElement>("extraList").innerHTML= "<li class='cListener' id=sellPanties>Sell wet panties to the bartender.</li>";
            listenerList.push([[sellPanties, "Sell wet panties to the bartender."], "sellPanties"]);
        }
    } else if (item === "cocktail"){
        document.GetRequiredElementById<HTMLElement>("preQuote").innerHTML = pickrandom(club["barGirlDesc"]);
        document.GetRequiredElementById<HTMLElement>("addQuote").innerHTML= pickrandom(club["barGirlQuotes"]);
        document.GetRequiredElementById<HTMLElement>("extraList").innerHTML= "<li class='cListener' id=flirtBar>Flirt with the bar girl.</li>";
        listenerList.push([[flirtBarGirl, "Flirt with the bar girl."], "flirtBar"]);
    }
    itemElem.addEventListener("input", function () {
        value = parseInt(itemElem.value);
        price = value * (obj.price ?? 0);
        const itemIndic = document.GetRequiredElementById<HTMLElement>("itemIndic");
        itemIndic.innerText = displaypos(obj, value, true);
        const moneyElem = document.GetRequiredElementById<HTMLElement>("monAmount");
        if (price < 0)
            moneyElem.innerText = "NaN";
        else
            moneyElem.innerText = price.toString();
    });
    listenerList.push([[function(){
        buyItem2(item, value, price);
    }], "buy", false]);
    let form = document.GetRequiredElementById<HTMLElement>("buy"+item);
    form.onsubmit = function (event) {
        event.preventDefault();
        buyItem2(item, value, price);
    };
    addListenersList(listenerList);
}

export function buyItem2(item, value, price){
    let curtext: any[] = [];
    let listenerList: any[] = [];
    let again = function (){
        buyItem(item);
    }
    let choice: any[] = []
    //Check if you have the money to buy as many as you indicated.
    if (money < price){
        curtext = printList(curtext, objQuotes["buyItem2"][0]);
        listenerList.push([[again, "Try again."], "buyItem"]);
        choice = callChoice(["curloc", "Forget it."], choice);
    } else if (price < 0){
        curtext = printList(curtext, objQuotes["buyItem2"][1]);
        listenerList.push([[again, "Try again."], "buyItem"]);
        choice = callChoice(["curloc", "Forget it."], choice);
    } else if (value > 100){
        curtext = printList(curtext, objQuotes["buyItem2"][2]);
        listenerList.push([[again, "Try again."], "buyItem"]);
        choice = callChoice(["curloc", "Forget it."], choice);
    } else {
        if (!playOnly.includes(locStack[0]))
            curtext = printList(curtext, objQuotes["buyItem2"][3]);
        else
            curtext = printList(curtext, objQuotes["buyItem2"][4]);
        money -= price;
        backPackItems[item].value += value;
        choice = callChoice(["curloc", "Continue..."], choice);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
    addSayText(choice); //Adds the option to go back to the current location
    addListenersList(listenerList);  //because of change in html all listeners are reset so re-add them,
}

export function haveItem(item){
    return backPackItems[item].value > 0;
}

// displaypos function prints the given object.
//TODO probably combine with getOwned
export function displaypos(itemobj, number, buy=false) {
    if (typeof number === "undefined")
        number = itemobj.value;
    let description = ""
    if (number > 0){
        if (!buy)
            if (comma > 0) description += ",&nbsp;"
        description += itemobj.owned;
        let formatList: any[] = []
            if (buy)
                formatList.push("");
            else
                formatList.push(number.toString());
        if (number > 1){
            if (description.includes("shotglass")) formatList.push("es");
            else formatList.push("s");
        } else formatList.push("");
        if (itemobj.hasOwnProperty("options")){
            if (champagnecounter > 0){
                if (champagnecounter < 6) formatList.push(itemobj.options[0]);
                else formatList.push(itemobj.options[1]);
            } else if (champagnecounter === 0) formatList.push("");
        }
        description = description.format(formatList);
        comma = 1;
    }
    return description;
}

export function displaydrank(curtext){
    let sentence = " ";
    comma = 0;
    Object.keys(backPackItems).forEach(item => sentence += displayDrankItem(item));
    if (sentence.length > 1){
        curtext.push(girltalk + "I drank " + sentence + " " + pickrandom(needs["drankburst"]));
    }
    return curtext;
}

export function displayDrankItem(item){
    const backpackItem = backPackItems[item];
    if (backpackItem && backpackItem.hasOwnProperty("sheDrank")){
        return displaypos(backpackItem, backpackItem.sheDrank);
    }
    return ""
}

//TODO combine bribeRoses and bribEarrings
export function briberoses() {
    let curtext: any[] = [];
    curtext = printList(curtext, needs["briberoses"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    backPackItems.roses.value -= 1;
    sayText(curtext);
}

export function bribeearrings() {
    let curtext: any[] = [];
    curtext = printList(curtext, needs["bribeearrings"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    backPackItems.earrings.value -= 1;
    sayText(curtext);
}

export function holdpurse() {
    haveherpurse = 1;
    let curtext = printListSelection([], needs["holdpurse"], [0,1]);
    let listenerList = [
        [[lookinsidepurse, needs["choices"]["lookInsidePurse"]], "lookInsidePurse"],
        [[indepee, needs["choices"]["gentleman"]], "gentleman"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function lookinsidepurse() {
    let curtext: any[] = [];
    curtext.push(needs["holdpurse"][2]);
    let tempstring = "A ";
    let first = false;
    let keys = Object.keys(herpurse);
    for (let i = 0; i < keys.length; i++){
        const item = herpurse[keys[i]];
        if (!item.hasOwnProperty("funDesc") || !haveItem(keys[i])) {
            if (!first) {
                tempstring += item["desc"];
                first = true;
            } else if (i === keys.length - 1) {
                tempstring += " and a " + item["desc"];
            } else {
                tempstring += ", a " + item["desc"];
            }
        }
    }

    curtext.push(tempstring);
    var listenerList: any[] = [];
    keys.forEach(key => {
            const item = herpurse[key];
            if ("funDesc" in item && !haveItem(key))
                listenerList.push([[function () {
                    takeHerItem(key);
                }, "Take " + item.funDesc], "takeHer" + key]);
    });
    listenerList.push([[indepee, needs["choices"]["closePurse"]], "closePurse"])
    sayText(curtext);
    cListenerGenList(listenerList);
}

//You steal the given item from her purse
export function takeHerItem(item){
    let curtext: any[] = [];
    curtext.push(needs["holdpurse"][3].format([herpurse[item].funDesc]));
    backPackItems[item].value += 1;
    let listenerList =[
        [[lookinsidepurse, needs["choices"]["lookAgain"]], "lookAgain"],
        [[indepee, "Continue..."], "indepee"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);

}

export function giveHer(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let obj = backPackItems[item];
    obj.value -= 1;
    let quotes = formatAllVarsList(obj.giveQuotes ?? []);
    let curtext = printList([], quotes[0]);
    let listenerList: any[] = [];
    if (item === "sexyPanties"){
        pantycolor = "sexy";
        if (!wetlegs) attraction += 5;
        else curtext = printList(curtext, quotes[1]);
    } else if (item === "ptowels") {
        wetlegs = 0;
        if (haveItem("sexyPanties")) {
            listenerList.push([[function () {
                giveHer("sexyPanties");
            }, "Offer her a clean pair of panties."], "oPanties"]);
        }
    } else {
        if (bladder < blademer) {
            curtext = printList(curtext, quotes[1]);
            attraction += obj.attr ?? 0;
            if (item === "earrings"){
                //Giving earrings increases the chance she will hold it when desperate and you just ask.
                // Up to a maximum of 90%
                bribeAskBase += 1;
                if (bribeAskBase > 9) bribeAskBase = 9;
                bribeaskthresh = bribeAskBase;
            }
        } else {
            curtext = printList(curtext, quotes[2]);
            attraction += obj.emerAttr ?? 0;
            askholditcounter += obj.holdCount ?? 0;
        }
    }
    attraction += obj.attraction ?? 0;
    sayText(curtext);
    listenerList.forEach(item => cListener(item[0], item[1]));
    curtext = callChoice(["curloc", "Continue..."] );
    addSayText(curtext);
    addListenersList(listenerList);
}

export function createItemButtonList(){
    const obj = Object.keys(backPackItems);
    let itemlist: any[] = [];
    for (let i =0; i< obj.length; i++) {
        const curobj = backPackItems[obj[i]];
        if (curobj.value !== 0) {
            const baseString = "<button onclick=\"selectitem('";
            let curString = baseString + obj[i];
            curString += "')\" class=\"itembtn\" id=\"";
            curString += obj[i];
            curString += "\">";
            curString += curobj.bpName;
            curString += "</button> \n";
            itemlist.push(curString)
        }
    }
    return itemlist;
}

//When an item is selected in the backpack print the info and related functions
export function selectitem(selecteditem){
    const clickedbtn = document.GetRequiredElementById<HTMLElement>(selecteditem);
    const clickedObj = backPackItems[selecteditem];
    clickedbtn.style.backgroundColor = "#4bb6c3";
    clickedbtn.style.color = "#e52222";
    if (previousbtn)
        previousbtn.removeAttribute("style");
    let tobeprinted = "<p class='title'>"+ clickedObj.bpName +"</p>";
    if(clickedObj.owned)
        tobeprinted += "<b><i>You have " + getAmountOwned(clickedObj) + "</i></b><br><br>";
    tobeprinted += (clickedObj.description ?? "").format([girlname]);
    if (!noItemLoc.includes(locStack[0]) && locStack.length !== 0 && clickedObj.functions && allowItems){
        if (!clickedObj.locations && !clickedObj.banLocs?.includes(locStack[0])){
            //If the girl isn't with you, you can't ask her to use a certain item
            if (!playOnly.includes(locStack[0]))
                printAllChoicesList([], clickedObj.functions).forEach(item => tobeprinted += item);
            if (playerbladder && clickedObj.yFunctions){
                printAllChoicesList([], clickedObj.yFunctions).forEach(item => tobeprinted += item);
                if (clickedObj.togFunctions && !playOnly.includes(locStack[0]) && clickedObj.value > 1)
                    printAllChoicesList([], clickedObj.togFunctions).forEach(item => tobeprinted += item);
            }
        } else if (clickedObj.locations?.includes(locStack[0]))
            printAllChoicesList([], clickedObj.functions).forEach(item => tobeprinted += item);
    }
    itemtext.innerHTML= tobeprinted;
    previousbtn = clickedbtn;
}

//Returns text saying how much you own of an item.
export function getAmountOwned(selected) {
    let number = selected.value;
    let description = selected.owned
    let formatlist = [number.toString()];
    if (selected.bpName === "Champagne"){
        if (selected.bottles[0] === 0){
            let i = 0;
            while (i < selected.bottles.length && selected.bottles[i] === 0) {
                i++;
            }
            formatlist = [i.toString(), "empty"];
            if (i > 1) formatlist.push("s");
            else formatlist.push("");
            description = description.format(formatlist);
            if (i < selected.bottles.length) {
                let full = true;
                if (selected.bottles[i] < 6) {
                    let inbetween = " and "
                    if (i + 1 < selected.bottles.length) inbetween = ", ";
                    else full = false;
                    description += inbetween + selected.owned;
                    description = description.format(["1", "half-empty", ""]);
                } if (full) {
                    description += "and " + selected.owned;
                    formatlist = [(number - i).toString(), ""];
                }

            }
        } else if(selected.bottles[0] < 6) {
            description = description.format(["1", "half-empty", ""]);
            if (selected.bottles.length > 1) {
                description += "and " + selected.owned;
                formatlist = [(number - 1).toString(), ""];
            }
        } else {
            formatlist.push("");
        }
    }
    if (number > 1){
        if (description.includes("glass")) formatlist.push("es");
        else formatlist.push("s");
    } else formatlist.push("");
    description = description.format(formatlist);
    return description;
}

//TODO combine the if statements from dink/beer/cocktail/soda
export function drinkNow(item) {
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let curtext: any[] = [];
    if (((tummy > maxtummy && (item !== "beer"|| tummy > maxbeer)) && item !== "cocktail")||
        (attraction < 10 && bladder > bladneed) ||
        (attraction < 20 && bladder > blademer)) {
        curtext.push(girltalk + "I just don't feel thirsty right now.");
    } else {
        let drink = backPackItems[item];
        if (bladder > blademer && shyness < 90 && brokeice) {
            curtext.push(pickrandom(needs["drinkquote"]));
            curtext.push("She drinks the " + (drink.bpName.toLowerCase()) + ".");
        } else {
            if (drink.cDrinkQuote) {
                curtext = printList(curtext, addGirlTalk(drink.cDrinkQuote));
            } else {
                curtext.push(girltalk + drink.drinkQuote);
                curtext.push("She drinks the " + drink.bpName.toLowerCase() + ".");
            }
        }
        tummy += drink.volume ?? 0;
        drink.value -= 1;
        drink.sheDrank = (drink.sheDrank ?? 0) + 1;
        drankbeer += drink.drankBeer ?? 0;
        attraction += drink.attraction ?? 0;
        shyness -= drink.shyness ?? 0;
        if (drink.tumInc && maxtummy < 1250) {
            maxtummy += drink.tumInc;
            maxbeer += drink.tumInc;
        }
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function yDrinkNow(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let drink = backPackItems[item];
    let curtext: any[] = [];
    if (item !== "cocktail" && (yourtummy > ymaxtummy && yourtummy > ymaxbeer)){
        curtext.push("You consider drinking the " + drink.bpName.toLowerCase() + ", but you have drunk way too much already.");
    } else {
        if (drink.cYouDrinkQuote) {
            curtext = printList(curtext, drink.cYouDrinkQuote);
        } else {
            if (drink.hasOwnProperty("yDrinkQuote"))
                curtext.push(drink.yDrinkQuote);
            else
                curtext.push("<b>YOU: </b>" + drink.drinkQuote);
            curtext.push("You drink the " + drink.bpName.toLowerCase() + ".");
        }
        yourtummy += drink.volume ?? 0;
        drink.value -= 1;
        drink.yDrank = (drink.yDrank ?? 0) + 1;
        ydrankbeer += drink.drankBeer ?? 0;
        if (drink.tumInc && ymaxtummy < 1250) {
            ymaxtummy += drink.tumInc;
            ymaxbeer += drink.tumInc;
        }
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export let homeChampagne = 0; //Flag whether champagne has been drunk at her home before (aka whether she needs to get the glasses)
//TODO turn into JSON
export function champagneNow() {
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let obj = backPackItems.champagne;
    const bottles = obj.bottles;
    let curtext: any[] = [];
    if (locStack[0] === "theHome"){
        curtext = printList(curtext, drinklines["champagne"][0]);
        if (!homeChampagne){
            curtext = printList(curtext, drinklines["champagne"][1]);
            homeChampagne = 1;
        }
        curtext = displayneed(curtext);
        if (bladder < blademer) {
            curtext.push(pickrandom(appearance["clothes"][heroutfit]["fillchampok"]));
            champagnecounter += 2;
            drankChamp = 0;
            if (bottles) bottles[0] -= 2;
            curtext = printList(curtext, drinklines["champagne"][2]);
        } else if (bladder < bladlose){
            curtext.push(girltalk + pickrandom(drinklines["wonderWhy"]));
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChamp"]));
            champagnecounter += 2;
            drankChamp = 0;
            if (bottles) bottles[0] -= 2;
            curtext= printList(curtext, drinklines["champagne"][3]);
        } else {
            curtext.push(girltalk + pickrandom(drinklines["cantDo"]));
            curtext = printList(curtext, drinklines["champagne"][4]);
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChampBad"]));
            champagnecounter = 6;
            curtext = printList(curtext, drinklines["champagne"][5]);
        }
    } else if (backPackItems["champ-glass"].value >= 2) {
        curtext.push("You get out the glasses and champagne and fill up both glasses");
        if (bladder < blademer){
            curtext.push("She smiles at you before you toast and drink the champagne together.")
        } else {
            curtext.push(girlgasp + "Oh I have to go so bad, but if you want me to drink it, I will.");
        }
        champagnecounter+=2;
        drankChamp = 0;
        if (bottles) bottles[0] -= 2;
    } else {
        curtext.push("Unfortunately you don't have any champagne glasses, so you can't drink champagne.");
    }
    if (bottles && bottles[0] === 0) {
        bottles.shift();
        obj.value--;
    }
    tummy += 50;
    yourtummy += 50;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function drinkTogether(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let curtext: any[] = [];
    if (((tummy > maxtummy && (item !== "beer"|| tummy > maxbeer)) && item !== "cocktail")||
        (attraction < 10 && bladder > bladneed) ||
        (attraction < 20 && bladder > blademer)) {
        curtext.push(girltalk + "I just don't feel thirsty right now.");
    } else {
        let drink = backPackItems[item];
        if (bladder > blademer && shyness < 90 && brokeice) {
            curtext.push(pickrandom(needs["drinkquote"]));
            curtext.push("You both drink your " + (drink.bpName.toLowerCase()) + ".");
        } else {
            if (drink.cTogDrinkQuote) {
                curtext = printList(curtext, addGirlTalk(drink.cTogDrinkQuote));
            } else {
                curtext.push(girltalk + drink.drinkQuote);
                curtext.push("After a toast you both drink your " + drink.bpName.toLowerCase() + ".");
            }
        }
        tummy += drink.volume ?? 0;
        yourtummy += drink.volume ?? 0;
        drink.value -= 2;
        drink.sheDrank = (drink.sheDrank ?? 0) + 1;
        drink.yDrank = (drink.yDrank ?? 0) + 1;
        drankbeer += drink.drankBeer ?? 0;
        ydrankbeer += drink.drankBeer ?? 0;
        attraction += drink.attraction ?? 0;
        shyness -= drink.shyness ?? 0;
        if (drink.tumInc) {
            if (maxtummy < 1000) {
                maxtummy += drink.tumInc;
                maxbeer += drink.tumInc;
            }
            if (ymaxtummy < 1000) {
                ymaxtummy += drink.tumInc;
                ymaxbeer += drink.tumInc;
            }
        }
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

export function exposeBackPackItemsOnWindow() {
    const mutableVars: [string, () => any, (v: any) => void][] = [
        ["allowItems", () => allowItems, (v) => { allowItems = v; }],
        ["homeChampagne", () => homeChampagne, (v) => { homeChampagne = v; }],
        ["itemtext", () => itemtext, (v) => { itemtext = v; }],
        ["previousbtn", () => previousbtn, (v) => { previousbtn = v; }],
    ];
    for (const [name, getter, setter] of mutableVars) {
        Object.defineProperty(window, name, { get: getter, set: setter, configurable: true });
    }

    Object.assign(window, {
        backPackItems, herpurse, drinkLoc, noItemLoc, playOnly,
        backpack, selectitem, createItemButtonList, standobjs,
        buyItem, buyItem2, giveHer, takeHerItem, holdpurse, lookinsidepurse,
        haveItem, getAmountOwned, displaypos,
        drinkNow, yDrinkNow, drinkTogether, champagneNow,
        displaydrank, displayDrankItem, bribeearrings, briberoses,
    });
}