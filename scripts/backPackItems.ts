import { printList, printListSelection, printAllChoicesList, callChoice, sayText, c, cListener, cListenerGenList, addListenersList, addSayText, addGirlTalk, formatAllVarsList, fetchJson, setText, handleFlirt } from './quotes';
import { randomchoice, pickrandom, randomIndex, formatAll } from './shims';
import { peein, displayneed, displayholdquip, indepee, showneed } from './bladder';
import { ypeein } from './yourbladder';
import { openPopUp } from './pop-up';
import { sellPanties } from './locations/theBar';
import { flirtBarGirl } from './locations/theClub';
import { assertExists } from './helperFiles/helperFunctions';
import { gameState } from './gameState/gameState';
import { BladderState } from './gameState/bladderState';

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
export const noItemLoc = ["start2", "beachsex", "tubsex", "pnorestroom", "theBedroom"]

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
        backpackitem.addEventListener("click", function (e) {
            const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-select-item]");
            if (btn) selectitem(btn.dataset.selectItem!);
        });
    } else {
        backpackitem.innerHTML = "<b>Your backpack is empty :(</b>";
    }
    openPopUp();
    itemtext = document.GetRequiredElementById<HTMLElement>("item-text");
    itemtext.innerHTML = "";
}

const WET_PANTIES_QUOTE_INDEX = 3; // bartender reacts to wet panties on this quote

export function buyItem(item){
    const obj = backPackItems[item];
    let value = 1;
    let price = obj.price ?? 0;
    const html = objQuotes["buyItem"].join("")
        .formatVars()
        .replace(/{item}/g, item)
        .replace(/{itemDisplay}/g, displaypos(obj, value, true))
        .replace(/{price}/g, price.toString());
    setText([html]);

    const listenerList: any[] = [];
    addVenueSpecificContent(item, listenerList);
    setupBuyFormListeners(item, obj, value, price, listenerList);
}

/** Add bar/club-specific quotes and extra options to the buy screen. */
function addVenueSpecificContent(item: string, listenerList: any[]): void {
    if (item === "beer") {
        const i = randomIndex(bar["barQuotes"]);
        document.GetRequiredElementById<HTMLElement>("addQuote").innerHTML = bar["barQuotes"][i].formatVars();
        if (haveItem("wetPanties") && i === WET_PANTIES_QUOTE_INDEX) {
            document.GetRequiredElementById<HTMLElement>("extraList").innerHTML = "<li class='cListener' id=sellPanties>Sell wet panties to the bartender.</li>";
            listenerList.push([[sellPanties, "Sell wet panties to the bartender."], "sellPanties"]);
        }
    } else if (item === "cocktail") {
        document.GetRequiredElementById<HTMLElement>("preQuote").innerHTML = pickrandom(club["barGirlDesc"]);
        document.GetRequiredElementById<HTMLElement>("addQuote").innerHTML = pickrandom(club["barGirlQuotes"]);
        document.GetRequiredElementById<HTMLElement>("extraList").innerHTML = "<li class='cListener' id=flirtBar>Flirt with the bar girl.</li>";
        listenerList.push([[flirtBarGirl, "Flirt with the bar girl."], "flirtBar"]);
    }
}

