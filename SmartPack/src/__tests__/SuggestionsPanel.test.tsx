import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SuggestionsPanel } from '../components/SuggestionsPanel';
import { useTripForm } from '../hooks/useTripForm';
import { usePackingList } from '../hooks/usePackingList';
import * as apiService from '../services/apiService';

// Mock the hooks
vi.mock('../hooks/useTripForm');
vi.mock('../hooks/usePackingList');
vi.mock('../services/apiService');

const mockUseTripForm = vi.mocked(useTripForm);
const mockUsePackingList = vi.mocked(usePackingList);
const mockGeneratePackingList = vi.mocked(apiService.generatePackingList);

describe('SuggestionsPanel', () => {
  const mockAddItem = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePackingList.mockReturnValue({
      items: [],
      categories: [],
      addItem: mockAddItem,
      editItem: vi.fn(),
      removeItem: vi.fn(),
      toggleItem: vi.fn(),
      addCategory: vi.fn(),
      editCategory: vi.fn(),
      removeCategory: vi.fn(),
      loadAiGeneratedItems: vi.fn(),
    });

    mockUseTripForm.mockReturnValue({
      state: {
        tripName: '',
        startDate: '',
        endDate: '',
        destinations: [],
        travelModes: [],
        preferences: [],
        step: 1,
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });
  });

  it('shows onboarding message when no trip is planned', () => {
    render(<SuggestionsPanel />);

    expect(screen.getByText('Complete your trip details to get AI-powered packing suggestions.')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('shows refinement form when trip is complete', () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        weather: {
          temperature: 25,
          summary: 'Sunny',
          weathercode: 1
        },
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });

    render(<SuggestionsPanel />);

    expect(screen.getByText('Refine Suggestions')).toBeInTheDocument();
    expect(screen.getByLabelText('What specific items or activities should we consider?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get More Suggestions' })).toBeInTheDocument();
  });

  it('displays initial suggestions from trip form state', () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        generatedPackingList: {
          checklist: [],
          suggestedItems: ['Travel insurance', 'Power bank', 'Camera']
        }
      },
      dispatch: mockDispatch
    });

    render(<SuggestionsPanel />);

    expect(screen.getByText('Suggested Items (3)')).toBeInTheDocument();
    expect(screen.getByText('Travel insurance')).toBeInTheDocument();
    expect(screen.getByText('Power bank')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
  });

  it('can submit refinement prompt and get new suggestions', async () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        weather: {
          temperature: 25,
          summary: 'Sunny',
          weathercode: 1
        },
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });

    const mockApiResponse = {
      checklist: [],
      suggestedItems: ['Business suit', 'Laptop charger']
    };
    mockGeneratePackingList.mockResolvedValue(mockApiResponse);

    render(<SuggestionsPanel />);

    const textArea = screen.getByLabelText('What specific items or activities should we consider?');
    const submitButton = screen.getByRole('button', { name: 'Get More Suggestions' });

    fireEvent.change(textArea, { target: { value: 'business meetings' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Getting Suggestions...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGeneratePackingList).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Paris Trip',
          destinations: ['Paris, France'],
          tripDetails: 'business meetings'
        }),
        expect.arrayContaining([
          expect.objectContaining({
            location: 'Paris, France',
            temperature: 25,
            conditions: 'Sunny'
          })
        ])
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Business suit')).toBeInTheDocument();
      expect(screen.getByText('Laptop charger')).toBeInTheDocument();
    });

    // Form should be cleared after successful submission
    expect(textArea).toHaveValue('');
  });

  it('can add suggestion to main packing list', () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        generatedPackingList: {
          checklist: [],
          suggestedItems: ['Travel insurance']
        }
      },
      dispatch: mockDispatch
    });

    render(<SuggestionsPanel />);

    const addButton = screen.getByRole('button', { name: 'Add Travel insurance to packing list' });
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      label: 'Travel insurance',
      checked: false,
      category: 'general',
      aiGenerated: true
    });

    // Suggestion should be removed from the list after adding
    expect(screen.queryByText('Travel insurance')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        weather: {
          temperature: 25,
          summary: 'Sunny',
          weathercode: 1
        },
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });

    mockGeneratePackingList.mockRejectedValue(new Error('API Error'));

    render(<SuggestionsPanel />);

    const textArea = screen.getByLabelText('What specific items or activities should we consider?');
    const submitButton = screen.getByRole('button', { name: 'Get More Suggestions' });

    fireEvent.change(textArea, { target: { value: 'business meetings' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to get AI suggestions. Please try again.')).toBeInTheDocument();
    });

    // Button should be re-enabled after error
    expect(submitButton).not.toBeDisabled();
  });

  it('shows onboarding when trip details are incomplete', () => {
    // Test with incomplete trip details (empty tripName and destinations)
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: '',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: [],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });

    render(<SuggestionsPanel />);

    // Should show onboarding message instead of form
    expect(screen.getByText('Complete your trip details to get AI-powered packing suggestions.')).toBeInTheDocument();
    expect(screen.queryByLabelText('What specific items or activities should we consider?')).not.toBeInTheDocument();
  });

  it('disables submit button when prompt is empty', () => {
    mockUseTripForm.mockReturnValue({
      state: {
        tripName: 'Paris Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        destinations: ['Paris, France'],
        travelModes: ['plane'],
        preferences: [],
        step: 2,
        generatedPackingList: null
      },
      dispatch: mockDispatch
    });

    render(<SuggestionsPanel />);

    const submitButton = screen.getByRole('button', { name: 'Get More Suggestions' });
    expect(submitButton).toBeDisabled();

    const textArea = screen.getByLabelText('What specific items or activities should we consider?');
    fireEvent.change(textArea, { target: { value: 'business meetings' } });
    expect(submitButton).not.toBeDisabled();

    fireEvent.change(textArea, { target: { value: '   ' } });
    expect(submitButton).toBeDisabled();
  });
});
