import {runtimeContext} from "../gameState/runtimeContext";

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
        this._moneyValueElem.innerText = "$" + runtimeContext.Money;
        this._attractionValueElem.innerText = runtimeContext.Attraction.toString();
        this._shynessValueElem.innerText = runtimeContext.Shyness.toString();
        this._tummyValueElement.innerText = runtimeContext.Companion.Tummy.toString();
        this._bladderValueElement.innerText = runtimeContext.Companion.Bladder.toString();
        this._timeValueElem.innerText = runtimeContext.Time.toString();

        this._yourTumValueElem.innerText = runtimeContext.Player.TummyVolume.toString();
        this._yourBladValueElem.innerText = runtimeContext.Player.Bladder.toString();

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
        if (runtimeContext.Attraction < runtimeContext.LastAttraction) {
            this.setTempColour(this._attractionValueElem, "red", "white");
        } else if (runtimeContext.Attraction > runtimeContext.LastAttraction)
            this.setTempColour(this._attractionValueElem, "green", "white");

        if (runtimeContext.Shyness < runtimeContext.LastShyness) {
            this.setTempColour(this._shynessValueElem, "green", "blue");
        } else if (runtimeContext.Shyness > runtimeContext.LastShyness) {
            this.setTempColour(this._shynessValueElem, "red", "blue");
        }

        if (runtimeContext.Money < runtimeContext.LastMoney) {
            this.setTempColour(this._moneyValueElem, "red", "blue");
        } else if (runtimeContext.Money > runtimeContext.LastMoney) {
            this.setTempColour(this._moneyValueElem, "green", "blue");
        }

        runtimeContext.LastMoney = runtimeContext.Money;
        runtimeContext.LastAttraction = runtimeContext.Attraction;
        runtimeContext.LastShyness = runtimeContext.Shyness;
    }

    private setTempColour(fieldElem: HTMLElement, colour: string, original: string) {
        fieldElem.className = "stats-cells-" + colour;
        setTimeout(function () {
            fieldElem.className = "stats-cells-" + original;
        }, 500);
    }

    private TemporaryShowOutOfBounds() {
        //  Hard Limits on shyness and attraction
        if (runtimeContext.Shyness < 0) {
            runtimeContext.Shyness = 0;
            this.changeValueAfterDelay(this._shynessValueElem, 0);
        }
        if (runtimeContext.Shyness > 100) {
            runtimeContext.Shyness = 100;
            this.changeValueAfterDelay(this._shynessValueElem, 100);
        }
        if (runtimeContext.Attraction < 0) {
            runtimeContext.Attraction = 0;
            this.changeValueAfterDelay(this._attractionValueElem, 0);
        }
        if (runtimeContext.Attraction > 130) {
            runtimeContext.Attraction = 130;
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