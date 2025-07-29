/**
 * API Service Unit Tests
 * 
 * PURPOSE: Tests the core API service layer that handles communication with the SmartPack backend
 * 
 * SCOPE - This file should contain:
 * ✅ generatePackingList() function testing with various trip configurations
 * ✅ checkApiHealth() function testing for service availability
 * ✅ API error handling and network failure scenarios
 * ✅ Request/response data validation and transformation
 * ✅ Mock fetch setup for isolated testing
 * 
 * SCOPE - This file should NOT contain:
 * ❌ UI component integration testing (belongs in integration tests)
 * ❌ End-to-end workflow testing (belongs in E2E tests)
 * ❌ Weather/geocoding service testing (separate utility tests)
 * ❌ Authentication logic (when implemented, separate test file)
 * 
 * DEPENDENCIES:
 * - apiService.ts (primary test target)
 * - TripFormData type definitions
 * - Vitest mocking for fetch API
 * 
 * MAINTENANCE:
 * - Add tests when new API endpoints are created
 * - Update when API request/response schemas change
 * - Modify when error handling logic is enhanced
 * - Review when backend service contracts change
 * 
 * TESTING PATTERNS:
 * - Uses vi.fn() for fetch mocking
 * - Tests both success and error scenarios
 * - Validates request payloads and response parsing
 * - Isolated from external dependencies
 */

import { describe, test, expect, vi } from 'vitest';
import { generatePackingList, checkApiHealth } from '../../services/apiService';
import type { TripFormData } from '../../types/tripForm';

// Mock fetch
global.fetch = vi.fn() as unknown as typeof fetch;

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('generatePackingList should call API and return data', async () => {
    // Setup mock response
    const mockResponse = {
      checklist: [
        { id: '1', text: 'Passport', category: 'Documents', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance']
    };

    // Configure mock fetch
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Test data
    const tripData: TripFormData = {
      name: 'Test Trip',
      startDate: '2025-08-01',
      endDate: '2025-08-07',
      destinations: ['Paris, France'],
      travelModes: ['plane'],
      tripDetails: 'Test trip details'
    };

    const weatherData = [
      {
        location: 'Paris, France',
        temperature: 25,
        conditions: 'Sunny',
        precipitation: 0
      }
    ];

    // Call the function
    const result = await generatePackingList(tripData, weatherData);

    // Assertions
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/generate'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          trip: tripData,
          weather: weatherData,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  test('generatePackingList should handle API errors', async () => {
    // Configure mock fetch to return an error
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'API error' }),
    });

    // Test data
    const tripData: TripFormData = {
      name: 'Test Trip',
      startDate: '2025-08-01',
      endDate: '2025-08-07',
      destinations: ['Paris, France'],
      travelModes: ['plane'],
      tripDetails: 'Test trip details'
    };

    const weatherData = [
      {
        location: 'Paris, France',
        temperature: 25,
        conditions: 'Sunny',
        precipitation: 0
      }
    ];

    // Call the function and expect it to throw
    await expect(generatePackingList(tripData, weatherData)).rejects.toThrow('API error');
  });

  test('checkApiHealth should return true when API is available', async () => {
    // Configure mock fetch to return success
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    // Call the function
    const result = await checkApiHealth();

    // Assertions
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
    expect(result).toBe(true);
  });

  test('checkApiHealth should return false when API is unavailable', async () => {
    // Configure mock fetch to throw an error
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    // Call the function
    const result = await checkApiHealth();

    // Assertions
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });
});
