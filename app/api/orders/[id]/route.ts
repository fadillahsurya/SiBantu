import { NextResponse } from "next/server";
import { normalizeOrder, orderSelect, RawOrder } from "@/lib/data/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: normalizeOrder(data as RawOrder) });
}
