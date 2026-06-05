import { OrderStatus } from "@/lib/types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  waiting: "Menunggu Worker",
  accepted: "Diterima",
  on_the_way: "Menuju Lokasi",
  working: "Sedang Bekerja",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const orderStatusSteps: OrderStatus[] = [
  "waiting",
  "accepted",
  "on_the_way",
  "working",
  "completed",
];
