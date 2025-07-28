import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import '@testing-library/jest-dom';
import MainLayout from '../components/MainLayout';
import { screen } from '@testing-library/react';
import { TripFormProvider } from '../hooks/TripFormContext';

describe('MainLayout', () => {
  beforeEach(() => {
    // Clear localStorage to prevent test contamination
    localStorage.clear();
    // Set up localStorage with completed form state (step: 2)
    localStorage.setItem('tripForm', JSON.stringify({
      tripName: 'Test Trip',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      destinations: ['Test Destination'],
      travelModes: [],
      preferences: [],
      step: 2
    }));
  });

  function setup(children: React.ReactNode = null) {
    return renderWithProviders(
      <TripFormProvider>
        <MainLayout>{children}</MainLayout>
      </TripFormProvider>
    );
  }

  it('renders children in the layout', () => {
    setup(<div data-testid="child">Test Child</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders all three layout sections', () => {
    setup('child');
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
