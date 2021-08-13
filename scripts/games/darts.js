function dartSetup(){
    darts = json;
    darts["play"] = formatAllVarsList(darts["play"]);
    setupScores();
    genScores();
}

let possibleScores = [25, 50];
let doubles = [];
//Generates the list of all possible scores that can be scored.
function setupScores(){
    range(1,20).forEach(i => {
        range(1,3).forEach(j => possibleScores.push(i*j));
        doubles.push(2*i);
    });
}

//All possible points gained with 3 throws
//Double meaning the last throw was a double, meaning you can end with this.
let scores = {
    "double": {},
    "normal": {}
};
//All possible points gained with 2 throws, with a double at the end
let scores2 ={
}
function genScores(){
    possibleScores.forEach(first => {
        possibleScores.forEach(second => {
            if (doubles.includes(second)) {
                let list = [first, second];
                let sumScore = list.reduce(function (a, b) {
                    return a + b;
                }, 0);
                if (sumScore in scores2)
                    scores2[sumScore].push(list);
                else
                    scores2[sumScore] = [list];
            }
            possibleScores.forEach(third => {
                let list = [first, second, third];
                let sumScore = list.reduce(function (a, b) {
                    return a + b;
                }, 0);
                let type = "normal"
                if (doubles.includes(third)) type = "double";
                if (sumScore in scores[type]){
                    scores[type][sumScore].push(list);
                } else {
                    scores[type][sumScore] = [list];
                }
            })
        })
    });
}

//When the score is lower than 60, sees if finishing in one move is valid
function singleFinish(points){
    if (doubles.includes(points)){
        if (randomchoice(5))
            return [[points], points, 0];
    }
    return [];
}

function doubleFinish(points){
    if (points in scores2){
        let list = scores2[points];
        //The more ways a score can be created, the bigger the chance.
        //The given formula give 100% chance when the length is 64
        const chance = Math.round(5*Math.pow(1.01, list.length));
        if (randomchoice(chance)){
            return [pickrandom(list), points, 0];
        }
    }
    return [];
}

function tripleFinish(points){
    if (points in scores.double){
        //If it's possible to finsih with 3 darts there's a 70% chance this succeeds
        if (randomchoice(7)){
            return [pickrandom(scores.double[points]), points, 0];
        }
    }
    let score = pickrandom(Object.keys(scores.normal));
    let list = pickrandom(scores.normal[score]);
    let endPoints = points;
    //If you somehow still pick a wining move you win, otherwise your point amount doesn't change
    if (score === points){
        if (doubles.includes(list[2]))
            endPoints = 0
        else
            endPoints = points;
    } else if (score < points)
        //if you scored lower than your points subtract the score from your points
        endPoints = points - score;
    else {
        //If you score higher than points you still have find out which throw crossed it.
        if (list[0] > points)
            return [[list[0]],0, points];
        else if (list[0]+list[1] > points)
            return [[list[0], [list[1]]], 0, points];
        endPoints = points
    }
    return [list, score, endPoints];
}

let playedDarts = false;
//Play a game of darts with her
function playDarts() {
    let curtext = [];
    //Have you played the darts game before.
    if (!playedDarts) {
        curtext = printList(curtext, darts["play"][0]);
        playedDarts = true;
    } else
        curtext = printList(curtext, darts["play"][1]);
    curtext = showneed(curtext);
    curtext = printList(curtext, darts["play"][2]);
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    let dartPoints = {
        "you": 301,
        "her": 301
    }
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curtext);
        let round = function () {
            dartRound(dartPoints);
        }
        cListenerGen([round, "Continue..."], "dartRound");
    }
}

//Play a round of the dart game
function dartRound(dartPoints){
    let curtext = printList([], darts["round"][0]);
    let winner = false; //Flags whether the game has been won
    let res = [];
    for (let player in dartPoints) {
        let curPoints = dartPoints[player];
        if (curPoints <= 60){
            res = singleFinish(curPoints);
        }
        if (res.length === 0) {
            if (curPoints <= 100) {
                res = doubleFinish(curPoints);
            }
            if (res.length === 0)
                res = tripleFinish(curPoints);
        }
        curtext = printList(curtext, formatAll(darts["points"][player], res));
        if (res[2] === 0){
            if (player === "you"){
                curtext.push("<b>You have won the game!</b>");
            } else
                curtext.push("<b>" + girlname + " has won the game!</b>");
            winner = true;
            break;
        }
        dartPoints[player] = res[2];
        res = []; //Reinitialize res
    }
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curtext);
        let listenerList = [];
        if (!winner) {
            let round = function () {
                dartRound(dartPoints);
            }
            listenerList.push([[round], "dartRound"]);
            cListener([round, "Play the next round"], "dartRound");
        }
        listenerList.push([[darkBar], "darkBar"]);
        let curtext = callChoice(["curloc", "Continue..."], []);
        addSayText(curtext);
        addListenersList(listenerList);
    }
}
