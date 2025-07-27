import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import DarkModeToggle from '../components/DarkModeToggle';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('DarkModeToggle accessibility', () => {
  it('is keyboard accessible', () => {
    renderWithProviders(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    // Should toggle dark mode (class on html)
    expect(document.documentElement).toHaveClass('dark');
  });

  it('has appropriate aria-label', () => {
    renderWithProviders(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
  });
});
