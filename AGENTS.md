PRD (Product Requirements Document)
Yanto Siap

Versi: MVP 1.0
Platform: Web Responsive (Next.js)
Backend: Supabase
Deployment: Vercel
Target: Portofolio + Validasi Ide Produk

1. Gambaran Produk
Deskripsi

Yanto Siap adalah platform layanan bantuan pekerjaan rumah tangga ringan yang menghubungkan pengguna dengan worker terdekat secara cepat.

Pengguna dapat memesan bantuan untuk pekerjaan seperti:

Memperbaiki genteng
Menyiram tanaman
Mengecat tembok
Membersihkan halaman
Mengepel rumah
Membantu setrika
Menjemput anak sekolah
Pekerjaan rumahan ringan lainnya

Worker dapat menerima pekerjaan berdasarkan lokasi terdekat dan memperbarui status pekerjaan secara realtime.

2. Tujuan Produk
Masalah

Banyak orang membutuhkan bantuan pekerjaan rumah dalam waktu singkat tetapi tidak memiliki kontak pekerja yang dapat dihubungi dengan cepat.

Di sisi lain terdapat banyak orang yang membutuhkan pekerjaan sampingan harian.

Solusi

Menyediakan platform yang:

Mempertemukan user dan worker terdekat
Memudahkan pemesanan bantuan rumah tangga
Memberikan pekerjaan sampingan kepada worker
Menggunakan proses yang sederhana tanpa chat dan tanpa pembayaran online
3. Scope MVP
Yang Masuk Scope
Authentication
Login
Register
Logout

Role:

User
Worker
Admin
User
Melihat layanan
Membuat permintaan pekerjaan
Memilih lokasi pekerjaan
Menambahkan catatan pekerjaan
Mencari worker terdekat
Melihat status pekerjaan realtime
Melihat riwayat pekerjaan
Memberikan rating worker
Worker
Login
Mengubah status Online / Offline
Menerima pekerjaan
Melihat detail pekerjaan
Mengubah status pekerjaan
Melihat riwayat pekerjaan
Admin
Melihat seluruh worker
Mengaktifkan/nonaktifkan worker
Melihat seluruh order
Monitoring aktivitas worker
Monitoring aktivitas user
Realtime

Status order berubah secara realtime:

Menunggu Worker
Diterima
Menuju Lokasi
Sedang Bekerja
Selesai
Dibatalkan
Geolocation
User mengirim lokasi
Sistem mencari worker terdekat
Worker menerima notifikasi prioritas
Pembayaran

Hanya:

Tunai

Pembayaran dilakukan langsung setelah pekerjaan selesai.

4. Out of Scope (Tidak Dibuat pada MVP)

❌ Upload KTP

❌ Chat

❌ Payment Gateway

❌ Dompet Digital

❌ Promo

❌ Voucher

❌ Subscription

❌ Referral

❌ AI Recommendation

❌ Multi Worker dalam satu order

❌ Negosiasi harga

5. User Roles
User
Tujuan

Mendapatkan bantuan pekerjaan rumah dengan cepat.

Hak Akses
Membuat order
Melihat order
Rating worker
Worker
Tujuan

Menerima pekerjaan dari user.

Hak Akses
Online/Offline
Terima order
Update status pekerjaan
Admin
Tujuan

Mengontrol ekosistem platform.

Hak Akses
Suspend worker
Monitoring order
Monitoring user
6. User Flow
User
Login
↓
Pilih Layanan
↓
Isi Lokasi
↓
Isi Catatan
↓
Cari Worker Terdekat
↓
Buat Order
↓
Menunggu Konfirmasi
↓
Worker Menerima
↓
Worker Menuju Lokasi
↓
Sedang Bekerja
↓
Selesai
↓
Rating
Worker
Login
↓
Online
↓
Menerima Notifikasi
↓
Terima Order
↓
Menuju Lokasi
↓
Sedang Bekerja
↓
Selesai
7. Daftar Layanan Awal

Admin dapat mengelola layanan berikut:

Perbaikan Genteng
Cat Tembok
Siram Tanaman
Bersih Halaman
Mengepel Rumah
Setrika Pakaian
Jemput Anak Sekolah
Bantu Angkut Barang Ringan
Lainnya
8. Fitur Prioritas
P0 (Wajib)
Auth
Login
Register
Order
Buat Order
Terima Order
Update Status
Worker
Online
Offline
Admin
Suspend Worker
Realtime
Status Order
Geolocation
Cari Worker Terdekat
P1 (Opsional Setelah MVP)
Rating
Rating 1-5
Review singkat
Dashboard Statistik
Total Order
Total Worker
Total User
9. Database Design
users
id uuid
name varchar
email varchar
phone varchar
role varchar
created_at timestamp
worker_profiles
id uuid
user_id uuid
is_online boolean
status varchar
latitude decimal
longitude decimal
rating decimal
created_at timestamp

status:

active
inactive
suspended
services
id uuid
name varchar
description text
is_active boolean
orders
id uuid
user_id uuid
worker_id uuid
service_id uuid

address text

latitude decimal
longitude decimal

notes text

status varchar

created_at timestamp
updated_at timestamp

status:

waiting
accepted
on_the_way
working
completed
cancelled
ratings
id uuid
order_id uuid

worker_id uuid
user_id uuid

rating integer
review text

created_at timestamp
10. Realtime Requirement

Menggunakan:

Supabase Realtime

Realtime digunakan untuk:

User

Melihat perubahan status:

Waiting
↓
Accepted
↓
On The Way
↓
Working
↓
Completed
Worker

Menerima order baru secara realtime.

Admin

Monitoring order secara realtime.

11. Worker Prioritization Logic

Saat user membuat order:

Cari worker Online
Hitung jarak worker ke lokasi user
Urutkan berdasarkan jarak terdekat
Kirim notifikasi ke worker terdekat terlebih dahulu
Jika tidak diterima dalam 60 detik:
Worker A
↓
Worker B
↓
Worker C

Order diteruskan ke worker berikutnya.

12. Halaman Aplikasi
Public
Login
Register
User
Dashboard
Buat Order
Detail Order
Riwayat Order
Profile
Worker
Dashboard
Daftar Order Masuk
Detail Order
Riwayat Order
Profile
Admin
Dashboard
Data Worker
Data User
Data Order
13. Tech Stack
Frontend
Next.js 15
TypeScript
Tailwind CSS
Shadcn UI
Backend
Supabase Auth
Supabase Database (PostgreSQL)
Supabase Realtime
Supabase Storage (opsional)
Deployment

Frontend:

Vercel

Backend:

Supabase
14. Success Metrics MVP

Dalam konteks portofolio, MVP dianggap berhasil jika:

User dapat membuat order
Worker menerima order
Status berubah realtime
Worker terdekat dapat ditemukan
Admin dapat mengelola worker
Seluruh sistem berjalan online melalui Vercel + Supabase
Ringkasan MVP

Yanto Siap adalah platform pencarian worker rumahan terdekat untuk membantu pekerjaan rumah tangga ringan dengan proses sederhana:

User buat order → Worker terdekat menerima → Status realtime → Bayar tunai → Selesai.