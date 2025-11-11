import { z } from "zod";

export const UserRoleEnum = z.enum(["host", "admin"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().regex(/^\+91[1-9]\d{9}$/),
  role: UserRoleEnum,
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

