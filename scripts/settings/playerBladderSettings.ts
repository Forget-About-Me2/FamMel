import {PersonSettings} from "./personSettings";

export interface PlayerBladderSettings extends PersonSettings {
    EnablePlayerBladder: boolean;

    /**
     * Whether the player bladder is enabled in the drinking game, if the player bladder is disabled otherwise. When player bladder is enabled this setting is ignored.
     */
    EnablePlayerInDrinkGame: boolean;

}