"use server";

import { z } from "zod";
import { prisma, auth } from "@/lib/server";
import { AppError } from "@/lib/server/errors";
import { publishRealtimeEvent } from "@/lib/server/realtime";
import { revalidatePath } from "next/cache";

const propertySchema = z.object({
  name: z.string().min(2),
  airbnbListingId: z.string().optional(),
  addressLine1: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default("India"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional()
});

export async function createPropertyAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthenticated", { status: 401 });
  }
  const parseResult = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parseResult.success) {
    return { error: parseResult.error.flatten().fieldErrors };
  }
  const data = parseResult.data;
  await prisma.property.create({
    data: {
      name: data.name,
      airbnbListingId: data.airbnbListingId,
      addressLine1: data.addressLine1,
      city: data.city,
      state: data.state,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      imageUrl: data.imageUrl,
      userId: session.user.id
    }
  });
  await publishRealtimeEvent({
    channel: "app:properties",
    event: "properties:changed",
    payload: {
      userId: session.user.id,
      reason: "created"
    }
  });
  revalidatePath("/properties");
  return { success: true };
}

