//TODO make a more general function for handling curtext

const jsonlocs = ["options", "start", "yourhome", "herhome"]; //List of locations that have a corresponding json file
let calledjsons = {}; //Dictionary list of all location that have already been queried, this saves them being queried multiple times meaning less requests for the server


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

// her apologies for asking to go
var wanthold=["I know you asked me to wait, but...", "I know you told me not to go, but...", "I know you wanted me to hold it, but..." , "I know you asked me not to pee, but...", "I know you wanted me to control my bladder, but..." , "I know you didn't want me to go, but..."];

//
//  Her expressions when peeing in a strange place
//  used by itscomingout()
//

const outpeelook=[
    "No!  Don't look!",
    "Ugh!  Don't watch me!",
    "Wait!  Don't look at me.",
    "Oh No!  Please don't look!",
    "Oh No! You can't look!",
    "Please don't stare!"
];
const outpeehide=[
    "Please help me hide!",
    "Please don't let anyone watch!",
    "Can you watch out for people coming?",
    "Can you help me hide?",
    "Please don't let anyone look!",
    "Don't let anybody see me!"
];
const outpeectrl=[
    "Ungh! I can't hold it anymore!",
    "Oh God!  I can't control it!",
    "Urgh!  I can't stop it.",
    "Oh! I can't wait any more!",
    "Fuck!",
    "Dammit!"
];

//
//  She curses
//
var curseword=["Dammit!", "Jesus!", "Shit!" , "Fuckit!", "Goddamn!", "Fuckin' A!", "Fuck!"];

//
//  Names of bar girls and escorts
//
var bargirlnames=["Tiffany", "Brittney", "Vanessa" , "Maya", "Angelina", "Samantha", "Carly"];

//
//  Descriptions of her posing for you
//

// var posenude=[
//     "shyly covers her breasts with one hand and her pussy with the other.  Her face is a bright red.",
//     "turns her back to you and tries to hide her bare bottom with one hand while she looks back over her shoulder.  You see the curls of her pubic hair in the space between her legs.",
//     "slowly turns toward you, her breasts pressed between her extended arms, and both hands firmly blocking your view of her crotch.",
//     "shyly moves one of her hands to her hip and cups a breast with the other.  She holds one leg crossed just a little forward, squeezing the exposed slit of her pussy closed.",
//     "turns slightly, spreads her legs and caresses her inner thigh with one hand while spreading the other across the opposite butt cheek.",
//     "turns away and bends down to touch her toes, legs spread slightly.  Her glistening pussy and cute, tight anus are fully exposed to your camera."];
//
// var poseemer=[
//     "<i>She seems to be having trouble keeping her legs still for any length of time, and she's breathing hard with the effort to control her bladder.</i>",
//     "<i>She keeps unconsciously moving her hand closer to her pussy from behind and then catching herself and moving it back.  Her expression is strained as she tries to hold her pee and hold still at the same time.</i>",
//     "<i>You can see sweat on her face as she tries to fight the burning pressure in her bladder and stay posed until you take a picture.</i>",
//     "<i>She's trembling with the effort to control her bladder using just her sphincters while holding the pose at the same time.</i>",
//     "<i>Her hips won't stop moving as she tries to manage her overwhelming urge to pee without breaking the pose.</i>",
//     "<i>She's gasping for breath as she fights the spasms and her whole body shakes with the effort to hold both the pose and the contents of her overfull bladder.</i>"];

//
//  She's about to lose control in the car.
//
var carlosequotes=["I don't care where, but I need to get out of the car <b>NOW</b>!","I'm gonna wet my panties if you don't stop and let me out!","I can't wait anymore, just stop and let me out <b>NOW</b>!","I can't hold it anymore - just stop here or I'll wet in the car!","I <i>can't</i> wait any longer, you've gotta let stop and let me out!","I really really have to pee somewhere!  Anywhere!"];

var caremerquotes=["You've just <i>got</i> to find me somewhere to stop soon so I can use the restroom.","I <i>really</i> need to visit the little girls room - are you sure you don't see somewhere we can stop?","I've gotta stop by the next place you see that might have a toilet.","I need to take a leak before I have an accident in my panties - can you please stop the next place you see?","I'm getting <i>desperate</i> for a restroom - just stop at the next gas station or whatever you see.","I <b>have</b> to go to the bathroom - isn't there <i>anything</i> with a restroom on this street?"];

var carneedquotes=["I've got to go pretty bad, so if you know a place with a restroom, could we stop?","I need to visit the little girls room.  Do you think we'll get there soon?","I have to go pee soon.  Are we there yet?","I've gotta stop by the toilet, my bladder is bursting.  We're gonna be there soon, right?","I need to go powder my nose when we get where we're going.  It's not much longer, right?","I have to take a bio break when we get there.  It's not that far, right?"];

