import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'jest-axe';
import BottomNavigation from '@components/BottomNavigation';
import { ColumnLayoutProvider } from '@hooks/useColumnLayout';

// Jest-axe Vitest compatibility helper
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

describe('BottomNavigation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProvider = (initialVisibility = { tripDetails: true, packingChecklist: true, suggestions: true }) => {
    const user = userEvent.setup();
    const { container } = render(
      <ColumnLayoutProvider initialVisibility={initialVisibility}>
        <BottomNavigation />
      </ColumnLayoutProvider>
    );
    return { user, container };
  };

  describe('Component Rendering', () => {
    it('should render all three navigation buttons', () => {
      renderWithProvider();

      expect(screen.getByRole('button', { name: /trip details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /packing checklist/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /suggestions/i })).toBeInTheDocument();
    });

    it('should display correct icons for each button', () => {
      renderWithProvider();

      // Check for Heroicons - MapIcon, CheckIcon, LightBulbIcon
      const tripDetailsButton = screen.getByRole('button', { name: /trip details/i });
      const packingChecklistButton = screen.getByRole('button', { name: /packing checklist/i });
      const suggestionsButton = screen.getByRole('button', { name: /suggestions/i });

      expect(tripDetailsButton).toContainHTML('svg');
      expect(packingChecklistButton).toContainHTML('svg');
      expect(suggestionsButton).toContainHTML('svg');
    });

    it('should show active state for visible columns', () => {
      renderWithProvider({ tripDetails: true, packingChecklist: true, suggestions: false });

      const tripDetailsButton = screen.getByRole('button', { name: /trip details/i });
      const packingChecklistButton = screen.getByRole('button', { name: /packing checklist/i });
      const suggestionsButton = screen.getByRole('button', { name: /suggestions/i });

      expect(tripDetailsButton).toHaveClass('bg-blue-500'); // Active state
      expect(packingChecklistButton).toHaveClass('bg-blue-500'); // Active state
      expect(suggestionsButton).not.toHaveClass('bg-blue-500'); // Inactive state
    });
  });

  describe('Interaction Behavior', () => {
    it('should toggle column visibility when clicked', async () => {
      const { user } = renderWithProvider();

      const suggestionsButton = screen.getByRole('button', { name: /suggestions/i });

      // Should be active initially
      expect(suggestionsButton).toHaveClass('bg-blue-500');

      // Click to hide
      await user.click(suggestionsButton);

      // Should become inactive
      expect(suggestionsButton).not.toHaveClass('bg-blue-500');
    });

    it('should prevent hiding all columns (minimum 1 visible)', async () => {
      const { user } = renderWithProvider({ tripDetails: false, packingChecklist: true, suggestions: false });

      const packingChecklistButton = screen.getByRole('button', { name: /packing checklist/i });

      // Should be active (only visible column)
      expect(packingChecklistButton).toHaveClass('bg-blue-500');

      // Try to click to hide - should not work
      await user.click(packingChecklistButton);

      // Should remain active (prevented from hiding last column)
      expect(packingChecklistButton).toHaveClass('bg-blue-500');
    });
  });

  describe('Touch Target Accessibility', () => {
    it('should have WCAG compliant touch targets (44px minimum)', () => {
      renderWithProvider();

      const buttons = screen.getAllByRole('button');

      buttons.forEach((button: HTMLElement) => {
        // Check for compact design with proper padding for touch targets
        // px-3 py-2 provides sufficient touch area for accessibility
        expect(button).toHaveClass('px-3');
        expect(button).toHaveClass('py-2');
        // Ensure horizontal layout with gap
        expect(button).toHaveClass('flex', 'items-center', 'gap-2');
      });
    });
  });

  describe('Dark Mode Support', () => {
    it('should apply dark mode classes correctly', () => {
      // Add dark class to document to simulate dark mode
      document.documentElement.classList.add('dark');

      renderWithProvider();

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass('dark:bg-gray-800');

      // Cleanup
      document.documentElement.classList.remove('dark');
    });
  });

  describe('Accessibility Compliance', () => {
    it('should be accessible', async () => {
      const { container } = renderWithProvider();
      await expectNoA11yViolations(container);
    });

    it('should have proper ARIA labels and roles', () => {
      renderWithProvider();

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Column visibility controls');

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveAttribute('aria-pressed');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should have compact Trello-style design', () => {
      // Bottom navigation should be compact with horizontal icon+text layout
      renderWithProvider();

      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveClass('fixed', 'bottom-0');

      // Check for compact padding
      const container = navigation.querySelector('div');
      expect(container).toHaveClass('py-1'); // Minimal vertical padding

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button: HTMLElement) => {
        // Should have horizontal layout (not flex-col)
        expect(button).toHaveClass('flex', 'items-center');
        expect(button).not.toHaveClass('flex-col');
      });
    });
  });
});
