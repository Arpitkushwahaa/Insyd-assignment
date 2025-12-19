import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate, authorizeRoles('admin'));

router.get('/', getAuditLogs);

export default router;
