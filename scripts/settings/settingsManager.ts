import { instanceToPlain, plainToInstance } from "class-transformer";
import { gameSettings, GameSettings } from "./gameSettings";
import { ImageSettings } from "./imageSettings";

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

        // Ensure nested ImageSettings is an instance
        if (!(merged.ImageSettings instanceof ImageSettings) && (merged as any).ImageSettings) {
            merged.ImageSettings = plainToInstance(ImageSettings, (merged as any).ImageSettings, {
                enableImplicitConversion: true
            });
        }

        // Merge into the singleton instance
        Object.assign(gameSettings, merged);
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