import {gameSettings, PersonSettings} from "../settings/gameSettings";
import {getRandomValueFromNormalDistribution} from "../helperFiles/helperFunctions";
import {Person} from "./Person";
import { randomInt } from "../shims";
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
     * How many favours she owes you (counter — can accumulate and be spent)
     */
    OwedFavour : number = 0;

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

    // Late-night flag (set when thetime > 75)
    Late: number = 0;

    // Flirt interaction counters
    FlirtedFlag: number = 0;
    NoFlirtFlag: number = 0;

    // Shopping session flag (1 while in store)
    Shopping: number = 0;

    // Interaction limits (saveable — defaults match gameSettings)
    MaxFlirts: number = 2;
    MaxKiss: number = 7;
    MaxFeel: number = 7;
    RandMax: number = 5;

    // Venue closing times (ticks from 7 PM)
    ClubClosingTime: number = 7 * 60;     // 420 = 2:00 AM
    TheaterClosingTime: number = 3 * 60;  // 180 = 10:00 PM
    BarClosingTime: number = 6 * 60;      // 360 = 1:00 AM

    // Time progression rate
    TimeSpeed: number = 2;

    // Whether the player bladder mechanic is enabled
    PlayerBladder: boolean = true;

    // fuckHer state
    Arousal: number = 0;
    KissCounter: number = 0;
    FeelCounter: number = 0;
    FuckingNow: number = 0;
    ChampagneCounter: number = 0;
    DrankChamp: number = 0;

    // drive state
    WetTheCar: number = 0;

    // locations.ts state
    EmerBreak: number = 0;
    EmerHold: number = 0;

    // driveAround.ts state
    GasStation: number = 0;

    // theBar.ts state
    BarTopic: number = 0;
    Loser: string = "";

    // theClub.ts state
    ExternalFlirt: number = 0;
    WetPhoto: number = 0;
    IsNude: number = 0;
    PoseCtr: number = 0;
    OutfitCtr: number = 0;

    // theatre.ts state
    RrMovieLineThresh: number = 7;
    MovieCounter: number = 0;
    MovieChoice: string = "";
    AskedFavourite: number = 0;
    SeenMovie: number = 0;

    // theMakeOut.ts state
    AskedSwim: number = 0;
    WalkCounter: number = 0;

    // herhome.ts state
    PrePeed: number = 0;
    ElevatorWaitCounter: number = 0;
    FloorCounter: number = 0;

    // settings.ts state
    HerOutfit: string = "jeans";
    FavoriteMovie: string = "theurge";
    SuggestedLoc: string = "thebar";
    MultipleMoves: number = 1;
    RstMoves: number = 0;
    PhotoChoice: any = undefined;
    ShowStats: number = 1;
    EnableImages: number = 1;
    EnableAscii: number = 0;
    PlayerGame: number = 0;

    // quotes.ts state
    PantyColor: string = "black";
    GirlName: string = "Laura";
    CustomGirlName: string = "Amanda";
    BaseGirl: string = "Laura";
    GirlTalk: string = "<b>Laura:&nbsp;</b>";
    GirlGasp: string = "<b>Laura gasps:&nbsp;</b>";
    Comma: number = 0;
    ImagePrev: any = undefined;

    // backPackItems.ts state
    AllowItems: number = 1;
    HomeChampagne: number = 0;

    // images.ts state
    PicSet: number = 0;

    // bladder.ts state
    CustomUrge: number = 250;
    MinUrge: number = 187;
    MinPerc: number = 75;
    BladUrge: number = 250;
    BladNeed: number = 250 * 2;
    BladEmer: number = 250 * 3;
    BladLose: number = 250 * 3 + 150;
    BladCumLose: number = 250 * 4;
    BladSexLose: number = 250 * 5;
    MaxTummy: number = 250;
    MaxBeer: number = 500;
    Tummy: number = 0;
    Bladder: number = 0;
    BladDec: number = 1;
    BladDespDec: number = 1;
    Seal: number = 1;
    BeerDecCounter: number = 0;
    YBeerDecCounter: number = 0;
    PeedTowels: number = 0;
    PeedVase: number = 0;
    PeedShot: number = 0;
    PeedOutside: number = 0;
    LastPeeTime: number = 0;
    TimeHeld: number = 0;
    DrankBeer: number = 0;
    NotDesperate: number = 0;
    NotYDesperate: number = 0;
    NotHDesperate: number = 0;
    SpurtThresh: number = 5;
    YSpurtThresh: number = 3;
    BribeAskThresh: number = 7;
    BribeAskBase: number = 7;
    TumAvg: number = 0;
    RrLockedFlag: number = 0;
    SheSpurted: number = 0;
    BrokeIce: number = 0;
    SawHerPee: number = 0;
    WetLegs: number = 0;
    WetHerPanties: number = 0;
    NowPeeing: number = 0;
    GottaGoFlag: number = 0;
    AskHoldItCounter: number = 0;
    WaitCounter: number = 0;
    ToldStories: any[] = [];
    LastStory: any = undefined;

    // yourbladder.ts state
    YourBladder: number = 500;
    YourTummy: number = 200;
    YourTumAvg: number = 200;
    HoldSelf: number = 0;
    YourBladUrge: number = 500;
    YourBladNeed: number = 500 * 2;
    YourBladEmer: number = 500 * 3;
    YourBladLose: number = 500 * 3 + 150;
    YourBladCumLose: number = 500 * 4;
    YourBladSexLose: number = 500 * 5;
    YMaxTummy: number = 500;
    YMaxBeer: number = 1000;
    YourCustomUrge: number = 500;
    YMinUrge: number = 375;
    YNowPeeing: number = 0;
    YLastPeeTime: number = 0;
    YTimeHeld: number = 0;
    YDrankCocktails: number = 0;
    YDrankSodas: number = 0;
    YDrankWaters: number = 0;
    YDrankBeers: number = 0;
    YDrankBeer: number = 0;
    YRrLockedFlag: number = 0;
    YouSpurted: number = 0;

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
        const rawUrge = Number((globalThis as any).bladurge);
        const companionUrge = Number.isFinite(rawUrge) ? rawUrge : 250;
        const companionName = typeof rawGirlName === "string" && rawGirlName.length > 0
            ? rawGirlName
            : "Melissa";

        this.Companion = new dateNPC({
            bladderUrge: companionUrge,
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
    }

    get Shyness(): number {
        return this._shyness;
    }

    set Shyness(value: number) {
        this._shyness = value;
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

    get meridian(): string {
        return this.hour < 12 ? 'AM' : 'PM';
    }

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