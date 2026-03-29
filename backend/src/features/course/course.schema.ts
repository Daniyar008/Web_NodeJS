import { z } from 'zod'

export const createCourseSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    coverUrl: z.string().url().optional(),
    institutionId: z.string().cuid().optional(),
})

export const updateCourseSchema = createCourseSchema.partial().extend({
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export const createModuleSchema = z.object({
    title: z.string().min(1).max(200),
    order: z.number().int().min(0).optional(),
})

export const updateModuleSchema = createModuleSchema.partial()

export const reorderModulesSchema = z.object({
    order: z.array(z.string().cuid()),
})

export const createLessonSchema = z.object({
    title: z.string().min(1).max(200),
    type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'ASSIGNMENT']).default('TEXT'),
    content: z.string().optional(),
    videoUrl: z.string().url().optional(),
    order: z.number().int().min(0).optional(),
})

export const updateLessonSchema = createLessonSchema.partial()

export const createTestSchema = z.object({
    title: z.string().min(1).max(200),
    timeLimit: z.number().int().min(1).optional(),
    passingScore: z.number().int().min(0).max(100).optional(),
    questions: z.array(
        z.object({
            text: z.string().min(1),
            type: z.enum(['SINGLE', 'MULTIPLE', 'TEXT']),
            points: z.number().int().min(1).optional(),
            order: z.number().int().min(0).optional(),
            options: z.array(
                z.object({ text: z.string().min(1), isCorrect: z.boolean() })
            ).optional(),
        })
    ).min(1),
})

export const createAssignmentSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    maxScore: z.number().int().min(1).optional(),
    dueDate: z.string().datetime().optional(),
})

export const gradeSubmissionSchema = z.object({
    score: z.number().int().min(0),
    feedback: z.string().max(1000).optional(),
})

export type CreateCourseDto = z.infer<typeof createCourseSchema>
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>
export type CreateModuleDto = z.infer<typeof createModuleSchema>
export type UpdateModuleDto = z.infer<typeof updateModuleSchema>
export type CreateLessonDto = z.infer<typeof createLessonSchema>
export type UpdateLessonDto = z.infer<typeof updateLessonSchema>
export type CreateTestDto = z.infer<typeof createTestSchema>
export type CreateAssignmentDto = z.infer<typeof createAssignmentSchema>
export type GradeSubmissionDto = z.infer<typeof gradeSubmissionSchema>
