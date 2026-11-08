//These are functions that might regularly be used to debug the code.
//Functions are added as needed

var Debug = function () {

    function help() {
        const myfunctions = [];
        for (var l in this){
            if (this.hasOwnProperty(l) &&
                this[l] instanceof Function &&
                !/myfunctions/i.test(l)){
                myfunctions.push(this[l]);
            }
        }
        return myfunctions;
    }


    //Gives you all items
    function getAllItems() {
        Object.keys(objects).forEach(key => objects[key].value = 2);
    }
    getAllItems.description = "Gives you 2 of each item";

    //Makes her fully into you.
    function getFullStats() {
        attraction = 130;
        shyness = 0;
    }
    getAllItems.description = "Gives you full attraction and no shyness";

    // set time to 10 pm
    function setTimeTo10PM(){
        thetime = theaterclosingtime;
        hour = 10;
        minute = 0;
    }
    setTimeTo10PM.description = "sets the clock to 22:00";

    //Sets time to 1 am
    function setTimeTo1AM(){
        thetime = barclosingtime;
        hour = 1;
        minute = 0;
    }
    setTimeTo1AM.description = "sets the clock to 1:00";

    //Sets the clock to 2 am
    function setTimeTo2AM() {
        thetime = clubclosingtime;
        hour = 2;
        minute = 0;
    }
    setTimeTo2AM.description = "sets the clock to 2:00";

    //Increase the time by 1 hour
    function increaseTimeByHour(){
        thetime += 60;
        hour += 1;
    }
    increaseTimeByHour.description = "Advances time by 1 hour";

    //Fills the companion's bladder to lose threshold.
    function fillCompanionBladder(){
        bladder = bladlose;
    }
    fillCompanionBladder.description = "fills the companion bladder to lose threshold";

    //Empties the companion's bladder
    function emptyCompanionBladder(){
        flushdrank();
    }
    emptyCompanionBladder.description = "empty companion bladder";

    //Fills the player's bladder to lose threshold
    function fillPlayerBladder(){
        yourbladder = yourbladlose;
    }
    fillPlayerBladder.description = "fills the player bladder";

    //Empties the player's bladder
    function emptyPlayerBladder(){
        flushyourdrank();
    }
    emptyPlayerBladder.description = "empty player bladder";

    //Adds 100 dollar to balance
    function addMoney(){
        money += 100;
    }
    addMoney.description = "adds 100 dollar to balance";

    // substracts 100 dollar from balance
    function subtractMoney(){
        if (money > 100)
            money -= 100;
        else money = 0;
    }
    subtractMoney.description = "subtract 100 dollar from balance";


    //Makes all requirements met for her to take you into her flat.
    function getInvite() {
        getFullStats();
        locations.makeOut.visited = 1;
        locations.theBar.visited = 1;
        locations.theClub.visited = 1;
        seenmovie = 1;
    }
    getInvite.description = "Get all requirements needed for her to let you into her flat.";

    //Fulls her stomach and sets it to max diuretic so she has to pee often
    function setQuickFillCompanion(){
        tummy += 3000;
        drankbeer = 300;
    }
    setQuickFillCompanion.description = "Fulls her stomach and sets it to max diuretic so she has to pee often";

    /**
     * Fulls your stomach and sets it to the max diuretic so you have to pee often
     */
    function setQuickFillPlayer(){
        yourtummy += 3000;
        ydranksodas += 300;
    }
    setQuickFillPlayer.description = "Fulls your stomach and sets it to the max diuretic so you have to pee often";

    return {
        help: help,
        getAllItems: getAllItems,
        getFullStats: getFullStats,
        setTimeTo10PM: setTimeTo10PM,
        setTimeTo1AM: setTimeTo1AM,
        setTimeTo2AM: setTimeTo2AM,
        getInvite: getInvite,
        setQuickFillCompanion: setQuickFillCompanion,
        setQuickFillPlayer: setQuickFillPlayer,
        increaseTimeByHour: increaseTimeByHour,
        fillCompanionBladder: fillCompanionBladder,
        emptyCompanionBladder: emptyCompanionBladder,
        fillPlayerBladder: fillPlayerBladder,
        emptyPlayerBladder: emptyPlayerBladder,
        addMoney: addMoney,
        subtractMoney: subtractMoney,
    }

}();

let debugCounter = 0;
let lastDebugMessage = "";

/**
 * Shows the debug menu button when the version is clicked 3 times.
 */
