import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForCurrentWorker } from "@/lib/data/orders";

export default async function WorkerJobsPage() {
  const orders = await getOrdersForCurrentWorker();

  return <AppShell role="worker" title="Daftar Order Masuk"><RealtimeOrderList initialOrders={orders} hrefPrefix="/worker/jobs" /></AppShell>;
}
