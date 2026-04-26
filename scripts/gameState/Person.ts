import {gameSettings} from "../settings/gameSettings";
import {getRandomValueFromNormalDistribution} from "../helperFiles/helperFunctions";
import {runtimeContext} from "./runtimeContext";
import {BladderLevel} from "./bladderLevel";
import { IBackpackItem, IDrink } from "../backPackItems";
import { lastpeetime, minperc } from "../bladder";
import {PersonSaveObject} from "./SaveObject/PersonSaveObject";
import {PersonSettings} from "../settings/personSettings";

export type LegacyBladderMirror = "companion" | "player";

export class Person {

    constructor(settings: PersonSettings, legacyBladderMirror: LegacyBladderMirror = "companion") {
        this._bladderUrge = settings.bladderUrge;
        this.legacyBladderMirror = legacyBladderMirror;
        this.MinUrge = settings.bladderUrge * minperc / 100
        this.Bladder = settings.startBladderVolume;
        this.TummyVolume = settings.startTummyVolume;
        this.MaxTummy = settings.startMaxTummy;
        this.TummyAverage = settings.startTummyVolume;
        this.MaxAlcohol = settings.startMaxAlcohol;
    }

    private _bladderUrge: number;
    private _timeLastBreakingSeal: number = 0;
    readonly MinUrge: number;
    private _arousal: number = 0;
    UnderWearColour: string = "black";
    Bladder: number;
    TummyVolume: number;
    MaxTummy: number;
    MaxAlcohol: number;
    ItemsDrankSinceLastPee: IBackpackItem[] = [];

    /**
     * The average tummy level over the last 10 ticks.
     * @private
     */
    private TummyAverage: number;

    /**
     * The time of the last time the person peed.
     * @private
     */
    private lastPeeTime: number = 0;

    /**
     * The time of the last time the person was asked to keep holding.
     * @private
     */
    private lastAskedToHoldTime: number = 0;
    private readonly legacyBladderMirror: LegacyBladderMirror;

    /**
     * Getter for lastPeeTime — when the person last peed (for save/load serialization).
     */
    get LastPeeTime(): number {
        return this.lastPeeTime;
    }

    /**
     * Setter for lastPeeTime.
     */
    set LastPeeTime(v: number) {
        this.lastPeeTime = v;
    }

    /**
     * A number to represent the amount of alcohol in the tummy.
     * Used to simulate the diuretic effect.
     */
    AlcoholInTummy: number = 0;

    /**
     * The person is currently peeing.
     */
    NowPeeing: boolean = false;


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

    /**
     * Tries to drain the given amount from the tummy to the bladder, simulating digestion.
     * Returns true if successful, false if not enough volume in tummy.
     * @param amount
     */
    tryDrainTummyVolumeBy(amount: number) : boolean {
        if (this.TummyVolume < amount) {
            return false;
        }
        this.TummyVolume -= amount;
        return true;
    }


    /**
     * Returns the current bladder thresholds as an array, always calculated on the fly.
     */
    private getBladderThresholds() {
        return [
            { value: this.bladderUrge, state: BladderLevel.Urge },
            { value: this.bladderNeed, state: BladderLevel.Need },
            { value: this.bladderEmer, state: BladderLevel.Emergency },
            { value: this.bladderCumLose, state: BladderLevel.CumLose },
            { value: this.bladderSexLose, state: BladderLevel.SexLose },
            { value: this.bladderLose, state: BladderLevel.Lose }
        ].sort((a, b) => a.value - b.value);
    }

    get bladderState(): BladderLevel {
        const thresholds = this.getBladderThresholds();
        if (thresholds.length === 0) return BladderLevel.Empty;

        // Below the first threshold is Empty
        if (this.Bladder < thresholds[0].value) {
            return BladderLevel.Empty;
        }

        // Find the interval [threshold[i], threshold[i+1])
        for (let i = 0; i < thresholds.length - 1; i++) {
            if (this.Bladder < thresholds[i + 1].value) {
                return thresholds[i].state;
            }
        }

        // At or above the highest threshold -> the highest category
        return thresholds[thresholds.length - 1].state;
    }

