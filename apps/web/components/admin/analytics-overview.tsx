"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from "recharts";
import { formatINRCurrency } from "@project_v0/utils";

interface RevenuePoint {
  label: string;
  value: number;
}

interface TierPoint {
  name: string;
  count: number;
}

interface InventoryPoint {
  name: string;
  stock: number;
  threshold: number;
}

interface AnalyticsOverviewProps {
  revenueByMonth: RevenuePoint[];
  tierMix: TierPoint[];
  inventoryLevels: InventoryPoint[];
}

export function AnalyticsOverview({
  revenueByMonth,
  tierMix,
  inventoryLevels
}: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Revenue trajectory
          </h3>
          <p className="text-xs text-slate-500">Last 6 months</p>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => formatINRCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Subscription mix
          </h3>
          <p className="text-xs text-slate-500">Active properties</p>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierMix}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Inventory watchlist
          </h3>
          <p className="text-xs text-slate-500">
            Highlighted when stock &lt; threshold
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {inventoryLevels.map((item) => {
            const isLow = item.stock <= item.threshold;
            return (
              <div
                key={item.name}
                className={`rounded-2xl border p-4 ${
                  isLow
                    ? "border-rose-200 bg-rose-50"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Stock: {item.stock} · MOQ trigger: {item.threshold}
                </p>
                <p className="mt-3 text-xs font-medium text-rose-500">
                  {isLow ? "Action required" : "Healthy"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

