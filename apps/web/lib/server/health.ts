import { prisma } from "./db";

export async function performHealthCheck() {
  const startedAt = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const duration = Date.now() - startedAt;
  return {
    status: "ok",
    dbLatencyMs: duration
  };
}

