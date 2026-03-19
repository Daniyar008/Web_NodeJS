import { Router } from 'express';
import { generateTest, getRecommendations, chatWithAssistant } from '../controllers/ai.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Teacher/Admin can generate tests
router.post('/generate-test', authorizeRole(['TEACHER', 'INSTITUTION_ADMIN']), generateTest);

// Students/Parents get recommendations
router.get('/recommendations', authorizeRole(['STUDENT', 'PARENT']), getRecommendations);

// General chat assistant
router.post('/chat', chatWithAssistant);

export default router;
