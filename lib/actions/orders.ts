"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/lib/types";
import { haversineDistance } from "@/lib/utils";

export async function createOrder(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect("/login");

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: auth.user.id,
      service_id: String(formData.get("service_id")),
      address: String(formData.get("address")),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      notes: String(formData.get("notes") ?? ""),
      status: "waiting",
    })
    .select("id")
    .single();

  if (error || !data) redirect(`/orders/new?error=${encodeURIComponent(error?.message ?? "Order failed")}`);

  const location = {
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
  };

  const { data: workers } = await supabase
    .from("worker_profiles")
    .select("id, latitude, longitude")
    .eq("is_online", true)
    .eq("status", "active")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  const candidates = (workers ?? [])
    .map((worker) => ({
      order_id: data.id,
      worker_id: worker.id,
      distance_km: haversineDistance(location, {
        latitude: Number(worker.latitude),
        longitude: Number(worker.longitude),
      }),
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      status: "pending",
    }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 3);

  if (candidates.length > 0) {
    await supabase.from("order_dispatches").insert(candidates);
  }

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/worker/jobs");
  revalidatePath("/worker/dashboard");
  redirect(`/orders/${data.id}`);
}

export async function acceptOrder(orderId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id, is_online, status")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker || worker.status !== "active" || !worker.is_online) redirect("/worker/jobs");

  const { data: acceptedOrder } = await supabase
    .from("orders")
    .update({ worker_id: worker.id, status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "waiting")
    .select("id")
    .single();

  if (acceptedOrder) {
    await supabase
      .from("order_dispatches")
      .update({ status: "accepted" })
      .eq("order_id", orderId)
      .eq("worker_id", worker.id);

    await supabase
      .from("order_dispatches")
      .update({ status: "expired" })
      .eq("order_id", orderId)
      .neq("worker_id", worker.id);
  }

  revalidatePath("/worker/jobs");
  revalidatePath("/worker/dashboard");
  revalidatePath(`/orders/${orderId}`);
  redirect(`/worker/jobs/${orderId}`);
}

const allowedTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  accepted: ["on_the_way"],
  on_the_way: ["working"],
  working: ["completed"],
};

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker) redirect("/worker/jobs");

  const { data: order } = await supabase
    .from("orders")
    .select("status, worker_id")
    .eq("id", orderId)
    .single();

  if (!order || order.worker_id !== worker.id) redirect("/worker/jobs");
  if (!allowedTransitions[order.status as OrderStatus]?.includes(status)) redirect(`/worker/jobs/${orderId}`);

  await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("worker_id", worker.id);

  revalidatePath(`/worker/jobs/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/worker/jobs");
  revalidatePath("/worker/dashboard");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
}

export async function rateOrder(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("ratings").insert({
    order_id: String(formData.get("order_id")),
    worker_id: String(formData.get("worker_id")),
    user_id: String(formData.get("user_id")),
    rating: Number(formData.get("rating")),
    review: String(formData.get("review") ?? ""),
  });
  revalidatePath("/history");
}
