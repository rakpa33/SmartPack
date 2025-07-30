// Integration test for full packing list generation flow
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { generatePackingList } from '../../services/apiService';

// Mock the API service to return test data
vi.mock('../../services/apiService', () => ({
  generatePackingList: vi.fn(),
  checkApiHealth: vi.fn().mockResolvedValue(true)
}));

const mockGeneratePackingList = generatePackingList as MockedFunction<typeof generatePackingList>;

describe('Packing List Generation Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockGeneratePackingList.mockClear();
  });

  it('should generate and display AI packing list after form submission', async () => {
    // Mock API response
    const mockApiResponse = {
      checklist: [
        { id: '1', text: 'Winter jacket', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'Passport', category: 'documents', checked: false, aiGenerated: true },
        { id: '3', text: 'Phone charger', category: 'electronics', checked: false, aiGenerated: true }
      ],
      suggestedItems: ['Travel insurance', 'Power bank']
    };
    mockGeneratePackingList.mockResolvedValue(mockApiResponse);

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Fill out the trip form
    await user.type(screen.getByLabelText(/trip name/i), 'Winter Vacation');
    await user.type(screen.getByTestId('destination-input-0'), 'Aspen, Colorado');
    await user.type(screen.getByLabelText(/start date/i), '2025-12-20');
    await user.type(screen.getByLabelText(/end date/i), '2025-12-27');

    // Check a travel mode
    await user.click(screen.getByLabelText(/plane/i));

    // Submit the form
    await user.click(screen.getByText(/next/i));

    // Wait for navigation to MainLayout and API call
    await waitFor(() => {
      expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify API was called
    expect(mockGeneratePackingList).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Winter Vacation',
        startDate: '2025-12-20',
        endDate: '2025-12-27',
        destinations: ['Aspen, Colorado'],
        travelModes: ['Plane'],
        tripDetails: expect.any(String)
      }),
      expect.arrayContaining([
        expect.objectContaining({
          location: 'Aspen, Colorado'
        })
      ])
    );

    // Verify AI-generated items appear in the packing list
    await waitFor(() => {
      expect(screen.getByText('Winter jacket')).toBeInTheDocument();
      expect(screen.getByText('Passport')).toBeInTheDocument();
      expect(screen.getByText('Phone charger')).toBeInTheDocument();
    });

    // Verify AI badges are shown
    const aiBadges = screen.getAllByTitle('AI Generated');
    expect(aiBadges).toHaveLength(3);
  });

  it('should handle API errors gracefully and still show manual checklist', async () => {
    // Mock API to throw an error
    mockGeneratePackingList.mockRejectedValue(new Error('API Error'));

    const user2 = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Fill out and submit form
    await user2.type(screen.getByLabelText(/trip name/i), 'Test Trip');
    await user2.type(screen.getByTestId('destination-input-0'), 'Paris, France');
    await user2.type(screen.getByLabelText(/start date/i), '2025-06-01');
    await user2.type(screen.getByLabelText(/end date/i), '2025-06-07');
    await user2.click(screen.getByText(/next/i));

    // Should still navigate to MainLayout
    await waitFor(() => {
      expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
    });

    // Should still be able to add manual items
    const clothingInput = screen.getByPlaceholderText(/add to clothing/i);
    await user2.type(clothingInput, 'T-shirt');
    await user2.click(screen.getByText(/add/i));

    expect(screen.getByText('T-shirt')).toBeInTheDocument();
  });
});
