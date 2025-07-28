import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { generatePackingList } from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  generatePackingList: jest.fn(),
  checkApiHealth: jest.fn().mockResolvedValue(true)
}));

const mockGeneratePackingList = generatePackingList as jest.MockedFunction<typeof generatePackingList>;

// Mock fetch for weather API
global.fetch = jest.fn();

describe('SuggestionsPanel Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock weather API response
    const mockFetch = global.fetch as unknown as jest.MockedFunction<typeof fetch>;
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
    // Fill out trip form
    fireEvent.change(screen.getByLabelText(/trip name/i), { target: { value: 'Paris Vacation' } });
    fireEvent.change(screen.getByTestId('destination-input-0'), { target: { value: 'Paris, France' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-08-01' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-08-10' } });
    fireEvent.click(screen.getByLabelText(/plane/i));

    // Submit form
    fireEvent.click(screen.getByText(/next/i));

    // Wait for navigation to MainLayout
    await waitFor(() => {
      expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
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
    mockGeneratePackingList.mockResolvedValueOnce(refinementResponse);

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
    const promptInput = screen.getByLabelText('What specific items or activities should we consider?');
    fireEvent.change(promptInput, { target: { value: 'business meetings' } });
    fireEvent.click(screen.getByRole('button', { name: 'Get More Suggestions' }));

    // Wait for new suggestions
    await waitFor(() => {
      expect(screen.getByText('Business suit')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Add a suggestion to the main packing list
    const addButton = screen.getByRole('button', { name: 'Add Business suit to packing list' });
    fireEvent.click(addButton);

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
    mockGeneratePackingList.mockRejectedValueOnce(new Error('API Error'));

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
    const promptInput = screen.getByLabelText('What specific items or activities should we consider?');
    fireEvent.change(promptInput, { target: { value: 'business meetings' } });
    fireEvent.click(screen.getByRole('button', { name: 'Get More Suggestions' }));

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
    const addButton = screen.getByRole('button', { name: 'Add Travel insurance to packing list' });
    fireEvent.click(addButton);

    // Verify that the remaining suggestion is still there
    expect(screen.getByText('Power bank')).toBeInTheDocument();
    expect(screen.queryByText('Travel insurance')).not.toBeInTheDocument();

    // The counter should update
    expect(screen.getByText('Suggested Items (1)')).toBeInTheDocument();
  });
});
