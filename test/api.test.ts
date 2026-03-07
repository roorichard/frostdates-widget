import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchLocations, fetchFrostDates } from '../src/api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('searchLocations', () => {
  it('sends correct POST request with siteId and query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [{ areaName: 'London', region: 'City of London', country: 'United Kingdom', latitude: '51.509', longitude: '-0.118' }],
    });

    const results = await searchLocations('London', 'test-site-id');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://frostdates.com/api/widget/search-locations',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'London', siteId: 'test-site-id' }),
      },
    );
    expect(results).toEqual([{ areaName: 'London', region: 'City of London', country: 'United Kingdom', latitude: '51.509', longitude: '-0.118' }]);
  });

  it('returns empty array on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const results = await searchLocations('Nowhere', 'test-site-id');
    expect(results).toEqual([]);
  });
});

describe('fetchFrostDates', () => {
  it('sends correct POST request with siteId and location', async () => {
    const mockResponse = { location: {}, frostDates: {}, usdaZone: '9a' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchFrostDates('London', 'test-site-id');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://frostdates.com/api/widget/frost-dates',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: 'London', siteId: 'test-site-id' }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws Error with the error message from response body on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Rate limit exceeded' }),
    });

    await expect(fetchFrostDates('London', 'test-site-id')).rejects.toThrow('Rate limit exceeded');
  });
});
