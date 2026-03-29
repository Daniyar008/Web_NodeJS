import { Router, type Request, type Response, type NextFunction } from 'express'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'
import {
  createInstitutionSchema,
  updateInstitutionSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  createClassSchema,
  updateClassSchema,
  addMemberSchema,
} from './institution.schema.js'
import * as svc from './institution.service.js'

const router = Router()

// ─── Institutions ─────────────────────────────────────────────────────────────

router.get('/', requireAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await svc.listInstitutions())
  } catch (e) { next(e) }
})

router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    res.json(await svc.getInstitutionById(id))
  } catch (e) { next(e) }
})

router.post('/', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createInstitutionSchema.parse(req.body)
    res.status(201).json(await svc.createInstitution(dto))
  } catch (e) { next(e) }
})

router.patch('/:id', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const dto = updateInstitutionSchema.parse(req.body)
    res.json(await svc.updateInstitution(id, dto))
  } catch (e) { next(e) }
})

router.delete('/:id', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    await svc.deleteInstitution(id)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

// ─── Departments ──────────────────────────────────────────────────────────────

router.post('/:id/departments', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const dto = createDepartmentSchema.parse(req.body)
    res.status(201).json(await svc.createDepartment(id, dto))
  } catch (e) { next(e) }
})

router.patch('/:id/departments/:deptId', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const deptId = String(req.params['deptId'])
    const dto = updateDepartmentSchema.parse(req.body)
    res.json(await svc.updateDepartment(id, deptId, dto))
  } catch (e) { next(e) }
})

router.delete('/:id/departments/:deptId', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const deptId = String(req.params['deptId'])
    await svc.deleteDepartment(id, deptId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

// ─── Classes ──────────────────────────────────────────────────────────────────

router.post('/:id/classes', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const dto = createClassSchema.parse(req.body)
    res.status(201).json(await svc.createClass(id, dto))
  } catch (e) { next(e) }
})

router.patch('/:id/classes/:classId', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const classId = String(req.params['classId'])
    const dto = updateClassSchema.parse(req.body)
    res.json(await svc.updateClass(id, classId, dto))
  } catch (e) { next(e) }
})

router.delete('/:id/classes/:classId', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const classId = String(req.params['classId'])
    await svc.deleteClass(id, classId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

// ─── Members ──────────────────────────────────────────────────────────────────

router.get('/:id/members', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    res.json(await svc.listMembers(id))
  } catch (e) { next(e) }
})

router.post('/:id/members', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const dto = addMemberSchema.parse(req.body)
    res.status(201).json(await svc.addMember(id, dto))
  } catch (e) { next(e) }
})

router.delete('/:id/members/:memberId', requireAuth, requireRole('INSTITUTION_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id'])
    const memberId = String(req.params['memberId'])
    await svc.removeMember(id, memberId)
    res.sendStatus(204)
  } catch (e) { next(e) }
})

export { router as institutionRouter }
