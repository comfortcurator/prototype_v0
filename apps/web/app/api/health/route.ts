export const runtime = "nodejs";

import { performHealthCheck } from "@/lib/server/health";
import { logger } from "@/lib/server/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await performHealthCheck();
    return NextResponse.json(result);
  } catch (error) {
    logger.error({ err: error }, "Health check failed");
    return NextResponse.json(
      { status: "error", message: "Unhealthy" },
      { status: 500 }
    );
  }
}

