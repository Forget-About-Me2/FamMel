import { instanceToPlain, plainToInstance } from "class-transformer";
import { gameSettings, GameSettings, ImageChoice } from "./gameSettings";
import { ImageType } from "./imageType";

export class SettingsManager{
    readFromLocalStorage() : void {
        const raw = localStorage.getItem("settings");
        if (!raw) return;

        let json: unknown;
        try {
            json = JSON.parse(raw);
        } catch {
            return;
        }

        if (typeof json !== "object" || json === null) return;

        // Transform into a GameSettings instance
        const merged = plainToInstance(GameSettings, json as object, {
            enableImplicitConversion: true
        });

        // Merge into the singleton instance
        Object.assign(gameSettings, merged);

        // Ensure the legacy ImageChoice enum (user setting) controls the active ImageType
        // This keeps the typed ImageSettings.ImageType in sync with the user-facing option.
        switch (gameSettings.ImageChoice) {
            case ImageChoice.Images:
                gameSettings.ImageSettings.ImageType = ImageType.Image;
                break;
            case ImageChoice.None:
                gameSettings.ImageSettings.ImageType = ImageType.None;
                break;
            case ImageChoice.Ascii:
            default:
                gameSettings.ImageSettings.ImageType = ImageType.Ascii;
                break;
        }
    }

    writeToLocalStorage() : void {
        const plain = instanceToPlain(gameSettings, {
            exposeDefaultValues: true
        });

        try {
            localStorage.setItem("settings", JSON.stringify(plain));
        } catch (exception) {
            console.error("Failed to save settings to localStorage:", exception);
        }
    }
}