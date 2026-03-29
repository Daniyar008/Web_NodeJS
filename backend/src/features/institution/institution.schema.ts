import { z } from 'zod'

export const createInstitutionSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'slug может содержать только строчные латинские буквы, цифры и дефис'),
  description: z.string().max(1000).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
})

export const updateInstitutionSchema = createInstitutionSchema.partial()

export const createDepartmentSchema = z.object({
  name: z.string().min(1).max(120),
})

export const updateDepartmentSchema = createDepartmentSchema.partial()

export const createClassSchema = z.object({
  name: z.string().min(1).max(80),
  year: z.number().int().min(2000).max(2100),
  departmentId: z.string().cuid(),
})

export const updateClassSchema = createClassSchema.partial()

export const addMemberSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  classId: z.string().cuid().optional(),
})

export type CreateInstitutionDto = z.infer<typeof createInstitutionSchema>
export type UpdateInstitutionDto = z.infer<typeof updateInstitutionSchema>
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>
export type CreateClassDto = z.infer<typeof createClassSchema>
export type UpdateClassDto = z.infer<typeof updateClassSchema>
export type AddMemberDto = z.infer<typeof addMemberSchema>
