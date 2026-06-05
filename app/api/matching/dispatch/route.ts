import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { haversineDistance } from "@/lib/utils";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  const supabase = await createSupabaseServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, latitude, longitude, status")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: workers, error: workerError } = await supabase
    .from("worker_profiles")
    .select("id, latitude, longitude, rating")
    .eq("is_online", true)
    .eq("status", "active")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (workerError) {
    return NextResponse.json({ error: workerError.message }, { status: 500 });
  }

  const candidates = (workers ?? [])
    .map((worker) => ({
      worker_id: worker.id,
      distance_km: haversineDistance(order, worker),
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    }))
    .sort((a, b) => a.distance_km - b.distance_km);

  if (candidates[0]) {
    await supabase.from("order_dispatches").insert({
      order_id: order.id,
      worker_id: candidates[0].worker_id,
      distance_km: candidates[0].distance_km,
      expires_at: candidates[0].expires_at,
      status: "pending",
    });
  }

  return NextResponse.json({ candidates });
}
