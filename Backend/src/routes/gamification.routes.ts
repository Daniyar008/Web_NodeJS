import { Router } from 'express';
import { getStudentAchievements, awardXP, getLeaderboard } from '../controllers/gamification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public / Authenticated Leaderboard
router.get('/leaderboard', getLeaderboard);

// Specific to student achievements
router.get('/students/:studentId/achievements', authenticate, getStudentAchievements);

// Internal/Admin to award XP (could be called by other internal services in real scenario)
router.post('/award-xp', authenticate, awardXP);

export default router;
