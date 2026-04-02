import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded before anything else reads process.env
const _dir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(_dir, "../../.env") });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: process.env["DATABASE_URL"]?.includes("supabase") ? { rejectUnauthorized: false } : undefined });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
