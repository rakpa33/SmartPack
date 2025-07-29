/**
 * Performance Testing Configuration - 2024/2025 Standards
 * Configures performance monitoring and optimization for SmartPack
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Performance-specific test configuration
    include: ['src/performance/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    
    // Extended timeout for performance tests
    testTimeout: 30000,
    
    // Performance test environment
    environment: 'node',
    
    // Custom reporter for performance metrics
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './performance-results/performance-metrics.json',
    },
    
    // Globals for performance testing
    globals: true,
    
    // Coverage exclusions for performance tests
    coverage: {
      exclude: [
        'src/performance/**',
        'node_modules/**',
      ],
    },
  },
});
