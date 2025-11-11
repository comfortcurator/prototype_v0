"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@project_v0/ui";
import { formatINRCurrency } from "@project_v0/utils";
import { useMarketplaceCart } from "./cart-context";
import { checkoutAction } from "@/app/(app)/marketplace/actions";

interface CartDrawerProps {
  properties: Array<{ id: string; name: string }>;
}

export function CartDrawer({ properties }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(
    properties[0]?.id ?? ""
  );
  const [isSubmitting, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    items,
    total,
    actions: { remove, setQuantity, clear }
  } = useMarketplaceCart();

  const handleCheckout = () => {
    if (!selectedProperty) {
      setFeedback("Select a property for fulfilment.");
      return;
    }
    if (items.length === 0) {
      setFeedback("Add at least one item to cart.");
      return;
    }
    const payload = {
      propertyId: selectedProperty,
      items: items.map((item) => ({
        id: item.id,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total
    };
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    startTransition(async () => {
      const response = await checkoutAction(formData);
      if (response?.error) {
        setFeedback(response.error);
        return;
      }
      setFeedback("Order initiated. Razorpay checkout will open shortly.");
      clear();
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-slate-800"
      >
        Cart · {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
        {formatINRCurrency(total)}
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Your cart</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-200">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.type === "package" ? "Bundle" : "Individual item"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    className="h-6 w-6 rounded-full border border-slate-300 text-slate-600"
                    onClick={() =>
                      setQuantity(
                        item.id,
                        item.type,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    –
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    className="h-6 w-6 rounded-full border border-slate-300 text-slate-600"
                    onClick={() =>
                      setQuantity(item.id, item.type, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-xs text-rose-500"
                  onClick={() => remove(item.id, item.type)}
                >
                  Remove
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Start curating kits from the marketplace.
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <label className="text-xs font-semibold text-slate-600">
              Fulfilment property
            </label>
            <select
              value={selectedProperty}
              onChange={(event) => setSelectedProperty(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatINRCurrency(total)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clear}
                type="button"
              >
                Clear cart
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleCheckout}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? "Processing..." : "Proceed to checkout"}
              </Button>
            </div>
            <p className="text-[10px] text-slate-400">
              Razorpay payments are GST-compliant. Concierge team confirms delivery ETA
              within 30 minutes.
            </p>
            {feedback && (
              <p className="text-[10px] text-emerald-500">{feedback}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

