import { CompanionSettings } from "./companionSettings";

/**
 * Editor for custom companion creation/editing.
 * Renders all CompanionSettings fields as HTML inputs.
 * On save, updates the provided CompanionSettings object.
 */
export function showCustomCompanionEditor(container: HTMLElement, companion: CompanionSettings, onSave: (updated: CompanionSettings) => void) {
    container.innerHTML = "<h3>Edit Custom Companion</h3>";
    // TODO: Render all CompanionSettings fields as inputs
    // Example: Name
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name: ";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = companion.dateName;
    nameInput.addEventListener("input", () => companion.dateName = nameInput.value);
    nameLabel.appendChild(nameInput);
    container.appendChild(nameLabel);
    // TODO: Render other fields (favoriteMovie, stats, etc.)
    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => onSave(companion));
    container.appendChild(saveBtn);
}

