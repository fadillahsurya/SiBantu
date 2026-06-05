import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForAdmin } from "@/lib/data/orders";

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin();

  return (
    <AppShell role="admin" title="Data Order">
      <RealtimeOrderList initialOrders={orders} hrefPrefix="/admin/orders" scope={{ type: "admin" }} />
    </AppShell>
  );
}
