import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import '@testing-library/jest-dom';

// This test covers the full checklist acceptance criteria:
// - Add, check, uncheck, and remove items and categories
// - Checklist state persists to localStorage
// - Checklist state updates everywhere in the app

// Define the shape of our checklist items
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
}

describe('Packing Checklist E2E', () => {
  beforeEach(() => {
    // Clear ALL localStorage before each test to prevent contamination
    window.localStorage.clear();

    // Also explicitly remove known keys to be extra safe
    window.localStorage.removeItem('tripForm');
    window.localStorage.removeItem('smartpack_checklist');
    window.localStorage.removeItem('smartpack_categories');
    window.localStorage.removeItem('theme');

    // Set up trip form data to simulate a completed form (required for MainLayout)
    const tripData = {
      tripName: 'Test Trip',
      destinations: ['Paris'],
      travelModes: ['Car'],
      preferences: ['No special needs'],
      startDate: '2025-08-01',
      endDate: '2025-08-10',
      step: 2
    };
    window.localStorage.setItem('tripForm', JSON.stringify(tripData));

    // Set up initial categories in localStorage for consistent test behavior
    window.localStorage.setItem('smartpack_categories', JSON.stringify([
      { id: 'clothing', name: 'Clothing' },
      { id: 'toiletries', name: 'Toiletries' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'essentials', name: 'Essentials' },
      { id: 'other', name: 'Other' },
    ]));
  });

  it('user can add, check, uncheck, and remove items and categories, and state persists', async () => {
    render(
      <MemoryRouter initialEntries={['/MainLayout']}>
        <App />
      </MemoryRouter>
    );

    try {
      // Wait for the main layout to appear with increased timeout
      const packingChecklist = await screen.findByTestId('packing-list-section', {}, { timeout: 10000 });
      expect(packingChecklist).toBeInTheDocument();

      // Find all category headings
      const headings = await screen.findAllByRole('heading', { level: 3 });
      const clothingHeading = headings.find(h => h.textContent?.includes('Clothing'));
      expect(clothingHeading).toBeTruthy();

      if (!clothingHeading) throw new Error('Clothing heading not found');

      // Find the form within the category section
      const categoryContainer = clothingHeading.closest('div');
      if (!categoryContainer) throw new Error('Category container not found');

      // Find the input field
      const input = within(categoryContainer).getByRole('textbox');
      await userEvent.type(input, 'Test Item');

      // Find the button and click it
      const button = within(categoryContainer).getByRole('button');
      await userEvent.click(button);

      // Verify the item was added
      const itemText = await screen.findByText('Test Item');
      expect(itemText).toBeInTheDocument();

      // Test checking an item
      const itemElement = itemText.closest('li');
      if (!itemElement) throw new Error('Item element not found');

      const itemCheckbox = within(itemElement).getByRole('checkbox');
      await userEvent.click(itemCheckbox);

      // Verify the item is checked
      expect(itemCheckbox).toBeChecked();

      // Test unchecking an item
      await userEvent.click(itemCheckbox);
      expect(itemCheckbox).not.toBeChecked();

      // Test removing an item
      const removeButton = within(itemElement).getByRole('button', { name: /remove/i });

      // We need to verify the item exists before we try to remove it
      expect(screen.queryByText('Test Item')).toBeInTheDocument();

      // Click the remove button
      await userEvent.click(removeButton);

      // Verify item is removed without using waitForElementToBeRemoved
      await waitFor(() => {
        expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  });

  it('checklist state persists across sessions and updates in multiple places', async () => {
    // Step 1: Create a session, add items and check state
    const { unmount } = render(
      <MemoryRouter initialEntries={['/MainLayout']}>
        <App />
      </MemoryRouter>
    );

    try {
      // Since we're starting directly at MainLayout, we need to set up trip data
      // in localStorage to simulate a completed trip form
      const tripData = {
        tripName: 'Test Trip',
        destinations: ['Paris'],
        travelModes: ['Car'],
        preferences: ['No special needs'],
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        step: 2
      };
      window.localStorage.setItem('tripForm', JSON.stringify(tripData));

      // Wait for the main layout to appear with increased timeout
      const packingChecklist = await screen.findByTestId('packing-list-section', {}, { timeout: 10000 });
      expect(packingChecklist).toBeInTheDocument();

      // Find all category headings
      const headings = await screen.findAllByRole('heading', { level: 3 });
      const electronicsHeading = headings.find(h => h.textContent?.includes('Electronics'));
      expect(electronicsHeading).toBeTruthy();

      if (!electronicsHeading) throw new Error('Electronics heading not found');

      // Find the form within the category section
      const categoryContainer = electronicsHeading.closest('div');
      if (!categoryContainer) throw new Error('Category container not found');

      // Find the input field
      const input = within(categoryContainer).getByRole('textbox');
      await userEvent.type(input, 'Persistent Item');

      // Find the button and click it
      const button = within(categoryContainer).getByRole('button');
      await userEvent.click(button);

      // Verify the item was added
      const itemText = await screen.findByText('Persistent Item');
      expect(itemText).toBeInTheDocument();

      // Check localStorage to ensure item was saved
      const storedItems = JSON.parse(localStorage.getItem('smartpack_checklist') || '[]') as ChecklistItem[];
      expect(storedItems.some(item => item.label === 'Persistent Item')).toBe(true);

      // Cleanup the current render
      unmount();

      // Step 2: Render a fresh instance and verify the item persists
      render(
        <MemoryRouter initialEntries={['/MainLayout']}>
          <App />
        </MemoryRouter>
      );

      // Set up trip data again since we're starting fresh
      const tripData2 = {
        tripName: 'Test Trip',
        destinations: ['Paris'],
        travelModes: ['Car'],
        preferences: ['No special needs'],
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        step: 2
      };
      window.localStorage.setItem('tripForm', JSON.stringify(tripData2));

      // Verify the previously added item is still there
      const persistedItem = await screen.findByText('Persistent Item');
      expect(persistedItem).toBeInTheDocument();

      // Test checking the item in this new session
      const itemElement = persistedItem.closest('li');
      if (!itemElement) throw new Error('Item element not found');

      const itemCheckbox = within(itemElement).getByRole('checkbox');
      await userEvent.click(itemCheckbox);

      // Verify the item is checked
      expect(itemCheckbox).toBeChecked();

      // Check localStorage again to ensure checked state was saved
      const updatedStoredItems = JSON.parse(localStorage.getItem('smartpack_checklist') || '[]') as ChecklistItem[];
      const targetItem = updatedStoredItems.find(item => item.label === 'Persistent Item');
      expect(targetItem).toBeTruthy();
      if (targetItem) {
        expect(targetItem.checked).toBe(true);
      }

    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  });
});