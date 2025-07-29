/**
 * TripForm Component Unit Tests
 * 
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend expect with accessibility matchers
expect.extend({ toHaveNoViolations });PURPOSE: Tests the core trip form component functionality, validation, and user interactions
 * 
 * SCOPE - This file should contain:
 * ✅ Form field rendering and accessibility
 * ✅ User input handling and validation
 * ✅ Form submission behavior
 * ✅ Error state display and handling
 * ✅ Multiple destination management
 * ✅ Travel mode selection logic
 * ✅ Date picker functionality
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Navigation testing after form submission (belongs in integration tests)
 * ❌ AI service integration (belongs in enhancedAI.integration.test.tsx)
 * ❌ Layout component testing (belongs in MainLayout.test.tsx)
 * ❌ Cross-browser testing (belongs in playwright/)
 * 
 * DEPENDENCIES:
 * - TripForm component (primary test target)
 * - TripFormProvider context for state management
 * - renderWithProviders for React context
 * - Mock form submission handlers
 * 
 * MAINTENANCE:
 * - Add tests when new form fields are introduced
 * - Update when validation rules change
 * - Modify when UI components are restructured
 * - Review when accessibility requirements change
 * 
 * TESTING PATTERNS:
 * - Uses userEvent for realistic interactions
 * - Tests both valid and invalid form states
 * - Validates accessibility attributes
 * - Focuses on component isolation
 */

import { renderWithProviders } from '../../tests/testing-utils';
import { TripFormProvider } from '../hooks/TripFormContext';
import { TripForm } from '../components/TripForm';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('TripForm', () => {
  function renderTripForm() {
    const user = userEvent.setup();
    renderWithProviders(
      <TripFormProvider>
        <TripForm />
      </TripFormProvider>
    );
    return { user };
  }

  beforeEach(() => {
    localStorage.clear();
  });

  describe('when rendering', () => {
    it('should display all form fields and labels', () => {
      renderTripForm();

      expect(screen.getByLabelText(/Trip Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Trip Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Destination/i)).toBeInTheDocument();
      expect(screen.getByText(/Travel Modes/i)).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = renderWithProviders(
        <TripFormProvider>
          <TripForm />
        </TripFormProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('when user interacts', () => {
    it('should validate required fields and show errors', async () => {
      const { user } = renderTripForm();

      // Trigger validation by clicking Next without filling fields
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Wait for error messages to appear
      expect(await screen.findByText(/Trip name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Start date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/End date is required/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Destination is required\./i)).toHaveLength(1);
      expect(screen.getByText(/Select at least one travel mode/i)).toBeInTheDocument();
    });

    it('should validate city names', async () => {
      const { user } = renderTripForm();

      const destInput = screen.getAllByRole('textbox')[1];
      await user.type(destInput, 'NotARealCity');
      await user.tab(); // Trigger blur

      expect(await screen.findByText(/Enter a valid city/i)).toBeInTheDocument();
    });

    it('should validate date logic', async () => {
      const { user } = renderTripForm();

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const startInput = screen.getByLabelText(/Start Date/i);
      const endInput = screen.getByLabelText(/End Date/i);

      // Test past date validation
      await user.type(startInput, yesterday.toISOString().slice(0, 10));
      await user.tab();
      expect(await screen.findByText(/Start date cannot be in the past/i)).toBeInTheDocument();

      // Test end before start validation
      await user.clear(startInput);
      await user.type(startInput, tomorrow.toISOString().slice(0, 10));
      await user.type(endInput, today.toISOString().slice(0, 10));
      await user.tab();
      expect(await screen.findByText(/End date cannot be before start date/i)).toBeInTheDocument();

      // Test valid case
      await user.clear(endInput);
      await user.type(endInput, dayAfterTomorrow.toISOString().slice(0, 10));
      await user.tab();
      expect(screen.queryByText(/End date cannot be before start date/i)).not.toBeInTheDocument();
    });

    it('should allow adding and removing destinations', async () => {
      const { user } = renderTripForm();

      await user.click(screen.getByText(/Add Destination/i));
      expect(screen.getAllByTestId(/destination-input-/i)).toHaveLength(2);

      await user.click(screen.getAllByLabelText(/Remove destination/i)[0]);
      expect(screen.getAllByTestId(/destination-input-/i)).toHaveLength(1);
    });

    it('should submit when all fields are valid', async () => {
      const { user } = renderTripForm();

      await user.type(screen.getByLabelText(/Trip Name/i), 'My Trip');
      await user.type(screen.getAllByRole('textbox')[1], 'New York');
      await user.click(screen.getByLabelText(/Car/i));

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      await user.type(screen.getByLabelText(/Start Date/i), tomorrow.toISOString().slice(0, 10));
      await user.type(screen.getByLabelText(/End Date/i), dayAfterTomorrow.toISOString().slice(0, 10));
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Should not show errors
      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Enter a valid city/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cannot be in the past/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cannot be before start/i)).not.toBeInTheDocument();
    });
  });
});
