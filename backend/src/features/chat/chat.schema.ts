import { z } from "zod";

export const createDirectChatSchema = z.object({
  participantId: z.string().min(1),
});

export const sendChatMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  attachmentUrl: z.string().url().optional(),
});

export const chatContactQuerySchema = z.object({
  search: z.string().optional(),
});

export type CreateDirectChatDto = z.infer<typeof createDirectChatSchema>;
export type SendChatMessageDto = z.infer<typeof sendChatMessageSchema>;
export type ChatContactQueryDto = z.infer<typeof chatContactQuerySchema>;
