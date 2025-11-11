export const dynamic = "force-dynamic";

import { AnalyticsOverview } from "@/components/admin/analytics-overview";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";
import { prisma } from "@/lib/server";

export default async function AdminDashboard() {
  const [monthlyRevenue, tierCounts, lowInventory] = await Promise.all([
    prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      orderBy: { createdAt: "asc" },
      take: 6
    }),
    prisma.subscription.groupBy({
      by: ["tierId"],
      _count: { _all: true }
    }),
    prisma.item.findMany({
      take: 6,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const revenueByMonth = monthlyRevenue.map((entry) => {
    const label = entry.createdAt.toLocaleString("en-IN", {
      month: "short",
      year: "numeric"
    });
    return {
      label,
      value: Number(entry._sum.totalAmount ?? 0)
    };
  });

  const tierLookup = await prisma.subscriptionTier.findMany();
  const tierMix = tierCounts.map((entry) => {
    const tier = tierLookup.find((tier) => tier.id === entry.tierId);
    return {
      name: tier?.name ?? "Unknown",
      count: entry._count._all
    };
  });

  const inventoryLevels = lowInventory.map((item) => ({
    name: item.name,
    stock: item.moq * 5,
    threshold: item.moq * 2
  }));

  return (
    <div className="space-y-8">
      <ChannelRefresh channel="app:orders" event="orders:changed" />
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Admin intelligence
        </h1>
        <p className="text-sm text-slate-500">
          Track GMV, tier adoption, and inventory health across the Marcus Aurelius
          supply network.
        </p>
      </div>
      <AnalyticsOverview
        revenueByMonth={revenueByMonth}
        tierMix={tierMix}
        inventoryLevels={inventoryLevels}
      />
    </div>
  );
}

