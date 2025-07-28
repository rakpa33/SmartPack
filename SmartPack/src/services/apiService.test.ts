// src/services/apiService.test.ts
import { describe, test, expect, vi } from 'vitest';
import { generatePackingList, checkApiHealth } from './apiService';
import type { TripFormData } from '../types/tripForm';

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
