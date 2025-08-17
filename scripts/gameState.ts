import {gameSettings} from "./gameSettings";
import {getRandomValueFromNormalDistribution} from "./helperFiles/helperFunctions";
export enum LocationCategory {
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
    Player: Person = new Person(500, 500, 200, 500);
    Companion: dateNPC = new dateNPC(bladurge, girlname);
    LastMoney : number = 0;
    LastAttraction : number = 0;
    LastShyness : number = 0;
    private _money: number = gameSettings.StartMoney;
    Attraction: number = 10;
    Shyness : number = 90;
    readonly LocStack : GameLocation[] = [];
    private _randCounter = Math.floor(Math.random() * gameSettings.RandCounterMax);

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
        this.randCounter = (this.RandCounter + Math.floor(Math.random() * 2) + 1) % 5;
    }

    get CurrentLocation(): GameLocation {
        return this.LocStack[0];
    }

    isCurrentLocation(category: LocationCategory) : boolean{
        return this.LocStack[0].category === category;
    }

    get Money(): number {
        return this._money;
    }
    PayAmount (value: number) : boolean {
        if (value > this._money) return false;
        this._money -= value;
        return true;
    }

    ReceiveMoney (value: number) : void {
        this._money += value;
    }

    get CurRandCounter() : number {
        return this._randCounter;
    }

    incRandCounter() : void {
        const increment = 1 + Math.floor(Math.random() * 2);
        this._randCounter = (this._randCounter + increment) % gameSettings.RandCounterMax;
    }
}


class Person {
    private _bladderUrge: number;
    private _timeLastBreakingSeal: number = 0;
    readonly MinUrge: number;
    private _arousal: number = 0;
    UnderWearColour: string = "black";
    Bladder : number;
    Tummy : number;
    MaxTummy : number;
    MaxAlcohol : number;
    ItemsDrankSinceLastPee : IBackpackItem[] = [];

    /**
     * The average tummy level over the last 10 ticks.
     * @private
     */
    private TummyAverage : number;

    /**
     * The time of the last time the person peed.
     * @private
     */
    private lastPeeTime : number = 0;

    /**
     * The time of the last time the person was asked to keep holding.
     * @private
     */
    private lastAskedToHoldTime : number = 0;

    /**
     * A number to represent the amount of alcohol in the tummy.
     * Used to simulate the diuretic effect.
     */
    AlcoholInTummy : number = 0;

    /**
     * The person is currently peeing.
     */
    NowPeeing : boolean = false;


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

    processFluidsDigestion(){
        this.TummyAverage = Math.round((this.TummyAverage * (gameSettings.TummyDecayCycles - 1) + this.Tummy) / (gameSettings.TummyDecayCycles))
        let tummyDecrease = Math.round(this.TummyAverage / 10);
        if (this.AlcoholInTummy === 0 && tummyDecrease > 12) tummyDecrease = 12;
        else if (this.AlcoholInTummy > 0 && tummyDecrease > 18) tummyDecrease = 18;
        else if (tummyDecrease < 1) tummyDecrease = 2;
        tummyDecrease = getRandomValueFromNormalDistribution(tummyDecrease);
        this.Tummy -= tummyDecrease;
        if (this.Tummy < 0) this.Tummy = 0;
        this.Bladder += tummyDecrease;
        if (this.AlcoholInTummy > 0) this.AlcoholInTummy -= 1;
    }

    /**
     * Person is peeing. Resets all counters related.
     */
    pee(){
        if (gameSettings.BladderDecay) {
            if (this.Bladder > this.bladderLose)
                this._bladderUrge = this.bladderUrge * 0.9; // Decay by 10 percent
            else if (gameSettings.BladderDecayOnEmer && this.Bladder > this.bladderEmer)
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
            else if (gameSettings.BladderDecayOnBreakingTheSeal && this.AlcoholInTummy > 15 && gameState.Time.timeSince(this._timeLastBreakingSeal) > 60 ){
                // breaking the seal decay can only happen once an hour
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
                this._timeLastBreakingSeal = gameState.Time.totalTime;
            }
        }

        this.ItemsDrankSinceLastPee = [];
    }

    /**
     * Drinks a drink.
     * @param drink
     * @returns false if the drink is not allowed to be consumed. True otherwise.
     */
    drink(drink: IDrink) : boolean {
        if ((this.IsTummyFull || this.IsAlcoholLimitExceeded) && drink.tumInc === 0) return false;
        this.Bladder -= drink.volume;
        this.ItemsDrankSinceLastPee.push(drink);
        this.Tummy += drink.volume;
        this.AlcoholInTummy += drink.alhocolVolume;
        this.MaxTummy += drink.tumInc;
        return true;
    }

    get IsTummyFull() : boolean{
        return this.Tummy > this.MaxTummy;
    }

    get IsAlcoholLimitExceeded() : boolean{
        return this.AlcoholInTummy > this.MaxAlcohol;
    }

    get TimeSinceLastPeed(){
        return gameState.Time.timeSince(lastpeetime);
    }

    constructor(bladderUrge: number, bladder: number, tummy: number, maxTummy : number, maxAlcohol = 1000) {
        this._bladderUrge = bladderUrge;
        this.MinUrge = bladderUrge * minperc / 100
        this.Bladder = bladder;
        this.Tummy = tummy;
        this.MaxTummy = maxTummy;
        this.TummyAverage = tummy;
        this.MaxAlcohol = maxAlcohol;
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
    get isOptionsMenu() : boolean{
        return GameLocation.SettingsLocations.includes(this.category);
    }

    private static readonly PlayerOnlyLocations = [LocationCategory.YourHome, LocationCategory.GoStore, LocationCategory.CallHer];
    private static readonly SettingsLocations = [LocationCategory.Options, LocationCategory.ExplainImg, LocationCategory.HideScreen, LocationCategory.CustomGirl];
}

export const gameState = new GameState();