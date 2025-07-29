/**
 * DarkModeToggle Component Unit Tests
 * 
 * PURPOSE: Tests the dark mode toggle functionality and accessibility
 * 
 * SCOPE - This file should contain:
 * ✅ Toggle button rendering and accessibility attributes
 * ✅ Dark mode state management (localStorage persistence)
 * ✅ Keyboard navigation and interaction testing
 * ✅ Theme switching behavior validation
 * ✅ DOM class manipulation testing (html.dark)
 * ✅ ARIA attributes and semantic HTML validation
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Full app theme integration (belongs in integration tests)
 * ❌ Component styling tests (visual regression testing)
 * ❌ Cross-browser theme testing (belongs in playwright/)
 * ❌ Performance testing for theme switching
 * 
 * DEPENDENCIES:
 * - DarkModeToggle component (primary test target)
 * - localStorage for theme persistence
 * - DOM manipulation for theme class toggling
 * - renderWithProviders for component isolation
 * 
 * MAINTENANCE:
 * - Add tests when new theme options are added
 * - Update when localStorage schema changes
 * - Modify when accessibility requirements change
 * - Review when theme switching logic is enhanced
 * 
 * TESTING PATTERNS:
 * - Tests DOM state changes (document.documentElement.classList)
 * - Validates keyboard accessibility with userEvent
 * - Focuses on component behavior without external dependencies
 * - Uses screen queries for accessibility-first testing
 */

import { renderWithProviders } from '../../tests/testing-utils';
import DarkModeToggle from '../components/DarkModeToggle';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('DarkModeToggle', () => {
  describe('when rendering', () => {
    it('should display toggle button', () => {
      renderWithProviders(<DarkModeToggle />);
      expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
    });

    it('should have appropriate aria-label', () => {
      renderWithProviders(<DarkModeToggle />);
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });

  describe('when user interacts', () => {
    it('should toggle dark mode class on html element', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DarkModeToggle />);
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      document.documentElement.classList.remove('dark');
      await user.click(button);
      expect(document.documentElement).toHaveClass('dark');
      await user.click(button);
      expect(document.documentElement).not.toHaveClass('dark');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DarkModeToggle />);
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      button.focus();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      // Should toggle dark mode (class on html)
      expect(document.documentElement).toHaveClass('dark');
    });
  });
});
