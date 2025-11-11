export const dynamic = "force-dynamic";

import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { MarketplaceCartProvider } from "@/components/marketplace/cart-context";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";
import { auth, prisma } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function MarketplacePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const [packages, items, properties] = await Promise.all([
    prisma.package.findMany({
      where: {
        OR: [
          { type: "standard" },
          { type: "maintenance" }
        ]
      },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    }),
    prisma.item.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.property.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true }
    })
  ]);

  return (
    <MarketplaceCartProvider>
      <div className="space-y-10">
        <ChannelRefresh channel="app:orders" event="orders:changed" />
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Marcus Aurelius Marketplace
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Supply suites curated for Indian luxury stays
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Combine pre-designed bundles with bespoke items to craft unforgettable
              experiences. Automated reordering keeps your portfolio guest-ready.
            </p>
          </div>
        </header>
        <MarketplaceGrid
          packages={packages.map((bundle) => ({
            id: bundle.id,
            name: bundle.name,
            description: bundle.description,
            basePrice: Number(bundle.basePrice),
            imageUrl: bundle.imageUrl ?? undefined,
            items: bundle.items.map((bundleItem) => ({
              item: { name: bundleItem.item.name },
              quantity: bundleItem.quantity
            }))
          }))}
          items={items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            unitPrice: Number(item.unitPrice),
            moq: item.moq,
            imageUrl: item.imageUrl
          }))}
        />
        <CartDrawer
          properties={properties.map((property) => ({
            id: property.id,
            name: property.name
          }))}
        />
      </div>
    </MarketplaceCartProvider>
  );
}

