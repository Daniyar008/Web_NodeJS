import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

/**
 * Supabase client — only initialized when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are present in environment.
 * When null, the app falls back to local disk storage.
 */
export const supabase: SupabaseClient | null =
    env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
        ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false },
        })
        : null;

export const isSupabaseConfigured = supabase !== null;
