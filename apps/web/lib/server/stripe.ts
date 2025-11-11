import Stripe from "stripe";
import { env } from "@/env";
import { logger } from "./logger";

const apiVersion = "2024-06-20" as Stripe.LatestApiVersion;

let stripeClient: Stripe | null;

export function getStripeClient(): Stripe {
  if (!env.stripeSecretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY env; Stripe operations disabled. Configure it before calling getStripeClient."
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, {
      apiVersion,
      appInfo: {
        name: "project_v0",
        url: "https://projectv0.in"
      }
    });
    logger.info({ source: "stripe", event: "client_initialised" }, "Stripe client ready.");
  }

  return stripeClient;
}

export function getStripePublishableKey() {
  return env.nextPublicStripePublishableKey;
}


