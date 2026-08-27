/**
 * Client-side service for OneMap API.
 * Calls the server-side API proxy (/api/onemap/*).
 * All credentials (email/password/token) remain strictly on the backend.
 */

export interface OneMapSearchResultItem {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
  LONGTITUDE?: string;
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapSearchResultItem[];
  error?: string;
}

export interface OneMapReverseGeocodeItem {
  BUILDINGNAME: string;
  BLOCK: string;
  ROAD: string;
  POSTALCODE: string;
  XCOORD: string;
  YCOORD: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapReverseGeocodeResponse {
  GeocodeInfo?: OneMapReverseGeocodeItem[];
  error?: string;
}

export interface OneMapRouteResponse {
  status_message?: string;
  route_geometry?: string;
  route_instructions?: string[][];
  route_name?: string[];
  route_summary?: {
    total_distance: number;
    total_time: number;
    start_point: string;
    end_point: string;
  };
  plan?: {
    date: number;
    from: { name: string; lat: number; lon: number };
    to: { name: string; lat: number; lon: number };
    itineraries: Array<{
      duration: number;
      startTime: number;
      endTime: number;
      walkTime: number;
      transitTime: number;
      waitingTime: number;
      walkDistance: number;
      legs: Array<{
        mode: string;
        route?: string;
        agencyName?: string;
        from: { name: string; lat: number; lon: number };
        to: { name: string; lat: number; lon: number };
        duration: number;
        distance: number;
        legGeometry: { points: string };
      }>;
    }>;
  };
  error?: string;
}

/**
 * Search/Geocode Singapore addresses, buildings, and postal codes via OneMap.
 */
export async function searchOneMap(searchVal: string, pageNum = 1): Promise<{
  data?: OneMapSearchResponse;
  error?: string;
}> {
  try {
    const params = new URLSearchParams({
      searchVal,
      returnGeom: 'Y',
      getAddrDetails: 'Y',
      pageNum: String(pageNum),
    });

    const res = await fetch(`/api/onemap/search?${params.toString()}`);
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
 * Reverse geocode coordinates to postal address and building details.
 */
export async function reverseGeocodeOneMap(lat: number | string, lng: number | string, buffer = 40): Promise<{
  data?: OneMapReverseGeocodeResponse;
  error?: string;
}> {
  try {
    const location = `${lat},${lng}`;
    const params = new URLSearchParams({
      location,
      buffer: String(buffer),
      addressType: 'All',
    });

    const res = await fetch(`/api/onemap/revgeocode?${params.toString()}`);
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
 * Calculate multi-modal routes (walk, drive, cycle, pt) via OneMap.
 */
export async function calculateRouteOneMap(
  startLat: number | string,
  startLng: number | string,
  endLat: number | string,
  endLng: number | string,
  routeType: 'walk' | 'drive' | 'cycle' | 'pt' = 'walk'
): Promise<{
  data?: OneMapRouteResponse;
  error?: string;
}> {
  try {
    const params = new URLSearchParams({
      start: `${startLat},${startLng}`,
      end: `${endLat},${endLng}`,
      routeType,
    });

    const res = await fetch(`/api/onemap/route?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}
