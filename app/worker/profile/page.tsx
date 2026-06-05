import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { WorkerCard } from "@/components/worker-card";
import { getCurrentWorkerProfile } from "@/lib/data/orders";

export default async function WorkerProfilePage() {
  const worker = await getCurrentWorkerProfile();

  return (
    <AppShell role="worker" title="Profile Worker">
      {worker ? <WorkerCard worker={worker} /> : <Card><CardContent>Profile worker belum tersedia.</CardContent></Card>}
    </AppShell>
  );
}
