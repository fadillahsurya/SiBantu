export type UserRole = "user" | "worker" | "admin";
export type AccountStatus = "active" | "suspended";
export type WorkerStatus = "active" | "inactive" | "suspended";
export type OrderStatus =
  | "waiting"
  | "accepted"
  | "on_the_way"
  | "working"
  | "completed"
  | "cancelled";

export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
};

export type WorkerProfile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  is_online: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  status: WorkerStatus;
  active_jobs: number;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type Order = {
  id: string;
  user_id: string;
  worker_id: string | null;
  service_id: string;
  service_name: string;
  customer_name: string;
  worker_name: string | null;
  address: string;
  latitude: number;
  longitude: number;
  notes: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type Rating = {
  id: string;
  order_id: string;
  user_id: string;
  worker_id: string;
  rating: number;
  review: string;
  created_at: string;
};
