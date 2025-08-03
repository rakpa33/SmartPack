/**
 * TripDetailsEditForm Editing Workflow & Error Handling Tests
 *
 * PURPOSE: Tests editing, save/cancel logic, and error handling for TripDetailsEditForm
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TripDetailsEditForm } from '../components/TripDetailsEditForm';

const defaultProps = {
  tripName: 'Test Trip',
  startDate: '2025-08-01',
  endDate: '2025-08-10',
  destinations: ['Paris'],
  travelModes: ['Car'],
  preferences: ['Vegan'],
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('TripDetailsEditForm Editing Workflow', () => {
  it('should render all editable fields with initial values', () => {
    render(<TripDetailsEditForm {...defaultProps} />);
    expect(screen.getByDisplayValue('Test Trip')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-08-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-08-10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByLabelText('Car')).toBeChecked();
    expect(screen.getByDisplayValue('Vegan')).toBeInTheDocument();
  });

  it('should call onSave with updated values when Save is clicked', async () => {
    const onSave = vi.fn();
    render(<TripDetailsEditForm {...defaultProps} onSave={onSave} />);
    const tripNameInput = screen.getByDisplayValue('Test Trip');
    await userEvent.clear(tripNameInput);
    await userEvent.type(tripNameInput, 'Edited Trip');
    await userEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalled();
  });

  it('should call onCancel and revert changes when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<TripDetailsEditForm {...defaultProps} onCancel={onCancel} />);
    const tripNameInput = screen.getByDisplayValue('Test Trip');
    await userEvent.clear(tripNameInput);
    await userEvent.type(tripNameInput, 'Canceled Edit');
    await userEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
    // Should not show the edited value after cancel
    expect(screen.queryByDisplayValue('Canceled Edit')).not.toBeInTheDocument();
  });

  it('should show validation errors only after fields are touched', async () => {
    render(<TripDetailsEditForm {...defaultProps} tripName="" />);
    const tripNameInput = screen.getByPlaceholderText('Enter trip name');
    await userEvent.clear(tripNameInput);
    expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Trip name is required/)).toBeInTheDocument();
    });
  });

  it('should clear validation error when field becomes valid after being touched', async () => {
    render(<TripDetailsEditForm {...defaultProps} tripName="" />);
    const tripNameInput = screen.getByPlaceholderText('Enter trip name');
    await userEvent.click(tripNameInput);
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Trip name is required/)).toBeInTheDocument();
    });
    await userEvent.type(tripNameInput, 'Valid Trip');
    await waitFor(() => {
      expect(screen.queryByText(/Trip name is required/)).not.toBeInTheDocument();
    });
  });
});
