import { z } from "zod";

export const createTournamentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  maxScore: z.number().int().positive().default(100),
});

export const updateTournamentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "FINISHED"]).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  maxScore: z.number().int().positive().optional(),
});

export const submitScoreSchema = z.object({
  score: z.number().int().min(0),
});

export type CreateTournamentDto = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentDto = z.infer<typeof updateTournamentSchema>;
export type SubmitScoreDto = z.infer<typeof submitScoreSchema>;
