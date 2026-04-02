import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// Load .env from the backend root regardless of process.cwd()
// Graceful fallback for CJS environments (Jest)
function getDir(): string {
    try {
        return dirname(fileURLToPath(import.meta.url));
    } catch {
        return __dirname ?? process.cwd();
    }
}
config({ path: resolve(getDir(), "../../.env") });

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    DATABASE_URL: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(16).default("change-me-access-secret"),
    JWT_REFRESH_SECRET: z.string().min(16).default("change-me-refresh-secret"),
    FRONTEND_URL: z.string().default("http://localhost:5173"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_DEFAULT_CURRENCY: z.string().default("usd"),
    PLATFORM_FEE_BPS: z.coerce.number().int().min(0).max(10000).default(1500),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment variables: ${JSON.stringify(errors)}`);
}

export const env = parsed.data;
