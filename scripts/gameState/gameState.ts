import {gameSettings, PersonSettings} from "../settings/gameSettings";
import {getRandomValueFromNormalDistribution} from "../helperFiles/helperFunctions";
import {Person} from "./Person";
import { randomInt } from "../shims";
import { yourbladurge, yourcustomurge, yourbladder, yourtummy, ymaxtummy, ymaxbeer, ydrankbeer, ynowpeeing } from '../yourbladder';
import { bladurge } from '../bladder';
import { girlname } from '../quotes';
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

class InteractionState {
    FlirtCounter: number = 0;
    TimeSinceLastFlirt: number = 0;
    ChangeVenueFlag: boolean = false;
    CheckedHerOut: boolean = false;
    AllowedToFlirt: boolean = false;
    ShowedNeed: boolean = false;
    FlirtedFlag: number = 0;
    NoFlirtFlag: number = 0;
    MaxFlirts: number = 2;
    RandMax: number = 5;

    /**
     * Whether you currently have her purse
     */
    HavePurse : boolean = false;

    /**
     * How many favours she owes you (counter — can accumulate and be spent)
     */
    OwedFavour : number = 0;
}

class RomanceState {
    MaxKiss: number = 7;
    MaxFeel: number = 7;
    Arousal: number = 0;
    KissCounter: number = 0;
    FeelCounter: number = 0;
    FuckingNow: number = 0;
    ChampagneCounter: number = 0;
}


class RuntimeContext {
    Player!: Person;
    Companion!: dateNPC;
    private initialized = false;
    LastMoney : number = 0;
    LastAttraction : number = 0;
    LastShyness : number = 0;
    private _money: number = gameSettings.StartMoney;
    private _attraction: number = 10;
    private _shyness: number = 90;
    private static readonly MinAttraction = 0;
    private static readonly MaxAttraction = 130;
    private static readonly MinShyness = 0;
    private static readonly MaxShyness = 100;
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
    Interactions: InteractionState = new InteractionState();
    Romance: RomanceState = new RomanceState();

    randCounter : number = 0;

    // Late-night flag (set when thetime > 75)
    Late: number = 0;

    // Shopping session flag (1 while in store)
    Shopping: number = 0;

    // Venue closing times (ticks from 7 PM)
    ClubClosingTime: number = 7 * 60;     // 420 = 2:00 AM
    TheaterClosingTime: number = 3 * 60;  // 180 = 10:00 PM
    BarClosingTime: number = 6 * 60;      // 360 = 1:00 AM

    // Time progression rate
    TimeSpeed: number = 2;

    // Whether the player bladder mechanic is enabled
    PlayerBladder: boolean = true;

    // fuckHer state
    DrankChamp: number = 0;

    // drive state
    HasWetTheCar: number = 0;

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
    private _isMultipleMovesEnabled = true;
    private _isMovesAutoReset = false;
    PhotoChoice: any = undefined;
    private _isStatsVisible = true;
    private _isImagesEnabled = true;
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
    private _imgs: Record<string, Record<string, string>> = RuntimeContext.createDefaultImgsMap();

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

    // shims.ts deep fields (JSON caches)
    Settings: any = undefined;
    StatsBars: any = undefined;
    EndScreens: any = undefined;

    // fuckHer.ts deep field
    SexActions: any = undefined;

    // quotes.ts deep fields (JSON caches + dialogue sets)
    CalledJsons: any = {};
    LocJson: any = null;
    FlirtResps: any = undefined;
    FeelUp: any = undefined;
    Kissing: any = undefined;
    YPeeLines: any = undefined;
    PeeLines: any = undefined;
    Needs: any = undefined;
    YNeeds: any = undefined;
    DrinkLines: any = undefined;
    Appearance: any = undefined;
    Drive: any = undefined;
    General: any = undefined;
    Darts: any = undefined;
    SexLines: any = undefined;
    ObjQuotes: any = undefined;

    // locations.ts deep fields
    Locations: any = undefined;
    SharedLoc: any = undefined;

    // theBar.ts deep fields
    Bar: any = undefined;
    TalkUnused: any = undefined;

    // theClub.ts deep field
    Club: any = undefined;

    // theatre.ts deep field
    Theatre: any = undefined;

    // theMakeOut.ts deep field
    MakeOut: any = undefined;

    // herhome.ts deep field
    HerHome: any = undefined;

    // shims.ts — legacy string-based location stack (separate from this.LocStack which uses GameLocation[])
    LegacyLocStack: string[] = ["yourhome"];

