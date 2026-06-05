import { Star } from "lucide-react";
import { WorkerProfile } from "@/lib/types";

export function WorkerCard({ worker }: { worker: WorkerProfile }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-zinc-950">{worker.full_name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{worker.phone}</p>
        </div>
        <span className={worker.is_online ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700" : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600"}>
          {worker.is_online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-4 w-4 fill-amber-400" /> {worker.rating}</span>
        <span className="font-medium capitalize text-zinc-600">{worker.status}</span>
      </div>
    </div>
  );
}
