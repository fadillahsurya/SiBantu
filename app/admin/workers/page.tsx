import { MapPin, Power, ShieldCheck, ShieldOff, Star } from "lucide-react";
import { AccountStatusBadge, WorkerStatusBadge } from "@/components/account-status-badge";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { setWorkerStatus } from "@/lib/actions/workers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AccountStatus, WorkerStatus } from "@/lib/types";

type WorkerRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  account_status: AccountStatus;
  is_online: boolean;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  status: WorkerStatus;
  created_at: string;
};

type RawWorker = {
  id: string;
  user_id: string;
  is_online: boolean;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  status: WorkerStatus;
  created_at: string;
  users:
    | {
        full_name: string;
        email: string;
        phone: string;
        status: AccountStatus;
      }
    | {
        full_name: string;
        email: string;
        phone: string;
        status: AccountStatus;
      }[]
    | null;
};

function normalizeWorker(worker: RawWorker): WorkerRow {
  const user = Array.isArray(worker.users) ? worker.users[0] : worker.users;

  return {
    id: worker.id,
    user_id: worker.user_id,
    full_name: user?.full_name ?? "Worker tanpa nama",
    email: user?.email ?? "-",
    phone: user?.phone ?? "-",
    account_status: user?.status ?? "active",
    is_online: worker.is_online,
    latitude: worker.latitude,
    longitude: worker.longitude,
    rating: Number(worker.rating ?? 0),
    status: worker.status,
    created_at: worker.created_at,
  };
}

function WorkerActions({ worker }: { worker: WorkerRow }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={async () => { "use server"; await setWorkerStatus(worker.id, "active"); }}>
        <Button className="h-9 px-3" variant="secondary" disabled={worker.status === "active"}>
          <ShieldCheck className="h-4 w-4" />
          Aktifkan
        </Button>
      </form>
      <form action={async () => { "use server"; await setWorkerStatus(worker.id, "suspended"); }}>
        <Button className="h-9 px-3" variant="danger" disabled={worker.status === "suspended"}>
          <ShieldOff className="h-4 w-4" />
          Suspend
        </Button>
      </form>
    </div>
  );
}

export default async function AdminWorkersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("worker_profiles")
    .select("id, user_id, is_online, latitude, longitude, rating, status, created_at, users(full_name, email, phone, status)")
    .order("created_at", { ascending: false });

  const workers = ((data ?? []) as RawWorker[]).map(normalizeWorker);
  const activeWorkers = workers.filter((worker) => worker.status === "active").length;
  const onlineWorkers = workers.filter((worker) => worker.is_online).length;
  const suspendedWorkers = workers.filter((worker) => worker.status === "suspended").length;

  return (
    <AppShell role="admin" title="Data Worker">
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Worker Aktif</p>
          <p className="mt-2 text-3xl font-black text-zinc-950">{activeWorkers}</p>
        </div>
        <div className="rounded-lg border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-700">Online</p>
          <p className="mt-2 text-3xl font-black text-sky-900">{onlineWorkers}</p>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-700">Suspended</p>
          <p className="mt-2 text-3xl font-black text-rose-900">{suspendedWorkers}</p>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">Worker</th>
              <th>Status</th>
              <th>Akun</th>
              <th>Online</th>
              <th>Rating</th>
              <th>Lokasi</th>
              <th className="pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-t border-zinc-100 align-middle">
                <td className="p-4">
                  <p className="font-bold text-zinc-950">{worker.full_name}</p>
                  <p className="text-xs text-zinc-500">{worker.email}</p>
                  <p className="text-xs text-zinc-500">{worker.phone}</p>
                </td>
                <td><WorkerStatusBadge status={worker.status} /></td>
                <td><AccountStatusBadge status={worker.account_status} /></td>
                <td>
                  <span className="inline-flex items-center gap-2 font-semibold text-zinc-700">
                    <Power className={worker.is_online ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-zinc-400"} />
                    {worker.is_online ? "Online" : "Offline"}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center gap-1 font-bold text-zinc-800">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {worker.rating.toFixed(1)}
                  </span>
                </td>
                <td className="text-xs text-zinc-500">
                  {worker.latitude && worker.longitude ? `${worker.latitude}, ${worker.longitude}` : "-"}
                </td>
                <td className="pr-4"><WorkerActions worker={worker} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {workers.map((worker) => (
          <div key={worker.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-950">{worker.full_name}</p>
                <p className="mt-1 break-all text-sm text-zinc-500">{worker.email}</p>
                <p className="text-sm text-zinc-500">{worker.phone}</p>
              </div>
              <WorkerStatusBadge status={worker.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-500">Akun</p>
                <AccountStatusBadge className="mt-2" status={worker.account_status} />
              </div>
              <div className="rounded-md bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-500">Online</p>
                <p className="mt-2 font-bold text-zinc-900">{worker.is_online ? "Online" : "Offline"}</p>
              </div>
              <div className="rounded-md bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-500">Rating</p>
                <p className="mt-2 inline-flex items-center gap-1 font-bold text-zinc-900"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{worker.rating.toFixed(1)}</p>
              </div>
              <div className="rounded-md bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-500">Lokasi</p>
                <p className="mt-2 inline-flex items-center gap-1 font-bold text-zinc-900"><MapPin className="h-4 w-4 text-zinc-500" />{worker.latitude && worker.longitude ? "Ada" : "-"}</p>
              </div>
            </div>
            <div className="mt-4"><WorkerActions worker={worker} /></div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
