import { Power } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { toggleWorkerOnline } from "@/lib/actions/workers";
import { getCurrentWorkerProfile, getOrdersForCurrentWorker } from "@/lib/data/orders";

export default async function WorkerDashboard() {
  const worker = await getCurrentWorkerProfile();
  const orders = await getOrdersForCurrentWorker();
  const activeJobs = orders.filter((order) => order.status !== "waiting").length;

  if (!worker) {
    return (
      <AppShell role="worker" title="Dashboard Worker">
        <Card><CardContent><p className="font-bold text-zinc-950">Profile worker belum tersedia.</p></CardContent></Card>
      </AppShell>
    );
  }

  return (
    <AppShell role="worker" title="Dashboard Worker">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent><p className="text-sm text-zinc-500">Status</p><p className="mt-2 text-3xl font-bold">{worker.is_online ? "Online" : "Offline"}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Rating</p><p className="mt-2 text-3xl font-bold">{worker.rating}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Job Aktif</p><p className="mt-2 text-3xl font-bold">{activeJobs}</p></CardContent></Card>
      </div>
      <form action={async () => { "use server"; await toggleWorkerOnline(!worker.is_online); }} className="mt-5">
        <Button disabled={worker.status !== "active"}><Power className="h-4 w-4" /> Toggle Online / Offline</Button>
      </form>
      {worker.status !== "active" ? <p className="mt-3 text-sm font-semibold text-rose-600">Akun worker belum aktif atau sedang disuspend oleh admin.</p> : null}
      <h2 className="mb-4 mt-8 text-lg font-bold">Job Masuk Realtime</h2>
      <RealtimeOrderList initialOrders={orders.filter((order) => order.status !== "completed")} hrefPrefix="/worker/jobs" />
    </AppShell>
  );
}
