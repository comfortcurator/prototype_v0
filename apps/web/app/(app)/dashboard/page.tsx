export const dynamic = "force-dynamic";

import { PropertyCarousel } from "@/components/properties/property-carousel";
import { auth, prisma } from "@/lib/server";
import { Button } from "@project_v0/ui";
import { formatINRCurrency } from "@project_v0/utils";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

export default async function DashboardPage() {
  const session = await auth();
  const properties = await prisma.property.findMany({
    where: { userId: session?.user?.id ?? "" },
    include: {
      healthLogs: {
        take: 1,
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "asc" }
  });
  return (
    <div className="space-y-10">
      <ChannelRefresh channel="app:properties" event="properties:changed" />
      <ChannelRefresh channel="app:orders" event="orders:changed" />
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">
          Namaste, {session?.user?.email ?? "host"}.
        </h1>
        <p className="mt-2 text-slate-600">
          Here&apos;s a snapshot of your Marcus Aurelius portfolio today.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Monthly GMV
            </p>
            <p className="mt-4 text-3xl font-headline">
              {formatINRCurrency(548900)}
            </p>
            <p className="mt-2 text-xs text-emerald-500">
              ▲ +12% vs last month
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Occupancy
            </p>
            <p className="mt-4 text-3xl font-headline">87%</p>
            <p className="mt-2 text-xs text-slate-500">
              Maintained above 85% target
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Alerts
            </p>
            <p className="mt-4 text-3xl font-headline">3 pending</p>
            <Button variant="ghost" className="mt-4 w-full justify-center">
              Review today&apos;s actions
            </Button>
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
        id="portfolio"
      >
        <PropertyCarousel
          properties={properties.map((property) => ({
            id: property.id,
            name: property.name,
            description: property.description,
            imageUrl: property.imageUrl,
            city: property.city,
            state: property.state,
            latitude: property.latitude,
            longitude: property.longitude,
            status: property.healthLogs[0]?.status ?? "green",
            nextTask:
              property.healthLogs[0]?.reason ?? "Automations active, no alerts."
          }))}
        />
      </section>
    </div>
  );
}

