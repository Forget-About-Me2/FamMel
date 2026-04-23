# Wave 1 Plan: Test Framework Realignment (1 Week)

Planning status: execution bootstrap started on 2026-04-23. The JS/TS low-level lane now exists, but the broader Wave 1 assertion migration remains pending.

## Objective

Move compatibility/bridge-focused assertions out of C# `UserFlowTests` and into the JS/TS low-level test lane, while keeping C# tests focused on player-observable integration behavior.

## Timebox

1 week (5 working days). Planning is complete; execution is now in the bootstrap phase for the JS/TS test lane only.

## Included files (planning focus)

1. `UserFlowTests/UserFlowTests/AttractionShynessBridgeTests.cs`
2. `UserFlowTests/UserFlowTests/DriveImagesOwnershipBridgeTests.cs`
3. `UserFlowTests/UserFlowTests/SettingsSexSceneOwnershipBridgeTests.cs`
4. `REFACTOR_PLAN/active-slices-wip-limit-2.md`
5. `REFACTOR_PLAN/phase-2-move-state-ownership-to-gamestate-batches.md`

## Excluded files (Wave 1)

1. Gameplay runtime modules (`scripts/*.ts`) except documentation references.
2. Save/load behavior changes.
3. Bridge infrastructure deletion (`connectToGameState`, `expose*OnWindow`) implementation work.
4. Any domain cutover execution work (navigation/settings/bladder migrations).

## Test-lane ownership rules

1. C# `UserFlowTests` lane:
   1. Player-observable behavior only.
   2. Browser integration journeys only.
2. JS/TS low-level lane:
   1. Compatibility/bridge/transition assertions.
   2. Canonical-vs-legacy contract assertions.
   3. No requirement to simulate full player journeys.

## Planned moves by test class

1. `AttractionShynessBridgeTests.cs`
   1. Move bridge/no-op/pre-init/post-init parity assertions to JS/TS lane.
   2. Keep only any remaining player-observable outcomes in C# (if any).
2. `DriveImagesOwnershipBridgeTests.cs`
   1. Move canonical/legacy bridge shape and serialization contract checks to JS/TS lane.
   2. Keep player-visible drive/image flow checks in C#.
3. `SettingsSexSceneOwnershipBridgeTests.cs`
   1. Move staging/normalization/bridge recursion checks to JS/TS lane.
   2. Keep only behavior-visible gameplay assertions in C#.

## Deliverables (planning-phase)

