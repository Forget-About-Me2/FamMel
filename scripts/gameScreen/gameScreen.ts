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

let gameScreenInstance: GameScreen | undefined;
try {
    gameScreenInstance = new GameScreen();
} catch (e) {
    console.error("Failed to create GameScreen:", e);
}

export const gameScreen = gameScreenInstance;