import {GameSettings, gameSettings} from "../settings/gameSettings";
import {StatusBar} from "./statusBar";
import {PopUpManager} from "./PopUps/popUpManager";

class GameScreen {
    readonly StatusBar : StatusBar;
    readonly PopUps : PopUpManager

    constructor(){
        this.StatusBar = new StatusBar();
        this.PopUps = new PopUpManager();
    }

    applySettings(gameSettings : GameSettings) : void {
        this.StatusBar.SetShowStats(gameSettings.ShowStats);
        this.StatusBar.SetPlayerBladderStats(gameSettings.PlayerBladder.EnablePlayerBladder)
    }
}

export const gameScreen = new GameScreen();