1. Mapping table: each assertion mapped to target lane (C# vs JS/TS).
2. Draft JS/TS test file plan (names and responsibilities only).
3. Proposed C# suite cleanup list (what is retained, rewritten, or removed).
4. Risks/unknowns list with owners.

## Completion gate (for planning phase)

Planning for Wave 1 is complete when:

1. Every assertion in the three target C# files has an assigned destination lane.
2. No assertion is left unowned between lanes.
3. Proposed JS/TS test structure is documented and reviewable.
4. Review checklist is published for enforcement by convention (no CI hard-fail dependency).
5. Execution handoff note is ready with scope lock and explicit out-of-scope list.

## Exit criteria for execution readiness

Execution for Wave 1 can begin only when explicitly approved and when:

1. Scope lock is accepted for included/excluded files.
2. Lane ownership rules are accepted.
3. A reviewer is assigned for test-lane migration decisions.

## Assertion-to-lane mapping (Wave 1 scope)

### AttractionShynessBridgeTests.cs

| Source test | Primary assertion type | Target lane | C# action in Wave 1 plan |
|---|---|---|---|
| `PostInit_LegacySetAttraction_UpdatesCanonicalLastAndLegacyMirror` | Post-init bridge routing + legacy mirror parity | JS/TS low-level | Remove from C# after JS/TS equivalent exists |
| `PreInit_LegacySetShyness_UpdatesLegacyOnly_WithoutTouchingCanonicalOwner` | Pre-init staging/ownership boundary | JS/TS low-level | Remove from C# |
| `PreInit_InvalidAttractionWrites_DoNotMutateLegacyOrSeedCanonicalStateOnStart` | Invalid-input no-op contract + startup seeding contract | JS/TS low-level | Remove from C# |
| `PostInit_InvalidNumericInput_IsDeterministicNoOp_ForCanonicalLastAndLegacyMirror` | Deterministic no-op for non-finite values | JS/TS low-level | Remove from C# |
| `PostInit_SuccessiveLegacySetAttraction_WritesAdvanceLastAttractionSequence` | Last-value ordering contract | JS/TS low-level | Remove from C# |
| `PostInit_OutOfBoundsValues_ClampToGameplayBounds_AndCapturePriorValue` | Clamp contract + prior capture | JS/TS low-level | Remove from C# |
| `PostInit_DirectLegacyShynessAssignment_UsesCanonicalClampAndNoOpContracts` | Legacy direct-set bridge semantics | JS/TS low-level | Remove from C# |
| `CanonicalSetAttraction_DoesNotReenterLegacySetterPath` | Recursion/re-entry safety contract | JS/TS low-level | Remove from C# |

Planning outcome for this class:

1. No assertions retained in C# UserFlow lane.
2. Entire class is a migration candidate out of `UserFlowTests`.

### DriveImagesOwnershipBridgeTests.cs

| Source test | Primary assertion type | Target lane | C# action in Wave 1 plan |
|---|---|---|---|
| `Init_WithNoSavedImgs_SeedsExactDefaultGirlKeys` | Canonical default-state shape contract | JS/TS low-level | Remove from C# |
| `PreInit_ImportImgs_UpdatesLegacyOnly_WithoutTouchingCanonicalImgs` | Pre-init compatibility boundary | JS/TS low-level | Remove from C# |
| `PostInit_ImportAndSaveLoad_PreserveCanonicalImgs_AndRestoreSavedSnapshot` | Canonical/legacy parity + save-load snapshot contract | JS/TS low-level | Remove from C# |
| `PostInit_InvalidSetImgsInputs_AreDeterministicNoOp_WithoutThrowing` | Invalid-input no-op/throw contract | JS/TS low-level | Remove from C# |
| `HasWetTheCar_BridgeSync_PreAndPostInit_WithNonFiniteNoOp` | Pre/post-init bridge sync + no-op contract | JS/TS low-level | Remove from C# |
| `Picset_SaveLoad_RoundTrip_PreservesCanonicalAndLegacyParity` | Legacy/canonical round-trip parity contract | JS/TS low-level | Remove from C# |

Planning outcome for this class:

1. No assertions retained in C# UserFlow lane.
2. Entire class is a migration candidate out of `UserFlowTests`.

### SettingsSexSceneOwnershipBridgeTests.cs

| Source test | Primary assertion type | Target lane | C# action in Wave 1 plan |
|---|---|---|---|
| `PreInit_LegacyWrites_AreStaged_NotAppliedToCanonical` | Pre-init staging/ownership boundary | JS/TS low-level | Remove from C# |
| `PostInit_LegacyWrites_UpdateCanonical_AndIgnoreInvalid` | Post-init canonical sync + invalid-input no-op | JS/TS low-level | Remove from C# |
| `PostInit_SexSceneWrites_NormalizeAndRejectUnknownKeys` | Payload normalization/recursion contract | JS/TS low-level | Remove from C# |
| `SaveLoad_PreservesLegacyKeys_AndRecoversFromMalformed` | Save payload compatibility key contract + malformed recovery | JS/TS low-level | Remove from C# |

Planning outcome for this class:

1. No assertions retained in C# UserFlow lane.
2. Entire class is a migration candidate out of `UserFlowTests`.

## Executed bootstrap (2026-04-23)

1. Added `vitest` and `jsdom` to the repo devDependencies.
2. Added `npm run test:unit` as the local entry point for the JS/TS low-level lane.
3. Added `vitest.config.ts` with `jsdom` environment and `scripts/**/*.test.ts` discovery.
4. Added `scripts/test/vitest.setup.ts` to load document helpers and resolve repo-local `JSON/...` fetches during import-time setup.
5. Added `scripts/gameState/gameState.test.ts` as the initial smoke test proving the lane can import canonical TS runtime state.
6. Verified the bootstrap with `npx vitest run scripts/gameState/gameState.test.ts`, `npx tsc -p . --noEmit`, and `node esbuild.config.mjs`.

## Proposed JS/TS test file plan (draft)

1. `scripts/gameState/gameState.test.ts` (bootstrap smoke test already implemented)
2. `scripts/__tests__/bridge/attraction-shyness.bridge.spec.ts`
3. `scripts/__tests__/bridge/drive-images.bridge.spec.ts`
4. `scripts/__tests__/bridge/settings-sexscene.bridge.spec.ts`

Responsibility split:

1. `attraction-shyness.bridge.spec.ts`: pre-init/post-init write routing, clamp/no-op, last-value contracts.
2. `drive-images.bridge.spec.ts`: canonical default structure, import behavior, round-trip parity, invalid-input behavior.
3. `settings-sexscene.bridge.spec.ts`: staged writes, canonical sync, normalization rules, malformed save recovery.

## Execution handoff note

Wave 1 is no longer blocked on the absence of a JS/TS test runner. The next execution slice is to move the first compatibility/bridge assertions into dedicated JS/TS tests while keeping the C# userflow classes intact until parity is proven.

## Proposed C# cleanup list (planning)

1. Remove `AttractionShynessBridgeTests.cs` after JS/TS parity is accepted.
2. Remove `DriveImagesOwnershipBridgeTests.cs` after JS/TS parity is accepted.
3. Remove `SettingsSexSceneOwnershipBridgeTests.cs` after JS/TS parity is accepted.
4. Keep C# suite focused on player-observable scenario tests only.

## Risks and owners

1. Risk: hidden coupling where a bridge-contract test is actually guarding player-visible behavior.
Owner: test architect/reviewer for Wave 1.
2. Risk: JS/TS lane initially lacks harness utilities equivalent to current C# script probes.
Owner: implementation lead for Wave 1.
3. Risk: temporary coverage dip during migration if C# tests are removed before JS/TS parity is proven.
Owner: Wave 1 approver (scope gate sign-off).
