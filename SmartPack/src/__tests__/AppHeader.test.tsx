/**
 * AppHeader Component Unit Tests
 * 
 * PURPOSE: Tests the main application header component and navigation elements
 * 
 * SCOPE - This file should contain:
 * ✅ Header rendering and basic structure
 * ✅ Application title/logo display
 * ✅ Navigation elements and accessibility
 * ✅ Header responsiveness and layout
 * ✅ Any header-specific interactive elements
 * ✅ Semantic HTML structure validation
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Full navigation workflow testing (belongs in integration tests)
 * ❌ Dark mode toggle testing (belongs in DarkModeToggle.test.tsx)
 * ❌ Cross-browser header testing (belongs in playwright/)
 * ❌ Performance testing for header rendering
 * 
 * DEPENDENCIES:
 * - AppHeader component (primary test target)
 * - renderWithProviders for component isolation
 * - No external service dependencies
 * 
 * MAINTENANCE:
 * - Add tests when new header elements are added
 * - Update when navigation structure changes
 * - Modify when branding or title changes
 * - Review when accessibility requirements change
 * 
 * TESTING PATTERNS:
 * - Tests component rendering in isolation
 * - Validates semantic HTML and accessibility
 * - Focuses on static content and structure
 * - Uses screen queries for accessibility-first testing
 */

import { renderWithProviders } from '../../tests/testing-utils';
import AppHeader from '../AppHeader';
import { screen } from '@testing-library/react';

describe('AppHeader', () => {
  describe('when rendering', () => {
    it('should render the SmartPack title', () => {
      renderWithProviders(<AppHeader />);
      expect(screen.getByText('SmartPack')).toBeInTheDocument();
    });

    it('should render the dark mode toggle button', () => {
      renderWithProviders(<AppHeader />);
      expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
    });

    it('should have header with correct banner role', () => {
      renderWithProviders(<AppHeader />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have keyboard accessible dark mode toggle', () => {
      renderWithProviders(<AppHeader />);
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
