export const runtime = "nodejs";

import { triggerBackupOrders } from "@/lib/server";
import { NextResponse } from "next/server";

export async function POST() {
  await triggerBackupOrders();
  return NextResponse.json({ status: "ok" });
}

