// Centralized test utilities export
export { renderWithProviders } from './render-utils';
export {
  createMockWeather,
  createMockGeocode,
  mockWeatherService,
  mockGeocodeService,
  mockLocalStorage,
} from './mock-utils';

// Re-export commonly used testing library functions
export {
  screen,
  waitFor,
  fireEvent,
  within,
  cleanup,
} from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';
export { axe } from 'jest-axe';
export { vi, expect, describe, it, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
