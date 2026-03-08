import {gameSettings, PersonSettings} from "../settings/gameSettings";
import {getRandomValueFromNormalDistribution} from "../helperFiles/helperFunctions";
import {Person} from "./Person";
import {getLegacyBladderThresholds} from "./bladderThresholds";
export enum LocationCategory {
    Start,
    Options,
    ExplainImg,
    HideScreen,
    CustomGirl,
    YourHome,
    GoStore,
    CallHer,
    DrinkingGame,
}


class GameState {
    Player!: Person;
    Companion!: dateNPC;
    private initialized = false;
    LastMoney : number = 0;
    LastAttraction : number = 0;
    LastShyness : number = 0;
    private _money: number = gameSettings.StartMoney;
    private _attraction: number = 10;
    private _shyness: number = 90;
    readonly LocStack : GameLocation[] = [];
    private _randCounter = randomInt(gameSettings.RandCounterMax);

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

    randCounter : number = 0;

    /**
     * She has just visually displayed her need.
     */
    ShowedNeed : boolean = false;

    init(): void {
        if (this.initialized) {
            return;
        }

        this.Player = new Person({
            bladderUrge: 500,
            startBladderVolume: 500,
            startTummyVolume: 200,
            startMaxTummy: 500,
            startMaxAlcohol: 500,
            minPercentage: 70
        });

        // Read legacy globals through globalThis so missing values don't throw at load time.
        const rawGirlName = (globalThis as any).girlname;
        const thresholds = getLegacyBladderThresholds();
        const companionName = typeof rawGirlName === "string" && rawGirlName.length > 0
            ? rawGirlName
            : "Melissa";

        this.Companion = new dateNPC({
            bladderUrge: thresholds.urge,
            startBladderVolume: 0,
            startTummyVolume: 0,
            startMaxTummy: 300,
            startMaxAlcohol: 750,
            minPercentage: 70
        }, companionName);

        this.initialized = true;
    }

    pushLoc(location: GameLocation) {
        this.LocStack.unshift(location);
    }

    popLoc() {
        return this.LocStack.shift();
    }

    goBack(){
        this.LocStack.pop();
        this.LocStack[0].function();
    }

    get RandCounter(): number {
        return this.randCounter;
    }

    incRandom() {
        this.randCounter = (this.RandCounter + randomInt(2) + 1) % 5;
    }

    get CurrentLocation(): GameLocation | undefined {
        return this.LocStack[0];
    }

    setCurrentLocation(location: GameLocation): void {
        if (this.LocStack.length === 0) {
            this.LocStack.unshift(location);
            return;
        }
        this.LocStack[0] = location;
    }

    isCurrentLocation(category: LocationCategory) : boolean{
        return this.LocStack[0]?.category === category;
    }

    get Money(): number {
        return this._money;
    }

    set Money(value: number) {
        this._money = value;
        if (typeof (globalThis as any).money !== "undefined") {
            (globalThis as any).money = value;
        }
    }

    PayAmount (value: number) : boolean {
        if (value > this._money) return false;
        this.Money = this._money - value;
        return true;
    }

    ReceiveMoney (value: number) : void {
        this.Money = this._money + value;
    }

    get Attraction(): number {
        return this._attraction;
    }

    set Attraction(value: number) {
        this._attraction = value;
        if (typeof (globalThis as any).attraction !== "undefined") {
            (globalThis as any).attraction = value;
        }
    }

    get Shyness(): number {
        return this._shyness;
    }

    set Shyness(value: number) {
        this._shyness = value;
        if (typeof (globalThis as any).shyness !== "undefined") {
            (globalThis as any).shyness = value;
        }
    }

    get CurRandCounter() : number {
        return this._randCounter;
    }

    incRandCounter() : void {
        const increment = 1 + randomInt(2);
        this._randCounter = (this._randCounter + increment) % gameSettings.RandCounterMax;
    }
}




class dateNPC extends Person{
    readonly name: string;

    get talkHtml() : string{
        return "<b>" + this.name + ":&nbsp</b>"
    }

    get gaspHtml() : string{
        return "<b>" + this.name + " gasps:&nbsp</b>"
    }

    constructor(settings: PersonSettings, name: string) {
        super(settings);
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

    toString() : string {
        return this.timeString;
    }

    timeSince(timeStamp: number) :number {
        return this.totalTime - timeStamp;
    }
}

export class GameLocation {
    category: LocationCategory;
    function: () => void;

    constructor(category: LocationCategory, LocFunction: () => void) {
        this.category = category;
        this.function = LocFunction;
    }

    get isPlayerOnly() : boolean{
        return GameLocation.PlayerOnlyLocations.includes(this.category);
    }
    get isPreGame() : boolean{
        return GameLocation.PreGameLocations.includes(this.category);
    }

    private static readonly PlayerOnlyLocations = [LocationCategory.YourHome, LocationCategory.GoStore, LocationCategory.CallHer];
    private static readonly PreGameLocations = [LocationCategory.Start, LocationCategory.Options, LocationCategory.ExplainImg, LocationCategory.HideScreen, LocationCategory.CustomGirl];
}

export const gameState = new GameState();