function setDebugOnVersionClickHandler() {
    document.getRequiredElementById('version').onclick = function() {
        debugCounter++;
        if (debugCounter === 3){
            enableDebugMenuButton();
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setDebugOnVersionClickHandler);
} else {
    setDebugOnVersionClickHandler();
}

function enableDebugMenuButton(){
    const debugButton = document.getRequiredElementById('debugMenuButton');
    debugButton.style.display = 'flex';
    debugButton.onclick = openDebugMenu;
}

function openDebugMenu(){
    openPopUp();
    const title = document.getRequiredElementById('pop-up-title');
    title.innerText = "Debug Menu";
    const content = document.getRequiredElementById('pop-up-text');
    // Set up three columns in the pop-up content
    content.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 0.9rem;" id="debug-status">${lastDebugMessage}</div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 260px;" id="debug-locations"></div>
            <div style="flex: 1; min-width: 260px;" id="debug-functions"></div>
            <div style="flex: 1; min-width: 260px;" id="debug-info"></div>
        </div>`;

    const infoDiv = document.getRequiredElementById('debug-info');
    const locationsDiv = document.getRequiredElementById('debug-locations');
    createSectionHeading(locationsDiv, "Location stack");
    createLocationButtons(locationsDiv, locstack);

    const functionsDiv = document.getRequiredElementById('debug-functions');
    createSectionHeading(functionsDiv, "Debug functions");
    createDebugFunctionButtons(functionsDiv);

    createSectionHeading(infoDiv, "Stats");
    const table = document.createElement('table');
    setStats(table);
    infoDiv.appendChild(table);
}

function createSectionHeading(container, title){
    const heading = document.createElement('h4');
    heading.innerText = title;
    heading.style.margin = '6px 0';
    container.appendChild(heading);
}

function createLocationButtons(container, stack){
    if (!stack.length) {
        const empty = document.createElement('div');
        empty.innerText = '(empty)';
        container.appendChild(empty);
        return;
    }

    stack.forEach((locationTag, index) => {
        const locButton = document.createElement('button');
        locButton.innerText = `${index}: ${locationTag}`;
        locButton.onclick = function() {
            go(locationTag);
            console.log(`Teleported to location: ${locationTag}`);
            lastDebugMessage = `Teleported to location: ${locationTag}`;
            closePopUp();
        };
        locButton.className = 'itembtn';
        locButton.style.display = 'block';
        locButton.style.margin = '2px 0';
        container.appendChild(locButton);
    });
}

function createDebugFunctionButtons(container){
    for (const [name, func] of Object.entries(Debug)) {
        if (name === 'help') continue;
        const funcButton = document.createElement('button');
        funcButton.innerText = name;
        funcButton.onclick = function() {
            func();
            lastDebugMessage = `Executed: ${name}`;
            closePopUp();
        };
        funcButton.className = 'itembtn';
        funcButton.title = func.description;
        funcButton.style.margin = '2px';
        container.appendChild(funcButton);
    }
}

function createValueRow(table, label, value) {
    const row = table.insertRow();
    row.insertCell().innerText = label;
    row.insertCell().innerText = value;
}

function setStats(table){
    createValueRow(table, "Money", money);
    createValueRow(table, "Attraction", attraction);
    createValueRow(table, "Shyness", shyness);
    createValueRow(table, "GameTime", `${hour}:${minute}`);
    createValueRow(table, "Bladder", bladder);
    createValueRow(table, "Tummy", tummy);
    createValueRow(table, "Max tummy", maxtummy);
    createValueRow(table, "Alcohol in tummy", drankbeer);
    createValueRow(table, "Now peeing", nowpeeing);
    createValueRow(table, "Bladder urge", bladurge);
    createValueRow(table, "Bladder need", bladneed);
    createValueRow(table, "Bladder emergency", blademer);
    createValueRow(table, "Bladder lose", bladlose);
    createValueRow(table, "Bladder cum lose", bladcumlose);
    createValueRow(table, "Bladder sex lose", bladsexlose);
    createValueRow(table, "Your Bladder", yourbladder);
    createValueRow(table, "Your tummy", yourtummy);
    createValueRow(table, "Your max tummy", ymaxtummy);
    createValueRow(table, "Alcohol in your tummy", ydrankbeer);
    createValueRow(table, "You now peeing", ynowpeeing);
    createValueRow(table, "Your bladder urge", yourbladurge);
    createValueRow(table, "Your bladder need", yourbladneed);
    createValueRow(table, "Your bladder emergency", yourblademer);
    createValueRow(table, "Your bladder lose", yourbladlose);
    createValueRow(table, "your bladder cum lose", yourbladcumlose);
    createValueRow(table, "your bladder sex lose", yourbladsexlose);
}