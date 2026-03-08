//TODO make a more general function for handling curtext

let calledjsons = {}; //Cache of fetched JSON files, keyed by tag name


//TODO maybe compress this in a list or something?
let flirtquotes; //This stores all possible flirts called from the JSON
let flirtresps; //This stores all possible responses called from the JSON
let feelUp; //This stores all quotes related to feeling her up
let kissing; //This stores all quotes related to kissing her
let ypeelines; //This stores all dialogues regarding to you going to the bathroom called from the JSON
let peelines; //This stores all dialogues regarding to her going to the bathroom called from the JSON
let needs; //This stores descriptions of her needs called from the JSON
let yneeds; //This stores descriptions of your needs called from the JSON
let drinklines; //This stores all lines regarding drinking from the JSON
let appearance; // This stores the appearance quotes from the JSON
let drive; //This stores all dialogues regarding driving around from the JSON
let general; //This stores all general quotes from JSON call
let darts; //This stores the json quotes for the darts game
let sexLines; //This stores the json quotes related to fucking scenes
let objQuotes; //This stores the json quotes related to objects.
let credits; //This stores the json for the credits

let girlname = "Laura";
let customgirlname = "Amanda";
let basegirl = "Laura";
let girltalk = "<b>" + girlname + ":&nbsp;</b>";
let girlgasp = "<b>" + girlname + " gasps:&nbsp;</b>";
let pantycolor = "black";

//Formatting Parameters
// Formatting : flags if string has been placed.
let imageprev;  // Previous image
const imagedesc = '"Picture of girl"';
let comma = 0; // used in formatting possessions.

//Formats a given string with the given list of values.
//Overwrites the wildcards with the given values in the list.
//Wildcards are of the format {i} where i is the index of which the corresponding value is in the given list.
String.prototype.format = function() {
    let s = this.toString(),
        i = arguments[0].length;
    const args = arguments[0]
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i].toString());
    }
    return s;
};

//Format a given string adding the variables
String.prototype.formatVars = function() {
    const replacements: Array<[RegExp, string]> = [
        [/girlname/gm, girlname],
        [/girltalk/gm, girltalk],
        [/girlgasp/gm, girlgasp],
        [/bladlose/gm, bladlose.toString()],
        [/pantyColor/gm, pantycolor],
        [/timeheld/gm, timeheld.toString()],
        [/bladderAm/gm, bladder.toString()],
        [/money/gm, money.toString()]
    ];

    return replacements.reduce((text: string, [pattern, replacement]) =>
            text.replaceAll(pattern, replacement),
        this.toString()
    );

}

//Formats all Strings in exprList to add the variables
function formatAllVars(exprList){
    let result = [];
    exprList.forEach(str => result.push(str.formatVars()));
    return result;
}

//Formats all String in a list of list to add the variables
function formatAllVarsList(list){
    let result = [];
    list.forEach(exprList => result.push(formatAllVars(exprList)));
    return result;
}

function addGirlname(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girlname])));
    return result;
}

function addMoney(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([money])));
    return result;
}

function addGirlTalk(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girltalk])));
    return result;
}

function printIntro(curtext, index){
    locjson["intro"][index].forEach(item => curtext.push(item));
    return curtext;
}

function printAlways(curtext) {
    locjson.always.forEach(item => curtext.push(item));
    return curtext;
}

//Only prints specified part of dialogue
function printSDialogue(curtext, loc, index, begin, end){
    for(let i = begin; i <= end; i++){
        curtext.push(locjson.dialogue[loc][index][i]);
    }
    return curtext;
}

function printFormatDialogue(curtext, loc, index, begin, end, values){
    for(let i = begin; i <= end; i++){
        const temp = locjson.dialogue[loc][index][i]
        curtext.push(formatString(temp, values));
    }
    return curtext;
}

//Adds a list to the curText. Note this is also used when addind a single list to an empty curtext list
//Reason for this is that it actually creates a deepcopy of the list, otherwise all changes to curtext is stored
//In the previous list.
function printList(curtext, list){
    list.forEach(item => curtext.push(item.formatVars()));
    return curtext;
}

function printListSelection(curtext, list, selection){
    selection.forEach(index => curtext.push(list[index]));
    return curtext;
}

//Of a given list of list print the list at the given index
function printLList(curtext, list, index){
    list[index].forEach(item => curtext.push(item));
    return curtext;
}

//Prints the given selection of choices for the current location
function printChoices(curtext, selection){
    selection.forEach(index => curtext = callChoice(locjson.choices[index], curtext));
    return curtext;
}

//Prints all choices
function printAllChoices(curtext){
    locjson.choices.forEach(item => curtext = callChoice(item, curtext) );
    return curtext;
}

