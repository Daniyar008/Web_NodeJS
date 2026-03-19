import { Router } from 'express';
import { 
  getInstitutions, 
  getInstitutionById, 
  createInstitution, 
  createDepartment 
} from '../controllers/institution.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Only platform admins or super admins can view all institutions or create them
router.get('/', authenticate, authorizeRole(['PLATFORM_ADMIN', 'SUPER_ADMIN']), getInstitutions);
router.post('/', authenticate, authorizeRole(['PLATFORM_ADMIN', 'SUPER_ADMIN']), createInstitution);

// Anyone authenticated can view a specific institution details
router.get('/:id', authenticate, getInstitutionById);

// Institution admins can create departments
router.post('/:institutionId/departments', authenticate, authorizeRole(['INSTITUTION_ADMIN', 'PLATFORM_ADMIN']), createDepartment);

export default router;
