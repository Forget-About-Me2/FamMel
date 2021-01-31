//TOOD proper integration

function setup(){
    if(typeof(Storage) !== "undefined"){
        if(localStorage.girlname){
            girlname = localStorage.girlname;
            if (localStorage.custom === "true"){
                customgirlname = girlname;
                if(localStorage.basegirl){
                    basegirl = localStorage.basegirl;
                }
                if(localStorage.customurge){
                    customurge = localStorage.customurge;
                }
            }
            setbasegirl(basegirl);
            setgirl(girlname)
        }
        if(localStorage.heroutfit){
            heroutfit = localStorage.heroutfit;
        }
        if(localStorage.images){
            switch(localStorage.images){
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
        if(localStorage.imgs){
            importimgs();
        }
        if(localStorage.showstats){
            if (localStorage.showstats === "false"){
                showstats = 0;
            }
        }
        if(localStorage.multiplemoves){
            if(localStorage.multiplemoves === "false"){
                multiplemoves = 0;
            }
        }
        if(localStorage.rstmoves){
            rstmoves = 1;
        }
        if(localStorage.yourcustomurge){
            yourcustomurge = localStorage.yourcustomurge;
            updateyoururge(yourcustomurge);
        }
        if(localStorage.money){
            money = localStorage.money;
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

    let vars = new Array(29).fill([""]); //This array is used to format the html with values
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

    checked.forEach(i => vars[i] = ["checked"]);
    vars[26] = [yourcustomurge];
    vars[27] = [money]
    let curtext = formatAll(json.html, vars);
    curtext = c(["gamestart()", "Continue..."], curtext);
    setText(curtext);

//TODO debug mode
    if (debugmode) debgclick = "checked"; else ndebclick = "checked";

    setgirl(girlname);
}



function customgirl() {
    let vars = new Array(13).fill("");
    if (basegirl === "Jennifer") vars[4] = ["checked"];
    else if (basegirl === "Jennifer") vars[5] = ["checked"];
    else if (basegirl === "Laura") vars[6] = ["checked"];
    else vars[7] = ["checked"];
    vars[9] = [customgirlname];
    vars[10] = [customurge];

    setText(formatAll(json.cusgirl, vars));
    setbasegirl(basegirl);
}

function exitcustomgirl() {
    setgirl(customgirlname);
    options();
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
            displaypix(imagename);
            setLocal("images", "images");
            break;
    }
}

function setStatsShow(choice){
    showstats = choice;
    if (showstats){
        setLocal("shosstats", "true");
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
    updateyoururge(yourcustomurge);
}

function setyourmoney() {
    money = parseInt(document.getElementById('yourmoney').value);
    setLocal("money", money);
}

function hidescreen() {
    enablehide = 1;
    s("<a href=javascript:go(" + locstack[0] + ")>.</a>");
}

function setjpgimgs() {
    enableimages = 1;
    enableascii = 0;
    document.getElementById('thepic').innerHTML = "<img src=" + imagename + " alt=" + imagedesc + " class='pic'>";
}


function setbasegirl(hername) {
    basegirl = hername;
    setLocal("basegirl", basegirl);
    const htmlcall = document.getElementById('girlstats');
    if (basegirl === "Jennifer") {
        updateurge(300);
        if(htmlcall){
            htmlcall.innerHTML = customgirlname +
                " is a statuesque blonde.";
        }
        stareather = stareather_jennifer;
        favoritemovie = "theurge";
    }

    if (basegirl === "Laura") {
        updateurge(250);
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is a cute girl-next-door type.";
        }
        stareather = stareather_laura;
        favoritemovie = "thedesp";
    }

    if (basegirl === "Karen") {
        updateurge(200);
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is a petite and slim Asian girl.";
        }
        stareather = stareather_karen;
        favoritemovie = "thectrl";
    }

    if (basegirl === "Melissa") {
        updateurge(350);
        if(htmlcall) {
            htmlcall.innerHTML = customgirlname +
                " is an innocent red headed college girl.";
        }
        stareather = stareather_melissa;
        favoritemovie = "thelitr";
    }
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

//TODO these array updates are atrocious
function setgirl(hername) {
    setLocal("girlname", hername);
    girlname = hername;
    if (document.getElementById('girlstats')) updategirldesc();
    if (girlname === "Jennifer") {
        basegirl = girlname;
        bladurge = 300;
        stareather = stareather_jennifer;
        favoritemovie = "theurge";
        setLocal("custom", "false");
    } else if (girlname === "Laura") {
        basegirl = girlname;
        bladurge = 250;
        stareather = stareather_laura;
        favoritemovie = "thedesp";
        setLocal("custom", "false");
    } else if (girlname === "Karen") {
        basegirl = girlname;
        bladurge = 200;
        stareather = stareather_karen;
        favoritemovie = "thectrl";
        setLocal("custom", "false");
    } else if (girlname === "Melissa") {
        basegirl = girlname;
        bladurge = 350;
        stareather = stareather_melissa;
        favoritemovie = "thelitr";
        setLocal("custom", "false");
    } else {
        bladurge = customurge;
        favoritemovie = "thelitr";
        setLocal("custom", "true");
    }
    updateurge(bladurge);
    if (basegirl === "Laura") stareather = stareather_laura;
    else if (basegirl === "Karen") stareather = stareather_karen;
    else if (basegirl === "Melissa") stareather = stareather_melissa;
    else stareather = stareather_jennifer;


    //  Have to reset all preset strings.
    girltalk = "<b>" + girlname + ":&nbsp;</b>";
    girlgasp = "<b>" + girlname + " gasps:&nbsp;</b>";

    bargoodresp = Array(
        girlname + " looks you in the eyes and smiles as she talks.",
        girlname + " leans towards you and smiles.",
        girlname + " seems pleased with the conversation.",
        "You feel " + girlname + "'s foot playfully brush your leg, and she smiles as she talks",
        girlname + " touches your shoulder gently.",
        girlname + " seems to be playing with the top button of her blouse as she talks."
    );

    barmedresp = Array(
        girlname + " seems uninterested in the conversation.",
        girlname + " twirls her hair around her finger as she talks.",
        girlname + " leans back in her chair.",
        girlname + " glances around the room.",
        girlname + " fiddles with her napkin.",
        girlname + " glances quickly at her watch."
    );

    barbadresp = Array(
        girlname + " leans back in her chair and sighs.",
        girlname + " frowns.",
        girlname + " looks pointedly at her watch.",
        girlname + " seems more interested in shredding her napkin into little strips that what you have to say.",
        girlname + " appears engrossed in the program on the bar television ... which is an infomercial for Arizona real estate.",
        girlname + " looks exasperated."
    );

    wetquote = Array("Suddenly, " + girlname + " squeals and then gasps!",
        "Suddenly, " + girlname + " freezes in place and her face turns bright red.",
        girlname + " gasps and grabs at her pussy.",
        girlname + " squeals and doubles over.",
        girlname + " suddenly gasps and her face turns red.",
        girlname + " suddenly shudders and her face turns red.");

    barquotes = Array(
        "Nice girl you've got there.  Bet she'll pee herself if she holds a drop over " + bladlose + "ml, though.",
        "She's cute, isn't she?  I bet if you found her a cocktail, she'd be a lot less inhibited about drinking.",
        "Did you know that beer is a diuretic?",
        "Say, you don't happen to know where a man could buy a set of wet panties around here, do you?",
        "How about them Dodgers?",
        "I've been thinking about starting a bladder buster night here on Mondays."
    );
}