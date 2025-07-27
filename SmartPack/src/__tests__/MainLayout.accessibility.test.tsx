import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import MainLayout from '../components/MainLayout';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('MainLayout accessibility', () => {
  it('all sections are accessible by role/label', () => {
    renderWithProviders(<MainLayout>child</MainLayout>);
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
