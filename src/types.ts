export interface FrostDate {
  day: number;
  month: number;
  dateString: string;
}

export interface FrostPeriod {
  first: FrostDate;
  last: FrostDate;
  alwaysAbove?: boolean;
  alwaysBelow?: boolean;
}

export interface FrostData {
  airFrost: FrostPeriod;
  lightGroundFrost: FrostPeriod;
  hardGroundFrost: FrostPeriod;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  areaName: string;
  region: string;
  country: string;
}

export interface LocationOption {
  areaName: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
}

export interface FrostDatesResponse {
  location: LocationData;
  frostDates: FrostData;
  usdaZone: string;
  avgMinTemps?: number[];
  avgMaxTemps?: number[];
  monthAvgs?: MonthAvg[];
}

export interface MonthAvg {
  month: number;
  avgMinTemp: number;
  avgMaxTemp: number;
  absMinTemp: number;
  absMaxTemp: number;
  avgTemp: number;
}

export interface WidgetConfig {
  siteId: string;
  container: string | HTMLElement;
  theme?: 'light' | 'dark';
}
