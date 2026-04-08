import {gameSettings, PersonSettings} from "../settings/gameSettings";
import {getRandomValueFromNormalDistribution} from "../helperFiles/helperFunctions";
import {gameState} from "./gameState";
import {BladderState} from "./bladderState";
import { IBackpackItem, IDrink } from "../backPackItems";
import { lastpeetime, minperc } from "../bladder";

export class Person {
    private _bladderUrge: number;
    private _timeLastBreakingSeal: number = 0;
    readonly MinUrge: number;
    private _arousal: number = 0;
    UnderWearColour: string = "black";
    Bladder: number;
    Tummy: number;
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

    get bladderState() : BladderState {
        // Prepare thresholds and sort them ascending to establish category boundaries
        const thresholds = [
            { value: this.bladderUrge, state: BladderState.Urge },
            { value: this.bladderNeed, state: BladderState.Need },
            { value: this.bladderEmer, state: BladderState.Emergency },
            { value: this.bladderCumLose, state: BladderState.CumLose },
            { value: this.bladderSexLose, state: BladderState.SexLose },
            { value: this.bladderLose, state: BladderState.Lose }
        ].sort((a, b) => a.value - b.value);

        if (thresholds.length === 0) return BladderState.Empty;

        // Below the first threshold is Empty
        if (this.Bladder < thresholds[0].value) {
            return BladderState.Empty;
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

    processFluidsDigestion() {
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
    pee() {
        if (gameSettings.BladderDecay) {
            if (this.Bladder > this.bladderLose)
                this._bladderUrge = this.bladderUrge * 0.9; // Decay by 10 percent
            else if (gameSettings.BladderDecayOnEmer && this.Bladder > this.bladderEmer)
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
            else if (gameSettings.BladderDecayOnBreakingTheSeal && this.AlcoholInTummy > 15 && gameState.Time.timeSince(this._timeLastBreakingSeal) > 60) {
                // breaking the seal decay can only happen once an hour
                this._bladderUrge = this.bladderUrge * 0.95; // Decay by 5 percent
                this._timeLastBreakingSeal = gameState.Time.totalTime;
            }
        }

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
     * Pushes the Person's bladder thresholds back to the legacy module-scoped
     * variables via window bridge setters. Called after Person.pee() decay.
     */
    private syncThresholdsToLegacy() {
        const w = window as any;
        w.bladurge = this._bladderUrge;
        w.bladneed = this.bladderNeed;
        w.blademer = this.bladderEmer;
        w.bladlose = this.bladderLose;
        w.bladcumlose = this.bladderCumLose;
        w.bladsexlose = this.bladderSexLose;
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
        this.Tummy += drink.volume;
        this.AlcoholInTummy += drink.alhocolVolume;
        this.MaxTummy += drink.tumInc;
        return true;
    }

    get IsTummyFull(): boolean {
        return this.Tummy > this.MaxTummy;
    }

    get IsAlcoholLimitExceeded(): boolean {
        return this.AlcoholInTummy > this.MaxAlcohol;
    }

    get TimeSinceLastPeed() {
        return gameState.Time.timeSince(lastpeetime);
    }

    constructor(settings: PersonSettings) {
        this._bladderUrge = settings.bladderUrge;
        this.MinUrge = settings.bladderUrge * minperc / 100
        this.Bladder = settings.startBladderVolume;
        this.Tummy = settings.startTummyVolume;
        this.MaxTummy = settings.startMaxTummy;
        this.TummyAverage = settings.startTummyVolume;
        this.MaxAlcohol = settings.startMaxAlcohol;
    }
}