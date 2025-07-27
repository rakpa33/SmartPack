import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../components/DarkModeToggle';
import '@testing-library/jest-dom';

describe('DarkModeToggle accessibility', () => {
  it('is keyboard accessible', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    // Should toggle dark mode (class on html)
    expect(document.documentElement).toHaveClass('dark');
  });

  it('has appropriate aria-label', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
  });
});
