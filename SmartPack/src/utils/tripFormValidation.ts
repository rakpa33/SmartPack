import { isValidCity, isDateInPast, isEndDateBeforeStart } from '../utils/validation';
import type { TripFormState } from '../hooks/useTripForm';

export type TripFormErrors = {
  tripName?: string;
  destinations?: string[];
  travelModes?: string;
  startDate?: string;
  endDate?: string;
};

export function validateTripForm(state: TripFormState): TripFormErrors {
  const errors: TripFormErrors = {};

  // Trip Name
  if (!state.tripName.trim()) {
    errors.tripName = 'Trip name is required.';
  } else if (state.tripName.trim().length < 2) {
    errors.tripName = 'Trip name is too short.';
  }

  // Destinations
  errors.destinations = state.destinations.map((d) => {
    if (!d.trim()) return 'Destination is required.';
    if (!isValidCity(d)) return 'Enter a valid city.';
    return '';
  });

  // Travel Modes
  if (!state.travelModes.length) {
    errors.travelModes = 'Select at least one travel mode.';
  }

  // Dates
  if (!state.startDate) {
    errors.startDate = 'Start date is required.';
  } else if (isDateInPast(state.startDate)) {
    errors.startDate = 'Start date cannot be in the past.';
  }
  if (!state.endDate) {
    errors.endDate = 'End date is required.';
  } else if (isDateInPast(state.endDate)) {
    errors.endDate = 'End date cannot be in the past.';
  } else if (state.startDate && isEndDateBeforeStart(state.startDate, state.endDate)) {
    errors.endDate = 'End date cannot be before start date.';
  }

  return errors;
}
