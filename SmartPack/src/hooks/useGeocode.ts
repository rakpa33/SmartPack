import { useCallback, useState } from 'react';
import { geocodeCity } from '../utils/geocode';
import type { GeocodeResult } from '../utils/geocode';

export function useGeocode() {
  const [result, setResult] = useState<GeocodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await geocodeCity(city);
      setResult(res);
      return res;
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to geocode city');
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, geocode };
}
