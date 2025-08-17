import showdown from "showdown";
import {PopUp} from "./popUp";

export class ChangeLog extends PopUp{

    async displayChangelogPopup(): Promise<void> {
        if (!this._popupConfig) {
            await this.setPopUpConfig();
        }

        if (!this._popupConfig) {
            throw new Error('Failed to set popup config for changelog');
        }


        this.openPopup();
    }

    private async setPopUpConfig(): Promise<void> {
        const markdownContent = await this.fetchMarkdownContent(CHANGELOG.FILE_PATH);
        const htmlContent = this.convertMarkdownToHtml(markdownContent);

        this._popupConfig =  {
            title: CHANGELOG.TITLE,
            content: htmlContent
        };
    }

    private async fetchMarkdownContent(url: string): Promise<string> {
        return $.ajax({
            url,
            type: 'get',
            dataType: 'html'
        });
    }

    convertMarkdownToHtml(markdown: string): string {
        const converter = new showdown.Converter();
        return converter.makeHtml(markdown);
    }
}



const CHANGELOG = {
    FILE_PATH: "CHANGELOG.md",
    TITLE: "Changelog"
} as const;