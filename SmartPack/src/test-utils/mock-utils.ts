import { vi } from 'vitest';

// Common mock utilities for testing
export const createMockWeather = (overrides = {}) => ({
  temperature: 25,
  weathercode: 1,
  summary: 'Mainly clear',
  ...overrides,
});

export const createMockGeocode = (overrides = {}) => ({
  lat: 48.8566,
  lon: 2.3522,
  display_name: 'Paris, Ile-de-France, Metropolitan France, France',
  ...overrides,
});

// Common mock implementations
export const mockWeatherService = () => {
  vi.mock('@utils/weather', () => ({
    fetchWeather: vi.fn().mockResolvedValue(createMockWeather()),
  }));
};

export const mockGeocodeService = () => {
  vi.mock('@utils/geocode', () => ({
    geocodeCity: vi.fn().mockResolvedValue(createMockGeocode()),
  }));
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    },
    writable: true,
  });
};

// Mock API service to prevent network calls during tests
export const mockApiService = () => {
  vi.mock('@services/apiService', () => ({
    generateAISuggestions: vi.fn().mockResolvedValue({
      checklist: [],
      suggestedItems: [],
      aiGenerated: true
    }),
    checkApiHealth: vi.fn().mockResolvedValue(true)
  }));
};
