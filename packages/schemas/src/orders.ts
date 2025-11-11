import { z } from "zod";

export const PaymentStatusEnum = z.enum(["pending", "paid", "failed"]);

export const OrderSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  packageId: z.string().uuid(),
  userId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  currency: z.literal("INR"),
  paymentStatus: PaymentStatusEnum,
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string().optional(),
  createdAt: z.date()
});

export type Order = z.infer<typeof OrderSchema>;

