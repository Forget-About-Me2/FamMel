let theatre; //Json with quotes for theatre
let rrMovieLineThresh = 7; // Likelihood of line for restroom in the movie theatre.

let moviecounter = 0; // Keep track of location in movie
let moviechoice; //  Which movie are we showing
let askedfavourite = 0; //asked her which movie to watch

function theatreSetup(){
    getjson("locations/theatre", theatreJsonSetup);
    return {
        "visit": [theTheatre, "Go to the theatre"],
        "wantVisit": [theTheatre, "Go to see a movie as she suggested."],
        "group": 2,
        "visited": 0,
        "keyChance": 1,
        foundKey: 0
    }
}

function theatreJsonSetup(){
    theatre = json;
}

function theTheatre(){
    allowItems = 1;
    let curtext = [];
    let listenerList = [];
    if (locations.theTheatre.visited && locstack[0] === "driveout" && thetime < theaterclosingtime){
        curtext = printList(curtext, theatre["theatre"][0]);
        sayText(curtext);
        listenerList.push([[driveout, "Continue..."], "driveOut"]);
        if (haveItem("theTheatreKey")) {
            listenerList.push([[reTheatre, "But I found this key I have to return!"], "reTheatre"]);
        }
    } else if ((thetime < theaterclosingtime) || locstack[0] === "theTheatre"){
        if (locstack[0] !== "theTheatre") {
            curtext = printList(curtext, theatre["theatre"][1]);
            pushloc("theTheatre");
            locations.theTheatre.visited = 1;
        } else
            curtext = printList(curtext, theatre["theatre"][2]);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else if (gottagoflag > 0){
            // TODO preventpee change
            curtext = preventpee(curtext);
            sayText(curtext);
        } else {
            listenerList.push([[function () {buyItem("soda")}, "Buy soda."], "buySoda"]);
            listenerList.push([[askMovie, "Ask her which movie she wants to watch."], "askMovie"]);
            listenerList.push([[chooseMovie, "Watch a movie."], "chooseMovie"]);
            if (yourbladder > yourbladurge)
                listenerList.push([[youpee, "Go to the bathroom."], "youPee"]);
            listenerList.push([[leavehm, "Leave the Movie Theatre."], "leaveHm"]);
            curtext = standobjs(curtext);
            sayText(curtext);
        }
    } else itsClosed("theTheatre", darkTheatre, "darkTheatre");
    cListenerGenList(listenerList);
}

function reTheatre() {
    objects.theTheatreKey.value = 0;
    pushloc("theTheatre");
    theTheatre();
}

