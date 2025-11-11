"use client";

import Image from "next/image";
import { Button } from "@project_v0/ui";
import { formatINRCurrency } from "@project_v0/utils";
import { useMarketplaceCart } from "./cart-context";

type PackageCard = {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  items: Array<{ item: { name: string }; quantity: number }>;
};

type ItemCard = {
  id: string;
  name: string;
  description?: string | null;
  unitPrice: number;
  moq: number;
  imageUrl?: string | null;
};

interface MarketplaceGridProps {
  packages: PackageCard[];
  items: ItemCard[];
}

export function MarketplaceGrid({ packages, items }: MarketplaceGridProps) {
  const {
    actions: { add }
  } = useMarketplaceCart();

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Curated Marcus Aurelius bundles
          </h2>
          <p className="text-sm text-slate-500">
            Crafted by our concierge to match Indian hospitality rituals.
          </p>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {packages.map((bundle) => (
            <div
              key={bundle.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-200">
                <Image
                  src={
                    bundle.imageUrl ??
                    "https://images.unsplash.com/photo-1470165531551-4bacha76283e?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {bundle.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3">
                  {bundle.description ??
                    "Premium amenities, curated linens, and signature Marcus Aurelius touches."}
                </p>
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <p className="font-medium text-slate-700">Includes</p>
                <ul className="space-y-1">
                  {bundle.items.map((packageItem) => (
                    <li key={packageItem.item.name}>
                      {packageItem.quantity} × {packageItem.item.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  {formatINRCurrency(bundle.basePrice)}
                </span>
                <Button
                  onClick={() =>
                    add({
                      id: bundle.id,
                      name: bundle.name,
                      price: bundle.basePrice,
                      type: "package",
                      imageUrl: bundle.imageUrl
                    })
                  }
                >
                  Add to cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Individual items</h2>
          <p className="text-sm text-slate-500">
            Build custom backup kits or curate seasonal delights.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-32 overflow-hidden rounded-2xl bg-slate-100">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {item.description ?? "Premium item curated for elevated stays."}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-slate-900">
                    {formatINRCurrency(item.unitPrice)}
                  </p>
                  <p className="text-xs text-slate-500">
                    MOQ: {item.moq} units
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    add({
                      id: item.id,
                      name: item.name,
                      price: item.unitPrice,
                      type: "item",
                      imageUrl: item.imageUrl,
                      quantity: item.moq
                    })
                  }
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

