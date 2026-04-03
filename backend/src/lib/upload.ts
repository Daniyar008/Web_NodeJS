import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const _uploadDir = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(_uploadDir, "../../uploads");

// Ensure local upload directories exist (used as disk fallback when Supabase is not configured)
for (const sub of ["avatars", "covers", "media"]) {
    const dir = path.join(UPLOAD_DIR, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Use memory storage so the buffer is available for both Supabase Storage
// and the local disk fallback (handled in storageService.ts).
const memStorage = multer.memoryStorage();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MEDIA_TYPES = [
    ...IMAGE_TYPES,
    "video/mp4", "video/webm",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

function imageFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WebP, GIF images are allowed"));
}

function mediaFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (MEDIA_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
}

export const uploadAvatar = multer({
    storage: memStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: imageFilter,
}).single("avatar");

export const uploadCover = multer({
    storage: memStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: imageFilter,
}).single("cover");

export const uploadMedia = multer({
    storage: memStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: mediaFilter,
}).single("file");

export const UPLOAD_DIR_PATH = UPLOAD_DIR;
