import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/env";

declare global {
  // eslint-disable-next-line no-var
  var __supabaseServiceClient: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var __supabaseAnonClient: SupabaseClient | undefined;
}

export function getSupabaseServiceClient(): SupabaseClient {
  if (!env.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Set it before publishing realtime events or running migrations."
    );
  }

  if (!global.__supabaseServiceClient) {
    global.__supabaseServiceClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false },
      global: { headers: { "X-Client-Info": "project_v0-backend" } }
    });
  }
  return global.__supabaseServiceClient;
}

export function getSupabaseAnonClient(): SupabaseClient {
  if (!global.__supabaseAnonClient) {
    global.__supabaseAnonClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { "X-Client-Info": "project_v0-backend" } }
    });
  }
  return global.__supabaseAnonClient;
}

