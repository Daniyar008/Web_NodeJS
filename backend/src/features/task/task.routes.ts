import { Router, type Request, type Response, type NextFunction } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { calendarQuerySchema, createTaskSchema, reorderTaskSchema, updateTaskSchema } from './task.schema.js'
import * as svc from './task.service.js'

const router = Router()

router.get('/', requireAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.listTasks(userId))
  } catch (e) {
    next(e)
  }
})

router.get('/calendar', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    const query = calendarQuerySchema.parse(req.query)
    res.json(await svc.listCalendarTasks(userId, query.from, query.to))
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    const dto = createTaskSchema.parse(req.body)
    res.status(201).json(await svc.createTask(userId, dto))
  } catch (e) {
    next(e)
  }
})

router.post('/reorder', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    const dto = reorderTaskSchema.parse(req.body)
    res.json(await svc.reorderTasks(userId, dto.tasks))
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    const dto = updateTaskSchema.parse(req.body)
    res.json(await svc.updateTask(userId, String(req.params['id']), dto))
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    await svc.removeTask(userId, String(req.params['id']))
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})

export { router as taskRouter }
