import { useCallback, useState } from 'react';
import { fetchWeather } from '../utils/weather';
import type { WeatherData } from '../utils/weather';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = useCallback(async (lat: number, lon: number, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, startDate, endDate);
      setWeather(data);
    } catch {
      setError('Failed to fetch weather');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, getWeather };
}
