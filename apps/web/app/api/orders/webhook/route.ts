export const runtime = "nodejs";

import { env } from "@/env";
import { Prisma } from "@prisma/client";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { logger } from "@/lib/server/logger";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = env.razorpayWebhookSecret;
  if (!secret || !signature) {
    logger.error("Webhook secret/signature missing");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const digest = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  if (digest !== signature) {
    logger.warn("Invalid Razorpay signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload);
  if (event.event === "payment.captured") {
    const { order_id: orderId, id: paymentId, amount } = event.payload.payment.entity;
    await prisma.order.updateMany({
      where: { razorpayOrderId: orderId },
      data: {
        paymentStatus: "paid",
        razorpayPaymentId: paymentId,
        totalAmount: new Prisma.Decimal(amount).dividedBy(100)
      }
    });
  }
  return NextResponse.json({ received: true });
}

