import { PrismaClient } from "@prisma/client";
import { env } from "@/env";
import { createMockPrismaClient } from "./mock-prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createRealClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  });

const client = env.isDatabaseConfigured
  ? global.prisma || createRealClient()
  : (createMockPrismaClient() as unknown as PrismaClient);

export const prisma = client;

if (env.isDatabaseConfigured && process.env.NODE_ENV !== "production") {
  global.prisma = client;
}

