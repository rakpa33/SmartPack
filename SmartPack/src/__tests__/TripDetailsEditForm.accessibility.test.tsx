/**
 * TripDetailsEditForm Accessibility & Integration Tests
 *
 * PURPOSE: Ensures WCAG compliance and integration with TripDetails parent workflow
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TripDetailsEditForm } from '../components/TripDetailsEditForm';

const defaultProps = {
  tripName: 'Accessible Trip',
  startDate: '2025-08-01',
  endDate: '2025-08-10',
  destinations: ['Paris'],
  travelModes: ['Car'],
  preferences: ['Vegan'],
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('TripDetailsEditForm Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TripDetailsEditForm {...defaultProps} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

describe('TripDetailsEditForm Integration', () => {
  it('should integrate with TripDetails parent workflow', () => {
    // Simulate parent passing props and handlers
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const { getByDisplayValue, getByText } = render(
      <TripDetailsEditForm {...defaultProps} onSave={onSave} onCancel={onCancel} />
    );
    expect(getByDisplayValue('Accessible Trip')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