function askMovie() {
    let curtext = [];
    let listenerList = [];
    if (moviecounter === 0) {
        askedfavourite = 1;
        let moviename = theatre["favouriteMovie"][favoritemovie]["name"];
        let list = new Array(theatre["watchMovie"][0].length).fill([moviename]);
        let temp = formatAll(theatre["watchMovie"][0], list);
        curtext = printList(curtext, temp);
        listenerList.push([[function () {
            moviechoice = favoritemovie;
            attraction += 2;
            preMoviePee();}, "Let's watch that then."], "movieFavour"]);
        listenerList.push([[chooseOtherMovie, theatre["favouriteMovie"][favoritemovie]["choice"]], "chooseOther"]);
    } else {
        curtext = printList(curtext, theatre["watchMovie"][1]);
        listenerList.push([[theTheatre, "Continue..."], "theTheatre"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
}

function chooseOtherMovie() {
    let curtext = printList([], theatre["watchMovie"][2]);
    let listenerList = [];
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

function chooseMovie() {
    let curtext = [];
    let listenerList = [];
    if (moviecounter === 0) {
        curtext = printList(curtext, theatre["watchMovie"][3]);
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

function movieArgue() {
    let curtext = [];
    if (askedfavourite) {
        //You asked her which movie she wanted to watch and then deliberately chose a different one.
        curtext = printList(curtext, theatre["watchMovie"][4]);
        attraction -= 5;
        preMoviePee(curtext);
    } else {
        let moviename = theatre["favouriteMovie"][favoritemovie]["name"];
        let list = new Array(theatre["watchMovie"][5].length).fill([moviename]);
        let temp = formatAll(theatre["watchMovie"][5], list);
        curtext = printList(curtext, temp);
        sayText(curtext);
        let listenerList = [];
        listenerList.push([[function (){
            owedfavor += 1;
            moviechoice = favoritemovie;
            preMoviePee();
        }, "Okay, but you own me one."], "favour"]);
        listenerList.push([[preMoviePee,theatre["favouriteMovie"][favoritemovie]["choice"]], "denyFavor"]);
        cListenerGenList(listenerList);
    }
}

let seenmovie = 0;
//TODO figure out duplicate continue's
function preMoviePee(curtext=[]) {
    pushloc("domovie");
    moviecounter = 0;
    seenmovie = 0;
    changevenueflag = 1;//TODO probs delete
    curtext = displayyourneed(curtext);
    curtext = showneed(curtext);
    curtext = printList(curtext, theatre["watchMovie"][10]);
    sayText(curtext);
    let listenerList = [];
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
function domovie() {
    allowItems = 1;
    let curtext = [];
    if (seenmovie === 0) {
        curtext = printList(curtext, theatre["watchMovie"][6]);
        seenmovie = 1;
    } else {
        curtext = printList(curtext, theatre["watchMovie"][7]);
        moviecounter += 1;
    }

    if (moviecounter >= 7) {
        curtext = printList(curtext, theatre["watchMovie"][8]);
        poploc();
        changevenueflag = 1;
    } else {
        curtext.push(theatre["favouriteMovie"][moviechoice]["plot"][moviecounter]);
    }

    curtext = printList(curtext, theatre["watchMovie"][9]);
    if (randomchoice(4)) curtext = noteholding(curtext);
    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);

    let listenerList = [];
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        if (gottagoflag > 0) {
            // TODO preventpee change
            curtext = preventpee(curtext);
        } else {
            listenerList.push([[movieRomance, "Reach over and hold her hand."], "movieRomance"]);
            listenerList.push([[movieSex, "Reach over and touch her thigh."], "movieSex"]);
            listenerList.push([[movieScary, "Lean closer to her"], "movieScary"]);
            listenerList.push([[movieDoh, "Look her in the eyes."], "movieDoh"]);
        }
        if (moviecounter < 7)
            listenerList.push([[leavehm, "Leave the theatre."]]);
        sayText(curtext);
        cListenerGenList(listenerList);
    }
}

// moviedesc - 0 : Anticipate
//             1 : Strange
//             2 : Scary
//             3 : Sexy
//             4 : Romantic
//             5 : Sexy
//             6 : Romantic
//             7 : End


function movieRomance() {
    allowItems = 1;
    let curtext = [];
    curtext = printList(curtext, theatre["movieRomance"][0]);
    if (moviecounter === 4 || moviecounter === 6 || ((moviecounter >= 7 || moviecounter ===0) && attraction > 30)) {
        curtext = printList(curtext, theatre["movieRomance"][1]);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, theatre["movieRomance"][2]);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

function movieSex() {
    allowItems = 1;
    let curtext = [];
    curtext = printList(curtext, theatre["movieSex"][0]);
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

function movieScary() {
    allowItems = 1;
    let curtext = printList([], theatre["movieScary"][0]);
    if (moviecounter === 2 || ((moviecounter >= 7 || moviecounter ===0) && attraction > 40)) {
        curtext = printList(curtext, theatre["movieScary"][1]);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, theatre["movieScary"][2]);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

function movieDoh() {
    allowItems = 1;
    let curtext = printList([], theatre["movieDoh"][0]);
    if (moviecounter === 1 || ((moviecounter >= 7 || moviecounter === 0) && attraction > 50)) {
        curtext = printList(curtext, theatre["movieDoh"][1]);
        attraction += 3;
        shyness -= 3;
    } else {
        curtext = printList(curtext, theatre["movieDoh"][2]);
    }
    sayText(curtext);
    if (moviecounter < 7)
        cListenerGen([domovie, "Continue..."], "doMovie");
    else
        cListenerGen([theTheatre, "Continue..."], "theTheatre");
}

//TODO fix thehold my purse
function darkTheatre() {
    allowItems = 1;
    let curtext = [];
    let listenerList = [];
    if (locstack[0] !== "darkTheatre") {
        curtext = printList(curtext, theatre["darkTheatre"][0]);
        pushloc("darkTheatre");
    } else {
        curtext = printList(curtext, theatre["darkTheatre"][1])
    }

    curtext = showneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else if (gottagoflag > 0) {
        // TODO preventpee change
        curtext = preventpee(curtext);
        sayText(curtext);
    } else {
        curtext = standobjs(curtext);
        sayText(curtext);
        listenerList.push([[stealSoda, "Get a soda."], "stealSoda"]);
        listenerList.push([[kissher, "Kiss her."], "kissHer"]);
        listenerList.push([[feelup, "Feel her up."], "feelUp"]);
        if (!checkedherout) listenerList.push([[checkherout, "Check her out."], "checkHerOut"]);
        if (yourbladder > yourbladurge) listenerList.push([[youpee, "Go to the bathroom."], "youPee"]);
        listenerList.push([[leavehm, "Leave the Theatre"], "leaveHm"]);
    }
    cListenerGenList(listenerList);
}

function stealSoda() {
    let curtext = printList([], theatre["stealSoda"][0]);
    objects.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}

//TODO put a limit on this/ Game update
//TODO randomize quotes
function stealSoda2(){
    let curtext = printList([], theatre["stealSoda"][1]);
    objects.soda.value += 1;
    let listenerList = [
        [[stealSoda2, "Steal another soda."], "stealSoda"],
        [[darkTheatre, "Continue..."], "darkTheatre"]
    ];
    sayText(curtext);
    cListenerGenList(listenerList);
}
