import { Router } from 'express';
import { getTournaments, createTournament, registerParticipant, submitResult } from '../controllers/tournament.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getTournaments);

router.use(authenticate);

// Admin/Teacher creates
router.post('/', authorizeRole(['TEACHER', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN']), createTournament);
router.post('/:tournamentId/results/:studentId', authorizeRole(['TEACHER', 'INSTITUTION_ADMIN']), submitResult);

// Student registers
router.post('/:tournamentId/register', authorizeRole(['STUDENT']), registerParticipant);

export default router;
