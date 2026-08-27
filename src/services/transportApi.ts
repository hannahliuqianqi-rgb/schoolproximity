/**
 * Client-side service for LTA Transport Data.
 * Calls the server-side API proxy (/api/transport/*).
 * All secrets remain securely on the server in process.env.
 */

export interface BusArrivalNextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: 'SEA' | 'SDA' | 'LSD' | string; // Seats Available, Standing Available, Limited Standing
  Feature: 'WAB' | string; // Wheelchair accessible
  Type: 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus: BusArrivalNextBus;
  NextBus2?: BusArrivalNextBus;
  NextBus3?: BusArrivalNextBus;
}

export interface BusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: BusServiceArrival[];
  error?: string;
}

export interface CarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string;
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface CarparkAvailabilityResponse {
  'odata.metadata'?: string;
  value: CarparkItem[];
  error?: string;
}

export interface TrafficIncidentItem {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface TrafficIncidentsResponse {
  'odata.metadata'?: string;
  value: TrafficIncidentItem[];
  error?: string;
}

export interface TrainServiceAlertResponse {
  'odata.metadata'?: string;
  Status: number; // 1 = Normal, 2 = Disrupted
  Message?: Array<{
    Line?: string;
    Direction?: string;
    Stations?: string;
    FreePublicBus?: string;
    FreeMrtShuttle?: string;
    MRTShuttleDirection?: string;
    Message?: string;
    CreatedDate?: string;
  }>;
  AffectedSegments?: Array<{
    Line: string;
    Direction: string;
    Stations: string;
    FreePublicBus: string;
    FreeMrtShuttle: string;
    MRTShuttleDirection: string;
  }>;
  error?: string;
}

export async function fetchBusArrival(busStopCode: string, serviceNo?: string): Promise<{ data?: BusArrivalResponse; error?: string }> {
  try {
    const params = new URLSearchParams();
    params.set('BusStopCode', busStopCode);
    if (serviceNo) params.set('ServiceNo', serviceNo);

    const res = await fetch(`/api/transport/bus-arrival?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export async function fetchCarparkAvailability(skip?: number): Promise<{ data?: CarparkAvailabilityResponse; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (typeof skip === 'number') params.set('$skip', String(skip));

    const res = await fetch(`/api/transport/carpark-availability?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export async function fetchTrafficIncidents(): Promise<{ data?: TrafficIncidentsResponse; error?: string }> {
  try {
    const res = await fetch('/api/transport/traffic-incidents');
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export async function fetchTrainServiceAlerts(): Promise<{ data?: TrainServiceAlertResponse; error?: string }> {
  try {
    const res = await fetch('/api/transport/train-service-alerts');
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}
