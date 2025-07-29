/**
 * Vitest Test Setup - 2024/2025 Modern Configuration
 * Configures global test environment with optimal performance and accessibility testing
 */

import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';
import { configure } from '@testing-library/react';

// Setup accessibility testing compatibility with Vitest
import { toHaveNoViolations } from 'jest-axe';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expect.extend({ toHaveNoViolations } as any);

// Configure React Testing Library for optimal performance
configure({
  // Reduce query timeout for faster test execution
  asyncUtilTimeout: 5000,
  
  // Configure DOM testing library
  testIdAttribute: 'data-testid',
  
  // Performance: Don't suggest queries on failures in CI
  getElementError: process.env.CI 
    ? (message: string) => new Error(message)
    : undefined,
});

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

// Console error suppression for known issues
const originalError = console.error;
console.error = (...args) => {
  // Suppress React 18 hydration warnings in tests
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Setup timezone for consistent date testing
process.env.TZ = 'UTC';

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});
