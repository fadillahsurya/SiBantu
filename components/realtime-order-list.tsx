"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Order } from "@/lib/types";
import { OrderCard } from "@/components/order-card";
import { EmptyState } from "@/components/empty-state";

export function RealtimeOrderList({ initialOrders, hrefPrefix }: { initialOrders: Order[]; hrefPrefix: string }) {
  const [items, setItems] = useState(initialOrders);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        window.location.reload();
      })
      .subscribe();

    return () => {
      setItems(initialOrders);
      supabase.removeChannel(channel);
    };
  }, [initialOrders]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.length === 0 ? (
        <div className="md:col-span-2">
          <EmptyState title="Belum ada order" description="Data akan muncul otomatis ketika order baru dibuat atau status berubah realtime." />
        </div>
      ) : null}
      {items.map((order) => <OrderCard key={order.id} order={order} href={`${hrefPrefix}/${order.id}`} />)}
    </div>
  );
}
