//TODO add keys and phone
objects = {
    "water" : {
        "bpname": "Water bottle",
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
        "value": 0,
        "owned": "{0} bouquet{1} of roses",
        "description":"It's a nice bouquet, maybe you can give it to {0} to impress her."
    },
    "earrings" : {
        "bpname":"Earrings",
        "value": 0,
        "owned": "{0} pair{1} of earrings",
        "description":"Ooh shiny! {0} surely will love these."
    },
    "vase" : {
        "bpname":"Vase",
        "value": 0,
        "owned": "{0} vase{1}",
        "description": "You're not quite sure how you managed to fit this in your backpack," +
            " but it can hold an insane amount of liquid. You wonder if it's bigger on the inside."
    },
    "shotglass": {
        "bpname":"Shotglass",
        "value": 0,
        "owned": "{0} shotglass{1}",
        "description":"You can't quite recall why you thought it was a good idea to bring this glass to your date. " +
            "It can hold about 100ml, maybe it will be of use?"
    },
    "ptowels": {
        "bpname":"Paper Towels",
        "value": 0,
        "peed" : 0,
        "owned": "{0} roll{1} of paper towels",
        "description":"One should always have paper towels handy."
    },
    "panties": {
        "bpname":"Sexy panties",
        "value": 0,
        "owned": "{0} pair{1} of sexy panties",
        "description":"Whoo, someone's a bit ambitious, aren't they?"
    },
    "champagne": {
        "bpname":"Champagne",
        "value": 0,
        "owned": "{0} {2}bottle{1} of champagne",
        "options": [
            "half-empty ",
            "empty "
        ],
        "description": "Some nice champagne, maybe you can share it with {0}?"
    },
    "champ-glass":{
        "bpname":"Champagne glass",
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
        "quote": "peechampquote",
        "owned": "{0} champagne glass{1}",
        "description": "A standard champagne glass, can hold 180ml. Maybe use it to share some champagne with {0}"
    },
    "beer":{
        "bpname":"Beer",
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
        "drinkquote": "Bottoms up!.",
        "description":"Beer is the route to every woman's heart. Or at least to the toilet."
    },
    "soda":{
        "bpname":"Soda",
        "owned": "{0} cup{1} of soda",
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
    "herKeys":{
        "bpname": "Set of Keys",
        "locations": ["herhome"],
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

herpurse = {
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
//This isn't used but it's a handy list, might be useful for later
const drinkLoc = ["pickup", "driveout", "domovie",
    "thebar", "theclub", "themakeout", "thewalk", "thebeach", "theyard",
    "thehottub", "darkmovie", "photogame", "drinkinggame", "thehome"]

//TODO add a mention need option
//TODO integrate champagne from thehouse
// standobjs function allows one to use the normal objects.
function standobjs(curtext) {
    // if (haveItem("roses") > 0)
    //     curtext = c(["giveroses", "Give her a boquet of roses."], curtext);
    // if (locstack[0] !== "dodance") {
    //     if (haveItem("water") && locstack[0] !== "thebar")
    //        curtext = c(["drinkchosen", "Do something with the water."], curtext);
    //
    //     if (haveItem("beer") && locstack[0] !== "driveout") {
    //         curtext = c(["beerchosen", "Do something with the beer."], curtext);
    //     }
    //     if (haveItem("soda")) {
    //         curtext = c(["sodachosen", "Do something with the soda"], curtext);
    //     }
    //     if (haveItem("cocktail") && locstack[0] !== "driveout") {
    //         curtext = c(["cocktailchosen", "Do something with the cocktail"], curtext);
    //     }
    // }
    if (randomchoice(5) && gottagoflag < 1 && showedneed > 0 && !askholditcounter)
        curtext = c(["askpee", "Ask her if she has to pee."], curtext);
    else if (flirtedflag < maxflirts && noflirtflag < 1) {
        curtext = handleFlirt(curtext);
    } else if (gottagoflag < 1 && askholditcounter) {
        curtext = c(["askcanhold", "You ask her how she's doing."],curtext);
    }
    return curtext;
}

function haveItem(item){
    return objects[item].value > 0;
}

// displaypos function prints the given object.
function displaypos(itemobj) {
    let number = itemobj.value;
    let description = ""
    if (itemobj.value > 0){
        if (comma > 0) description += ",&nbsp;"
        description += itemobj.owned;
        let formatlist = [number.toString()];
        if (number > 1){
            if (description.includes("shotglass")) formatlist.push("es");
            else formatlist.push("s");
        } else formatlist.push("");
        if (itemobj.hasOwnProperty("options")){
            if (champagnecounter > 0){
                if (champagnecounter < 6) formatlist.push(itemobj.options[0]);
                else formatlist.push(itemobj.options[1]);
            } else if (champagnecounter === 0) formatlist.push("");
        }
        description = description.format(formatlist);
        document.getElementById('objsp').innerHTML += description;
        comma = 1;
    }
    return description;
}

function ypredrink() {
    let curtext = []
    if (yourtummy < ymaxtummy) {
        curtext = printList(curtext, drinklines["ypredrink"][0]);
        yourtummy += 200;
        ydrankwaters += 2;
    } else {
        curtext = printList(curtext, drinklines["ypredrink"][1]);
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

function briberoses() {
    let curtext = [];
    curtext = printList(curtext, needs["briberoses"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    roses -= 1;
    sayText(curtext);
}

function bribeearrings() {
    let curtext = [];
    curtext = printList(curtext, needs["bribeearrings"]);
    askholditcounter++;
    curtext = displayholdquip(curtext);
    curtext = printChoicesList(curtext, [0],  needs["choices"]);
    earrings -= 1;
    sayText(curtext);
}

//TODO test
function holdpurse() {
    haveherpurse = 1;
    let curtext = [];
    curtext.push(needs["holdpurse"][0]);
    curtext.push(needs["holdpurse"][1]);
    // s(girltalk + "Great!");
    // s("She hands you her small, stylish purse and runs off to relieve herself.");
    curtext = printChoicesList(curtext, [6,7], needs["choices"]);
    // c("lookinsidepurse", "Look inside her purse.");
    // c("indepee", "Be a gentleman");
    sayText(curtext)
}

//TODO test
function lookinsidepurse() {
    let curtext = [];
    curtext.push(needs["holdpurse"][2]);
    // s("You open the top and see:");
    let tempstring = "A ";
    herpurse.forEach((item, index) => {
        if(index === 0)
            tempstring += item["desc"];
        else if (index === item.size - 1){
            tempstring += "and a" + item["desc"];
        } else {
            tempstring += "a" + item["desc"];
        }
    });
    // if (!herkeys)
    //     tempstring += "set of keys, a ";
    // if (!hercellphone)
    //     tempstring += "small cellphone, a ";
    // tempstring += "compact makeup kit and a comb.";
    // s(tempstring);
    curtext.push(tempstring);
    herpurse.forEach(item => {
        if ("funDesc" in item){
            curtext = c(["takeHerItem(item.key)", "take "+ item.funDesc] ,curtext);
        }
    });
    // if (!herkeys)
    //     c("takeherkeys", "Take her keys");
    // if (!hercellphone)
    //     c("takeherphone", "Take her cellphone");
    // c("indepee", "Close the purse");
    curtext = printChoicesList(curtext,[8], needs["choices"]);
    sayText(curtext);
}

//TODO test
//You steal the given item from her purse
function takeHerItem(item){
    let curtext = [];
    curtext.push(needs["holdpurse"][3].format(item.funDesc));
    curtext = printChoicesList(curtext, [9,1]);
    sayText(curtext);

}
//
// function takeherkeys() {
//     delete herpurse.keys;
//     objects.herKeys.owned++;
//     s("Thinking they might come in handy later, you pocket her keys.");
//     c("lookinsidepurse", "Examine her purse again");
//     c("indepee", "Continue...");
// }
//
// function takeherphone() {
//     hercellphone++;
//     s("Thinking it might come in handy later, you pocket her cellphone.");
//     c("lookinsidepurse", "Examine her purse again");
//     c("indepee", "Continue...");
// }

function givedrypanties() {
    s(girltalk + "Where did you get those?");
    s("She slips into the clean panties with a smile.");
    panties -= 1;
    pantycolor = "sexy";
    if (wetlegs < 1) attraction += 5;
    if (wetlegs > 0) {
        s("Her still dripping pussy dampens the crotch of the new panties.");
    }
    wetlegs = 0;
    c(locstack[0], "Continue ... ");
}

function giveptowels() {
    s(girltalk + "Thanks!");
    s("She wipes the pee from her legs and pussy.");
    attraction += 5;
    ptowels -= 1;
    wetlegs = 0;
    if (panties > 0)
        c("givedrypanties", "Offer her a clean pair of panties");
    c(locstack[0], "Continue ... ");
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

let btn;
let itembtns;
let previousbtn;
let itemtext;
function backpack(){
    let itemlist = createItemButtonList();
    let items = "";
    const backpackitem = document.getElementById("backpackitems");
    if (itemlist.length !== 0) {
        itemlist.forEach(item => items += item);
        backpackitem.innerHTML = items;
    } else {
        backpackitem.innerHTML = "<b>Your backpack is empty :(</b>";
    }
    const backpackcnt = document.getElementById("backpack-cnt");
    backpackcnt.style.display= "flex";
    btn = document.getElementById("closebackpack");
    btn.onclick = function(){
        backpackcnt.style.display = "none";
    }
    window.onclick = function(event){
        if (event.target === backpackcnt)
            backpackcnt.style.display = "none";
    }
    // itembtns = document.getElementsByClassName("itembtn");
    // itembtns.onclick = selectitem;
    itemtext= document.getElementById("item-text");
    itemtext.innerHTML = "";
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
        tobeprinted += "<b><i>You have " + getOwned(clickedObj) + "</i></b><br><br>";
    tobeprinted += clickedObj.description.format([girlname]);
    if (!noItemLoc.includes(locstack[0]) && locstack.length !== 0 && clickedObj.hasOwnProperty("functions")){
        if (!(clickedObj.hasOwnProperty("locations") && clickedObj.locations.includes(locstack[0]))){
            //If the girl isn't with you, you can't ask her to use a certain item
            if (!playOnly.includes(locstack[0]))
                printAllChoicesList([], clickedObj.functions).forEach(item => tobeprinted += item);
            if (playerbladder && clickedObj.hasOwnProperty("yfunctions")){
                printAllChoicesList([], clickedObj.yfunctions).forEach(item => tobeprinted += item);
                if (clickedObj.hasOwnProperty("togfunctions") && !playOnly.includes(locstack[0]) && clickedObj.value > 1)
                    printAllChoicesList([], clickedObj.togfunctions).forEach(item => tobeprinted += item);
            }
        }
    }
    itemtext.innerHTML= tobeprinted;
    previousbtn = clickedbtn;
}

//Returns text saying how much you own of an item.
function getOwned(selected) {
    let number = selected.value;
    let description = ""
    description += selected.owned;
    let formatlist = [number.toString()];
    if (number > 1){
        if (description.includes("glass")) formatlist.push("es");
        else formatlist.push("s");
    } else formatlist.push("");
    if (selected.hasOwnProperty("options")){
        if (champagnecounter > 0){
            if (champagnecounter < 6) formatlist.push(selected.options[0]);
            else formatlist.push(selected.options[1]);
        } else if (champagnecounter === 0) formatlist.push("");
    }
    description = description.format(formatlist);
    return description;
}

//TODO combine the if statements from dink/beer/cocktail/soda
function drinknow(item) {
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("backpack-cnt");
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
            if (maxtummy < 1000) {
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
    const backpackcnt = document.getElementById("backpack-cnt");
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
            if (ymaxtummy < 1000) {
                ymaxtummy += drink.tuminc;
                ymaxbeer += drink.tuminc;
            }
        }
    }
    curtext = c([locstack[0], "Continue..."], curtext);
    sayText(curtext);
}

function drinktogether(item){
    //Closes the backpack since a function has been chosen
    const backpackcnt = document.getElementById("backpack-cnt");
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