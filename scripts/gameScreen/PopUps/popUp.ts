import { openPopUp } from '../../pop-up';

export class PopUp{
    protected _popupConfig?: PopupConfig;
    private readonly popUpTitle: HTMLElement;
    private readonly popUpText: HTMLElement;

    protected openPopup(){
        if (!this._popupConfig){
            throw new Error('No popup config set');
        }

        this.popUpTitle.innerText = this._popupConfig.title;
        this.popUpText.innerHTML = this._popupConfig.content;
        openPopUp();
    }

    constructor() {
        this.popUpTitle = document.GetRequiredElementById<HTMLElement>(PopUp_IDS.POPUP_TITLE);
        this.popUpText = document.GetRequiredElementById<HTMLElement>(PopUp_IDS.POPUP_TEXT);
    }
}

export interface PopupConfig {
    title: string;
    content: string;
}

const PopUp_IDS = {
    POPUP_TITLE: "pop-up-title",
    POPUP_TEXT: "pop-up-text"
} as const;