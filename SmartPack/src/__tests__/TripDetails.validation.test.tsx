/**
 * TripDetails Real-Time Validation Tests
 * 
 * PURPOSE: Tests the real-time validation functionality using the "touched" state pattern
 * Tests for validation feedback that appears only after fields are touched (blurred)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';
import { TripDetails } from '../components/TripDetails';
import { TripFormContext } from '../hooks/TripFormContextOnly';
import { PackingListProvider } from '../hooks/usePackingListContext';
import type { TripFormState } from '../hooks/TripFormTypes';

// Mock the column layout hook
vi.mock('../hooks/useColumnLayout', () => ({
  useColumnLayout: () => ({
    toggleColumn: vi.fn(),
  }),
}));

// Mock the context with minimal required state for testing validation
const createMockState = (overrides: Partial<TripFormState> = {}): TripFormState => ({
  tripName: '',
  startDate: '',
  endDate: '',
  destinations: [''],
  travelModes: [],
  preferences: [],
  step: 1,
  weather: undefined,
  ...overrides
});

const renderWithProviders = (state: TripFormState) => {
  const mockDispatch = vi.fn();
  return render(
    <TripFormContext.Provider value={{ state, dispatch: mockDispatch }}>
      <PackingListProvider>
        <TripDetails />
      </PackingListProvider>
    </TripFormContext.Provider>
  );
};

describe('TripDetails Touched-Based Validation', () => {
  it('should show trip name validation error only after field is touched', async () => {
    const state = createMockState();
    renderWithProviders(state);

    // Component should auto-enter edit mode for first-time users
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    const tripNameInput = screen.getByPlaceholderText('Enter trip name');

    // Clear the field but don't blur - should not show error
    await userEvent.clear(tripNameInput);
    expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();

    // Now blur the field - should show error
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Trip name is required/)).toBeInTheDocument();
    });
  });

  it('should clear validation error when field becomes valid after being touched', async () => {
    const state = createMockState();
    renderWithProviders(state);

    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    const tripNameInput = screen.getByPlaceholderText('Enter trip name');

    // Touch the field and leave it empty
    await userEvent.click(tripNameInput);
    await userEvent.click(document.body);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/Trip name is required/)).toBeInTheDocument();
    });

    // Now add valid content
    await userEvent.type(tripNameInput, 'Valid Trip');

    // Error should disappear immediately (continuous validation)
    await waitFor(() => {
      expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();
    });
  });

  it('should show date validation errors only after date fields are touched', async () => {
    const state = createMockState();
    renderWithProviders(state);

    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    const startDateInput = screen.getByLabelText(/Start Date/);
    const endDateInput = screen.getByLabelText(/End Date/);

    // Set conflicting dates but don't blur - should not show errors
    await userEvent.type(startDateInput, '2025-12-31');
    await userEvent.type(endDateInput, '2025-01-01');
    expect(screen.queryByText(/End date cannot be before start date/)).not.toBeInTheDocument();

    // Blur the end date field - should show error
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText(/End date cannot be before start date/)).toBeInTheDocument();
    });
  });

  it('should show travel mode validation error when touched', async () => {
    const state = createMockState();
    renderWithProviders(state);

    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    // Initially no error should be shown even though no travel modes are selected
    expect(screen.queryByText(/Select at least one travel mode/)).not.toBeInTheDocument();

    // Click a travel mode checkbox (this will mark it as touched)
    const carCheckbox = screen.getByLabelText('Car');
    await userEvent.click(carCheckbox);

    // Uncheck it to make it invalid again
    await userEvent.click(carCheckbox);

    // Now error should appear since field was touched
    await waitFor(() => {
      expect(screen.getByText(/Select at least one travel mode/)).toBeInTheDocument();
    });
  });
});