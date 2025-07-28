// src/utils/weather.ts
// Utility for fetching weather data from Open-Meteo API

export interface WeatherData {
  temperature: number | null;
  weathercode: number | null;
  summary: string;
}

export async function fetchWeather(lat: number, lon: number, startDate: string, endDate: string): Promise<WeatherData | null> {
  // Open-Meteo docs: https://open-meteo.com/en/docs
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    // Simplified: just return first day's data
    const temp = data.daily?.temperature_2m_max?.[0] ?? null;
    const code = data.daily?.weathercode?.[0] ?? null;
    return {
      temperature: temp,
      weathercode: code,
      summary: code !== null ? weatherCodeToSummary(code) : 'Unknown',
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
