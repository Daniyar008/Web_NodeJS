import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { supabase } from "./supabase.js";
import { UPLOAD_DIR_PATH } from "./upload.js";

export type StorageBucket = "avatars" | "covers" | "media";

/**
 * Upload a file buffer to either Supabase Storage (when configured)
 * or the local disk (fallback for development / self-hosted).
 *
 * @param buffer       Raw file bytes (from multer memoryStorage)
 * @param mimetype     MIME type, e.g. "image/png"
 * @param ext          File extension including dot, e.g. ".png"
 * @param bucket       Storage bucket / subfolder name
 * @param backendBaseUrl  Full backend origin, e.g. "http://localhost:4000"
 *                        (used only for disk-fallback URLs)
 * @returns            Public URL to the stored file
 */
export async function uploadFile(
    buffer: Buffer,
    mimetype: string,
    ext: string,
    bucket: StorageBucket,
    backendBaseUrl: string,
): Promise<string> {
    const filename = `${crypto.randomUUID()}${ext}`;

    if (supabase) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, buffer, { contentType: mimetype, upsert: false });

        if (error) throw new Error(`Supabase Storage error: ${error.message}`);

        return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
    }

    // Disk fallback
    const dest = path.join(UPLOAD_DIR_PATH, bucket, filename);
    await fs.writeFile(dest, buffer);
    return `${backendBaseUrl}/uploads/${bucket}/${filename}`;
}
