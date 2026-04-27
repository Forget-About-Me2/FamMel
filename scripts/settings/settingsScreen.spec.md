# Settings Screen Spec

## Purpose
Defines the requirements and acceptance criteria for the new modular settings page, replacing the legacy settings navigation. This spec follows the bmad method and will be updated as implementation progresses.

---

## Goals
- Replace the current settings navigation with a maintainable, modular settings page.
- Use the canonical `GameSettings` model as the single source of truth.
- Support both base and custom companions (full editing of custom companion fields).
- Provide a dedicated, user-friendly UI for complex image settings.
- Use HTML elements (not JSON templates) for rendering and interaction.
- All changes are reflected in the `gameSettings` singleton and persisted.

---

## Functional Requirements

### General
- [ ] User can view and edit all top-level `GameSettings` fields.
- [ ] User can save changes and restore defaults.

### Companion
- [ ] User can select a base companion or choose/create a custom companion.
- [ ] If custom, user can edit all `CompanionSettings` fields.

### Player Bladder
- [ ] User can edit all `PlayerBladderSettings` fields.

### Image Settings
- [ ] User can open a dedicated editor for `ImageSettings`.
- [ ] User can map images for each (Companion, BladderLevel) pair.
- [ ] User can select image type.

### UX
- [ ] Settings are grouped into logical sections.
- [ ] All controls use HTML elements (inputs, dropdowns, checkboxes, etc.).
- [ ] Tooltips or help text for non-obvious settings.
- [ ] Responsive and accessible design.

---

## Non-Functional Requirements
- [ ] Modular, maintainable code (easy to add new settings or fields).
- [ ] No legacy settings navigation or JSON template usage.
- [ ] All changes flow through `gameSettings`.

---

## Out of Scope
- Legacy settings migration/bridging (handled separately).
- Backwards compatibility with old settings UI.

---

## Acceptance Criteria
- [ ] All requirements above are met.
- [ ] Code is covered by appropriate tests.
- [ ] Spec is updated as implementation progresses.

