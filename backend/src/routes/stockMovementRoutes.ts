import { Router } from 'express';
import {
  createStockMovement,
  getStockMovements,
  getStockMovementStats,
} from '../controllers/stockMovementController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createStockMovement);
router.get('/', getStockMovements);
router.get('/stats', getStockMovementStats);

export default router;
