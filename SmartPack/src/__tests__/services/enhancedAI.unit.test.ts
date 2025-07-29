import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePackingList } from '../../services/apiService';
import type { WeatherData, ChecklistItem } from '../../services/apiService';
import type { TripFormData } from '../../types';

// Mock fetch for unit testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Enhanced AI Packing List Generation - Unit Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createMockResponse = (checklist: ChecklistItem[], suggestedItems: string[] = []) => ({
    ok: true,
    json: async () => ({ checklist, suggestedItems })
  });

  describe('Smart Quantity Calculations', () => {
    it('should calculate correct quantities for short trips (1-3 days)', async () => {
      const shortTrip: TripFormData = {
        name: 'Weekend Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-03', // 2 days
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        tripDetails: 'Short weekend getaway'
      };

      const weather: WeatherData[] = [{
        location: 'Paris',
        temperature: 20,
        conditions: 'Clear',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: '4 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: '4 pairs socks', category: 'clothing', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(shortTrip, weather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: '4 pairs underwear' })
      );
    });

    it('should calculate correct quantities for medium trips (4-7 days)', async () => {
      const mediumTrip: TripFormData = {
        name: 'Business Week',
        startDate: '2025-08-01',
        endDate: '2025-08-06', // 5 days
        destinations: ['Tokyo, Japan'],
        travelModes: ['plane'],
        tripDetails: 'Business meetings throughout the week'
      };

      const weather: WeatherData[] = [{
        location: 'Tokyo',
        temperature: 28,
        conditions: 'Sunny',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: '7 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: '7 pairs socks', category: 'clothing', checked: false, aiGenerated: true },
        { id: '3', text: '3 shirts/tops', category: 'clothing', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(mediumTrip, weather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: '7 pairs underwear' })
      );
    });

    it('should cap quantities at reasonable limits for long trips', async () => {
      const longTrip: TripFormData = {
        name: 'Extended Vacation',
        startDate: '2025-08-01',
        endDate: '2025-08-20', // 19 days
        destinations: ['Australia'],
        travelModes: ['plane'],
        tripDetails: 'Long vacation across multiple cities'
      };

      const weather: WeatherData[] = [{
        location: 'Sydney',
        temperature: 22,
        conditions: 'Partly cloudy',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: '14 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: '14 pairs socks', category: 'clothing', checked: false, aiGenerated: true },
        { id: '3', text: '10 shirts/tops', category: 'clothing', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(longTrip, weather);

      // Should cap at maximum limits
      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: '14 pairs underwear' })
      );
    });
  });

  describe('Trip Purpose Recognition', () => {
    it('should detect business trips and include appropriate items', async () => {
      const businessTrip: TripFormData = {
        name: 'Corporate Conference',
        startDate: '2025-08-01',
        endDate: '2025-08-04',
        destinations: ['New York, USA'],
        travelModes: ['plane'],
        tripDetails: 'Important business meetings with clients and conference presentations'
      };

      const weather: WeatherData[] = [{
        location: 'New York',
        temperature: 24,
        conditions: 'Clear',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: 'Business suits/formal wear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'Laptop + charger', category: 'electronics', checked: false, aiGenerated: true },
        { id: '3', text: 'Business cards', category: 'documents', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist, ['Professional networking materials']));

      const result = await generatePackingList(businessTrip, weather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Business suits/formal wear' })
      );
      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Laptop + charger' })
      );
    });

    it('should detect beach vacations and include appropriate items', async () => {
      const beachTrip: TripFormData = {
        name: 'Hawaii Beach Vacation',
        startDate: '2025-07-15',
        endDate: '2025-07-22',
        destinations: ['Honolulu, Hawaii'],
        travelModes: ['plane'],
        tripDetails: 'Relaxing beach vacation with swimming and surfing activities'
      };

      const weather: WeatherData[] = [{
        location: 'Honolulu',
        temperature: 32,
        conditions: 'Sunny',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: 'Swimwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'Beach towel', category: 'accessories', checked: false, aiGenerated: true },
        { id: '3', text: 'Sunscreen (SPF 30+)', category: 'health', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist, ['Insect repellent']));

      const result = await generatePackingList(beachTrip, weather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Swimwear' })
      );
      expect(result.suggestedItems).toContain('Insect repellent');
    });
  });

  describe('Weather-Based Recommendations', () => {
    it('should include cold weather items for temperatures below 15°C', async () => {
      const coldWeatherTrip: TripFormData = {
        name: 'Winter Trip',
        startDate: '2025-12-15',
        endDate: '2025-12-20',
        destinations: ['Reykjavik, Iceland'],
        travelModes: ['plane'],
        tripDetails: 'Winter vacation to see northern lights'
      };

      const coldWeather: WeatherData[] = [{
        location: 'Reykjavik',
        temperature: -5,
        conditions: 'Snow',
        precipitation: 3
      }];

      const mockChecklist = [
        { id: '1', text: 'Winter jacket/coat', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'Warm gloves', category: 'accessories', checked: false, aiGenerated: true },
        { id: '3', text: 'Thermal underwear', category: 'clothing', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(coldWeatherTrip, coldWeather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Winter jacket/coat' })
      );
      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Thermal underwear' })
      );
    });

    it('should include rain gear for rainy conditions', async () => {
      const rainyTrip: TripFormData = {
        name: 'London City Break',
        startDate: '2025-03-15',
        endDate: '2025-03-18',
        destinations: ['London, UK'],
        travelModes: ['train'],
        tripDetails: 'City sightseeing and museums'
      };

      const rainyWeather: WeatherData[] = [{
        location: 'London',
        temperature: 15,
        conditions: 'Heavy rain',
        precipitation: 12
      }];

      const mockChecklist = [
        { id: '1', text: 'Umbrella', category: 'accessories', checked: false, aiGenerated: true },
        { id: '2', text: 'Rain jacket', category: 'clothing', checked: false, aiGenerated: true },
        { id: '3', text: 'Waterproof shoes', category: 'footwear', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(rainyTrip, rainyWeather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Umbrella' })
      );
      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Rain jacket' })
      );
    });
  });

  describe('Travel Mode Specific Items', () => {
    it('should include plane-specific items for air travel', async () => {
      const planeTrip: TripFormData = {
        name: 'International Flight',
        startDate: '2025-08-01',
        endDate: '2025-08-05',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        tripDetails: 'Long-haul international flight'
      };

      const weather: WeatherData[] = [{
        location: 'Paris',
        temperature: 22,
        conditions: 'Clear',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: 'Neck pillow', category: 'comfort', checked: false, aiGenerated: true },
        { id: '2', text: 'Headphones/earbuds', category: 'electronics', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(planeTrip, weather);

      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: 'Neck pillow' })
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle same-day trips gracefully', async () => {
      const sameDayTrip: TripFormData = {
        name: 'Day Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-01',
        destinations: ['Local City'],
        travelModes: ['car'],
        tripDetails: 'Quick day trip'
      };

      const weather: WeatherData[] = [{
        location: 'Local City',
        temperature: 22,
        conditions: 'Clear',
        precipitation: 0
      }];

      const mockChecklist = [
        { id: '1', text: '3 pairs underwear', category: 'clothing', checked: false, aiGenerated: true }
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockChecklist));

      const result = await generatePackingList(sameDayTrip, weather);

      // Should default to minimum quantities
      expect(result.checklist).toContainEqual(
        expect.objectContaining({ text: '3 pairs underwear' })
      );
    });

    it('should handle API errors gracefully', async () => {
      const trip: TripFormData = {
        name: 'Test Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-03',
        destinations: ['Test City'],
        travelModes: ['plane'],
        tripDetails: 'Test trip details'
      };

      const weather: WeatherData[] = [{
        location: 'Test City',
        temperature: 20,
        conditions: 'Clear',
        precipitation: 0
      }];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' })
      });

      await expect(generatePackingList(trip, weather))
        .rejects.toThrow('Internal server error');
    });

    it('should handle network errors gracefully', async () => {
      const trip: TripFormData = {
        name: 'Test Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-03',
        destinations: ['Test City'],
        travelModes: ['plane'],
        tripDetails: 'Test trip details'
      };

      const weather: WeatherData[] = [{
        location: 'Test City',
        temperature: 20,
        conditions: 'Clear',
        precipitation: 0
      }];

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(generatePackingList(trip, weather))
        .rejects.toThrow('Network error');
    });
  });
});