    init(): void {
        if (this.initialized) {
            return;
        }

        // Read legacy player globals so initialization is
        // consistent with setup()/save-load values and safe when missing.
        const rawPlayerUrge = Number(yourbladurge);
        const rawPlayerCustomUrge = Number(yourcustomurge);
        const playerUrge = Number.isFinite(rawPlayerUrge)
            ? rawPlayerUrge
            : (Number.isFinite(rawPlayerCustomUrge) ? rawPlayerCustomUrge : 500);

        const rawPlayerBladder = Number(yourbladder);
        const rawPlayerTummy = Number(yourtummy);
        const rawPlayerMaxTummy = Number(ymaxtummy);
        const rawPlayerMaxAlcohol = Number(ymaxbeer);

        this.Player = new Person({
            bladderUrge: playerUrge,
            startBladderVolume: Number.isFinite(rawPlayerBladder) ? rawPlayerBladder : 500,
            startTummyVolume: Number.isFinite(rawPlayerTummy) ? rawPlayerTummy : 200,
            startMaxTummy: Number.isFinite(rawPlayerMaxTummy) ? rawPlayerMaxTummy : 500,
            startMaxAlcohol: Number.isFinite(rawPlayerMaxAlcohol) ? rawPlayerMaxAlcohol : 1000,
            minPercentage: 70
        }, "player");

        const rawPlayerAlcohol = Number(ydrankbeer);
        this.Player.AlcoholInTummy = Number.isFinite(rawPlayerAlcohol) ? rawPlayerAlcohol : 0;
        this.Player.NowPeeing = !!ynowpeeing;

        // Read legacy module variables for companion initialization.
        const rawGirlName = girlname;
        const rawUrge = Number(bladurge);
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

    public get isInitialized(): boolean {
        return this.initialized;
    }

    private normalizeLegacyToggle(value: number | boolean): boolean | undefined {
        if (typeof value === "boolean") {
            return value;
        }

        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return undefined;
        }

        return numericValue !== 0;
    }

    /**
     * Canonical setter for the images-enabled runtime flag.
     * Accepts legacy numeric 0/1 writes and ignores invalid numeric input.
     */
    setIsImagesEnabled(value: number | boolean): void {
        const normalized = this.normalizeLegacyToggle(value);
        if (typeof normalized === "undefined") {
            return;
        }

        this._isImagesEnabled = normalized;
    }

    get IsImagesEnabled(): boolean {
        return this._isImagesEnabled;
    }

    /**
     * Canonical setter for the stats-visible runtime flag.
     * Accepts legacy numeric 0/1 writes and ignores invalid numeric input.
     */
    setIsStatsVisible(value: number | boolean): void {
        const normalized = this.normalizeLegacyToggle(value);
        if (typeof normalized === "undefined") {
            return;
        }

        this._isStatsVisible = normalized;
    }

    get IsStatsVisible(): boolean {
        return this._isStatsVisible;
    }

    /**
     * Canonical setter for the repeat-sex-actions toggle.
     * Accepts legacy numeric 0/1 writes and ignores invalid numeric input.
     */
    setIsMultipleMovesEnabled(value: number | boolean): void {
        const normalized = this.normalizeLegacyToggle(value);
        if (typeof normalized === "undefined") {
            return;
        }

        this._isMultipleMovesEnabled = normalized;
    }

    get IsMultipleMovesEnabled(): boolean {
        return this._isMultipleMovesEnabled;
    }

    /**
     * Canonical setter for the sex-action reset policy.
     * Accepts legacy numeric 0/1 writes and ignores invalid numeric input.
     */
    setIsMovesAutoReset(value: number | boolean): void {
        const normalized = this.normalizeLegacyToggle(value);
        if (typeof normalized === "undefined") {
            return;
        }

        this._isMovesAutoReset = normalized;
    }

    get IsMovesAutoReset(): boolean {
        return this._isMovesAutoReset;
    }

    setDrankChamp(value: number): void {
        if (!Number.isFinite(value)) {
            return;
        }

        this.DrankChamp = Number(value);
    }

