import { Router } from 'express';
import { getDashboardInsights, getReports } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/insights', getDashboardInsights);
router.get('/reports', getReports);

export default router;
