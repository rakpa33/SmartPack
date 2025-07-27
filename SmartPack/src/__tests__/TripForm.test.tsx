import React from 'react';
import { renderWithProviders } from '../../tests/testing-utils';
import { TripFormProvider } from '../hooks/TripFormContext';
import { TripForm } from '../components/TripForm';
import { screen, fireEvent } from '@testing-library/react';

describe('TripForm unit/integration', () => {
  function setup() {
    return renderWithProviders(
      <TripFormProvider>
        <TripForm />
      </TripFormProvider>
    );
  }

  it('renders all fields and labels', () => {
    setup();
    expect(screen.getByLabelText(/Trip Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Destination/i)).toBeInTheDocument();
    expect(screen.getByText(/Travel Modes/i)).toBeInTheDocument();
  });

  it('validates required fields and shows errors', async () => {
    setup();
    fireEvent.blur(screen.getByLabelText(/Trip Name/i));
    fireEvent.blur(screen.getByLabelText(/Start Date/i));
    fireEvent.blur(screen.getByLabelText(/End Date/i));
    fireEvent.blur(screen.getAllByLabelText(/Destination/i)[0]);
    fireEvent.click(screen.getByText(/Next/i));
    // Wait for error messages to appear
    expect(screen.getByText(/Trip name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Start date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/End date is required/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Destination is required\./i).length).toBeGreaterThan(0);
    // Wait for travel mode error
    expect(await screen.findByText(/Select at least one travel mode/i)).toBeInTheDocument();
  });

  it('validates city name (invalid city)', () => {
    setup();
    const destInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(destInput, { target: { value: 'NotARealCity' } });
    fireEvent.blur(destInput);
    expect(screen.getByText(/Enter a valid city/i)).toBeInTheDocument();
  });

  it('validates date logic (past and end before start)', () => {
    setup();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    const startInput = screen.getByLabelText(/Start Date/i);
    const endInput = screen.getByLabelText(/End Date/i);
    fireEvent.change(startInput, { target: { value: yesterday.toISOString().slice(0, 10) } });
    fireEvent.blur(startInput);
    expect(screen.getByText(/Start date cannot be in the past/i)).toBeInTheDocument();
    fireEvent.change(startInput, { target: { value: tomorrow.toISOString().slice(0, 10) } });
    fireEvent.change(endInput, { target: { value: today.toISOString().slice(0, 10) } });
    fireEvent.blur(endInput);
    expect(screen.getByText(/End date cannot be before start date/i)).toBeInTheDocument();
    // Also test valid case
    fireEvent.change(endInput, { target: { value: dayAfterTomorrow.toISOString().slice(0, 10) } });
    fireEvent.blur(endInput);
    expect(screen.queryByText(/End date cannot be before start date/i)).not.toBeInTheDocument();
  });

  it('allows adding/removing destinations', () => {
    setup();
    fireEvent.click(screen.getByText(/Add Destination/i));
    expect(screen.getAllByTestId(/destination-input-/i).length).toBeGreaterThan(1);
    fireEvent.click(screen.getAllByLabelText(/Remove destination/i)[0]);
    expect(screen.getAllByTestId(/destination-input-/i).length).toBe(1); // Only 1 destination input left
  });

  it('submits when all fields are valid', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Trip Name/i), { target: { value: 'My Trip' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'New York' } });
    fireEvent.click(screen.getByLabelText(/Car/i));
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: tomorrow.toISOString().slice(0, 10) } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: dayAfterTomorrow.toISOString().slice(0, 10) } });
    fireEvent.click(screen.getByText(/Next/i));
    // Should not show errors
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Enter a valid city/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cannot be in the past/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cannot be before start/i)).not.toBeInTheDocument();
  });
});
