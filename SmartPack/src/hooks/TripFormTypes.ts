export type TripFormState = {
  tripName: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  travelModes: string[];
  preferences: string[];
  step: number;
};

export type TripFormAction =
  | { type: 'SET_FIELD'; field: keyof TripFormState; value: TripFormState[keyof TripFormState] }
  | { type: 'ADD_DESTINATION'; value: string }
  | { type: 'REMOVE_DESTINATION'; index: number }
  | { type: 'UPDATE_DESTINATION'; index: number; value: string }
  | { type: 'ADD_TRAVEL_MODE'; value: string }
  | { type: 'REMOVE_TRAVEL_MODE'; value: string }
  | { type: 'SET_PREFERENCES'; value: string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_FORM' }
  | { type: 'SET_FORM_STATE'; value: TripFormState };
