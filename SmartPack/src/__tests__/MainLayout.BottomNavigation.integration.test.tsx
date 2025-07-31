import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'jest-axe';
import MainLayout from '@components/MainLayout';
import { TripFormProvider } from '@hooks/TripFormContext';

// Jest-axe Vitest compatibility helper
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

// Mock trip data for a completed form (step 2)
const completedTripState = {
  step: 2,
  tripName: 'Test Trip',
  startDate: '2025-08-01',
  endDate: '2025-08-05',
  destination: 'Paris, France',
  travelMode: 'leisure' as const,
  tripDetails: 'Visiting museums and cafes',
};

describe('MainLayout with BottomNavigation Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithContext = () => {
    const user = userEvent.setup();

    // Mock localStorage with completed form
    localStorage.setItem('smartpack-trip-form', JSON.stringify(completedTripState));

    const { container } = render(
      <TripFormProvider>
        <MainLayout>
          <div>Test children</div>
        </MainLayout>
      </TripFormProvider>
    );

    return { user, container };
  };

  describe('Column Visibility Integration', () => {
    it('should render all three columns by default', async () => {
      renderWithContext();

      // Wait for loading to complete
      await screen.findByTestId('trip-details-section');

      expect(screen.getByTestId('trip-details-section')).toBeInTheDocument();
      expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
      expect(screen.getByTestId('ai-suggestions-section')).toBeInTheDocument();
    });

    it('should show bottom navigation on mobile', async () => {
      renderWithContext();

      // Wait for content to load
      await screen.findByTestId('trip-details-section');

      // Check for navigation
      const navigation = screen.getByRole('navigation', { name: /column visibility controls/i });
      expect(navigation).toBeInTheDocument();

      // Check for all navigation buttons
      expect(screen.getByRole('button', { name: /trip details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /packing checklist/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /suggestions/i })).toBeInTheDocument();
    });

    it('should toggle column visibility when navigation buttons are clicked', async () => {
      const { user } = renderWithContext();

      // Wait for content to load
      await screen.findByTestId('trip-details-section');

      // Initially all sections should be visible
      expect(screen.getByTestId('trip-details-section')).toBeInTheDocument();
      expect(screen.getByTestId('ai-suggestions-section')).toBeInTheDocument();

      // Click suggestions button to hide it
      const suggestionsButton = screen.getByRole('button', { name: /suggestions/i });
      await user.click(suggestionsButton);

      // Suggestions section should be hidden
      expect(screen.queryByTestId('ai-suggestions-section')).not.toBeInTheDocument();

      // Trip details should still be visible
      expect(screen.getByTestId('trip-details-section')).toBeInTheDocument();
    });

    it('should prevent hiding the last visible column', async () => {
      const { user } = renderWithContext();

      // Wait for content to load
      await screen.findByTestId('trip-details-section');

      // Hide trip details and suggestions, leaving only packing checklist
      const tripDetailsButton = screen.getByRole('button', { name: /trip details/i });
      const suggestionsButton = screen.getByRole('button', { name: /suggestions/i });

      await user.click(tripDetailsButton);
      await user.click(suggestionsButton);

      // Only packing checklist should be visible
      expect(screen.queryByTestId('trip-details-section')).not.toBeInTheDocument();
      expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
      expect(screen.queryByTestId('ai-suggestions-section')).not.toBeInTheDocument();

      // Try to hide the last column - should not work
      const packingChecklistButton = screen.getByRole('button', { name: /packing checklist/i });
      await user.click(packingChecklistButton);

      // Packing checklist should still be visible (last column protection)
      expect(screen.getByTestId('packing-list-section')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should add bottom padding for mobile navigation', async () => {
      renderWithContext();

      // Wait for content to load
      const main = await screen.findByRole('main');

      // Should have bottom padding for mobile navigation
      expect(main).toHaveClass('pb-20', 'md:pb-4');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', async () => {
      const { container } = renderWithContext();

      // Wait for content to load
      await screen.findByTestId('trip-details-section');

      await expectNoA11yViolations(container);
    });
  });
});
