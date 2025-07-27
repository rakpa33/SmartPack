import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type TripFormState = {
  tripName: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  travelModes: string[];
  preferences: string[];
  step: number;
};

const initialState: TripFormState = {
  tripName: '',
  startDate: '',
  endDate: '',
  destinations: [''],
  travelModes: [],
  preferences: [],
  step: 0,
};

type TripFormFieldValue = string | string[] | number;

type TripFormAction =
  | { type: 'SET_FIELD'; field: keyof TripFormState; value: TripFormFieldValue }
  | { type: 'ADD_DESTINATION'; value: string }
  | { type: 'REMOVE_DESTINATION'; index: number }
  | { type: 'UPDATE_DESTINATION'; index: number; value: string }
  | { type: 'ADD_TRAVEL_MODE'; value: string }
  | { type: 'REMOVE_TRAVEL_MODE'; value: string }
  | { type: 'SET_PREFERENCES'; value: string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STATE'; value: TripFormState };

function reducer(state: TripFormState, action: TripFormAction): TripFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_DESTINATION':
      return { ...state, destinations: [...state.destinations, action.value] };
    case 'REMOVE_DESTINATION':
      return {
        ...state,
        destinations: state.destinations.filter((_, i) => i !== action.index),
      };
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
    case 'SET_STATE':
      return { ...action.value };
    default:
      return state;
  }
}

const TripFormContext = createContext<{
  state: TripFormState;
  dispatch: React.Dispatch<TripFormAction>;
} | undefined>(undefined);

export const TripFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('tripForm');
    return saved ? { ...init, ...JSON.parse(saved) } : init;
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

// Note: This file exports a hook and a provider, not a React component directly.
export function useTripForm() {
  const ctx = useContext(TripFormContext);
  if (!ctx) throw new Error('useTripForm must be used within a TripFormProvider');
  return ctx;
}
