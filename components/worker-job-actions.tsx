"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckCircle2, Loader2, Navigation, Play, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptOrderLive, updateOrderStatusLive } from "@/lib/actions/orders";
import { orderStatusLabels } from "@/lib/constants";
import { Order, OrderStatus } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const nextStatusByCurrent: Partial<Record<OrderStatus, { status: OrderStatus; label: string; icon: typeof Navigation }>> = {
  accepted: { status: "on_the_way", label: "Start Navigation", icon: Navigation },
  on_the_way: { status: "working", label: "Start Working", icon: Play },
  working: { status: "completed", label: "Complete Job", icon: CheckCircle2 },
};

async function fetchOrder(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload.order as Order;
}

export function WorkerJobActions({ order: initialOrder }: { order: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const next = useMemo(() => nextStatusByCurrent[order.status], [order.status]);
  const NextIcon = next?.icon;

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`worker-job-actions-${initialOrder.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `id=eq.${initialOrder.id}` }, async () => {
        const latest = await fetchOrder(initialOrder.id);
        if (latest) setOrder(latest);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  const run = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      setMessage(null);
      const result = await action();
      setMessage(result.message);
      const latest = await fetchOrder(order.id);
      if (latest) setOrder(latest);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {order.status === "waiting" ? (
          <Button disabled={isPending} onClick={() => run(() => acceptOrderLive(order.id))}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Accept Job
          </Button>
        ) : null}

        {next ? (
          <Button variant="secondary" disabled={isPending} onClick={() => run(() => updateOrderStatusLive(order.id, next.status))}>
            {isPending || !NextIcon ? <Loader2 className="h-4 w-4 animate-spin" /> : <NextIcon className="h-4 w-4" />}
            {next.label}
          </Button>
        ) : null}

        {order.status !== "completed" && order.status !== "cancelled" ? (
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => {
              if (window.confirm("Batalkan job ini? Status akan berubah realtime ke user dan admin.")) {
                run(() => updateOrderStatusLive(order.id, "cancelled"));
              }
            }}
          >
            <XCircle className="h-4 w-4" />
            Cancel Job
          </Button>
        ) : null}
      </div>
      {message ? (
        <p className="rounded-lg bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
          {message}
          {order.status !== "completed" && order.status !== "cancelled" ? ` Current status: ${orderStatusLabels[order.status]}.` : ""}
        </p>
      ) : null}
    </div>
  );
}
