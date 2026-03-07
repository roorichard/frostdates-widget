import { describe, it, expect } from 'vitest';
import { renderTimeline } from '../src/timeline';
import type { FrostData } from '../src/types';

const londonFrostData: FrostData = {
  airFrost: {
    first: { day: 6, month: 10, dateString: "6 October" },
    last: { day: 5, month: 5, dateString: "5 May" },
  },
  lightGroundFrost: {
    first: { day: 6, month: 11, dateString: "6 November" },
    last: { day: 5, month: 4, dateString: "5 April" },
  },
  hardGroundFrost: {
    first: { day: 1, month: 12, dateString: "1 December" },
    last: { day: 6, month: 3, dateString: "6 March" },
  },
};

const tropicalFrostData: FrostData = {
  airFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysAbove: true },
  lightGroundFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysAbove: true },
  hardGroundFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysAbove: true },
};

const arcticFrostData: FrostData = {
  airFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysBelow: true },
  lightGroundFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysBelow: true },
  hardGroundFrost: { first: { day: 0, month: 0, dateString: "" }, last: { day: 0, month: 0, dateString: "" }, alwaysBelow: true },
};

describe('renderTimeline', () => {
  describe('typical Northern Hemisphere frost data (London-like)', () => {
    it('contains all risk level classes', () => {
      const html = renderTimeline(londonFrostData);
      expect(html).toContain('fd-risk-safest');
      expect(html).toContain('fd-risk-air');
      expect(html).toContain('fd-risk-light-ground');
      expect(html).toContain('fd-risk-hard-ground');
    });

    it('includes frost-free summary text', () => {
      const html = renderTimeline(londonFrostData);
      expect(html).toContain('Frost free growing season');
      expect(html).toContain('5 May');
      expect(html).toContain('6 October');
    });
  });

  describe('tropical location (always above)', () => {
    it('only contains fd-risk-safest', () => {
      const html = renderTimeline(tropicalFrostData);
      expect(html).toContain('fd-risk-safest');
      expect(html).not.toContain('fd-risk-air');
      expect(html).not.toContain('fd-risk-light-ground');
      expect(html).not.toContain('fd-risk-hard-ground');
    });
  });

  describe('arctic location (always below)', () => {
    it('contains fd-risk-air everywhere', () => {
      const html = renderTimeline(arcticFrostData);
      expect(html).toContain('fd-risk-air');
    });
  });
});
