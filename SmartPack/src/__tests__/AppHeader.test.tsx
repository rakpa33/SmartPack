import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import AppHeader from '../components/AppHeader';
import { screen } from '@testing-library/react';

describe('AppHeader', () => {
  it('renders the SmartPack title', () => {
    renderWithProviders(<AppHeader />);
    expect(screen.getByText('SmartPack')).toBeInTheDocument();
  });

  it('renders the dark mode toggle button', () => {
    renderWithProviders(<AppHeader />);
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
  });
});
