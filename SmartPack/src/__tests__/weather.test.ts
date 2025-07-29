/**
 * Weather Service Unit Tests
 * 
 * PURPOSE: Tests the weather data fetching and processing functionality
 * 
 * SCOPE - This file should contain:
 * ✅ fetchWeather() function testing with various coordinates
 * ✅ Weather API response parsing and validation
 * ✅ Error handling for network failures
 * ✅ Data transformation and formatting
 * ✅ Mock fetch setup for external API calls
 * 
 * SCOPE - This file should NOT contain:
 * ❌ UI component testing (belongs in component tests)
 * ❌ Integration with AI service (belongs in integration tests)
 * ❌ Geocoding functionality (belongs in geocode.test.ts)
 * ❌ Full app workflow testing (belongs in integration tests)
 * 
 * DEPENDENCIES:
 * - weather.ts utility functions
 * - Mock fetch for external API isolation
 * - Open-Meteo API contract understanding
 * 
 * MAINTENANCE:
 * - Update when weather API endpoints change
 * - Modify when data transformation logic changes
 * - Add tests for new weather parameters
 * - Review when error handling is enhanced
 * 
 * TESTING PATTERNS:
 * - Mocks external weather API calls
 * - Tests both success and error scenarios
 * - Validates data parsing and transformation
 * - Focuses on utility function isolation
 */

import { describe, it, expect, vi } from 'vitest';
import { fetchWeather } from '../utils/weather';

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('fetchWeather', () => {
  describe('when API responds successfully', () => {
    it('should return weather data for valid response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            temperature_2m_max: [25],
            temperature_2m_min: [18],
            weathercode: [1],
          },
        }),
      });
      const result = await fetchWeather(48.8566, 2.3522, '2025-07-27', '2025-07-28');
      expect(result).toEqual({
        temperature: 25,
        temperatureMin: 18,
        temperatureMax: 25,
        weathercode: 1,
        weathercodeEnd: 1,
        averageTemp: 21.5,
        summary: 'Mainly clear',
      });
    });
  });

  describe('when API request fails', () => {
    it('should return null for non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await fetchWeather(0, 0, '2025-07-27', '2025-07-28');
      expect(result).toBeNull();
    });

    it('should return null for fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      const result = await fetchWeather(0, 0, '2025-07-27', '2025-07-28');
      expect(result).toBeNull();
    });
  });
});
