import { z } from "zod";

export const PropertyStatusEnum = z.enum(["green", "orange", "red"]);

export const PropertySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(2),
  airbnbListingId: z.string().optional(),
  addressLine1: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string().default("India"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().optional(),
  description: z.string().max(5000).optional(),
  status: PropertyStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Property = z.infer<typeof PropertySchema>;

