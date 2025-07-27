import { useContext } from 'react';
import { TripFormContext } from './TripFormContextOnly';
import type { TripFormState, TripFormAction } from './TripFormTypes';

export function useTripForm(): { state: TripFormState; dispatch: React.Dispatch<TripFormAction> } {
  const ctx = useContext(TripFormContext);
  if (ctx === undefined) throw new Error('useTripForm must be used within a TripFormProvider');
  return ctx as { state: TripFormState; dispatch: React.Dispatch<TripFormAction> };
}
