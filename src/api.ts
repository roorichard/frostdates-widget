import type { FrostDatesResponse, LocationOption } from './types';

const API_BASE = 'https://frostdates.com/api/widget';

export async function searchLocations(query: string, siteId: string): Promise<LocationOption[]> {
  const res = await fetch(`${API_BASE}/search-locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, siteId }),
  });

  if (!res.ok) return [];
  return res.json();
}

export async function fetchFrostDates(location: string, siteId: string): Promise<FrostDatesResponse> {
  const res = await fetch(`${API_BASE}/frost-dates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, siteId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return res.json();
}
