import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OrderDetailLive } from "@/components/order-detail-live";
import { WorkerJobActions } from "@/components/worker-job-actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOrderForCurrentUser } from "@/lib/data/orders";

export default async function WorkerJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);
  if (!order) notFound();

  return (
    <AppShell role="worker" title="Detail Job">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <OrderDetailLive initialOrder={order} />
        <Card>
          <CardHeader>
            <h2 className="text-lg font-black text-zinc-950">Worker Actions</h2>
            <p className="mt-1 text-sm text-zinc-500">Setiap perubahan status akan terkirim realtime ke user dan admin.</p>
          </CardHeader>
          <CardContent>
            <WorkerJobActions order={order} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
