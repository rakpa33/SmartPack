import { describe, it, expect, vi } from 'vitest';
import { geocodeCity } from '../utils/geocode';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('geocodeCity', () => {
  it('returns geocode result for valid city', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ lat: '48.8566', lon: '2.3522', display_name: 'Paris, France' }]),
    });
    const result = await geocodeCity('Paris');
    expect(result).toEqual({ lat: 48.8566, lon: 2.3522, display_name: 'Paris, France' });
  });

  it('returns null for no results', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    const result = await geocodeCity('Nowhereville');
    expect(result).toBeNull();
  });

  it('returns null for fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fail'));
    const result = await geocodeCity('Paris');
    expect(result).toBeNull();
  });
});
