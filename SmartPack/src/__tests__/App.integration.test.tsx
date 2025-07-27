import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App'; // This is the default export, which is AppWithProvider
import '@testing-library/jest-dom';

function fillOutTripForm() {
  fireEvent.change(screen.getByLabelText('Trip Name'), { target: { value: 'Test Trip' } });
  fireEvent.change(screen.getByTestId('destination-input-0'), { target: { value: 'Paris' } });
  const carCheckbox = screen.getByLabelText('Car');
  fireEvent.click(carCheckbox);
  fireEvent.blur(carCheckbox); // Mark travelModes as touched
  fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2025-08-01' } });
  fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2025-08-10' } });
  fireEvent.change(screen.getByLabelText('Trip Details (optional)'), { target: { value: 'No special needs' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  // Check for error messages
  const errors = screen.queryAllByRole('alert');
  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Validation errors:', errors.map(e => e.textContent));
  }
}

describe('App Integration', () => {
  it('renders AppHeader and MainLayout together after form completion', () => {
    render(<App />);
    expect(screen.getByText('SmartPack')).toBeInTheDocument();
    fillOutTripForm();
    // Debug output
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
    expect(screen.getByText('Trip Details (placeholder)')).toBeInTheDocument();
    expect(screen.getByText('Packing Checklist (placeholder)')).toBeInTheDocument();
    expect(screen.getByText('AI Suggestions (placeholder)')).toBeInTheDocument();
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

  it('modal opens and closes as expected after form completion', () => {
    render(<App />);
    fillOutTripForm();
    const openBtn = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(openBtn);
    expect(screen.getByText(/Headless UI Modal/i)).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Headless UI Modal/i)).not.toBeInTheDocument();
  });
});
