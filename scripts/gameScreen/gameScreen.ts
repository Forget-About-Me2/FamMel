import {gameState} from "../gameState/gameState";
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

class GameScreenFacade {
    private _instance: GameScreen | null = null;

    private get instance(): GameScreen {
        if (!this._instance) {
            this._instance = new GameScreen();
        }
        return this._instance;
    }

    get StatusBar(): StatusBar {
        return this.instance.StatusBar;
    }

    get PopUps(): PopUpManager {
        return this.instance.PopUps;
    }
}

export const gameScreen = new GameScreenFacade();