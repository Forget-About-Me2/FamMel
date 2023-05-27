//TODO add keys and phone
const objects = {
    "water" : {
        "bpname": "Water bottle",
        price : 10,
        "value": 0,
        "owned": "{0} bottle{1} of water",
        "volume": 250,
        "shedrank": 0,
        "ydrank": 0,
        "functions": [
            ['drinknow(&quot;water&quot;)', "Give her a drink of water"]
        ],
        "yfunctions":[
            ['ydrinknow(&quot;water&quot;)', "Drink some water."]
        ],
        "drinkquote": "Well, I guess it's good to stay hydrated.",
        "ydrinkquote": "<b>YOU:</b> It's good to stay hydrated.",
        "description":"This bottle is really quite small. It only contains 250ml, you're not quite sure why you wasted money on this."
    },
    "roses" : {
        "bpname": "Bouquet",
        price: 20,
        "value": 0,
        "owned": "{0} bouquet{1} of roses",
        "emerAttr": 2,
        "holdCount":2,
        "attr": 7,
        banLocs: ["theHotTub"],
        "functions": [
            ['giveHer(&quot;roses&quot;)', "Give her a bouquet of roses"]
        ],
        "giveQuotes":[
            [ "You produce the roses, offering them to her."],
            [ "girltalk Thanks! They're beautiful."],
            [ "girltalk Thanks for the flowers, but I've really got to go",
              "She takes the roses and holds them against her belly."
            ]
        ],
        "description":"It's a nice bouquet, maybe you can give it to {0} to impress her."
    },
    "earrings" : {
        "bpname":"Earrings",
        price: 60,
        "value": 0,
        "owned": "{0} pair{1} of earrings",
        banLocs: ["theHotTub"],
        "emerAttr": 4,
        "holdCount":4,
        "attr": 14,
        "functions": [
            ['giveHer(&quot;earrings&quot;)', "Give her a pair of earrings"]
        ],
        "giveQuotes":[
            [ "You produce the earrings, offering them to her."],
            [ "girltalk Oh! Those are beautiful. These are perfect! How did you know!?"],
            [ "girltalk Thanks for the earrings, they are beautiful, but I'm bursting",
                "She takes the earrings from you, crossing her legs tightly."
            ]
        ],
        "description":"Ooh shiny! {0} surely will love these. Giving these might make her more open to certain things."
    },
    "vase" : {
        "bpname":"Vase",
        price: 30,
        "value": 0,
        "peed": 0,
        "functions": [
            ["peein(&quot;vase&quot;)", "Suggests she pees into the vase."]
        ],
        "yfunctions":[
            ["ypeein(&quot;vase&quot;)", "Pee into the vase."]
        ],
        "banLocs": ["drinkinggame", "theHotTub"],
        "quote": "peevasequote",
        "owned": "{0} vase{1}",
        "description": "You're not quite sure how you managed to fit this in your backpack," +
            " but it can hold an insane amount of liquid. You wonder if it's bigger on the inside."
    },
    "shotglass": {
        "bpname":"Shotglass",
        price: 10,
        "value": 0,
        "volume": 100,
        "peed": 0,
        "functions": [
            ["peein(&quot;shotglass&quot;)", "Suggests she pees into the shot glass."]
        ],
        "yfunctions":[
            ["ypeein(&quot;shotglass&quot;)", "Pee into the shot glass."]
        ],
        "banLocs": ["drinkinggame", "theHotTub"],
        "quote": "peeshotquote",
        "owned": "{0} shotglass{1}",
        "description":"You can't quite recall why you thought it was a good idea to bring this glass to your date. " +
            "It can hold about 100ml, maybe it will be of use?"
    },
    "ptowels": {
        "bpname":"Paper Towels",
        price: 10,
        "value": 0,
        "peed" : 0,
        "attrThresh": 50,
        "attraction": 5,
        "functions": [
            ["peein(&quot;ptowels&quot;)", "Suggests she pees into the paper towels."]
        ],
        //TODO figure out how a scene where you pee into the towels works (yk male)
        // "yfunctions":[
        //     ["ypeein(&quot;ptowels&quot;)", "Pee into the paper towels."]
        // ],
        "banLocs": ["drinkinggame", "theHotTub"],
        "quote": "peetowelquote",
        "giveQuotes":[[
            "girltalk Thanks",
            "She wipes the pee from her legs and pussy."
        ]],
        "owned": "{0} roll{1} of paper towels",
        "description":"One should always have paper towels handy."
    },
    "panties": {
        "bpname":"Sexy panties",
        price: 30,
        "value": 0,
        "giveQuotes": [
            [   "girltalk Where did you get those?",
                "She slips into the clean panties with a smile."
        ],
        ["Her still dripping pussy dampens the crotch of the new panties"]],
        "owned": "{0} pair{1} of sexy panties",
        "description":"Whoo, someone's feeling a bit ambitious, aren't they?"
    },
    "wetPanties": {
        "bpname": "Wet Panties",
        "value": 0,
        "owned": "{0} pair{1} of wet panties",
        "description": "The panties {0} gave you after wetting herself."
    },
    "champagne": {
        "bpname":"Champagne",
        price: 50,
        "value": 0,
        "owned": "{0} {1} bottle{2} of champagne",
        "options": [
            "half-empty ",
            "empty "
        ],
        "functions":[
            ["champagneNow", "Offer her champagne."]
        ],
        //Each bottle you buy is represented as a number indicating how much uses it has left
        "bottles": [],
        "locations": ["theHome"],
        "description": "Some nice champagne, maybe you can share it with {0}? " +
            "If you give it at the right moment, she'll probably be more willing to take things further."
    },
    "champ-glass":{
        "bpname":"Champagne glass",
        price : 12,
        "value": 0,
        "volume": 180,
        "peed": 0,
        "drankbeer":30,
        "attraction": 15,
        "functions": [
            ["peein(&quot;champ-glass&quot;)", "Suggests she pees into the champagne glass."]
        ],
        "yfunctions":[
            ["ypeein(&quot;champ-glass&quot;)", "Pee in the champagne glass."]
        ],
        "banLocs": ["drinkinggame", "theHotTub"],
        "quote": "peechampquote",
        "owned": "{0} champagne glass{1}",
        "description": "A standard champagne glass, can hold 180ml. Maybe use it to share some champagne with {0}"
    },
    "beer":{
        "bpname":"Beer",
        price: 3,
        "value":0,
        "owned": "{0} bottle{1} of beer",
        "volume": 250,
        "shedrank": 0,
        "ydrank": 0,
        "drankbeer":30,
        "shyness": 5,
        "functions": [
            ['drinknow(&quot;beer&quot;)', "Offer her a beer"]
        ],
        "togfunctions": [
            ['drinktogether(&quot;beer&quot;)', "Offer to drink beer together."]],
        "yfunctions":[
            ['ydrinknow(&quot;beer&quot;)', "Drink a beer."]
        ],
        "banLocs": ["drinkinggame"],
        "drinkquote": "Bottoms up!.",
        "description":"Beer is the route to every woman's heart. Or at least to the toilet."
    },
    "soda":{
        "bpname":"Soda",
        "owned": "{0} cup{1} of soda",
        price: 5,
        "value":0,
        "volume": 500,
        "shedrank": 0,
        "ydrank": 0,
        "functions": [
            ['drinknow(&quot;soda&quot;)', "Give her a soda"]
        ],
        "togfunctions": [
            ['drinktogether(&quot;soda&quot;)', "Drink a soda with her."]],
        "yfunctions":[
            ['ydrinknow(&quot;soda&quot;)', "Drink a soda."]
        ],
        //TODO deal with the difference in pronounce more efficiently
        "cdrinkquote": [
            "She chugs the cup of soda.  All 500ml.",
            "{0} That was refreshing!"
        ],
        "cydrinkquote":[
            "You chug the cup of soda.  All 500ml.",
            "<b>YOU:</b> That was refreshing!"
        ],
        "ctdrinkquote":[
            "You both chug your cup of soda. All 500ml.",
            "{0} That was refreshing!"
        ],
        "description":"A nice big cup of soda is all you need to stay hydrated."
    },
    "cocktail":{
        "bpname":"Cocktail",
        "owned": "{0} cocktail glass{1}",
        "value":0,
        price: 9,
        "volume": 150,
        "shedrank": 0,
        "ydrank": 0,
        "drankbeer":50,
        "shyness": 10,
        "tuminc": 100,
        "functions": [
            ['drinknow(&quot;cocktail&quot;)', "Give her a cocktail."]
        ],
        "togfunctions": [
            ['drinktogether(&quot;cocktail&quot;)', "Drink a cocktail with her."]],
        "yfunctions":[
            ['ydrinknow(&quot;cocktail&quot;)', "Drink a cocktail."]
        ],
        "drinkquote": "Cheers.",
        "description":"Hmmm, alcohol."
    },
    "theBarKey":{
        "bpname" : "Bar Key",
        "value" : 0,
        "description": "Key to the bar."
    },
    "theClubKey":{
        "bpname": "Club Key",
        "value": 0,
        "description": "Key to the club."
    },
    "theTheatreKey":{
        "bpname": "Theatre key",
        "value" : 0,
        "description": "Key to the Movie Theatre."
    },
    "herKeys":{
        "bpname": "Set of Keys",
        "value":0,
        "description": "{0}'s keys which you stole earlier, maybe you should give them back?"
    },
    "herPhone":{
        "bpname":" A cellphone",
        "value":0,
        "description": "{0}'s phone you stole earlier, maybe you can crack the passcode or " +
            "make some nice pictures?"
    }
}

