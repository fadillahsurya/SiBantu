import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { orders } from "@/lib/data/mock";

export default function HistoryPage() {
  return <AppShell role="user" title="Riwayat Order"><RealtimeOrderList initialOrders={orders.filter((o) => o.status === "completed")} hrefPrefix="/orders" /></AppShell>;
}
