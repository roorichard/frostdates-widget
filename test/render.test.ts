import { describe, it, expect } from 'vitest';
import { renderResults, renderError, renderLimitReached, renderBranding } from '../src/render';
import type { FrostDatesResponse } from '../src/types';

const sampleResponse: FrostDatesResponse = {
  location: {
    latitude: '51.509',
    longitude: '-0.118',
    areaName: 'London',
    region: 'City of London',
    country: 'United Kingdom',
  },
  frostDates: {
    airFrost: {
      first: { day: 6, month: 11, dateString: '6 November' },
      last: { day: 5, month: 4, dateString: '5 April' },
    },
    lightGroundFrost: {
      first: { day: 12, month: 10, dateString: '12 October' },
      last: { day: 30, month: 4, dateString: '30 April' },
    },
    hardGroundFrost: {
      first: { day: 1, month: 12, dateString: '1 December' },
      last: { day: 6, month: 3, dateString: '6 March' },
    },
  },
  usdaZone: '9a',
};

describe('renderResults', () => {
  it('contains the location name', () => {
    const html = renderResults(sampleResponse);
    expect(html).toContain('London');
    expect(html).toContain('City of London');
    expect(html).toContain('United Kingdom');
  });

  it('contains the USDA zone', () => {
    const html = renderResults(sampleResponse);
    expect(html).toContain('9a');
  });

  it('contains frost table rows', () => {
    const html = renderResults(sampleResponse);
    expect(html).toContain('Air Frost');
    expect(html).toContain('Light Ground Frost');
    expect(html).toContain('Hard Ground Frost');
  });

  it('contains the timeline', () => {
    const html = renderResults(sampleResponse);
    expect(html).toContain('fd-timeline-container');
  });

  it('escapes HTML in location names', () => {
    const xssResponse: FrostDatesResponse = {
      ...sampleResponse,
      location: {
        ...sampleResponse.location,
        areaName: '<script>alert(1)</script>',
      },
    };
    const html = renderResults(xssResponse);
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});

describe('renderError', () => {
  it('outputs the message in the error div', () => {
    const html = renderError('Something went wrong');
    expect(html).toContain('fd-message-error');
    expect(html).toContain('Something went wrong');
  });
});

describe('renderLimitReached', () => {
  it('contains the frostdates.com link', () => {
    const html = renderLimitReached();
    expect(html).toContain('frostdates.com');
    expect(html).toContain('href="https://frostdates.com"');
  });
});

describe('renderBranding', () => {
  it('contains the frostdates.com link', () => {
    const html = renderBranding();
    expect(html).toContain('frostdates.com');
    expect(html).toContain('href="https://frostdates.com"');
  });
});
