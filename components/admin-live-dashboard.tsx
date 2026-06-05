"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, ClipboardList, Timer, XCircle, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Metrics = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  onlineWorkers: number;
  offlineWorkers: number;
};

const cards = [
  { key: "totalOrders", label: "Total Order", icon: ClipboardList, tone: "bg-zinc-950 text-white" },
  { key: "activeOrders", label: "Order Aktif", icon: Timer, tone: "bg-sky-50 text-sky-700" },
  { key: "completedOrders", label: "Selesai", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  { key: "cancelledOrders", label: "Dibatalkan", icon: XCircle, tone: "bg-rose-50 text-rose-700" },
  { key: "onlineWorkers", label: "Worker Online", icon: Activity, tone: "bg-amber-50 text-amber-700" },
  { key: "offlineWorkers", label: "Worker Offline", icon: WifiOff, tone: "bg-zinc-100 text-zinc-700" },
] as const;

async function fetchMetrics() {
  const response = await fetch("/api/admin/metrics", { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as Metrics;
}

export function AdminLiveDashboard({ initialMetrics }: { initialMetrics: Metrics }) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [pulse, setPulse] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const refresh = async (message: string) => {
      const latest = await fetchMetrics();
      if (latest) setMetrics(latest);
      setPulse(message);
    };

    const channel = supabase
      .channel("admin-monitoring")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => refresh("Order berubah realtime"))
      .on("postgres_changes", { event: "*", schema: "public", table: "worker_profiles" }, () => refresh("Status worker berubah"))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!pulse) return;
    const timer = window.setTimeout(() => setPulse(null), 2500);
    return () => window.clearTimeout(timer);
  }, [pulse]);

  return (
    <>
      {pulse ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {pulse}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.key} className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                <p className="mt-2 text-3xl font-black text-zinc-950">{metrics[card.key]}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-lg ${card.tone}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