/** Wire up the quantity input, buy button, and form submit for the buy screen. */
function setupBuyFormListeners(item: string, obj, value: number, price: number, listenerList: any[]): void {
    const itemElem = document.GetRequiredElementById<HTMLInputElement>(item + "Am");
    itemElem.addEventListener("input", function () {
        value = parseInt(itemElem.value);
        price = value * (obj.price ?? 0);
        document.GetRequiredElementById<HTMLElement>("itemIndic").innerText = displaypos(obj, value, true);
        const moneyElem = document.GetRequiredElementById<HTMLElement>("monAmount");
        moneyElem.innerText = price < 0 ? "NaN" : price.toString();
    });
    listenerList.push([[function () {
        buyItem2(item, value, price);
    }], "buy", false]);
    const form = document.GetRequiredElementById<HTMLElement>("buy" + item);
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

const MAX_BRIBE_LEVEL = 9;

export function giveHer(item){
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    const obj = backPackItems[item];
    obj.value -= 1;
    const quotes = formatAllVarsList(assertExists(obj.giveQuotes, `Item '${item}' is missing giveQuotes`));
    let curtext = printList([], quotes[0]);
    const listenerList: any[] = [];

    if (item === "sexyPanties") {
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
    } else if (gameState.Companion.bladderState < BladderState.Emergency) {
        curtext = printList(curtext, quotes[1]);
        attraction += obj.attr ?? 0;
        if (item === "earrings") {
            // Giving earrings raises the chance she holds it when you ask when desperate.
            bribeAskBase = Math.min(bribeAskBase + 1, MAX_BRIBE_LEVEL);
            bribeaskthresh = bribeAskBase;
        }
    } else {
        // She's past emergency — less grateful, but will hold it longer
        curtext = printList(curtext, quotes[2]);
        attraction += obj.emerAttr ?? 0;
        askholditcounter += obj.holdCount ?? 0;
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
            let curString = "<button class=\"itembtn\" id=\"";
            curString += obj[i];
            curString += "\" data-select-item=\"" + obj[i] + "\">";
            curString += curobj.bpName;
            curString += "</button> \n";
            itemlist.push(curString)
        }
    }
    return itemlist;
}

const SELECTED_BG_COLOR = "#4bb6c3";
const SELECTED_TEXT_COLOR = "#e52222";

//When an item is selected in the backpack print the info and related functions
export function selectitem(selecteditem){
    const clickedbtn = document.GetRequiredElementById<HTMLElement>(selecteditem);
    const clickedObj = backPackItems[selecteditem];
    clickedbtn.style.backgroundColor = SELECTED_BG_COLOR;
    clickedbtn.style.color = SELECTED_TEXT_COLOR;
    if (previousbtn)
        previousbtn.removeAttribute("style");
    let html = "<p class='title'>"+ clickedObj.bpName +"</p>";
    if(clickedObj.owned)
        html += "<b><i>You have " + getAmountOwned(clickedObj) + "</i></b><br><br>";
    html += assertExists(clickedObj.description, `Item '${selecteditem}' is missing description`).format([girlname]);
    html += buildItemActions(clickedObj);
    itemtext.innerHTML = html;
    previousbtn = clickedbtn;
}

function buildItemActions(clickedObj): string {
    const canUseItems = !noItemLoc.includes(locStack[0])
        && locStack.length !== 0
        && clickedObj.functions
        && allowItems;
    if (!canUseItems) return "";

    // Item is restricted to specific locations — only show if we're in one
    if (clickedObj.locations)
        return clickedObj.locations.includes(locStack[0])
            ? printAllChoicesList([], clickedObj.functions).join("")
            : "";

    // Item is banned at this location
    if (clickedObj.banLocs?.includes(locStack[0])) return "";

    let html = "";
    const companionPresent = !playOnly.includes(locStack[0]);

    // Companion-targeted actions (give her the item, use on her, etc.)
    if (companionPresent)
        html += printAllChoicesList([], clickedObj.functions).join("");

    // Player-targeted actions
    if (playerbladder && clickedObj.yFunctions) {
        html += printAllChoicesList([], clickedObj.yFunctions).join("");
        if (clickedObj.togFunctions && companionPresent && clickedObj.value > 1)
            html += printAllChoicesList([], clickedObj.togFunctions).join("");
    }
    return html;
}

const CHAMPAGNE_HALF_EMPTY_THRESHOLD = 6;

//Returns text saying how much you own of an item.
export function getAmountOwned(selected) {
    const number = selected.value;
    let description = selected.owned;
    let formatlist = [number.toString()];

    if (selected.bpName === "Champagne") {
        description = formatChampagneOwned(selected, number);
    }

    if (number > 1) {
        formatlist.push(description.includes("glass") ? "es" : "s");
    } else {
        formatlist.push("");
    }
    description = description.format(formatlist);
    return description;
}

