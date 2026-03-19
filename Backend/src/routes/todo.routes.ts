import { Router } from 'express';
import { getTodos, createTodo, updateTodoStatus, deleteTodo } from '../controllers/todo.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id/status', updateTodoStatus);
router.delete('/:id', deleteTodo);

export default router;
