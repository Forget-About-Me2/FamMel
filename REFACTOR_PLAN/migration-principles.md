# Migration Principles

1. Keep changes mechanical and batch-based.
2. Migrate one owning module at a time.
3. After each batch: build, typecheck, targeted tests for touched areas, and curated userflow smoke tests.
4. Delete old paths immediately after each successful batch (no long-lived dual write paths).
	> *Exception: Fields with cross-module write dependencies (e.g. bladder threshold mirroring, attraction/shyness bridge) may use staged compatibility mirroring during migration. Any deviation must be declared in the batch spec with an explicit removal target.*

