import {gameState} from "../gameState";
import {gameSettings} from "../gameSettings";
import {StatusBar} from "./statusBar";
import {ChangeLog} from "./changeLog";

class GameScreen {
    readonly StatusBar : StatusBar;
    readonly ChangeLog : ChangeLog;

    constructor(){
        this.StatusBar = new StatusBar();
        this.ChangeLog = new ChangeLog();
    }


}





export const gameScreen = new GameScreen();