// Integration test for full packing list generation flow
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { generatePackingList } from '../../services/apiService';

// Mock the API service to return test data
jest.mock('../../services/apiService', () => ({
  generatePackingList: jest.fn(),
  checkApiHealth: jest.fn().mockResolvedValue(true)
}));

const mockGeneratePackingList = generatePackingList as jest.MockedFunction<typeof generatePackingList>;

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

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Fill out the trip form
    fireEvent.change(screen.getByLabelText(/trip name/i), { target: { value: 'Winter Vacation' } });
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'Aspen, Colorado' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-12-20' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-12-27' } });

    // Check a travel mode
    fireEvent.click(screen.getByLabelText(/plane/i));

    // Submit the form
    fireEvent.click(screen.getByText(/next/i));

    // Wait for navigation to MainLayout and API call
    await waitFor(() => {
      expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify API was called
    expect(mockGeneratePackingList).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Winter Vacation',
        destinations: ['Aspen, Colorado'],
        travelModes: ['plane']
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

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/trip name/i), { target: { value: 'Test Trip' } });
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'Paris, France' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-06-01' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-06-07' } });
    fireEvent.click(screen.getByText(/next/i));

    // Should still navigate to MainLayout
    await waitFor(() => {
      expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
    });

    // Should still be able to add manual items
    const clothingInput = screen.getByPlaceholderText(/add to clothing/i);
    fireEvent.change(clothingInput, { target: { value: 'T-shirt' } });
    fireEvent.click(screen.getByText(/add/i));

    expect(screen.getByText('T-shirt')).toBeInTheDocument();
  });
});
