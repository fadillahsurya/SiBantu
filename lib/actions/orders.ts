"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/matching/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: data.id }),
  }).catch(() => undefined);

  revalidatePath("/orders");
  redirect(`/orders/${data.id}`);
}

export async function acceptOrder(orderId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!worker) redirect("/worker/jobs");

  await supabase
    .from("orders")
    .update({ worker_id: worker.id, status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "waiting");

  revalidatePath("/worker/jobs");
  redirect(`/worker/jobs/${orderId}`);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  revalidatePath(`/worker/jobs/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
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
