import { Router, Request, Response } from 'express';

const router = Router();

const ONEMAP_BASE_URL = 'https://www.onemap.gov.sg/api';
const ONEMAP_TOKEN_URL = `${ONEMAP_BASE_URL}/auth/post/getToken`;

interface CachedOneMapToken {
  token: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedToken: CachedOneMapToken | null = null;

/**
 * Retrieves OneMap credentials from environment variables.
 * Credential is ONLY read inside files in repo-root api/ directory.
 */
function getCredentials(): {
  email?: string;
  password?: string;
  staticToken?: string;
} | null {
  const email = process.env.ONEMAP_EMAIL || process.env.ONE_MAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD || process.env.ONE_MAP_PASSWORD;
  const staticToken =
    process.env.ONEMAP_API_KEY ||
    process.env.ONEMAP_TOKEN ||
    process.env.ONE_MAP_API_KEY ||
    process.env.ONE_MAP_TOKEN;

  if (staticToken && staticToken.trim() !== '' && staticToken !== 'MY_ONEMAP_KEY') {
    return { staticToken: staticToken.trim() };
  }

  if (
    email &&
    password &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    email !== 'MY_ONEMAP_EMAIL'
  ) {
    return { email: email.trim(), password: password.trim() };
  }

  return null;
}

/**
 * Retrieves a valid OneMap token.
 * Either returns static token or mints/refreshes token using email & password.
 */
async function getOrFetchToken(forceRefresh = false): Promise<string> {
  const creds = getCredentials();
  if (!creds) {
    throw new Error('credential not configured');
  }

  if (creds.staticToken) {
    return creds.staticToken;
  }

  const now = Date.now();
  // Return cached token if valid (with 2-hour safety margin)
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now + 2 * 60 * 60 * 1000) {
    return cachedToken.token;
  }

  const response = await fetch(ONEMAP_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email: creds.email,
      password: creds.password,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OneMap Token API returned HTTP ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const token = json.access_token || json.token || json.Token || json.Result;

  if (!token) {
    throw new Error(json.error || json.message || 'Failed to obtain access token from OneMap');
  }

  // Tokens typically last 3 days (259200s). Default expiry if not specified: 72 hours.
  let expiresAt = now + 72 * 60 * 60 * 1000;
  if (json.expiry_timestamp) {
    const parsed = Number(json.expiry_timestamp);
    if (!isNaN(parsed)) {
      expiresAt = parsed > 1e11 ? parsed : parsed * 1000;
    }
  }

  cachedToken = {
    token: String(token).trim(),
    expiresAt,
  };

  return cachedToken.token;
}

/**
 * Helper to call OneMap with Authorization header.
 * Retries once with token refresh on 401/403.
 */
async function callOneMapApi(url: string): Promise<{ ok: boolean; status: number; data: any }> {
  let token = await getOrFetchToken();

  let response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: token,
      accept: 'application/json',
    },
  });

  // If unauthorized, attempt to force-refresh token and retry once
  if (response.status === 401 || response.status === 403) {
    token = await getOrFetchToken(true);
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
        accept: 'application/json',
      },
    });
  }

  const data = await response.json().catch(async () => {
    const text = await response.text();
    return { raw: text };
  });

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

/**
 * 1. Endpoint: Mint a token / inspect token status
 * POST or GET /api/onemap/token
 */
router.all('/token', async (_req: Request, res: Response) => {
  const creds = getCredentials();
  if (!creds) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const token = await getOrFetchToken();
    return res.json({
      status: 'Success',
      expiresAt: cachedToken ? new Date(cachedToken.expiresAt).toISOString() : 'configured via static token',
      tokenPreview: `${token.slice(0, 8)}...${token.slice(-6)}`,
    });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg === 'credential not configured') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    return res.status(502).json({
      error: 'Failed to mint OneMap access token',
      details: errMsg,
    });
  }
});

/**
 * 2. Endpoint: Geocode / Search
 * GET /api/onemap/search
 * Query params: searchVal (required), returnGeom (default Y), getAddrDetails (default Y), pageNum (default 1)
 */
