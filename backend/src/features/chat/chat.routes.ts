import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import type { AuthLocals } from "../../middleware/auth.middleware.js";
import { chatContactQuerySchema, createDirectChatSchema, sendChatMessageSchema } from "./chat.schema.js";
import {
  createOrGetDirectChat,
  getChatMessages,
  listChatContacts,
  listChats,
  markChatRead,
  sendChatMessage,
} from "./chat.service.js";

export const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.get("/contacts", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const query = chatContactQuerySchema.parse(req.query);
    res.json(await listChatContacts(auth.userId, query));
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/chats", async (_req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await listChats(auth.userId));
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/chats", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const dto = createDirectChatSchema.parse(req.body);
    res.status(201).json(await createOrGetDirectChat(auth.userId, dto));
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/chats/:id/messages", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    res.json(await getChatMessages(auth.userId, String(req.params["id"])));
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/chats/:id/messages", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    const dto = sendChatMessageSchema.parse(req.body);
    res.status(201).json(await sendChatMessage(auth.userId, String(req.params["id"]), dto));
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/chats/:id/read", async (req, res, next) => {
  try {
    const auth = res.locals["auth"] as AuthLocals;
    await markChatRead(auth.userId, String(req.params["id"]));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
