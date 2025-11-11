export const dynamic = "force-dynamic";

import { auth, prisma } from "@/lib/server";
import { Button } from "@project_v0/ui";
import { formatINRCurrency } from "@project_v0/utils";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PropertiesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
    include: {
      subscriptions: {
        where: { isActive: true },
        include: { tier: true }
      },
      healthLogs: {
        take: 1,
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <ChannelRefresh channel="app:properties" event="properties:changed" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Your Marcus Aurelius residences
          </h1>
          <p className="text-sm text-slate-500">
            Monitor health, automation, and performance across every property.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/properties/new">Register new property</Link>
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {properties.map((property) => {
          const latestHealth = property.healthLogs[0];
          const subscription = property.subscriptions[0];
          return (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    {property.city}, {property.state}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {property.name}
                  </h2>
                </div>
                <span
                  className={`h-3 w-3 rounded-full ${
                    latestHealth?.status === "green"
                      ? "bg-emerald-400"
                      : latestHealth?.status === "orange"
                        ? "bg-amber-400"
                        : "bg-rose-500"
                  }`}
                />
              </div>
              <p className="mt-4 text-sm text-slate-500 line-clamp-2">
                {property.description ??
                  "Add a description to showcase this residence."}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Tier:{" "}
                  <strong className="text-slate-900">
                    {subscription?.tier.name ?? "Unassigned"}
                  </strong>
                </span>
                <span>
                  Monthly GMV goal:{" "}
                  <strong className="text-slate-900">
                    {formatINRCurrency(350000)}
                  </strong>
                </span>
              </div>
            </Link>
          );
        })}
        {properties.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Invite your first residence into the Marcus Aurelius cohort.
          </div>
        )}
      </div>
    </div>
  );
}