var carurgequotes=["I'm going to want to go and pee soon.","I think my bladder is getting full.","I might have to stop at the restoom before too long.","I guess I'll need to freshen up next.","I'd better go powder my nose soon.","I'd like to stop by the restroom in the next little bit."];

//
//  She's about to lose control and she's not in the car
//
var losequotes=["I need to find somewhere to pee <b>NOW</b>!","I'm gonna wet my panties if I don't get to a restroom!","I can't wait anymore, I need to pee <b>NOW</b>!","I can't hold it anymore - I must get to the restroom!","I <i>have</i> to get to the bathroom!","I really <i><b>really</b></i> have to pee somewhere!  <i>Anywhere!</i>"];

var emerquotes=["I've <i>got</i> to get to a bathroom soon.","I <i>really</i> need to visit the little girls room.","I've gotta get to a toilet or I'm going to wet myself.","I need to take a leak before I have an accident in my panties.","I'm getting <i>desperate</i> for a restroom.","I <b>have</b> to go to the bathroom.  <i>Now</i>."];

var needquotes=["I've gotta pee pretty badly.","I need to visit the little girls room.","I have to go pee now.","I've gotta stop by the toilet, my bladder is bursting.","I need to go powder my nose.","I have to take a bio break."];

var urgequotes=["I'm going to want to go and pee soon.","I think my bladder is getting full.","I might have to stop at the restoom before too long.","I guess I'll need to freshen up next.","I'd better go powder my nose soon.","I'd like to stop by the restroom in the next little bit."];


// //
// // Walk descriptions
// //
// var walkdesc=["You walk hand in hand past dark houses.",
//     "The sidewalk is a little bit cracked here.",
//     "You pass a deserted bus stop.",
//     "You walk past a vacant lot, overgrown with weeds.",
//     "You walk past a small city park.",
//     "You see a tall wooden fence, and a gate sitting slightly ajar."];

//
// Leaving
//
var outtahere= [
    "Let's hit the road!",
    "We're outta here!",
    "Let's get going!",
    "Let's get a move on!",
    "We're on our way!",
    "Let's make like a tree and get outta here!"
];

// Your fingers smell of her pee.
var smellpee=[
    "They smell of sex ... and her sweet urine.",
    "They smell musky, with the clean scent of fresh pee.",
    "They smell strongly of her urine.",
    "They are sticky with the scent of her sex, and her pee.",
    "They are coated with the scent of her pee.",
    "The smell reminds you of a toilet filled with golden urine, just before it's flushed."
];

String.prototype.format = String.prototype.f = function() {
    let s = this,
        i = arguments[0].length;
    const args = arguments[0]
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
    }
    return s;
};

//Format a given string adding the variables
String.prototype.formatVars = function() {
    let s = this;
    s = s.replaceAll(new RegExp("girlname",'gm'), girlname);
    s = s.replaceAll(new RegExp("girltalk", 'gm'), girltalk);
    s = s.replaceAll(new RegExp("girlgasp", 'gm'), girlgasp);
    s = s.replaceAll(new RegExp("bladlose", 'gm'), bladlose.toString());
    return s;
}

function formatString(expr, arguments){
    return expr.format(arguments);
}

//formats all Strings in exprList with the corresponding value in values
function formatAll(exprList, values){
    let result = [];
    for(let i=0;i<exprList.length; i++){
        result.push(formatString(exprList[i], values[i]));
    }
    return result;
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

function addGirlGasp(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girlgasp])));
    return result;
}

function printIntro(curtext, index){
    locjson.intro[index].forEach(item => curtext.push(item));
    return curtext;
}

function printAlways(curtext) {
    locjson.always.forEach(item => curtext.push(item));
    return curtext;
}

