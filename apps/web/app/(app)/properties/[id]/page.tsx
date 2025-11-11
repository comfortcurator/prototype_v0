export const dynamic = "force-dynamic";

import { auth, prisma } from "@/lib/server";
import { PropertyMap } from "@/components/maps/property-map";
import { Button } from "@project_v0/ui";
import { formatINRCurrency } from "@project_v0/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

interface PropertyPageProps {
  params: { id: string };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = params;
  const session = await auth();
  if (!session?.user) {
    return notFound();
  }
  const property = await prisma.property.findFirst({
    where: { id, userId: session.user.id },
    include: {
      subscriptions: {
        where: { isActive: true },
        include: { tier: true }
      },
      healthLogs: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });

  if (!property) {
    return notFound();
  }

  const subscription = property.subscriptions[0];

  return (
    <div className="space-y-10">
      <ChannelRefresh channel="app:properties" event="properties:changed" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Link
            href="/properties"
            className="text-xs uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
          >
            ← Back to properties
          </Link>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {property.city}, {property.state}
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {property.name}
                </h1>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold ${
                  property.status === "green"
                    ? "bg-emerald-100 text-emerald-600"
                    : property.status === "orange"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-rose-100 text-rose-600"
                }`}
              >
                Health: {property.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {property.description ??
                "Document upcoming renovations, concierge notes, and inventory preferences here."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Airbnb ID: {property.airbnbListingId ?? "–"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Tier: {subscription?.tier.name ?? "Unassigned"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                INR GMV target: {formatINRCurrency(450000)}
              </span>
            </div>
          </div>
          <div
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
            id="health"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Health timeline
              </h2>
              <Button variant="ghost" className="text-xs">
                Export log
              </Button>
            </div>
            <ol className="mt-6 space-y-4">
              {property.healthLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${
                      log.status === "green"
                        ? "bg-emerald-400"
                        : log.status === "orange"
                          ? "bg-amber-400"
                          : "bg-rose-500"
                    }`}
                  />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-slate-900">
                      {log.status.toUpperCase()}
                    </p>
                    <p className="text-slate-600">{log.reason ?? "Status update"}</p>
                    <p className="text-xs text-slate-400">
                      {log.createdAt.toLocaleString("en-IN", {
                        hour: "numeric",
                        minute: "numeric",
                        day: "2-digit",
                        month: "short"
                      })}
                    </p>
                  </div>
                </li>
              ))}
              {property.healthLogs.length === 0 && (
                <li className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Health logs will appear once automation and concierge events start
                  tracking.
                </li>
              )}
            </ol>
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-100">
            <PropertyMap
              properties={[
                {
                  id: property.id,
                  name: property.name,
                  latitude: property.latitude,
                  longitude: property.longitude,
                  status: property.status
                }
              ]}
              activePropertyId={property.id}
            />
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">
              Subscription tier
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {subscription
                ? `Currently assigned to ${subscription.tier.name}. Includes ${
                    (subscription.tier.features as { includes?: string[] })?.includes?.join(
                      ", "
                    ) ?? "premium automations"
                  }.`
                : "Assign a tier to unlock automation, concierge services, and analytics."}
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="primary">Change tier</Button>
              <Button variant="outline">View packages</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-100">
            <Image
              src={
                property.imageUrl ??
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1300&q=80"
              }
              alt={property.name}
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

