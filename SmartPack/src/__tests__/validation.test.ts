/**
 * Validation Utilities Unit Tests
 * 
 * PURPOSE: Tests form validation functions and data validation logic
 * 
 * SCOPE - This file should contain:
 * ✅ City name validation logic
 * ✅ Date validation (past dates, date ranges)
 * ✅ Form field validation rules
 * ✅ Input sanitization and normalization
 * ✅ Edge cases and boundary testing
 * ✅ Error message generation testing
 * 
 * SCOPE - This file should NOT contain:
 * ❌ UI component validation testing (belongs in component tests)
 * ❌ Form submission testing (belongs in integration tests)
 * ❌ API validation testing (belongs in API service tests)
 * ❌ Cross-browser validation (belongs in playwright/)
 * 
 * DEPENDENCIES:
 * - validation.ts utility functions (primary test target)
 * - Date manipulation for testing scenarios
 * - No external service dependencies
 * 
 * MAINTENANCE:
 * - Add tests when new validation rules are added
 * - Update when validation logic changes
 * - Modify when error message formats change
 * - Review when input requirements change
 * 
 * TESTING PATTERNS:
 * - Tests pure functions with various inputs
 * - Validates edge cases and boundary conditions
 * - Focuses on business logic without UI concerns
 * - Uses comprehensive test scenarios for robustness
 */

import { isValidCity, isDateInPast, isEndDateBeforeStart } from '../utils/validation';

describe('isValidCity', () => {
  describe('when validating geocoded cities', () => {
    it('should accept valid geocoded cities', () => {
      expect(isValidCity('Honolulu, Hawaii, United States')).toBe(true);
      expect(isValidCity('Paris, Île-de-France, France')).toBe(true);
      expect(isValidCity('Tokyo, 東京都, Japan')).toBe(true);
    });
  });

  describe('when validating non-geocoded cities', () => {
    it('should accept valid city names without geocoding', () => {
      expect(isValidCity('London')).toBe(true);
      expect(isValidCity('San Francisco')).toBe(true);
      expect(isValidCity('New York')).toBe(true);
    });

    it('should accept cities with special characters', () => {
      expect(isValidCity('Saint-Tropez')).toBe(true);
      expect(isValidCity("Val d'Isere")).toBe(true);
    });
  });

  describe('when validating invalid inputs', () => {
    it('should reject invalid city inputs', () => {
      expect(isValidCity('')).toBe(false);
      expect(isValidCity('   ')).toBe(false);
      expect(isValidCity('123')).toBe(false);
      expect(isValidCity('@#$')).toBe(false);
      expect(isValidCity(',')).toBe(false);
      expect(isValidCity(', ,')).toBe(false);
    });
  });
});

describe('isDateInPast', () => {
  describe('when validating date chronology', () => {
    it('should correctly identify past dates', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      expect(isDateInPast(yesterday.toISOString().split('T')[0])).toBe(true);
    });

    it('should correctly identify future dates', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      expect(isDateInPast(tomorrow.toISOString().split('T')[0])).toBe(false);
    });
  });
});

describe('isEndDateBeforeStart', () => {
  describe('when comparing date ranges', () => {
    it('should correctly identify when end date is before start date', () => {
      expect(isEndDateBeforeStart('2025-07-30', '2025-07-29')).toBe(true);
      expect(isEndDateBeforeStart('2025-07-30', '2025-07-31')).toBe(false);
    });
  });
});