function formatChampagneOwned(selected, totalBottles: number): string {
    const bottles: number[] = selected.bottles;
    let description = selected.owned;

    // Count leading empty bottles
    let emptyCount = 0;
    while (emptyCount < bottles.length && bottles[emptyCount] === 0) {
        emptyCount++;
    }

    if (bottles[0] === 0) {
        // First bottle is empty — describe empty ones, then any remaining
        description = description.format([
            emptyCount.toString(),
            "empty",
            emptyCount > 1 ? "s" : ""
        ]);

        if (emptyCount < bottles.length) {
            const nextBottle = bottles[emptyCount];
            const isHalfEmpty = nextBottle < CHAMPAGNE_HALF_EMPTY_THRESHOLD;
            const hasMoreAfter = emptyCount + 1 < bottles.length;
            const separator = hasMoreAfter ? ", " : " and ";

            if (isHalfEmpty) {
                description += separator + selected.owned;
                description = description.format(["1", "half-empty", ""]);
            }
            if (!isHalfEmpty || hasMoreAfter) {
                description += "and " + selected.owned;
                description = description.format([(totalBottles - emptyCount).toString(), "", ""]);
            }
        }
    } else if (bottles[0] < CHAMPAGNE_HALF_EMPTY_THRESHOLD) {
        // First bottle is half-empty
        description = description.format(["1", "half-empty", ""]);
        if (bottles.length > 1) {
            description += "and " + selected.owned;
            description = description.format([(totalBottles - 1).toString(), "", ""]);
        }
    } else {
        // All bottles full — just add empty plural slot
        description = description.format([totalBottles.toString(), ""]);
    }

    return description;
}

type DrinkMode = 'her' | 'you' | 'together';

function doesCompanionRefuseDrink(item: string): boolean {
    return ((tummy > maxtummy && (item !== "beer" || tummy > maxbeer)) && item !== "cocktail") ||
        (attraction < 10 && gameState.Companion.bladderState >= BladderState.Need) ||
        (attraction < 20 && gameState.Companion.bladderState >= BladderState.Emergency);
}

function generateDrinkQuotes(curtext: any[], drink: IBackpackItem, mode: DrinkMode): any[] {
    if (mode !== 'you' && gameState.Companion.bladderState >= BladderState.Emergency && shyness < 90 && brokeice) {
        curtext.push(pickrandom(needs["drinkquote"]));
        const verb = mode === 'her' ? "She drinks the " : "You both drink your ";
        curtext.push(verb + drink.bpName.toLowerCase() + ".");
    } else {
        const customQuoteProp = mode === 'her' ? 'cDrinkQuote' : mode === 'you' ? 'cYouDrinkQuote' : 'cTogDrinkQuote';
        if (drink[customQuoteProp]) {
            if (mode === 'you') {
                curtext = printList(curtext, drink[customQuoteProp]);
            } else {
                curtext = printList(curtext, addGirlTalk(drink[customQuoteProp]));
            }
        } else {
            if (mode === 'you') {
                curtext.push(drink.yDrinkQuote != null ? drink.yDrinkQuote : "<b>YOU: </b>" + drink.drinkQuote);
                curtext.push("You drink the " + drink.bpName.toLowerCase() + ".");
            } else {
                curtext.push(girltalk + drink.drinkQuote);
                const verb = mode === 'her'
                    ? "She drinks the "
                    : "After a toast you both drink your ";
                curtext.push(verb + drink.bpName.toLowerCase() + ".");
            }
        }
    }
    return curtext;
}

function applyDrinkStats(drink: IBackpackItem, mode: DrinkMode) {
    const herDrinks = mode === 'her' || mode === 'together';
    const youDrink = mode === 'you' || mode === 'together';

    if (herDrinks) {
        tummy += drink.volume ?? 0;
        drink.sheDrank = (drink.sheDrank ?? 0) + 1;
        drankbeer += drink.drankBeer ?? 0;
        attraction += drink.attraction ?? 0;
        shyness -= drink.shyness ?? 0;
    }
    if (youDrink) {
        yourtummy += drink.volume ?? 0;
        drink.yDrank = (drink.yDrank ?? 0) + 1;
        ydrankbeer += drink.drankBeer ?? 0;
    }

    drink.value -= mode === 'together' ? 2 : 1;

    const tumIncCap = mode === 'together' ? 1000 : 1250;
    if (drink.tumInc) {
        if (herDrinks && maxtummy < tumIncCap) {
            maxtummy += drink.tumInc;
            maxbeer += drink.tumInc;
        }
        if (youDrink && ymaxtummy < tumIncCap) {
            ymaxtummy += drink.tumInc;
            ymaxbeer += drink.tumInc;
        }
    }
}

