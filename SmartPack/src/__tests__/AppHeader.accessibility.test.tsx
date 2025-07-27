import { render, screen } from '@testing-library/react';
import AppHeader from '../components/AppHeader';
import '@testing-library/jest-dom';

describe('AppHeader accessibility', () => {
  it('header is always visible and has correct role', () => {
    render(<AppHeader />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('dark mode toggle is keyboard accessible', () => {
    render(<AppHeader />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    button.focus();
    expect(button).toHaveFocus();
  });
});
