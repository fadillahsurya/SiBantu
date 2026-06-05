import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none ring-emerald-500 transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2", props.className)}
      {...props}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-28 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2", props.className)}
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2", props.className)}
      {...props}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-bold text-zinc-700">{children}</label>;
}
