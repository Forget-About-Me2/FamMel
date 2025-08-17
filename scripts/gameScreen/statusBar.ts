import {gameState} from "../gameState";

export class StatusBar {
    private readonly _moneyValueElem: HTMLElement;
    private readonly _attractionValueElem: HTMLElement;
    private readonly _shynessValueElem: HTMLElement;
    private readonly _tummyValueElement: HTMLElement;
    private readonly _bladderValueElement: HTMLElement;
    private readonly _timeValueElem: HTMLElement;
    private readonly _yourTumValueElem: HTMLElement;
    private readonly _yourBladValueElem: HTMLElement;

    private readonly _yourTumHeaderElem: HTMLElement;
    private readonly _moneyHeaderElem: HTMLElement;
    private readonly _attractionHeaderElem: HTMLElement;
    private readonly _shynessHeaderElem: HTMLElement;
    private readonly _tummyHeaderElem: HTMLElement;
    private readonly _bladderHeaderElem: HTMLElement;
    private readonly _timeHeaderElem: HTMLElement;
    private readonly _yourBladHeaderElem: HTMLElement;


    Update() {
        this._moneyValueElem.innerText = "$" + gameState.Money;
        this._attractionValueElem.innerText = gameState.Attraction.toString();
        this._shynessValueElem.innerText = gameState.Shyness.toString();
        this._tummyValueElement.innerText = gameState.Companion.Tummy.toString();
        this._bladderValueElement.innerText = gameState.Companion.Bladder.toString();
        this._timeValueElem.innerText = gameState.Time.toString();

        this._yourTumValueElem.innerText = gameState.Player.Tummy.toString();
        this._yourBladValueElem.innerText = gameState.Player.Bladder.toString();

        this.flashChanged();
        this.TemporaryShowOutOfBounds();

    }

    TogglePlayerBladder(value: boolean) {
        if (!value) {
            this._yourBladHeaderElem.style.display = "none";
            this._yourBladValueElem.style.display = "none";
            this._yourTumHeaderElem.style.display = "none";
            this._yourTumValueElem.style.display = "none";
        } else {
            this._yourBladHeaderElem.style.display = "";
            this._yourBladValueElem.style.display = "";
            this._yourTumHeaderElem.style.display = "";
            this._yourTumValueElem.style.display = "";
        }
    }

    ToggleShowStats(value: boolean) {
        if (!value) {
            this._attractionHeaderElem.style.display = "none";
            this._attractionValueElem.style.display = "none";
            this._shynessHeaderElem.style.display = "none";
            this._shynessValueElem.style.display = "none";
            this._tummyHeaderElem.style.display = "none";
            this._tummyValueElement.style.display = "none";
            this._bladderHeaderElem.style.display = "none";
            this._bladderValueElement.style.display = "none";
        } else {
            this._attractionHeaderElem.style.display = "";
            this._attractionValueElem.style.display = "";
            this._shynessHeaderElem.style.display = "";
            this._shynessValueElem.style.display = "";
            this._tummyHeaderElem.style.display = "";
            this._tummyValueElement.style.display = "";
            this._bladderHeaderElem.style.display = "";
            this._bladderValueElement.style.display = "";
        }
    }

    private flashChanged() {
        if (gameState.Attraction < gameState.LastAttraction) {
            this.setTempColour(this._attractionValueElem, "red", "white");
        } else if (gameState.Attraction > gameState.LastAttraction)
            this.setTempColour(this._attractionValueElem, "green", "white");

        if (gameState.Shyness < gameState.LastShyness) {
            this.setTempColour(this._shynessValueElem, "green", "blue");
        } else if (gameState.Shyness > gameState.LastShyness) {
            this.setTempColour(this._shynessValueElem, "red", "blue");
        }

        if (gameState.Money < gameState.LastMoney) {
            this.setTempColour(this._moneyValueElem, "red", "blue");
        } else if (gameState.Money > gameState.LastMoney) {
            this.setTempColour(this._moneyValueElem, "green", "blue");
        }

        gameState.LastMoney = gameState.Money;
        gameState.LastAttraction = gameState.Attraction;
        gameState.LastShyness = gameState.Shyness;
    }

    private setTempColour(fieldElem: HTMLElement, colour: string, original: string) {
        fieldElem.className = "stats-cells-" + colour;
        setTimeout(function () {
            fieldElem.className = "stats-cells-" + original;
        }, 500);
    }

    private TemporaryShowOutOfBounds() {
        //  Hard Limits on shyness and attraction
        if (gameState.Shyness < 0) {
            gameState.Shyness = 0;
            this.changeValueAfterDelay(this._shynessValueElem, 0);
        }
        if (gameState.Shyness > 100) {
            gameState.Shyness = 100;
            this.changeValueAfterDelay(this._shynessValueElem, 100);
        }
        if (gameState.Attraction < 0) {
            gameState.Attraction = 0;
            this.changeValueAfterDelay(this._attractionValueElem, 0);
        }
        if (gameState.Attraction > 130) {
            gameState.Attraction = 130;
            this.changeValueAfterDelay(this._attractionValueElem, 130);
        }
    }

    private changeValueAfterDelay(elem: HTMLElement, value: number) {
        setTimeout(function () {
            elem.innerText = value.toString();
        }, 500);
    }


    constructor() {
        this._moneyValueElem = document.GetRequiredElementById("mon");
        this._attractionValueElem = document.GetRequiredElementById("att");
        this._shynessValueElem = document.GetRequiredElementById("shy");
        this._tummyValueElement = document.GetRequiredElementById("tum");
        this._bladderValueElement = document.GetRequiredElementById("blad");
        this._timeValueElem = document.GetRequiredElementById("time");
        this._yourTumValueElem = document.GetRequiredElementById("ytum");
        this._yourBladValueElem = document.GetRequiredElementById("yblad");

        this._moneyHeaderElem = document.GetRequiredElementById("monHeader");
        this._attractionHeaderElem = document.GetRequiredElementById("attHeader");
        this._shynessHeaderElem = document.GetRequiredElementById("shyHeader");
        this._tummyHeaderElem = document.GetRequiredElementById("tumHeader");
        this._bladderHeaderElem = document.GetRequiredElementById("bladHeader");
        this._timeHeaderElem = document.GetRequiredElementById("timeHeader");
        this._yourTumHeaderElem = document.GetRequiredElementById("ytumHeader");
        this._yourBladHeaderElem = document.GetRequiredElementById("ybladHeader");
    }
}