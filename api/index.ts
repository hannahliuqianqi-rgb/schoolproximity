import { Router } from 'express';
import ltaRouter from './lta';
import uraRouter from './ura';
import onemapRouter from './onemap';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SchoolProximity SG Transport, Real Estate & Analytics API',
    timestamp: new Date().toISOString(),
  });
});

// Mount OneMap endpoints under /api/onemap
apiRouter.use('/onemap', onemapRouter);

// Mount URA endpoints under /api/ura
apiRouter.use('/ura', uraRouter);

// Mount LTA endpoints under /api/transport and /api/lta and directly
apiRouter.use('/transport', ltaRouter);
apiRouter.use('/lta', ltaRouter);
apiRouter.use('/', ltaRouter);

export default apiRouter;
