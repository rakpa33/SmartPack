import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { TripFormContext } from '../../hooks/TripFormContextOnly';
import type { TripFormState } from '../../hooks/TripFormTypes';
import { vi } from 'vitest';

function renderMainLayoutWithTripForm(state: Partial<TripFormState> = {}) {
  const defaultState: TripFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    preferences: [],
    step: 2, // show checklist
  };
  return render(
    <TripFormContext.Provider value={{ state: { ...defaultState, ...state }, dispatch: vi.fn() }}>
      <MemoryRouter>
        <MainLayout>{null}</MainLayout>
      </MemoryRouter>
    </TripFormContext.Provider>
  );
}

describe('MainLayout Trip Details integration', () => {
  it('shows Trip Details content from context', () => {
    renderMainLayoutWithTripForm({
      tripName: 'Euro Trip',
      startDate: '2025-09-01',
      endDate: '2025-09-15',
      destinations: ['Rome', 'Madrid'],
      travelModes: ['Car', 'Bus'],
      preferences: ['Gluten-free'],
    });
    expect(screen.getByText('Trip Details')).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
      node?.textContent === 'Euro Trip')
    ).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
      node?.textContent === '2025-09-01 – 2025-09-15')
    ).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
      node?.textContent === 'Rome, Madrid')
    ).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
      node?.textContent === 'Car, Bus')
    ).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
      node?.textContent === 'Gluten-free')
    ).toBeInTheDocument();
  });

  it('shows (not set) and (none) for missing fields', () => {
    renderMainLayoutWithTripForm();
    expect(screen.getAllByText('(not set)').length).toBe(2); // Trip Name and Dates
    expect(screen.getAllByText('(none)').length).toBe(3);    // Destinations, Travel Modes, Preferences
  });
});
