// Factory for creating a valid Trip object for tests
export function makeTrip(overrides = {}) {
  return {
    id: 'trip-1',
    name: 'Test Trip',
    startDate: '2025-08-01',
    endDate: '2025-08-10',
    destination: 'Paris',
    travelMode: 'plane',
    preferences: [],
    ...overrides,
  };
}