function printDialogue(curtext, loc, index){
    locjson.dialogue[loc][index].forEach(item => curtext.push(item));
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
        return c([locstack[0], choice[1]], curtext);
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

//Gets the string html for the given choice
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

/*For a given list generates the element and listeners
expected input: [[function, description], tag]
*/
function cListenerGenList(list){
    list.forEach(item => cListener(item[0], item[1]));
    addListenersList(list);
}

//print the given lines list on the screen
function sayText(lines){
    let result = "";
    lines.forEach(item => result += "<p>" + item + "</p>");
    document.getElementById('textsp').innerHTML = result;
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

let json = null;
let locjson = null; //This is the main json for the current location

//This requests a json from the webserver with a given filename and callback function
//TODO probably find a way to store this
async function getjson(fileID, callback){
    const file = "JSON/" + fileID + ".JSON";
    const response= await fetch(file);
    json = await response.json();
    return callback();
}

//This requests a json file from the webserver using the location tag
async function getjsonT(tag){
    const file = "JSON/" + tag + ".JSON";
    const response= await fetch(file);
    json = await response.json();
    calledjsons[tag] = json;
    eval(tag+"()");
}


//TODO handle formatting differently, probably have a list of indexes that need to be replaced instead
//This sets up all variables that this location uses.
function locationSetup(tag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag]));
    locjson.girlname = addGirlname(locjson.girlname);
    //TODO this can be more efficient (arraylist with all options)
    replaceWCI("intro", "girlname");
    replaceWCT("always", "girlname");
    replaceWCI("intro", "money");
    replaceWCT("always", "money");
}

//Setup of location when there are multiple locations in json file
function locationMSetup(tag, subtag){
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

//Setup of location using a JSON that is not connected to a location
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

function replaceWCLCI(strlist, checklist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceWCLC(item, checklist, tag)));
    return result
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

function replaceChoicesList(strList, tag, checkList ){
    let result = [];
    strList.forEach(item => result.push(replaceChoiceList(item, tag, checkList)));
    return strList;
}

