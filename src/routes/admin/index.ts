import { Router } from 'express';
import adminRoutes from './v1';
const router = Router();
router.use('/v1', adminRoutes);
export default router;
