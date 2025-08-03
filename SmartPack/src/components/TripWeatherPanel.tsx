import React from 'react';
import type { TripDetailsProps } from './TripDetails';

export interface TripWeatherPanelProps {
  weather?: TripDetailsProps['weather'];
  weatherTypes?: TripDetailsProps['weatherTypes'];
}

export const TripWeatherPanel: React.FC<TripWeatherPanelProps> = ({ weather, weatherTypes = [] }) => {
  // TODO: Implement weather display logic
  return (
    <div>
      {/* Weather summary and expected conditions go here */}
      {weather ? (
        <div>Weather summary: {weather.summary}</div>
      ) : (
        <div>No weather data available</div>
      )}
      {/* Expected conditions */}
      {weatherTypes.length > 0 && (
        <ul>
          {weatherTypes.map((type, idx) => (
            <li key={idx}>{type.icon} {type.condition}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