const herpurse = {
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
const noItemLoc = ["start2", "beachsex", "tubsex", "pnorestroom", "thebed"]

//List of locations where just the playerrelated options work
const playOnly = ["yourhome", "gostore", "callher"]

//Locations where drinkitems can be used
//This isn't used, but it's a handy list, might be useful for later
const drinkLoc = ["pickup", "driveout", "domovie",
    "thebar", "theclub", "themakeout", "thewalk", "thebeach", "theyard",
    "thehottub", "darkmovie", "photogame", "drinkinggame", "thehome"]

let allowItems= 1; //Are you currently allowed to use items?

//TODO add a mention need option
// standobjs function allows one to use the normal objects.
function standobjs(curtext) {
    if (randomchoice(5) && gottagoflag < 1 && showedneed > 0 && !askholditcounter)
        curtext = c(["askpee", "Ask her if she has to pee."], curtext);
    if (flirtedflag < maxflirts && noflirtflag < 1)
        curtext = handleFlirt(curtext);
    if (gottagoflag < 1 && askholditcounter)
        curtext = c(["askcanhold", "You ask her how she's doing."],curtext);
    return curtext;
}

let previousbtn;
let itemtext;
function backpack(){
    if (!objQuotes){
        getjson("objects", function () {
            objQuotes = json;
            objQuotes["buyItem2"] = formatAllVarsList(objQuotes["buyItem2"]);
            backpack();
        });
        return;
    }
    const popUpCnt = document.getElementById("pop-up-text");
    document.getElementById("pop-up-title").innerText = "backpack";
    popUpCnt.innerHTML = "";
    objQuotes["backpack"].forEach(item => popUpCnt.innerHTML += item);
    let itemlist = createItemButtonList();
    let items = "";
    const backpackitem = document.getElementById("backpackitems");
    if (itemlist.length !== 0) {
        itemlist.forEach(item => items += item);
        backpackitem.innerHTML = items;
    } else {
        backpackitem.innerHTML = "<b>Your backpack is empty :(</b>";
    }
    openPopUp();
    itemtext= document.getElementById("item-text");
    itemtext.innerHTML = "";
}

function buyItem(item){
    let html = printList([], objQuotes["buyItem"]);
    let formatList = [[item],[], []];
    let temp = [item, item];
    let obj = objects[item];
    let value = 1;
    let price = obj.price;
    temp.push(displaypos(obj, value, true));
    formatList.push(temp);
    formatList.push([price]);
    formatList.push([]);
    formatList.push([]);
    formatList.push([]);
    html = formatAll(html, formatList);
    setText(html);
    const itemElem = document.getElementById(item+"Am");
    let listenerList = [];
    if (item === "beer"){
        const i = randomIndex(bar["barQuotes"]);
        document.getElementById("addQuote").innerHTML = bar["barQuotes"][i].formatVars();
        if (haveItem("wetPanties") && i === 3) {
            document.getElementById("extraList").innerHTML= "<li class='cListener' id=sellPanties>Sell wet panties to the bartender.</li>";
            listenerList.push([[sellPanties, "Sell wet panties to the bartender."], "sellPanties"]);
        }
    } else if (item === "cocktail"){
        document.getElementById("preQuote").innerHTML = pickrandom(club["barGirlDesc"]);
        document.getElementById("addQuote").innerHTML= pickrandom(club["barGirlQuotes"]);
        document.getElementById("extraList").innerHTML= "<li class='cListener' id=flirtBar>Flirt with the bar girl.</li>";
        listenerList.push([[flirtBarGirl, "Flirt with the bar girl."], "flirtBar"]);
    }
    itemElem.addEventListener("input", function () {
        value = parseInt(itemElem.value);
        price = value*obj.price;
        const itemIndic = document.getElementById("itemIndic");
        itemIndic.innerText = displaypos(obj, value, true);
        const moneyElem = document.getElementById("monAmount");
        if (price < 0)
            moneyElem.innerText = "NaN";
        else
            moneyElem.innerText = price;
    });
    listenerList.push([[function(){
        buyItem2(item, value, price);
    }], "buy", false]);
    let form = document.getElementById("buy"+item);
    form.onsubmit = function (event) {
        event.preventDefault();
        buyItem2(item, value, price);
    };
    addListenersList(listenerList);
}

function buyItem2(item, value, price){
    let curtext = [];
    let listenerList = [];
    let again = function (){
        buyItem(item);
    }
    let choice = []
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
        if (!playOnly.includes(locstack[0]))
            curtext = printList(curtext, objQuotes["buyItem2"][3]);
        else
            curtext = printList(curtext, objQuotes["buyItem2"][4]);
        money -= price;
        objects[item].value += value;
        choice = callChoice(["curloc", "Continue..."], choice);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
    addSayText(choice); //Adds the option to go back to the current location
    addListenersList(listenerList);  //because of change in html all listeners are reset so re-add them,
}

function haveItem(item){
    return objects[item].value > 0;
}

// displaypos function prints the given object.
//TODO probably combine with getOwned
function displaypos(itemobj, number, buy=false) {
    if (typeof number === "undefined")
        number = itemobj.value;
    let description = ""
    if (number > 0){
        if (!buy)
            if (comma > 0) description += ",&nbsp;"
        description += itemobj.owned;
        let formatList = []
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

function displaydrank(curtext){
    let sentence = " ";
    comma = 0;
    Object.keys(objects).forEach(item => sentence += displayDrankItem(item));
    if (sentence.length > 1){
        curtext.push(girltalk + "I drank " + sentence + " " + pickrandom(needs["drankburst"]));
    }
    return curtext;
}

function displayDrankItem(item){
    if (item.hasOwnProperty("shedrank")){
        return displaypos(item, item.shedrank);
    }
    return ""
}

//TODO combine bribeRoses and bribEarrings
function briberoses() {
    let curtext = [];
    curtext = printList(curtext, needs["briberoses"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    objects.roses.value -= 1;
    sayText(curtext);
}

function bribeearrings() {
    let curtext = [];
    curtext = printList(curtext, needs["bribeearrings"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = callChoice(["curloc", "Continue..."], curtext);
    objects.earrings.value -= 1;
    sayText(curtext);
}

function holdpurse() {
    haveherpurse = 1;
    let curtext = printListSelection([], needs["holdpurse"], [0,1]);
    let listenerList = [
        [[lookinsidepurse, needs["choices"]["lookInsidePurse"]], "lookInsidePurse"],
        [[indepee, needs["choices"]["gentleman"]], "gentleman"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

function lookinsidepurse() {
    let curtext = [];
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
    keys.forEach(key => {
            const item = herpurse[key];
            if ("funDesc" in item && !haveItem(key))
                curtext = c(["takeHerItem(&quot;" + key + "&quot;)", "take " + item.funDesc], curtext);
    });
    sayText(curtext);
    cListener([indepee, needs["choices"]["closePurse"]], "closePurse");
}

//You steal the given item from her purse
function takeHerItem(item){
    let curtext = [];
    curtext.push(needs["holdpurse"][3].format([herpurse[item].funDesc]));
    objects[item].value += 1;
    let listenerList =[
        [[lookinsidepurse, needs["choices"]["lookAgain"]], "lookAgain"],
        [[indepee, "Continue..."], "indepee"]
    ]
    sayText(curtext);
    cListenerGenList(listenerList);

}

function giveHer(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    let obj = objects[item];
    obj.value -= 1;
    let quotes = formatAllVarsList(obj.giveQuotes);
    let curtext = printList([], quotes[0]);
    let listenerList = [];
    if (item === "panties"){
        pantycolor = "sexy";
        if (!wetlegs) attraction += 5;
        else curtext = printList(curtext, quotes[1]);
    } else if (item === "ptowels") {
        wetlegs = 0;
        if (haveItem("panties")) {
            listenerList.push([[function () {
                giveHer("panties");
            }, "Offer her a clean pair of panties."], "oPanties"]);
        }
    } else {
        if (bladder < blademer) {
            curtext = printList(curtext, quotes[1]);
            attraction += obj.attr;
            if (item === "earrings"){
                //Giving earrings increases the chance she will hold it when desperate and you just ask.
                // Up to a maximum of 90%
                bribeAskBase += 1;
                if (bribeAskBase > 9) bribeAskBase = 9;
                bribeaskthresh = bribeAskBase;
            }
        } else {
            curtext = printList(curtext, quotes[2]);
            attraction += obj.emerAttr;
            askholditcounter += obj.holdCount;
        }
    }
    if (obj.hasOwnProperty("attraction")){
        attraction += obj.attraction;
    }
    sayText(curtext);
    listenerList.forEach(item => cListener(item[0], item[1]));
    curtext = callChoice(["curloc", "Continue..."] );
    addSayText(curtext);
    addListenersList(listenerList);
}

function createItemButtonList(){
    const obj = Object.keys(objects);
    let itemlist = [];
    for (let i =0; i< obj.length; i++) {
        const curobj = objects[obj[i]];
        if (curobj.value !== 0) {
            const baseString = "<button onclick=\"selectitem('";
            let curString = baseString + obj[i];
            curString += "')\" class=\"itembtn\" id=\"";
            curString += obj[i];
            curString += "\">";
            curString += curobj.bpname;
            curString += "</button> \n";
            itemlist.push(curString)
        }
    }
    return itemlist;
}

//When an item is selected in the backpack print the info and related functions
function selectitem(selecteditem){
    const clickedbtn = document.getElementById(selecteditem);
    const clickedObj = objects[selecteditem];
    clickedbtn.style.backgroundColor = "#4bb6c3";
    clickedbtn.style.color = "#e52222";
    if (previousbtn)
        previousbtn.removeAttribute("style");
    let tobeprinted = "<p class='title'>"+ clickedObj.bpname +"</p>";
    if(clickedObj.owned)
        tobeprinted += "<b><i>You have " + getAmountOwned(clickedObj) + "</i></b><br><br>";
    tobeprinted += clickedObj.description.format([girlname]);
    if (!noItemLoc.includes(locstack[0]) && locstack.length !== 0 && clickedObj.hasOwnProperty("functions") && allowItems){
        if (!clickedObj.hasOwnProperty("locations") && !(clickedObj.hasOwnProperty("banLocs") && clickedObj.banLocs.includes(locstack[0]))){
            //If the girl isn't with you, you can't ask her to use a certain item
            if (!playOnly.includes(locstack[0]))
                printAllChoicesList([], clickedObj.functions).forEach(item => tobeprinted += item);
            if (playerbladder && clickedObj.hasOwnProperty("yfunctions")){
                printAllChoicesList([], clickedObj.yfunctions).forEach(item => tobeprinted += item);
                if (clickedObj.hasOwnProperty("togfunctions") && !playOnly.includes(locstack[0]) && clickedObj.value > 1)
                    printAllChoicesList([], clickedObj.togfunctions).forEach(item => tobeprinted += item);
            }
        } else if (clickedObj.hasOwnProperty("locations") && clickedObj.locations.includes(locstack[0]))
            printAllChoicesList([], clickedObj.functions).forEach(item => tobeprinted += item);
    }
    itemtext.innerHTML= tobeprinted;
    previousbtn = clickedbtn;
}

//Returns text saying how much you own of an item.
function getAmountOwned(selected) {
    let number = selected.value;
    let description = selected.owned
    let formatlist = [number.toString()];
    if (selected.bpname === "Champagne"){
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
function drinknow(item) {
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    let curtext = [];
    if (((tummy > maxtummy && (item !== "beer"|| tummy > maxbeer)) && item !== "cocktail")||
        (attraction < 10 && bladder > bladneed) ||
        (attraction < 20 && bladder > blademer)) {
        curtext.push(girltalk + "I just don't feel thirsty right now.");
    } else {
        let drink = objects[item];
        if (bladder > blademer && shyness < 90 && brokeice) {
            curtext.push(pickrandom(needs["drinkquote"]));
            curtext.push("She drinks the " + (drink.bpname.toLowerCase()) + ".");
        } else {
            if (drink.hasOwnProperty("cdrinkquote")) {
                curtext = printList(curtext, addGirlTalk(drink.cdrinkquote));
            } else {
                curtext.push(girltalk + drink.drinkquote);
                curtext.push("She drinks the " + drink.bpname.toLowerCase() + ".");
            }
        }
        tummy += drink.volume;
        drink.value -= 1;
        drink.shedrank += 1;
        if (drink.hasOwnProperty("drankbeer")){
            drankbeer += drink.drankbeer;
        }
        if (drink.hasOwnProperty("attraction")){
            attraction += drink.attraction;
        }
        if (drink.hasOwnProperty("shyness")){
            shyness -= drink.shyness;
        }
        if (drink.hasOwnProperty("tuminc")){
            if (maxtummy < 1250) {
                maxtummy += drink.tuminc;
                maxbeer += drink.tuminc;
            }
        }
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

function ydrinknow(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    let drink = objects[item];
    let curtext = [];
    if (item !== "cocktail" && (yourtummy > ymaxtummy && yourtummy > ymaxbeer)){
        curtext.push("You consider drinking the " + drink.bpname.toLowerCase() + ", but you have drunk way too much already.");
    } else {
        if (drink.hasOwnProperty("cydrinkquote")) {
            curtext = printList(curtext, drink.cydrinkquote);
        } else {
            if (drink.hasOwnProperty("ydrinkquote"))
                curtext.push(drink.ydrinkquote);
            else
                curtext.push("<b>YOU: </b>" + drink.drinkquote);
            curtext.push("You drink the " + drink.bpname.toLowerCase() + ".");
        }
        yourtummy += drink.volume;
        drink.value -= 1;
        drink.ydrank += 1;
        if (drink.hasOwnProperty("drankbeer")){
            ydrankbeer += drink.drankbeer;
        }
        if (drink.hasOwnProperty("tuminc")){
            if (ymaxtummy < 1250) {
                ymaxtummy += drink.tuminc;
                ymaxbeer += drink.tuminc;
            }
        }
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

let homeChampagne = 0; //Flag whether champagne has been drunk at her home before (aka whether she needs to get the glasses)
//TODO turn into JSON
function champagneNow() {
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    let obj = objects.champagne;
    let curtext = [];
    if (locstack[0] === "theHome"){
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
            obj.bottles[0] -= 2;
            curtext = printList(curtext, drinklines["champagne"][2]);
        } else if (bladder < bladlose){
            curtext.push(girltalk + pickrandom(drinklines["wonderWhy"]));
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChamp"]));
            champagnecounter += 2;
            drankChamp = 0;
            obj.bottles[0] -= 2;
            curtext= printList(curtext, drinklines["champagne"][3]);
        } else {
            curtext.push(girltalk + pickrandom(drinklines["cantDo"]));
            curtext = printList(curtext, drinklines["champagne"][4]);
            curtext = showneed(curtext);
            curtext.push(pickrandom(drinklines["fillChampBad"]));
            champagnecounter = 6;
            curtext = printList(drinklines[5]);
        }
    } else if (objects["champ-glass"].value >= 2) {
        curtext.push("You get out the glasses and champagne and fill up both glasses");
        if (bladder < blademer){
            curtext.push("She smiles at you before you toast and drink the champagne together.")
        } else {
            curtext.push(girlgasp + "Oh I have to go so bad, but if you want me to drink it, I will.");
        }
        champagnecounter+=2;
        drankChamp = 0;
        obj.bottles[0] -= 2;
    } else {
        curtext.push("Unfortunately you don't have any champagne glasses, so you can't drink champagne.");
    }
    if (obj.bottles[0] === 0) {
        obj.bottles.shift();
        obj.value--;
    }
    tummy += 50;
    yourtummy += 50;
    curtext = callChoice(["curloc", "Continue..."], curtext);
    sayText(curtext);
}

function drinktogether(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("pop-up");
    backpackcnt.style.display = "none";
    let curtext = [];
    if (((tummy > maxtummy && (item !== "beer"|| tummy > maxbeer)) && item !== "cocktail")||
        (attraction < 10 && bladder > bladneed) ||
        (attraction < 20 && bladder > blademer)) {
        curtext.push(girltalk + "I just don't feel thirsty right now.");
    } else {
        let drink = objects[item];
        if (bladder > blademer && shyness < 90 && brokeice) {
            curtext.push(pickrandom(needs["drinkquote"]));
            curtext.push("You both drink your " + (drink.bpname.toLowerCase()) + ".");
        } else {
            if (drink.hasOwnProperty("ctdrinkquote")) {
                curtext = printList(curtext, addGirlTalk(drink.ctdrinkquote));
            } else {
                curtext.push(girltalk + drink.drinkquote);
                curtext.push("After a toast you both drink your " + drink.bpname.toLowerCase() + ".");
            }
        }
        tummy += drink.volume;
        yourtummy += drink.volume;
        drink.value -= 2;
        drink.shedrank += 1;
        drink.ydrank += 1;
        if (drink.hasOwnProperty("drankbeer")){
            drankbeer += drink.drankbeer;
            ydrankbeer += drink.drankbeer;
        }
        if (drink.hasOwnProperty("attraction")){
            attraction += drink.attraction;
        }
        if (drink.hasOwnProperty("shyness")){
            shyness -= drink.shyness;
        }
        if (drink.hasOwnProperty("tuminc")){
            if (maxtummy < 1000) {
                maxtummy += drink.tuminc;
                maxbeer += drink.tuminc;
            }
            if (ymaxtummy < 1000) {
                ymaxtummy += drink.tuminc;
                ymaxbeer += drink.tuminc;
            }
        }
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}