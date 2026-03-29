import { backPackItems } from './backPackItems';
import { gameState } from './gameState/gameState';
import { go } from './main';
import { theYard, exitYard, theWalk } from './locations/theMakeOut';
import { openPopUp } from './pop-up';
import { getRandomSeed } from './shims';

//These are functions that might regularly be used to debug the code.
//Functions are added as needed

type DebugFunctions = {
    help: () => void,
    allItems: () => void,
    fullStats: () => void,
    nightTime: () => void,
    getInvite: () => void,
    quickFill: () => void,
    quickFillPlayer: () => void,
    yardTest: (times?: number) => void
};

export const Debug: DebugFunctions = function () {

    function help() {
        OpenDebugMenu();
    }

//Gives you all items
    function allItems() {
        Object.keys(backPackItems).forEach(key => backPackItems[key].value = 2);
    }

//Makes her fully into you.
    function fullStats() {
        gameState.Attraction = 130;
        gameState.Shyness = 0;
        setLegacyGlobalValue('attraction', 130);
        setLegacyGlobalValue('shyness', 0);
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

export let debugCounter = 0;
export let lastDebugMessage = "";

export function setDebugVersionHandler() {
    GetRequiredElementById('version').onclick = function(){
        debugCounter++;
        if (debugCounter === 3) {
            enableDebugMenuButton();
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setDebugVersionHandler);
} else {
    setDebugVersionHandler();
}

export function enableDebugMenuButton(){
    const debugButton = GetRequiredElementById('debugmenubutton');
    debugButton.style.display = 'flex';
    debugButton.onclick = OpenDebugMenu;
}

export function OpenDebugMenu() {
    openPopUp();
    const title = GetRequiredElementById('pop-up-title');
    title.innerText = "Debug Menu";
    const content = GetRequiredElementById('pop-up-text');
    // Set up three columns in the pop-up content
    content.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 0.9rem;" id="debug-status">${lastDebugMessage}</div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 260px;" id="debug-locations"></div>
            <div style="flex: 1; min-width: 260px;" id="debug-functions"></div>
            <div style="flex: 1; min-width: 260px;" id="debug-info"></div>
        </div>
    `;

    const infoDiv = GetRequiredElementById('debug-info');
    const locationsDiv = GetRequiredElementById('debug-locations');
    CreateSectionHeading(locationsDiv, "Legacy Location Stack");
    CreateLocationButtons(locationsDiv, locStack ?? []);

    CreateSectionHeading(locationsDiv, "Typed Location Stack");
    CreateTypedLocationButtons(locationsDiv, gameState.LocStack ?? []);

    const functionsDiv = GetRequiredElementById('debug-functions');
    CreateSectionHeading(functionsDiv, "Debug Functions");
    Object.entries(Debug).forEach(([name, func]) => {
        const funcButton = document.createElement('button');
        funcButton.innerText = name;
        funcButton.onclick = function() {
            func();
            SetDebugMessage(`Executed: ${name}`);
            OpenDebugMenu();
        };
        funcButton.className = 'itembtn';
        funcButton.style.margin = '2px';
        functionsDiv.appendChild(funcButton);
    });

    CreateSectionHeading(functionsDiv, "Quick Actions");
    CreateQuickActions(functionsDiv);

    CreateSectionHeading(infoDiv, "Core State");
    const table = document.createElement('table');
    CreateValueRow(table, "Random Seed", getRandomSeed().toString());
    CreateValueRow(table, "Money", gameState.Money.toString());
    CreateValueRow(table, "Attraction", gameState.Attraction.toString());
    CreateValueRow(table, "Shyness", gameState.Shyness.toString());
    CreateValueRow(table, "Legacy Attraction", getLegacyGlobalValue('attraction')?.toString?.() ?? "N/A");
    CreateValueRow(table, "Legacy Shyness", getLegacyGlobalValue('shyness')?.toString?.() ?? "N/A");
    CreateValueRow(table, "Game Time", gameState.Time.timeString);
    CreateValueRow(table, "Current Typed Location", GetTypedLocationLabel(gameState.CurrentLocation));
    CreateValueRow(table, "Legacy Stack (full)", (locStack ?? []).join(" -> ") || "(empty)");
    CreateValueRow(table, "Typed Stack (full)", GetTypedLocationStackLabel(gameState.LocStack ?? []));
    CreatePersonRows(gameState.Companion, "Companion", table)
    CreatePersonRows(gameState.Player, "Player", table)
    infoDiv.appendChild(table);

    CreateSectionHeading(infoDiv, "State Dump");
    const dump = document.createElement('pre');
    dump.style.maxHeight = '260px';
    dump.style.overflow = 'auto';
    dump.style.whiteSpace = 'pre-wrap';
    dump.style.wordBreak = 'break-word';
    dump.textContent = JSON.stringify(BuildDebugDump(), null, 2);
    infoDiv.appendChild(dump);
}

export function CreateValueRow(table: HTMLTableElement, label: string, value: string) {
    const row = table.insertRow();
    row.insertCell().innerText = label;
    row.insertCell().innerText = value;
}

type person = {
    bladderUrge: number;
    bladderNeed: number;
    bladderEmer: number;
    bladderLose: number;
    [key: string]: any;
};

export function CreatePersonRows(person: person | undefined, tag : string, table: HTMLTableElement){
    let row = table.insertRow();
    const cell = row.insertCell();
    cell.innerHTML = `<b>${tag}</b>`;
    cell.colSpan = 2;
    cell.style.alignItems = 'flex-center';

    if (!person) {
        row = table.insertRow();
        row.insertCell().innerText = "State";
        row.insertCell().innerText = "Unavailable";
        return;
    }

    row = table.insertRow();
    row.insertCell().innerText = "Bladder";
    row.insertCell().innerText = (person.Bladder ?? "N/A").toString();
    row = table.insertRow();
    row.insertCell().innerText = "Tummy";
    row.insertCell().innerText = (person.Tummy ?? "N/A").toString();
    row = table.insertRow();
    row.insertCell().innerText = "Max Tummy";
    row.insertCell().innerText = (person.MaxTummy ?? "N/A").toString();
    row = table.insertRow();
    row.insertCell().innerText = "Alcohol In Tummy";
    row.insertCell().innerText = (person.AlcoholInTummy ?? "N/A").toString();
    row = table.insertRow();
    row.insertCell().innerText = "Now Peeing";
    row.insertCell().innerText = (person.NowPeeing ?? "N/A").toString();
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

export function SetDebugMessage(message: string) {
    lastDebugMessage = message;
}

export function CreateSectionHeading(container: HTMLElement, title: string) {
    const heading = document.createElement('h4');
    heading.innerText = title;
    heading.style.margin = '6px 0';
    container.appendChild(heading);
}

export function CreateLocationButtons(container: HTMLElement, stack: string[]) {
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
            SetDebugMessage(`Teleported to legacy location: ${locationTag}`);
            OpenDebugMenu();
        };
        locButton.className = 'itembtn';
        locButton.style.display = 'block';
        locButton.style.margin = '2px 0';
        container.appendChild(locButton);
    });
}

export function CreateTypedLocationButtons(container: HTMLElement, stack: any[]) {
    if (!stack.length) {
        const empty = document.createElement('div');
        empty.innerText = '(empty)';
        container.appendChild(empty);
        return;
    }

    stack.forEach((location, index) => {
        const locButton = document.createElement('button');
        locButton.innerText = `${index}: ${GetTypedLocationLabel(location)}`;
        locButton.onclick = function() {
            go(location);
            SetDebugMessage(`Teleported to typed location: ${GetTypedLocationLabel(location)}`);
            OpenDebugMenu();
        };
        locButton.className = 'itembtn';
        locButton.style.display = 'block';
        locButton.style.margin = '2px 0';
        container.appendChild(locButton);
    });
}

export function CreateQuickActions(container: HTMLElement) {
    CreateQuickActionButton(container, 'Set Time 22:00', function () {
        gameState.Time.hour = 22;
        gameState.Time.minute = 0;
        hour = 22;
        SetDebugMessage('Time set to 22:00');
    });

    CreateQuickActionButton(container, 'Add 1 Hour', function () {
        gameState.Time.hour = (gameState.Time.hour + 1) % 24;
        hour = gameState.Time.hour;
        SetDebugMessage(`Time advanced to ${gameState.Time.timeString}`);
    });

    CreateQuickActionButton(container, 'Companion Fill Bladder', function () {
        if (!gameState.Companion) return;
        gameState.Companion.Bladder = gameState.Companion.bladderLose + 50;
        SetDebugMessage('Companion bladder set near lose threshold');
    });

    CreateQuickActionButton(container, 'Companion Empty Bladder', function () {
        if (!gameState.Companion) return;
        gameState.Companion.Bladder = 0;
        gameState.Companion.pee();
        SetDebugMessage('Companion bladder emptied');
    });

    CreateQuickActionButton(container, 'Player Fill Bladder', function () {
        if (!gameState.Player) return;
        gameState.Player.Bladder = gameState.Player.bladderLose + 50;
        SetDebugMessage('Player bladder set near lose threshold');
    });

    CreateQuickActionButton(container, 'Player Empty Bladder', function () {
        if (!gameState.Player) return;
        gameState.Player.Bladder = 0;
        gameState.Player.pee();
        SetDebugMessage('Player bladder emptied');
    });

    CreateQuickActionButton(container, 'Money +100', function () {
        gameState.ReceiveMoney(100);
        SetDebugMessage('Added 100 money');
    });

    CreateQuickActionButton(container, 'Money -100', function () {
        gameState.PayAmount(100);
        SetDebugMessage('Removed 100 money');
    });
}

export function CreateQuickActionButton(container: HTMLElement, label: string, action: () => void) {
    const button = document.createElement('button');
    button.innerText = label;
    button.className = 'itembtn';
    button.style.display = 'block';
    button.style.margin = '2px 0';
    button.onclick = function () {
        action();
        OpenDebugMenu();
    };
    container.appendChild(button);
}

export function GetTypedLocationLabel(location: any): string {
    if (!location) return '(none)';
    const category = location.category ?? '?';
    const functionName = typeof location.function === 'function' ? (location.function.name || 'anonymous') : 'unknown';
    return `${functionName} (category ${category})`;
}

export function GetTypedLocationStackLabel(stack: any[]): string {
    if (!stack.length) return '(empty)';
    return stack.map(GetTypedLocationLabel).join(' -> ');
}

export function BuildDebugDump() {
    return {
        randomSeed: getRandomSeed(),
        gameTime: {
            hour: gameState.Time.hour,
            minute: gameState.Time.minute,
            text: gameState.Time.timeString,
            totalTime: gameState.Time.totalTime
        },
        resources: {
            money: gameState.Money,
            attraction: gameState.Attraction,
            shyness: gameState.Shyness,
            legacyAttraction: getLegacyGlobalValue('attraction'),
            legacyShyness: getLegacyGlobalValue('shyness')
        },
        locationStack: {
            legacy: [...(locStack ?? [])],
            typed: (gameState.LocStack ?? []).map((location: any) => ({
                category: location?.category,
                functionName: typeof location?.function === 'function' ? (location.function.name || 'anonymous') : 'unknown'
            }))
        },
        companion: {
            bladder: gameState.Companion?.Bladder,
            bladderUrge: gameState.Companion?.bladderUrge,
            bladderNeed: gameState.Companion?.bladderNeed,
            bladderEmer: gameState.Companion?.bladderEmer,
            bladderLose: gameState.Companion?.bladderLose,
            tummy: gameState.Companion?.Tummy,
            alcoholInTummy: gameState.Companion?.AlcoholInTummy,
            nowPeeing: gameState.Companion?.NowPeeing
        },
        player: {
            bladder: gameState.Player?.Bladder,
            bladderUrge: gameState.Player?.bladderUrge,
            bladderNeed: gameState.Player?.bladderNeed,
            bladderEmer: gameState.Player?.bladderEmer,
            bladderLose: gameState.Player?.bladderLose,
            tummy: gameState.Player?.Tummy,
            alcoholInTummy: gameState.Player?.AlcoholInTummy,
            nowPeeing: gameState.Player?.NowPeeing
        }
    };
}

export function getLegacyGlobalValue(name: string): unknown {
    const store = globalThis as Record<string, unknown>;
    return store[name];
}

export function setLegacyGlobalValue(name: string, value: unknown): void {
    const store = globalThis as Record<string, unknown>;
    if (name in store) {
        store[name] = value;
    }
}

export function exposeDebugMenuOnWindow() {
    (window as any).Debug = Debug;
}