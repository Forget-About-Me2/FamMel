import {Person} from "./Person";
import {PersonSaveObject} from "./SaveObject/PersonSaveObject";
import {PersonSettings} from "../settings/personSettings";

export class Companion extends Person{
    readonly name: string;

    get talkHtml() : string{
        return "<b>" + this.name + ":&nbsp</b>"
    }

    get gaspHtml() : string{
        return "<b>" + this.name + " gasps:&nbsp</b>"
    }

    constructor(settings: PersonSettings, name: string) {
        super(settings, "companion");
        this.name = name;
    }

    get ExportToSaveObject(): PersonSaveObject {
        return super.ExportToSaveObject;
    }
}