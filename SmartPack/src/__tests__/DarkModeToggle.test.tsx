import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import DarkModeToggle from '../components/DarkModeToggle';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('DarkModeToggle', () => {
  it('renders the toggle button', () => {
    renderWithProviders(<DarkModeToggle />);
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
  });

  it('toggles dark mode class on html element', () => {
    renderWithProviders(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    document.documentElement.classList.remove('dark');
    fireEvent.click(button);
    expect(document.documentElement).toHaveClass('dark');
    fireEvent.click(button);
    expect(document.documentElement).not.toHaveClass('dark');
  });
});
