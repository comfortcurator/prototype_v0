import {
  DefaultSession,
  type NextAuthOptions,
  getServerSession
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verify } from "argon2";
import { z } from "zod";
import { prisma } from "./db";
import { logger } from "./logger";
import { env } from "@/env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: env.nextAuthSecret,
  providers: [
    GoogleProvider({
      clientId: env.googleClientId ?? "",
      clientSecret: env.googleClientSecret ?? ""
    }),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          logger.warn({ err: parsed.error }, "Invalid credentials payload");
          return null;
        }
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }
        const isValid = await verify(user.passwordHash, password);
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) ?? "host";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "host";
      }
      return token;
    }
  }
};

export const auth = () => getServerSession(authOptions);


