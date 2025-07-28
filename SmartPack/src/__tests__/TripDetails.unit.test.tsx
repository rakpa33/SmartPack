import React from 'react';
import { render } from '@testing-library/react';
import { TripDetails } from '../components/TripDetails';
import { TripFormContext } from '../hooks/TripFormContextOnly';
import type { TripFormState } from '../hooks/TripFormTypes';

function renderWithTripForm(state: Partial<TripFormState> = {}) {
  const defaultState: TripFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    preferences: [],
    step: 1,
  };
  return render(
    <TripFormContext.Provider value={{ state: { ...defaultState, ...state }, dispatch: jest.fn() }}>
      <TripDetails />
    </TripFormContext.Provider>
  );
}

describe('TripDetails', () => {
  it('renders all fields with (not set) or (none) when empty', () => {
    const { getByText } = renderWithTripForm();
    expect(getByText('Trip Name:')).toBeInTheDocument();
    expect(getByText('(not set)')).toBeInTheDocument();
    expect(getByText('Dates:')).toBeInTheDocument();
    expect(getByText('(not set)')).toBeInTheDocument();
    expect(getByText('Destinations:')).toBeInTheDocument();
    expect(getByText('(none)')).toBeInTheDocument();
    expect(getByText('Travel Modes:')).toBeInTheDocument();
    expect(getByText('Preferences:')).toBeInTheDocument();
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
