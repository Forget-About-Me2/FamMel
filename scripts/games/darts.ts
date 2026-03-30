import { formatAllVarsList, printList, sayText, cListenerGen, cListener, callChoice, addSayText, addListenersList, wrapAndFormatAll } from '../quotes';
import { range, randomchoice, pickrandom } from '../shims';
import { showneed, displayneed, wetherself } from '../bladder';
import { displayyourneed, wetyourself } from '../yourbladder';

export function dartSetup(data: any){
    darts = data;
    darts["play"] = formatAllVarsList(darts["play"]);
    setupScores();
    genScores();
}

let possibleScores = [25, 50];
let doubles: number[] = [];
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
} as { double: Record<number, number[][]>; normal: Record<number, number[][]> };
//All possible points gained with 2 throws, with a double at the end
let scores2: Record<number, number[][]> = {
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
// Dart score result tuples: [throws, totalScored, remainingPoints]
// remainingPoints=0 means the player finished
function singleFinish(points: number){
    if (doubles.includes(points)){
        if (randomchoice(5))
            return [[points], points, 0];
    }
    return [] as any[];
}

function doubleFinish(points: number){
    if (points in scores2){
        let list = scores2[points];
        //The more ways a score can be created, the bigger the chance.
        //The given formula give 100% chance when the length is 64
        const chance = Math.round(5*Math.pow(1.01, list.length));
        if (randomchoice(chance)){
            return [pickrandom(list), points, 0];
        }
    }
    return [] as any[];
}

function tripleFinish(points: number){
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

export let playedDarts = false;
//Play a game of darts with her
export function playDarts() {
    let curtext: any[] = [];
    // play: [0]=first time intro, [1]=replay intro, [2]=game setup
    const [firstPlay, replayIntro, gameSetup] = darts["play"];
    if (!playedDarts) {
        curtext = printList(curtext, firstPlay);
        playedDarts = true;
    } else
        curtext = printList(curtext, replayIntro);
    curtext = showneed(curtext);
    curtext = printList(curtext, gameSetup);
    curtext = displayneed(curtext);
    curtext = displayyourneed(curtext);
    let dartPoints: Record<string, number> = {
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
export function dartRound(dartPoints: any){
    let curText = printList([], darts["round"][0]); // round narration
    let winner = false;
    let res: any[] = []; // [throws, totalScored, remainingPoints]
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
        curText = printList(curText, wrapAndFormatAll(darts["points"][player], res));
        if (res[2] === 0){
            if (player === "you"){
                curText.push("<b>You have won the game!</b>");
            } else
                curText.push("<b>" + girlname + " has won the game!</b>");
            winner = true;
            break;
        }
        dartPoints[player] = res[2];
        res = []; //Reinitialize res
    }
    curText = displayneed(curText);
    curText = displayyourneed(curText);
    if (bladder > bladlose) wetherself();
    else if (yourbladder > yourbladlose) wetyourself();
    else {
        sayText(curText);
        let listenerList: any[] = [];
        if (!winner) {
            let round = function () {
                dartRound(dartPoints);
            }
            listenerList.push([[round], "dartRound"]);
            cListener([round, "Play the next round"], "dartRound");
        }
        curText = callChoice(["curloc", "Stop playing"], []);
        addSayText(curText);
        addListenersList(listenerList);
    }
}

export function exposeDartsOnWindow(): void {
    const w = window as any;
    w.dartSetup = dartSetup;
    w.playDarts = playDarts;
    w.dartRound = dartRound;
}
