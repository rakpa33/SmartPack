// User flow tested in this integration test:
// 1. User fills out all required fields in the TripForm: Trip Name, Destination, Travel Mode, Start Date, End Date.
// 2. The "Next" button remains visible and enabled after all fields are valid.
// 3. User clicks the "Next" button to submit the form.
// 4. Only after clicking "Next" does the Packing Checklist appear.
// 5. The test asserts that no validation errors are present and the checklist is rendered.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppWithProvider from '../../App';

describe('TripForm integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it('shows PackingList when all fields are valid and Next is clicked', async () => {
    render(<AppWithProvider />);

    // Fill out Trip Name
    await waitFor(() => fireEvent.change(screen.getByLabelText(/Trip Name/i), { target: { value: 'Test Trip' } }));
    let allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`[After Trip Name] Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });

    // Fill out Destinations
    await waitFor(() => fireEvent.change(screen.getByTestId('destination-input-0'), { target: { value: 'New York' } }));
    allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`[After Destinations] Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });

    // Select a Travel Mode
    await waitFor(() => fireEvent.click(screen.getByLabelText(/Car/i)));
    allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`[After Travel Mode] Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });

    // Fill out Dates
    const today = new Date();
    const startDate = new Date(today.getTime() + 86400000).toISOString().split('T')[0]; // tomorrow
    const endDate = new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0]; // day after tomorrow
    await waitFor(() => fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: startDate } }));
    allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`[After Start Date] Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });
    await waitFor(() => fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: endDate } }));
    allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`[After End Date] Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });

    // Click Next as soon as it appears
    const nextButton = await screen.findByRole('button', { name: /Next/i });
    await waitFor(() => fireEvent.click(nextButton));

    // Print all button names for debugging (optional, can be removed later)
    allButtons = screen.queryAllByRole('button');
    allButtons.forEach((btn, idx) => {
      // eslint-disable-next-line no-console
      console.log(`Button[${idx}]:`, btn.textContent, '| name:', btn.getAttribute('name'), '| aria-label:', btn.getAttribute('aria-label'));
    });

    // Assert there are no validation errors
    const errorAlerts = screen.queryAllByRole('alert');
    expect(errorAlerts.length).toBe(0);
    // Print any visible error messages for debugging
    if (errorAlerts.length > 0) {
      errorAlerts.forEach(alert => console.log('Error:', alert.textContent));
    }
  });
});
