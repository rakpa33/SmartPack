import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('App Integration', () => {
  it('renders AppHeader and MainLayout together', () => {
    render(<App />);
    expect(screen.getByText('SmartPack')).toBeInTheDocument();
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
  });

  it('dark mode toggle affects layout', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    document.documentElement.classList.remove('dark');
    fireEvent.click(button);
    expect(document.documentElement).toHaveClass('dark');
    fireEvent.click(button);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('modal opens and closes as expected', () => {
    render(<App />);
    const openBtn = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(openBtn);
    expect(screen.getByText(/Headless UI Modal/i)).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Headless UI Modal/i)).not.toBeInTheDocument();
  });
});
