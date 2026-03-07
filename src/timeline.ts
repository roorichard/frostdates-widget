import type { FrostData } from './types';

interface RiskLevel {
  key: 'safest' | 'airFrost' | 'lightGroundFrost' | 'hardGroundFrost';
  label: string;
  cssClass: string;
}

interface Segment {
  risk: RiskLevel['key'];
  duration: number;
}

const RISK_LEVELS: RiskLevel[] = [
  { key: 'safest', label: 'Safest (unlikely)', cssClass: 'fd-risk-safest' },
  { key: 'airFrost', label: 'Air Frost possible', cssClass: 'fd-risk-air' },
  { key: 'lightGroundFrost', label: 'Light Ground Frost possible', cssClass: 'fd-risk-light-ground' },
  { key: 'hardGroundFrost', label: 'Hard Ground Frost possible', cssClass: 'fd-risk-hard-ground' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDayOfYear(month: number, day: number): number {
  const daysInMonths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let d = 0;
  for (let i = 1; i < month; i++) d += daysInMonths[i];
  return d + day;
}

function dayOfYearToday(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function renderTimeline(frostData: FrostData): string {
  const frostPeriods: Record<string, { start: number; end: number }> = {};

  for (const level of RISK_LEVELS) {
    if (level.key === 'safest') continue;
    const period = frostData[level.key as keyof FrostData];
    if (period && period.first && period.last && !period.alwaysAbove && !period.alwaysBelow) {
      frostPeriods[level.key] = {
        start: getDayOfYear(period.first.month, period.first.day),
        end: getDayOfYear(period.last.month, period.last.day),
      };
    }
  }

  const baselineRisk: RiskLevel['key'] = frostData.airFrost?.alwaysBelow ? 'airFrost' : 'safest';
  const todayNumber = dayOfYearToday();
  let todayRiskLabel = '';

  const yearTimeline: RiskLevel['key'][] = [];
  for (let day = 1; day <= 365; day++) {
    let risk: RiskLevel['key'] = baselineRisk;
    const checkPeriod = (start: number, end: number) =>
      start > end ? day >= start || day <= end : day >= start && day <= end;

    if (frostPeriods.hardGroundFrost && checkPeriod(frostPeriods.hardGroundFrost.start, frostPeriods.hardGroundFrost.end)) {
      risk = 'hardGroundFrost';
    } else if (frostPeriods.lightGroundFrost && checkPeriod(frostPeriods.lightGroundFrost.start, frostPeriods.lightGroundFrost.end)) {
      risk = 'lightGroundFrost';
    } else if (frostPeriods.airFrost && checkPeriod(frostPeriods.airFrost.start, frostPeriods.airFrost.end)) {
      risk = 'airFrost';
    }

    if (day === todayNumber) {
      todayRiskLabel = RISK_LEVELS.find(l => l.key === risk)?.label || '';
    }
    yearTimeline.push(risk);
  }

  // Build segments
  const segments: Segment[] = [];
  if (yearTimeline.length > 0) {
    let current: Segment = { risk: yearTimeline[0], duration: 1 };
    for (let i = 1; i < yearTimeline.length; i++) {
      if (yearTimeline[i] === current.risk) {
        current.duration++;
      } else {
        segments.push(current);
        current = { risk: yearTimeline[i], duration: 1 };
      }
    }
    segments.push(current);
  }

  // Frost-free summary
  let frostFreeHtml = '';
  if (frostData.airFrost?.first && frostData.airFrost?.last && frostPeriods.airFrost) {
    const startStr = frostData.airFrost.last.dateString;
    const endStr = frostData.airFrost.first.dateString;
    const startDay = frostPeriods.airFrost.end;
    const endDay = frostPeriods.airFrost.start;
    const days = (endDay > startDay ? endDay - startDay : (365 - startDay) + endDay) - 1;
    frostFreeHtml = `<p class="fd-summary-text">Frost free growing season: <strong>${startStr}</strong> to <strong>${endStr}</strong> (approximately <strong>${days}</strong> frost free days).</p>`;
  }

  let tenderHtml = '';
  if (frostData.lightGroundFrost?.first && frostData.lightGroundFrost?.last && frostPeriods.lightGroundFrost) {
    const startStr = frostData.lightGroundFrost.last.dateString;
    const endStr = frostData.lightGroundFrost.first.dateString;
    const startDay = frostPeriods.lightGroundFrost.end;
    const endDay = frostPeriods.lightGroundFrost.start;
    const days = endDay > startDay ? endDay - startDay : (365 - startDay) + endDay;
    tenderHtml = `<p class="fd-summary-text">With plant protection, the growing season stretches from <strong>${startStr}</strong> to <strong>${endStr}</strong> (<strong>${days}</strong> days).</p>`;
  }

  // Active risk levels for legend
  const activeRisks = RISK_LEVELS.filter(l => segments.some(s => s.risk === l.key));

  return `
    <div class="fd-timeline-container">
      ${todayRiskLabel ? `
        <p class="fd-current-risk">Current Risk: <strong>${todayRiskLabel}</strong></p>
        <p class="fd-risk-note">Based on historical data for today's date.</p>
      ` : ''}
      ${frostFreeHtml}
      ${tenderHtml}
      <div class="fd-months">
        ${MONTHS.map(m => `<span>${m}</span>`).join('')}
      </div>
      <div class="fd-bar">
        ${segments.map(s => {
          const width = (s.duration / 365) * 100;
          const config = RISK_LEVELS.find(l => l.key === s.risk);
          return `<div class="fd-segment ${config?.cssClass || ''}" style="width:${width}%" title="${config?.label || ''} (${s.duration} days)"></div>`;
        }).join('')}
      </div>
      <ul class="fd-legend">
        ${activeRisks.reverse().map(l => `
          <li><span class="fd-legend-swatch ${l.cssClass}"></span> ${l.label}</li>
        `).join('')}
      </ul>
    </div>
  `;
}
