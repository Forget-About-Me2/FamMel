//TODO make a more general function for handling curtext

// String prototype extensions — augment the global String interface
// so TypeScript accepts .format() and .formatVars() calls everywhere.
import { formatString, range, pickrandom, incrandom, randomInt, getCurrentLocationTag, randcounter, setEndScreens } from './shims';
import { runtimeContext } from './gameState/runtimeContext';
import { setToldstories } from './bladder';
import { validateListenerList } from './validation';
import { dartSetup } from './games/darts';
import { fuckHerSetup } from './fuckHer';
import { flirt_l, flirt_m, flirt_h } from './actions';
import { bladder, bladlose, timeheld } from './bladder';

declare global {
    interface String {
        format(...args: any[]): string;
        formatVars(): string;
    }
}

export let calledjsons: any = {}; //Cache of fetched JSON files, keyed by tag name
export function setCalledjsons(val: any) { calledjsons = val; }

// Delegated click handler: maps action IDs to function callbacks.
// Cleared on every screen refresh (sayText/setText) so stale closures get GC'd.
const actionRegistry = new Map<string, Function>();
let actionIdCounter = 0;

function nextActionId(): string {
    return `_a${actionIdCounter++}`;
}

export function clearActionRegistry() {
    actionRegistry.clear();
}

// Set up once at startup: single delegated listener on document handles all choice clicks
export function initDelegatedClickHandler() {
    document.addEventListener('click', function(e) {
        const target = (e.target as HTMLElement).closest('[data-action], [data-action-fn]') as HTMLElement;
        if (!target) return;
        e.preventDefault();
        if (target.dataset.action) {
            (window as any).go(target.dataset.action);
        } else if (target.dataset.actionFn) {
            const fn = actionRegistry.get(target.dataset.actionFn);
            if (fn) fn();
        }
    });
}


//TODO maybe compress this in a list or something?
let flirtquotes: any; //This stores all possible flirts called from the JSON
export let flirtresps: any; //This stores all possible responses called from the JSON
export let feelUp: any; //This stores all quotes related to feeling her up
export let kissing: any; //This stores all quotes related to kissing her
export let ypeelines: any; //This stores all dialogues regarding to you going to the bathroom called from the JSON
export let peelines: any; //This stores all dialogues regarding to her going to the bathroom called from the JSON
export let needs: any; //This stores descriptions of her needs called from the JSON
export let yneeds: any; //This stores descriptions of your needs called from the JSON
export let drinklines: any; //This stores all lines regarding drinking from the JSON
export let appearance: any; // This stores the appearance quotes from the JSON
export let drive: any; //This stores all dialogues regarding driving around from the JSON
export let general: any; //This stores all general quotes from JSON call
export let darts: any; //This stores the json quotes for the darts game
export function setDarts(val: any) {
    darts = val;
}
export let sexLines: any; //This stores the json quotes related to fucking scenes
export function setSexLines(val: any) { sexLines = val; }
export function setAppearance(val: any) { appearance = val; }
export let objQuotes: any; //This stores the json quotes related to objects.
export function setObjQuotes(val: any) { objQuotes = val; }
let credits: any; //This stores the json for the credits

export let girlname = "Laura";
export function setGirlname(val: string) {
    girlname = val;
}
export let customgirlname = "Amanda";
export function setCustomgirlname(val: string) { customgirlname = val; }
export let basegirl = "Laura";
export function setBasegirl(val: string) { basegirl = val; }
export let girltalk = "<b>" + girlname + ":&nbsp;</b>";
export function setGirltalk(val: string) { girltalk = val; }
export let girlgasp = "<b>" + girlname + " gasps:&nbsp;</b>";
export function setGirlgasp(val: string) { girlgasp = val; }
export let pantycolor = "black";
export function setPantycolor(val: string) { pantycolor = val; }

