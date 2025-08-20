import {ImageSettings} from "./imageSettings";

export enum baseGirl{
    Jennifer = 'Jennifer',
    Laura = 'Laura',
    Karen = 'Karen',
    Melissa = 'Melissa'
}

export enum ImageChoice{
    Images,
    Ascii,
    None
}

export class GameSettings{
    private _playerBladder : boolean = true;

    /**
     * The name of the date
     */
    DateName : string = "Laura"

    get PlayerBladder(): boolean {
        return this._playerBladder;
    }

    set PlayerBladder(value: boolean) {
        this._playerBladder = value;
        if (value){
        }
    }

    /**
     * Whether the player bladder is enabled in the drinking game, if the player bladder is disabled otherwise. When player bladder is enabled this setting is ignored.
     */
    PlayerDrinkGame : boolean = true

    StartMoney : number = 200

    BaseGirl : baseGirl = baseGirl.Laura

    IsCustomGirl : boolean = false

    ClubClosingTime : number = 7 * 60; // 2: 00 AM

    TheaterClosingTime : number = 3 * 60; // 10: 00 PM last showing

    BarClosingTime : number = 6 * 60; // 1: 00 AM

    TimeSpeed: number = 2;

    /**
     * Max number of kisses that have an effect per location.
     */
    MaxKissCount : number = 7;

    /**
     * Max number of feelings that have an effect per location.
     */
    MaxFeelCount : number = 7;

    /**
     * Max number of flirt points per venue.
     */

    MaxFlirtCount : number = 2;

    /**
     * Option for which image type is shown.
     */
    ImageChoice : ImageChoice = ImageChoice.Ascii;

    /**
     * Show detailed stats about bladder and tummy.
     */
    ShowStats : boolean = true;

    /**
     * The number of cycles for tummy decay to average bladder filling.
     * This prevents the bladder filling exponentially once a lot is drunk.
     */
    TummyDecayCycles : number = 6;

    /**
     * Whether the bladder should decay if peeing on bladder failure.
     */
    BladderDecay : boolean = true;

    /**
     * Whether the bladder should also decay when peeing on bladder emergency. Requires bladder decay to be enabled.
     */
    BladderDecayOnEmer : boolean = true;

    /**
     * Whether the bladder should also decay when peeing after drinking alcohol. Requires bladder decay to be enabled.
     */
    BladderDecayOnBreakingTheSeal : boolean = true;

    /**
     * Sets the max value of the random counter.
     */
    RandCounterMax : number = 5;

    /**
     * Image settings to show the state of the date.
     */
    ImageSettings : ImageSettings = new ImageSettings();
}

class CompanionSettings {
    CompanionName : string = "Laura"

}

export const gameSettings = new GameSettings();