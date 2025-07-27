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
  step: 0,
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
      return initialState;
    default:
      return state;
  }
}

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
