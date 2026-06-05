import { Activity, BriefcaseBusiness, ClipboardList, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Users; tone: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-zinc-950">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalOrders },
    { count: totalWorkers },
    { count: totalUsers },
    { count: onlineWorkers },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("worker_profiles").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("worker_profiles").select("id", { count: "exact", head: true }).eq("is_online", true),
  ]);

  return (
    <AppShell role="admin" title="Admin Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Order" value={totalOrders ?? 0} icon={ClipboardList} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Total Worker" value={totalWorkers ?? 0} icon={BriefcaseBusiness} tone="bg-sky-50 text-sky-700" />
        <StatCard label="Total User" value={totalUsers ?? 0} icon={Users} tone="bg-violet-50 text-violet-700" />
        <StatCard label="Worker Online" value={onlineWorkers ?? 0} icon={Activity} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Monitoring</p>
        <h2 className="mt-2 text-xl font-black text-zinc-950">Approval akun dan aktivitas order siap dipantau.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
          Gunakan menu Worker untuk mengaktifkan atau suspend worker, dan menu User untuk mengelola status akun pelanggan maupun worker.
        </p>
      </div>
    </AppShell>
  );
}
