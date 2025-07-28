import validateTripForm from '../utils/tripFormValidation';
import type { TripFormState } from '../hooks/TripFormTypes'; // Updated import to use named import
// import { makeTrip } from '../../tests/factories/tripFactory'; // For future use if needed

describe('validateTripForm (unit)', () => {
  const base: TripFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    preferences: [],
    step: 0,
  };

  it('requires all fields', () => {
    const errors = validateTripForm(base);
    expect(errors.tripName).toMatch(/required/);
    expect(errors.destinations?.[0]).toMatch(/required/);
    expect(errors.travelModes).toMatch(/Select/);
    expect(errors.startDate).toMatch(/required/);
    expect(errors.endDate).toMatch(/required/);
  });

  it('validates city', () => {
    const errors = validateTripForm({ ...base, tripName: 'Trip', destinations: ['NotARealCity'], startDate: '2025-07-26', endDate: '2025-07-27', travelModes: ['Car'] });
    expect(errors.destinations?.[0]).toMatch(/valid city/);
  });

  it('validates date logic', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let errors = validateTripForm({ ...base, tripName: 'Trip', destinations: ['Paris'], startDate: yesterday.toISOString().slice(0,10), endDate: tomorrow.toISOString().slice(0,10), travelModes: ['Car'] });
    expect(errors.startDate).toMatch(/in the past/);
    errors = validateTripForm({ ...base, tripName: 'Trip', destinations: ['Paris'], startDate: tomorrow.toISOString().slice(0,10), endDate: today.toISOString().slice(0,10), travelModes: ['Car'] });
    expect(errors.endDate).toMatch(/before start/);
  });

  it('accepts valid input', () => {
    // Use a guaranteed future date to avoid timezone issues
    const today = new Date();
    today.setDate(today.getDate() + 1); // tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // day after tomorrow
    // Use a valid city from the validation list
    const errors = validateTripForm({ ...base, tripName: 'Trip', destinations: ['New York'], startDate: today.toISOString().slice(0,10), endDate: tomorrow.toISOString().slice(0,10), travelModes: ['Car'] });
    console.log('VALID INPUT ERRORS:', errors);
    expect(errors.destinations).toEqual(['']);
    // Accepts valid input if all error values are undefined, null, empty strings, or arrays of only falsy values or arrays of empty strings
    expect(Object.values(errors).every(e =>
      e === undefined ||
      e === null ||
      (typeof e === 'string' && e.trim() === '') ||
      (Array.isArray(e) && e.every(x => x === '' || !x))
    )).toBe(true);
  });
});
