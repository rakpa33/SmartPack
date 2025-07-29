// src/__tests__/integration/LambdaApi.integration.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { generatePackingList, checkApiHealth } from '../../services/apiService';
import type { TripFormData } from '../../types/tripForm';

// Mock fetch
global.fetch = vi.fn() as unknown as Mock;

// Sample data
const sampleTripData: TripFormData = {
  name: 'Winter Trip',
  startDate: '2025-12-20',
  endDate: '2025-12-27',
  destinations: ['Oslo, Norway'],
  travelModes: ['plane'],
  tripDetails: 'Winter vacation to see the Northern Lights'
};

const sampleWeatherData = [{
  location: 'Oslo, Norway',
  temperature: -5,
  conditions: 'Snow',
  precipitation: 2
}];

const mockResponse = {
  checklist: [
    { id: '1', text: 'Passport', category: 'Documents', checked: false, aiGenerated: true },
    { id: '2', text: 'Winter jacket', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '3', text: 'Gloves', category: 'Accessories', checked: false, aiGenerated: true }
  ],
  suggestedItems: ['Travel insurance', 'Power adapter', 'Emergency contacts']
};

describe('Lambda API Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('generatePackingList successfully calls API and returns data', async () => {
    // Configure mock fetch response
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Call the API service
    const result = await generatePackingList(sampleTripData, sampleWeatherData);

    // Verify API was called with correct data
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/generate'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          trip: sampleTripData,
          weather: sampleWeatherData,
        }),
      })
    );

    // Verify response is processed correctly
    expect(result).toEqual(mockResponse);
    expect(result.checklist).toHaveLength(3);
    expect(result.suggestedItems).toHaveLength(3);

    // Verify specific items based on winter conditions
    const winterItems = result.checklist.filter(item =>
      item.text === 'Winter jacket' || item.text === 'Gloves'
    );
    expect(winterItems).toHaveLength(2);
  });

  test('generatePackingList handles API errors gracefully', async () => {
    // Configure mock fetch to return an error
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal server error' })
    });

    // Call the API and expect it to throw
    await expect(generatePackingList(sampleTripData, sampleWeatherData))
      .rejects.toThrow('Internal server error');
  });

  test('generatePackingList handles network errors gracefully', async () => {
    // Configure mock fetch to throw a network error
    (fetch as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    // Call the API and expect it to throw
    await expect(generatePackingList(sampleTripData, sampleWeatherData))
      .rejects.toThrow('Network error');
  });

  test('checkApiHealth returns true when API is available', async () => {
    // Configure mock fetch response
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
    });

    // Call the API service
    const result = await checkApiHealth();

    // Verify API was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));

    // Verify response
    expect(result).toBe(true);
  });

  test('checkApiHealth returns false when API is unavailable', async () => {
    // Configure mock fetch to throw an error
    (fetch as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    // Call the API service
    const result = await checkApiHealth();

    // Verify API was called
    expect(fetch).toHaveBeenCalledTimes(1);

    // Verify response
    expect(result).toBe(false);
  });
});
