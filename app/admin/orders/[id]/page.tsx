import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OrderDetailLive } from "@/components/order-detail-live";
import { getOrderForCurrentUser } from "@/lib/data/orders";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);
  if (!order) notFound();

  return (
    <AppShell role="admin" title="Detail Order">
      <OrderDetailLive initialOrder={order} />
    </AppShell>
  );
}
