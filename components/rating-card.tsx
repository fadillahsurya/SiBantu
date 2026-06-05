"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { rateOrder } from "@/lib/actions/orders";
import { Order } from "@/lib/types";

async function fetchOrder(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload.order as Order;
}

export function RatingCard({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const canRate = order.status === "completed" && Boolean(order.worker_id);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`rating-order-${initialOrder.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `id=eq.${initialOrder.id}` }, async () => {
        const latest = await fetchOrder(initialOrder.id);
        if (latest) setOrder(latest);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-lg font-black text-zinc-950">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          Rating Worker
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{canRate ? "Order selesai. Kamu bisa memberi rating." : "Rating aktif setelah worker menyelesaikan pekerjaan."}</p>
      </CardHeader>
      <CardContent>
        <form action={rateOrder} className="grid gap-4">
          <input type="hidden" name="order_id" value={order.id} />
          <input type="hidden" name="worker_id" value={order.worker_id ?? ""} />
          <input type="hidden" name="user_id" value={order.user_id} />
          <div><Label>Rating 1-5</Label><Input name="rating" type="number" min="1" max="5" defaultValue="5" /></div>
          <div><Label>Review</Label><Textarea name="review" placeholder="Tulis pengalaman singkat." /></div>
          <Button disabled={!canRate}>Kirim Rating</Button>
        </form>
      </CardContent>
    </Card>
  );
}
