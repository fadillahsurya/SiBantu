import { Order, Service, WorkerProfile, AppUser } from "@/lib/types";

export const services: Service[] = [
  { id: "svc_roof", name: "Perbaikan Genteng", description: "Tambal bocor ringan dan rapikan genteng bergeser.", is_active: true },
  { id: "svc_paint", name: "Cat Tembok", description: "Pengecatan area kecil sampai satu ruangan.", is_active: true },
  { id: "svc_plants", name: "Siram Tanaman", description: "Perawatan dan penyiraman taman rumah.", is_active: true },
  { id: "svc_yard", name: "Bersih Halaman", description: "Sapu, cabut rumput ringan, dan angkut sampah halaman.", is_active: true },
  { id: "svc_mop", name: "Mengepel Rumah", description: "Bersihkan lantai rumah atau kos.", is_active: true },
  { id: "svc_iron", name: "Setrika Pakaian", description: "Bantuan setrika harian di rumah.", is_active: true },
  { id: "svc_school", name: "Jemput Anak Sekolah", description: "Penjemputan anak dengan instruksi jelas dari orang tua.", is_active: true },
  { id: "svc_lift", name: "Bantu Angkut Barang Ringan", description: "Pindah barang ringan antar ruang atau rumah.", is_active: true },
  { id: "svc_other", name: "Lainnya", description: "Pekerjaan rumah tangga ringan lainnya.", is_active: true },
];

export const users: AppUser[] = [
  { id: "usr_1", full_name: "Rani Pratama", email: "rani@yantosiap.test", phone: "081234567001", role: "user", status: "active", created_at: "2026-06-04T02:00:00.000Z" },
  { id: "usr_2", full_name: "Budi Santoso", email: "budi@yantosiap.test", phone: "081234567002", role: "worker", status: "active", created_at: "2026-06-04T02:10:00.000Z" },
  { id: "usr_3", full_name: "Siti Aminah", email: "siti@yantosiap.test", phone: "081234567003", role: "worker", status: "active", created_at: "2026-06-04T02:20:00.000Z" },
  { id: "usr_4", full_name: "Admin Yanto", email: "admin@yantosiap.test", phone: "081234567004", role: "admin", status: "active", created_at: "2026-06-04T02:30:00.000Z" },
];

export const workers: WorkerProfile[] = [
  { id: "wrk_1", user_id: "usr_2", full_name: "Budi Santoso", phone: "081234567002", is_online: true, latitude: -6.176, longitude: 106.827, rating: 4.8, status: "active", active_jobs: 1, created_at: "2026-06-04T02:10:00.000Z" },
  { id: "wrk_2", user_id: "usr_3", full_name: "Siti Aminah", phone: "081234567003", is_online: true, latitude: -6.19, longitude: 106.816, rating: 4.7, status: "active", active_jobs: 0, created_at: "2026-06-04T02:20:00.000Z" },
  { id: "wrk_3", user_id: "usr_5", full_name: "Dimas Putra", phone: "081234567005", is_online: false, latitude: -6.205, longitude: 106.84, rating: 4.5, status: "inactive", active_jobs: 0, created_at: "2026-06-04T02:40:00.000Z" },
];

export const orders: Order[] = [
  { id: "ord_1", user_id: "usr_1", worker_id: "wrk_1", service_id: "svc_roof", service_name: "Perbaikan Genteng", customer_name: "Rani Pratama", worker_name: "Budi Santoso", address: "Jl. Melati No. 21, Jakarta Pusat", latitude: -6.18, longitude: 106.83, notes: "Genteng bocor di dapur setelah hujan.", status: "on_the_way", created_at: "2026-06-04T06:12:00.000Z", updated_at: "2026-06-04T06:25:00.000Z" },
  { id: "ord_2", user_id: "usr_1", worker_id: null, service_id: "svc_yard", service_name: "Bersih Halaman", customer_name: "Rani Pratama", worker_name: null, address: "Jl. Kenanga No. 4, Jakarta Pusat", latitude: -6.182, longitude: 106.823, notes: "Halaman depan perlu disapu dan rumput dirapikan.", status: "waiting", created_at: "2026-06-04T07:05:00.000Z", updated_at: "2026-06-04T07:05:00.000Z" },
  { id: "ord_3", user_id: "usr_6", worker_id: "wrk_2", service_id: "svc_iron", service_name: "Setrika Pakaian", customer_name: "Maya Lestari", worker_name: "Siti Aminah", address: "Jl. Cempaka No. 9, Jakarta", latitude: -6.193, longitude: 106.818, notes: "Sekitar satu keranjang pakaian.", status: "completed", created_at: "2026-06-03T09:20:00.000Z", updated_at: "2026-06-03T11:00:00.000Z" },
];
