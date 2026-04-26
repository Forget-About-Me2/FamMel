import { describe, expect, it } from 'vitest';
import { runtimeContext, runtimeContext } from '../scripts/gameState/runtimeContext';

describe('gameState module', () => {
    it('should expose runtime context alias with stable defaults', () => {
        expect(runtimeContext).toBe(runtimeContext);
        expect(runtimeContext.GirlName).toBe('Laura');
        expect(runtimeContext.PantyColor).toBe('black');
    });
});