function executeDrink(item: string, mode: DrinkMode) {
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    let curtext: any[] = [];
    const drink = backPackItems[item];

    const refused = mode === 'you'
        ? (item !== "cocktail" && (yourtummy > ymaxtummy && yourtummy > ymaxbeer))
        : doesCompanionRefuseDrink(item);

    if (refused) {
        curtext.push(mode === 'you'
            ? "You consider drinking the " + drink.bpName.toLowerCase() + ", but you have drunk way too much already."
            : girltalk + "I just don't feel thirsty right now.");
    } else {
        curtext = generateDrinkQuotes(curtext, drink, mode);
        applyDrinkStats(drink, mode);
    }
    curtext = c([locStack[0], "Continue..."], curtext);
    sayText(curtext);
}

//TODO combine the if statements from dink/beer/cocktail/soda
export function drinkNow(item) {
    executeDrink(item, 'her');
}

export function yDrinkNow(item) {
    executeDrink(item, 'you');
}


export let homeChampagne = 0; //Flag whether champagne has been drunk at her home before (aka whether she needs to get the glasses)

const CHAMPAGNE_VOLUME = 50;
const CHAMPAGNE_GLASSES_REQUIRED = 2;
const CHAMPAGNE_MAX_COUNTER = 6;

function consumeChampagne(bottles: number[] | undefined) {
    champagnecounter += CHAMPAGNE_GLASSES_REQUIRED;
    drankChamp = 0;
    if (bottles) bottles[0] -= CHAMPAGNE_GLASSES_REQUIRED;
}

//TODO turn into JSON
export function champagneNow() {
    const backpackcnt = document.GetRequiredElementById<HTMLElement>("pop-up");
    backpackcnt.style.display = "none";
    const obj = backPackItems.champagne;
    const bottles = obj.bottles;
    let curtext: any[] = [];

    const [champIntro, champFirstTime, champOk, champReluctant, champRefuseIntro, champRefuse] =
        drinklines["champagne"];

    if (locStack[0] === "theHome") {
        curtext = printList(curtext, champIntro);
        if (!homeChampagne) {
            curtext = printList(curtext, champFirstTime);
            homeChampagne = 1;
        }
        curtext = displayneed(curtext);

        if (gameState.Companion.bladderState < BladderState.Emergency) {
            curtext.push(pickrandom(appearance["clothes"][heroutfit]["fillchampok"]));
            consumeChampagne(bottles);
            curtext = printList(curtext, champOk);
        } else if (gameState.Companion.bladderState < BladderState.Lose) {
            curtext.push(girltalk + pickrandom(drinklines["wonderWhy"]));
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChamp"]));
            consumeChampagne(bottles);
            curtext = printList(curtext, champReluctant);
        } else {
            curtext.push(girltalk + pickrandom(drinklines["cantDo"]));
            curtext = printList(curtext, champRefuseIntro);
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChampBad"]));
            champagnecounter = CHAMPAGNE_MAX_COUNTER;
            curtext = printList(curtext, champRefuse);
        }
    } else if (backPackItems["champ-glass"].value >= CHAMPAGNE_GLASSES_REQUIRED) {
        curtext.push("You get out the glasses and champagne and fill up both glasses");
        if (gameState.Companion.bladderState < BladderState.Emergency) {
            curtext.push("She smiles at you before you toast and drink the champagne together.");
        } else {
            curtext.push(girlgasp + "Oh I have to go so bad, but if you want me to drink it, I will.");
        }
        consumeChampagne(bottles);
    } else {
        curtext.push("Unfortunately you don't have any champagne glasses, so you can't drink champagne.");
    }

    if (bottles && bottles[0] === 0) {
        bottles.shift();
        obj.value--;
    }
    tummy += CHAMPAGNE_VOLUME;
    yourtummy += CHAMPAGNE_VOLUME;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

export function drinkTogether(item) {
    executeDrink(item, 'together');
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