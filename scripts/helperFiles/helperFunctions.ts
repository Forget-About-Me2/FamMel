export function range(start: number, end: number): number[] {
    if (start === end) return [start];
    return [start, ...range(start + 1, end)];
}

interface DistributionStrategy {
    generateDistribution(baseValue: number): number[];
}

export class NormalDistributionStrategy implements DistributionStrategy {
    private readonly distribution = {
        VERY_LOW: {count: 1, offset: -2},
        LOW: {count: 2, offset: -1},
        NORMAL: {count: 4, offset: 0},
        HIGH: {count: 2, offset: 1},
        VERY_HIGH: {count: 1, offset: 2}
    };

    generateDistribution(baseValue: number): number[] {
        const result: number[] = [];

        Object.values(this.distribution).forEach(({count, offset}) => {
            for (let i = 0; i < count; i++) {
                result.push(baseValue + offset);
            }
        });

        return result;
    }
}


/**
 * Generates a random value based on a normal distribution calculated from the given base value.
 *
 * @param {number} baseValue - The base value used to generate the normal distribution.
 * @return {number} A random value selected from the generated normal distribution.
 */
export function getRandomValueFromNormalDistribution(baseValue: number): number {
    if (baseValue <= 2) {
        return baseValue;
    }
    const strategy = new NormalDistributionStrategy();
    const distribution = strategy.generateDistribution(baseValue);
    const randomIndex = randomInt(distribution.length);
    return distribution[randomIndex];
}