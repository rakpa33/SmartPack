/**
 * Pattern 6 Investigation - Mock Data vs Application Default Data
 * 
 * PURPOSE: Investigate why mocks are not being invoked correctly in integration tests
 * 
 * PATTERN DESCRIPTION:
 * - Tests expect mock data ("6 pairs underwear") 
 * - Application loads different data ("2 pairs of underwear")
 * - Issue: Mock functions not being invoked in correct component context
 * 
 * ROOT CAUSE INVESTIGATION:
 * 1. Check mock setup and invocation
 * 2. Verify component data flow
 * 3. Identify where default/fallback data originates
 * 4. Fix mock timing and context issues
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testing-utils';
import App from '../../App';

// Mock the API service
vi.mock('../../services/apiService', () => ({
  generatePackingList: vi.fn(),
  generateAISuggestions: vi.fn(),
  checkApiHealth: vi.fn().mockResolvedValue(true)
}));

// Mock weather and geocoding utilities  
vi.mock('../../utils/weather', () => ({
  fetchWeather: vi.fn().mockResolvedValue({
    temperature: 25,
    weathercode: 1,
    summary: 'Mainly clear'
  })
}));

vi.mock('../../utils/geocode', () => ({
  geocodeCity: vi.fn().mockResolvedValue({
    lat: 48.8566,
    lon: 2.3522,
    display_name: 'Paris, Ile-de-France, Metropolitan France, France'
  })
}));

// Import the mocked function for setup
import { generatePackingList } from '../../services/apiService';

// Create a typed mock for the function
const mockGeneratePackingList = vi.mocked(generatePackingList);

describe('Pattern 6 Investigation - Mock Data vs Application Default Data', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should verify mock is called and returns expected data', async () => {
    const user = userEvent.setup();

    // Set up the mock with very specific data
    const mockResponse = {
      checklist: [
        { id: '1', text: 'MOCK: 6 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'MOCK: Test item', category: 'test', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['MOCK: Test suggestion']
    };

    mockGeneratePackingList.mockResolvedValueOnce(mockResponse);

    // Set up spy to track calls
    const mockSpy = vi.spyOn(console, 'log');

    renderWithProviders(<App />, { initialEntries: ['/'] });

    // Fill basic form data
    await user.type(screen.getByLabelText(/trip name/i), 'Test Trip');
    await user.type(screen.getByTestId('destination-input-0'), 'Paris, France');
    await user.type(screen.getByLabelText(/start date/i), '2025-08-01');
    await user.type(screen.getByLabelText(/end date/i), '2025-08-04');
    await user.click(screen.getByLabelText(/plane/i));
    await user.click(screen.getByText(/next/i));

    // Wait for navigation to main layout
    await waitFor(() => {
      expect(screen.getByText(/trip details/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Generate packing list
    const generateButton = screen.getByRole('button', { name: /generate smart packing list/i });
    await user.click(generateButton);

    // Check if mock was called
    console.log('Mock call count:', mockGeneratePackingList.mock.calls.length);
    console.log('Mock calls:', mockGeneratePackingList.mock.calls);

    // Wait for the result and check what actually appears
    await waitFor(() => {
      expect(mockGeneratePackingList).toHaveBeenCalled();
    }, { timeout: 10000 });

    // Check what data actually appears in the UI
    const allText = screen.getByRole('main').textContent;
    console.log('UI content:', allText);

    // Look for our mock data specifically
    await waitFor(() => {
      const mockText = screen.queryByText(/MOCK: 6 pairs underwear/);
      if (mockText) {
        console.log('✅ Found mock data in UI');
      } else {
        console.log('❌ Mock data not found in UI');
        console.log('Available items:', screen.getAllByRole('listitem').map((item: HTMLElement) => item.textContent));
      }
    }, { timeout: 5000 });

    // Restore console spy
    mockSpy.mockRestore();
  });
});
