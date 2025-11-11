import { PropsWithChildren } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-12 text-slate-100 lg:flex">
        <div className="max-w-md space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-accent">
            project_v0
          </p>
          <h1 className="text-4xl font-headline leading-tight">
            Crafted for India&apos;s most distinguished hosts.
          </h1>
          <p className="text-slate-300">
            Automate turnover rituals, orchestrate premium supplies, and command
            insights across every Airbnb retreat.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
          >
            Return to Marcus Aurelius Collection →
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-10">{children}</div>
      </div>
    </div>
  );
}

