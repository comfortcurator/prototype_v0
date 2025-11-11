import { logger } from "@/lib/server/logger";

export async function register() {
  logger.info(
    {
      source: "instrumentation",
      environment: process.env.NODE_ENV,
      deployedOnVercel: Boolean(process.env.VERCEL)
    },
    "Instrumentation registered"
  );
}

