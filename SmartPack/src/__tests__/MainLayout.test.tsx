/**
 * MainLayout Component Unit Tests
 * 
 * PURPOSE: Tests the main application layout and packing list management functionality
 * 
 * SCOPE - This file should contain:
 * ✅ Layout component rendering and structure
 * ✅ Packing checklist display and interaction
 * ✅ Trip details presentation
 * ✅ Suggestions panel functionality
 * ✅ Item checking/unchecking behavior
 * ✅ State persistence in localStorage
 * ✅ Empty state handling
 * 
 * SCOPE - This file should NOT contain:
 * ❌ AI generation logic testing (belongs in enhancedAI.integration.test.tsx)
 * ❌ Form submission testing (belongs in TripForm.test.tsx)
 * ❌ Navigation testing (belongs in integration tests)
 * ❌ Cross-browser testing (belongs in playwright/)
 * 
 * DEPENDENCIES:
 * - MainLayout component (primary test target)
 * - Mock trip data for testing different scenarios
 * - localStorage for state persistence testing
 * - renderWithProviders for context
 * 
 * MAINTENANCE:
 * - Add tests when new sections are added to layout
 * - Update when checklist functionality changes
 * - Modify when trip display logic changes
 * - Review when localStorage schema changes
 * 
 * TESTING PATTERNS:
 * - Uses mock data for consistent testing
 * - Tests component isolation without external services
 * - Validates accessibility and user interactions
 * - Focuses on UI state management
 */

import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import '@testing-library/jest-dom';
import MainLayout from '../components/MainLayout';
import { screen, waitFor } from '@testing-library/react';
import { TripFormProvider } from '../hooks/TripFormContext';
import { axe } from 'jest-axe';
import { expect } from 'vitest';

// For Vitest compatibility with jest-axe, we need to define the matcher inline
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

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
      travelModes: ['Car'], // Must have at least one travel mode for form to be complete
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

  describe('when rendering', () => {
    it('should render children in the layout', async () => {
      setup(<div data-testid="child">Test Child</div>);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      }, { timeout: 1000 });

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render all three layout sections', async () => {
      setup('child');

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      }, { timeout: 1000 });

      expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
      expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /AI Suggestions/i })).toBeInTheDocument();
    });

    it('should ensure all sections are accessible by role/label', async () => {
      setup('child');

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      }, { timeout: 1000 });

      expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
      expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /AI Suggestions/i })).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = renderWithProviders(
        <TripFormProvider>
          <MainLayout>
            <div>Test Child</div>
          </MainLayout>
        </TripFormProvider>
      );
      await expectNoA11yViolations(container);
    });
  });
});
