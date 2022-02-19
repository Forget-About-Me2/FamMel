//TODO proper integration
let settings; //The json for the settings.

// Stats parameters
let enableimages = 0; // 0 = Disable image loading
let enableascii = 1; // 0 = Disable ascii art display
let enablehide = 0; // 1 = Hide screen

let showstats = 1; // 1 = Show her bladder state, etc.
// Girl Selection Parameters
let photoChoice; //How she's dressed for photogame

let favoritemovie = "theurge";
let suggestedloc = "thebar";

let heroutfit = "jeans";  //  Her clothing choice for the date
                          //  Possible values: skirt, jeans

let multiplemoves = 1; //Whether sex moves can be repeated during a make-out session
let rstmoves = 0; //Whether the sex moves reset after a make-out session

function setup(){
    getjson("options", function (){
        settings=json;
    })
    if(typeof(Storage) !== "undefined") {
        if (localStorage.girlname) {
            girlname = localStorage.girlname;
            if (localStorage.custom === "true") {
                customgirlname = girlname;
                if (localStorage.basegirl) {
                    basegirl = localStorage.basegirl;
                }
                if (localStorage.customurge) {
                    customurge = localStorage.customurge;
                }
            }
            setbasegirl(basegirl);
            setgirl(girlname)
        }
        if (localStorage.heroutfit) {
            heroutfit = localStorage.heroutfit;
        }
        if (localStorage.images) {
            switch (localStorage.images) {
                case "off":
                    enableimages = 0;
                    enableascii = 0;
                    break;
                case "ascii":
                    enableascii = 1;
                    enableimages = 0;
                    break;
                case "images":
                    enableascii = 0;
                    enableimages = 1;
                    break;
            }
        }
        if (localStorage.imgs) {
            importimgs();
        }
        if (localStorage.showstats) {
            if (localStorage.showstats === "false") {
                showstats = 0;
            }
        }
        if (localStorage.multiplemoves) {
            if (localStorage.multiplemoves === "false") {
                multiplemoves = 0;
            }
        }
        if (localStorage.rstmoves) {
            if (localStorage.rstmoves === "true")
                rstmoves = 1;
        }
        if (localStorage.bladDec) {
            if (localStorage.bladDec === "false")
                bladDec = 0;
        }
        if (localStorage.bladDespDec) {
            if (localStorage.bladDespDec === "false")
                bladDespDec = 0;
        }
        if (localStorage.seal){
            if (localStorage.seal === "false")
                seal = 0;
        }
        if(localStorage.yourcustomurge){
            yourcustomurge = localStorage.yourcustomurge;
            initYUrge(yourcustomurge);
        }
        if(localStorage.money){
            money = localStorage.money;
        }
        if (localStorage.minPerc)
            minperc = localStorage.minPerc;

        if (localStorage.playerBladder) {
            if (localStorage.playerBladder === "false") {
                playerbladder = 0;
                getjson("statsBars", function () {
                    statsBars = json;
                });
            }
        }

        if (localStorage.playerGame) {
            if (localStorage.playerGame === "true")
                playerGame = 1;
        }

    }
}

//TODO this is probably called too often(maybe an issue with settings itself)
function setLocal(varName, value){
    if(typeof(Storage) !== "undefined"){
        if(localStorage.getItem(varName) !== value){
            localStorage.setItem(varName, value);
        }
    }
}

//TODO fix so you can't choose 0 or lower
//TODO maybe introduce bladder limits to protect users
//TODO option to turn off playerbladder
function options() {
    //When this function is called the var json will be set to the json used for options

    let vars = new Array(31).fill([""]); //This array is used to format the html with values
    let checked = []; //This is a list to keep track of which options are checked

    let cusgirl=[customgirlname];

    if (girlname === "Jennifer") checked.push(3);
    else if (girlname === "Karen") checked.push(4);
    else if (girlname === "Laura") checked.push(5);
    else if (girlname === "Melissa") checked.push(6);
    else {
        cusgirl.push("checked");
    }

    vars[7] = cusgirl;

    if (heroutfit === "jeans") checked.push(10);
    else checked.push(11);

    if (enableascii) checked.push(14);
    else if (enableimages) checked.push(15);
    else checked.push(13);

    if (showstats) checked.push(17);
    else checked.push(18);

    if (multiplemoves) checked.push(20);
    else checked.push(21);

    if (rstmoves) checked.push(23);
    else checked.push(24);

    if (!localStorage.disclaimer || localStorage.disclaimer === "true") checked.push(26)
    else checked.push(27);

    vars[28] = [money];

    checked.forEach(i => vars[i] = ["checked"]);
    let curtext = formatAll(settings.html, vars);
    curtext = c(["gamestart()", "Continue..."], curtext);
    setText(curtext);
    const bladderOpt = document.getElementById('bladOpt');
    bladderOpt.onclick = bladOpt;
    setgirl(girlname);
}


