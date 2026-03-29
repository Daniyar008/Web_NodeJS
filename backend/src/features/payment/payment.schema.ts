import { z } from "zod";

export const createSubscriptionCheckoutSchema = z.object({
  planId: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const createCourseCheckoutSchema = z.object({
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const updateCoursePricingSchema = z.object({
  isPaid: z.boolean(),
  priceCents: z.number().int().min(0),
  currency: z.string().min(3).max(8).default("USD"),
});

export const webhookEventSchema = z.object({
  type: z.string().min(1),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
});

export type CreateSubscriptionCheckoutDto = z.infer<typeof createSubscriptionCheckoutSchema>;
export type CreateCourseCheckoutDto = z.infer<typeof createCourseCheckoutSchema>;
export type UpdateCoursePricingDto = z.infer<typeof updateCoursePricingSchema>;
export type WebhookEventDto = z.infer<typeof webhookEventSchema>;
