/**
 * Vitest Test Setup - 2024/2025 Modern Configuration
 * Configures global test environment with optimal performance and accessibility testing
 */

import '@testing-library/jest-dom';
import { vi, expect, beforeEach } from 'vitest';
import { configure } from '@testing-library/react';
import { act } from '@testing-library/react';

// Setup accessibility testing compatibility with Vitest
import { toHaveNoViolations } from 'jest-axe';

// Extend Vitest matchers with jest-axe
expect.extend({ toHaveNoViolations } as any);

// Initial React Testing Library configuration is done below with act wrapper

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock ResizeObserver for responsive components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage for persistence testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock fetch for API testing
global.fetch = vi.fn();

// Setup default fetch response
const mockResponse = {
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(''),
};

vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

// Console error suppression is handled below with React Testing Library configuration

// Setup timezone for consistent date testing
process.env.TZ = 'UTC';

// Global act wrapper for React state updates in tests
(global as any).actWrapper = (callback: () => void) => {
  return act(() => {
    callback();
  });
};

// Configure React Testing Library to automatically wrap updates in act()
configure({
  // Reduce query timeout for faster test execution
  asyncUtilTimeout: 5000,
  
  // Configure DOM testing library
  testIdAttribute: 'data-testid',
  
  // Enable automatic act wrapping for React 18+
  asyncWrapper: async (cb: () => Promise<any>) => {
    let result;
    await act(async () => {
      result = await cb();
    });
    return result;
  },
});

// Suppress React 18 act warnings that are not actionable in tests
const originalError = console.error;
console.error = (...args) => {
  // Suppress React 18 hydration warnings and act warnings in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: An update to') && args[0].includes('inside a test was not wrapped in act'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Clear all mocks before each test
// Note: This global beforeEach is available because vitest.config.ts has 'globals: true'
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  
  // Reset fetch mock to default response
  vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);
});
