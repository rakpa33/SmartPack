/**
 * TripDetails Component Unit Tests
 * 
 * PURPOSE: Tests the trip details display component and information presentation
 * 
 * SCOPE - This file should contain:
 * ✅ Trip information display and formatting
 * ✅ Date formatting and presentation
 * ✅ Destination list rendering
 * ✅ Travel mode display
 * ✅ Component accessibility validation
 * ✅ Empty state and error handling
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Trip form submission testing (belongs in TripForm.test.tsx)
 * ❌ Packing list functionality (belongs in MainLayout.test.tsx)
 * ❌ Navigation testing (belongs in integration tests)
 * ❌ Cross-browser testing (belongs in playwright/)
 * 
 * DEPENDENCIES:
 * - TripDetails component (primary test target)
 * - TripFormContext for state management
 * - PackingListProvider for context
 * - Mock trip data for testing scenarios
 * 
 * MAINTENANCE:
 * - Add tests when new trip information fields are added
 * - Update when display formatting changes
 * - Modify when component structure changes
 * - Review when accessibility requirements change
 * 
 * TESTING PATTERNS:
 * - Uses context providers for realistic testing
 * - Tests component with various trip data scenarios
 * - Validates accessibility with jest-axe
 * - Focuses on information display and formatting
 */

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { expect } from 'vitest';
import { TripDetails } from '../components/TripDetails';
import { TripFormContext } from '../hooks/TripFormContextOnly';
import type { TripFormState } from '../hooks/TripFormTypes';
import { PackingListProvider } from '../hooks/usePackingListContext';

// For Vitest compatibility with jest-axe, we need to define the matcher inline
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

function renderTripDetails(state: Partial<TripFormState> = {}) {
  const defaultState: TripFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    preferences: [],
    step: 2, // Set step to 2 so TripDetails renders content instead of "Please complete the trip form"
  };
  const finalState = { ...defaultState, ...state };
  return render(
    <TripFormContext.Provider value={{ state: finalState, dispatch: () => { } }}>
      <PackingListProvider>
        <TripDetails
          tripName={finalState.tripName}
          startDate={finalState.startDate}
          endDate={finalState.endDate}
          destinations={finalState.destinations}
          travelModes={finalState.travelModes}
          preferences={finalState.preferences}
          isFirstTimeOrNewTrip={!finalState.tripName && finalState.destinations.length === 1 && !finalState.destinations[0] && finalState.travelModes.length === 0}
        />
      </PackingListProvider>
    </TripFormContext.Provider>
  );
}

describe('TripDetails', () => {
  beforeEach(() => {
    // Clear localStorage to prevent test contamination
    localStorage.clear();
  });

  describe('when rendering', () => {
    it('should display all fields with (not set) or (none) when empty', () => {
      renderTripDetails();
      expect(screen.getByText('Trip Name:')).toBeInTheDocument();
      expect(screen.getAllByText('(not set)')).toHaveLength(2); // Trip Name and Dates
      expect(screen.getByText('Destinations:')).toBeInTheDocument();
      expect(screen.getAllByText('(none)')).toHaveLength(3); // Destinations, Travel Modes, Preferences
    });

    it('should be accessible', async () => {
      const { container } = renderTripDetails();
      await expectNoA11yViolations(container);
    });

    it('should display trip data when provided', () => {
      renderTripDetails({
        tripName: 'Summer Adventure',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris', 'Berlin'],
        travelModes: ['Plane', 'Train'],
        preferences: ['Vegan', 'Window seat'],
      });
      expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
      expect(screen.getByText('2025-08-01 – 2025-08-10')).toBeInTheDocument();
      expect(screen.getByText('Paris, Berlin')).toBeInTheDocument();
      expect(screen.getByText('Plane, Train')).toBeInTheDocument();
      expect(screen.getByText('Vegan, Window seat')).toBeInTheDocument();
    });

    it('should filter out empty destinations and preferences', () => {
      renderTripDetails({
        destinations: ['Paris', '', 'London'],
        preferences: ['', 'Aisle seat', ''],
      });
      expect(screen.getByText('Paris, London')).toBeInTheDocument();
      expect(screen.getByText('Aisle seat')).toBeInTheDocument();
      expect(screen.queryByText(', ,')).not.toBeInTheDocument();
    });

    it('should enter editing mode when Edit button is clicked', async () => {
      renderTripDetails({ tripName: 'Edit Test', destinations: ['Rome'], travelModes: ['Car'], startDate: '2025-09-01', endDate: '2025-09-10' });
      expect(screen.getByText('Edit')).toBeInTheDocument();
      
      await act(async () => {
        await userEvent.click(screen.getByText('Edit'));
      });
      
      expect(screen.getByDisplayValue('Edit Test')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should save changes and exit editing mode', async () => {
      renderTripDetails({ tripName: 'Edit Test', destinations: ['Rome'], travelModes: ['Car'], startDate: '2025-09-01', endDate: '2025-09-10' });
      await userEvent.click(screen.getByText('Edit'));
      const tripNameInput = screen.getByDisplayValue('Edit Test');
      await userEvent.clear(tripNameInput);
      await userEvent.type(tripNameInput, 'Edited Trip');
      await userEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Edited Trip')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('should cancel editing and revert changes', async () => {
      renderTripDetails({ tripName: 'Edit Test', destinations: ['Rome'], travelModes: ['Car'], startDate: '2025-09-01', endDate: '2025-09-10' });
      await userEvent.click(screen.getByText('Edit'));
      const tripNameInput = screen.getByDisplayValue('Edit Test');
      await userEvent.clear(tripNameInput);
      await userEvent.type(tripNameInput, 'Canceled Edit');
      await userEvent.click(screen.getByText('Cancel'));
      expect(screen.getByText('Edit Test')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });
});
