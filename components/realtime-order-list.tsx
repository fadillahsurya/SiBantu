"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Order } from "@/lib/types";
import { OrderCard } from "@/components/order-card";
import { EmptyState } from "@/components/empty-state";
import { orderStatusLabels } from "@/lib/constants";

type RealtimeScope =
  | { type: "admin" }
  | { type: "user"; userId: string; status?: Order["status"] }
  | { type: "worker"; workerId: string; completed?: boolean; waitingOrderIds?: string[] };

function shouldShowOrder(order: Order, scope?: RealtimeScope, liveWaitingOrderIds: string[] = []) {
  if (!scope) return true;
  if (scope.type === "admin") return true;
  if (scope.type === "user") return order.user_id === scope.userId && (!scope.status || order.status === scope.status);
  if (scope.completed) return order.worker_id === scope.workerId && order.status === "completed";
  return order.status !== "completed" && (order.worker_id === scope.workerId || (order.status === "waiting" && liveWaitingOrderIds.includes(order.id)));
}

async function fetchOrder(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload.order as Order;
}

export function RealtimeOrderList({
  initialOrders,
  hrefPrefix,
  scope,
}: {
  initialOrders: Order[];
  hrefPrefix: string;
  scope?: RealtimeScope;
}) {
  const [items, setItems] = useState(initialOrders);
  const [notice, setNotice] = useState<string | null>(null);
  const [liveWaitingOrderIds, setLiveWaitingOrderIds] = useState(scope?.type === "worker" ? scope.waitingOrderIds ?? [] : []);
  const liveWaitingOrderIdsRef = useRef(liveWaitingOrderIds);
  const scopeKey = useMemo(() => JSON.stringify(scope ?? {}), [scope]);

  useEffect(() => {
    liveWaitingOrderIdsRef.current = liveWaitingOrderIds;
  }, [liveWaitingOrderIds]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async (payload) => {
        const orderId = (payload.new as { id?: string }).id ?? (payload.old as { id?: string }).id;
        if (!orderId) return;

        if (payload.eventType === "DELETE") {
          setItems((current) => current.filter((order) => order.id !== orderId));
          setNotice("Order dihapus");
          return;
        }

        const order = await fetchOrder(orderId);
        if (!order) return;

        setItems((current) => {
          const visible = shouldShowOrder(order, scope, liveWaitingOrderIdsRef.current);
          const exists = current.some((item) => item.id === order.id);

          if (!visible) return current.filter((item) => item.id !== order.id);
          if (exists) {
            return current
              .map((item) => (item.id === order.id ? order : item))
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          }

          return [order, ...current].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        });

        setNotice(payload.eventType === "INSERT" ? "Order baru masuk" : `Status: ${orderStatusLabels[order.status]}`);
      });

    if (scope?.type === "worker" && !scope.completed) {
      channel.on("postgres_changes", { event: "*", schema: "public", table: "order_dispatches" }, async (payload) => {
        const dispatch = payload.new as { order_id?: string; worker_id?: string; status?: string };
        const oldDispatch = payload.old as { order_id?: string; worker_id?: string };
        const orderId = dispatch.order_id ?? oldDispatch.order_id;
        if (!orderId) return;

        if (payload.eventType === "DELETE" || dispatch.status !== "pending") {
          setLiveWaitingOrderIds((current) => current.filter((id) => id !== orderId));
          return;
        }

        setLiveWaitingOrderIds((current) => Array.from(new Set([orderId, ...current])));
        const order = await fetchOrder(orderId);
        if (!order) return;
        setItems((current) => {
          if (!shouldShowOrder(order, scope, [orderId, ...liveWaitingOrderIdsRef.current])) return current;
          if (current.some((item) => item.id === order.id)) return current;
          return [order, ...current];
        });
        setNotice("New Order Received");
      });
    }

    channel.subscribe();

    return () => {
      setItems(initialOrders);
      supabase.removeChannel(channel);
    };
  }, [initialOrders, scope, scopeKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <>
      {notice ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 shadow-lg">
          {notice}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState title="Belum ada order" description="Data akan muncul otomatis ketika order baru dibuat atau status berubah realtime." />
          </div>
        ) : null}
        {items.map((order) => <OrderCard key={order.id} order={order} href={`${hrefPrefix}/${order.id}`} />)}
      </div>
    </>
  );
}
