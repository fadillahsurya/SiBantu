import { Power } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { toggleWorkerOnline } from "@/lib/actions/workers";
import { orders, workers } from "@/lib/data/mock";

export default function WorkerDashboard() {
  const worker = workers[0];
  return (
    <AppShell role="worker" title="Dashboard Worker">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent><p className="text-sm text-zinc-500">Status</p><p className="mt-2 text-3xl font-bold">{worker.is_online ? "Online" : "Offline"}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Rating</p><p className="mt-2 text-3xl font-bold">{worker.rating}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Job Aktif</p><p className="mt-2 text-3xl font-bold">{worker.active_jobs}</p></CardContent></Card>
      </div>
      <form action={async () => { "use server"; await toggleWorkerOnline(!worker.is_online); }} className="mt-5">
        <Button><Power className="h-4 w-4" /> Toggle Online / Offline</Button>
      </form>
      <h2 className="mb-4 mt-8 text-lg font-bold">Job Masuk Realtime</h2>
      <RealtimeOrderList initialOrders={orders.filter((order) => order.status !== "completed")} hrefPrefix="/worker/jobs" />
    </AppShell>
  );
}
