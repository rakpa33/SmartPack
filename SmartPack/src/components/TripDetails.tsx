import React, { useState } from 'react';

import { TripDetailsEditForm } from './TripDetailsEditForm';
import { TripWeatherPanel } from './TripWeatherPanel';

export interface TripDetailsProps {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  destinations?: string[];
  travelModes?: string[];
  preferences?: string[];
  weather?: {
    weathercode?: number;
    summary?: string;
    temperatureMin?: number;
    temperatureMax?: number;
    averageTemp?: number;
  };
  weatherTypes?: Array<{ icon: string; condition: string }>;
  isFirstTimeOrNewTrip?: boolean;
}

export const TripDetails: React.FC<TripDetailsProps> = ({
  tripName,
  startDate,
  endDate,
  destinations,
  travelModes,
  preferences,
  weather,
  weatherTypes = [],
  isFirstTimeOrNewTrip = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!tripName && !startDate && !endDate && (!destinations || destinations.length === 0)) {
    return <div>Loading trip details...</div>;
  }

  return (
    <section data-testid="trip-details-section" className={isFirstTimeOrNewTrip ? 'max-w-lg mx-auto p-4 sm:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg' : ''}>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trip Details</h2>
        <div>
          {isEditing ? null : (
            <button type="button" onClick={() => setIsEditing(true)} className="text-blue-600 text-sm font-medium">Edit</button>
          )}
        </div>
      </header>
      <main>
        {isEditing ? (
          <TripDetailsEditForm
            tripName={tripName}
            startDate={startDate}
            endDate={endDate}
            destinations={destinations}
            travelModes={travelModes}
            preferences={preferences}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <dl className="space-y-1">
              <div>
                <dt className="font-medium">Trip Name:</dt>
                <dd>{tripName ?? <span className="text-gray-400">(not set)</span>}</dd>
              </div>
              <div>
                <dt className="font-medium">Dates:</dt>
                <dd>{startDate && endDate ? `${startDate} – ${endDate}` : <span className="text-gray-400">(not set)</span>}</dd>
              </div>
              <div>
                <dt className="font-medium">Destinations:</dt>
                <dd>{destinations && destinations.length > 0 && destinations.some(d => d && d.trim())
                  ? destinations.filter(d => d && d.trim()).join(', ')
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
                <dd>{preferences && preferences.length > 0 && preferences.some(p => p && p.trim())
                  ? preferences.filter(p => p && p.trim()).join(', ')
                  : <span className="text-gray-400">(none)</span>}</dd>
              </div>
            </dl>
            <TripWeatherPanel weather={weather} weatherTypes={weatherTypes} />
          </>
        )}
      </main>
    </section>
  );
}