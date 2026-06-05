create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'worker', 'admin');
create type public.account_status as enum ('active', 'suspended');
create type public.worker_status as enum ('active', 'inactive', 'suspended');
create type public.order_status as enum ('waiting', 'accepted', 'on_the_way', 'working', 'completed', 'cancelled');
create type public.dispatch_status as enum ('pending', 'accepted', 'rejected', 'expired');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name varchar not null,
  email varchar not null unique,
  phone varchar not null,
  role public.user_role not null default 'user',
  status public.account_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  is_online boolean not null default false,
  latitude decimal,
  longitude decimal,
  rating decimal not null default 0,
  status public.worker_status not null default 'inactive',
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name varchar not null,
  description text,
  is_active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  worker_id uuid references public.worker_profiles(id) on delete set null,
  service_id uuid not null references public.services(id),
  address text not null,
  latitude decimal not null,
  longitude decimal not null,
  notes text,
  status public.order_status not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_dispatches (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  distance_km decimal not null,
  status public.dispatch_status not null default 'pending',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(order_id, worker_id)
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now()
);

create index idx_users_role on public.users(role);
create index idx_users_status on public.users(status);
create index idx_worker_profiles_online_status on public.worker_profiles(is_online, status);
create index idx_worker_profiles_location on public.worker_profiles(latitude, longitude);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_worker on public.orders(worker_id);
create index idx_orders_status_updated on public.orders(status, updated_at desc);
create index idx_order_dispatches_worker_status on public.order_dispatches(worker_id, status, expires_at);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.validate_order_status_transition()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'waiting' then
      raise exception 'New orders must start with waiting status';
    end if;
    return new;
  end if;

  if old.status = new.status then
    return new;
  end if;

  if new.status = 'cancelled' then
    return new;
  end if;

  if old.status = 'waiting' and new.status = 'accepted' and new.worker_id is not null then
    return new;
  end if;

  if old.status = 'accepted' and new.status = 'on_the_way' then
    return new;
  end if;

  if old.status = 'on_the_way' and new.status = 'working' then
    return new;
  end if;

  if old.status = 'working' and new.status = 'completed' then
    return new;
  end if;

  raise exception 'Invalid order status transition from % to %', old.status, new.status;
end;
$$;

create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

create trigger orders_validate_status_transition
before insert or update on public.orders
for each row execute function public.validate_order_status_transition();

alter table public.users enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_dispatches enable row level security;
alter table public.ratings enable row level security;

create or replace function public.current_role()
returns public.user_role language sql stable security definer as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'user');

  if requested_role = 'admin' then
    requested_role := 'user';
  end if;

  insert into public.users (id, full_name, email, phone, role, status)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'phone', ''), '-'),
    requested_role,
    'active'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    role = excluded.role;

  if requested_role = 'worker' then
    insert into public.worker_profiles (user_id, status)
    values (new.id, 'inactive')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create policy "users read own or admin" on public.users
for select using (id = auth.uid() or public.current_role() = 'admin');

create policy "users insert own" on public.users
for insert with check (id = auth.uid());

create policy "users update own or admin" on public.users
for update using (id = auth.uid() or public.current_role() = 'admin');

create policy "services readable by authenticated" on public.services
for select to authenticated using (true);

create policy "services admin writes" on public.services
for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "worker profiles read authenticated" on public.worker_profiles
for select to authenticated using (true);

create policy "worker profile own update or admin" on public.worker_profiles
for update using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "worker profile own insert" on public.worker_profiles
for insert with check (user_id = auth.uid());

create policy "orders read participant or admin" on public.orders
for select using (
  user_id = auth.uid()
  or public.current_role() = 'admin'
  or exists (select 1 from public.worker_profiles wp where wp.id = orders.worker_id and wp.user_id = auth.uid())
  or exists (
    select 1
    from public.order_dispatches od
    join public.worker_profiles wp on wp.id = od.worker_id
    where od.order_id = orders.id
      and od.status = 'pending'
      and wp.user_id = auth.uid()
  )
);

create policy "orders user create" on public.orders
for insert with check (user_id = auth.uid());

create policy "orders update participant or admin" on public.orders
for update using (
  public.current_role() = 'admin'
  or user_id = auth.uid()
  or exists (select 1 from public.worker_profiles wp where wp.id = orders.worker_id and wp.user_id = auth.uid())
);

create policy "dispatch read own worker or admin" on public.order_dispatches
for select using (
  public.current_role() = 'admin'
  or exists (select 1 from public.worker_profiles wp where wp.id = order_dispatches.worker_id and wp.user_id = auth.uid())
);

create policy "dispatch order owner insert" on public.order_dispatches
for insert with check (
  exists (select 1 from public.orders o where o.id = order_dispatches.order_id and o.user_id = auth.uid())
);

create policy "dispatch own worker update" on public.order_dispatches
for update using (
  public.current_role() = 'admin'
  or exists (select 1 from public.worker_profiles wp where wp.id = order_dispatches.worker_id and wp.user_id = auth.uid())
);

create policy "dispatch accepted order worker update" on public.order_dispatches
for update using (
  public.current_role() = 'admin'
  or exists (
    select 1
    from public.orders o
    join public.worker_profiles wp on wp.id = o.worker_id
    where o.id = order_dispatches.order_id
      and wp.user_id = auth.uid()
  )
);

create policy "dispatch admin insert" on public.order_dispatches
for insert with check (public.current_role() = 'admin');

create policy "ratings participant read" on public.ratings
for select using (
  user_id = auth.uid()
  or public.current_role() = 'admin'
  or exists (select 1 from public.worker_profiles wp where wp.id = ratings.worker_id and wp.user_id = auth.uid())
);

create policy "ratings user create" on public.ratings
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.orders o
    where o.id = ratings.order_id
      and o.user_id = auth.uid()
      and o.worker_id = ratings.worker_id
      and o.status = 'completed'
  )
);

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.worker_profiles;
alter publication supabase_realtime add table public.order_dispatches;
