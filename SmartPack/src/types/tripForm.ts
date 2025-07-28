// src/types/tripForm.ts

export interface TripFormData {
  name: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  travelModes: string[];
  tripDetails: string;
}

export interface TripFormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  destinations?: string;
  travelModes?: string;
  tripDetails?: string;
}

export type FormStep = 'initial' | 'tripDetails' | 'packingList' | 'suggestions';

export interface TripFormContextState {
  formData: TripFormData;
  errors: TripFormErrors;
  step: number;
  isSubmitted: boolean;
  isLoading: boolean;
}

export type TripFormAction = 
  | { type: 'SET_FORM_FIELD'; field: keyof TripFormData; value: string | string[] | boolean | number }
  | { type: 'SET_FORM_STATE'; formData: Partial<TripFormData> }
  | { type: 'SET_ERRORS'; errors: TripFormErrors }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SUBMIT_FORM' }
  | { type: 'SET_LOADING'; isLoading: boolean };