//Formatting Parameters
// Formatting : flags if string has been placed.
export let imageprev: any;  // Previous image
export function setImageprev(val: any) { imageprev = val; }
export const imagedesc = '"Picture of girl"';
export let comma = 0; // used in formatting possessions.
export function setComma(val: number) { comma = val; }

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
        [/money/gm, runtimeContext.Money.toString()]
    ];

    return replacements.reduce((text: string, [pattern, replacement]) =>
            text.replaceAll(pattern, replacement),
        this.toString()
    );

}

//Formats each template string with its corresponding value from the values array
export function wrapAndFormatAll(template: any[], values: any[]): string[] {
    return template.map((str: string, i: number) => str.format([values[i]]));
}

//Formats all Strings in exprList to add the variables
export function formatAllVars(exprList: any[]){
    let result = [] as any[];
    exprList.forEach(str => result.push(str.formatVars()));
    return result;
}

//Formats all String in a list of list to add the variables
export function formatAllVarsList(list: any[]){
    let result = [] as any[];
    list.forEach(exprList => result.push(formatAllVars(exprList)));
    return result;
}

export function addGirlname(quotes: any[]){
    let result = [] as any[];
    quotes.forEach(item => result.push(item.format([girlname])));
    return result;
}

function addMoney(quotes: any[]){
    let result: any[] = [];
    quotes.forEach(item => result.push(item.format([runtimeContext.Money])));
    return result;
}

export function addGirlTalk(quotes: any[]){
    let result = [] as any[];
    quotes.forEach(item => result.push(item.format([girltalk])));
    return result;
}

export function printIntro(curtext: any[], index: number){
    locjson["intro"][index].forEach(item => curtext.push(item));
    return curtext;
}

export function printAlways(curtext: any[]) {
    locjson.always.forEach(item => curtext.push(item));
    return curtext;
}

//Only prints specified part of dialogue
export function printSDialogue(curtext: any[], loc: string, index: number, begin: number, end: number){
    for(let i = begin; i <= end; i++){
        curtext.push(locjson.dialogue[loc][index][i]);
    }
    return curtext;
}

export function printFormatDialogue(curtext: any[], loc: string, index: number, begin: number, end: number, values: any[]){
    for(let i = begin; i <= end; i++){
        const temp = locjson.dialogue[loc][index][i]
        curtext.push(formatString(temp, values));
    }
    return curtext;
}

//Adds a list to the curText. Note this is also used when addind a single list to an empty curtext list
//Reason for this is that it actually creates a deepcopy of the list, otherwise all changes to curtext is stored
//In the previous list.
export function printList(curtext: any[], list: any[]){
    list.forEach(item => curtext.push(item.formatVars()));
    return curtext;
}

export function printDialogue(curtext: any[], loc: string, index: number): any[] {
    if (locjson && locjson.dialogue && locjson.dialogue[loc]) {
        locjson.dialogue[loc][index].forEach(function(item: any) {
            curtext.push(item);
        });
    }
    return curtext;
}

export function printListSelection(curtext: any[], list: any[], selection: number[]){
    selection.forEach(index => curtext.push(list[index]));
    return curtext;
}

//Of a given list of list print the list at the given index
export function printLList(curtext: any[], list: any[], index: number){
    list[index].forEach(item => curtext.push(item));
    return curtext;
}

//Prints the given selection of choices for the current location
export function printChoices(curtext: any[], selection: number[]){
    selection.forEach(index => curtext = callChoice(locjson.choices[index], curtext));
    return curtext;
}

//Prints all choices
export function printAllChoices(curtext: any[]){
    locjson.choices.forEach(item => curtext = callChoice(item, curtext) );
    return curtext;
}

//Prints the given selection of choices for the given choices list
export function printChoicesList(curtext: any[], selection: number[], list: any[]){
    selection.forEach(index => curtext = callChoice(list[index], curtext));
    return curtext;
}

//Prints all the choices for the given choices list
export function printAllChoicesList(curtext: any[], list: any[]){
    list.forEach(item => curtext = callChoice(item, curtext))
    return curtext;
}

