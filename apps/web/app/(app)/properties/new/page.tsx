export const dynamic = "force-dynamic";

import { Button } from "@project_v0/ui";
import { PropertyForm } from "@/components/properties/property-form";
import Link from "next/link";
import { ChannelRefresh } from "@/components/realtime/channel-refresh";

export default function NewPropertyPage() {
  return (
    <div className="space-y-10">
      <ChannelRefresh channel="app:properties" event="properties:changed" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <Link href="/properties" className="hover:text-slate-900">
            ← Back to properties
          </Link>
          <span>/</span>
          <span>Register</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Register a new residence
        </h1>
        <p className="text-sm text-slate-500">
          Paste your Airbnb listing link or describe the property manually for our concierge
          team.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
        <PropertyForm />
      </div>
      <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 text-sm text-indigo-900">
        Need help importing from Airbnb? Our team can assist.{" "}
        <Button variant="ghost" asChild>
          <a href="mailto:concierge@projectv0.in">concierge@projectv0.in</a>
        </Button>
      </div>
    </div>
  );
}

