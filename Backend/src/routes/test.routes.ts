import { Router } from 'express';
import { createTest, addQuestion, createAssignment } from '../controllers/test.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorizeRole(['TEACHER', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN']));

router.post('/', createTest);
router.post('/:testId/questions', addQuestion);
router.post('/assignments', createAssignment);

export default router;
