import { z } from 'zod'

export const enrollSchema = z.object({
  courseId: z.string().cuid(),
})

export const completeLessonSchema = z.object({
  courseId: z.string().cuid(),
  lessonId: z.string().cuid(),
})

export const submitTestSchema = z.object({
  testId: z.string().cuid(),
  answers: z.record(z.string(), z.any()),
})

export type EnrollDto = z.infer<typeof enrollSchema>
export type CompleteLessonDto = z.infer<typeof completeLessonSchema>
export type SubmitTestDto = z.infer<typeof submitTestSchema>
