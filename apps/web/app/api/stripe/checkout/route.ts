import { NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { createStripeCheckoutSession } from "@/lib/server/payments";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amount, currency = "inr", successUrl, cancelUrl, metadata } = body;

  if (!amount || !successUrl || !cancelUrl) {
    return NextResponse.json(
      { error: "amount, successUrl, and cancelUrl are required" },
      { status: 400 }
    );
  }

  try {
    const checkoutSession = await createStripeCheckoutSession({
      amount,
      currency,
      successUrl,
      cancelUrl,
      metadata
    });
    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to create checkout session" },
      { status: 500 }
    );
  }
}

