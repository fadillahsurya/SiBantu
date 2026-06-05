import { AppShell } from "@/components/app-shell";
import { WorkerCard } from "@/components/worker-card";
import { workers } from "@/lib/data/mock";

export default function WorkerProfilePage() {
  return <AppShell role="worker" title="Profile Worker"><WorkerCard worker={workers[0]} /></AppShell>;
}
