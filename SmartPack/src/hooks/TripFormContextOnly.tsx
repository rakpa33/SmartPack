import { createContext } from 'react';
import type { TripFormState, TripFormAction } from './TripFormTypes';

export const TripFormContext = createContext<{
  state: TripFormState;
  dispatch: React.Dispatch<TripFormAction>;
} | undefined>(undefined);
