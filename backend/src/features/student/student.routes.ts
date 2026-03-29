import { Router, type Request, type Response, type NextFunction } from 'express'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'
import { enrollSchema } from './student.schema.js'
import * as svc from './student.service.js'

const router = Router()

router.get('/me', requireAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.getStudentProfile(userId))
  } catch (e) {
    next(e)
  }
})

router.get('/courses/available', requireAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await svc.listAvailableCourses())
  } catch (e) {
    next(e)
  }
})

router.get('/courses/enrolled', requireAuth, requireRole('STUDENT', 'PARENT'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.listEnrolledCourses(userId))
  } catch (e) {
    next(e)
  }
})

router.post('/courses/enroll', requireAuth, requireRole('STUDENT', 'PARENT'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    const { courseId } = enrollSchema.parse(req.body)
    res.status(201).json(await svc.enrollCourse(userId, courseId))
  } catch (e) {
    next(e)
  }
})

router.get('/courses/:courseId/progress', requireAuth, requireRole('STUDENT', 'PARENT'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.getCourseProgress(userId, String(req.params['courseId'])))
  } catch (e) {
    next(e)
  }
})

router.post('/courses/:courseId/lessons/:lessonId/complete', requireAuth, requireRole('STUDENT', 'PARENT'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.completeLesson(userId, String(req.params['courseId']), String(req.params['lessonId'])))
  } catch (e) {
    next(e)
  }
})

router.get('/achievements', requireAuth, requireRole('STUDENT', 'PARENT'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.listAchievements(userId))
  } catch (e) {
    next(e)
  }
})

export { router as studentRouter }