//Prints the given selection of choices for the given choices list
function printChoicesList(curtext, selection, list){
    selection.forEach(index => curtext = callChoice(list[index], curtext));
    return curtext;
}

//Prints all the choices for the given choices list
function printAllChoicesList(curtext, list){
    list.forEach(item => curtext = callChoice(item, curtext))
    return curtext;
}

function callChoice(choice, curtext=[]){
    if(choice[0] === "curloc") {
        return c([locStack[0], choice[1]], curtext);
    } else {
        return c(choice, curtext);
    }
}

// Cache a choice
// choice - array of length 2 with tag on index 0 and desc on index 1
//   tag - function to activate using choice
//   desc - description of choice to display.
// curtext - a list of all current lines that will be printed during the scene
function c(choice, curtext) {
    const html = "<li><a href=\"javascript:go('" + choice[0] + "')\">" + choice[1].formatVars() + "</a>"
    curtext.push(html);
    return curtext;
}

// Cache a choice for a click listener
// choice - array of length 2 with tag on index 0 and desc on index 1
// tag - the tag for the choice, for a page with choices all tags need to be unique or things will break
function cListener(choice, tag){
    const html = "<p>" + cListenerString(choice, tag) + "</p>";
    document.getElementById('textsp').innerHTML += html;
}

//Gets the string html for the given choice, formats it if neccesarry
function cListenerString(choice, loc){
    return "<li class='cListener' id='"+loc+"'>"+choice[1].formatVars()+"</li>";
}

//Adds an element to a created click listener
//This is done separately because if the list contains more listeners things break
function addListeners(choice, loc, go=true){
    let func;
    if (go)
        func = goWrapper(choice[0]);
    else func = choice[0]
    document.getElementById(loc).addEventListener("click", func);
}

//Calls the given visit through go, aka it triggers a game tick.
function goWrapper(func){
    return function () { go(func);}
}

//For a given list adds a listener to all created click listeners
function addListenersList(list){
    list.forEach(item => {
        if (item.length === 3)
            addListeners(item[0], item[1], item[2]);
        else
            addListeners(item[0], item[1])
    });
}

//For the given choice creates both the element and the listener
function cListenerGen(choice, loc){
    cListener(choice, loc);
    addListeners(choice, loc);
}

/*
For a given list generates the element and listeners
expected input: [[function, description], tag]
Description is formatted if needed.
*/
function cListenerGenList(list){
    validateListenerList(list)
    // Ensure 'leave' / 'drive out' / 'go back' style choices are always shown last
    const leaveRegex = /leave|driveout|driveout|goback|exit|leavehm|leaveHm/i;
    const ordered = [] as any[];
    const leaves = [] as any[];
    list.forEach(item => {
        const tag = (item.length > 1 && typeof item[1] === 'string') ? item[1] : '';
        if (tag && leaveRegex.test(tag)) leaves.push(item);
        else ordered.push(item);
    });
    const finalList = ordered.concat(leaves);
    finalList.forEach(item => cListener(item[0], item[1]));
    addListenersList(finalList);
}

//print the given lines list on the screen
function sayText(lines){
    let result = "";
    try {
        lines.forEach(item => {
            if (item === undefined || item === "") {
                console.error("lines for say text not properly defined, lines:", lines);
                console.log(lines);
            }
            if (typeof item !== "string") {
                console.error("array found in saytest, incompatible", lines);
                console.log(lines);
            }
            result += "<p>" + item.formatVars() + "</p>";
        });
        document.getElementById('textsp').innerHTML = result;
    } catch (e) {
        console.error("Something went wrong while saying text");
        console.error(e);
        console.error(lines);
    }
}

//Adds the given line list to the already existing screen.
function addSayText(lines){
    let result = "";
    lines.forEach(item => result += "<p>" + item + "</p>");
    document.getElementById('textsp').innerHTML += result;
}

function setText(lines){
    let result = "";
    lines.forEach(item => result += item);
    document.getElementById('textsp').innerHTML = result;
}

let locjson = null; //This is the main json for the current location

// Fetch a JSON file and return its parsed contents.
// path: relative path under JSON/ (without JSON/ prefix or .JSON suffix)
async function fetchJson(path): Promise<any> {
    const file = "JSON/" + path + ".JSON";
    const response = await fetch(file);
    return response.json();
}

// Fetch a JSON file, cache it in calledjsons for later use by location functions, and return it.
// tag: the cache key AND the file path under JSON/
async function fetchAndCacheJson(tag): Promise<any> {
    const data = await fetchJson(tag);
    calledjsons[tag] = data;
    return data;
}


// Deep-copy a subtag from the cache into locjson without any wildcard replacement.
// Use this when the location handles its own formatting (e.g. herhome pickup).
function getMLocations(tag, subtag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag][subtag]));
}

