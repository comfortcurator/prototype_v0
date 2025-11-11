import { getEnv } from "@project_v0/utils";

const fallbackDatabaseUrl = "postgresql://localhost:5432/project_v0";
const providedDatabaseUrl = process.env.DATABASE_URL;
const fallbackSecret = "development-secret";
const fallbackSupabaseUrl = "http://localhost:54321";
const fallbackSupabaseAnonKey = "local-dev-anon-key";
const warnOnce = (() => {
  const emitted = new Set<string>();
  return (key: string, message: string) => {
    if (emitted.has(key)) return;
    emitted.add(key);
    console.warn(message);
  };
})();

export const env = {
  databaseUrl: getEnv("DATABASE_URL", fallbackDatabaseUrl),
  directUrl: process.env.DIRECT_URL,
  nextAuthSecret: getEnv("NEXTAUTH_SECRET", fallbackSecret),
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  nextPublicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  nextPublicStripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  supabaseUrl: getEnv("SUPABASE_URL", fallbackSupabaseUrl),
  supabaseAnonKey: getEnv("SUPABASE_ANON_KEY", fallbackSupabaseAnonKey),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  nextPublicSupabaseUrl: getEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.SUPABASE_URL ?? fallbackSupabaseUrl
  ),
  nextPublicSupabaseAnonKey: getEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.SUPABASE_ANON_KEY ?? fallbackSupabaseAnonKey
  ),
  isDatabaseConfigured: Boolean(providedDatabaseUrl)
};

// Ensure fallbacks populate process.env for libraries that read directly.
process.env.DATABASE_URL = env.databaseUrl;
process.env.NEXTAUTH_SECRET = env.nextAuthSecret;
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = env.nextAuthUrl;
}
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = env.supabaseUrl;
}
if (!process.env.SUPABASE_ANON_KEY) {
  process.env.SUPABASE_ANON_KEY = env.supabaseAnonKey;
}

if (!process.env.DATABASE_URL) {
  warnOnce(
    "DATABASE_URL",
    "[env] DATABASE_URL not set; using local fallback. Configure a Supabase/Postgres URL before deploying."
  );
}

if (!process.env.NEXTAUTH_SECRET) {
  warnOnce(
    "NEXTAUTH_SECRET",
    "[env] NEXTAUTH_SECRET not set; using insecure dev secret. Generate a strong secret before deploying."
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  warnOnce(
    "SUPABASE_SERVICE_ROLE_KEY",
    "[env] SUPABASE_SERVICE_ROLE_KEY not set; realtime publishing and migrations require this key in staging/production."
  );
}

