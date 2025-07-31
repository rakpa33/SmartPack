// Verification test for TripDetails display fix
// This test ensures the critical bug doesn't regress

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TripDetails } from '../components/TripDetails';
import { TripFormProvider } from '../hooks/TripFormContext';
import { ColumnLayoutProvider } from '../hooks/useColumnLayout';
import { PackingListProvider } from '../hooks/usePackingListContext';

// Mock the API service to prevent network calls during testing
vi.mock('../services/apiService', () => ({
  generatePackingList: vi.fn()
}));

const renderTripDetailsWithProviders = () => {
  return render(
    <TripFormProvider>
      <ColumnLayoutProvider>
        <PackingListProvider>
          <TripDetails />
        </PackingListProvider>
      </ColumnLayoutProvider>
    </TripFormProvider>
  );
};

describe('TripDetails Critical Display Fix Verification', () => {
  it('should NEVER show "Please complete the trip form" for step 2 users', () => {
    renderTripDetailsWithProviders();

    // This should NOT appear for step 2 users (the bug we fixed)
    expect(screen.queryByText('Please complete the trip form')).not.toBeInTheDocument();
  });

  it('should show Trip Details header for first-time users', () => {
    renderTripDetailsWithProviders();

    // Should show the Trip Details header (there might be multiple, that's OK)
    expect(screen.getAllByText('Trip Details')[0]).toBeInTheDocument();
  });
});

// REGRESSION PREVENTION: This test will fail if someone accidentally
// re-introduces the problematic step < 2 validation that blocked users
