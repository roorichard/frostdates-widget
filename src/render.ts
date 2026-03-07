import type { FrostData, FrostPeriod, FrostDatesResponse, LocationData } from './types';
import { renderTimeline } from './timeline';

function getFrostText(period: FrostPeriod | undefined, stage: 'first' | 'last'): string {
  if (!period) return '';
  if (period.alwaysAbove) return 'Unlikely';
  if (period.alwaysBelow) return 'Remains Below';
  if (period[stage]) return period[stage].dateString;
  return '';
}

export function renderResults(data: FrostDatesResponse): string {
  const loc = data.location;
  const frost = data.frostDates;
  const zone = data.usdaZone;

  return `
    <div class="fd-results">
      <p class="fd-location-name">
        Frost dates for: <strong>${escapeHtml(loc.areaName)}, ${escapeHtml(loc.region)}, ${escapeHtml(loc.country)}</strong>
        (${escapeHtml(loc.latitude)}, ${escapeHtml(loc.longitude)})
      </p>

      <div class="fd-zone">
        <p class="fd-zone-label">USDA Growing Zone</p>
        <p class="fd-zone-value">${escapeHtml(zone)}</p>
      </div>

      <hr class="fd-divider" />

      ${renderTimeline(frost)}

      <hr class="fd-divider" />

      ${renderFrostTable(frost)}
    </div>
  `;
}

function renderFrostTable(frost: FrostData): string {
  const rows = [
    { label: 'Air Frost', period: frost.airFrost },
    { label: 'Light Ground Frost', period: frost.lightGroundFrost },
    { label: 'Hard Ground Frost', period: frost.hardGroundFrost },
  ];

  return `
    <table class="fd-table">
      <thead>
        <tr><th></th><th>First</th><th>Last</th></tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <th>${r.label}</th>
            <td>${getFrostText(r.period, 'first')}</td>
            <td>${getFrostText(r.period, 'last')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export function renderLoading(): string {
  return `<div class="fd-loading"><div class="fd-spinner"></div></div>`;
}

export function renderError(message: string): string {
  return `<div class="fd-message fd-message-error">${escapeHtml(message)}</div>`;
}

export function renderLimitReached(): string {
  return `
    <div class="fd-message fd-message-limit">
      Free lookup limit reached. Search more locations at
      <a href="https://frostdates.com" target="_blank" rel="noopener">frostdates.com</a>
    </div>
  `;
}

export function renderBranding(): string {
  return `
    <div class="fd-branding">
      Powered by <a href="https://frostdates.com" target="_blank" rel="noopener">frostdates.com</a>
    </div>
  `;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
