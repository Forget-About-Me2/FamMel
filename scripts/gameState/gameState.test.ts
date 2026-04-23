import { describe, expect, it } from 'vitest';
import { gameState, runtimeContext } from './gameState';

describe('gameState module smoke test', () => {
    it('ImportingGameState_ExposesRuntimeContextAlias_WithStableDefaults', () => {
        expect(gameState).toBe(runtimeContext);
        expect(gameState.GirlName).toBe('Laura');
        expect(gameState.PantyColor).toBe('black');
    });
});