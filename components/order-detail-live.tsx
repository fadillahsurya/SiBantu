"use client";

import { useEffect, useState } from "react";
import { Clock, Hash, MapPin, StickyNote, UserRound, Wrench } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { orderStatusLabels } from "@/lib/constants";
import { Order } from "@/lib/types";
import { formatDate } from "@/lib/utils";

async function fetchOrder(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload.order as Order;
}

function DetailItem({ icon: Icon, label, value }: { icon: typeof Hash; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-bold text-zinc-950">{value}</p>
    </div>
  );
}

export function OrderDetailLive({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`order-detail-${initialOrder.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${initialOrder.id}` },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            setNotice("Order dihapus");
            return;
          }

          const latest = await fetchOrder(initialOrder.id);
          if (!latest) return;
          setOrder(latest);
          setNotice(`Status berubah: ${orderStatusLabels[latest.status]}`);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <Card>
      {notice ? (
        <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 sm:px-6">
          {notice}
        </div>
      ) : null}
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">{order.service_name}</p>
          <h2 className="mt-1 text-xl font-black text-zinc-950">{order.address}</h2>
        </div>
        <StatusBadge status={order.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem icon={Hash} label="Order ID" value={order.id} />
          <DetailItem icon={Clock} label="Dibuat" value={formatDate(order.created_at)} />
          <DetailItem icon={UserRound} label="Customer" value={order.customer_name} />
          <DetailItem icon={Wrench} label="Worker" value={order.worker_name ?? "Belum ada worker"} />
          <DetailItem icon={MapPin} label="Koordinat" value={`${order.latitude}, ${order.longitude}`} />
          <DetailItem icon={StickyNote} label="Catatan" value={order.notes || "-"} />
        </div>
        <div className="mt-6">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-zinc-500">Timeline Status</h3>
          <OrderStatusTimeline status={order.status} />
        </div>
      </CardContent>
    </Card>
  );
}
