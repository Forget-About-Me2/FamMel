import {gameSettings} from "./gameSettings";
export enum LocationCategory {
    Options,
    ExplainImg,
    HideScreen,
    CustomGirl
}


class GameState {
    Player: Person = new Person(yourbladurge);
    Companion: dateNPC = new dateNPC(bladurge, girlname);
    LastMoney : number = 0;
    LastAttraction : number = 0;
    LastShyness : number = 0;
    Money: number = gameSettings.StartMoney;
    Attraction: number = 10;
    Shyness : number = 90;
    readonly LocStack : GameLocation[] = [];

    /**
     * Flag for having done the introduction
     */
    DidIntro : boolean = false;
    Time: Time = new Time();

    /**
     * Keeps track of how many times you've flirted at the current place.
     */
    FlirtCounter: number = 0;

    /**
     * Whether you currently have her purse
     */
    HavePurse : boolean = false;

    /**
     * Whether she owes you a favour
     */
    OwedFavour : boolean = false;

    TimeSinceLastFlirt : number = 0;

    /**
     * Whether you are changing venues. Makes her more easily ask to pee.
     */
    ChangeVenueFlag : boolean = false;

    /**
     * Whether you checked her out.
     */
    CheckedHerOut : boolean = false;

    /**
     * Where you are currently in a state where you're allowed to flirt.
     */
    AllowedToFlirt : boolean = false;

    private randCounter : number = 0;

    pushLoc(location: LocationCategory) {
        this.LocStack.unshift(location); // Use global directly
    }

    popLoc() {
        return this.LocStack.shift(); // Use global directly
    }

    goBack(){
        this.LocStack.pop();
        this.LocStack[0].function();
    }

    get RandCounter(): number {
        return this.randCounter;
    }

    incRandom() {
        this.randCounter = (this.RandCounter + Math.floor(Math.random() * 2) + 1) % 5;
    }

    get CurrentLocation(): LocationCategory {
        return this.LocStack[0];
    }
}


class Person {
    private _bladderUrge: number;
    UnderWearColour: string = "black";
    Bladder : number = 100;
    Tummy : number = 100
    MaxTummy : number = 100;


    /**
     * Level where the person starts to feel the first urge to pee.
     */
    get bladderUrge(): number {
        return this._bladderUrge;
    }

    /**
     * Level where the person constantly needs to go.
     */
    get bladderNeed(): number {
        return this._bladderUrge * 2;
    }

    /**
     * Level where the person's need to pee becomes an emergency.
     */
    get bladderEmer(): number {
        return this._bladderUrge * 3;
    }

    /**
     * Level where the person loses control.
     */
    get bladderLose(): number {
        return this._bladderUrge * 3 + 150;
    }

    /**
     * Level where the person spurts as they cum.
     */
    get bladderCumLose(): number {
        return this._bladderUrge * 4;
    }

    /**
     * Level where the person can't hold it during sex.
     */
    get bladderSexLose(): number {
        return this._bladderUrge * 5;
    }

    readonly MinUrge: number;

    constructor(bladderUrge: number, bladder: number, tummy: number, maxTummy : number) {
        this._bladderUrge = bladderUrge;
        this.MinUrge = bladderUrge * minperc / 100
        this.Bladder = bladder;
        this.Tummy = tummy;
        this.MaxTummy = maxTummy;
    }
}

class dateNPC extends Person{
    readonly name: string;

    get talkHTml() : string{
        return "<b>" + this.name + ":&nbsp</b>"
    }

    get gaspHTml() : string{
        return "<b>" + this.name + " gasps:&nbsp</b>"
    }

    constructor(bladderUrge: number, name: string) {
        super(bladderUrge);
        this.name = name;
    }
}

class Time{
    hour: number = 19;
    minute: number = 0;

    totalTime : number = 0;

    nextTick() : void{
        this.minute += gameSettings.TimeSpeed;
        this.totalTime += gameSettings.TimeSpeed;
        if (this.minute >= 60){
            this.minute = 0;
            this.hour++;
        }
    }

    get timeString() : string{
        const hours = this.hour % 12 || 12;
        const minutes = this.minute.toString().padStart(2, '0');
        const period = this.hour < 12 ? 'AM' : 'PM';
        return `${hours}:${minutes} ${period}`;
    }
}

export class GameLocation {
    category: LocationCategory;
    function: Function;
    constructor(category: LocationCategory, LocFunction: Function){
        this.category = category;
        this.function = LocFunction;
    }
}

export const gameState = new GameState();