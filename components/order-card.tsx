import Link from "next/link";
import { MapPin } from "lucide-react";
import { Order } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

export function OrderCard({ order, href }: { order: Order; href: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-zinc-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-emerald-700">{order.service_name}</p>
          <h3 className="mt-1 text-lg font-black leading-6 text-zinc-950">{order.address}</h3>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
        <MapPin className="h-4 w-4" />
        <span>{order.worker_name ? `Worker: ${order.worker_name}` : "Belum ada worker"}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-500">{formatDate(order.updated_at)}</p>
    </Link>
  );
}
