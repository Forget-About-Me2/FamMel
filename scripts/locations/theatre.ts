import { fetchJson, printList, sayText, cListenerGen, cListenerGenList } from '../quotes';
import { pickrandom, randomchoice, pushloc, poploc, formatAll } from '../shims';
import { showneed, noteholding, interpbladder, wetherself, preventpee, holdit, allowpee } from '../bladder';
import { displayyourneed, wetyourself, youpee } from '../yourbladder';
import { standobjs, haveItem, buyItem, backPackItems } from '../backPackItems';
import { kissher, feelup, checkherout } from '../actions';
import { leavehm, driveout } from '../drive';
import { itsClosed } from '../locations';

export let theatre; //Json with quotes for theatre
export let rrMovieLineThresh = 7; // Likelihood of line for restroom in the movie theatre.

export let moviecounter = 0; // Keep track of location in movie
export let moviechoice; //  Which movie are we showing
export let askedfavourite = 0; //asked her which movie to watch

export function theatreSetup(){
    fetchJson("locations/theatre").then(theatreJsonSetup);
    return {
        "visit": [theTheatre, "Go to the theatre"],
        "wantVisit": [theTheatre, "Go to see a movie as she suggested."],
        "group": 2,
        "visited": 0,
        "keyChance": 1,
        foundKey: 0
    }
}

function theatreJsonSetup(data: any){
    theatre = data;
}

export function theTheatre(){
    allowItems = 1;
    let curtext: any[] = [];
    let listenerList: any[] = [];
    // theatre: [0]=revisit from drive, [1]=first arrival, [2]=ambient
    const [theatreRevisit, theatreArrival, theatreAmbient] = theatre["theatre"];
    if (locations.theTheatre.visited && locStack[0] === "driveout" && thetime < theaterclosingtime){
        curtext = printList(curtext, theatreRevisit);
        sayText(curtext);
        listenerList.push([[driveout, general["continue"]], "driveOut"]);
        if (haveItem("theTheatreKey")) {
            listenerList.push([[reTheatre, sharedLoc["choices"]["returnKey"]], "reTheatre"]);
        }
    } else if ((thetime < theaterclosingtime) || locStack[0] === "theTheatre"){
        if (locStack[0] !== "theTheatre") {
            curtext = printList(curtext, theatreArrival);
            pushloc("theTheatre");
            locations.theTheatre.visited = 1;
        } else
            curtext = printList(curtext, theatreAmbient);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else if (gottagoflag > 0){
            listenerList = preventpee(curtext);
            sayText(curtext);
        } else {
            listenerList.push([[function () {buyItem("soda")}, objQuotes["buyChoices"]["soda"]], "buySoda"]);
            listenerList.push([[askMovie, theatre["choices"]["askMovie"]], "askMovie"]);
            listenerList.push([[chooseMovie, theatre["choices"]["chooseMovie"]], "chooseMovie"]);
            if (yourbladder > yourbladurge)
                listenerList.push([[youpee, theatre["choices"]["youPee"]], "youPee"]);
            listenerList.push([[leavehm, theatre["choices"]["leaveHm"]], "leaveHm"]);
            curtext = standobjs(curtext, listenerList);
            sayText(curtext);
        }
    } else itsClosed("theTheatre", darkTheatre, "darkTheatre");
    cListenerGenList(listenerList);
}

export function reTheatre() {
    backPackItems.theTheatreKey.value = 0;
    pushloc("theTheatre");
    theTheatre();
}

