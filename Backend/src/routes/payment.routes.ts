import { Router } from 'express';
import { createCheckoutSession, handleWebhook, updateInstitutionSubscription } from '../controllers/payment.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Webhook is public (Stripe calls this)
router.post('/webhook', handleWebhook);

router.use(authenticate);

// Create payments
router.post('/create-checkout-session', createCheckoutSession);

// Admin limits
router.post('/institutions/:institutionId/subscription', authorizeRole(['PLATFORM_ADMIN']), updateInstitutionSubscription);

export default router;
