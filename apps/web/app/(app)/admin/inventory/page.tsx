export const dynamic = "force-dynamic";

import { prisma } from "@/lib/server";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

export default async function AdminInventoryPage() {
  const sessions = await prisma.inventorySession.findMany({
    include: {
      items: {
        include: { item: true }
      },
      admin: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <ChannelRefresh channel="app:orders" event="orders:changed" />
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Inventory sessions
        </h1>
        <p className="text-sm text-slate-500">
          Track procurement batches, vendor receipts, and cost per unit.
        </p>
      </div>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
          >
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <p className="text-sm font-semibold text-slate-900">
                {session.description ?? "Inventory batch"}
              </p>
              <p>
                Admin:{" "}
                <span className="font-semibold">{session.admin.email}</span> ·{" "}
                {session.createdAt.toLocaleDateString("en-IN")}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {session.items.map((row) => (
                <li
                  key={`${row.itemId}-${row.sessionId}`}
                  className="flex justify-between rounded-2xl bg-slate-50 p-3"
                >
                  <span>{row.item.name}</span>
                  <span>
                    {row.quantity} units · ₹{row.costPerUnit.toString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Add your first inventory session to begin tracking procurement.
          </div>
        )}
      </div>
    </div>
  );
}