    /**
     * Returns true if the current bladder state is below the given level
     * @param level the BladderLEvel to comapre against.
     */
    isBladderStateBelow(level: BladderLevel): boolean {
        const thresholds = this.getBladderThresholds();
        // Find the index of the given level in the sorted thresholds
        const idx = thresholds.findIndex(t => t.state === level);
        if (idx === -1) throw new Error(`Invalid bladder level: ${level}`);
        // If bladder is below the threshold for this level, it's "below"
        return this.Bladder < thresholds[idx].value;
    }

    /**
     * Returns true if the current bladder state is above the given level.
     * @param level The BladderLevel to compare against.
     */
    isBladderStateAbove(level: BladderLevel): boolean {
        const thresholds = this.getBladderThresholds();
        // Find the index of the given level in the sorted thresholds
        const idx = thresholds.findIndex(t => t.state === level);
        if (idx === -1) throw new Error(`Invalid bladder level: ${level}`);
        // If bladder is above the threshold for this level, it's "above"
        return this.Bladder >= thresholds[idx].value;
    }

    /**
     * Returns the number of millilitres until the next threshold of the given level is reached.
     * If the current bladder state is already above the given level,
     * returns a negative number to indicate how far above it is
     * @param level The BladderLevel to compare against.
     */
    millilitresTillBladderThreshold(level: BladderLevel): number {
        const thresholds = this.getBladderThresholds();
        const idx = thresholds.findIndex(t => t.state === level);
        if (idx === -1) throw new Error(`Invalid bladder level: ${level}`);
        return thresholds[idx].value - this.Bladder;
    }

    processFluidsDigestion() {
        this.TummyAverage = Math.round((this.TummyAverage * (gameSettings.TummyDecayCycles - 1) + this.TummyVolume) / (gameSettings.TummyDecayCycles))
        let tummyDecrease = Math.round(this.TummyAverage / 10);
        if (this.AlcoholInTummy === 0 && tummyDecrease > 12) tummyDecrease = 12;
        else if (this.AlcoholInTummy > 0 && tummyDecrease > 18) tummyDecrease = 18;
        else if (tummyDecrease < 1) tummyDecrease = 2;
        tummyDecrease = getRandomValueFromNormalDistribution(tummyDecrease);
        this.TummyVolume -= tummyDecrease;
        if (this.TummyVolume < 0) this.TummyVolume = 0;
        this.Bladder += tummyDecrease;
        if (this.AlcoholInTummy > 0) this.AlcoholInTummy -= 1;
    }

    fillBladderBy(amount : number) {
        this.Bladder += amount;
    }

    /**
     * Person is peeing. Resets all counters related.
     */
    pee() {
        if (gameSettings.BladderDecay) {
            if (this.Bladder > this.bladderLose)
                this._bladderUrge = this.bladderUrge * 0.9; // Decay by 10 percent
            else if (gameSettings.BladderDecayOnEmer && this.Bladder > this.bladderEmer)
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
            else if (gameSettings.BladderDecayOnBreakingTheSeal && this.AlcoholInTummy > 15 && runtimeContext.Time.timeSince(this._timeLastBreakingSeal) > 60) {
                // breaking the seal decay can only happen once an hour
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
                this._timeLastBreakingSeal = runtimeContext.Time.totalTime;
            }
        }

        this.Bladder = 0;
        this.NowPeeing = true;
        this.lastPeeTime = runtimeContext.Time.totalTime;
        this.syncThresholdsToLegacy();
        this.ItemsDrankSinceLastPee = [];
    }

    /**
     * Sets the base bladder urge threshold. All derived thresholds (need, emergency, lose, etc.)
     * are computed from this value.
     */
    setUrge(value: number) {
        this._bladderUrge = value;
    }

    /**
     * Pushes the Person's bladder thresholds back to legacy compatibility mirrors.
     * The player path uses an explicit helper so derived legacy thresholds do not
     * round-trip back into canonical urge ownership through window setters.
     */
    private syncThresholdsToLegacy() {
        const w = window as any;
        if (this.legacyBladderMirror === "player") {
            if (typeof w.syncPlayerLegacyThresholdsFromCanonical === "function") {
                w.syncPlayerLegacyThresholdsFromCanonical(this._bladderUrge);
            }
            return;
        }

        if (typeof w.syncCompanionLegacyThresholdsFromCanonical === "function") {
            w.syncCompanionLegacyThresholdsFromCanonical(this._bladderUrge);
        }
    }