function customgirl() {
    let vars = new Array(14).fill("");
    if (basegirl === "Jennifer") vars[4] = ["checked"];
    else if (basegirl === "Jennifer") vars[5] = ["checked"];
    else if (basegirl === "Laura") vars[6] = ["checked"];
    else vars[7] = ["checked"];
    vars[9] = [customgirlname];
    vars[10] = [customurge];

    setText(formatAll(settings["cusgirl"], vars));
    setbasegirl(basegirl);
}

function exitcustomgirl() {
    setgirl(customgirlname);
    options();
}

function bladOpt() {
    //There is a chance in this menu playerBladder is turned off, if this happens statsBars needs to be known later on
    //So query it, if this hasn't happened before.
    if (!statsBars)
        getjson("statsBars", function () {
            statsBars = json;
        });
    let vars = new Array(23).fill("");
    const checked = [];
    vars[3] = [yourcustomurge];
    vars[4] = [minperc];

    if (bladDec) checked.push(7);
    else checked.push(8);

    if (bladDespDec) checked.push(10);
    else checked.push(11);

    if (seal) checked.push(13);
    else checked.push(14);

    if (playerbladder) checked.push(16);
    else checked.push(17);

    if (playerGame) checked.push(19);
    else checked.push(20);

    checked.forEach(i => vars[i] = ["checked"]);
    let curtext = formatAll(settings["bladder"], vars);
    setText(curtext);
}

function setheroutfit(outfitname) {
    setLocal("heroutfit", outfitname);
    heroutfit = outfitname;
}

function setImagesShow(value){
    switch(value){
        case 0:
            enableimages = 0;
            enableascii = 0;
            setLocal("images", "off");
            break;
        case 1:
            enableascii = 1;
            enableimages = 0;
            setLocal("images", "ascii");
            break;
        case 2:
            enableascii = 0;
            enableimages = 1;
            displaypix("pixurge");
            setLocal("images", "images");
            break;
    }
}

function setStatsShow(choice){
    showstats = choice;
    if (showstats){
        setLocal("showstats", "true");
    } else {
        setLocal("showstats", "false");
    }
}

function setMultipleMoves(choice){
    multiplemoves = choice;
    if(multiplemoves){
        setLocal("multiplemoves", "true");
    } else {
        setLocal("multiplemoves", "false");
    }
}

function setRstMoves(choice){
    rstmoves=choice;
    if(rstmoves){
        setLocal("rstmoves", "true");
    } else {
        setLocal("rstmoves", "false");
    }
}

function setDisclaimer(choice){
    if (choice)
        setLocal("disclaimer", "true");
    else
        setLocal("disclaimer", "false");
}


function setcustgirlname() {
    customgirlname = document.getElementById('thegirl').value;
    setbasegirl(basegirl);
}

function setcustbladurge() {
    customurge = parseInt(document.getElementById('thebladder').value);
    setLocal("customurge", customurge);
    setbasegirl(basegirl);
}

function setyourcustbladurge() {
    yourcustomurge = parseInt(document.getElementById('yourbladder').value);
    setLocal("yourcustomurge", yourcustomurge);
    initYUrge(yourcustomurge);
}

function setyourmoney() {
    money = parseInt(document.getElementById('yourmoney').value);
    setLocal("money", money);
}

function setBladPer(){
    const value = parseFloat(document.getElementById("bladPer").value);
    //Show an error if the value is not between 0 and 100
    if (value < 0 || value > 100)
        document.getElementById("perDecErr").style.display = "inline";
    else {
        document.getElementById("perDecErr").style.display = "none";
        minperc = value;
        setLocal("minPerc", minperc);
    }
}

