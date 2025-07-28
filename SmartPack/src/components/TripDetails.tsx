import React from 'react';
import { useTripForm } from '../hooks/useTripForm';

/**
 * TripDetails: Displays submitted trip data in the left column of MainLayout.
 */
export const TripDetails: React.FC = () => {
  const { state } = useTripForm();

  // Enhanced error handling - provide clear fallback for incomplete state
  if (!state) {
    console.log('TripDetails: No state found');
    return <div>Loading trip details...</div>;
  }

  // Explicit check for step=2 (completed form)
  if (state.step < 2) {
    console.log('TripDetails: Form not completed, step is', state.step);
    return <div>Please complete the trip form</div>;
  }

  const {
    tripName,
    startDate,
    endDate,
    destinations,
    travelModes,
    preferences,
    weather,
  } = state;

  // Debug: log the state to see if weather data is present
  console.log('TripDetails state:', state);
  console.log('Weather data:', weather);

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
      {weather && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded" data-testid="weather-display">
          <div className="text-lg font-semibold" data-testid="weather-summary">{weather.summary}</div>
          <div className="text-xl" data-testid="weather-temperature">{weather.temperature !== null ? `${weather.temperature}°C` : 'N/A'}</div>
        </div>
      )}
      {/* Add a fallback div to help with testing */}
      {!weather && (
        <div data-testid="weather-empty">No weather data available</div>
      )}
    </div>
  );
};
