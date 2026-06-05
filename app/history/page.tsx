import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForCurrentUser } from "@/lib/data/orders";

export default async function HistoryPage() {
  const orders = await getOrdersForCurrentUser("completed");

  return <AppShell role="user" title="Riwayat Order"><RealtimeOrderList initialOrders={orders} hrefPrefix="/orders" /></AppShell>;
}
