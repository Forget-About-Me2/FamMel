import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.test.ts'], // Updated to reflect new test folder
        setupFiles: ['scripts/test/vitest.setup.ts'],
    },
});