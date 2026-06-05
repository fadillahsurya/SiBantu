import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", auth.user.id).single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  return NextResponse.json({
    totalOrders: totalOrders ?? 0,
    activeOrders: activeOrders ?? 0,
    completedOrders: completedOrders ?? 0,
    cancelledOrders: cancelledOrders ?? 0,
    onlineWorkers: onlineWorkers ?? 0,
    offlineWorkers: offlineWorkers ?? 0,
  });
}
