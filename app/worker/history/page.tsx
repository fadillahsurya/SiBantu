import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getCurrentWorkerProfile, getOrdersForCurrentWorker } from "@/lib/data/orders";

export default async function WorkerHistoryPage() {
  const worker = await getCurrentWorkerProfile();
  const orders = await getOrdersForCurrentWorker({ completed: true });

  return <AppShell role="worker" title="Riwayat Worker"><RealtimeOrderList initialOrders={orders} hrefPrefix="/worker/jobs" scope={{ type: "worker", workerId: worker?.id ?? "", completed: true }} /></AppShell>;
}
