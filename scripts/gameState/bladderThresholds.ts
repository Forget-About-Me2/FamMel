export type BladderThresholds = {
    urge: number;
    need: number;
    emergency: number;
    lose: number;
    cumLose: number;
    sexLose: number;
};

const DEFAULT_URGE = 250;

function finiteOrUndefined(value: unknown): number | undefined {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}

// Bridge legacy global bladder thresholds into typed TS consumers.
// This is intentionally read-only for now to avoid behavior changes while refactoring.
export function getLegacyBladderThresholds(): BladderThresholds {
    const urge = finiteOrUndefined((globalThis as any).bladurge) ?? DEFAULT_URGE;
    return {
        urge,
        need: finiteOrUndefined((globalThis as any).bladneed) ?? urge * 2,
        emergency: finiteOrUndefined((globalThis as any).blademer) ?? urge * 3,
        lose: finiteOrUndefined((globalThis as any).bladlose) ?? urge * 3 + 150,
        cumLose: finiteOrUndefined((globalThis as any).bladcumlose) ?? urge * 4,
        sexLose: finiteOrUndefined((globalThis as any).bladsexlose) ?? urge * 5,
    };
}
