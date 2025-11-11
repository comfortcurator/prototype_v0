export const revalidate = 3600;

import { Button } from "@project_v0/ui";
import Link from "next/link";

const navigation = [
  { href: "#features", label: "Features" },
  { href: "#tiers", label: "Subscription" },
  { href: "#contact", label: "Contact" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-xl font-headline tracking-wide">
            project_v0
          </div>
          <nav className="hidden gap-8 text-sm md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button asChild variant="primary">
            <Link href="/login">Launch App</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-28 text-center lg:flex-row lg:text-left">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">
              Marcus Aurelius Collection
            </p>
            <h1 className="font-headline text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Premium Airbnb operations built for India&apos;s hospitality elite.
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Automate turnovers, manage inventory, and unlock concierge-level
              experiences across every property. project_v0 unifies health,
              marketplace, and analytics so your team can focus on world-class
              guest delight.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg">Request a demo</Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#explore">Explore platform</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-60" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em]">
                    Host Health
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold">
                    Goa — Aurelius Villa
                  </h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-full bg-black/50 px-4 py-2 text-sm">
                    <span>Inventory Readiness</span>
                    <span className="font-semibold text-emerald-400">Green</span>
                  </div>
                  <div className="flex items-center justify-between rounded-full bg-black/50 px-4 py-2 text-sm">
                    <span>Next Auto Order</span>
                    <span className="font-semibold">In 3 days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-full bg-black/50 px-4 py-2 text-sm">
                    <span>Cleaning Partner</span>
                    <span>153 minutes away</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

