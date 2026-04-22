# Sequencing Rationale

Plan reboot rationale (2026-04-22):

The prior sequence assumed compatibility-era batching. With compatibility layers disallowed, sequencing must optimize for irreversible cutovers and smaller execution waves.

Current sequencing model:

1. Planning readiness first (slice boundaries + test-lane ownership + explicit delete targets).
2. Test framework realignment early so migration assertions run in the correct lane.
3. Canonical cutovers next in highest-coupling domains (navigation, then settings/money, then bladder).
4. Bridge infrastructure removal only after domain-level canonical ownership is complete.
5. Save/load and hardening last, once runtime ownership is stable.

Why this order:

1. Prevents fake progress from bridge work that will be deleted before release.
2. Keeps each execution phase small enough to validate and complete.
3. Avoids broad multi-domain churn before test ownership and boundaries are fixed.


