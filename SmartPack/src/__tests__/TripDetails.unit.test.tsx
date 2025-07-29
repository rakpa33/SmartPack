import React from 'react';
import { render } from '@testing-library/react';
import { TripDetails } from '../components/TripDetails';
import { TripFormContext } from '../hooks/TripFormContextOnly';
import { PackingListProvider } from '../hooks/usePackingListContext';
import type { TripFormState } from '../hooks/TripFormTypes';

function renderWithTripForm(state: Partial<TripFormState> = {}) {
  const defaultState: TripFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    preferences: [],
    step: 2, // Set step to 2 so TripDetails renders content instead of "Please complete the trip form"
  };
  return render(
    <TripFormContext.Provider value={{ state: { ...defaultState, ...state }, dispatch: () => { } }}>
      <PackingListProvider>
        <TripDetails />
      </PackingListProvider>
    </TripFormContext.Provider>
  );
}

describe('TripDetails', () => {
  beforeEach(() => {
    // Clear localStorage to prevent test contamination
    localStorage.clear();
  });

  it('renders all fields with (not set) or (none) when empty', () => {
    const { getByText, getAllByText } = renderWithTripForm();
    expect(getByText('Trip Name:')).toBeInTheDocument();
    expect(getAllByText('(not set)').length).toBe(2); // Trip Name and Dates
    expect(getByText('Destinations:')).toBeInTheDocument();
    expect(getAllByText('(none)').length).toBe(3); // Destinations, Travel Modes, Preferences
  });

  it('renders trip name, dates, destinations, travel modes, and preferences', () => {
    const { getByText } = renderWithTripForm({
      tripName: 'Summer Adventure',
      startDate: '2025-08-01',
      endDate: '2025-08-10',
      destinations: ['Paris', 'Berlin'],
      travelModes: ['Plane', 'Train'],
      preferences: ['Vegan', 'Window seat'],
    });
    expect(getByText('Summer Adventure')).toBeInTheDocument();
    expect(getByText('2025-08-01 – 2025-08-10')).toBeInTheDocument();
    expect(getByText('Paris, Berlin')).toBeInTheDocument();
    expect(getByText('Plane, Train')).toBeInTheDocument();
    expect(getByText('Vegan, Window seat')).toBeInTheDocument();
  });

  it('filters out empty destinations and preferences', () => {
    const { getByText, queryByText } = renderWithTripForm({
      destinations: ['Paris', '', 'London'],
      preferences: ['', 'Aisle seat', ''],
    });
    expect(getByText('Paris, London')).toBeInTheDocument();
    expect(getByText('Aisle seat')).toBeInTheDocument();
    expect(queryByText(', ,')).not.toBeInTheDocument();
  });
});
