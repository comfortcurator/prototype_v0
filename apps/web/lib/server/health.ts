import { env } from "@/env";
import { prisma } from "./db";

export async function performHealthCheck() {
  if (!env.isDatabaseConfigured) {
    return {
      status: "degraded",
      dbLatencyMs: null,
      note: "Database not configured; returning mock health status."
    };
  }
  const startedAt = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const duration = Date.now() - startedAt;
  return {
    status: "ok",
    dbLatencyMs: duration
  };
}

