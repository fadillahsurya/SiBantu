import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { orderStatusSteps, orderStatusLabels } from "@/lib/constants";
import { getOrderForCurrentUser } from "@/lib/data/orders";
import { rateOrder } from "@/lib/actions/orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);
  if (!order) notFound();
  const currentStep = orderStatusSteps.indexOf(order.status);

  return (
    <AppShell role="user" title="Detail Order">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">{order.service_name}</p><h2 className="mt-1 text-xl font-bold">{order.address}</h2></div><StatusBadge status={order.status} /></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">{order.notes}</p>
            <div className="mt-6 space-y-4">
              {orderStatusSteps.map((status, index) => (
                <div key={status} className="flex items-center gap-3">
                  <span className={index <= currentStep ? "h-3 w-3 rounded-full bg-emerald-600" : "h-3 w-3 rounded-full bg-zinc-200"} />
                  <span className={index <= currentStep ? "font-semibold text-zinc-950" : "text-zinc-500"}>{orderStatusLabels[status]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="text-lg font-bold">Rating Worker</h2></CardHeader>
          <CardContent>
            <form action={rateOrder} className="grid gap-4">
              <input type="hidden" name="order_id" value={order.id} />
              <input type="hidden" name="worker_id" value={order.worker_id ?? ""} />
              <input type="hidden" name="user_id" value={order.user_id} />
              <div><Label>Rating 1-5</Label><Input name="rating" type="number" min="1" max="5" defaultValue="5" /></div>
              <div><Label>Review</Label><Textarea name="review" /></div>
              <Button disabled={order.status !== "completed" || !order.worker_id}>Kirim Rating</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
