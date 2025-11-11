"use server";

import { hash } from "argon2";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { auth, prisma } from "@/lib/server";
import { logger } from "@/lib/server/logger";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+91[1-9]\d{9}$/, "Use +91XXXXXXXXXX format"),
  password: z.string().min(8),
  role: z.enum(["host", "admin"])
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
});

export async function registerAction(input: unknown) {
  const session = await auth();
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { email, phone, password, role, name } = parsed.data;
  if (role === "admin" && session?.user.role !== "admin") {
    return { error: { role: ["Only admins can create admin accounts."] } };
  }
  try {
    const passwordHash = await hash(password);
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role
      }
    });
    logger.info({ email }, "User registered");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: {
            email: ["Email or phone already registered."]
          }
        };
      }
    }
    logger.error({ err: error }, "Registration failed");
    return { error: { _global: ["Unexpected error. Please try again."] } };
  }
}

export async function requestPasswordResetAction(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true };
  }
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt
    }
  });

  logger.info(
    { email, token },
    "Password reset token generated (send via SMS/Email in production)"
  );
  return { success: true, token };
}

export async function resetPasswordAction(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return { error: { token: ["Token invalid or expired."] } };
  }
  const passwordHash = await hash(password);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } })
  ]);
  return { success: true };
}

