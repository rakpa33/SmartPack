import React, { useReducer, useEffect } from 'react';
import { TripFormContext } from './TripFormContextOnly';
import type { TripFormState, TripFormAction } from './TripFormTypes';

const initialState: TripFormState = {
  tripName: '',
  startDate: '',
  endDate: '',
  destinations: [''],
  travelModes: [],
  preferences: [],
  step: 2, // Start directly in MainLayout for first-time users
};

function reducer(state: TripFormState, action: TripFormAction): TripFormState {
  switch (action.type) {
    case 'SET_FORM_STATE':
      return { ...action.value };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_DESTINATION':
      return { ...state, destinations: [...state.destinations, action.value] };
    case 'REMOVE_DESTINATION': {
      const newDests = state.destinations.filter((_, i) => i !== action.index);
      return {
        ...state,
        destinations: newDests.length > 0 ? newDests : [''],
      };
    }
    case 'UPDATE_DESTINATION':
      return {
        ...state,
        destinations: state.destinations.map((d, i) =>
          i === action.index ? action.value : d
        ),
      };
    case 'ADD_TRAVEL_MODE':
      return state.travelModes.includes(action.value)
        ? state
        : { ...state, travelModes: [...state.travelModes, action.value] };
    case 'REMOVE_TRAVEL_MODE':
      return {
        ...state,
        travelModes: state.travelModes.filter((m) => m !== action.value),
      };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.value };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(0, state.step - 1) };
    case 'RESET_FORM':
      return { ...initialState, step: 2 }; // Reset to first-time user state
    default:
      return state;
  }
}

// Helper function to check if the form is complete
function isFormComplete(state: TripFormState): boolean {
  return !!(
    state.tripName.trim() &&
    state.destinations.length > 0 &&
    state.destinations.every(d => d.trim()) &&
    state.travelModes.length > 0 &&
    state.startDate &&
    state.endDate
  );
}

export const TripFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('tripForm');
    if (saved) {
      const parsedState = { ...init, ...JSON.parse(saved) };
      // Fix step based on form completion status after loading from localStorage
      if (isFormComplete(parsedState)) {
        parsedState.step = Math.max(parsedState.step, 2);
      } else {
        parsedState.step = Math.min(parsedState.step, 1);
      }
      return parsedState;
    }
    // For first-time users (no saved data), start at step 2 with MainLayout
    return { ...init, step: 2 };
  });

  useEffect(() => {
    localStorage.setItem('tripForm', JSON.stringify(state));
  }, [state]);

  return (
    <TripFormContext.Provider value={{ state, dispatch }}>
      {children}
    </TripFormContext.Provider>
  );
};
