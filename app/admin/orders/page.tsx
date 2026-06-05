import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { orders } from "@/lib/data/mock";

export default function AdminOrdersPage() {
  return <AppShell role="admin" title="Data Order"><RealtimeOrderList initialOrders={orders} hrefPrefix="/orders" /></AppShell>;
}