// Load a single-subtag location from the cache into locjson and resolve wildcards.
// Only used for locations whose JSON has no subtags (e.g. "start").
// After this call, locjson.intro, locjson.always, locjson.choices etc. are ready to use.
function locationSetup(tag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag]));
    locjson.girlname = addGirlname(locjson.girlname);
    replaceWCI("intro", "girlname");
    replaceWCT("always", "girlname");
    replaceWCI("intro", "money");
    replaceWCT("always", "money");
}

// Load a subtag from a multi-subtag location into locjson and resolve wildcards.
// e.g. loadLocationScene("yourhome", "callher") deep-copies calledjsons["yourhome"]["callher"]
// into locjson, then replaces girlname/money/girltalk placeholders throughout intro, always,
// choices, and dialogue sections.
function loadLocationScene(tag, subtag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag][subtag]));
    if (locjson.hasOwnProperty("girlname"))
        locjson.girlname = addGirlname(locjson.girlname);
    if (locjson.hasOwnProperty("money"))
        locjson.money = addMoney(locjson.money);
    if (locjson.hasOwnProperty("girltalk"))
        locjson.girltalk = addGirlTalk(locjson.girltalk)
    //TODO this can be more efficient (arraylist with all options) with property
    //TODO instead of using {0} format outright replace the name0 thing with the right value
    replaceWCI("intro", "girlname");
    replaceWCT("always", "girlname");
    replaceWCI("intro", "money");
    replaceWCT("always", "money");
    replaceWCI("intro", "girltalk");
    replaceWCT("always", "girltalk");
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (let [key, value] of Object.entries(locjson.dialogue)){
            if(locjson.dialogue.hasOwnProperty(key)){
                value = replaceWCLI(value, "girlname");
                value = replaceWCLI(value, "money");
                value = replaceWCLI(value, "girltalk");
                locjson.dialogue[key] = value;
            }
        }
    }
}

// Load a scene from a custom (non-cached) JSON object into locjson with wildcard replacement.
// Used by locations that store their JSON in a module variable rather than calledjsons.
function locationMCSetup(subtag, customloc){
    locjson = JSON.parse(JSON.stringify(customloc[subtag]));
    if (locjson.hasOwnProperty("girlname"))
        locjson.girlname = addGirlname(locjson.girlname);
    if (locjson.hasOwnProperty("girltalk"))
        locjson.girltalk = addGirlTalk(locjson.girltalk)
    replaceWCI("intro", "girlname");
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (let [key, value] of Object.entries(locjson.dialogue)){
            if(locjson.dialogue.hasOwnProperty(key)){
                value = replaceWCLI(value, "girltalk");
                locjson.dialogue[key] = value;
            }
        }
    }
}

//Replacing the variable wildcards of the given tag for the given json value
function replaceWCT(jsontag,tag){
    let result = [];
    locjson[jsontag].forEach(item => result.push(replaceCheck(item, tag)));
    locjson[jsontag] = result;
}

//Replacing the variable wildcards of the given tag for the given json value, where this is a list of lists
function replaceWCI(jsontag, tag){
    let result = [];
    locjson[jsontag].forEach(item => result.push(replaceWCL(item, tag)));
    locjson[jsontag] = result;
}

//Replacing the variable wildcards of the given tag for the given list
function replaceWCL(strlist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceCheck(item, tag)));
    return result;
}

//Replacing the variable wildcards of the given tag for the given list of lists
function replaceWCLI(strlist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceWCL(item, tag)));
    return result;
}

//Replacing the variable wildcard of the given tag for the given list, using the given checklist
function replaceWCLC(strlist, checklist, tag){
    let result = [];
    strlist.forEach(item => result.push(LreplaceCheck(item,checklist, tag)));
    return result;
}

function replaceChoices(tag){
    let result = [];
    locjson["choices"].forEach(item => result.push(replaceChoice(item, tag)));
    locjson["choices"] = result
}

function replaceChoice(choice, tag){
    let result = [choice[0]];
    result.push(replaceCheck(choice[1], tag));
    return result
}

