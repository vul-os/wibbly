import { defineConfig } from 'vitest/config';

/**
 * App-level tests (src/). The two packages under packages/* keep their own
 * vitest configs and their own runs; this covers the shell, which previously
 * had no tests at all.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    environment: 'node',
  },
});
