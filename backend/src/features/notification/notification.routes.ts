import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import type { AuthLocals } from "../../middleware/auth.middleware.js";
import { notificationQuerySchema, updatePreferenceSchema } from "./notification.schema.js";
import {
  getNotificationPreference,
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreference,
} from "./notification.service.js";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get("/", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const query = notificationQuerySchema.parse(req.query);
    res.json(await listNotifications(auth.userId, query));
  } catch (error) {
    next(error);
  }
});

notificationRouter.get("/unread-count", async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json({ count: await getUnreadNotificationCount(auth.userId) });
  } catch (error) {
    next(error);
  }
});

notificationRouter.post("/:id/read", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await markNotificationRead(auth.userId, String(req.params["id"])));
  } catch (error) {
    next(error);
  }
});

notificationRouter.post("/read-all", async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    await markAllNotificationsRead(auth.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

notificationRouter.get("/preferences", async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await getNotificationPreference(auth.userId));
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/preferences", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const dto = updatePreferenceSchema.parse(req.body);
    res.json(await updateNotificationPreference(auth.userId, dto));
  } catch (error) {
    next(error);
  }
});
