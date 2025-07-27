import { render, screen } from '@testing-library/react';
import MainLayout from '../components/MainLayout';
import '@testing-library/jest-dom';

describe('MainLayout', () => {
  it('renders children in the layout', () => {
    render(
      <MainLayout>
        <div data-testid="child">Test Child</div>
      </MainLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders all three layout sections', () => {
    render(<MainLayout>child</MainLayout>);
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });
});
