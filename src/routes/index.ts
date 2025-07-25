import { Router } from 'express';
import authRoutes from './auth.routes';
import letterRoutes from './letter.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/letters', letterRoutes);

// Health check route
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
