import { fetchJson, c, setText } from './quotes';
import { formatAll } from './shims';
import { initUrge } from './bladder';
import { initYUrge } from './yourbladder';
import { displaypix, importimgs } from './images';

export let enableimages: number = 1;
export let enableascii: number = 0;
export let playerGame: number = 0;

export let showstats = 1; // 1 = Show her bladder state, etc.
// Girl Selection Parameters
export let photoChoice; //How she's dressed for photogame

export let favoritemovie = "theurge";
export let suggestedloc = "thebar";

export let heroutfit = "jeans";  //  Her clothing choice for the date
                          //  Possible values: skirt, jeans

export let multiplemoves = 1; //Whether sex moves can be repeated during a make-out session
export let rstmoves = 0; //Whether the sex moves reset after a make-out session

export function setup(){
    fetchJson("options").then(function (data){
        settings=data;
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
                fetchJson("statsBars").then(function (data) {
                    statsBars = data;
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
export function setLocal(varName: string, value: any){
    if(typeof(Storage) !== "undefined"){
        if(localStorage.getItem(varName) !== value){
            localStorage.setItem(varName, value);
        }
    }
}

//TODO fix so you can't choose 0 or lower
//TODO maybe introduce bladder limits to protect users
//TODO option to turn off playerbladder
export function options() {
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


export function customgirl() {
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

export function exitcustomgirl() {
    setgirl(customgirlname);
    options();
}

export function bladOpt() {
    //There is a chance in this menu playerBladder is turned off, if this happens statsBars needs to be known later on
    //So query it, if this hasn't happened before.
    if (!statsBars)
        fetchJson("statsBars").then(function (data) {
            statsBars = data;
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

export function setheroutfit(outfitname: string) {
    setLocal("heroutfit", outfitname);
    heroutfit = outfitname;
}

export function setImagesShow(value: number){
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

export function setStatsShow(choice: number){
    showstats = choice;
    if (showstats){
        setLocal("showstats", "true");
    } else {
        setLocal("showstats", "false");
    }
}

export function setMultipleMoves(choice: number){
    multiplemoves = choice;
    if(multiplemoves){
        setLocal("multiplemoves", "true");
    } else {
        setLocal("multiplemoves", "false");
    }
}

export function setRstMoves(choice: number){
    rstmoves=choice;
    if(rstmoves){
        setLocal("rstmoves", "true");
    } else {
        setLocal("rstmoves", "false");
    }
}

export function setDisclaimer(choice: number){
    if (choice)
        setLocal("disclaimer", "true");
    else
        setLocal("disclaimer", "false");
}


export function setcustgirlname() {
    customgirlname = (document.getElementById('thegirl') as HTMLInputElement).value;
    setbasegirl(basegirl);
}

export function setcustbladurge() {
    customurge = parseInt((document.getElementById('thebladder') as HTMLInputElement).value);
    setLocal("customurge", customurge);
    setbasegirl(basegirl);
}

export function setyourcustbladurge() {
    yourcustomurge = parseInt((document.getElementById('yourbladder') as HTMLInputElement).value);
    setLocal("yourcustomurge", yourcustomurge);
    initYUrge(yourcustomurge);
}

export function setyourmoney() {
    money = parseInt((document.getElementById('yourmoney') as HTMLInputElement).value);
    setLocal("money", money);
}

export function setBladPer(){
    const value = parseFloat((document.getElementById("bladPer") as HTMLInputElement).value);
    //Show an error if the value is not between 0 and 100
    if (value < 0 || value > 100)
        document.getElementById("perDecErr").style.display = "inline";
    else {
        document.getElementById("perDecErr").style.display = "none";
        minperc = value;
        setLocal("minPerc", minperc);
    }
}

export function setBladDecay(choice: number){
    bladDec = choice;
    if (choice)
        setLocal("bladDec", "true");
    else
        setLocal("bladDec", "false");
}

export function setBladDespDecay(choice: number){
    bladDespDec = choice;
    if (choice)
        setLocal("bladDespDec", "true");
    else
        setLocal("bladDespDec", "false");
}

export function setSealDec(choice: number){
    seal = choice;
    if (choice)
        setLocal("seal", "true");
    else
        setLocal("seal", "false");
}

export function setPlayBlad(choice: number){
    playerbladder = choice;
    if (choice)
        setLocal("playerBladder", "true");
    else
        setLocal("playerBladder", "false");
}

export function setPlayGame(choice: number){
    playerGame = choice;
    if (choice)
        setLocal("playerGame", "true");
    else
        setLocal("playerGame", "false");
}

export function setjpgimgs() {
    enableimages = 1;
    enableascii = 0;
    displaypix("pixurge");
}

//TODO check if these functions can be cleaned up
export function setbasegirl(hername: string) {
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
                " is a red headed college girl.";
        }
        favoritemovie = "thelitr";
    }
    initUrge(urge);
}

export function updategirldesc() {
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
            " is a red headed college girl who knows how to hold her pee.";
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

export function setgirl(hername: string) {
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

export function exposeSettingsOnWindow(): void {
    const w = window as any;
    const props: Array<[string, () => any, (v: any) => void]> = [
        ['showstats', () => showstats, (v) => { showstats = v; }],
        ['photoChoice', () => photoChoice, (v) => { photoChoice = v; }],
        ['favoritemovie', () => favoritemovie, (v) => { favoritemovie = v; }],
        ['suggestedloc', () => suggestedloc, (v) => { suggestedloc = v; }],
        ['heroutfit', () => heroutfit, (v) => { heroutfit = v; }],
        ['multiplemoves', () => multiplemoves, (v) => { multiplemoves = v; }],
        ['rstmoves', () => rstmoves, (v) => { rstmoves = v; }],
        ['enableimages', () => enableimages, (v) => { enableimages = v; }],
        ['enableascii', () => enableascii, (v) => { enableascii = v; }],
        ['playerGame', () => playerGame, (v) => { playerGame = v; }],
    ];
    for (const [name, getter, setter] of props) {
        Object.defineProperty(w, name, { get: getter, set: setter, configurable: true, enumerable: true });
    }
    w.setup = setup;
    w.setLocal = setLocal;
    w.options = options;
    w.customgirl = customgirl;
    w.exitcustomgirl = exitcustomgirl;
    w.bladOpt = bladOpt;
    w.setheroutfit = setheroutfit;
    w.setImagesShow = setImagesShow;
    w.setStatsShow = setStatsShow;
    w.setMultipleMoves = setMultipleMoves;
    w.setRstMoves = setRstMoves;
    w.setDisclaimer = setDisclaimer;
    w.setcustgirlname = setcustgirlname;
    w.setcustbladurge = setcustbladurge;
    w.setyourcustbladurge = setyourcustbladurge;
    w.setyourmoney = setyourmoney;
    w.setBladPer = setBladPer;
    w.setBladDecay = setBladDecay;
    w.setBladDespDecay = setBladDespDecay;
    w.setSealDec = setSealDec;
    w.setPlayBlad = setPlayBlad;
    w.setPlayGame = setPlayGame;
    w.setjpgimgs = setjpgimgs;
    w.setbasegirl = setbasegirl;
    w.updategirldesc = updategirldesc;
    w.setgirl = setgirl;
}