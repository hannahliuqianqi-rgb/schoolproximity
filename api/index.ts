import { Router } from 'express';
import ltaRouter from './lta';
import uraRouter from './ura';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SchoolProximity SG Transport, Real Estate & Analytics API',
    timestamp: new Date().toISOString(),
  });
});

// Mount URA endpoints under /api/ura
apiRouter.use('/ura', uraRouter);

// Mount LTA endpoints under /api/transport and /api/lta and directly
apiRouter.use('/transport', ltaRouter);
apiRouter.use('/lta', ltaRouter);
apiRouter.use('/', ltaRouter);

export default apiRouter;
