# Coverage Confidence Gate (new)

Because `UserFlowTests` are relatively new, treat them as evolving confidence signals, not full safety proof.

Before merge candidate review, require all of the following:

1. Build passes (`node esbuild.config.mjs`).
2. Typecheck passes (or no net-new errors if a temporary baseline is approved).
3. Curated critical userflow smoke set passes (start, navigation, dialogue/action, store/inventory, save/load).
4. For each changed high-impact area, there is either automated test coverage or explicit manual verification evidence.
5. Residual untested risk is documented with owner + follow-up action.
