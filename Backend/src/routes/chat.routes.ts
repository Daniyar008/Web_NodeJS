import { Router } from 'express';
import { getUserChats, getMessages, sendMessage } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getUserChats);
router.get('/:chatId/messages', getMessages);
router.post('/messages', sendMessage);

export default router;
