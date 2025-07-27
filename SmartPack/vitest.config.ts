import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    mockReset: true,
    alias: {
      '\\.(css|less|scss|sass)$': './src/__mocks__/styleMock.js',
    },
  },
  resolve: {
    alias: {
      // ...existing code...
    },
  },
});