export function askMovie() {
    let curtext: any[] = [];
    let listenerList: any[] = [];
    // watchMovie: [0]=ask favourite, [1]=already watching, [2]=choose other prompt,
    //   [3]=choose movie (you pick), [4]=argue (asked then chose different),
    //   [5]=argue (she suggests favourite), [6]=movie starts, [7]=next scene,
    //   [8]=movie ends, [9]=scene mood text, [10]=pre-movie bathroom break
    const [askFavourite, alreadyWatching, chooseOtherPrompt,
           youPickPrompt, argueBadFaith, argueSuggestsFavourite,
           movieStarts, nextScene, movieEnds, sceneMood, preMovieBathroom] = theatre["watchMovie"];
    if (moviecounter === 0) {
        askedfavourite = 1;
        let moviename = theatre["favouriteMovie"][favoritemovie]["name"];
        let list = new Array(askFavourite.length).fill([moviename]);
        let temp = formatAll(askFavourite, list);
        curtext = printList(curtext, temp);
        listenerList.push([[function () {
            moviechoice = favoritemovie;
            attraction += 2;
            preMoviePee();}, "Let's watch that then."], "movieFavour"]);
        listenerList.push([[chooseOtherMovie, theatre["favouriteMovie"][favoritemovie]["choice"]], "chooseOther"]);
    } else {
        curtext = printList(curtext, alreadyWatching);
        listenerList.push([[theTheatre, "Continue..."], "theTheatre"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function chooseOtherMovie() {
    let curtext = printList([], theatre["watchMovie"][2]); // chooseOtherPrompt
    let listenerList: any[] = [];
    Object.keys(theatre["favouriteMovie"]).forEach(id => {
        if (id !== favoritemovie) {
            listenerList.push([[function () {
                moviechoice = id;
                movieArgue();
            }, theatre["favouriteMovie"][id]["description"]], id]);
        }
    });
    sayText(curtext);
    cListenerGenList(listenerList);

}

export function chooseMovie() {
    let curtext: any[] = [];
    let listenerList: any[] = [];
    if (moviecounter === 0) {
        curtext = printList(curtext, theatre["watchMovie"][3]); // youPickPrompt
        Object.keys(theatre["favouriteMovie"]).forEach(id => {
            if (id !== favoritemovie) {
                listenerList.push([[function () {
                    moviechoice = id;
                    movieArgue();
                }, theatre["favouriteMovie"][id]["description"]], id]);
            } else {
                listenerList.push([[function () {
                    moviechoice = id;
                    preMoviePee();
                }, theatre["favouriteMovie"][id]["description"]], id]);

            }
        });
    } else {
        curtext = printList(curtext, theatre["watchMovie"][1]);
        listenerList.push([[theTheatre, "Continue..."], "theTheatre"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

export function movieArgue() {
    let curtext: any[] = [];
    if (askedfavourite) {
        //You asked her which movie she wanted to watch and then deliberately chose a different one.
        curtext = printList(curtext, theatre["watchMovie"][4]); // argueBadFaith
        attraction -= 5;
        preMoviePee(curtext);
    } else {
        let moviename = theatre["favouriteMovie"][favoritemovie]["name"];
        let list = new Array(theatre["watchMovie"][5].length).fill([moviename]);
        let temp = formatAll(theatre["watchMovie"][5], list); // argueSuggestsFavourite
        curtext = printList(curtext, temp);
        sayText(curtext);
        let listenerList: any[] = [];
        listenerList.push([[function (){
            owedfavor += 1;
            moviechoice = favoritemovie;
            preMoviePee();
        }, "Okay, but you own me one."], "favour"]);
        listenerList.push([[preMoviePee,theatre["favouriteMovie"][favoritemovie]["choice"]], "denyFavor"]);
        cListenerGenList(listenerList);
    }
}

export let seenmovie = 0;
//TODO figure out duplicate continue's
export function preMoviePee(curtext: any[] = []) {
    pushloc("domovie");
    moviecounter = 0;
    seenmovie = 0;
    changevenueflag = 1;//TODO probs delete
    curtext = displayyourneed(curtext);
    curtext = showneed(curtext);
    curtext = printList(curtext, theatre["watchMovie"][10]); // preMovieBathroom
    sayText(curtext);
    let listenerList: any[] = [];
    if (gottagoflag > 0) {
        listenerList.push([[holdit, "Ask her to hold it."], "holdIt"]);
        listenerList.push([[allowpee, "Let her go."], "allowPee"]);
    } else {
        if (yourbladder > yourbladneed)
            listenerList.push([[youpee, "Use the bathroom before watching the movie."], "youPee"]);
    }
    listenerList.push([[domovie, "Buy the tickets and head over to find the auditorium."], "doMovie"]);
    cListenerGenList(listenerList);
}

//TODO you can go to the bathroom if you're desperate
export function domovie() {
    allowItems = 1;
    let curtext: any[] = [];
    if (seenmovie === 0) {
        curtext = printList(curtext, theatre["watchMovie"][6]); // movieStarts
        seenmovie = 1;
    } else {
        curtext = printList(curtext, theatre["watchMovie"][7]); // nextScene
        moviecounter += 1;
    }

    if (moviecounter >= 7) {
        curtext = printList(curtext, theatre["watchMovie"][8]); // movieEnds
        poploc();
        changevenueflag = 1;
    } else {
        curtext.push(theatre["favouriteMovie"][moviechoice]["plot"][moviecounter]);
    }

    curtext = printList(curtext, theatre["watchMovie"][9]); // sceneMood
    if (randomchoice(4)) curtext = noteholding(curtext);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);

    let listenerList: any[] = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            listenerList = preventpee(listenerList);
        } else {
            listenerList.push([[movieRomance, theatre["choices"]["movieRomance"]], "movieRomance"]);
            listenerList.push([[movieSex, theatre["choices"]["movieSex"]], "movieSex"]);
            listenerList.push([[movieScary, theatre["choices"]["movieScary"]], "movieScary"]);
            listenerList.push([[movieDoh, theatre["choices"]["movieDoh"]], "movieDoh"]);
        }
        if (moviecounter < 7)
            listenerList.push([[leavehm, theatre["choices"]["leaveHm"]], "leaveHm"]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

// Movie interactions: each array is [attempt, success, failure]
// moviedesc - 0 : Anticipate
//             1 : Introduction
//             2 : Scary
//             3 : Sexy
//             4 : Romantic
//             5 : Sexy
//             6 : Romantic
//             7 : End

// Hold her hand
export function movieRomance() {
    allowItems = 1;
    let curtext: any[] = [];
    const [attempt, success, failure] = theatre["movieRomance"];
    curtext = printList(curtext, attempt);
    if (moviecounter === 4 || moviecounter === 6 || ((moviecounter >= 7 || moviecounter ===0) && attraction > 30)) {
        curtext = printList(curtext, success);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, failure);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

// Touch her thigh
export function movieSex() {
    allowItems = 1;
    let curtext: any[] = [];
    const [attempt, success] = theatre["movieSex"];
    curtext = printList(curtext, attempt);
    if (moviecounter === 3 || moviecounter === 5 || ((moviecounter >= 7 || moviecounter ===0) && attraction > 70)) {
        curtext.push(pickrandom(appearance["clothes"][heroutfit]["thighresp"]));
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, theatre["movieSex"][1]);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

// Lean closer to her
export function movieScary() {
    allowItems = 1;
    const [attempt, success, failure] = theatre["movieScary"];
    let curtext = printList([], attempt);
    if (moviecounter === 2 || ((moviecounter >= 7 || moviecounter ===0) && attraction > 40)) {
        curtext = printList(curtext, success);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, failure);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

// look her in the eyes
export function movieDoh() {
    allowItems = 1;
    const [attempt, success, failure] = theatre["movieDoh"];
    let curtext = printList([], attempt);
    if (moviecounter === 1 || ((moviecounter >= 7 || moviecounter === 0) && attraction > 50)) {
        curtext = printList(curtext, success);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, failure);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

//TODO fix thehold my purse
export function darkTheatre() {
    allowItems = 1;
    let curtext: any[] = [];
    let listenerList: any[] = [];
    // darkTheatre: [0]=first entry, [1]=ambient
    const [darkEntry, darkAmbient] = theatre["darkTheatre"];
    if (locStack[0] !== "darkTheatre") {
        curtext = printList(curtext, darkEntry);
        pushloc("darkTheatre");
    } else {
        curtext = printList(curtext, darkAmbient)
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else if (gottagoflag > 0) {
        listenerList = preventpee(listenerList);
        sayText(curtext);
    } else {
            curtext = standobjs(curtext, listenerList);
        sayText(curtext);
        listenerList.push([[stealSoda, objQuotes["stealChoices"]["soda"]], "stealSoda"]);
        listenerList.push([[kissher, general["kissHer"]], "kissHer"]);
        listenerList.push([[feelup, general["feelUp"]], "feelUp"]);
        if (!checkedherout) listenerList.push([[checkherout, general["checkHerOut"]], "checkHerOut"]);
        if (yourbladder > yourbladurge) listenerList.push([[youpee, theatre["choices"]["youPee"]], "youPee"]);
        listenerList.push([[leavehm, theatre["choices"]["leaveHm"]], "leaveHm"]);
    }
    cListenerGenList(listenerList);
}

export function stealSoda() {
    // stealSoda: [0]=first steal, [1]=steal another
    const [firstSteal, stealAnother] = theatre["stealSoda"];
    let curtext = printList([], firstSteal);
    backPackItems.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO put a limit on this/ Game update
//TODO randomize quotes
export function stealSoda2(){
    let curtext = printList([], theatre["stealSoda"][1]); // stealAnother
    backPackItems.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}
export function exposeTheatreOnWindow(): void {
    const w = window as any;
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['theatre', () => theatre, (v) => { theatre = v; }],
        ['rrMovieLineThresh', () => rrMovieLineThresh, (v) => { rrMovieLineThresh = v; }],
        ['moviecounter', () => moviecounter, (v) => { moviecounter = v; }],
        ['moviechoice', () => moviechoice, (v) => { moviechoice = v; }],
        ['askedfavourite', () => askedfavourite, (v) => { askedfavourite = v; }],
        ['seenmovie', () => seenmovie, (v) => { seenmovie = v; }],
    ];
    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, { get: getter, set: setter, configurable: true, enumerable: true });
    }
    w.theatreSetup = theatreSetup;
    w.theTheatre = theTheatre;
    w.reTheatre = reTheatre;
    w.askMovie = askMovie;
    w.chooseOtherMovie = chooseOtherMovie;
    w.chooseMovie = chooseMovie;
    w.movieArgue = movieArgue;
    w.preMoviePee = preMoviePee;
    w.domovie = domovie;
    w.movieRomance = movieRomance;
    w.movieSex = movieSex;
    w.movieScary = movieScary;
    w.movieDoh = movieDoh;
    w.darkTheatre = darkTheatre;
    w.stealSoda = stealSoda;
    w.stealSoda2 = stealSoda2;
}