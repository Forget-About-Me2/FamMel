let theatre;
let rrMovieLineThresh = 7; // Likelihood of line for restroom in the movie theatre.

function theatreSetup(){
    getjson("locations/theatre", theatreJsonSetup);
    return {
        "visit": [theTheatre, "Go to the theatre"],
        "wantVisit": [theTheatre, "Go to see a movie as she suggested."],
        "group": 3,
        "visited": 0
    }
}

function theatreJsonSetup(){
    theatre = json;
    theatre["theatre"] = formatAllVarsList(theatre["theatre"]);
    theatre["buySoda2"] = formatAllVarsList(theatre["buySoda2"]);
    theatre["darkTheatre"] = formatAllVarsList(theatre["darkTheatre"]);
    theatre["noRest"] = formatAllVarsList(theatre["noRest"]);
    theatre["watchMovie"] = formatAllVarsList(theatre["watchMovie"]);
    Object.keys(theatre["noToilet"]).forEach(key => {
        const item = theatre["noToilet"][key];
        item["quotes"] = formatAllVarsList(item["quotes"]);
    });
}

function theTheatre(){
    let curtext = [];
    let listenerList = [];
    if (locations.theatre.visited && locstack[0] === "driveout" && thetime < theaterclosingtime){
        curtext = printList(curtext, theatre["theatre"][0]);
        sayText(curtext);
        listenerList.push([[driveout, "Continue..."], "driveOut"]);
        if (haveItem("theTheatreKey")) {
            listenerList.push([[reTheatre, "But I found this key I have to return!"], "reTheatre"]);
        }
    } else if ((thetime < theaterclosingtime) || locstack[0] === "themovie"){
        if (locstack[0] !== "theTheatre") {
            curtext = printList(curtext, theatre["theatre"][1]);
            pushloc("theTheatre");
            locations.theatre.visited = 1;
        } else
            curtext = printList(curtext, theatre["theatre"][2]);
        if (randomchoice(3)) curtext = noteholding(curtext);
        else if (randomchoice(5)) curtext = interpbladder(curtext);
        curtext = displayyourneed(curtext);
        if (bladder > bladlose) wetherself();
        else if (yourbladder > yourbladlose) wetyourself();
        else if (gottagoflag > 0){
            curtext = preventpee(curtext);
            sayText(curtext);
        } else {
            listenerList.push([[buySoda, "Buy soda."], "buySoda"]);
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

//Let's you choose the amount of Soda you want.
function buySoda() {
    setText(theatre["buySoda"]);
    let sodaElem = document.getElementById("sodaAm");
    let value = 1;
    let price = 5;
    sodaElem.addEventListener("keyup", function (){
        value = sodaElem.value;
        price = sodaElem.value*5;
        const moneyElem = document.getElementById("monAmount");
        if (price < 0)
            moneyElem.innerText = "NaN";
        else
            moneyElem.innerText= price;
    });
    addListeners([function(){
        buySoda2(value, price);
    }], "buy");
}

//You actually buy the soda, errors for invalid numbers.
function buySoda2(value, price){
    let curtext = [];
    let listenerList = [];
    //Check if you have the money to buy as many as you indicated.
    if (money < price){
        curtext = printList(curtext, theatre["buySoda2"][0]);
        listenerList.push([[buySoda, "Try again."], "buySoda"]);
        listenerList.push([[theTheatre, "Forget it."], "theatre"]);
    } else if (price < 0){
        curtext = printList(curtext, theatre["buySoda2"][1]);
        listenerList.push([[buySoda, "Try again."], "buySoda"]);
        listenerList.push([[theTheatre, "Forget it."], "theatre"]);
    } else if (price > 100){
        curtext = printList(curtext, theatre["buySoda2"][2]);
        listenerList.push([[buySoda, "Try again."], "buySoda"]);
        listenerList.push([[theTheatre, "Forget it."], "theatre"]);
    } else {
        curtext = printList(curtext, theatre["buySoda2"][3]);
        money -= price;
        objects.soda.value += value;
        listenerList.push([[theTheatre, "Continue..."], "theatre"]);
    }
    sayText(curtext);
    cListenerGenList(listenerList);
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

//TODO let her choose.
function pnorestroom() {
    let curtext = printList([], theatre["noRest"][0]);
    if (attraction >= pnorestroomthreshold) {
        curtext = displayneed(curtext);
        curtext = printList(curtext, theatre["noRest"][1]);
        curtext = displayneed(curtext);
        sayText(curtext);
        let listenerList = [];
        Object.keys(theatre["noToilet"]).forEach(option => {
            const temp = function (){
                noToiletPee(option);
            }
            listenerList.push([[temp, theatre["noToilet"][option]["text"]], option]);
        });
        listenerList.push([[indepee, "Change your mind..."], "indePee"]);
        cListenerGenList(listenerList);
    } else {
        curtext = printList(curtext, theatre["noRest"][2]);
        indepee(curtext);
    }
}

function noToiletPee(choice){
    let quotes = theatre["noToilet"][choice]["quotes"];
    let curtext = printList([], quotes[0]);
    curtext = displayneed(curtext);
    curtext = printList(curtext, quotes[1]);
    curtext = displayyourneed(curtext);
    if (pantycolor === "none")
        curtext.push(appearance["clothes"][heroutfit]["peeprepquotebare"]);
    else
        curtext.push(appearance["clothes"][heroutfit]["peeprepquotebare"]);
    curtext = printList(curtext, quotes[2]);
    sayText(curtext);
    sawherpee = 1;
    flushdrank();
    cListenerGen([noToiletPee2, "Continue..."]);
}

function noToiletPee2(){
    let curtext = printList([], theatre["noRest"][3]);
    kissher(curtext);
}
