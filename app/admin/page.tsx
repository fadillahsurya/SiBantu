import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { orders, users, workers } from "@/lib/data/mock";

export default function AdminDashboard() {
  return (
    <AppShell role="admin" title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent><p className="text-sm text-zinc-500">Total Order</p><p className="mt-2 text-3xl font-bold">{orders.length}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Total Worker</p><p className="mt-2 text-3xl font-bold">{workers.length}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Total User</p><p className="mt-2 text-3xl font-bold">{users.filter((u) => u.role === "user").length}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-zinc-500">Online</p><p className="mt-2 text-3xl font-bold">{workers.filter((w) => w.is_online).length}</p></CardContent></Card>
      </div>
    </AppShell>
  );
}
