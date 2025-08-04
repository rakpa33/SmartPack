import { useEffect } from 'react';
import { useColumnLayout } from './useColumnLayout';
import { useTripForm } from './useTripForm';

/**
 * Hook that synchronizes column visibility with trip form state
 * This ensures columns update when form data changes
 */
export function useColumnSynchronizer() {
  const { updateColumnVisibilityFromTrip } = useColumnLayout();
  const { state } = useTripForm();

  // Check if user has meaningful trip data (not first-time user)
  const hasTrip = !!(
    state.tripName.trim() ||
    (state.destinations.length > 0 && state.destinations.some(d => d.trim())) ||
    state.travelModes.length > 0
  );

  // Synchronize column visibility when trip data changes
  useEffect(() => {
    if (hasTrip) {
      // User has trip data, show all columns
      updateColumnVisibilityFromTrip();
    }
  }, [hasTrip, updateColumnVisibilityFromTrip]);

  return { hasTrip };
}