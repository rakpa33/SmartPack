// utils/validation.ts
// Validation utilities for Trip Details form

// Placeholder: a small set of valid cities for demo/testing
const VALID_CITIES = [
  "New York", "London", "Paris", "Tokyo", "Sydney", "Berlin", "Toronto", "San Francisco", "Chicago", "Los Angeles"
];

export function isValidCity(city: string): boolean {
  // Simple check: case-insensitive match against known cities
  return VALID_CITIES.some(
    valid => valid.toLowerCase() === city.trim().toLowerCase()
  );
}

export function isDateInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0,0,0,0);
  const date = new Date(dateStr);
  return date < today;
}

export function isEndDateBeforeStart(start: string, end: string): boolean {
  return new Date(end) < new Date(start);
}
