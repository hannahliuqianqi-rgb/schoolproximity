import { Router, Request, Response } from 'express';

const router = Router();

const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';

/**
 * Retrieves the LTA DataMall AccountKey from environment variables.
 * Credential is ONLY read here inside the repo-root api/ directory.
 */
function getAccountKey(): string | null {
  const key = process.env.LTA_DATAMALL_ACCOUNT_KEY || process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;
  if (!key || key.trim() === '' || key === 'MY_LTA_KEY') {
    return null;
  }
  return key.trim();
}

/**
 * Next buses at a stop (v3 - the current version; 20-second refresh)
 * Endpoint: /api/transport/bus-arrival or /api/bus-arrival
 * Query params: BusStopCode (e.g. 83139), ServiceNo (optional, e.g. 15)
 */
router.get('/bus-arrival', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.bus_stop_code) as string;
  const serviceNo = (req.query.ServiceNo || req.query.serviceNo || req.query.service_no) as string | undefined;

  if (!busStopCode) {
    return res.status(400).json({ error: 'BusStopCode query parameter is required' });
  }

  try {
    const url = new URL(`${LTA_API_BASE}/v3/BusArrival`);
    url.searchParams.set('BusStopCode', String(busStopCode).trim());
    if (serviceNo) {
      url.searchParams.set('ServiceNo', String(serviceNo).trim());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA DataMall API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch bus arrival data from LTA service',
      details: err?.message || String(err),
    });
  }
});

/**
 * Live carpark lots (HDB + LTA + URA)
 * Endpoint: /api/transport/carpark-availability or /api/carpark-availability
 * Query params: $skip (optional, for pagination)
 */
router.get('/carpark-availability', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const skip = req.query.$skip || req.query.skip;
    const url = new URL(`${LTA_API_BASE}/CarParkAvailabilityv2`);
    if (skip) {
      url.searchParams.set('$skip', String(skip).trim());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA DataMall API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch carpark availability data from LTA service',
      details: err?.message || String(err),
    });
  }
});

/**
 * Traffic incidents
 * Endpoint: /api/transport/traffic-incidents or /api/traffic-incidents
 */
router.get('/traffic-incidents', async (_req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const response = await fetch(`${LTA_API_BASE}/TrafficIncidents`, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA DataMall API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch traffic incidents data from LTA service',
      details: err?.message || String(err),
    });
  }
});

/**
 * MRT/LRT status (Train Service Alerts)
 * Endpoint: /api/transport/train-service-alerts or /api/train-service-alerts
 */
router.get('/train-service-alerts', async (_req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const response = await fetch(`${LTA_API_BASE}/TrainServiceAlerts`, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA DataMall API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({
      error: 'Failed to fetch train service alerts from LTA service',
      details: err?.message || String(err),
    });
  }
});

export default router;
