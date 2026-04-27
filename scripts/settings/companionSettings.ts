import {Movie} from "../models/movie";
import {BaseCompanion} from "../models/baseCompanion";
import {PersonSettings} from "./personSettings";

export interface CompanionSettings extends PersonSettings {
    favouriteMovie: Movie;
    dateName: string;
    baseCompanion: BaseCompanion;
    isCustomCompanion: boolean;
}

/*
 * Note that the descriptions of the girls here are not actually in the game *yet* they're more ideas for characterization later on.
 */
export const baseCompanionDefaultSettings: Record<keyof typeof BaseCompanion, CompanionSettings> = {
        /**
         * Jennifer is blonde.
         * Never really given a thought about her bladder, just reacts to the urge. Grew up in the city, so the idea of peeing outside
         * or anywhere that is not a toilet is foreign to her.
         * A little shy about needing to go, but nothing too serious.
         */
        Jennifer: {
            favouriteMovie: Movie.TheUrge,
            bladderUrge: 300,
            startBladderVolume: 350,
            startTummyVolume: 100,
            startMaxTummy: 300,
            startMaxAlcohol: 750,
            dateName: "Jennifer",
            baseCompanion: BaseCompanion.Jennifer,
            isCustomCompanion: false,
            bladderDecayMaxPercentage: 30
        },

        /**
         * Laura is your cute next-door neighbour, you've known her for years, and you've always been nice to each other.
         * You've seen hints that she's into pee play in your interactions, but you're not sure if she's really into it.
         * in any case you know her to be quite innocent, so might be a bit nervous to start anything.
         * However, she's not shy about needing the bathroom or peeing outside, which she's often done in your presence.
         * Not used to holding, as she normally is able to just go.
         * Starts with a bladder just before her urge, as she is not worried and wouldn't go before leaving.
         */
        Laura: {
            favouriteMovie: Movie.DesperateHouseWives,
            bladderUrge: 250,
            startBladderVolume: 200,
            startTummyVolume: 400,
            startMaxTummy: 250,
            startMaxAlcohol: 500,
            dateName: "Laura",
            baseCompanion: BaseCompanion.Laura,
            isCustomCompanion: false,
            bladderDecayMaxPercentage: 50
        },

        /**
         * Karen is petite and slim, the type of the person who always has to pee.
         * She looks innocent, but looks can be deceiving.
         * Because her bladder is so small, she's used to holding it, so pretty good at it.
         * She's very vocal about needing to go, and often goes when possible to be safe.
         * She's a bit shy about peeing somewhere she's not supposed to, but will if she has to. Or maybe if she's turned on enough.
         * She hasn't drunk anything because she's a little nervous about needing to go.
         * For the same reason a bit conservative on her drinks.
         * Low bladder decay because she's used to holding it.
         * Starts with a relatively full bladder to make sure she pees before leaving. (in the future have some deicison based on character)
         */
        Karen: {
            favouriteMovie: Movie.ControlYourself,
            bladderUrge: 200,
            startBladderVolume: 390,
            startTummyVolume: 0,
            startMaxTummy: 100,
            startMaxAlcohol: 150,
            dateName: "Karen",
            baseCompanion: BaseCompanion.Karen,
            isCustomCompanion: false,
            bladderDecayMaxPercentage: 10
        },

        /**
         * Melissa is good at holding her pee, doesn't think too much about it so starts with a slightly fuller bladder and probably unconsciously drank a lot.
         * She's a typical college student, likes a party, hardly innocent, so probably quite open about things, especially after a few drinks.
         * Bladder decay is low because again, she's used to holding it. Especially after drinking a lot.
         */
        Melissa: {
            favouriteMovie: Movie.TwoLitres,
            bladderUrge: 350,
            startBladderVolume: 400,
            startTummyVolume: 500,
            startMaxTummy: 250,
            startMaxAlcohol: 1000,
            dateName: "Melissa",
            baseCompanion: BaseCompanion.Melissa,
            isCustomCompanion: false,
            bladderDecayMaxPercentage: 20 // Added a reasonable default value for consistency
        }
}