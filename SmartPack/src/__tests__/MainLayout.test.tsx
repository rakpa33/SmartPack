import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import '@testing-library/jest-dom';
import MainLayout from '../components/MainLayout';
import { screen } from '@testing-library/react';
import { TripFormProvider } from '../hooks/TripFormContext';

describe('MainLayout', () => {
  function setup(children: React.ReactNode = null) {
    return renderWithProviders(
      <TripFormProvider>
        <MainLayout>{children}</MainLayout>
      </TripFormProvider>
    );
  }

  it('renders children in the layout', () => {
    setup(<div data-testid="child">Test Child</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders all three layout sections', () => {
    setup('child');
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByTestId('packing-checklist-section')).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
