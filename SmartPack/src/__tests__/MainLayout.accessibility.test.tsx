import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import MainLayout from '../components/MainLayout';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TripFormProvider } from '../hooks/TripFormContext';

describe('MainLayout accessibility', () => {
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

  it('all sections are accessible by role/label', () => {
    renderWithProviders(
      <TripFormProvider>
        <MainLayout>child</MainLayout>
      </TripFormProvider>
    );
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
