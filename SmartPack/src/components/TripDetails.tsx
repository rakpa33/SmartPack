import React from 'react';
import { useTripForm } from '../hooks/useTripForm';

/**
 * TripDetails: Displays submitted trip data in the left column of MainLayout.
 */
export const TripDetails: React.FC = () => {
  const { state } = useTripForm();
  if (!state) return null;
  const {
    tripName,
    startDate,
    endDate,
    destinations,
    travelModes,
    preferences,
  } = state;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Trip Details</h2>
      <dl className="space-y-1">
        <div>
          <dt className="font-medium">Trip Name:</dt>
          <dd>{tripName || <span className="text-gray-400">(not set)</span>}</dd>
        </div>
        <div>
          <dt className="font-medium">Dates:</dt>
          <dd>{startDate && endDate ? `${startDate} – ${endDate}` : <span className="text-gray-400">(not set)</span>}</dd>
        </div>
        <div>
          <dt className="font-medium">Destinations:</dt>
          <dd>{destinations && destinations.length > 0 && destinations.some(d => d.trim())
            ? destinations.filter(d => d.trim()).join(', ')
            : <span className="text-gray-400">(none)</span>}</dd>
        </div>
        <div>
          <dt className="font-medium">Travel Modes:</dt>
          <dd>{travelModes && travelModes.length > 0
            ? travelModes.join(', ')
            : <span className="text-gray-400">(none)</span>}</dd>
        </div>
        <div>
          <dt className="font-medium">Preferences:</dt>
          <dd>{preferences && preferences.length > 0 && preferences.some(p => p.trim())
            ? preferences.filter(p => p.trim()).join(', ')
            : <span className="text-gray-400">(none)</span>}</dd>
        </div>
      </dl>
    </div>
  );
};
