export const dynamic = "force-dynamic";

import { AppShell } from "@/components/shell/app-shell";
import { auth } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <AppShell>{children}</AppShell>;
}

