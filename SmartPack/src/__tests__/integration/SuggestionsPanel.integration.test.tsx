import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { generatePackingList, generateAISuggestions } from '../../services/apiService';
import { vi } from 'vitest';
import type { MockedFunction, Mock } from 'vitest';

// Mock the API service
vi.mock('../../services/apiService', () => ({
  generatePackingList: vi.fn(),
  generateAISuggestions: vi.fn(),
  checkApiHealth: vi.fn().mockResolvedValue(true)
}));

const mockGeneratePackingList = generatePackingList as MockedFunction<typeof generatePackingList>;
const mockGenerateAISuggestions = generateAISuggestions as MockedFunction<typeof generateAISuggestions>;

// Mock fetch for weather API
global.fetch = vi.fn() as unknown as Mock;

describe('SuggestionsPanel Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock weather API response
    const mockFetch = global.fetch as unknown as Mock;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 22,
          weather_code: 1
        }
      })
    } as Response);
  });

  const fillAndSubmitTripForm = async () => {
    const user = userEvent.setup();

    // Fill out trip form
    await user.type(screen.getByLabelText(/trip name/i), 'Paris Vacation');
    await user.type(screen.getByTestId('destination-input-0'), 'Paris, France');
    await user.type(screen.getByLabelText(/start date/i), '2025-08-01');
    await user.type(screen.getByLabelText(/end date/i), '2025-08-10');
    await user.click(screen.getByLabelText(/plane/i));

    // Submit form
    await user.click(screen.getByText(/next/i));

    // Wait for navigation to MainLayout
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /packing checklist/i })).toBeInTheDocument();
    });
  };

  it('integrates with full app flow and shows suggestions panel', async () => {
    // Mock API response for initial packing list generation
    const mockApiResponse = {
      checklist: [
        { id: '1', text: 'Passport', category: 'documents', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance', 'Power bank']
    };
    mockGeneratePackingList.mockResolvedValue(mockApiResponse);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fillAndSubmitTripForm();

    // Check that suggestions panel is visible
    expect(screen.getByText('AI Suggestions')).toBeInTheDocument();

    // Check that initial suggestions are loaded
    await waitFor(() => {
      expect(screen.getByText('Suggested Items (2)')).toBeInTheDocument();
      expect(screen.getByText('Travel insurance')).toBeInTheDocument();
      expect(screen.getByText('Power bank')).toBeInTheDocument();
    });
  });

  it('can refine suggestions and add them to packing list', async () => {
    // Mock initial API response
    const initialResponse = {
      checklist: [
        { id: '1', text: 'Passport', category: 'documents', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance']
    };
    mockGeneratePackingList.mockResolvedValueOnce(initialResponse);

    // Mock refinement API response
    const refinementResponse = {
      checklist: [],
      suggestedItems: ['Business suit', 'Laptop']
    };
    mockGenerateAISuggestions.mockResolvedValueOnce(refinementResponse);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fillAndSubmitTripForm();

    // Wait for initial suggestions to load
    await waitFor(() => {
      expect(screen.getByText('Travel insurance')).toBeInTheDocument();
    });

    // Submit refinement request
    const user = userEvent.setup();
    const promptInput = screen.getByLabelText('What specific items or activities should we consider?');
    await user.type(promptInput, 'business meetings');
    await user.click(screen.getByRole('button', { name: 'Get AI Suggestions' }));

    // Wait for new suggestions
    await waitFor(() => {
      expect(screen.getByText('Business suit')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Add a suggestion to the main packing list
    const addButton = screen.getByRole('button', { name: 'Add Business suit to packing list' });
    await user.click(addButton);

    // Verify the item appears in the packing list
    await waitFor(() => {
      expect(screen.getByText('Business suit')).toBeInTheDocument();
    });

    // Verify the suggestion is removed from suggestions panel
    const suggestionsSection = screen.getByTestId('ai-suggestions-section');
    expect(suggestionsSection).not.toHaveTextContent('Business suit');
  });

  it('shows onboarding message when no trip is completed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Should not show suggestions panel initially (placeholder is shown)
    expect(screen.queryByText('AI Suggestions')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully during refinement', async () => {
    // Mock successful initial response
    const initialResponse = {
      checklist: [
        { id: '1', text: 'Passport', category: 'documents', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance']
    };
    mockGeneratePackingList.mockResolvedValueOnce(initialResponse);

    // Mock error for refinement
    mockGenerateAISuggestions.mockRejectedValueOnce(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fillAndSubmitTripForm();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Travel insurance')).toBeInTheDocument();
    });

    // Submit refinement request that will fail
    const user2 = userEvent.setup();
    const promptInput = screen.getByLabelText('What specific items or activities should we consider?');
    await user2.type(promptInput, 'business meetings');
    await user2.click(screen.getByRole('button', { name: 'Get AI Suggestions' }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to get AI suggestions. Please try again.')).toBeInTheDocument();
    });

    // Original suggestions should still be there
    expect(screen.getByText('Travel insurance')).toBeInTheDocument();
  });

  it('maintains suggestions state during navigation', async () => {
    // Mock API response
    const mockApiResponse = {
      checklist: [
        { id: '1', text: 'Passport', category: 'documents', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance', 'Power bank']
    };
    mockGeneratePackingList.mockResolvedValue(mockApiResponse);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fillAndSubmitTripForm();

    // Wait for suggestions to load
    await waitFor(() => {
      expect(screen.getByText('Travel insurance')).toBeInTheDocument();
      expect(screen.getByText('Power bank')).toBeInTheDocument();
    });

    // Add one suggestion
    const user3 = userEvent.setup();
    const addButton = screen.getByRole('button', { name: 'Add Travel insurance to packing list' });
    await user3.click(addButton);

    // Verify that the remaining suggestion is still there
    expect(screen.getByText('Power bank')).toBeInTheDocument();
    expect(screen.queryByText('Travel insurance')).not.toBeInTheDocument();

    // The counter should update
    expect(screen.getByText('Suggested Items (1)')).toBeInTheDocument();
  });
});
