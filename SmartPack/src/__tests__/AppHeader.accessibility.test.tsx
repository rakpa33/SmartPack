import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import AppHeader from '../components/AppHeader';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('AppHeader accessibility', () => {
  it('header is always visible and has correct role', () => {
    renderWithProviders(<AppHeader />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('dark mode toggle is keyboard accessible', () => {
    renderWithProviders(<AppHeader />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    button.focus();
    expect(button).toHaveFocus();
  });
});
