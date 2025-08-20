import {PopUp} from "./popUp";
import creditsJson from "../../../Json/credits.json";
import homeScreenJson from "../../../Json/homeScreen.json";

export class CreditsPopUp extends PopUp{
    displayPopup() : void {
        if (!this._popupConfig){
            var content = "";
            creditsJson.page.forEach(line => content += line);
            this._popupConfig = {
                title: homeScreenJson.Credits,
                content: content
            };
        }

        this.openPopup();
    }
}