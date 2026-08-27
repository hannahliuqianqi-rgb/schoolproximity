import { School, NearbyMrt, PricePoint, HdbTransaction } from '../types';
import { searchOneMap, OneMapSearchResultItem } from './onemapApi';

/**
 * Calculates percentage mapX (0-100) and mapY (0-100) on Singapore island bounding box:
 * Approx Bounding Box:
 * Min Lat: 1.220, Max Lat: 1.475
 * Min Lng: 103.600, Max Lng: 104.040
 */
export function calculateMapCoordinates(lat: number, lng: number): { mapX: number; mapY: number } {
  const minLat = 1.22;
  const maxLat = 1.475;
  const minLng = 103.6;
  const maxLng = 104.04;

  const rawX = ((lng - minLng) / (maxLng - minLng)) * 100;
  const rawY = ((maxLat - lat) / (maxLat - minLat)) * 100;

  // Clamp within 5% to 95%
  const mapX = Math.max(5, Math.min(95, Math.round(rawX * 10) / 10));
  const mapY = Math.max(5, Math.min(95, Math.round(rawY * 10) / 10));

  return { mapX, mapY };
}

/**
 * Comprehensive Singapore Planning Area benchmark pricing
 */
const PLANNING_AREA_BENCHMARKS: Record<
  string,
  { avgPsf: number; avg4Room: number; trend: 'Increasing' | 'Stable' | 'Moderate'; trendYoy: number }
> = {
  'Bukit Timah': { avgPsf: 942, avg4Room: 850000, trend: 'Increasing', trendYoy: 4.2 },
  Bishan: { avgPsf: 820, avg4Room: 780000, trend: 'Increasing', trendYoy: 4.8 },
  'Marine Parade': { avgPsf: 765, avg4Room: 720000, trend: 'Stable', trendYoy: 2.1 },
  Novena: { avgPsf: 880, avg4Room: 810000, trend: 'Increasing', trendYoy: 3.9 },
  'Bukit Merah': { avgPsf: 860, avg4Room: 830000, trend: 'Increasing', trendYoy: 4.5 },
  Queenstown: { avgPsf: 890, avg4Room: 860000, trend: 'Increasing', trendYoy: 4.6 },
  'Ang Mo Kio': { avgPsf: 640, avg4Room: 590000, trend: 'Moderate', trendYoy: 2.8 },
  Bedok: { avgPsf: 620, avg4Room: 570000, trend: 'Moderate', trendYoy: 2.5 },
  'Bukit Batok': { avgPsf: 590, avg4Room: 540000, trend: 'Moderate', trendYoy: 3.1 },
  'Bukit Panjang': { avgPsf: 570, avg4Room: 520000, trend: 'Moderate', trendYoy: 2.9 },
  'Choa Chu Kang': { avgPsf: 550, avg4Room: 510000, trend: 'Moderate', trendYoy: 2.4 },
  Clementi: { avgPsf: 780, avg4Room: 730000, trend: 'Increasing', trendYoy: 3.8 },
  Geylang: { avgPsf: 690, avg4Room: 640000, trend: 'Moderate', trendYoy: 3.0 },
  Hougang: { avgPsf: 610, avg4Room: 560000, trend: 'Moderate', trendYoy: 3.2 },
  'Jurong East': { avgPsf: 630, avg4Room: 580000, trend: 'Moderate', trendYoy: 3.4 },
  'Jurong West': { avgPsf: 560, avg4Room: 515000, trend: 'Moderate', trendYoy: 2.2 },
  Kallang: { avgPsf: 770, avg4Room: 710000, trend: 'Increasing', trendYoy: 3.6 },
  'Pasir Ris': { avgPsf: 580, avg4Room: 535000, trend: 'Moderate', trendYoy: 2.7 },
  Punggol: { avgPsf: 650, avg4Room: 595000, trend: 'Increasing', trendYoy: 3.9 },
  Sembawang: { avgPsf: 530, avg4Room: 495000, trend: 'Moderate', trendYoy: 2.0 },
  Sengkang: { avgPsf: 630, avg4Room: 580000, trend: 'Increasing', trendYoy: 3.5 },
  Serangoon: { avgPsf: 710, avg4Room: 660000, trend: 'Increasing', trendYoy: 3.7 },
  Tampines: { avgPsf: 640, avg4Room: 590000, trend: 'Moderate', trendYoy: 2.9 },
  'Toa Payoh': { avgPsf: 790, avg4Room: 740000, trend: 'Increasing', trendYoy: 4.1 },
  Woodlands: { avgPsf: 540, avg4Room: 505000, trend: 'Moderate', trendYoy: 2.3 },
  Yishun: { avgPsf: 560, avg4Room: 520000, trend: 'Moderate', trendYoy: 2.6 },
  Central: { avgPsf: 920, avg4Room: 870000, trend: 'Increasing', trendYoy: 4.4 }
};

/**
 * Generates realistic price trends for any school or location
 */
function generatePriceHistory(base4Room: number): PricePoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => {
    const factor = 0.94 + (idx / 11) * 0.08;
    return {
      month,
      room3: Math.round((base4Room * 0.65 * factor) / 5000) * 5000,
      room4: Math.round((base4Room * factor) / 5000) * 5000,
      room5: Math.round((base4Room * 1.35 * factor) / 5000) * 5000,
      executive: Math.round((base4Room * 1.65 * factor) / 5000) * 5000,
    };
  });
}

/**
 * Generates nearby transaction sample list
 */
