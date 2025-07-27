import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TripFormProvider } from '../hooks/TripFormContext';
import { useTripForm } from '../hooks/useTripForm';

// Optionally, import shared factories if needed in future
// import { makeTrip } from '../../tests/factories/tripFactory';

describe('useTripForm context', () => {
  function wrapper({ children }: { children: React.ReactNode }) {
    return <TripFormProvider>{children}</TripFormProvider>;
  }

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    expect(result.current.state.tripName).toBe('');
    expect(result.current.state.destinations).toEqual(['']);
    expect(result.current.state.travelModes).toEqual([]);
    expect(result.current.state.preferences).toEqual([]);
    expect(result.current.state.step).toBe(0);
  });

  it('can set trip name and dates', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_FIELD', field: 'tripName', value: 'My Trip' });
      result.current.dispatch({ type: 'SET_FIELD', field: 'startDate', value: '2025-08-01' });
      result.current.dispatch({ type: 'SET_FIELD', field: 'endDate', value: '2025-08-10' });
    });
    expect(result.current.state.tripName).toBe('My Trip');
    expect(result.current.state.startDate).toBe('2025-08-01');
    expect(result.current.state.endDate).toBe('2025-08-10');
  });

  it('can add, update, and remove destinations', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'ADD_DESTINATION', value: 'Paris' });
      result.current.dispatch({ type: 'ADD_DESTINATION', value: 'London' });
    });
    expect(result.current.state.destinations).toEqual(['', 'Paris', 'London']);
    act(() => {
      result.current.dispatch({ type: 'UPDATE_DESTINATION', index: 1, value: 'Berlin' });
    });
    expect(result.current.state.destinations[1]).toBe('Berlin');
    act(() => {
      result.current.dispatch({ type: 'REMOVE_DESTINATION', index: 0 });
    });
    expect(result.current.state.destinations).toEqual(['Berlin', 'London']);
  });

  it('can add and remove travel modes', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'ADD_TRAVEL_MODE', value: 'Plane' });
      result.current.dispatch({ type: 'ADD_TRAVEL_MODE', value: 'Car' });
    });
    expect(result.current.state.travelModes).toEqual(['Plane', 'Car']);
    act(() => {
      result.current.dispatch({ type: 'REMOVE_TRAVEL_MODE', value: 'Plane' });
    });
    expect(result.current.state.travelModes).toEqual(['Car']);
  });

  it('can set preferences', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_PREFERENCES', value: ['Pack light', 'Business trip'] });
    });
    expect(result.current.state.preferences).toEqual(['Pack light', 'Business trip']);
  });

  it('can navigate steps', () => {
    const { result } = renderHook(() => useTripForm(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'NEXT_STEP' });
      result.current.dispatch({ type: 'NEXT_STEP' });
      result.current.dispatch({ type: 'PREV_STEP' });
    });
    expect(result.current.state.step).toBe(1);
  });

  it('persists and loads state from localStorage', () => {
    // Simulate a saved state
    window.localStorage.setItem('tripForm', JSON.stringify({ tripName: 'Saved Trip', destinations: ['Rome'], travelModes: ['Train'], preferences: ['Outdoor'], startDate: '2025-09-01', endDate: '2025-09-10', step: 2 }));
    const { result } = renderHook(() => useTripForm(), { wrapper });
    expect(result.current.state.tripName).toBe('Saved Trip');
    expect(result.current.state.destinations).toEqual(['Rome']);
    expect(result.current.state.travelModes).toEqual(['Train']);
    expect(result.current.state.preferences).toEqual(['Outdoor']);
    expect(result.current.state.startDate).toBe('2025-09-01');
    expect(result.current.state.endDate).toBe('2025-09-10');
    expect(result.current.state.step).toBe(2);
    window.localStorage.removeItem('tripForm');
  });
});
