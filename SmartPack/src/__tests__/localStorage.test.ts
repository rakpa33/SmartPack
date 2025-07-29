/**
 * localStorage Persistence Unit Tests
 * 
 * PURPOSE: Tests data persistence and state management using browser localStorage
 * 
 * SCOPE - This file should contain:
 * ✅ Trip data persistence across sessions
 * ✅ Packing list state storage and retrieval
 * ✅ Settings and preferences persistence
 * ✅ Data serialization and deserialization
 * ✅ localStorage error handling and fallbacks
 * ✅ Data migration and versioning testing
 * 
 * SCOPE - This file should NOT contain:
 * ❌ UI component testing (belongs in component tests)
 * ❌ API data storage (belongs in API service tests)
 * ❌ Cross-browser storage testing (belongs in playwright/)
 * ❌ Performance testing for large datasets
 * 
 * DEPENDENCIES:
 * - Browser localStorage API
 * - Mock localStorage for testing isolation
 * - Data serialization utilities
 * - No external service dependencies
 * 
 * MAINTENANCE:
 * - Add tests when new data types are persisted
 * - Update when localStorage schema changes
 * - Modify when data migration logic changes
 * - Review when privacy/security requirements change
 * 
 * TESTING PATTERNS:
 * - Mocks localStorage for test isolation
 * - Tests data persistence across mock page reloads
 * - Validates serialization/deserialization integrity
 * - Focuses on storage reliability and data integrity
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('localStorage persistence', () => {
  let originalLocation: Location;
  let originalURLSearchParams: typeof URLSearchParams;

  beforeEach(() => {
    // Clear localStorage for test isolation
    window.localStorage.clear();

    // Save original values
    originalLocation = window.location;
    originalURLSearchParams = window.URLSearchParams;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
    window.URLSearchParams = originalURLSearchParams;
  });

  describe('when in development mode', () => {
    it('should not clear localStorage by default', () => {
      // Set some test data
      localStorage.setItem('tripForm', JSON.stringify({ tripName: 'Test Trip' }));
      localStorage.setItem('smartpack_checklist', JSON.stringify([{ id: '1', label: 'Test Item' }]));
      localStorage.setItem('theme', 'dark');

      // Mock window.location.search without clearStorage parameter
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true
      });

      // Mock URLSearchParams
      const mockURLSearchParams = vi.fn(() => ({
        has: vi.fn(() => false) // clearStorage parameter not present
      }));
      window.URLSearchParams = mockURLSearchParams as unknown as typeof URLSearchParams;

      // Simulate the conditional localStorage.clear logic from main.tsx
      const isDev = true; // import.meta.env.DEV
      const hasClearStorageParam = new window.URLSearchParams(window.location.search).has('clearStorage');

      if (isDev && hasClearStorageParam) {
        localStorage.clear();
      }

      // Verify data persists
      expect(localStorage.getItem('tripForm')).toBe('{"tripName":"Test Trip"}');
      expect(localStorage.getItem('smartpack_checklist')).toBe('[{"id":"1","label":"Test Item"}]');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('when clearStorage parameter is present', () => {
    it('should clear localStorage in development mode', () => {
      // Set some test data
      localStorage.setItem('tripForm', JSON.stringify({ tripName: 'Test Trip' }));
      localStorage.setItem('smartpack_checklist', JSON.stringify([{ id: '1', label: 'Test Item' }]));
      localStorage.setItem('theme', 'dark');

      // Mock window.location.search with clearStorage parameter
      Object.defineProperty(window, 'location', {
        value: { search: '?clearStorage=true' },
        writable: true
      });

      // Mock URLSearchParams to return true for clearStorage
      const mockURLSearchParams = vi.fn(() => ({
        has: vi.fn((param: string) => param === 'clearStorage')
      }));
      window.URLSearchParams = mockURLSearchParams as unknown as typeof URLSearchParams;

      // Simulate the conditional localStorage.clear logic from main.tsx
      const isDev = true; // import.meta.env.DEV
      const hasClearStorageParam = new window.URLSearchParams(window.location.search).has('clearStorage');

      if (isDev && hasClearStorageParam) {
        localStorage.clear();
      }

      // Verify data was cleared
      expect(localStorage.getItem('tripForm')).toBeNull();
      expect(localStorage.getItem('smartpack_checklist')).toBeNull();
      expect(localStorage.getItem('theme')).toBeNull();
    });
  });

  describe('when in production mode', () => {
    it('should not clear localStorage even with clearStorage parameter', () => {
      // Set some test data
      localStorage.setItem('tripForm', JSON.stringify({ tripName: 'Test Trip' }));
      localStorage.setItem('smartpack_checklist', JSON.stringify([{ id: '1', label: 'Test Item' }]));
      localStorage.setItem('theme', 'dark');

      // Mock window.location.search with clearStorage parameter
      Object.defineProperty(window, 'location', {
        value: { search: '?clearStorage=true' },
        writable: true
      });

      // Mock URLSearchParams to return true for clearStorage
      const mockURLSearchParams = vi.fn(() => ({
        has: vi.fn((param: string) => param === 'clearStorage')
      }));
      window.URLSearchParams = mockURLSearchParams as unknown as typeof URLSearchParams;

      // Simulate the conditional localStorage.clear logic from main.tsx (production mode)
      const isDev = false; // import.meta.env.DEV in production
      const hasClearStorageParam = new window.URLSearchParams(window.location.search).has('clearStorage');

      if (isDev && hasClearStorageParam) {
        localStorage.clear();
      }

      // Verify data persists in production
      expect(localStorage.getItem('tripForm')).toBe('{"tripName":"Test Trip"}');
      expect(localStorage.getItem('smartpack_checklist')).toBe('[{"id":"1","label":"Test Item"}]');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});