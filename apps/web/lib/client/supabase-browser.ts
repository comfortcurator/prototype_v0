"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseBrowserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set to use realtime features."
    );
  }

  supabaseBrowserClient = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "project_v0-frontend" } }
  });

  return supabaseBrowserClient;
}

