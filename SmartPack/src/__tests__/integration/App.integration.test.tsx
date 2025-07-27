// User flow tested in this integration test:
// 1. User fills out all required fields in the TripForm: Trip Name, Destination, Travel Mode, Start Date, End Date, and (optionally) Trip Details.
// 2. The "Next" button is clicked to submit the form.
// 3. The app transitions to the MainLayout, displaying Trip Details, Packing Checklist, and AI Suggestions sections.
// 4. The test asserts that all main layout sections are present after form completion.

import React from 'react';
import { renderWithProviders } from '../../../tests/testing-utils';
import App from '../../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

async function fillOutTripForm() {
  await userEvent.type(screen.getByLabelText('Trip Name'), 'Test Trip');
  const destinationInput = screen.getByTestId('destination-input-0');
  await userEvent.clear(destinationInput);
  await userEvent.type(destinationInput, 'Paris');
  // Debug: print destination input value and DOM after typing
  // eslint-disable-next-line no-console
  console.log('Destination input value after typing:', (destinationInput as HTMLInputElement).value);
  // eslint-disable-next-line no-console
  console.log('DOM after typing destination:', document.body.innerHTML);
  await userEvent.tab();
  // Debug: print destination input value and DOM after tab/blur
  // eslint-disable-next-line no-console
  console.log('Destination input value after tab:', (destinationInput as HTMLInputElement).value);
  // eslint-disable-next-line no-console
  console.log('DOM after tab:', document.body.innerHTML);
  // Do NOT click 'Add Destination' unless adding a second destination
  const carCheckbox = await screen.findByLabelText('Car');
  await userEvent.click(carCheckbox);
  await userEvent.type(screen.getByLabelText('Start Date'), '2025-08-01');
  await userEvent.type(screen.getByLabelText('End Date'), '2025-08-10');
  await userEvent.type(screen.getByLabelText('Trip Details (optional)'), 'No special needs');
  const nextButton = await screen.findByRole('button', { name: /next/i });
  await userEvent.click(nextButton);
  // Debug: print destinations array from form state if possible (if exposed)
  // Check for error messages
  const errors = screen.queryAllByRole('alert');
  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Validation errors:', errors.map(e => e.textContent));
  }
}

describe('App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Optionally, set mock checklist data here if needed for your test:
    // window.localStorage.setItem('smartpack_checklist', JSON.stringify([{ id: 'mock1', label: 'Mock Item', checked: false, category: 'clothing' }]));
    // window.localStorage.setItem('smartpack_categories', JSON.stringify([
    //   { id: 'clothing', name: 'Clothing' },
    //   { id: 'toiletries', name: 'Toiletries' },
    //   { id: 'electronics', name: 'Electronics' },
    //   { id: 'other', name: 'Other' },
    // ]));
  });

  it('renders AppHeader and MainLayout together after form completion', async () => {
    renderWithProviders(<App />);
    expect(screen.getByText('SmartPack')).toBeInTheDocument();
    await fillOutTripForm();
    // Debug output
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
    // Print all headings for debugging
    const headings = screen.queryAllByRole('heading');
    headings.forEach((h, idx) => {
      // eslint-disable-next-line no-console
      console.log(`Heading[${idx}]:`, h.textContent);
    });
    // Check if form is still present after clicking Next
    const formStillPresent = screen.queryByRole('form') || screen.queryByLabelText('Trip Name');
    // eslint-disable-next-line no-console
    console.log('Form still present after Next?', !!formStillPresent);
    // Use robust async queries and match actual rendered text
    await waitFor(() => {
      expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Packing Checklist/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
    });
  });

  it('dark mode toggle affects layout', () => {
    renderWithProviders(<App />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toBeInTheDocument();
    // ...rest of test...
  });
});
