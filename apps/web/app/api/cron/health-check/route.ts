export const runtime = "nodejs";

import { evaluatePropertyHealth } from "@/lib/server";
import { NextResponse } from "next/server";

export async function POST() {
  await evaluatePropertyHealth();
  return NextResponse.json({ status: "ok" });
}

