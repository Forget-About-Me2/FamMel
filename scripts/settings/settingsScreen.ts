import { gameSettings, createDefaultGameSettings, GameSettings, ImageChoice } from "./gameSettings";
import { baseCompanionDefaultSettings, CompanionSettings } from "./companionSettings";
import { PlayerBladderSettings } from "./playerBladderSettings";
import { Outfit } from "../models/outfit";
import { ImageSettings } from "./imageSettings";
import {ContentScreen} from "../gameScreen/contentScreen";

// Entry point for the new settings screen
export function showSettingsScreen() {
    const contentScreen = new ContentScreen();
    const container = contentScreen.TextElem;
    container.innerHTML = "";
    container.appendChild(renderGeneralSection(gameSettings));
    container.appendChild(renderCompanionSection(gameSettings));
    container.appendChild(renderPlayerBladderSection(gameSettings));
    container.appendChild(renderSexualGameplaySection(gameSettings));
    container.appendChild(renderBladderDecaySection(gameSettings));
    container.appendChild(renderImageSettingsSection(gameSettings));
    container.appendChild(renderSettingsButtons(gameSettings, container));
}

// --- Section Renderers ---

export function renderGeneralSection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>General</h2>`;
    // Start Money
    const moneyLabel = document.createElement("label");
    moneyLabel.textContent = "Start Money: ";
    const moneyInput = document.createElement("input");
    moneyInput.type = "number";
    moneyInput.value = settings.StartMoney.toString();
    moneyInput.addEventListener("change", () => settings.StartMoney = parseInt(moneyInput.value, 10));
    moneyLabel.appendChild(moneyInput);
    section.appendChild(moneyLabel);
    // Show Stats
    const showStatsLabel = document.createElement("label");
    showStatsLabel.textContent = " Show Stats: ";
    const showStatsCheckbox = document.createElement("input");
    showStatsCheckbox.type = "checkbox";
    showStatsCheckbox.checked = settings.ShowStats;
    showStatsCheckbox.addEventListener("change", () => settings.ShowStats = showStatsCheckbox.checked);
    showStatsLabel.appendChild(showStatsCheckbox);
    section.appendChild(showStatsLabel);
    // Image Choice
    const imageChoiceLabel = document.createElement("label");
    imageChoiceLabel.textContent = " Image Type: ";
    const imageChoices = [ImageChoice.None, ImageChoice.Ascii, ImageChoice.Images];
    imageChoices.forEach(choice => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "imageChoice";
        radio.value = choice.toString();
        radio.checked = settings.ImageChoice === choice;
        radio.addEventListener("change", () => settings.ImageChoice = choice);
        imageChoiceLabel.appendChild(radio);
        imageChoiceLabel.appendChild(document.createTextNode(ImageChoice[choice]));
    });
    section.appendChild(imageChoiceLabel);
    return section;
}

function renderCompanionSection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Companion</h2>`;
    // Dropdown for base companions + custom
    const companionLabel = document.createElement("label");
    companionLabel.textContent = "Companion: ";
    const companionSelect = document.createElement("select");
    Object.keys(baseCompanionDefaultSettings).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        if (settings.Companion.baseCompanion === key) option.selected = true;
        companionSelect.appendChild(option);
    });
    const customOption = document.createElement("option");
    customOption.value = "Custom";
    customOption.textContent = "Custom";
    if (settings.Companion.isCustomCompanion) customOption.selected = true;
    companionSelect.appendChild(customOption);
    companionSelect.addEventListener("change", () => {
        if (companionSelect.value === "Custom") {
            // TODO: Show custom companion editor
        } else {
            settings.Companion = baseCompanionDefaultSettings[companionSelect.value];
        }
    });
    companionLabel.appendChild(companionSelect);
    section.appendChild(companionLabel);
    // TODO: If custom, render custom companion editor
    return section;
}

function renderPlayerBladderSection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Player Bladder</h2>`;
    // TODO: Render all PlayerBladderSettings fields
    return section;
}

function renderSexualGameplaySection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Sexual Gameplay</h2>`;
    // TODO: Render AllowRepeatedSexActions, ResetSexMovesOnExit
    return section;
}

function renderBladderDecaySection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Bladder Decay</h2>`;
    // TODO: Render BladderDecay, BladderDecayOnEmer, BladderDecayOnBreakingTheSeal
    return section;
}

function renderImageSettingsSection(settings: GameSettings): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Image Settings</h2>`;
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Image Settings...";
    editButton.addEventListener("click", () => {
        // TODO: Launch image settings editor/modal
    });
    section.appendChild(editButton);
    return section;
}

function renderSettingsButtons(settings: GameSettings, container: HTMLElement): HTMLElement {
    const section = document.createElement("section");
    // Save
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
        // TODO: Persist settings (e.g., to localStorage)
        alert("Settings saved!");
    });
    section.appendChild(saveBtn);
    // Restore Defaults
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore Defaults";
    restoreBtn.addEventListener("click", () => {
        Object.assign(settings, createDefaultGameSettings());
        showSettingsScreen(container);
    });
    section.appendChild(restoreBtn);
    return section;
}