    setSexActions(value: any): void {
        this.SexActions = value;
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

    /**
     * Sets canonical attraction state and mirrors to the legacy global.
     *
     * Numeric contract: accepts finite number inputs only. Non-finite values
     * (`NaN`, `Infinity`, `-Infinity`) are deterministic no-op.
     *
     * Bridge contract: legacy compatibility setters in shims delegate here after
     * runtime initialization. This method is the authoritative write path.
     *
     * Side effects on valid write: (1) LastAttraction is set to the prior
     * canonical value, (2) Attraction is updated with the clamped value,
     * (3) window.attraction is mirrored to that clamped value. All three
     * updates occur atomically in one execution.
     *
     * @param value Numeric value to set. Must be finite.
     * @side-effect Updates LastAttraction to the prior canonical value.
     * @side-effect Updates window.attraction to mirror the canonical value.
     */
    setAttraction(value: number): void {
        if (!Number.isFinite(value)) {
            return;
        }

        const clamped = Math.max(RuntimeContext.MinAttraction, Math.min(RuntimeContext.MaxAttraction, value));
        const previous = this._attraction;

        this.LastAttraction = previous;
        this._attraction = clamped;
        (globalThis as any).__syncLegacyAttractionMirror(clamped);
    }

    get Shyness(): number {
        return this._shyness;
    }

    set Shyness(value: number) {
        this._shyness = value;
    }

    /**
     * Sets canonical shyness state and mirrors to the legacy global.
     *
     * Numeric contract: accepts finite number inputs only. Non-finite values
     * (`NaN`, `Infinity`, `-Infinity`) are deterministic no-op.
     *
     * Bridge contract: legacy compatibility setters in shims delegate here after
     * runtime initialization. This method is the authoritative write path.
     *
     * Side effects on valid write: (1) LastShyness is set to the prior
     * canonical value, (2) Shyness is updated with the clamped value,
     * (3) window.shyness is mirrored to that clamped value. All three
     * updates occur atomically in one execution.
     *
     * @param value Numeric value to set. Must be finite.
     * @side-effect Updates LastShyness to the prior canonical value.
     * @side-effect Updates window.shyness to mirror the canonical value.
     */
    setShyness(value: number): void {
        if (!Number.isFinite(value)) {
            return;
        }

        const clamped = Math.max(RuntimeContext.MinShyness, Math.min(RuntimeContext.MaxShyness, value));
        const previous = this._shyness;

        this.LastShyness = previous;
        this._shyness = clamped;
        (globalThis as any).__syncLegacyShynessMirror(clamped);
    }

    get CurRandCounter() : number {
        return this._randCounter;
    }

    incRandCounter() : void {
        const increment = 1 + randomInt(2);
        this._randCounter = (this._randCounter + increment) % gameSettings.RandCounterMax;
    }

    private static readonly DefaultImageGirls = ["Jennifer", "Karen", "Laura", "Melissa"];

    private static createDefaultImgsMap(): Record<string, Record<string, string>> {
        const defaults: Record<string, Record<string, string>> = {};
        for (const girl of RuntimeContext.DefaultImageGirls) {
            defaults[girl] = {};
        }
        return defaults;
    }

    private static isObjectRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    /**
     * Canonical image-map sanitizer used by setImgs/import paths.
     *
     * It accepts loose object input and returns a stable map where each girl
     * key points to a string-only image dictionary. Missing default girls are
     * added with empty dictionaries, and malformed nested values are replaced
     * with empty dictionaries.
     */
    private static normalizeImgs(input: Record<string, unknown>): Record<string, Record<string, string>> {
        const normalized: Record<string, Record<string, string>> = {};

        for (const [girlName, imageMap] of Object.entries(input)) {
            if (!RuntimeContext.isObjectRecord(imageMap)) {
                normalized[girlName] = {};
                continue;
            }

            const perGirl: Record<string, string> = {};
            for (const [imageKey, urlValue] of Object.entries(imageMap)) {
                if (typeof urlValue === "string") {
                    perGirl[imageKey] = urlValue;
                }
            }
            normalized[girlName] = perGirl;
        }

        for (const girl of RuntimeContext.DefaultImageGirls) {
            if (!RuntimeContext.isObjectRecord(normalized[girl])) {
                normalized[girl] = {};
            }
        }

        return normalized;
    }

    /**
     * Canonical image-map owner for drive/images migration.
     *
     * Getter returns the live stored reference by design to preserve legacy
     * compatibility with script-style callers that read nested maps.
     */
    get Imgs(): Record<string, Record<string, string>> {
        return this._imgs;
    }

    /**
     * Canonical setter for image maps used by images.ts bridge paths.
     * Invalid inputs are deterministic no-op.
     */
    setImgs(nextImgs: unknown): void {
        if (!RuntimeContext.isObjectRecord(nextImgs)) {
            return;
        }

        this._imgs = RuntimeContext.normalizeImgs(nextImgs);
    }

    resetImgsToDefault(): void {
        this._imgs = RuntimeContext.createDefaultImgsMap();
    }

    /**
     * Imports `localStorage["imgs"]` into canonical state with resilient
     * defaults. Missing/invalid payloads reset to defaults.
     */
    tryImportImgsFromStorage(): void {
        const raw = globalThis.localStorage?.getItem("imgs");
        if (!raw) {
            this.resetImgsToDefault();
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (!RuntimeContext.isObjectRecord(parsed)) {
                this.resetImgsToDefault();
                return;
            }
            this.setImgs(parsed);
        } catch {
            this.resetImgsToDefault();
        }
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
        super(settings, "companion");
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

/**
 * Transitional runtime container name while ownership is migrated.
 * End-state intent: keep `gameState` as the canonical run-state identity.
 */
export const runtimeContext = new RuntimeContext();

/**
 * Compatibility alias for existing imports/callers during the context split.
 */
export const gameState = runtimeContext;