import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OrderDetailLive } from "@/components/order-detail-live";
import { RatingCard } from "@/components/rating-card";
import { getOrderForCurrentUser } from "@/lib/data/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = auth.user
    ? await supabase.from("users").select("role").eq("id", auth.user.id).single()
    : { data: null };
  const order = await getOrderForCurrentUser(id);
  if (!order) notFound();
  const role = (profile?.role ?? "user") as UserRole;

  return (
    <AppShell role={role === "worker" ? "worker" : role === "admin" ? "admin" : "user"} title="Detail Order">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <OrderDetailLive initialOrder={order} />
        {role === "user" ? <RatingCard initialOrder={order} /> : null}
      </div>
    </AppShell>
  );
}
