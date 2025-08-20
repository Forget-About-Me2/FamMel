import creditsJson from "../../../Json/credits.json";
import {PopUp} from "./popUp";

export class DisclaimerPopUp extends PopUp{
    displayDisclaimerPopup() : void {
        if (!this._popupConfig){
            let content = "";
            creditsJson.disclaimer.forEach(line => content += line);
            this._popupConfig = {
                title: "Disclaimer",
                content: content
            };
        }
        this.openPopup();
    }
}