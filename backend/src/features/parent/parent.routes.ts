import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createGoalSchema,
  linkStudentSchema,
  sendMessageSchema,
  updateGoalSchema,
} from "./parent.schema.js";
import {
  checkGoals,
  createGoal,
  getChildProgress,
  getChildren,
  getMessages,
  linkStudent,
  listConversations,
  listGoals,
  listTeachers,
  removeGoal,
  sendMessage,
  unlinkStudent,
  updateGoal,
} from "./parent.service.js";

export const parentRouter = Router();

// All parent endpoints require auth (role check is done at data layer via link)
parentRouter.use(requireAuth);

// ─── children ────────────────────────────────────────────────────────────────

parentRouter.get("/children", async (_req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await getChildren(parentId));
  } catch (e) { next(e); }
});

parentRouter.post("/children", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    const dto = linkStudentSchema.parse(req.body);
    res.status(201).json(await linkStudent(parentId, dto));
  } catch (e) { next(e); }
});

parentRouter.delete("/children/:studentId", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    await unlinkStudent(parentId, String(req.params["studentId"]));
    res.status(204).end();
  } catch (e) { next(e); }
});

// ─── child progress ───────────────────────────────────────────────────────────

parentRouter.get("/children/:studentId/progress", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await getChildProgress(parentId, String(req.params["studentId"])));
  } catch (e) { next(e); }
});

// ─── goals ───────────────────────────────────────────────────────────────────

parentRouter.get("/children/:studentId/goals", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await listGoals(parentId, String(req.params["studentId"])));
  } catch (e) { next(e); }
});

parentRouter.post("/goals", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    const dto = createGoalSchema.parse(req.body);
    res.status(201).json(await createGoal(parentId, dto));
  } catch (e) { next(e); }
});

parentRouter.patch("/goals/:id", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    const dto = updateGoalSchema.parse(req.body);
    res.json(await updateGoal(parentId, String(req.params["id"]), dto));
  } catch (e) { next(e); }
});

parentRouter.delete("/goals/:id", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    await removeGoal(parentId, String(req.params["id"]));
    res.status(204).end();
  } catch (e) { next(e); }
});

parentRouter.post("/children/:studentId/goals/check", async (req, res, next) => {
  try {
    const parentId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await checkGoals(parentId, String(req.params["studentId"])));
  } catch (e) { next(e); }
});

// ─── messaging ────────────────────────────────────────────────────────────────

parentRouter.get("/teachers", async (_req, res, next) => {
  try {
    res.json(await listTeachers());
  } catch (e) { next(e); }
});

parentRouter.get("/messages", async (_req, res, next) => {
  try {
    const userId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await listConversations(userId));
  } catch (e) { next(e); }
});

parentRouter.get("/messages/:partnerId", async (req, res, next) => {
  try {
    const userId = (res.locals["auth"] as { userId: string }).userId;
    res.json(await getMessages(userId, String(req.params["partnerId"])));
  } catch (e) { next(e); }
});

parentRouter.post("/messages", async (req, res, next) => {
  try {
    const senderId = (res.locals["auth"] as { userId: string }).userId;
    const dto = sendMessageSchema.parse(req.body);
    res.status(201).json(await sendMessage(senderId, dto));
  } catch (e) { next(e); }
});
