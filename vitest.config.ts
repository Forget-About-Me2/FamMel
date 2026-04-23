import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['scripts/**/*.test.ts'],
        setupFiles: ['scripts/test/vitest.setup.ts'],
    },
});