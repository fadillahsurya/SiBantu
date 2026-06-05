import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { acceptOrder, updateOrderStatus } from "@/lib/actions/orders";
import { orderStatusLabels } from "@/lib/constants";
import { getOrderForCurrentUser } from "@/lib/data/orders";
import { OrderStatus } from "@/lib/types";

const nextStatusByCurrent: Partial<Record<OrderStatus, OrderStatus>> = {
  accepted: "on_the_way",
  on_the_way: "working",
  working: "completed",
};

export default async function WorkerJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);
  if (!order) notFound();
  const nextStatus = nextStatusByCurrent[order.status];

  return (
    <AppShell role="worker" title="Detail Job">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div><p className="text-sm font-semibold text-emerald-700">{order.service_name}</p><h2 className="mt-1 text-xl font-bold">{order.address}</h2></div>
          <StatusBadge status={order.status} />
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div><dt className="font-semibold text-zinc-950">Customer</dt><dd className="mt-1 text-zinc-600">{order.customer_name}</dd></div>
            <div><dt className="font-semibold text-zinc-950">Koordinat</dt><dd className="mt-1 text-zinc-600">{order.latitude}, {order.longitude}</dd></div>
            <div className="md:col-span-2"><dt className="font-semibold text-zinc-950">Catatan</dt><dd className="mt-1 text-zinc-600">{order.notes}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            {order.status === "waiting" ? (
              <form action={async () => { "use server"; await acceptOrder(order.id); }}><Button>Terima Job</Button></form>
            ) : null}
            {nextStatus ? (
              <form action={async () => { "use server"; await updateOrderStatus(order.id, nextStatus); }}>
                <Button variant="secondary">{orderStatusLabels[nextStatus]}</Button>
              </form>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
