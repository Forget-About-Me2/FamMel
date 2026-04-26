/**
 * Settings for a person, can be player or date.
 */
export interface PersonSettings {
    /**
     * The bladder volume at which point the person starts feeling it.
     */
    bladderUrge: number;

    /**
     * The bladder volume at the start of the game.
     */
    startBladderVolume: number;

    /**
     * The tummy volume at the start of the game.
     */
    startTummyVolume: number;

    /*
     * The max amount of drink volume the person can stomach before rejecting non-alcoholic drinks.
     */
    startMaxTummy: number;

    /*
     * The max amount of alcohol volume the person can drink before rejecting alcoholic drinks.
     */
    startMaxAlcohol: number;
}