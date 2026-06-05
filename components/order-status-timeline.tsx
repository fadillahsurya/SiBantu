import { CheckCircle2, Circle } from "lucide-react";
import { orderStatusLabels, orderStatusSteps } from "@/lib/constants";
import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const currentStep = orderStatusSteps.indexOf(status);

  return (
    <div className="space-y-3">
      {orderStatusSteps.map((step, index) => {
        const isDone = index <= currentStep;
        return (
          <div key={step} className="flex items-center gap-3">
            <span className={cn("grid h-8 w-8 place-items-center rounded-full ring-1 transition", isDone ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-zinc-300 ring-zinc-200")}>
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </span>
            <span className={cn("text-sm font-bold transition", isDone ? "text-zinc-950" : "text-zinc-400")}>
              {orderStatusLabels[step]}
            </span>
          </div>
        );
      })}
      {status === "cancelled" ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          Order dibatalkan
        </div>
      ) : null}
    </div>
  );
}
