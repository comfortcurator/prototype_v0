"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@project_v0/ui";
import { PropertyMap } from "@/components/maps/property-map";

type PropertyCard = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  status?: "green" | "orange" | "red";
  nextTask?: string;
};

interface PropertyCarouselProps {
  properties: PropertyCard[];
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [activePropertyId, setActivePropertyId] = useState(
    properties[0]?.id ?? ""
  );
  const activeProperty =
    properties.find((property) => property.id === activePropertyId) ??
    properties[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Marcus Aurelius Portfolio
          </h3>
          <div className="text-xs text-slate-500">
            {properties.length} active residences
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {properties.map((property) => {
            const isActive = property.id === activePropertyId;
            return (
              <button
                key={property.id}
                onClick={() => setActivePropertyId(property.id)}
                className={`flex min-w-[220px] flex-col gap-3 rounded-3xl border p-4 text-left transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em]">
                  <span>
                    {property.city}, {property.state}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      property.status === "green"
                        ? "bg-emerald-400"
                        : property.status === "orange"
                          ? "bg-amber-400"
                          : "bg-rose-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{property.name}</p>
                  <p className="text-xs opacity-70">
                    {property.nextTask ?? "Everything is running smoothly."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {activeProperty && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl md:w-48">
                <Image
                  src={
                    activeProperty.imageUrl ??
                    "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={activeProperty.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">
                  {activeProperty.description ??
                    "Add a description to brief your concierge team."}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Latitude: {activeProperty.latitude.toFixed(3)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Longitude: {activeProperty.longitude.toFixed(3)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href={`/properties/${activeProperty.id}`}>
                      View details
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href={`/properties/${activeProperty.id}#health`}>
                      Open health log
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[420px] overflow-hidden rounded-3xl border border-slate-200">
        <PropertyMap
          properties={properties.map((property) => ({
            id: property.id,
            name: property.name,
            latitude: property.latitude,
            longitude: property.longitude,
            status: property.status
          }))}
          activePropertyId={activePropertyId}
          onMarkerClick={(id) => setActivePropertyId(id)}
        />
      </div>
    </div>
  );
}

