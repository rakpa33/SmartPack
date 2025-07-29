/**
 * Geocoding Service Unit Tests
 * 
 * PURPOSE: Tests the location geocoding functionality for converting city names to coordinates
 * 
 * SCOPE - This file should contain:
 * ✅ geocodeCity() function testing with various location inputs
 * ✅ Geocoding API response parsing and validation
 * ✅ Error handling for invalid locations and network failures
 * ✅ Data normalization and coordinate extraction
 * ✅ Mock fetch setup for external geocoding API
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Weather service testing (belongs in weather.test.ts)
 * ❌ UI component testing (belongs in component tests)
 * ❌ Full app integration testing (belongs in integration tests)
 * ❌ Form validation testing (belongs in TripForm tests)
 * 
 * DEPENDENCIES:
 * - geocode.ts utility functions
 * - Mock fetch for external API isolation
 * - Nominatim/OpenStreetMap API contract
 * 
 * MAINTENANCE:
 * - Update when geocoding API endpoints change
 * - Modify when location parsing logic changes
 * - Add tests for new location types or formats
 * - Review when error handling is enhanced
 * 
 * TESTING PATTERNS:
 * - Mocks external geocoding API calls
 * - Tests various location input formats
 * - Validates coordinate extraction and parsing
 * - Focuses on utility function isolation
 */

import { describe, it, expect, vi } from 'vitest';
import { geocodeCity } from '../utils/geocode';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('geocodeCity', () => {
  describe('when geocoding successful', () => {
    it('should return geocode result for valid city', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([{ lat: '48.8566', lon: '2.3522', display_name: 'Paris, France' }]),
      });
      const result = await geocodeCity('Paris');
      expect(result).toEqual({ lat: 48.8566, lon: 2.3522, display_name: 'Paris, France' });
    });
  });

  describe('when no results found', () => {
    it('should return null for empty results', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
      const result = await geocodeCity('Nowhereville');
      expect(result).toBeNull();
    });
  });

  describe('when fetch fails', () => {
    it('should return null for fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      const result = await geocodeCity('Paris');
      expect(result).toBeNull();
    });
  });
});
