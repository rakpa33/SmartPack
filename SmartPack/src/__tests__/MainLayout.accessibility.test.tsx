import { render, screen } from '@testing-library/react';
import MainLayout from '../components/MainLayout';
import '@testing-library/jest-dom';

describe('MainLayout accessibility', () => {
  it('all sections are accessible by role/label', () => {
    render(<MainLayout>child</MainLayout>);
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
