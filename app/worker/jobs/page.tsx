import { AppShell } from "@/components/app-shell";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getCurrentWorkerProfile, getOrdersForCurrentWorker, getPendingDispatchOrderIdsForCurrentWorker } from "@/lib/data/orders";

export default async function WorkerJobsPage() {
  const worker = await getCurrentWorkerProfile();
  const orders = await getOrdersForCurrentWorker();
  const waitingOrderIds = await getPendingDispatchOrderIdsForCurrentWorker();

  return <AppShell role="worker" title="Daftar Order Masuk"><RealtimeOrderList initialOrders={orders} hrefPrefix="/worker/jobs" scope={{ type: "worker", workerId: worker?.id ?? "", waitingOrderIds }} /></AppShell>;
}
