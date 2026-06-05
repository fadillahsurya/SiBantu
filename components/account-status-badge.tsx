import { AccountStatus, WorkerStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const accountStyles: Record<AccountStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  suspended: "bg-rose-50 text-rose-700 ring-rose-200",
};

const workerStyles: Record<WorkerStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  suspended: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function AccountStatusBadge({ status, className }: { status: AccountStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1", accountStyles[status], className)}>
      {status === "active" ? "Aktif" : "Suspended"}
    </span>
  );
}

export function WorkerStatusBadge({ status, className }: { status: WorkerStatus; className?: string }) {
  const label = status === "active" ? "Aktif" : status === "inactive" ? "Tidak Aktif" : "Suspended";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1", workerStyles[status], className)}>
      {label}
    </span>
  );
}
