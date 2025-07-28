import { isValidCity, isDateInPast, isEndDateBeforeStart } from '../utils/validation';

describe('isValidCity', () => {
  // Test geocoded city results
  test('accepts valid geocoded cities', () => {
    expect(isValidCity('Honolulu, Hawaii, United States')).toBe(true);
    expect(isValidCity('Paris, Île-de-France, France')).toBe(true);
    expect(isValidCity('Tokyo, 東京都, Japan')).toBe(true);
  });

  // Test non-geocoded city inputs
  test('accepts valid city names without geocoding', () => {
    expect(isValidCity('London')).toBe(true);
    expect(isValidCity('San Francisco')).toBe(true);
    expect(isValidCity('New York')).toBe(true);
  });

  // Test cities with special characters
  test('accepts cities with special characters', () => {
    expect(isValidCity('Saint-Tropez')).toBe(true);
    expect(isValidCity("Val d'Isere")).toBe(true);
  });

  // Test invalid inputs
  test('rejects invalid city inputs', () => {
    expect(isValidCity('')).toBe(false);
    expect(isValidCity('   ')).toBe(false);
    expect(isValidCity('123')).toBe(false);
    expect(isValidCity('@#$')).toBe(false);
    expect(isValidCity(',')).toBe(false);
    expect(isValidCity(', ,')).toBe(false);
  });
});

describe('isDateInPast', () => {
  test('correctly identifies past dates', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    expect(isDateInPast(yesterday.toISOString().split('T')[0])).toBe(true);
  });

  test('correctly identifies future dates', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    expect(isDateInPast(tomorrow.toISOString().split('T')[0])).toBe(false);
  });
});

describe('isEndDateBeforeStart', () => {
  test('correctly identifies when end date is before start date', () => {
    expect(isEndDateBeforeStart('2025-07-30', '2025-07-29')).toBe(true);
    expect(isEndDateBeforeStart('2025-07-30', '2025-07-31')).toBe(false);
  });
});
