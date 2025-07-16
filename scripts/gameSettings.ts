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



class GameSettings{
    /**
     * The name of the date
     */
    DateName : string = "Laura"

    /**
     * Whether the player bladder is enabled in the game.
     */
    PlayerBladder : boolean = true

    /**
     * Whether the player bladder is enabled in the drinking game.
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


}

export const gameSettings = new GameSettings();