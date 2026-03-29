import { z } from "zod";

export const aiChatSchema = z.object({
  message: z.string().min(1).max(5000),
  context: z.enum(["student", "teacher", "parent", "general"]).optional(),
});

export const aiGenerateTestSchema = z.object({
  topic: z.string().min(1).max(200),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  questions: z.coerce.number().int().min(3).max(10).default(5),
});

export const aiRecommendationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(10).default(4),
});

export type AiChatDto = z.infer<typeof aiChatSchema>;
export type AiGenerateTestDto = z.infer<typeof aiGenerateTestSchema>;
export type AiRecommendationQuery = z.infer<typeof aiRecommendationQuerySchema>;
