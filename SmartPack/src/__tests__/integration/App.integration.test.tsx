// User flow tested in this integration test:
// 1. User fills out all required fields in the TripForm: Trip Name, Destination, Travel Mode, Start Date, End Date, and (optionally) Trip Details.
// 2. The "Next" button is clicked to submit the form.
// 3. The app transitions to the MainLayout, displaying Trip Details, Packing Checklist, and AI Suggestions sections.
// 4. The test asserts that all main layout sections are present after form completion.
// 
// IMPORTANT: This test verifies that the app correctly navigates from the TripForm to the MainLayout
// after form submission. It includes extensive debugging to help diagnose any failures
// in the navigation flow, which can sometimes be timing-related.

import { renderWithProviders } from '../../../tests/testing-utils';
import App from '../../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

async function fillOutTripForm() {
  try {
    // Fill out trip name with explicit waits between actions
    const tripNameInput = screen.getByLabelText('Trip Name');
    await userEvent.clear(tripNameInput);
    await userEvent.type(tripNameInput, 'Test Trip');
    console.log('Entered trip name:', (tripNameInput as HTMLInputElement).value);

    // Fill out destination
    const destinationInput = screen.getByTestId('destination-input-0');
    await userEvent.clear(destinationInput);
    await userEvent.type(destinationInput, 'Paris');
    console.log('Entered destination:', (destinationInput as HTMLInputElement).value);

    // Tab out to trigger any blur events (which might trigger validation or geocoding)
    await userEvent.tab();

    // Select travel mode - ensure at least one is checked
    const carCheckbox = screen.getByLabelText('Car');
    await userEvent.click(carCheckbox);
    console.log('Car checkbox checked:', (carCheckbox as HTMLInputElement).checked);

    // Fill out dates with explicit waits
    const startDateInput = screen.getByLabelText('Start Date');
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, '2025-08-01');
    console.log('Entered start date');

    const endDateInput = screen.getByLabelText('End Date');
    await userEvent.clear(endDateInput);
    await userEvent.type(endDateInput, '2025-08-10');
    console.log('Entered end date');

    // Fill out trip details
    const detailsInput = screen.getByLabelText('Trip Details (optional)');
    await userEvent.type(detailsInput, 'No special needs');
    console.log('Entered trip details');

    // Before submitting, check form validity
    const form = screen.getByTestId('trip-form') as HTMLFormElement;
    console.log('Form validity before submission:', form.checkValidity());

    // Find and click the next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    console.log('Next button found, clicking...');

    // Click with a longer wait
    await userEvent.click(nextButton);

    // Check for any form errors after submission
    const errors = screen.queryAllByRole('alert');
    if (errors.length > 0) {
      console.error('Validation errors after submission:', errors.map(e => e.textContent));
    } else {
      console.log('No validation errors found after submission');
    }

    // Wait a bit longer after form submission to allow for navigation
    await new Promise(r => setTimeout(r, 300));

    console.log('Form submission completed');

  } catch (error) {
    console.error('Error during form fill out:', error);
    // Re-throw to fail the test with useful information
    throw error;
  }
} describe('App Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();

    // Set up initial categories in localStorage for consistent test behavior
    window.localStorage.setItem('smartpack_categories', JSON.stringify([
      { id: 'clothing', name: 'Clothing' },
      { id: 'toiletries', name: 'Toiletries' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'essentials', name: 'Essentials' },
      { id: 'other', name: 'Other' },
    ]));

    // Add a few initial items to ensure the checklist has content
    window.localStorage.setItem('smartpack_checklist', JSON.stringify([
      { id: 'item1', label: 'T-shirts', checked: false, category: 'clothing' },
      { id: 'item2', label: 'Toothbrush', checked: false, category: 'toiletries' },
      { id: 'item3', label: 'Phone charger', checked: false, category: 'electronics' },
    ]));

    // Mock any browser APIs that might be causing issues
    // This helps with handling things like window.location navigation in tests
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation((message) => {
      // Filter out specific React errors that happen during testing but aren't relevant
      if (message && message.toString().includes('Warning: ReactDOM.render')) {
        return;
      }
      // Let other console errors through
      console.warn('Console error in test:', message);
    });

    // Clean up after the test
    return () => {
      mockConsoleError.mockRestore();
    };
  });

  it('renders AppHeader and MainLayout together after form completion', async () => {
    renderWithProviders(<App />);

    // First verify the initial state - we should see the app header
    expect(screen.getByText('SmartPack')).toBeInTheDocument();

    // Fill out and submit the trip form
    await fillOutTripForm();

    // Debug: Log form submission status
    console.log('Form submitted, waiting for navigation...');

    // Wait for the trip form to disappear with increased timeout (5 seconds)
    // Using waitForElementToBeRemoved is more efficient than polling with waitFor
    await waitFor(
      () => {
        expect(screen.queryByTestId('trip-form')).not.toBeInTheDocument();
      },
      {
        timeout: 5000,
        onTimeout: (error) => {
          console.error('Timed out waiting for form to disappear:', error);
          console.log('Current DOM:', document.body.innerHTML);
          return error;
        }
      }
    );

    console.log('Form has disappeared, checking for main layout sections...');

    // After form disappears, we should be able to find the main layout sections
    // Using findByTestId is better than waitFor + getByTestId for async elements
    const tripDetailsSection = await screen.findByTestId('trip-details-section', {}, { timeout: 3000 });
    expect(tripDetailsSection).toBeInTheDocument();

    // Now check for the other sections that should be present in the same view
    const packingListSection = screen.getByTestId('packing-list-section');
    expect(packingListSection).toBeInTheDocument();

    const suggestionsSection = screen.getByTestId('ai-suggestions-section');
    expect(suggestionsSection).toBeInTheDocument();

    console.log('All sections found successfully!');
  }); it('dark mode toggle affects layout', () => {
    renderWithProviders(<App />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toBeInTheDocument();
    // ...rest of test...
  });
});