export function callChoice(choice: any[], curtext: any[]=[]){
    if(choice[0] === "curloc") {
        return c([getCurrentLocationTag(), choice[1]], curtext);
    } else {
        return c(choice, curtext);
    }
}

// Cache a choice
// choice - array of length 2 with tag on index 0 and desc on index 1
//   tag - route string to pass to go()
//   desc - description of choice to display.
// curtext - a list of all current lines that will be printed during the scene
export function c(choice: any[], curtext: any[]) {
    const html = "<li><a href=\"javascript:void(0)\" data-action=\"" + choice[0] + "\">" + choice[1].formatVars() + "</a>";
    curtext.push(html);
    return curtext;
}

// Cache a choice for a click listener.
// choice[0] is the function callback, choice[1] is the label.
// tag is used as an element ID for legacy compatibility.
// The function is registered in the actionRegistry and wired via event delegation.
export function cListener(choice: any[], tag: string){
    const id = nextActionId();
    actionRegistry.set(id, function() { (window as any).go(choice[0]); });
    const html = "<p><li class='cListener' id='" + tag + "' data-action-fn='" + id + "'>" + choice[1].formatVars() + "</li></p>";
    document.GetRequiredElementById<HTMLElement>('textsp').innerHTML += html;
}

// Variant that registers a raw function callback (no go() wrapper).
function cListenerRaw(choice: any[], tag: string){
    const id = nextActionId();
    actionRegistry.set(id, choice[0]);
    const html = "<p><li class='cListener' id='" + tag + "' data-action-fn='" + id + "'>" + choice[1].formatVars() + "</li></p>";
    document.GetRequiredElementById<HTMLElement>('textsp').innerHTML += html;
}

//Adds an element to a created click listener.
//For elements without data-action-fn (e.g. manually created HTML), falls back to addEventListener.
export function addListeners(choice: any[], loc: string, go=true){
    const el = document.getElementById(loc);
    if (!el) return;
    // Skip if already wired via delegation
    if (el.dataset.actionFn) return;
    let func;
    if (go)
        func = function () { (window as any).go(choice[0]); };
    else func = choice[0];
    el.addEventListener("click", func);
}

//For a given list adds a listener to all created click listeners.
//Skips elements already wired via data-action-fn delegation.
export function addListenersList(list: any[]){
    list.forEach(item => {
        if (item.length === 3)
            addListeners(item[0], item[1], item[2]);
        else
            addListeners(item[0], item[1]);
    });
}

//For the given choice creates both the element and the listener
export function cListenerGen(choice: any[], loc: string){
    cListener(choice, loc);
}

/*
For a given list generates the element and listeners
expected input: [[function, description], tag]
Description is formatted if needed.
If item has a third element set to false, the callback is registered directly (no go() wrapper).
*/
export function cListenerGenList(list: any[]){
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
    finalList.forEach(item => {
        if (item.length >= 3 && item[2] === false)
            cListenerRaw(item[0], item[1]);
        else
            cListener(item[0], item[1]);
    });
}

//print the given lines list on the screen
export function sayText(lines: any[]){
    clearActionRegistry();
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
        document.GetRequiredElementById<HTMLElement>('textsp').innerHTML = result;
    } catch (e) {
        console.error("Something went wrong while saying text");
        console.error(e);
        console.error(lines);
    }
}

//Adds the given line list to the already existing screen.
export function addSayText(lines: any[]){
    let result = "";
    lines.forEach(item => result += "<p>" + item + "</p>");
    document.GetRequiredElementById<HTMLElement>('textsp').innerHTML += result;
}

export function setText(lines: any[]){
    clearActionRegistry();
    let result = "";
    lines.forEach(item => result += item);
    document.GetRequiredElementById<HTMLElement>('textsp').innerHTML = result;
}

export let locjson: any = null; //This is the main json for the current location
export function setLocjson(val: any) { locjson = val; }
export function setFlirtresps(val: any) { flirtresps = val; }
export function setFeelUp(val: any) { feelUp = val; }
export function setKissing(val: any) { kissing = val; }
export function setYpeelines(val: any) { ypeelines = val; }
export function setPeelines(val: any) { peelines = val; }
export function setNeeds(val: any) { needs = val; }
export function setYneeds(val: any) { yneeds = val; }
export function setDrinklines(val: any) { drinklines = val; }
export function setDrive(val: any) { drive = val; }
export function setGeneral(val: any) { general = val; }

