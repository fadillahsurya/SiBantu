import { AdminLiveDashboard } from "@/components/admin-live-dashboard";
import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForAdmin } from "@/lib/data/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const orders = await getOrdersForAdmin();

  const [
    { count: totalOrders },
    { count: activeOrders },
    { count: completedOrders },
    { count: cancelledOrders },
    { count: onlineWorkers },
    { count: offlineWorkers },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).not("status", "in", "(completed,cancelled)"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("worker_profiles").select("id", { count: "exact", head: true }).eq("is_online", true).eq("status", "active"),
    supabase.from("worker_profiles").select("id", { count: "exact", head: true }).eq("is_online", false),
  ]);

  return (
    <AppShell role="admin" title="Admin Dashboard">
      <AdminLiveDashboard
        initialMetrics={{
          totalOrders: totalOrders ?? 0,
          activeOrders: activeOrders ?? 0,
          completedOrders: completedOrders ?? 0,
          cancelledOrders: cancelledOrders ?? 0,
          onlineWorkers: onlineWorkers ?? 0,
          offlineWorkers: offlineWorkers ?? 0,
        }}
      />

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Live Feed</p>
            <h2 className="text-xl font-black text-zinc-950">Perubahan order realtime</h2>
          </div>
          <p className="text-sm font-medium text-zinc-500">INSERT, UPDATE, DELETE dipantau langsung.</p>
        </div>
        <RealtimeOrderList initialOrders={orders.slice(0, 8)} hrefPrefix="/orders" scope={{ type: "admin" }} />
      </div>
    </AppShell>
  );
}
