/**
 * Utility to geocode city names using the Nominatim OpenStreetMap API
 */

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

/**
 * Geocode a city name to get its coordinates and full display name
 * @param city The city name to geocode
 * @returns The geocode result with lat, lon, and display_name, or null if not found
 */
export async function geocodeCity(city: string): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SmartPack/1.0',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name,
    };
  } catch (error) {
    console.error('Error geocoding city:', error);
    return null;
  }
}
