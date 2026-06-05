import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForCurrentUser } from "@/lib/data/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const orders = await getOrdersForCurrentUser("completed");

  return <AppShell role="user" title="Riwayat Order"><RealtimeOrderList initialOrders={orders} hrefPrefix="/orders" scope={{ type: "user", userId: auth.user?.id ?? "", status: "completed" }} /></AppShell>;
}
