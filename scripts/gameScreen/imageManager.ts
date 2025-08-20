import { gameSettings } from "../settings/gameSettings";
import { BladderState } from "../gameState/bladderState";
import { BaseGirl } from "../settings/baseGirl";
import { ImageType } from "../settings/imageType";

/**
 * Responsible for rendering the 'thepic' area depending on the configured ImageType.
 * Provides simple helpers used by the animation controller.
 */
class ImageManager {
    private get picEl(): HTMLElement | null {
        return document.getElementById("thepic");
    }

    /**
     * Render a preformatted ASCII frame into the picture area.
     */
    renderAscii(frameHtml: string): void {
        const el = this.picEl;
        if (!el) return;
        el.innerHTML =
            "<table style='text-align:right'><tr><td style='width:100px'><pre>" +
            frameHtml +
            "</pre></td></tr></table>";
    }

    /**
     * Render a configured image for the current base girl and given bladder state.
     * If no URL is configured, the area is left blank.
     */
    renderImageFor(state: BladderState): void {
        const el = this.picEl;
        if (!el) return;

        const baseGirl = this.resolveBaseGirl();
        const urlsForGirl = gameSettings.ImageSettings.Urls.get(baseGirl);
        const src = urlsForGirl?.get(state);

        if (src && gameSettings.ImageSettings.ImageType === ImageType.Image) {
            // alt text can be improved later with a description per state
            el.innerHTML = `<img src="${src}" alt="${baseGirl} - ${state}" class="pic">`;
        } else {
            this.renderNone();
        }
    }

    /**
     * Clear or show a minimal placeholder in the picture area.
     */
    renderNone(): void {
        const el = this.picEl;
        if (!el) return;
        el.innerHTML =
            "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></td></tr></table>";
    }

    /**
     * Attempt to coerce the selected base girl from settings to the BaseGirl enum.
     * Falls back to Laura if not matched.
     */
    private resolveBaseGirl(): BaseGirl {
        const value = (gameSettings as any).BaseGirl as string;
        const validValues = Object.values(BaseGirl) as string[];
        if (validValues.includes(value)) {
            return value as unknown as BaseGirl;
        }
        return BaseGirl.Laura;
    }
}

export const imageManager = new ImageManager();