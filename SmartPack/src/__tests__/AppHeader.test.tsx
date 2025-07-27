import { render, screen } from '@testing-library/react';
import AppHeader from '../components/AppHeader';

describe('AppHeader', () => {
  it('renders the SmartPack title', () => {
    render(<AppHeader />);
    expect(screen.getByText('SmartPack')).toBeInTheDocument();
  });

  it('renders the dark mode toggle button', () => {
    render(<AppHeader />);
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
  });
});
