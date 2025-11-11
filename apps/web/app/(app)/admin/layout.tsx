export const dynamic = "force-dynamic";

import { auth, assertRole } from "@/lib/server";
import Link from "next/link";
import { PropsWithChildren } from "react";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/users", label: "Users" }
];

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth();
  assertRole(session, ["admin"]);
  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap gap-3">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}

