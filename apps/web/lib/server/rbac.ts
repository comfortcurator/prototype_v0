import type { Session } from "next-auth";
import { AppError } from "./errors";

export function assertRole(session: Session | null, roles: string[]) {
  if (!session?.user) {
    throw new AppError("Unauthenticated", { status: 401 });
  }
  if (!roles.includes(session.user.role)) {
    throw new AppError("Forbidden", { status: 403 });
  }
}

export function canAccess(session: Session | null, roles: string[]) {
  try {
    assertRole(session, roles);
    return true;
  } catch {
    return false;
  }
}