    /**
     * Drinks a drink.
     * @param drink
     * @returns false if the drink is not allowed to be consumed. True otherwise.
     */
    drink(drink: IDrink): boolean {
        if ((this.IsTummyFull || this.IsAlcoholLimitExceeded) && drink.tumInc === 0) return false;
        this.Bladder -= drink.volume;
        this.ItemsDrankSinceLastPee.push(drink);
        this.TummyVolume += drink.volume;
        this.AlcoholInTummy += drink.alhocolVolume;
        this.MaxTummy += drink.tumInc;
        return true;
    }

    get IsTummyFull(): boolean {
        return this.TummyVolume > this.MaxTummy;
    }

    get IsAlcoholLimitExceeded(): boolean {
        return this.AlcoholInTummy > this.MaxAlcohol;
    }

    get TimeSinceLastPeed() {
        return runtimeContext.Time.timeSince(this.lastPeeTime);
    }

    /**
     * Fills the bladder to emergency level, provided there is enough liquid in the tummy.
     * returns true if any filling happened, false if no filling happened (either because already at emergency or not enough in tummy).
     * @constructor
     */
    TryMagicFillBladderToEmergency() : boolean{
        if (this.isBladderStateAbove(BladderLevel.Emergency)){
            return false; // We're already at emergency so no need to fill
        }

        if (this.TummyVolume < 30){
            return false; // Tummy is virtually empty so nothing to fill from.
        }

        let neededTillEmergency = this.millilitresTillBladderThreshold(BladderLevel.Emergency)
        if (neededTillEmergency < 0) throw new Error("Needed to fill to bladder emergency level, " +
            "but found bladder already above level despite checking it wasn't")

        // If enough volume in tummy fill up till emergency.
        if (neededTillEmergency < this.TummyVolume){
            this.Bladder = this.bladderEmer;
            if (!this.tryDrainTummyVolumeBy(neededTillEmergency)){
                throw new Error("Despite validating there is enough in tummy to fill to emergency, it was found there wasn't");
            }
            return true;
        }

        // Just flush all what's in tummy into bladder.
        this.fillBladderBy(this.TummyVolume);
        this.TummyVolume = 0;
        return true;
    }

    /**
     * Exports the current Person state to a PersonSaveObject for serialization.
     */
    get ExportToSaveObject(): PersonSaveObject {
        return {
            BladderUrge: this._bladderUrge,
            Bladder: this.Bladder,
            TimeOfLastBreakingSeal: this._timeLastBreakingSeal,
            Tummy: this.TummyVolume,
            MaxTummy: this.MaxTummy,
            MaxAlcohol: this.MaxAlcohol,
            ItemsDrankSinceLastPee: this.ItemsDrankSinceLastPee.slice(),
            AlcoholInTummy: this.AlcoholInTummy,
            NowPeeing: this.NowPeeing,
            TummyAverage: this.TummyAverage,
            lastPeeTime: this.lastPeeTime,
            lastAskedToHoldTime: this.lastAskedToHoldTime
        };
    }

    /**
     * Restores a Person from a PersonSaveObject and PersonSettings.
     * @param save The PersonSaveObject to restore from.
     * @param settings The PersonSettings used for construction.
     * @param legacyBladderMirror Optional legacy mirror type.
     */
    static fromSaveObject(save: PersonSaveObject, settings: PersonSettings, legacyBladderMirror: LegacyBladderMirror = "companion"): Person {
        const person = new Person(settings, legacyBladderMirror);
        person._bladderUrge = save.BladderUrge;
        person.Bladder = save.Bladder;
        person._timeLastBreakingSeal = save.TimeOfLastBreakingSeal;
        person.TummyVolume = save.Tummy;
        person.MaxTummy = save.MaxTummy;
        person.MaxAlcohol = save.MaxAlcohol;
        person.ItemsDrankSinceLastPee = save.ItemsDrankSinceLastPee.slice();
        person.AlcoholInTummy = save.AlcoholInTummy;
        person.NowPeeing = save.NowPeeing;
        person.TummyAverage = save.TummyAverage;
        person.lastPeeTime = save.lastPeeTime;
        person.lastAskedToHoldTime = save.lastAskedToHoldTime;
        return person;
    }
}