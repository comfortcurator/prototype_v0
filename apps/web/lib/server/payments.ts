import { env } from "@/env";
import Razorpay from "razorpay";
import { AppError } from "./errors";
import { getStripeClient } from "./stripe";

export async function razorpayOrder({
  amount,
  currency = "INR",
  receipt
}: {
  amount: number;
  currency?: string;
  receipt: string;
}) {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new AppError("Razorpay keys not configured", { status: 500 });
  }
  const client = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret
  });
  const order = await client.orders.create({
    amount,
    currency,
    receipt,
    payment_capture: true
  });
  return {
    orderId: order.id,
    currency: order.currency
  };
}

export async function createStripeCheckoutSession({
  amount,
  currency = "inr",
  successUrl,
  cancelUrl,
  metadata
}: {
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  if (!env.stripeSecretKey || !env.nextPublicStripePublishableKey) {
    throw new AppError("Stripe keys not configured", { status: 500 });
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: "Marcus Aurelius Marketplace Order"
          }
        },
        quantity: 1
      }
    ],
    metadata
  });

  return session;
}

