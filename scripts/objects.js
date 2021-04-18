objects = {
    "water" : {
        "bpname": "Water bottle",
        "value": 0,
        "owned": "{0} bottle{1} of water",
        "description":"These bottles are really quite small. It only contains 250ml, you're not quite sure why you wasted money on this."
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
            " but it can hold an insane amount of liquid. "
    },
    "shotglass": {
        "bpname":"Shotglass",
        "value": 0,
        "owned": "{0} shotglass{1}",
        "description":"You can't quite recall why you though tit was a good idea to bring this glass to your date. " +
            "It can hold about 100ml, maybe it will be of use?"
    },
    "ptowels": {
        "bpname":"Paper Towels",
        "value": 0,
        "owned": "{0} roll{1} of paper towels",
        "description":"One should always have paper towels handy."
    },
    "panties": {
        "bpname":"Sexy panties",
        "value": 0,
        "owned": "{0} pair{1} of sexy panties",
        "description":"Whoo, someone's a bit ambitious didn't they?"
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
    "beer":{
        "bpname":"Beer",
        "owned":0,
        "description":"Don't question why you have an unprotected glass of beer in your backpack. "
    },
    "soda":{
        "bpname":"Soda",
        "owned":0,
        "description":"A nice big cup of soda is all you need to stay hydrated."
    },
    "cocktail":{
        "bpname":"Cocktail",
        "owned":0,
        "description":"Hmmm, alcohol."
    }
}

//TODO add a mention need option
//TODO integrate champagne from thehouse
// standobjs function allows one to use the normal objects.
function standobjs(curtext) {
    if (haveItem("roses") > 0)
        curtext = c(["giveroses", "Give her a boquet of roses."], curtext);
    if (locstack[0] !== "dodance") {
        if (haveItem("water") && locstack[0] !== "thebar")
           curtext = c(["drinkchosen", "Do something with the water."], curtext);

        if (haveItem("beer") && locstack[0] !== "driveout") {
            curtext = c(["beerchosen", "Do something with the beer."], curtext);
        }
        if (haveItem("soda")) {
            curtext = c(["sodachosen", "Do something with the soda"], curtext);
        }
        if (haveItem("cocktail") && locstack[0] !== "driveout") {
            curtext = c(["cocktailchosen", "Do something with the cocktail"], curtext);
        }
    }
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
        console.log("huh?");
        itemlist.forEach(item => items += item);
        backpackitem.innerHTML = items;
    } else {
        console.log("Uhm");
        backpackitem.innerHTML = "<b>Your backpack is empty :(</b>";
    }
    const backpackcnt = document.getElementById("backpack-cnt");
    backpackcnt.style.display= "flex";
    console.log("allo");
    btn = document.getElementById("closebackpack");
    btn.onclick = function(){
        backpackcnt.style.display = "none";
    }
    window.onclick = function(event){
        if (event.target === backpackcnt)
            backpackcnt.style.display = "none";
    }
    itembtns = document.getElementsByClassName("itembtn");
    itembtns.onclick = selectitem;
    itemtext= document.getElementById("item-text");

}

function selectitem(selecteditem){
    console.log(selecteditem);
    const clickedbtn = document.getElementById(selecteditem);
    clickedbtn.style.backgroundColor = "#4bb6c3";
    clickedbtn.style.color = "#e52222";
    if (previousbtn)
        previousbtn.removeAttribute("style");
    itemtext.innerText="You chose " + selecteditem;
    previousbtn = clickedbtn;


}