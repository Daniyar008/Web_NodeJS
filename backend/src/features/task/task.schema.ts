import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional(),
  courseId: z.string().cuid().optional(),
  assignmentId: z.string().cuid().optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const reorderTaskSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string().cuid(),
      status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
      position: z.number().int().min(0),
    })
  ).min(1),
})

export const calendarQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export type CreateTaskDto = z.infer<typeof createTaskSchema>
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>