// Fetch a JSON file and return its parsed contents.
// path: relative path under JSON/ (without JSON/ prefix or .JSON suffix)
export async function fetchJson(path: string): Promise<any> {
    const file = "JSON/" + path + ".JSON";
    const response = await fetch(file);
    return response.json();
}

// Fetch a JSON file, cache it in calledjsons for later use by location functions, and return it.
// tag: the cache key AND the file path under JSON/
export async function fetchAndCacheJson(tag: string): Promise<any> {
    const data = await fetchJson(tag);
    calledjsons[tag] = data;
    return data;
}


// Deep-copy a subtag from the cache into locjson without any wildcard replacement.
// Use this when the location handles its own formatting (e.g. herhome pickup).
export function getMLocations(tag: string, subtag: string){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag][subtag]));
}

// Load a single-subtag location from the cache into locjson and resolve wildcards.
// Only used for locations whose JSON has no subtags (e.g. "start").
// After this call, locjson.intro, locjson.always, locjson.choices etc. are ready to use.
export function locationSetup(tag: string){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag]));
    locjson.girlname = addGirlname(locjson.girlname);
    resolveWildcards(["girlname", "money"]);
}

// Load a subtag from a multi-subtag location into locjson and resolve wildcards.
// e.g. loadLocationScene("yourhome", "callher") deep-copies calledjsons["yourhome"]["callher"]
// into locjson, then replaces girlname/money/girltalk placeholders throughout intro, always,
// choices, and dialogue sections.
export function loadLocationScene(tag: string, subtag: string){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag][subtag]));
    const wildcardProcessors: Record<string, (q: any[]) => any[]> = {
        girlname: addGirlname,
        money: addMoney,
        girltalk: addGirlTalk,
    };
    for (const [key, processor] of Object.entries(wildcardProcessors)) {
        if (locjson.hasOwnProperty(key))
            locjson[key] = processor(locjson[key]);
    }
    resolveWildcards(["girlname", "money", "girltalk"]);
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (const [key, value] of Object.entries(locjson.dialogue) as [string, any][]) {
            locjson.dialogue[key] = ["girlname", "money", "girltalk"].reduce(
                (v, wc) => replaceWCLI(v, wc), value
            );
        }
    }
}

// Load a scene from a custom (non-cached) JSON object into locjson with wildcard replacement.
// Used by locations that store their JSON in a module variable rather than calledjsons.
export function locationMCSetup(subtag: string, customloc: any){
    locjson = JSON.parse(JSON.stringify(customloc[subtag]));
    if (locjson.hasOwnProperty("girlname"))
        locjson.girlname = addGirlname(locjson.girlname);
    if (locjson.hasOwnProperty("girltalk"))
        locjson.girltalk = addGirlTalk(locjson.girltalk)
    replaceWCI("intro", "girlname");
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (const [key, value] of Object.entries(locjson.dialogue) as [string, any][]) {
            locjson.dialogue[key] = replaceWCLI(value, "girltalk");
        }
    }
}

//Replacing the variable wildcards of the given tag for the given json value
function replaceWCT(jsontag: string, tag: string){
    let result: any[] = [];
    locjson[jsontag].forEach(item => result.push(replaceCheck(item, tag)));
    locjson[jsontag] = result;
}

//Replacing the variable wildcards of the given tag for the given json value, where this is a list of lists
function replaceWCI(jsontag: string, tag: string){
    let result: any[] = [];
    locjson[jsontag].forEach(item => result.push(replaceWCL(item, tag)));
    locjson[jsontag] = result;
}

