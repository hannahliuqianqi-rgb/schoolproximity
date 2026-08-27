import { Router, Request, Response } from 'express';

const router = Router();

const URA_TOKEN_URL = 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1';
const URA_INVOKE_URL = 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1';

// In-memory cache for today's token
let cachedToken: {
  token: string;
  fetchedAt: number;
  dateKey: string;
} | null = null;

/**
 * Retrieves the URA Data Service AccessKey from environment variables.
 * Credential is ONLY read inside files in repo-root api/ directory.
 */
function getAccessKey(): string | null {
  const key = process.env.URA_ACCESS_KEY || process.env.URA_DATA_SERVICE_ACCESS_KEY || process.env.ACCESS_KEY;
  if (!key || key.trim() === '' || key === 'MY_URA_ACCESS_KEY') {
    return null;
  }
  return key.trim();
}

/**
 * Trades the AccessKey for today's active token.
 * Reuses cached token if fetched today, or refreshes if expired.
 */
async function getOrFetchToken(accessKey: string, forceRefresh = false): Promise<string> {
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = Date.now();

  // Return cached token if valid for today and not forced to refresh (and within 20 hours)
  if (
    !forceRefresh &&
    cachedToken &&
    cachedToken.dateKey === todayKey &&
    now - cachedToken.fetchedAt < 20 * 60 * 60 * 1000
  ) {
    return cachedToken.token;
  }

  const response = await fetch(URA_TOKEN_URL, {
    method: 'GET',
    headers: {
      AccessKey: accessKey,
      accept: 'application/json',
      'User-Agent': 'SchoolProximity-SG/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`URA Token API returned HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  const token = json.Result || json.token || json.Token;

  if (!token || json.Status !== 'Success') {
    throw new Error(
      json.Message || json.error || 'Failed to obtain token from URA Data Service'
    );
  }

  cachedToken = {
    token: String(token).trim(),
    fetchedAt: now,
    dateKey: todayKey,
  };

  return cachedToken.token;
}

/**
 * Generic helper to invoke a URA Data Service with AccessKey + Token headers.
 * Automatically retries once if token expires.
 */
async function invokeUraService(
  accessKey: string,
  serviceName: string,
  extraParams?: Record<string, string>
): Promise<any> {
  let token = await getOrFetchToken(accessKey);

  const buildUrl = () => {
    const url = new URL(URA_INVOKE_URL);
    url.searchParams.set('service', serviceName);
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.set(k, String(v));
        }
      }
    }
    return url.toString();
  };

  let response = await fetch(buildUrl(), {
    method: 'GET',
    headers: {
      AccessKey: accessKey,
      Token: token,
      accept: 'application/json',
      'User-Agent': 'SchoolProximity-SG/1.0',
    },
  });

  let data = await response.json();

  // If token is rejected or invalid, force refresh token and retry once
  if (
    !response.ok ||
    data?.Status === 'Error' ||
    (typeof data?.Message === 'string' && data.Message.toLowerCase().includes('token'))
  ) {
    token = await getOrFetchToken(accessKey, true);
    response = await fetch(buildUrl(), {
      method: 'GET',
      headers: {
        AccessKey: accessKey,
        Token: token,
        accept: 'application/json',
        'User-Agent': 'SchoolProximity-SG/1.0',
      },
    });
    data = await response.json();
  }

  return data;
}

/**
 * 1. Endpoint: Get today's active token or check status
 * GET /api/ura/token
 */
router.get('/token', async (_req: Request, res: Response) => {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const token = await getOrFetchToken(accessKey);
    return res.json({
      status: 'Success',
      tokenExpiry: cachedToken?.dateKey,
      tokenPreview: `${token.slice(0, 6)}...${token.slice(-4)}`,
    });
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to retrieve URA daily token',
      details: err?.message || String(err),
    });
  }
});

/**
 * 2. Endpoint: Private residential transactions (PMI_Resi_Transaction)
 * GET /api/ura/residential-transactions or /api/ura/pm-transactions
 * Query param: batch (optional: 1, 2, 3, 4. If omitted or 'all', fetches all 4 batches and merges them)
 */
router.get(['/residential-transactions', '/resi-transactions', '/transactions'], async (req: Request, res: Response) => {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const batchParam = (req.query.batch || req.query.Batch) as string | undefined;

  try {
    if (batchParam && ['1', '2', '3', '4'].includes(batchParam)) {
      // Single batch fetch
      const result = await invokeUraService(accessKey, 'PMI_Resi_Transaction', { batch: batchParam });
      return res.json(result);
    } else {
      // Fetch all 4 batches by postal district and merge results
      const batches = ['1', '2', '3', '4'];
      const batchResults = await Promise.all(
        batches.map((b) =>
          invokeUraService(accessKey, 'PMI_Resi_Transaction', { batch: b }).catch((err) => ({
            Status: 'Error',
            batch: b,
            error: err.message,
            Result: [],
          }))
        )
      );

      let mergedList: any[] = [];
      for (const resItem of batchResults) {
        if (Array.isArray(resItem?.Result)) {
          mergedList.push(...resItem.Result);
        }
      }

      return res.json({
        Status: 'Success',
        service: 'PMI_Resi_Transaction',
        totalBatches: 4,
        totalProjects: mergedList.length,
        Result: mergedList,
      });
    }
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch residential transactions from URA Data Service',
      details: err?.message || String(err),
    });
  }
});

/**
 * 3. Endpoint: Live Carpark Availability
 * GET /api/ura/carpark-availability or /api/ura/carparks
 */
router.get(['/carpark-availability', '/carparks'], async (_req: Request, res: Response) => {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const result = await invokeUraService(accessKey, 'Car_Park_Availability');
    return res.json(result);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch carpark availability from URA Data Service',
      details: err?.message || String(err),
    });
  }
});

/**
 * 4. Endpoint: Carpark Details & Pricing Rates
 * GET /api/ura/carpark-details
 */
router.get('/carpark-details', async (_req: Request, res: Response) => {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const result = await invokeUraService(accessKey, 'Car_Park_Details');
    return res.json(result);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch carpark details from URA Data Service',
      details: err?.message || String(err),
    });
  }
});

export default router;
