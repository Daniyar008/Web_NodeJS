import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/auth.middleware.js";
import {
    createTournamentSchema,
    submitScoreSchema,
    updateTournamentSchema,
} from "./tournament.schema.js";
import {
    createTournament,
    getLeaderboard,
    getTournament,
    joinTournament,
    leaveTournament,
    listTournaments,
    removeTournament,
    submitScore,
    updateTournament,
} from "./tournament.service.js";

export const tournamentRouter = Router();

// ─── public-ish (any auth) ───────────────────────────────────────────────────

tournamentRouter.get("/", requireAuth, async (_req, res, next) => {
    try {
        const userId = (res.locals["auth"] as { userId: string }).userId;
        res.json(await listTournaments(userId));
    } catch (e) {
        next(e);
    }
});

tournamentRouter.get("/:id", requireAuth, async (req, res, next) => {
    try {
        res.json(await getTournament(String(req.params["id"])));
    } catch (e) {
        next(e);
    }
});

tournamentRouter.get("/:id/leaderboard", requireAuth, async (req, res, next) => {
    try {
        res.json(await getLeaderboard(String(req.params["id"])));
    } catch (e) {
        next(e);
    }
});

// ─── participation ───────────────────────────────────────────────────────────

tournamentRouter.post("/:id/join", requireAuth, async (req, res, next) => {
    try {
        const userId = (res.locals["auth"] as { userId: string }).userId;
        res.status(201).json(await joinTournament(userId, String(req.params["id"])));
    } catch (e) {
        next(e);
    }
});

tournamentRouter.delete("/:id/leave", requireAuth, async (req, res, next) => {
    try {
        const userId = (res.locals["auth"] as { userId: string }).userId;
        await leaveTournament(userId, String(req.params["id"]));
        res.status(204).end();
    } catch (e) {
        next(e);
    }
});

tournamentRouter.post("/:id/score", requireAuth, async (req, res, next) => {
    try {
        const userId = (res.locals["auth"] as { userId: string }).userId;
        const dto = submitScoreSchema.parse(req.body);
        res.json(await submitScore(userId, String(req.params["id"]), dto));
    } catch (e) {
        next(e);
    }
});

// ─── management (TEACHER / INSTITUTION_ADMIN) ────────────────────────────────

tournamentRouter.post(
    "/",
    requireAuth,
    requireRole("TEACHER", "INSTITUTION_ADMIN"),
    async (req, res, next) => {
        try {
            const userId = (res.locals["auth"] as { userId: string }).userId;
            const dto = createTournamentSchema.parse(req.body);
            res.status(201).json(await createTournament(userId, dto));
        } catch (e) {
            next(e);
        }
    }
);

tournamentRouter.patch(
    "/:id",
    requireAuth,
    requireRole("TEACHER", "INSTITUTION_ADMIN"),
    async (req, res, next) => {
        try {
            const userId = (res.locals["auth"] as { userId: string }).userId;
            const dto = updateTournamentSchema.parse(req.body);
            res.json(await updateTournament(userId, String(req.params["id"]), dto));
        } catch (e) {
            next(e);
        }
    }
);

tournamentRouter.delete(
    "/:id",
    requireAuth,
    requireRole("TEACHER", "INSTITUTION_ADMIN"),
    async (req, res, next) => {
        try {
            const userId = (res.locals["auth"] as { userId: string }).userId;
            await removeTournament(userId, String(req.params["id"]));
            res.status(204).end();
        } catch (e) {
            next(e);
        }
    }
);
