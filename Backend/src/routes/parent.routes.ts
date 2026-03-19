import { Router } from 'express';
import { linkChild, getChildrenProgress, getChildrenAttendance } from '../controllers/parent.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorizeRole(['PARENT']));

router.post('/link-child', linkChild);
router.get('/children/progress', getChildrenProgress);
router.get('/children/attendance', getChildrenAttendance);

export default router;
