import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Same alias as docs/.vitepress/config.js, so docs examples can be tested
      'pristine-neue': fileURLToPath(new URL('./src/pristine.js', import.meta.url)),
    },
  },
  test: {
    include: ['./tests/**/*.test.js'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/setup.js'],
    },
  },
});
