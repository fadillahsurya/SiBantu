import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order, OrderStatus } from "@/lib/types";

export type RawOrder = {
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

export function normalizeOrder(order: RawOrder): Order {
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

export const orderSelect = "id, user_id, worker_id, service_id, address, latitude, longitude, notes, status, created_at, updated_at, services(name), users(full_name), worker_profiles(users(full_name))";

export async function getOrdersForCurrentUser(status?: OrderStatus) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  let query = supabase
    .from("orders")
    .select(orderSelect)
    .eq("user_id", auth.user.id)
    .order("updated_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data } = await query;
  return ((data ?? []) as RawOrder[]).map(normalizeOrder);
}

export async function getOrderForCurrentUser(orderId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", orderId)
    .single();

  return data ? normalizeOrder(data as RawOrder) : null;
}

export async function getOrdersForAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(orderSelect)
    .order("updated_at", { ascending: false });

  return ((data ?? []) as RawOrder[]).map(normalizeOrder);
}

export async function getOrdersForCurrentWorker({ completed = false }: { completed?: boolean } = {}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id, is_online, status")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker || worker.status !== "active") return [];

  const { data: dispatches } = await supabase
    .from("order_dispatches")
    .select("order_id")
    .eq("worker_id", worker.id)
    .eq("status", "pending");

  const dispatchedOrderIds = (dispatches ?? []).map((item) => item.order_id);

  let query = supabase
    .from("orders")
    .select(orderSelect)
    .order("updated_at", { ascending: false });

  if (completed) {
    query = query.eq("worker_id", worker.id).eq("status", "completed");
  } else if (worker.is_online) {
    const waitingFilter = dispatchedOrderIds.length > 0 ? `id.in.(${dispatchedOrderIds.join(",")})` : "id.eq.00000000-0000-0000-0000-000000000000";
    query = query.or(`${waitingFilter},worker_id.eq.${worker.id}`).neq("status", "completed");
  } else {
    query = query.eq("worker_id", worker.id).neq("status", "completed");
  }

  const { data } = await query;
  return ((data ?? []) as RawOrder[]).map(normalizeOrder);
}

export async function getPendingDispatchOrderIdsForCurrentWorker() {
  const supabase = await createSupabaseServerClient();
  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .single();

  if (!worker) return [];

  const { data } = await supabase
    .from("order_dispatches")
    .select("order_id")
    .eq("worker_id", worker.id)
    .eq("status", "pending");

  return (data ?? []).map((item) => item.order_id as string);
}

export async function getCurrentWorkerProfile() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("worker_profiles")
    .select("id, user_id, is_online, latitude, longitude, rating, status, created_at, users(full_name, phone)")
    .eq("user_id", auth.user.id)
    .single();

  if (!data) return null;

  const user = Array.isArray(data.users) ? data.users[0] : data.users;

  return {
    id: data.id,
    user_id: data.user_id,
    full_name: user?.full_name ?? "Worker",
    phone: user?.phone ?? "-",
    is_online: data.is_online,
    latitude: Number(data.latitude ?? 0),
    longitude: Number(data.longitude ?? 0),
    rating: Number(data.rating ?? 0),
    status: data.status,
    active_jobs: 0,
    created_at: data.created_at,
  };
}
