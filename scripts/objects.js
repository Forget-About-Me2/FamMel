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
    }
}

//TODO add a mention need option
//TODO integrate champagne from thehouse
// standobjs function allows one to use the normal objects.
function standobjs() {
    if (roses > 0) c("giveroses", "Give her a boquet of roses.");
    if (locstack[0] !== "dodance") {
        if (haveItem("water") && locstack[0] !== "thebar") {
            c("drinkchosen", "Do something with the water.");
        }
        if (haveItem("beer") && locstack[0] !== "driveout") {
            c("beerchosen", "Do something with the beer.");
        }
        if (haveItem("soda")) {
            c("sodachosen", "Do something with the soda");
        }
        if (haveItem("cocktail") && locstack[0] !== "driveout") {
            c("cocktailchosen", "Do something with the cocktail");
        }
    }
    if (randomchoice(5) && gottagoflag < 1 && showedneed > 0 && !askholditcounter)
        c("askpee", "Ask her if she has to pee.");
    else if (flirtedflag < maxflirts && noflirtflag < 1) {
        handleFlirt();
    } else if (gottagoflag < 1 && askholditcounter) {
        c("askcanhold", "You ask her how she's doing.")
    }
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