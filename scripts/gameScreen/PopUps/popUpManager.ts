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

    setErrorPopup(data: string){
        const popUp = document.GetRequiredElementById<HTMLElement>("pop-up");
        popUp.style.display = "flex";
        const closeButton = document.GetRequiredElementById<HTMLElement>("close-pop-up");
        closeButton.style.display = "none";

        window.onclick = null; // Remove the event listener to prevent closing on click outside
        const title = document.GetRequiredElementById<HTMLElement>("pop-up-title");
        const text = document.GetRequiredElementById<HTMLElement>("pop-up-text");

        title.innerText = "Error page";
        text.innerHTML = "<p>Oh oh, Something went wrong running the game.</p>" +
            "<p>Sorry for the inconvenience.</p>" +
            "<p>Issues with the game can be reported through <a href='https://github.com/Forget-About-Me2/FamMel/issues'>github</a></p>"+
            "<p>When doing so please be as detailed as possible about what caused the error.</p>"+
            "<p>In the box below is some extra error information that can help in solving the issue, please include in any report.</p>"+
            "<div id='errorMessage'>"+ data + "</div>" +
            "<br> <button id='copyErrorMessage'>Copy text</button>"
        const button = document.GetRequiredElementById<HTMLElement>("copyErrorMessage");
        button.onclick = () => this.copyErrorText();
    }

    copyErrorText(){
        const errorMessage = document.GetRequiredElementById<HTMLElement>("errorMessage");// For mobile devices

        navigator.clipboard.writeText(errorMessage.innerText).then(async () => {
                const button = document.GetRequiredElementById<HTMLElement>("copyErrorMessage");
                button.innerText = "Copied successfully";
                await this.delay(1000);
                button.innerText = "Copy text";
            }
        )
    }

    private readonly delay = ms => new Promise(res => setTimeout(res, ms));
}