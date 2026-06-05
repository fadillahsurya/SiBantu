import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { setWorkerStatus } from "@/lib/actions/workers";
import { workers } from "@/lib/data/mock";

export default function AdminWorkersPage() {
  return (
    <AppShell role="admin" title="Data Worker">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-4">Nama</th><th>Status</th><th>Online</th><th>Rating</th><th>Aksi</th></tr></thead>
          <tbody>{workers.map((worker) => <tr key={worker.id} className="border-t border-zinc-100"><td className="p-4 font-semibold">{worker.full_name}</td><td className="capitalize">{worker.status}</td><td>{worker.is_online ? "Online" : "Offline"}</td><td>{worker.rating}</td><td className="flex gap-2 py-3"><form action={async () => { "use server"; await setWorkerStatus(worker.id, "active"); }}><Button variant="secondary">Aktifkan</Button></form><form action={async () => { "use server"; await setWorkerStatus(worker.id, "suspended"); }}><Button variant="danger">Suspend</Button></form></td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
