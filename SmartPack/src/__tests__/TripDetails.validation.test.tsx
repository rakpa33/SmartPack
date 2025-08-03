/**
 * TripDetails Real-Time Validation Tests
 * 
 * PURPOSE: Tests the real-time validation functionality using the "touched" state pattern
 * Tests for validation feedback that appears only after fields are touched (blurred)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TripDetails } from '../components/TripDetails';
import { TripFormContext } from '../hooks/TripFormContextOnly';
import type { TripFormState } from '../hooks/TripFormTypes';
import { PackingListProvider } from '../hooks/usePackingListContext';

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
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
    const tripNameInput = screen.getByPlaceholderText('Enter trip name');
    await userEvent.clear(tripNameInput);
    expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();
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
    await userEvent.click(tripNameInput);
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Trip name is required/)).toBeInTheDocument();
    });
    await userEvent.type(tripNameInput, 'Valid Trip');
    await waitFor(() => {
      expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();
    });
  });

  it('should show travel mode validation error when touched', async () => {
    const state = createMockState();
    renderWithProviders(state);
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Select at least one travel mode/)).not.toBeInTheDocument();
    const carCheckbox = screen.getByLabelText('Car');
    await userEvent.click(carCheckbox);
    await userEvent.click(carCheckbox);
    await waitFor(() => {
      expect(screen.getByText(/Select at least one travel mode/)).toBeInTheDocument();
    });
  });
});