function replaceCheck(rpstring, tag){
    const list = locjson[tag];
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

function LreplaceCheck(rpstring, list, tag){
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

//calls all json requests to get recurring quotes
async function setupQuotes(){
    const tasks = [
        fetchJson("flirting").then(flirtSetup),
        fetchJson("needs").then(function (data) {
        needs = data;
        toldstories = range(0, needs["peestory"].length - 1);
    }),
        fetchJson("youpee").then(yPeeSetup),
        fetchJson("shepee").then(shePeeSetup),
        fetchJson("drinking").then(function (data){
        drinklines = data;
        drinklines["champagne"] = formatAllVarsList(drinklines["champagne"]);
    }),
        fetchJson("appearance").then(function (data){
        appearance = data;
    }),
        fetchJson("drive").then(function (data) {
        drive = data;
    }),
        fetchJson("general").then(function (data){
        general = data;
    }),
        fetchJson("games/darts").then(dartSetup),
        fetchJson("fuckHer").then(fuckHerSetup),
        fetchJson("objects").then(function (data) {
        objQuotes = data;
        objQuotes["buyItem2"] = formatAllVarsList(objQuotes["buyItem2"]);
    }),
        fetchJson("endScreens").then(function (data){
        endScreens = data;
    })
    ];

    await Promise.all(tasks);
}

function flirtSetup(data){
    flirtquotes = data["flirt"];
    let rawresp = data["respons"];
    flirtresps = {};
    for (let [key, value] of Object.entries(rawresp)){
        if (key === "bad"){
            flirtresps[key] = addGirlTalk(value);
        } else {
            flirtresps[key] = addGirlname(value);
        }
    }
    feelUp = data["feel"];
    feelUp["resp"] = formatAllVars(feelUp["resp"]);
    feelUp["bad"] = formatAllVars(feelUp["bad"]);
    kissing = data.kiss;
    kissing["diag"] = formatAllVarsList(kissing["diag"]);
}

//Girl curses
//TODO implement curses in json
function voccurse(curtext) {
    curtext.push(girltalk + " " + pickrandom(general["curseWord"]));
    return curtext;
}

function yPeeSetup(data){
    //TODO cleanup like shePeeSetup
    data["girlname"] = addGirlname(data["girlname"]);
    data["girltalk"] = addGirlTalk(data["girltalk"]);
    data["locked"]["girlname"] = addGirlname(data["locked"]["girlname"]);
    let templist = data["thehome"][0];
    let result = [];
    templist.forEach(item => result.push(LreplaceCheck(item, data["girlname"], "girlname")));
    templist = result;
    result = []
    templist.forEach(item => result.push(LreplaceCheck(item, data["girltalk"], "girltalk")));
    data["thehome"][0] = result;
    result = [];
    templist = data["locked"]["urgency"]
    templist.forEach(item => result.push(LreplaceCheck(item, data["locked"]["girlname"], "girlname")));
    data["locked"]["urgency"] = result;
    result = [];
    templist = data["beg"][0];
    templist.forEach(item => result.push(LreplaceCheck(item, data["girltalk"], "girltalk")));
    data["beg"][0] = result;
    ypeelines = data;
    ypeelines["peeOutside"]= formatAllVarsList(ypeelines["peeOutside"]);
}

function shePeeSetup(data){
    peelines = data;
    peelines["girlname"] = addGirlname(peelines["girlname"]);
    peelines["girltalk"]= addGirlTalk(peelines["girltalk"]);
    peelines["locked"]["girltalk"] = addGirlTalk(peelines["locked"]["girltalk"]);
    peelines["thehome"] = replaceWCLC(peelines["thehome"], peelines["girlname"], "girlname");
    peelines["noneavailable"] = replaceWCLC(peelines["noneavailable"], peelines["girlname"], "girlname");
    peelines["remaining"] = replaceWCLC(peelines["remaining"], peelines["girlname"], "girlname");
    let temp = [];
    peelines["peephone"].forEach(item => temp.push(replaceWCLC(item, peelines["girltalk"], "girltalk")));
    peelines["peephone"] = temp;
    peelines["locked"]["cbar"] = replaceWCLC(peelines["locked"]["cbar"], peelines["locked"]["girltalk"], "girltalk");
    peelines["locked"]["cclub"] = replaceWCLC(peelines["locked"]["cclub"], peelines["locked"]["girltalk"], "girltalk");
    peelines["pgirlsroom"] = formatAllVarsList(peelines["pgirlsroom"]);
    peelines["ptogether"] = formatAllVarsList(peelines["ptogether"]);
}


function handleFlirt(listenerList){
    let low = "low";
    let med = "med";
    let high = "high";
    if(locStack[0] === "callher"){
        low += "cell";
        med += "cell";
    } else if (locStack[0] === "theHotTub"){
        low += "Naked";
        med += "Naked";
        high += "Naked";
    }
    listenerList.push([[flirt_l, flirtFormat(flirtquotes[low][randcounter])], "flirt_l"])
    incrandom();
    if (randomInt(7) === 0 && locStack[0] !== "callher"){
        listenerList.push([[flirt_h, flirtFormat(flirtquotes[high][randcounter])], "flirt_h"]);
    } else {
        listenerList.push([[flirt_m, flirtFormat(flirtquotes[med][randcounter])], "flirt_m"]);
    }
    return listenerList;
}

function flirtFormat(quote){
    return "Tell her " + quote + ".";
}