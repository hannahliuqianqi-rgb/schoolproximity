/**
 * Client-side service for URA (Urban Redevelopment Authority) Data Service.
 * Calls the server-side API proxy (/api/ura/*).
 * All credentials and daily tokens remain strictly server-side.
 */

export interface UraTransactionItem {
  area: string;
  floorRange: string;
  noOfUnits: string;
  contractDate: string;
  typeOfSale: string;
  price: string;
  propertyType: string;
  district: string;
  typeOfArea: string;
  nettPrice?: string;
}

export interface UraProjectItem {
  street: string;
  project: string;
  marketSegment: string;
  x: string;
  y: string;
  transaction: UraTransactionItem[];
}

export interface UraResidentialTransactionsResponse {
  Status: string;
  Message?: string;
  totalBatches?: number;
  totalProjects?: number;
  Result?: UraProjectItem[];
  error?: string;
}

export interface UraCarparkItem {
  ppCode: string;
  ppName: string;
  geometries?: Array<{
    coordinates: string;
  }>;
  lotsAvailable: string;
  lotType: string;
  parkCapacity: string;
}

export interface UraCarparkAvailabilityResponse {
  Status: string;
  Message?: string;
  Result?: UraCarparkItem[];
  error?: string;
}

export interface UraCarparkDetailItem {
  ppCode: string;
  ppName: string;
  vehCat: string;
  startTime: string;
  endTime: string;
  min: string;
  rate: string;
  weekDayMin: string;
  weekDayRate: string;
  satdayMin: string;
  satdayRate: string;
  sunPHMin: string;
  sunPHRate: string;
  remarks?: string;
}

export interface UraCarparkDetailsResponse {
  Status: string;
  Message?: string;
  Result?: UraCarparkDetailItem[];
  error?: string;
}

/**
 * Fetches private residential transactions from URA Data Service.
 * Merges all 4 batches by default unless a specific batch is passed.
 */
export async function fetchUraResidentialTransactions(batch?: number | string): Promise<{
  data?: UraResidentialTransactionsResponse;
  error?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (batch) params.set('batch', String(batch));

    const res = await fetch(`/api/ura/residential-transactions?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

/**
 * Fetches live URA carpark lot availability.
 */
export async function fetchUraCarparkAvailability(): Promise<{
  data?: UraCarparkAvailabilityResponse;
  error?: string;
}> {
  try {
    const res = await fetch('/api/ura/carpark-availability');
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

/**
 * Fetches URA carpark parking rates and operational details.
 */
export async function fetchUraCarparkDetails(): Promise<{
  data?: UraCarparkDetailsResponse;
  error?: string;
}> {
  try {
    const res = await fetch('/api/ura/carpark-details');
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}
