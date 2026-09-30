import { Router } from 'express';
import telemetryRoutes from './routes/telemetry.routes';
import panelsRoutes from './routes/panels.routes';

const backendRouter = Router();

backendRouter.use('/telemetry', telemetryRoutes);
backendRouter.use('/panels', panelsRoutes);

export { backendRouter };
export * from './services/coldChainService';
