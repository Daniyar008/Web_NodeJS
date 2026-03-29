import { z } from "zod";

export const notificationQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updatePreferenceSchema = z.object({
  inAppEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  chatEnabled: z.boolean().optional(),
  courseEnabled: z.boolean().optional(),
  systemEnabled: z.boolean().optional(),
});

export type NotificationQueryDto = z.infer<typeof notificationQuerySchema>;
export type UpdatePreferenceDto = z.infer<typeof updatePreferenceSchema>;