/** Apply wildcard replacement for each tag across intro and always sections. */
function resolveWildcards(tags: string[]){
    for (const tag of tags) {
        if (locjson["intro"]) replaceWCI("intro", tag);
        if (locjson["always"]) replaceWCT("always", tag);
    }
}

//Replacing the variable wildcards of the given tag for the given list
function replaceWCL(strlist: any[], tag: string){
    let result: any[] = [];
    strlist.forEach(item => result.push(replaceCheck(item, tag)));
    return result;
}

//Replacing the variable wildcards of the given tag for the given list of lists
function replaceWCLI(strlist: any[], tag: string){
    let result: any[] = [];
    strlist.forEach(item => result.push(replaceWCL(item, tag)));
    return result;
}

//Replacing the variable wildcard of the given tag for the given list, using the given checklist
function replaceWCLC(strlist: any[], checklist: any[], tag: string){
    let result: any[] = [];
    strlist.forEach(item => result.push(LreplaceCheck(item,checklist, tag)));
    return result;
}

function replaceChoices(tag: string){
    let result: any[] = [];
    locjson["choices"].forEach(item => result.push(replaceChoice(item, tag)));
    locjson["choices"] = result
}

function replaceChoice(choice: any[], tag: string){
    let result: any[] = [choice[0]];
    result.push(replaceCheck(choice[1], tag));
    return result
}

