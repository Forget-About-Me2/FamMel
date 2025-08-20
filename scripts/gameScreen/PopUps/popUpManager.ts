import { ChangeLogPopUp } from "./changeLogPopUp";
import { CreditsPopUp } from "./creditsPopUp";
import {DisclaimerPopUp} from "./disclaimerPopUp";

export class PopUpManager {
    readonly ChangeLog: ChangeLogPopUp;
    readonly Credits: CreditsPopUp;
    readonly Disclaimer: DisclaimerPopUp;

    constructor() {
        this.ChangeLog = new ChangeLogPopUp();
        this.Credits = new CreditsPopUp()
        this.Disclaimer = new DisclaimerPopUp();
    }
}