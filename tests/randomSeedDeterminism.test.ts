import { describe, it, expect, beforeEach } from 'vitest';
import { setRandomSeed, randomInt, getRandomSeed } from '../scripts/shims';

/**
 * These tests validate deterministic random seed behavior, mirroring the legacy C# UserFlowTests/RandomSeedDeterminismTest.cs.
 * They ensure that seeded random generation is repeatable and that different seeds yield different sequences.
 */

describe('RandomSeedDeterminism', () => {
  beforeEach(() => {
    // Always reset seed before each test for isolation
    setRandomSeed(0);
  });

  function sequenceForSeed(seed: number, count: number, maxExclusive: number): string {
    setRandomSeed(seed);
    return Array.from({ length: count }, () => randomInt(maxExclusive)).join(',');
  }

  it('Seeded random is repeatable and different across seeds', () => {
    const seqA = sequenceForSeed(20260307, 12, 1000);
    const seqB = sequenceForSeed(20260307, 12, 1000);
    const seqC = sequenceForSeed(20260308, 12, 1000);
    expect(seqB).toBe(seqA); // same seed, same sequence
    expect(seqC).not.toBe(seqA); // different seed, different sequence
  });

  it('Seed is deterministic across resets', () => {
    setRandomSeed(4242);
    const first = Array.from({ length: 10 }, () => randomInt(500)).join(',');
    setRandomSeed(4242);
    const second = Array.from({ length: 10 }, () => randomInt(500)).join(',');
    expect(second).toBe(first); // resetting with same seed yields same sequence
  });

  it('getRandomSeed returns the initial seed', () => {
    setRandomSeed(12345);
    expect(getRandomSeed()).toBe(12345);
  });
});