function replaceCheck(rpstring: string, tag: string){
    const list = locjson[tag];
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

function LreplaceCheck(rpstring: string, list: any[], tag: string){
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

//calls all json requests to get recurring quotes
export async function setupQuotes(){
    const tasks = [
        fetchJson("flirting").then(flirtSetup),
        fetchJson("needs").then(function (data) {
        needs = data;
        setToldstories(range(0, needs["peestory"].length - 1));
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
        setEndScreens(data);
    }),
        fetchJson("yneeds").then(function (data){
        yneeds = data;
    })
    ];

    await Promise.all(tasks);
}

function flirtSetup(data: any){
    flirtquotes = data["flirt"];
    let rawresp = data["respons"];
    flirtresps = {};
    for (let [key, value] of Object.entries(rawresp) as [string, any][]){
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
export function voccurse(curtext: any[]) {
    curtext.push(girltalk + " " + pickrandom(general["curseWord"]));
    return curtext;
}

function yPeeSetup(data: any){
    //TODO cleanup like shePeeSetup
    data["girlname"] = addGirlname(data["girlname"]);
    data["girltalk"] = addGirlTalk(data["girltalk"]);
    data["locked"]["girlname"] = addGirlname(data["locked"]["girlname"]);
    let templist = data["thehome"][0];
    let result: any[] = [];
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
    let temp: any[] = [];
    peelines["peephone"].forEach(item => temp.push(replaceWCLC(item, peelines["girltalk"], "girltalk")));
    peelines["peephone"] = temp;
    peelines["locked"]["cbar"] = replaceWCLC(peelines["locked"]["cbar"], peelines["locked"]["girltalk"], "girltalk");
    peelines["locked"]["cclub"] = replaceWCLC(peelines["locked"]["cclub"], peelines["locked"]["girltalk"], "girltalk");
    peelines["pgirlsroom"] = formatAllVarsList(peelines["pgirlsroom"]);
    peelines["ptogether"] = formatAllVarsList(peelines["ptogether"]);
}


export function handleFlirt(listenerList: any[]){
    const currentLocationTag = getCurrentLocationTag();
    let low = "low";
    let med = "med";
    let high = "high";
    if(currentLocationTag === "callher"){
        low += "cell";
        med += "cell";
    } else if (currentLocationTag === "theHotTub"){
        low += "Naked";
        med += "Naked";
        high += "Naked";
    }
    listenerList.push([[flirt_l, flirtFormat(flirtquotes[low][randcounter])], "flirt_l"])
    incrandom();
    if (randomInt(7) === 0 && currentLocationTag !== "callher"){
        listenerList.push([[flirt_h, flirtFormat(flirtquotes[high][randcounter])], "flirt_h"]);
    } else {
        listenerList.push([[flirt_m, flirtFormat(flirtquotes[med][randcounter])], "flirt_m"]);
    }
    return listenerList;
}

function flirtFormat(quote: any){
    return "Tell her " + quote + ".";
}

/**
 * Expose all quotes module state and functions on `window` so that
 * script-style TS files (which have no imports) can access them as globals.
 * Uses Object.defineProperty so that reads/writes from scripts stay in sync
 * with the module-scoped variables.
 */
export function exposeQuotesOnWindow(): void {
    const w = window as any;

    // Mutable state — defineProperty keeps module and global in sync
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['calledjsons', () => calledjsons, (v) => { calledjsons = v; }],
        ['locjson',     () => locjson,     (v) => { locjson = v; }],
        ['girlname',    () => girlname,    (v) => { girlname = v; }],
        ['basegirl',    () => basegirl,    (v) => { basegirl = v; }],
        ['girltalk',    () => girltalk,    (v) => { girltalk = v; }],
        ['girlgasp',    () => girlgasp,    (v) => { girlgasp = v; }],
        ['pantycolor',  () => pantycolor,  (v) => { pantycolor = v; }],
        ['flirtresps',  () => flirtresps,  (v) => { flirtresps = v; }],
        ['feelUp',      () => feelUp,      (v) => { feelUp = v; }],
        ['kissing',     () => kissing,     (v) => { kissing = v; }],
        ['ypeelines',   () => ypeelines,   (v) => { ypeelines = v; }],
        ['peelines',    () => peelines,    (v) => { peelines = v; }],
        ['needs',       () => needs,       (v) => { needs = v; }],
        ['yneeds',      () => yneeds,      (v) => { yneeds = v; }],
        ['drinklines',  () => drinklines,  (v) => { drinklines = v; }],
        ['appearance',  () => appearance,  (v) => { appearance = v; }],
        ['drive',       () => drive,       (v) => { drive = v; }],
        ['general',     () => general,     (v) => { general = v; }],
        ['sexLines',    () => sexLines,    (v) => { sexLines = v; }],
        ['objQuotes',   () => objQuotes,   (v) => { objQuotes = v; }],
        ['imageprev',   () => imageprev,   (v) => { imageprev = v; }],
        ['comma',       () => comma,       (v) => { comma = v; }],
        ['customgirlname', () => customgirlname, (v) => { customgirlname = v; }],
        ['darts',       () => darts,       (v) => { darts = v; }],
        ['imagedesc',   () => imagedesc,   () => { /* const */ }],
    ];

    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: true,
        });
    }

    // Functions — direct assignment (immutable references)
    w.sayText = sayText;
    w.addSayText = addSayText;
    w.setText = setText;
    w.printIntro = printIntro;
    w.printAlways = printAlways;
    w.printSDialogue = printSDialogue;
    w.printList = printList;
    w.printChoices = printChoices;
    w.printAllChoices = printAllChoices;
    w.printChoicesList = printChoicesList;
    w.c = c;
    w.cListener = cListener;
    w.cListenerGen = cListenerGen;
    w.cListenerGenList = cListenerGenList;
    w.fetchJson = fetchJson;
    w.fetchAndCacheJson = fetchAndCacheJson;
    w.locationSetup = locationSetup;
    w.loadLocationScene = loadLocationScene;
    w.locationMCSetup = locationMCSetup;
    w.getMLocations = getMLocations;
    w.setupQuotes = setupQuotes;
    w.handleFlirt = handleFlirt;
    w.voccurse = voccurse;
    w.callChoice = callChoice;
    w.printListSelection = printListSelection;
    w.printLList = printLList;
    w.printDialogue = printDialogue;
    w.addListenersList = addListenersList;
    w.printAllChoicesList = printAllChoicesList;
    w.addGirlTalk = addGirlTalk;
    w.formatAllVarsList = formatAllVarsList;
    w.printFormatDialogue = printFormatDialogue;
    w.formatAllVars = formatAllVars;
    w.addListeners = addListeners;
    w.addGirlname = addGirlname;
}