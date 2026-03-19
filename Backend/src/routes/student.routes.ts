import { Router } from 'express';
import { enrollInCourse, completeLesson, submitAssignment } from '../controllers/student.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorizeRole(['STUDENT']));

router.post('/enroll/:courseId', enrollInCourse);
router.post('/lessons/:lessonId/complete', completeLesson);
router.post('/assignments/:assignmentId/submit', submitAssignment);

export default router;
