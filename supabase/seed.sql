insert into public.services (name, description, is_active) values
('Perbaikan Genteng', 'Tambal bocor ringan dan rapikan genteng bergeser.', true),
('Cat Tembok', 'Pengecatan area kecil sampai satu ruangan.', true),
('Siram Tanaman', 'Perawatan dan penyiraman taman rumah.', true),
('Bersih Halaman', 'Sapu, cabut rumput ringan, dan angkut sampah halaman.', true),
('Mengepel Rumah', 'Bersihkan lantai rumah atau kos.', true),
('Setrika Pakaian', 'Bantuan setrika harian di rumah.', true),
('Jemput Anak Sekolah', 'Penjemputan anak dengan instruksi jelas dari orang tua.', true),
('Bantu Angkut Barang Ringan', 'Pindah barang ringan antar ruang atau rumah.', true),
('Lainnya', 'Pekerjaan rumah tangga ringan lainnya.', true);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@yantosiap.test',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Yanto","phone":"081111111111","role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'user@yantosiap.test',
  crypt('user123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"User Demo","phone":"082222222222","role":"user"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'worker@yantosiap.test',
  crypt('worker123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Worker Demo","phone":"083333333333","role":"worker"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'worker2@yantosiap.test',
  crypt('worker123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Worker Dua","phone":"084444444444","role":"worker"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'admin@yantosiap.test',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@yantosiap.test"}',
  'email',
  now(),
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'user@yantosiap.test',
  '{"sub":"00000000-0000-0000-0000-000000000002","email":"user@yantosiap.test"}',
  'email',
  now(),
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000003',
  'worker@yantosiap.test',
  '{"sub":"00000000-0000-0000-0000-000000000003","email":"worker@yantosiap.test"}',
  'email',
  now(),
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000004',
  'worker2@yantosiap.test',
  '{"sub":"00000000-0000-0000-0000-000000000004","email":"worker2@yantosiap.test"}',
  'email',
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.users (id, full_name, email, phone, role, status) values
(
  '00000000-0000-0000-0000-000000000001',
  'Admin Yanto',
  'admin@yantosiap.test',
  '081111111111',
  'admin',
  'active'
),
(
  '00000000-0000-0000-0000-000000000002',
  'User Demo',
  'user@yantosiap.test',
  '082222222222',
  'user',
  'active'
),
(
  '00000000-0000-0000-0000-000000000003',
  'Worker Demo',
  'worker@yantosiap.test',
  '083333333333',
  'worker',
  'active'
),
(
  '00000000-0000-0000-0000-000000000004',
  'Worker Dua',
  'worker2@yantosiap.test',
  '084444444444',
  'worker',
  'active'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  role = excluded.role,
  status = excluded.status;

insert into public.worker_profiles (
  user_id,
  is_online,
  latitude,
  longitude,
  rating,
  status
) values (
  '00000000-0000-0000-0000-000000000003',
  true,
  -6.200000,
  106.816666,
  4.8,
  'active'
)
on conflict (user_id) do update set
  is_online = excluded.is_online,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  rating = excluded.rating,
  status = excluded.status;

insert into public.worker_profiles (
  user_id,
  is_online,
  latitude,
  longitude,
  rating,
  status
) values (
  '00000000-0000-0000-0000-000000000004',
  true,
  -6.190000,
  106.820000,
  4.6,
  'active'
)
on conflict (user_id) do update set
  is_online = excluded.is_online,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  rating = excluded.rating,
  status = excluded.status;
