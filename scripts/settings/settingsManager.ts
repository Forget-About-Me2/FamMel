import { instanceToPlain, plainToInstance } from "class-transformer";
import { gameSettings, GameSettings } from "./gameSettings";

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