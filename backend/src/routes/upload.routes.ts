import { Router, type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadAvatar, uploadCover, uploadMedia } from "../lib/upload.js";
import { uploadFile } from "../lib/storageService.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

function backendBaseUrl(req: Request): string {
    return `${req.protocol}://${req.get("host")}`;
}

// ─── Upload avatar ──────────────────────────────────────────────────────────

router.post(
    "/avatar",
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
        uploadAvatar(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (res.locals["auth"] as { userId: string }).userId;
            if (!req.file) return res.status(400).json({ message: "No file provided" });

            const ext = path.extname(req.file.originalname).toLowerCase();
            const url = await uploadFile(req.file.buffer, req.file.mimetype, ext, "avatars", backendBaseUrl(req));

            await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: url },
            });

            res.json({ url });
        } catch (e) {
            next(e);
        }
    },
);

// ─── Upload course cover ──────────────────────────────────────────────────────

router.post(
    "/cover/:courseId",
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
        uploadCover(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = String(req.params["courseId"]);
            if (!req.file) return res.status(400).json({ message: "No file provided" });

            const ext = path.extname(req.file.originalname).toLowerCase();
            const url = await uploadFile(req.file.buffer, req.file.mimetype, ext, "covers", backendBaseUrl(req));

            await prisma.course.update({
                where: { id: courseId },
                data: { coverUrl: url },
            });

            res.json({ url });
        } catch (e) {
            next(e);
        }
    },
);

// ─── Upload generic media (video, PDF, PPT) ───────────────────────────────────

router.post(
    "/media",
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
        uploadMedia(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file provided" });

            const ext = path.extname(req.file.originalname).toLowerCase();
            const url = await uploadFile(req.file.buffer, req.file.mimetype, ext, "media", backendBaseUrl(req));

            res.json({ url, originalName: req.file.originalname, size: req.file.size });
        } catch (e) {
            next(e);
        }
    },
);

export { router as uploadRouter };

