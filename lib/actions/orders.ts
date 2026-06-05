"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/lib/types";

type ActionResult = {
  ok: boolean;
  message: string;
};

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

export async function acceptOrderLive(orderId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, message: "Silakan login ulang." };

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id, is_online, status")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker || worker.status !== "active") return { ok: false, message: "Akun worker belum aktif." };
  if (!worker.is_online) return { ok: false, message: "Worker harus online untuk menerima job." };

  const { data: acceptedOrder, error } = await supabase
    .from("orders")
    .update({ worker_id: worker.id, status: "accepted" })
    .eq("id", orderId)
    .eq("status", "waiting")
    .select("id")
    .single();

  if (error || !acceptedOrder) return { ok: false, message: "Job sudah diambil atau tidak tersedia." };

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

  revalidatePath("/worker/jobs");
  revalidatePath("/worker/dashboard");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/worker/jobs/${orderId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return { ok: true, message: "Job berhasil diterima." };
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

export async function updateOrderStatusLive(orderId: string, status: OrderStatus): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, message: "Silakan login ulang." };

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker) return { ok: false, message: "Profile worker tidak ditemukan." };

  const { data: order } = await supabase
    .from("orders")
    .select("status, worker_id")
    .eq("id", orderId)
    .single();

  if (!order || order.worker_id !== worker.id) return { ok: false, message: "Kamu tidak memiliki akses ke job ini." };
  if (status !== "cancelled" && !allowedTransitions[order.status as OrderStatus]?.includes(status)) {
    return { ok: false, message: `Transisi ${order.status} ke ${status} tidak valid.` };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("worker_id", worker.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/worker/jobs/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/worker/jobs");
  revalidatePath("/worker/dashboard");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return { ok: true, message: status === "cancelled" ? "Job dibatalkan." : "Status job diperbarui." };
}

export async function rateOrder(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ratings").insert({
    order_id: String(formData.get("order_id")),
    worker_id: String(formData.get("worker_id")),
    user_id: String(formData.get("user_id")),
    rating: Number(formData.get("rating")),
    review: String(formData.get("review") ?? ""),
  });
  if (error) redirect(`/orders/${String(formData.get("order_id"))}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/history");
  revalidatePath(`/orders/${String(formData.get("order_id"))}`);
}