router.get('/search', async (req: Request, res: Response) => {
  const creds = getCredentials();
  if (!creds) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const searchVal = (req.query.searchVal || req.query.query || req.query.q) as string;
  if (!searchVal) {
    return res.status(400).json({ error: 'searchVal query parameter is required' });
  }

  const returnGeom = (req.query.returnGeom as string) || 'Y';
  const getAddrDetails = (req.query.getAddrDetails as string) || 'Y';
  const pageNum = (req.query.pageNum as string) || '1';

  try {
    const url = new URL(`${ONEMAP_BASE_URL}/common/elastic/search`);
    url.searchParams.set('searchVal', searchVal.trim());
    url.searchParams.set('returnGeom', returnGeom);
    url.searchParams.set('getAddrDetails', getAddrDetails);
    url.searchParams.set('pageNum', pageNum);

    const { ok, status, data } = await callOneMapApi(url.toString());
    if (!ok) {
      return res.status(status).json(data);
    }
    return res.json(data);
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg === 'credential not configured') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    return res.status(502).json({
      error: 'Failed to query OneMap search service',
      details: errMsg,
    });
  }
});

/**
 * 3. Endpoint: Reverse Geocode
 * GET /api/onemap/revgeocode or /api/onemap/reverse-geocode
 * Query params: location (e.g. 1.3,103.8), buffer (default 40), addressType (default All), otherFeatures (optional)
 */
router.get(['/revgeocode', '/reverse-geocode'], async (req: Request, res: Response) => {
  const creds = getCredentials();
  if (!creds) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const location = (req.query.location || req.query.latlng || req.query.coords) as string;
  if (!location) {
    return res.status(400).json({ error: 'location query parameter (lat,lng) is required (e.g. 1.3,103.8)' });
  }

  const buffer = (req.query.buffer as string) || '40';
  const addressType = (req.query.addressType as string) || 'All';
  const otherFeatures = req.query.otherFeatures as string | undefined;

  try {
    const url = new URL(`${ONEMAP_BASE_URL}/public/revgeocode`);
    url.searchParams.set('location', location.trim());
    url.searchParams.set('buffer', buffer);
    url.searchParams.set('addressType', addressType);
    if (otherFeatures) {
      url.searchParams.set('otherFeatures', otherFeatures);
    }

    const { ok, status, data } = await callOneMapApi(url.toString());
    if (!ok) {
      return res.status(status).json(data);
    }
    return res.json(data);
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg === 'credential not configured') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    return res.status(502).json({
      error: 'Failed to query OneMap reverse geocode service',
      details: errMsg,
    });
  }
});

/**
 * 4. Endpoint: Routing (walk | drive | cycle | pt)
 * GET /api/onemap/route or /api/onemap/routing
 * Query params: start (lat,lng), end (lat,lng), routeType (walk | drive | cycle | pt)
 * Optional: date, time, mode, maxWalkDistance, numItineraries
 */
router.get(['/route', '/routing'], async (req: Request, res: Response) => {
  const creds = getCredentials();
  if (!creds) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const start = (req.query.start || req.query.origin) as string;
  const end = (req.query.end || req.query.destination) as string;
  const routeType = ((req.query.routeType || req.query.mode || 'walk') as string).toLowerCase();

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end query parameters (lat,lng) are required' });
  }

  const validRouteTypes = ['walk', 'drive', 'cycle', 'pt'];
  const finalRouteType = validRouteTypes.includes(routeType) ? routeType : 'walk';

  try {
    const url = new URL(`${ONEMAP_BASE_URL}/public/routingsvc/route`);
    url.searchParams.set('start', start.trim());
    url.searchParams.set('end', end.trim());
    url.searchParams.set('routeType', finalRouteType);

    // Forward additional optional routing parameters if provided
    const optionalParams = ['date', 'time', 'mode', 'maxWalkDistance', 'numItineraries'];
    for (const p of optionalParams) {
      if (req.query[p]) {
        url.searchParams.set(p, String(req.query[p]));
      }
    }

    const { ok, status, data } = await callOneMapApi(url.toString());
    if (!ok) {
      return res.status(status).json(data);
    }
    return res.json(data);
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg === 'credential not configured') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    return res.status(502).json({
      error: 'Failed to calculate route with OneMap routing service',
      details: errMsg,
    });
  }
});

export default router;
