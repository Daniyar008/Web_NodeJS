import { Router } from 'express';
import { 
  getCourses, 
  getCourseById, 
  createCourse, 
  addModule, 
  addLesson 
} from '../controllers/course.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Publicly available or authenticated student can view course logic (simplified for now)
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Only teachers/admins can create courses
router.post('/', authenticate, authorizeRole(['TEACHER', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN']), createCourse);
router.post('/:courseId/modules', authenticate, authorizeRole(['TEACHER', 'INSTITUTION_ADMIN']), addModule);
router.post('/modules/:moduleId/lessons', authenticate, authorizeRole(['TEACHER', 'INSTITUTION_ADMIN']), addLesson);

export default router;
