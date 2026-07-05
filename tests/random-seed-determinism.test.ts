import { describe, it, expect } from 'vitest';
import { createDeterministicRng } from '../scripts/helperFiles/random';

// This test validates deterministic behavior of random seed generation.
describe('RandomSeedDeterminism', () => {
  it('produces the same sequence for the same seed', () => {
    const rng1 = createDeterministicRng(42);
    const rng2 = createDeterministicRng(42);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createDeterministicRng(42);
    const rng2 = createDeterministicRng(43);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).not.toEqual(seq2);
  });
});
