export const dynamic = "force-dynamic";

import { auth, prisma } from "@/lib/server";
import { formatINRCurrency } from "@project_v0/utils";
import { redirect } from "next/navigation";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      property: true,
      items: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <ChannelRefresh channel="app:orders" event="orders:changed" />
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Marketplace orders
        </h1>
        <p className="text-sm text-slate-500">
          Track fulfilment, payment confirmations, and concierge notes.
        </p>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {order.property.name}
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {order.paymentStatus.toUpperCase()}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatINRCurrency(Number(order.totalAmount))}
                </span>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Items</p>
              <ul className="mt-2 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × {formatINRCurrency(Number(item.unitPrice))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No marketplace orders yet. Curate your first automation-ready kit.
          </div>
        )}
      </div>
    </div>
  );
}

