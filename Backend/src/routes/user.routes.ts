import { Router } from 'express';
import { getInstitutionUsers, addTeacher, addStudent } from '../controllers/user.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// These routes require at least INSTITUTION_ADMIN rights
router.use(authenticate);
router.use(authorizeRole(['INSTITUTION_ADMIN', 'PLATFORM_ADMIN', 'SUPER_ADMIN']));

router.get('/:institutionId/users', getInstitutionUsers);
router.post('/:institutionId/users/teachers', addTeacher);
router.post('/:institutionId/users/students', addStudent);

export default router;
