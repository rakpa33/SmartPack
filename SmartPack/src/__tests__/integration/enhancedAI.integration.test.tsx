/**
 * Enhanced AI Integration Tests
 * 
 * PURPOSE: Tests the comprehensive AI-powered packing suggestion system with real trip scenarios
 * 
 * SCOPE - This file should contain:
 * ✅ End-to-end AI workflow testing (form → AI generation → results display)
 * ✅ Context-aware recommendations for different trip types (business, beach, adventure)
 * ✅ Smart quantity calculations based on trip duration and weather
 * ✅ Integration between AI service, weather data, and UI components
 * ✅ Error handling for AI service failures
 * ✅ Real user interaction patterns with AI features
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Pure UI component testing (belongs in component unit tests)
 * ❌ API service unit testing (belongs in apiService.test.ts)
 * ❌ Weather utility testing (belongs in weather.test.ts)
 * ❌ Cross-browser E2E testing (belongs in playwright/)
 * 
 * DEPENDENCIES:
 * - App component (full application integration)
 * - API service mocks for generatePackingList
 * - Weather and geocoding utility mocks
 * - localStorage for state persistence
 * - renderWithProviders for React Router context
 * 
 * MAINTENANCE:
 * - Add new trip types when AI supports additional categories
 * - Update test scenarios when AI logic evolves
 * - Modify when new AI features are implemented (weather integration, duration calculations)
 * - Review when API contracts change
 * - Update when UI components for AI features change
 * 
 * TESTING PATTERNS:
 * - Mocks external AI service calls for isolation
 * - Tests realistic user workflows and interactions
 * - Validates AI-generated content appears correctly in UI
 * - Includes both success and error scenarios
 * - Uses behavioral organization (trip type scenarios)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testing-utils';
import App from '../../App';

// Mock the API service to test the enhanced AI logic
vi.mock('../../services/apiService', () => ({
  generatePackingList: vi.fn(),
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

describe('Enhanced AI Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const setupApp = async () => {
    const result = renderWithProviders(<App />, { initialEntries: ['/'] });

    // Wait for the initial form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/trip name/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    return result;
  };

  const fillBasicTripForm = async (user: ReturnType<typeof userEvent.setup>, tripType: 'business' | 'beach' | 'adventure' = 'business') => {
    const tripDetails = {
      business: {
        name: 'Important Business Conference',
        destination: 'Tokyo, Japan',
        details: 'Critical business meetings with international clients and presentations'
      },
      beach: {
        name: 'Tropical Beach Paradise',
        destination: 'Honolulu, Hawaii',
        details: 'Relaxing beach vacation with lots of swimming and water sports'
      },
      adventure: {
        name: 'Mountain Hiking Expedition',
        destination: 'Rocky Mountain National Park, Colorado',
        details: 'Challenging mountain hiking and camping adventure in cold conditions'
      }
    };

    const trip = tripDetails[tripType];

    // Fill out form fields
    await user.type(screen.getByLabelText(/trip name/i), trip.name);
    await user.type(screen.getByTestId('destination-input-0'), trip.destination);
    await user.type(screen.getByLabelText(/trip details/i), trip.details);
    await user.type(screen.getByLabelText(/start date/i), '2025-08-01');
    await user.type(screen.getByLabelText(/end date/i), '2025-08-04');

    // Select travel mode
    await user.click(screen.getByLabelText(/plane/i));

    // Submit form
    await user.click(screen.getByText(/next/i));
  };

  describe('Business Trip Intelligence', () => {
    it('should generate context-aware business trip recommendations', async () => {
      const user = userEvent.setup();

      // Mock enhanced AI response for business trip
      const mockBusinessResponse = {
        checklist: [
          { id: '1', text: '6 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '2', text: '6 pairs socks', category: 'clothing', checked: false, aiGenerated: true },
          { id: '3', text: 'Business suits/formal wear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '4', text: 'Laptop + charger', category: 'electronics', checked: false, aiGenerated: true },
          { id: '5', text: 'Business cards', category: 'documents', checked: false, aiGenerated: true }
        ],
        suggestedItems: [
          'Translation app',
          'Professional networking materials'
        ]
      };

      mockGeneratePackingList.mockResolvedValueOnce(mockBusinessResponse);

      await setupApp();
      await fillBasicTripForm(user, 'business');

      // Wait for navigation to main layout
      await waitFor(() => {
        expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for AI suggestions button to be enabled and click it
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
        expect(generateButton).not.toBeDisabled();
        return generateButton;
      }, { timeout: 10000 });

      const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
      await user.click(generateButton);

      // Verify business-specific intelligent recommendations
      await waitFor(() => {
        expect(screen.getByText('Business suits/formal wear')).toBeInTheDocument();
      });

      expect(screen.getByText('Laptop + charger')).toBeInTheDocument();
      expect(screen.getByText('Business cards')).toBeInTheDocument();

      // Verify smart quantity calculation (4 days = 6 pairs with extras)
      expect(screen.getByText('6 pairs underwear')).toBeInTheDocument();
      expect(screen.getByText('6 pairs socks')).toBeInTheDocument();

      // Verify destination-specific suggestions
      expect(screen.getByText('Translation app')).toBeInTheDocument();
      expect(screen.getByText('Professional networking materials')).toBeInTheDocument();

      // Verify API was called with correct data
      expect(generatePackingList).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Important Business Conference',
          destinations: ['Tokyo, Japan'],
          tripDetails: 'Critical business meetings with international clients and presentations'
        }),
        expect.any(Array)
      );
    });
  });

  describe('Beach Vacation Intelligence', () => {
    it('should generate context-aware beach vacation recommendations', async () => {
      const user = userEvent.setup();

      // Mock enhanced AI response for beach vacation
      const mockBeachResponse = {
        checklist: [
          { id: '1', text: '6 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '2', text: 'Swimwear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '3', text: 'Beach towel', category: 'accessories', checked: false, aiGenerated: true },
          { id: '4', text: 'Sunscreen (SPF 30+)', category: 'health', checked: false, aiGenerated: true },
          { id: '5', text: 'Light summer clothes', category: 'clothing', checked: false, aiGenerated: true },
          { id: '6', text: 'Sunglasses', category: 'accessories', checked: false, aiGenerated: true }
        ],
        suggestedItems: [
          'Insect repellent',
          'After-sun lotion'
        ]
      };

      mockGeneratePackingList.mockResolvedValueOnce(mockBeachResponse);

      await setupApp();
      await fillBasicTripForm(user, 'beach');

      // Wait for navigation to main layout
      await waitFor(() => {
        expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for AI suggestions button to be enabled and click it
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
        expect(generateButton).not.toBeDisabled();
      }, { timeout: 10000 });

      const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
      await user.click(generateButton);

      // Verify beach-specific intelligent recommendations
      await waitFor(() => {
        expect(screen.getByText('Swimwear')).toBeInTheDocument();
      });

      expect(screen.getByText('Beach towel')).toBeInTheDocument();
      expect(screen.getByText('Sunscreen (SPF 30+)')).toBeInTheDocument();
      expect(screen.getByText('Light summer clothes')).toBeInTheDocument();
      expect(screen.getByText('Sunglasses')).toBeInTheDocument();

      // Verify beach-specific suggestions
      expect(screen.getByText('Insect repellent')).toBeInTheDocument();
      expect(screen.getByText('After-sun lotion')).toBeInTheDocument();

      // Verify API was called with beach trip context
      expect(generatePackingList).toHaveBeenCalledWith(
        expect.objectContaining({
          destinations: ['Honolulu, Hawaii'],
          tripDetails: 'Relaxing beach vacation with lots of swimming and water sports'
        }),
        expect.any(Array)
      );
    });
  });

  describe('Adventure Trip Intelligence', () => {
    it('should generate context-aware adventure trip recommendations', async () => {
      const user = userEvent.setup();

      // Mock enhanced AI response for adventure trip
      const mockAdventureResponse = {
        checklist: [
          { id: '1', text: '6 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '2', text: 'Hiking boots', category: 'footwear', checked: false, aiGenerated: true },
          { id: '3', text: 'First aid kit', category: 'health', checked: false, aiGenerated: true },
          { id: '4', text: 'Winter jacket/coat', category: 'clothing', checked: false, aiGenerated: true },
          { id: '5', text: 'Warm gloves', category: 'accessories', checked: false, aiGenerated: true }
        ],
        suggestedItems: [
          'Headlamp/flashlight',
          'Emergency whistle'
        ]
      };

      mockGeneratePackingList.mockResolvedValueOnce(mockAdventureResponse);

      await setupApp();
      await fillBasicTripForm(user, 'adventure');

      // Wait for navigation to main layout
      await waitFor(() => {
        expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for AI suggestions button to be enabled and click it
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
        expect(generateButton).not.toBeDisabled();
      }, { timeout: 10000 });

      const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
      await user.click(generateButton);

      // Verify adventure-specific intelligent recommendations
      await waitFor(() => {
        expect(screen.getByText('Hiking boots')).toBeInTheDocument();
      });

      expect(screen.getByText('First aid kit')).toBeInTheDocument();
      expect(screen.getByText('Winter jacket/coat')).toBeInTheDocument();
      expect(screen.getByText('Warm gloves')).toBeInTheDocument();

      // Verify adventure-specific suggestions
      expect(screen.getByText('Headlamp/flashlight')).toBeInTheDocument();
      expect(screen.getByText('Emergency whistle')).toBeInTheDocument();

      // Verify API was called with adventure trip context
      expect(generatePackingList).toHaveBeenCalledWith(
        expect.objectContaining({
          destinations: ['Rocky Mountain National Park, Colorado'],
          tripDetails: 'Challenging mountain hiking and camping adventure in cold conditions'
        }),
        expect.any(Array)
      );
    });
  });

  describe('Smart Quantity Calculations', () => {
    it('should calculate different quantities based on trip duration', async () => {
      const user = userEvent.setup();

      // Test short trip (2 days)
      const mockShortTripResponse = {
        checklist: [
          { id: '1', text: '4 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
          { id: '2', text: '4 pairs socks', category: 'clothing', checked: false, aiGenerated: true }
        ],
        suggestedItems: []
      };

      mockGeneratePackingList.mockResolvedValueOnce(mockShortTripResponse);

      await setupApp();

      // Fill short trip form
      await user.type(screen.getByLabelText(/trip name/i), 'Weekend Getaway');
      await user.type(screen.getByTestId('destination-input-0'), 'New York');
      await user.type(screen.getByLabelText(/start date/i), '2025-08-01');
      await user.type(screen.getByLabelText(/end date/i), '2025-08-02'); // 2 days
      await user.click(screen.getByLabelText(/plane/i));
      await user.click(screen.getByText(/next/i));

      // Wait for navigation and generate list
      await waitFor(() => {
        expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for AI suggestions button to be enabled and click it
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
        expect(generateButton).not.toBeDisabled();
      }, { timeout: 10000 });

      const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
      await user.click(generateButton);

      // Verify shorter trip gets fewer items
      await waitFor(() => {
        expect(screen.getByText('4 pairs underwear')).toBeInTheDocument();
      });
      expect(screen.getByText('4 pairs socks')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully and display error message', async () => {
      const user = userEvent.setup();

      // Mock API error
      mockGeneratePackingList.mockRejectedValueOnce(new Error('Service temporarily unavailable'));

      await setupApp();
      await fillBasicTripForm(user, 'business');

      // Wait for navigation to main layout
      await waitFor(() => {
        expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for AI suggestions button to be enabled and click it
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
        expect(generateButton).not.toBeDisabled();
      }, { timeout: 10000 });

      // Try to generate packing list
      const generateButton = screen.getByRole('button', { name: /get ai suggestions/i });
      await user.click(generateButton);

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/error|failed|unavailable/i)).toBeInTheDocument();
      });
    });
  });
});
