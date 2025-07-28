import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import { axe } from 'jest-axe';
import MainLayout from '../components/MainLayout';
import '@testing-library/jest-dom';
import { expect, describe, it } from 'vitest';
import { TripFormProvider } from '../hooks/TripFormContext';

describe('MainLayout accessibility', () => {
  it('has no accessibility violations (including color contrast)', async () => {
    const { container } = renderWithProviders(
      <TripFormProvider>
        <MainLayout>
          <div>Test Child</div>
        </MainLayout>
      </TripFormProvider>
    );
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
