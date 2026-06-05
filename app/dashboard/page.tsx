import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForCurrentUser } from "@/lib/data/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function UserDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const orders = await getOrdersForCurrentUser();
  const [{ count: servicesCount }, { count: onlineWorkers }] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("worker_profiles").select("id", { count: "exact", head: true }).eq("is_online", true).eq("status", "active"),
  ]);

  return (
    <AppShell role="user" title="Dashboard User">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent><p className="text-sm text-zinc-500">Order Aktif</p><p className="mt-2 text-3xl font-bold">{orders.filter((o) => o.status !== "completed").length}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Layanan</p><p className="mt-2 text-3xl font-bold">{servicesCount ?? 0}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Worker Online</p><p className="mt-2 text-3xl font-bold">{onlineWorkers ?? 0}</p></CardContent></Card>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-zinc-950">Order Terbaru</h2>
        <ButtonLink href="/orders/new"><Plus className="h-4 w-4" /> Buat Order</ButtonLink>
      </div>
      <div className="mt-4"><RealtimeOrderList initialOrders={orders.slice(0, 2)} hrefPrefix="/orders" scope={{ type: "user", userId: auth.user?.id ?? "" }} /></div>
    </AppShell>
  );
}
