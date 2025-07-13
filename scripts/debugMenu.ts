//These are functions that might regularly be used to debug the code.
//Functions are added as needed

type DebugFunctions = {
    allItems: () => void,
    fullStats: () => void,
    nightTime: () => void,
    getInvite: () => void,
    quickFill: () => void,
    quickFillPlayer: () => void,
    yardTest: (times?: number) => void
};

const Debug: DebugFunctions = function () {

//Gives you all items
    function allItems() {
        Object.keys(backPackItems).forEach(key => backPackItems[key].value = 2);
    }

//Makes her fully into you.
    function fullStats() {
        attraction = 130;
        shyness = 0;
    }

//Sets the clock to night
    function nightTime() {
        thetime += clubclosingtime;
        hour += 7;
    }

//Makes all requirements met for her to take you into her flat.
    function getInvite() {
        fullStats();
        locations.makeOut.visited = 1;
        locations.theBar.visited = 1;
        locations.theClub.visited = 1;
        seenmovie = 1;
    }

    //Fulls her stomach and sets it to max diuretic so she has to pee often
    function quickFill(){
        tummy += 3000;
        drankbeer = 300;
    }

    /**
     * Fulls your stomach and sets it to the max diuretic so you have to pee often
     */
    function quickFillPlayer(){
        yourtummy += 3000;
        ydranksodas += 300;
    }

    function yardTest(times = 1){
        for (let i=0; i < times; i++){
            go(theYard);
            go(exitYard);
            go(theWalk);
        }
    }

    return {
        help: help,
        allItems: allItems,
        fullStats: fullStats,
        nightTime: nightTime,
        getInvite: getInvite,
        quickFill: quickFill,
        quickFillPlayer: quickFillPlayer,
        yardTest: yardTest
    }

}();

let debugCounter = 0;
GetRequiredElementById('version').onclick = function(){
    debugCounter++;
    if (debugCounter === 3) {
        enableDebugMenuButton();
    }
}

function enableDebugMenuButton(){
    const debugButton = GetRequiredElementById('debugmenubutton');
    debugButton.style.display = 'flex';
    debugButton.onclick = OpenDebugMenu;
}

function OpenDebugMenu() {
    openPopUp();
    const title = GetRequiredElementById('pop-up-title');
    title.innerText = "Debug Menu";
    const content = GetRequiredElementById('pop-up-text');
    // Set up three columns in the pop-up content
    content.innerHTML = `
        <div style="display: flex; gap: 16px;">
            <div style="flex: 1;" id="debug-locations"></div>
            <div style="flex: 1;" id="debug-functions"></div>
            <div style="flex: 1;" id="debug-info"></div>
        </div>
    `;
    const locationsDiv = GetRequiredElementById('debug-locations');
    for (const location of gameState.LocStack) {
        const locButton = document.createElement('button');
        locButton.innerText = location;
        locButton.onclick = function() {
            go(location);
        };
        locButton.className = 'itembtn';
        locationsDiv.appendChild(locButton)
    }
    const functionsDiv = GetRequiredElementById('debug-functions');
    Object.entries(Debug).forEach(([name, func]) => {
        const funcButton = document.createElement('button');
        funcButton.innerText = name;
        funcButton.onclick = function() {
            func();
            infoDiv.innerText = `Executed: ${name}`;
        };
        funcButton.className = 'itembtn';
        functionsDiv.appendChild(funcButton);
    });
    const infoDiv = GetRequiredElementById('debug-info');
    const table = document.createElement('table');
    CreatePersonRows(gameState.Date, "Date", table)
    CreatePersonRows(gameState.Player, "Player", table)
    infoDiv.appendChild(table);
}

function CreatePersonRows(person: Person, tag : string, table: HTMLTableElement){
    let row = table.insertRow();
    const cell = row.insertCell();
    cell.innerHTML = `<b>${tag}</b>`;
    cell.colSpan = 2;
    cell.style.alignItems = 'flex-center';
    row = table.insertRow();
    row.insertCell().innerText = "Bladder Urge";
    row.insertCell().innerText = person.bladderUrge.toString();
    row = table.insertRow();
    row.insertCell().innerText = "Bladder Need";
    row.insertCell().innerText = person.bladderNeed.toString();
    row = table.insertRow();
    row.insertCell().innerText = "Bladder Emergency";
    row.insertCell().innerText = person.bladderEmer.toString();
    row = table.insertRow();
    row.insertCell().innerText = "Bladder Lose";
    row.insertCell().innerText = person.bladderLose.toString();
    row = table.insertRow();
    row.insertCell().innerText = "Bladder cum lose";
    row.insertCell().innerText = person.bladderCumLose.toString();
    row = table.insertRow();
    row.insertCell().innerText = "Bladder sex lose";
    row.insertCell().innerText = person.bladderSexLose.toString();
}