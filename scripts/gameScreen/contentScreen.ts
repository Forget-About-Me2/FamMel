import {GameLocation, gameState, LocationCategory} from "../gameState";
import {go} from "../main";

interface IChoicesItem {
    ToHtml(): string;
    AddListener(): void;
}

class ChoiceItem {
    private readonly _text: string;
    protected readonly _tag: string;

    ToHtml(): string {
        return "<li class=cListener id=" + this._tag + ">" + ContentScreen.FormatVars(this._text) + "</li>"
    }

    constructor(text: string, tag: string) {
        this._text = text;
        this._tag = tag;
    }
}

export class DirectionFunctionChoiceItems extends ChoiceItem implements IChoicesItem {

    readonly _action: () => void;

    AddListener() {
        document.GetRequiredElementById(this._tag).addEventListener("click", this._action);
    }

    constructor(text: string, action: () => void, tag: string) {
        super(text, tag);
        this._action = action;
    }
}

export class LocationChoiceItem extends ChoiceItem implements IChoicesItem {
    private readonly _location: GameLocation;

    AddListener() {
        document.GetRequiredElementById(this._tag).addEventListener("click", () => go(this._location));
    }

    constructor(text: string, location: GameLocation, tag: string) {
        super(text, tag);
        this._location = location;
    }
}

export class ContentScreen {
    private _existingHtml: string = "";
    readonly ChoicesList: IChoicesItem[] = [];
    readonly CurText: string[] = [];
    readonly TextElem : HTMLElement;

    PrintContentToScreen() {
        let i;
        let result =  this._existingHtml;
        for (i = 0; i < this.CurText.length; i++) {
            result += "<p>" + this.FormatVars(this.CurText[i]) + "</p>";
        }

        for (i = 0; i < this.ChoicesList.length; i++) {
            result += this.ChoicesList[i].ToHtml();
        }

        this.TextElem.innerHTML = result;
        for (i = 0; i < this.ChoicesList.length; i++) {
            this.ChoicesList[i].AddListener();
        }
    }

    KeepExistingHtml(): ContentScreen{
        this._existingHtml = this.TextElem.innerHTML;
        return this;
    }

    static FormatVars(input: string): string {
        if (!input) return '';

        try {
            const replacements: [RegExp, string][] = [
                [/girlname/g, ContentScreen.safeString(gameState.Companion.name)],
                [/girltalk/g, ContentScreen.safeString(gameState.Companion.talkHtml)],
                [/girlgasp/g, ContentScreen.safeString(gameState.Companion.gaspHtml)],
                [/bladlose/g, ContentScreen.safeString(gameState.Companion.bladderLose)],
                [/pantyColor/g, ContentScreen.safeString(gameState.Companion.UnderWearColour)],
                [/timeheld/g, ContentScreen.safeString(gameState.Companion.TimeSinceLastPeed)],
                [/bladderAm/g, ContentScreen.safeString(gameState.Companion.Bladder)],
                [/money/g, ContentScreen.safeString(gameState.Money)]
            ];

            return replacements.reduce((text, [pattern, replacement]) =>
                    text.replace(pattern, () => replacement),
                input
            );
        } catch (error) {
            console.error('Error in FormatVars:', error);
            return input; // Return original text if something goes wrong
        }
    }

    FormatVars(input: string): string {
        return ContentScreen.FormatVars(input);
    }

    private static safeString(value: any): string {
        if (value === null || value === undefined) return '';
        return String(value).replace(/[<>&"']/g, char => {
            switch (char) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case '"':
                    return '&quot;';
                case "'":
                    return '&#39;';
                default:
                    return char;
            }
        });
    }

    constructor() {
        this.TextElem = document.GetRequiredElementById<HTMLElement>("textsp");
    }
}