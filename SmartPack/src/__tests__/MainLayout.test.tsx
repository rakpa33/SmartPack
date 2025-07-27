import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import '@testing-library/jest-dom';
import MainLayout from '../components/MainLayout';
import { screen } from '@testing-library/react';

describe('MainLayout', () => {
  it('renders children in the layout', () => {
    renderWithProviders(
      <MainLayout>
        <div data-testid="child">Test Child</div>
      </MainLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders all three layout sections', () => {
    renderWithProviders(<MainLayout>child</MainLayout>);
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByTestId('packing-checklist-section')).toBeInTheDocument();
    expect(screen.getByText(/Clothing/i)).toBeInTheDocument(); // Category heading
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
