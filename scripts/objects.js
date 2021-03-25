objects = {
    "water" : {
        "value": 0,
        "description": "{0} bottle{1} of water"
    },
    "roses" : {
        "value": 0,
        "description": "{0} bouquet{1} of roses"
    },
    "earrings" : {
        "value": 0,
        "description": "{0} pair{1} of earrings"
    },
    "vase" : {
        "value": 0,
        "description": "{0} vase{1}"
    },
    "shotglass": {
        "value": 0,
        "description": "{0} shotglass{1}"
    },
    "ptowels": {
        "value": 0,
        "description": "{0} roll{1} of paper towels"
    },
    "panties": {
        "value": 0,
        "description": "{0} pair{1} of sexy panties"
    },
    "champagne": {
        "value": 0,
        "description": "{0} {2}bottle{1} of champagne",
        "options": [
            "half-empty ",
            "empty "
        ]
    },
    "beer":{
        "value":0
    },
    "soda":{
        "value":0
    },
    "cocktail":{
        "value":0
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
    if (itemobj.value > 0){
        let description = ""
        if (comma > 0) description += ",&nbsp;"
        description += itemobj.description;
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

let btn;
let itembtns;
let previousbtn;
let itemtext;
function backpack(){
    const backpackitem = document.getElementById("backpackitems");
    backpackitem.style.display= "flex";
    console.log("allo");
    btn = document.getElementById("closebackpack");
    btn.onclick = function(){
        backpackitem.style.display = "none";
    }
    window.onclick = function(event){
        if (event.target === backpackitem)
            backpackitem.style.display = "none";
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