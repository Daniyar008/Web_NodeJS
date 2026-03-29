import { Router } from "express";

import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import type { AuthLocals } from "../../middleware/auth.middleware.js";
import {
  createCourseCheckoutSchema,
  createSubscriptionCheckoutSchema,
  updateCoursePricingSchema,
  webhookEventSchema,
} from "./payment.schema.js";
import {
  cancelMySubscription,
  createCourseCheckout,
  createSubscriptionCheckout,
  getBillingAccess,
  getMySubscription,
  listMarketplaceCourses,
  listPlans,
  listPurchaseHistory,
  listTeacherCommissions,
  processWebhookEvent,
  updateCoursePricing,
} from "./payment.service.js";

export const paymentRouter = Router();

paymentRouter.get("/plans", requireAuth, async (_req, res, next) => {
  try {
    res.json(await listPlans());
  } catch (error) {
    next(error);
  }
});

paymentRouter.get("/subscription", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await getMySubscription(auth.userId));
  } catch (error) {
    next(error);
  }
});

paymentRouter.get("/access", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await getBillingAccess(auth.userId));
  } catch (error) {
    next(error);
  }
});

paymentRouter.post("/checkout/subscription", requireAuth, async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const dto = createSubscriptionCheckoutSchema.parse(req.body);
    res.status(201).json(await createSubscriptionCheckout(auth.userId, dto));
  } catch (error) {
    next(error);
  }
});

paymentRouter.post("/subscription/cancel", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    await cancelMySubscription(auth.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

paymentRouter.get("/marketplace", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await listMarketplaceCourses(auth.userId));
  } catch (error) {
    next(error);
  }
});

paymentRouter.post("/checkout/course/:courseId", requireAuth, async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const dto = createCourseCheckoutSchema.parse(req.body);
    res.status(201).json(await createCourseCheckout(auth.userId, String(req.params["courseId"]), dto));
  } catch (error) {
    next(error);
  }
});

paymentRouter.get("/purchases", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await listPurchaseHistory(auth.userId));
  } catch (error) {
    next(error);
  }
});

paymentRouter.get(
  "/commissions",
  requireAuth,
  requireRole("TEACHER", "INSTITUTION_ADMIN"),
  async (_req, res, next) => {
    try {
      const auth = res.locals["auth"] as AuthLocals;
      res.json(await listTeacherCommissions(auth.userId));
    } catch (error) {
      next(error);
    }
  }
);

paymentRouter.patch(
  "/courses/:id/pricing",
  requireAuth,
  requireRole("TEACHER", "INSTITUTION_ADMIN"),
  async (req, res, next) => {
    try {
      const auth = res.locals["auth"] as AuthLocals;
      const dto = updateCoursePricingSchema.parse(req.body);
      res.json(await updateCoursePricing(auth.userId, String(req.params["id"]), dto));
    } catch (error) {
      next(error);
    }
  }
);

// In production, put Stripe signature validation here using STRIPE_WEBHOOK_SECRET.
paymentRouter.post("/webhook/stripe", async (req, res, next) => {
  try {
    const event = webhookEventSchema.parse(req.body);
    await processWebhookEvent(event);
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
});
