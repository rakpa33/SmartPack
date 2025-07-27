import { validateTripForm } from '../utils/tripFormValidation';
import type { TripFormState } from '../hooks/useTripForm';

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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const errors = validateTripForm({ ...base, tripName: 'Trip', destinations: ['Paris'], startDate: today.toISOString().slice(0,10), endDate: tomorrow.toISOString().slice(0,10), travelModes: ['Car'] });
    expect(Object.values(errors).every(e => !e || (Array.isArray(e) && e.every(x => !x)))).toBe(true);
  });
});
