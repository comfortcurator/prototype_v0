export const runtime = "nodejs";

import { env } from "@/env";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials missing." },
      { status: 500 }
    );
  }

  const client = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret
  });

  const body = await request.json();
  const { amount, currency = "INR", receipt } = body;
  const order = await client.orders.create({
    amount,
    currency,
    receipt,
    payment_capture: true
  });
  return NextResponse.json({ orderId: order.id, currency: order.currency });
}

