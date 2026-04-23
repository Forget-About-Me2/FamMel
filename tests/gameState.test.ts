import { describe, expect, it } from 'vitest';
import { gameState, runtimeContext } from '../scripts/gameState/gameState';

describe('gameState module', () => {
    it('should expose runtime context alias with stable defaults', () => {
        expect(gameState).toBe(runtimeContext);
        expect(gameState.GirlName).toBe('Laura');
        expect(gameState.PantyColor).toBe('black');
    });
});