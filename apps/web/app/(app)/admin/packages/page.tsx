export const dynamic = "force-dynamic";

import { prisma } from "@/lib/server";
import Link from "next/link";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    include: {
      items: {
        include: { item: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Packages & maintenance kits
        </h1>
        <p className="text-sm text-slate-500">
          Curate bundles that hosts can subscribe to or trigger automatically.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {packages.map((bundle) => (
          <div
            key={bundle.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {bundle.type.toUpperCase()}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                {bundle.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{bundle.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {bundle.items.map((bundleItem) => (
                <li key={`${bundleItem.packageId}-${bundleItem.itemId}`}>
                  {bundleItem.quantity} × {bundleItem.item.name}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>₹{bundle.basePrice.toString()}</span>
              <Link
                href={`/admin/packages/${bundle.id}`}
                className="text-xs font-semibold text-slate-900"
              >
                Manage →
              </Link>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No packages yet. Craft bundles blending amenities, maintenance, or concierge
            services.
          </div>
        )}
      </div>
    </div>
  );
}

