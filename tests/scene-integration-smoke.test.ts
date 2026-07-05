import { describe, it, expect } from 'vitest';
import { go } from '../scripts/app';
import { runtimeContext } from '../scripts/gameState/runtimeContext';

// This test smoke-checks scene entry functions for render and runtime errors.
describe('SceneIntegrationSmoke', () => {
  it('can enter and exit scenes without error', () => {
    const scenes = ['thePark', 'home', 'theBeach'];
    for (const scene of scenes) {
      expect(() => go(scene)).not.toThrow();
    }
    // Return to home for test isolation
    go('home');
  });
});
