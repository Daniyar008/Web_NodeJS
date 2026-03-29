import { Router, type Request, type Response, type NextFunction } from 'express'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'
import {
  createCourseSchema,
  updateCourseSchema,
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema,
  createLessonSchema,
  updateLessonSchema,
  createTestSchema,
  createAssignmentSchema,
  gradeSubmissionSchema,
} from './course.schema.js'
import * as svc from './course.service.js'

const router = Router()

// ─── Courses ──────────────────────────────────────────────────────────────────

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.query['mine'] === 'true' ? res.locals['auth']?.userId : undefined
    res.json(await svc.listCourses(authorId))
  } catch (e) { next(e) }
})

router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await svc.getCourseById(String(req.params['id'])))
  } catch (e) { next(e) }
})

router.post('/', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createCourseSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.status(201).json(await svc.createCourse(userId, dto))
  } catch (e) { next(e) }
})

router.patch('/:id', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = updateCourseSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.updateCourse(String(req.params['id']), userId, dto))
  } catch (e) { next(e) }
})

router.delete('/:id', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    await svc.deleteCourse(String(req.params['id']), userId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

// ─── Stats ────────────────────────────────────────────────────────────────────

router.get('/teacher/stats', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.getTeacherStats(userId))
  } catch (e) { next(e) }
})

// ─── Modules ──────────────────────────────────────────────────────────────────

router.post('/:id/modules', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createModuleSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.status(201).json(await svc.createModule(String(req.params['id']), userId, dto))
  } catch (e) { next(e) }
})

router.patch('/modules/:moduleId', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = updateModuleSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.updateModule(String(req.params['moduleId']), userId, dto))
  } catch (e) { next(e) }
})

router.delete('/modules/:moduleId', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    await svc.deleteModule(String(req.params['moduleId']), userId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

router.post('/:id/modules/reorder', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order } = reorderModulesSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.reorderModules(String(req.params['id']), userId, order))
  } catch (e) { next(e) }
})

// ─── Lessons ──────────────────────────────────────────────────────────────────

router.post('/modules/:moduleId/lessons', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createLessonSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.status(201).json(await svc.createLesson(String(req.params['moduleId']), userId, dto))
  } catch (e) { next(e) }
})

router.patch('/lessons/:lessonId', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = updateLessonSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.updateLesson(String(req.params['lessonId']), userId, dto))
  } catch (e) { next(e) }
})

router.delete('/lessons/:lessonId', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    await svc.deleteLesson(String(req.params['lessonId']), userId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

// ─── Tests ────────────────────────────────────────────────────────────────────

router.put('/lessons/:lessonId/test', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createTestSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.upsertTest(String(req.params['lessonId']), userId, dto))
  } catch (e) { next(e) }
})

// ─── Assignments ──────────────────────────────────────────────────────────────

router.put('/lessons/:lessonId/assignment', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createAssignmentSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.upsertAssignment(String(req.params['lessonId']), userId, dto))
  } catch (e) { next(e) }
})

router.get('/assignments/:assignmentId/submissions', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.listSubmissions(String(req.params['assignmentId']), userId))
  } catch (e) { next(e) }
})

router.patch('/submissions/:submissionId/grade', requireAuth, requireRole('TEACHER', 'INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = gradeSubmissionSchema.parse(req.body)
    const userId = String(res.locals['auth']?.userId)
    res.json(await svc.gradeSubmission(String(req.params['submissionId']), userId, dto))
  } catch (e) { next(e) }
})

export { router as courseRouter }