function generateTransactions(
  schoolId: string,
  schoolName: string,
  basePsf: number,
  base4Room: number
): HdbTransaction[] {
  const shortName = schoolName.replace(' Primary School', '').replace(' Primary', '').replace(' School', '');
  return [
    {
      id: `tx-${schoolId}-1`,
      schoolId,
      blockStreet: `Blk 12 ${shortName} Walk`,
      builtYear: 2016,
      floorAreaSqm: 93,
      flatType: '4-Room',
      distanceKm: 0.35,
      price: Math.round(base4Room * 1.02),
      dateStr: 'Jan 2025',
      storeyRange: '10 to 12',
      psf: basePsf + 15,
    },
    {
      id: `tx-${schoolId}-2`,
      schoolId,
      blockStreet: `Blk 8 ${shortName} Crescent`,
      builtYear: 2014,
      floorAreaSqm: 112,
      flatType: '5-Room',
      distanceKm: 0.55,
      price: Math.round(base4Room * 1.32),
      dateStr: 'Dec 2024',
      storeyRange: '13 to 15',
      psf: basePsf - 10,
    },
    {
      id: `tx-${schoolId}-3`,
      schoolId,
      blockStreet: `Blk 22 ${shortName} Avenue`,
      builtYear: 2017,
      floorAreaSqm: 68,
      flatType: '3-Room',
      distanceKm: 0.72,
      price: Math.round(base4Room * 0.68),
      dateStr: 'Nov 2024',
      storeyRange: '07 to 09',
      psf: basePsf + 25,
    },
    {
      id: `tx-${schoolId}-4`,
      schoolId,
      blockStreet: `Blk 16 ${shortName} Way`,
      builtYear: 2015,
      floorAreaSqm: 95,
      flatType: '4-Room',
      distanceKm: 0.42,
      price: Math.round(base4Room * 0.98),
      dateStr: 'Oct 2024',
      storeyRange: '04 to 06',
      psf: basePsf - 5,
    },
  ];
}

/**
 * Creates a standard School object from a OneMap search result item
 */
export function convertOneMapResultToSchool(item: OneMapSearchResultItem): School {
  const lat = parseFloat(item.LATITUDE);
  const lng = parseFloat(item.LONGITUDE || item.LONGTITUDE || '103.8');
  const { mapX, mapY } = calculateMapCoordinates(lat, lng);

  const cleanName = item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL;
  const address = item.ADDRESS || `${item.BLK_NO} ${item.ROAD_NAME}, Singapore ${item.POSTAL}`;
  const postalCode = item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : 'Singapore';

  // Attempt to deduce planning area from address / road
  let planningArea = 'Singapore';
  for (const area of Object.keys(PLANNING_AREA_BENCHMARKS)) {
    if (address.toLowerCase().includes(area.toLowerCase()) || cleanName.toLowerCase().includes(area.toLowerCase())) {
      planningArea = area;
      break;
    }
  }

  const benchmark = PLANNING_AREA_BENCHMARKS[planningArea] || {
    avgPsf: 680,
    avg4Room: 620000,
    trend: 'Increasing',
    trendYoy: 3.5,
  };

  const id = `om-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.POSTAL || Math.floor(Math.random() * 1000)}`;

  const isPrimary = cleanName.toLowerCase().includes('primary') || cleanName.toLowerCase().includes('school');

  return {
    id,
    name: cleanName,
    address,
    postalCode,
    planningArea,
    phaseCategory: isPrimary ? 'Phase 2C' : 'Phase 2C',
    distanceToUser: 0.8,
    avgPsf1km: benchmark.avgPsf,
    psfChangeQoq: 2.8,
    transactions6m: 95,
    avg4RoomPrice: benchmark.avg4Room,
    priceTrendYoy: benchmark.trendYoy,
    trendType: benchmark.trend,
    hdbBlocks1kmCount: 64,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Nearby Station', line: 'Transit Network', distKm: 0.45 },
    ],
    coordinates: {
      lat,
      lng,
      mapX,
      mapY,
    },
    priceHistory: generatePriceHistory(benchmark.avg4Room),
    transactions: generateTransactions(id, cleanName, benchmark.avgPsf, benchmark.avg4Room),
    upcomingMopUnits: 280,
    description: `Geocoded location verified via OneMap Singapore API. 1km priority buffer active around ${cleanName}.`,
  };
}

/**
 * Performs dynamic search across local directory + OneMap Live API
 */
export async function performDynamicSearch(
  query: string,
  localSchools: School[]
): Promise<{
  localMatches: School[];
  oneMapMatches: School[];
  oneMapRawResults: OneMapSearchResultItem[];
  error?: string;
}> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return { localMatches: [], oneMapMatches: [], oneMapRawResults: [] };
  }

  // 1. Instant local filter
  const localMatches = localSchools.filter(
    (s) =>
      s.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      s.planningArea.toLowerCase().includes(trimmed.toLowerCase()) ||
      s.address.toLowerCase().includes(trimmed.toLowerCase()) ||
      s.postalCode.includes(trimmed)
  );

  // 2. Query OneMap Search API
  try {
    const { data, error } = await searchOneMap(trimmed);
    if (error || !data || !Array.isArray(data.results)) {
      return { localMatches, oneMapMatches: [], oneMapRawResults: [], error };
    }

    // Filter and transform results
    const rawResults = data.results.slice(0, 8);
    const oneMapMatches = rawResults.map(convertOneMapResultToSchool);

    return {
      localMatches,
      oneMapMatches,
      oneMapRawResults: rawResults,
    };
  } catch (err: any) {
    return {
      localMatches,
      oneMapMatches: [],
      oneMapRawResults: [],
      error: err.message,
    };
  }
}
