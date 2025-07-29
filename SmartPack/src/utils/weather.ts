// src/utils/weather.ts
// Utility for fetching weather data from Open-Meteo API

export interface WeatherData {
  temperature: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  weathercode: number | null;
  weathercodeEnd: number | null;
  summary: string;
  averageTemp: number | null;
}

export async function fetchWeather(lat: number, lon: number, startDate: string, endDate: string): Promise<WeatherData | null> {
  // Open-Meteo docs: https://open-meteo.com/en/docs
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    // Get temperature range and weather codes for the entire trip
    const tempMax = data.daily?.temperature_2m_max ?? [];
    const tempMin = data.daily?.temperature_2m_min ?? [];
    const weatherCodes = data.daily?.weathercode ?? [];
    
    // Calculate average temperatures
    const avgMax = tempMax.length > 0 ? tempMax.reduce((sum: number, t: number) => sum + t, 0) / tempMax.length : null;
    const avgMin = tempMin.length > 0 ? tempMin.reduce((sum: number, t: number) => sum + t, 0) / tempMin.length : null;
    const averageTemp = avgMax !== null && avgMin !== null ? (avgMax + avgMin) / 2 : null;
    
    // Get start and end weather codes
    const startCode = weatherCodes[0] ?? null;
    const endCode = weatherCodes.length > 1 ? weatherCodes[weatherCodes.length - 1] : startCode;
    
    return {
      temperature: avgMax, // Primary temperature (average max)
      temperatureMin: avgMin,
      temperatureMax: avgMax,
      weathercode: startCode,
      weathercodeEnd: endCode,
      averageTemp: averageTemp,
      summary: startCode !== null ? weatherCodeToSummary(startCode) : 'Unknown',
    };
  } catch {
    return null;
  }
}

function weatherCodeToSummary(code: number): string {
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
