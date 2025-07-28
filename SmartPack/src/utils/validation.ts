// utils/validation.ts
// Validation utilities for Trip Details form

// Placeholder: a small set of valid cities for demo/testing
const VALID_CITIES = [
  "New York", "London", "Paris", "Tokyo", "Sydney", "Berlin", "Toronto", "San Francisco", "Chicago", "Los Angeles"
];

export function isValidCity(city: string): boolean {
  // Handle geocoded city names that may include region/country information
  // Check if any valid city is contained within the geocoded city string
  const cityLower = city.trim().toLowerCase();
  
  // If the city contains a comma, it might be a geocoded result
  if (cityLower.includes(',')) {
    // Check if any of our valid cities appears at the beginning of the string
    return VALID_CITIES.some(valid => 
      cityLower.startsWith(valid.toLowerCase())
    );
  }
  
  // For non-geocoded entries, do an exact match
  return VALID_CITIES.some(
    valid => valid.toLowerCase() === cityLower
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
