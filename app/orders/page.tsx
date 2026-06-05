import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { RealtimeOrderList } from "@/components/realtime-order-list";
import { getOrdersForCurrentUser } from "@/lib/data/orders";

export default async function OrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <AppShell role="user" title="Order Saya">
      <div className="mb-5 flex justify-end"><ButtonLink href="/orders/new"><Plus className="h-4 w-4" /> Buat Order</ButtonLink></div>
      <RealtimeOrderList initialOrders={orders} hrefPrefix="/orders" />
    </AppShell>
  );
}
