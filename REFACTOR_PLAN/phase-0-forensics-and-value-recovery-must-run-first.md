# Phase 0: Forensics And Value Recovery (must run first)


Current branch forensic baseline (2026-04-16):

- 34 commits ahead of `origin/dev`.
- 120 files changed vs `origin/dev`.
- [ ] **Phase 1A — Bladder thresholds** (`Person` model → sole owner) — **READY TO START**
- Multiple likely user-visible/runtime commits are mixed with refactor commits.

Artifacts generated for triage:

- `triage-commits-vs-origin-dev.txt`
- `triage-files-vs-origin-dev.txt`
- `triage-diffstat-vs-origin-dev.txt`
- `triage-userflow-commits-vs-origin-dev.txt`
- `triage-userflow-diffstat-vs-origin-dev.txt`
- `triage-commit-lanes.csv` (initial lane suggestion, must be manually reviewed)

Phase 0 checklist:

- [x] Create forensic inventory artifacts from git history and diff.
- [x] Classify initial high-impact commit/file areas as Keep, Defer, or Drop (`triage-keep-defer-drop.tsv`).
- [ ] Complete Keep/Defer/Drop classification for remaining lower-impact areas.
- [x] Build and seed a top-10 behavior matrix with current evidence (`triage-behavior-matrix.tsv`).
- [ ] Identify unknown behavior areas and add characterization tests before refactor.
- [ ] Choose extraction order as vertical slices (feature + migration + tests) rather than file-type batches.

Extraction strategy update (validated 2026-04-16):

- Attempting to replay late commits onto `origin/dev` or `origin/master` via cherry-pick caused high conflict density, including missing test files, JS/TS file-shape mismatches, and bridge-era dependencies.
- Conclusion: historical replay is currently higher risk and cost than preservation cleanup.

Execution model going forward:

1. Preserve-all baseline: work from current branch head (`typeScriptAndDebugUI`) using `recovery/clean-from-head` as the cleanup lane.
2. Carve forward slices by concern (tests, save/load, bugfixes, bridge reduction) with new commits, instead of replaying old commits in isolation.
3. Keep high-confidence behavior commits conceptually protected (bedroom key consistency, navigation smoke, save/load coverage, darts crash fix), but validate via current code behavior rather than cherry-pickability.
4. Defer bridge-heavy reshaping (`connectToGameState` sync internals) until coverage confidence and behavior matrix checks are in place.

Exit criteria:

- No high-impact changed area remains "unknown".
- Each user-visible behavior delta has Keep/Defer/Drop status.
- First extraction slice is selected with explicit test evidence.

Latest validation evidence:

- Navigation smoke: 12/12 passing when dev host is running on `127.0.0.1:8080`.
- Save/load integration (`YourHomeIntegrationTests`): 5/5 passing (includes SaveAndLoad + ExportAndImport flows).
- Darts integration: 1/1 passing (`DartsIntegrationTests`) covering dark bar darts entry and first-round advance.
- Full userflow suite: 35 succeeded, 0 failed, 0 skipped (`dotnet test UserFlowTests/UserFlowTests/UserFlowTests.csproj`); runner reported 35 discovered of 36 because one strict late-game test is marked `[Explicit]`.

> **Test prerequisite:** The `UserFlowTests` Selenium suite requires a live dev server at `http://127.0.0.1:8080`. Run `npm run dev` (or `node esbuild.config.mjs --watch` + `live-server`) before running tests. All `ERR_CONNECTION_REFUSED` failures are infrastructure failures, not code failures.
- Random seed determinism: 3 consecutive reruns of `RandomSeedDeterminismTest` passed (2/2 each run).
