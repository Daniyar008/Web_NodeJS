import { z } from "zod";

export const linkStudentSchema = z.object({
    studentId: z.string().min(1),
});

export const createGoalSchema = z.object({
    studentId: z.string().min(1),
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    targetXp: z.number().int().positive().default(100),
    reward: z.string().optional(),
});

export const updateGoalSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    targetXp: z.number().int().positive().optional(),
    reward: z.string().optional(),
    achieved: z.boolean().optional(),
});

export const sendMessageSchema = z.object({
    receiverId: z.string().min(1),
    content: z.string().min(1).max(4000),
});

export type LinkStudentDto = z.infer<typeof linkStudentSchema>;
export type CreateGoalDto = z.infer<typeof createGoalSchema>;
export type UpdateGoalDto = z.infer<typeof updateGoalSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;
