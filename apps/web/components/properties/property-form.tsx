"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@project_v0/ui";
import { cn } from "@project_v0/ui";
import { createPropertyAction } from "@/app/(app)/properties/actions";

const schema = z.object({
  name: z.string().min(2),
  airbnbListingId: z.string().optional(),
  addressLine1: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2).default("India"),
  latitude: z.coerce.number({ invalid_type_error: "Latitude is required" }),
  longitude: z.coerce.number({ invalid_type_error: "Longitude is required" }),
  description: z.string().optional(),
  imageUrl: z.string().url().optional()
});

type FormValues = z.infer<typeof schema>;

export function PropertyForm() {
  const router = useRouter();
  const [error, setError] = useState<Record<string, string[]>>({});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "India"
    }
  });

  const onSubmit = async (values: FormValues) => {
    setError({});
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    const result = await createPropertyAction(formData);
    if (result?.error) {
      setError(result.error as Record<string, string[]>);
      return;
    }
    router.push("/properties");
  };

  const fieldError = (field: keyof FormValues) =>
    errors[field]?.message ?? error[field]?.[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Property name
          </label>
          <input
            id="name"
            placeholder="Aurelius Villa Goa"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("name") && "border-rose-400"
            )}
            {...register("name")}
          />
          {fieldError("name") && (
            <p className="text-xs text-rose-500">{String(fieldError("name"))}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="airbnbListingId"
          >
            Airbnb listing ID / URL
          </label>
          <input
            id="airbnbListingId"
            placeholder="airbnb.com/h/12345678"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            {...register("airbnbListingId")}
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="imageUrl"
          >
            Featured image URL
          </label>
          <input
            id="imageUrl"
            placeholder="https://"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("imageUrl") && "border-rose-400"
            )}
            {...register("imageUrl")}
          />
          {fieldError("imageUrl") && (
            <p className="text-xs text-rose-500">{String(fieldError("imageUrl"))}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="addressLine1"
          >
            Address
          </label>
          <input
            id="addressLine1"
            placeholder="Candolim Beach Road"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("addressLine1") && "border-rose-400"
            )}
            {...register("addressLine1")}
          />
          {fieldError("addressLine1") && (
            <p className="text-xs text-rose-500">
              {String(fieldError("addressLine1"))}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="city">
            City
          </label>
          <input
            id="city"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("city") && "border-rose-400"
            )}
            {...register("city")}
          />
          {fieldError("city") && (
            <p className="text-xs text-rose-500">{String(fieldError("city"))}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="state">
            State
          </label>
          <input
            id="state"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("state") && "border-rose-400"
            )}
            {...register("state")}
          />
          {fieldError("state") && (
            <p className="text-xs text-rose-500">{String(fieldError("state"))}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="latitude"
          >
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="0.000001"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("latitude") && "border-rose-400"
            )}
            {...register("latitude")}
          />
          {fieldError("latitude") && (
            <p className="text-xs text-rose-500">{String(fieldError("latitude"))}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="longitude"
          >
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="0.000001"
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              fieldError("longitude") && "border-rose-400"
            )}
            {...register("longitude")}
          />
          {fieldError("longitude") && (
            <p className="text-xs text-rose-500">{String(fieldError("longitude"))}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            {...register("description")}
          />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Registering..." : "Register property"}
      </Button>
    </form>
  );
}

