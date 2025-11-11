"use server";

import { auth, prisma } from "@/lib/server";
import { razorpayOrder } from "@/lib/server/payments";
import { publishRealtimeEvent } from "@/lib/server/realtime";
import { env } from "@/env";
import { z } from "zod";

const cartItemSchema = z.object({
  id: z.string(),
  type: z.enum(["package", "item"]),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  name: z.string()
});

const checkoutSchema = z.object({
  propertyId: z.string(),
  items: z.array(cartItemSchema),
  total: z.number().positive()
});

export async function checkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthenticated" };
  }
  const raw = formData.get("payload");
  if (!raw) {
    return { error: "Missing payload" };
  }
  const parsed = checkoutSchema.safeParse(JSON.parse(String(raw)));
  if (!parsed.success) {
    return { error: "Invalid payload" };
  }
  const { propertyId, items, total } = parsed.data;
  const amountPaise = Math.round(total * 100);

  const primaryPackage = items.find((item) => item.type === "package");

  const order = await prisma.order.create({
    data: {
      propertyId,
      userId: session.user.id,
      packageId: primaryPackage?.id,
      totalAmount: total,
      paymentStatus: "pending",
      razorpayOrderId: "temp"
    }
  });

  await prisma.orderItem.createMany({
    data: items.map((item) => ({
      orderId: order.id,
      itemId: item.type === "item" ? item.id : null,
      packageId: item.type === "package" ? item.id : null,
      quantity: item.quantity,
      unitPrice: item.price,
      name: item.name
    }))
  });

  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    await publishRealtimeEvent({
      channel: "app:orders",
      event: "orders:changed",
      payload: { orderId: order.id, status: "pending" }
    });

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: null,
      message: "Razorpay keys not configured. Order recorded with pending status."
    };
  }

  const razorpay = await razorpayOrder({
    amount: amountPaise,
    receipt: order.id
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      razorpayOrderId: razorpay.orderId
    }
  });

  await publishRealtimeEvent({
    channel: "app:orders",
    event: "orders:changed",
    payload: { orderId: order.id, status: "pending", razorpayOrderId: razorpay.orderId }
  });

  return { success: true, orderId: order.id, razorpayOrderId: razorpay.orderId };
}

