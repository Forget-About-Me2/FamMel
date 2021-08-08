//TODO get rid of this because this is copieid from main
function range(start, end) {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}

function pickrandom(list) {
    return list[randomIndex(list)];
}

//Picks a random index from a list.
function randomIndex(list){
    let number = Math.random() * list.length;
    return Math.floor(number);
}

function randomchoice(probability) {
    if (Math.floor(Math.random() * 10) <= probability)
        return 1;
    else
        return 0;
}

let dartPoints = {
    "you": 301,
    "her": 301
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
            return [points];
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
            return pickrandom(list);
        }
    }
    return [];
}

function tripleFinish(points){
    if (points in scores.double){
        //If it's possible to finsih with 3 darts there's a 70% chance this succeeds
        if (randomchoice(7)){
            return [pickrandom(scores.double[points]), 0];
        }
    }
    let score = pickrandom(Object.keys(scores.normal));
    let list = pickrandom(scores.normal[score]);
    //If you somehow still pick a wining move you win, otherwise your point amount doesn't change
    if (score === points){
        if (doubles.includes(list[2]))
            score = 0
        else
            score = points;
    } else if (score < points)
        //if you scored lower than your points subtract the score from your points
        score = points - score;
    else {
        //If you score higher than points you still have find out which throw crossed it.
        if (list[0] > points)
            return [[list[0]], points];
        else if (list[0]+list[1] > points)
            return [[list[0], [list[1]]], points];
        score = points
    }
    return [list, score];
}

function playDarts(){
    let finished = false;
    let winner;
    while (!finished){
        for (let player in dartPoints) {
            let res = [];
            let curPoints = dartPoints[player];
            if (curPoints <= 60){
                res = singleFinish(curPoints);
                finished = res.length === 1;
                if (finished){
                    dartPoints[player] = 0;
                    winner = player;
                    console.log(player + " played: " + res);
                    console.log("And won!");
                    break;
                }
            }
            if (curPoints <= 100){
                res = doubleFinish(curPoints);
                finished = res.length === 2;
                if (finished){
                    dartPoints[player] = 0;
                    console.log(player + " played: " + res);
                    console.log("And won!");
                    winner = player;
                    break;
                }
            }
            res = tripleFinish(curPoints);
            console.log(player + " played: " + res[0]);
            finished = res[1] === 0;
            dartPoints[player] = res[1];
            if (finished){
                console.log("And won!");
                winner = player;
                break;
            }

        }
        console.log("current points:")
        console.log(dartPoints);
    }
    console.log(dartPoints);
}

setupScores();
// console.log(possibleScores);
// console.log(doubles);
genScores();
playDarts();
// let maxVal = 0;
// console.log(scores);
// console.log(scores2);
// Object.keys(scores.double).forEach(key => maxVal = Math.max(scores.double[key].length, maxVal));
// console.log(maxVal);