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
    exclude: ['playwright/**', '**/*.e2e.*', 'node_modules', 'dist'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'src/__tests__/**/*.test.ts', 'src/__tests__/**/*.unit.test.ts'],
  },
  resolve: {
    alias: {
      // ...existing code...
    },
  },
});