function replaceChoiceList(choice, tag, checkList){
    let result = [choice[0]];
    result.push(LreplaceCheck(choice[1], checkList, tag));
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
function setupQuotes(){
    getjson("flirting", flirtSetup);
    getjson("needs", needSetup);
    getjson("youpee", yPeeSetup);
    getjson("shepee", shePeeSetup);
    getjson("drinking", function (){
        drinklines = json;
        drinklines["champagne"] = formatAllVarsList(drinklines["champagne"]);
    });
    //TODO format this json better?
    getjson("appearance", function (){
        appearance = json;
    } );
    getjson("drive", function () {
        drive = json;
    });
    getjson("general", function (){
        general = json;
    });
    getjson("games/darts", dartSetup);
    getjson("fuckHer", fuckHerSetup);
    getjson("objects", function () {
        objQuotes = json;
        objQuotes["buyItem2"] = formatAllVarsList(objQuotes["buyItem2"]);

    });
    yNeedSetup();
}

function flirtSetup(){
    flirtquotes = json.flirt;
    let rawresp = json.respons;
    flirtresps = {};
    for (let [key, value] of Object.entries(rawresp)){
        if (key === "bad"){
            flirtresps[key] = addGirlTalk(value);
        } else {
            flirtresps[key] = addGirlname(value);
        }
    }
    feelUp = json.feel;
    feelUp["resp"] = formatAllVars(feelUp["resp"]);
    feelUp["bad"] = formatAllVars(feelUp["bad"]);
    kissing = json.kiss;
    kissing["diag"] = formatAllVarsList(kissing["diag"]);
}


function needSetup(){
    needs = json;
    needs["girltalk"] = addGirlTalk(needs["girltalk"]);
    needs["girlname"] = addGirlname(needs["girlname"]);
    needs["girlgasp"] = addGirlGasp(needs["girlgasp"]);
    needs["askpee"] = replaceWCLC(needs["askpee"],  needs["girlname"], "girlname");
    needs["askpee"] = replaceWCLC(needs["askpee"], needs["girltalk"], "girltalk");
    needs["preventpee"] = replaceChoicesList(needs["preventpee"],  needs["girlname"], "girlname");
    needs["pstory"] = replaceWCLC(needs["pstory"], needs["girlname"], "girlname");
    needs["holdit"]["girltalk"] = addGirlTalk(needs["holdit"]["girltalk"]);
    needs["holdit"]["girlgasp"] = addGirlGasp(needs["holdit"]["girlgasp"]);
    needs["holdit"]["dialogue"] = replaceWCLC(needs["holdit"]["dialogue"], needs["holdit"]["girltalk"], "girltalk");
    needs["holdit"]["dialogue"] = replaceWCLC(needs["holdit"]["dialogue"], needs["holdit"]["girlgasp"], "girlgasp");
    needs["begtoilet"]["girlname"] = addGirlname(needs["begtoilet"]["girlname"]);
    needs["begtoilet"]["dialogue"] = replaceWCLC(needs["begtoilet"]["dialogue"], needs["begtoilet"]["girlname"], "girlname");
    needs["briberoses"] = replaceWCLC(needs["briberoses"], needs["girltalk"],"girltalk");
    needs["bribefavor"] = replaceWCLC(needs["bribefavor"], needs["girltalk"],"girltalk");
    needs["payholdit"] = replaceWCLC(needs["payholdit"], needs["girltalk"],"girltalk");
    needs["payfails"] = replaceWCLC(needs["payfails"], needs["girltalk"],"girltalk");
    needs["bribeearrings"] = replaceWCLC(needs["bribeearrings"], needs["girltalk"],"girltalk");
    needs["allowpee"] = replaceWCLC(needs["allowpee"], needs["girltalk"],"girltalk");
    needs["holdpurse"] = replaceWCLC(needs["holdpurse"], needs["girltalk"], "girltalk");
    needs["vase"] = replaceWCLCI(needs["vase"], needs["girltalk"], "girltalk");
    needs["vase"] = replaceWCLCI(needs["vase"], needs["girlname"], "girlname");
    needs["shotglass"] = replaceWCLCI(needs["shotglass"], needs["girltalk"], "girltalk");
    needs["shotglass"] = replaceWCLCI(needs["shotglass"], needs["girlname"], "girlname");
    needs["ptowels"] = replaceWCLCI(needs["ptowels"], needs["girltalk"], "girltalk");
    needs["ptowels"] = replaceWCLCI(needs["ptowels"], needs["girlname"], "girlname");
    needs["champ-glass"] = replaceWCLCI(needs["champ-glass"], needs["girltalk"], "girltalk");
    needs["peeintub"] = replaceWCLC(needs["peeintub"], needs["girltalk"], "girltalk");
    needs["peeintub"] = replaceWCLC(needs["peeintub"], needs["girlgasp"], "girlgasp");
    needs["wetquote"] = addGirlname(needs["wetquote"]);
    needs["wetherself"] = replaceWCLC(needs["wetherself"], needs["girlname"], "girlname");
    needs["wetherself"] = replaceWCLC(needs["wetherself"], needs["girltalk"], "girltalk");
    needs["drinkquote"] = addGirlname(needs["drinkquote"]);
    needs["peeoutside"] = replaceWCLC(needs["peeoutside"], needs["girltalk"], "girltalk");
    toldstories = range(0, needs["peestory"].length);
}

//Girl curses
//TODO implement curses in json
function voccurse(curtext) {
    curtext.push(girltalk + " " + pickrandom(curseword));
    return curtext;
}


function yNeedSetup(){
    yneeds["girlname"] = addGirlname(yneeds["girlname"]);
    yneeds["shotglass"] = replaceWCLCI(yneeds["shotglass"], yneeds["girlname"], "girlname");
    yneeds["vase"] = replaceWCLCI(yneeds["vase"], yneeds["girlname"], "girlname");

}

function yPeeSetup(){
    //TODO cleanup like shePeeSetup
    json["girlname"] = addGirlname(json["girlname"]);
    json["girltalk"] = addGirlTalk(json["girltalk"]);
    json["locked"]["girlname"] = addGirlname(json["locked"]["girlname"]);
    let templist = json["thehome"][0];
    let result = [];
    templist.forEach(item => result.push(LreplaceCheck(item, json["girlname"], "girlname")));
    templist = result;
    result = []
    templist.forEach(item => result.push(LreplaceCheck(item, json["girltalk"], "girltalk")));
    json["thehome"][0] = result;
    result = [];
    templist = json["locked"]["urgency"]
    templist.forEach(item => result.push(LreplaceCheck(item, json["locked"]["girlname"], "girlname")));
    json["locked"]["urgency"] = result;
    result = [];
    templist = json["beg"][0];
    templist.forEach(item => result.push(LreplaceCheck(item, json["girltalk"], "girltalk")));
    json["beg"][0] = result;
    ypeelines = json;
    ypeelines["peeOutside"]= formatAllVarsList(ypeelines["peeOutside"]);
}

function shePeeSetup(){
    peelines = json;
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


function handleFlirt(curtext){
    let result = [];
    let choice = [];
    let low = "low";
    let med = "med";
    if(locstack[0] === "callher"){
        low += "cell";
        med += "cell";
    }
    result.push([flirtquotes[low][randcounter]]);
    choice.push("flirt_l");
    incrandom();
    if (Math.floor(Math.random() * 7) === 0 || locstack[0] !== "callher"){
        choice.push("flirt_h");
        result.push([flirtquotes["high"][randcounter]]);
    } else {
        choice.push("flirt_m");
        result.push([flirtquotes[med][randcounter]]);
    }
    const build = "Tell her {0}.";
    for (let i = 0; i < result.length; i++){
        curtext = c([choice[i], formatString(build, result[i])], curtext);
    }
    return curtext;
}


