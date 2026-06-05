import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order, OrderStatus } from "@/lib/types";

type RawOrder = {
  id: string;
  user_id: string;
  worker_id: string | null;
  service_id: string;
  address: string;
  latitude: number;
  longitude: number;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  services: { name: string } | { name: string }[] | null;
  users: { full_name: string } | { full_name: string }[] | null;
  worker_profiles:
    | { users: { full_name: string } | { full_name: string }[] | null }
    | { users: { full_name: string } | { full_name: string }[] | null }[]
    | null;
};

function first<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function normalizeOrder(order: RawOrder): Order {
  const service = first(order.services);
  const customer = first(order.users);
  const workerProfile = first(order.worker_profiles);
  const workerUser = first(workerProfile?.users ?? null);

  return {
    id: order.id,
    user_id: order.user_id,
    worker_id: order.worker_id,
    service_id: order.service_id,
    service_name: service?.name ?? "Layanan",
    customer_name: customer?.full_name ?? "User",
    worker_name: workerUser?.full_name ?? null,
    address: order.address,
    latitude: Number(order.latitude),
    longitude: Number(order.longitude),
    notes: order.notes ?? "",
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("id, user_id, worker_id, service_id, address, latitude, longitude, notes, status, created_at, updated_at, services(name), users(full_name), worker_profiles(users(full_name))")
    .order("updated_at", { ascending: false });

  const orders = ((data ?? []) as RawOrder[]).map(normalizeOrder);

  return (
    <AppShell role="admin" title="Data Order">
      <RealtimeOrderList initialOrders={orders} hrefPrefix="/orders" />
    </AppShell>
  );
}
