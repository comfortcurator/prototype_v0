export const dynamic = "force-dynamic";

import { auth, prisma } from "@/lib/server";
import { redirect } from "next/navigation";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 25
  });

  return (
    <div className="space-y-8">
      <ChannelRefresh channel="app:orders" event="orders:changed" />
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Concierge notifications
        </h1>
        <p className="text-sm text-slate-500">
          Automation updates, health alerts, and payment confirmations.
        </p>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft"
          >
            <p className="text-sm font-semibold text-slate-900">
              {(notification.content as { message?: string })?.message ??
                "Marcus Aurelius update"}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(notification.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "numeric",
                minute: "numeric"
              })}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
              {notification.channel}
            </span>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            All quiet. The concierge will alert you when action is needed.
          </div>
        )}
      </div>
    </div>
  );
}

