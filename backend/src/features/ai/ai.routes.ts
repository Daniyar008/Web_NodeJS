import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import type { AuthLocals } from "../../middleware/auth.middleware.js";
import { aiChatSchema, aiGenerateTestSchema, aiRecommendationQuerySchema } from "./ai.schema.js";
import { chatWithAssistant, generateTestDraft, getRecommendations } from "./ai.service.js";

export const aiRouter = Router();

aiRouter.use(requireAuth);

aiRouter.get("/recommendations", async (req, res, next) => {
    try {
        const auth = res.locals["auth"] as AuthLocals;
        const query = aiRecommendationQuerySchema.parse(req.query);
        res.json(await getRecommendations(auth, query));
    } catch (error) {
        next(error);
    }
});

aiRouter.post("/chat", async (req, res, next) => {
    try {
        const auth = res.locals["auth"] as AuthLocals;
        const dto = aiChatSchema.parse(req.body);
        res.json(await chatWithAssistant(auth, dto));
    } catch (error) {
        next(error);
    }
});

aiRouter.post("/generate-test", async (req, res, next) => {
    try {
        const auth = res.locals["auth"] as AuthLocals;
        const dto = aiGenerateTestSchema.parse(req.body);
        res.json(await generateTestDraft(auth, dto));
    } catch (error) {
        next(error);
    }
});
