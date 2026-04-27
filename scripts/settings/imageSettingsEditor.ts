import { ImageSettings } from "./imageSettings";

/**
 * Editor for advanced image settings.
 * Allows mapping images for each (Companion, BladderLevel) pair and selecting image type.
 * On save, updates the provided ImageSettings object.
 */
export function showImageSettingsEditor(container: HTMLElement, imageSettings: ImageSettings, onSave: (updated: ImageSettings) => void) {
    container.innerHTML = "<h3>Edit Image Settings</h3>";
    // TODO: Render UI for mapping images and selecting image type
    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => onSave(imageSettings));
    container.appendChild(saveBtn);
}

