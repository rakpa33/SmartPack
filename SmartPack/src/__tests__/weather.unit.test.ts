import { describe, it, expect, vi } from 'vitest';
import { fetchWeather } from '../utils/weather';

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('fetchWeather', () => {
  it('returns weather data for valid response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        daily: {
          temperature_2m_max: [25],
          temperature_2m_min: [18],
          weathercode: [1],
        },
      }),
    });
    const result = await fetchWeather(48.8566, 2.3522, '2025-07-27', '2025-07-28');
    expect(result).toEqual({
      temperature: 25,
      temperatureMin: 18,
      temperatureMax: 25,
      weathercode: 1,
      weathercodeEnd: 1,
      averageTemp: 21.5,
      summary: 'Mainly clear',
    });
  });

  it('returns null for non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const result = await fetchWeather(0, 0, '2025-07-27', '2025-07-28');
    expect(result).toBeNull();
  });

  it('returns null for fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fail'));
    const result = await fetchWeather(0, 0, '2025-07-27', '2025-07-28');
    expect(result).toBeNull();
  });
});
