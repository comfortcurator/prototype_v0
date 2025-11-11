"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Button } from "@project_v0/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/orders", label: "Orders" },
  { href: "/notifications", label: "Notifications" }
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 hidden w-64 border-r border-slate-200 bg-white/80 px-6 py-10 backdrop-blur lg:block">
        <div className="text-lg font-headline">project_v0</div>
        <nav className="mt-10 flex flex-col gap-3 text-sm">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Button variant="outline" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start">
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="px-6 py-10">{children}</div>
      </main>
    </div>
  );
}