function setBladDecay(choice){
    bladDec = choice;
    if (choice)
        setLocal("bladDec", "true");
    else
        setLocal("bladDec", "false");
}

function setBladDespDecay(choice){
    bladDespDec = choice;
    if (choice)
        setLocal("bladDespDec", "true");
    else
        setLocal("bladDespDec", "false");
}

function setSealDec(choice){
    seal = choice;
    if (choice)
        setLocal("seal", "true");
    else
        setLocal("seal", "false");
}

function setPlayBlad(choice){
    playerbladder = choice;
    if (choice)
        setLocal("playerBladder", "true");
    else
        setLocal("playerBladder", "false");
}

function setPlayGame(choice){
    playerGame = choice;
    if (choice)
        setLocal("playerGame", "true");
    else
        setLocal("playerGame", "false");
}



function hidescreen() {
    enablehide = 1;
}

function setjpgimgs() {
    enableimages = 1;
    enableascii = 0;
    displaypix("pixurge");
}

//TODO check if these functions can be cleaned up
function setbasegirl(hername) {
    basegirl = hername;
    setLocal("basegirl", basegirl);
    const htmlcall = document.getElementById('girlstats');
    let urge;
    if (basegirl === "Jennifer") {
        urge = 300;
        if(htmlcall){
            htmlcall.innerHTML = customgirlname +
                " is a statuesque blonde.";
        }
        favoritemovie = "theurge";
    }

    if (basegirl === "Laura") {
        urge =250;
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is a cute girl-next-door type.";
        }
        favoritemovie = "thedesp";
    }

    if (basegirl === "Karen") {
        urge = 200;
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is a petite and slim Asian girl.";
        }
        favoritemovie = "thectrl";
    }

    if (basegirl === "Melissa") {
        urge = 350;
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is an innocent red headed college girl.";
        }
        favoritemovie = "thelitr";
    }
    initUrge(urge);
}

function updategirldesc() {
    if (girlname === "Jennifer") {
        document.getElementById('girlstats').innerHTML = girlname +
            " is a statuesque blonde with a slightly larger than average bladder.";
    } else if (girlname === "Laura") {
        document.getElementById('girlstats').innerHTML = girlname +
            " is a cute girl-next-door type with average bladder capacity.";
    } else if (girlname === "Karen") {
        document.getElementById('girlstats').innerHTML = girlname +
            " is a petite and slim Asian girl with an equally petite bladder.";
    } else if (girlname === "Melissa") {
        document.getElementById('girlstats').innerHTML = girlname +
            " is an innocent red headed college girl who knows how to hold her pee.";
    } else {
        let bladquote;
        if (customurge < 100)
            bladquote = "She has a bladder the size of a pea.";
        else if (customurge < 200)
            bladquote = "She has a really tiny bladder.";
        else if (customurge < 300)
            bladquote = "She has an average bladder.";
        else if (customurge < 400)
            bladquote = "She has a big bladder.";
        else
            bladquote = "She has a bladder the size of Texas.";
        document.getElementById('girlstats').innerHTML = customgirlname + " is a custom girl based on " + basegirl + ".  " + bladquote;
    }

}

function setgirl(hername) {
    setLocal("girlname", hername);
    girlname = hername;
    if (document.getElementById('girlstats')) updategirldesc();
    if (girlname === "Jennifer") {
        basegirl = girlname;
        bladurge = 300;
        favoritemovie = "theurge";
        setLocal("custom", "false");
    } else if (girlname === "Laura") {
        basegirl = girlname;
        bladurge = 250;
        favoritemovie = "thedesp";
        setLocal("custom", "false");
    } else if (girlname === "Karen") {
        basegirl = girlname;
        bladurge = 200;
        favoritemovie = "thectrl";
        setLocal("custom", "false");
    } else if (girlname === "Melissa") {
        basegirl = girlname;
        bladurge = 350;
        favoritemovie = "thelitr";
        setLocal("custom", "false");
    } else {
        bladurge = Number(customurge);
        favoritemovie = "thelitr";
        setLocal("custom", "true");
    }
    initUrge(bladurge);


    //  Have to reset all preset strings.
    girltalk = "<b>" + girlname + ":&nbsp;</b>";
    girlgasp = "<b>" + girlname + " gasps:&nbsp;</b>";
}