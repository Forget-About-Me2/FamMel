import {baseCompanionDefaultSettings, CompanionSettings} from "./companionSettings";
import {ImageSettings} from "./imageSettings";
import {Outfit} from "../models/outfit";

export enum ImageChoice {
    Images,
    Ascii,
    None
}

// TODO split up settings per page
export interface GameSettings {
    /**
     * The companion's settings (character, stats, etc.)
     */
    Companion: CompanionSettings;
    CompanionOutfit : Outfit;
    /**
     * Whether the player bladder is enabled in the drinking game, if the player bladder is disabled otherwise. When player bladder is enabled this setting is ignored.
     */
    EnablePlayerInDrinkGame: boolean;

    /**
     * Whether sex moves can be repeated during a "make-out" session.
     * this makes the game significantly easier.
     */
    AllowRepeatedSexActions: boolean;

    /**
     * whether sex moves are reset after a "make-out" session ended.
     * This makes the game easier.
     */
    ResetSexMovesOnExit: boolean;

    /**
     * The starting amount of money for the player.
     */
    StartMoney: number;
    /**
     * Option for which image type is shown.
     */
    ImageChoice: ImageChoice;
    /**
     * Show detailed stats about bladder and tummy.
     */
    ShowStats: boolean;
    /**
     * Whether the bladder should decay if peeing on bladder failure.
     */
    BladderDecay: boolean;
    /**
     * Whether the bladder should also decay when peeing on bladder emergency. Requires bladder decay to be enabled.
     */
    BladderDecayOnEmer: boolean;
    /**
     * Whether the bladder should also decay when peeing after drinking alcohol. Requires bladder decay to be enabled.
     */
    BladderDecayOnBreakingTheSeal: boolean;
    /**
     * Image settings to show the state of the date.
     */
    ImageSettings: ImageSettings;
    /**
     * The percentage of the initial capacity that the bladder can decay to. It will never decay below this percentage.
     */
    MinBladderPercentage: number;
}

export function createDefaultGameSettings(): GameSettings {
    return {
        Companion: baseCompanionDefaultSettings.Laura,
        CompanionOutfit : Outfit.Jeans,
        EnablePlayerInDrinkGame: true,
        StartMoney: 200,
        ImageChoice: ImageChoice.Ascii,
        ShowStats: true,
        BladderDecay: true,
        BladderDecayOnEmer: true,
        BladderDecayOnBreakingTheSeal: true,
        ImageSettings: new ImageSettings(),
        MinBladderPercentage: 75,
    };
}

export function updateGameSettingsFromJson(json: string): void {
    // Merge loaded values with defaults for forward compatibility
    gameSettings = { ...createDefaultGameSettings(), ...JSON.parse(json) };
}

export let gameSettings = createDefaultGameSettings();
