import { Router, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadAvatar, uploadCover, uploadMedia } from "../lib/upload.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Helper to build public URL from filename + subfolder
function fileUrl(req: Request, subfolder: string, filename: string): string {
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/uploads/${subfolder}/${filename}`;
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

            const url = fileUrl(req, "avatars", req.file.filename);

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

            const url = fileUrl(req, "covers", req.file.filename);

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
    (req: Request, res: Response) => {
        if (!req.file) return res.status(400).json({ message: "No file provided" });

        const url = fileUrl(req, "media", req.file.filename);
        res.json({ url, originalName: req.file.originalname, size: req.file.size });
    },
);

export { router as uploadRouter };
