import {runtimeContext} from "../gameState/runtimeContext";
import {gameSettings} from "../settings/gameSettings";
import {StatusBar} from "./statusBar";
import {PopUpManager} from "./PopUps/popUpManager";

class GameScreen {
    readonly StatusBar : StatusBar;
    readonly PopUps : PopUpManager

    constructor(){
        this.StatusBar = new StatusBar();
        this.PopUps = new PopUpManager();
    }
}

export const gameScreen = new GameScreen();