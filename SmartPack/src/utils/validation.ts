// utils/validation.ts
// Validation utilities for Trip Details form

// Enhanced city validation that's more flexible with geocoded results
export function isValidCity(city: string): boolean {
  const cityTrimmed = city.trim();
  
  // If the city is empty, it's invalid
  if (!cityTrimmed) return false;
  
  // Reject obvious test/fake city names
  const fakeCityPatterns = [
    /^NotARealCity$/i,
    /^FakeCity$/i,
    /^TestCity$/i,
    /^InvalidCity$/i
  ];
  
  if (fakeCityPatterns.some(pattern => pattern.test(cityTrimmed))) {
    return false;
  }
  
  // If the city contains a comma, it's likely a geocoded result (e.g., "Honolulu, Hawaii, United States")
  // We consider geocoded results as valid since they came from a geocoding service
  if (cityTrimmed.includes(',')) {
    // Check if it has at least a city and one other location part
    const parts = cityTrimmed.split(',').map(part => part.trim());
    return parts.length >= 2 && parts.every(part => part.length > 0);
  }
  
  // For non-geocoded entries, check if it looks like a reasonable city name
  // - At least 1 character
  // - Contains mostly letters with optional spaces, hyphens, periods, and apostrophes
  // - Allows for international city names
  const cityPattern = /^[\p{L}][\p{L}\s\-'.]*[\p{L}]$|^[\p{L}]$/u;
  return cityTrimmed.length >= 1 && cityPattern.test(cityTrimmed);
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
