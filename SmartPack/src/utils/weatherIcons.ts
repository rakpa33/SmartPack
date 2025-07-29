// src/utils/weatherIcons.ts
// Weather icon mapping for weather codes

export function getWeatherIcon(code: number): string {
  // See Open-Meteo weather codes: https://open-meteo.com/en/docs#api-formats
  if (code === 0) return '☀️'; // Clear
  if (code === 1 || code === 2) return '🌤️'; // Mainly clear
  if (code === 3) return '⛅'; // Partly cloudy
  if (code === 45 || code === 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌦️'; // Drizzle
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌧️'; // Rain showers
  if (code >= 95) return '⛈️'; // Thunderstorm
  return '🌡️'; // Unknown/Default
}

export function getWeatherCondition(code: number): string {
  // See Open-Meteo weather codes: https://open-meteo.com/en/docs#api-formats
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Mainly clear';
  if (code === 3) return 'Partly cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 67) return 'Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
}

export interface WeatherCondition {
  icon: string;
  condition: string;
  code: number;
}

export function getExpectedWeatherTypes(startWeatherCode?: number, endWeatherCode?: number): WeatherCondition[] {
  const conditions: WeatherCondition[] = [];
  const addedCodes = new Set<number>();

  // Add start weather condition
  if (startWeatherCode !== undefined && startWeatherCode !== null) {
    conditions.push({
      icon: getWeatherIcon(startWeatherCode),
      condition: getWeatherCondition(startWeatherCode),
      code: startWeatherCode
    });
    addedCodes.add(startWeatherCode);
  }

  // Add end weather condition if different
  if (endWeatherCode !== undefined && endWeatherCode !== null && !addedCodes.has(endWeatherCode)) {
    conditions.push({
      icon: getWeatherIcon(endWeatherCode),
      condition: getWeatherCondition(endWeatherCode),
      code: endWeatherCode
    });
  }

  return conditions;
}
