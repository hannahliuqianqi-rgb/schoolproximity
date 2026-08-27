export type FlatType = '3-Room' | '4-Room' | '5-Room' | 'Executive' | 'All';

export type SchoolPhase = 'Phase 1' | 'Phase 2A' | 'Phase 2B' | 'Phase 2C' | 'Phase 2C (Supplementary)';

export interface PricePoint {
  month: string;
  room3?: number;
  room4?: number;
  room5?: number;
  executive?: number;
}

export interface HdbTransaction {
  id: string;
  schoolId: string;
  blockStreet: string;
  builtYear: number;
  floorAreaSqm: number;
  flatType: '3-Room' | '4-Room' | '5-Room' | 'Executive';
  distanceKm: number;
  price: number;
  dateStr: string;
  storeyRange?: string;
  psf?: number;
}

export interface NearbyMrt {
  name: string;
  line: string;
  distKm: number;
}

export interface School {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  planningArea: string;
  phaseCategory: SchoolPhase;
  distanceToUser?: number; // e.g. 0.8 km
  avgPsf1km: number;
  psfChangeQoq: number; // e.g. +3.2%
  transactions6m: number;
  avg4RoomPrice: number;
  priceTrendYoy: number; // e.g. +4.2%
  trendType: 'Increasing' | 'Stable' | 'Moderate';
  hdbBlocks1kmCount: number;
  mrtStationsNearbyCount: number;
  mrtNearby: NearbyMrt[];
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage on custom map (0 - 100)
    mapY: number; // percentage on custom map (0 - 100)
  };
  priceHistory: PricePoint[];
  transactions: HdbTransaction[];
  upcomingMopUnits?: number;
  description?: string;
}

export interface MopAlertItem {
  id: string;
  schoolId: string;
  schoolName: string;
  estateName: string;
  blockAddress: string;
  estMopDate: string;
  unitsCount: number;
  flatTypes: string[];
  distanceKm: number;
  status: 'Approaching MOP (Under 6 Mths)' | 'MOP in 2025' | 'MOP in 2026' | 'Freshly MOP-ed';
}

export type ActiveTab = 'home' | 'find-schools' | 'hdb-insights' | 'mop-alerts' | 'faq';
