import { Router } from 'express';
import {
  getAllSKUs,
  getSKUById,
  createSKU,
  updateSKU,
  deleteSKU,
  getSKUStats,
} from '../controllers/skuController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/stats', getSKUStats);
router.get('/', getAllSKUs);
router.get('/:id', getSKUById);
router.post('/', authorizeRoles('admin'), createSKU);
router.put('/:id', authorizeRoles('admin'), updateSKU);
router.delete('/:id', authorizeRoles('admin'), deleteSKU);

export default router;
