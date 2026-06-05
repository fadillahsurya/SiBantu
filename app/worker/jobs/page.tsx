import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { orders } from "@/lib/data/mock";

export default function WorkerJobsPage() {
  return <AppShell role="worker" title="Daftar Order Masuk"><RealtimeOrderList initialOrders={orders.filter((order) => order.status !== "completed")} hrefPrefix="/worker/jobs" /></AppShell>;
}
