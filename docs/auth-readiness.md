# Yanto Siap Auth Readiness

## Root Cause Fix

Registration should not depend on a client-side insert into `public.users`.
Supabase may require email confirmation, so the new user may not have an authenticated session immediately after `auth.signUp`.

The production-safe flow is:

1. User registers through Supabase Auth.
2. `auth.users` trigger creates `public.users`.
3. If role is `worker`, trigger creates `public.worker_profiles`.
4. Public registration never accepts `admin`.

## Hosted Supabase SQL Patch

Run this in SQL Editor if the database is already live:

```sql
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

drop trigger if exists auth_users_create_profile on auth.users;
create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();
```

## RLS Hardening Patch

Run this if your hosted database still has the older broad worker order policy:

```sql
drop policy if exists "orders read participant or admin" on public.orders;
create policy "orders read participant or admin" on public.orders
for select using (
  user_id = auth.uid()
  or public.current_role() = 'admin'
  or exists (
    select 1
    from public.worker_profiles wp
    where wp.id = orders.worker_id
      and wp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.order_dispatches od
    join public.worker_profiles wp on wp.id = od.worker_id
    where od.order_id = orders.id
      and od.status = 'pending'
      and wp.user_id = auth.uid()
  )
);

drop policy if exists "ratings user create" on public.ratings;
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
```

## Admin Creation

Admin must not be self-registered publicly.

Create admin from seed:

- `admin@yantosiap.test`
- `admin123`

Manual promotion script:

```sql
update public.users
set role = 'admin', status = 'active'
where email = 'admin@example.com';
```

Manual demotion script:

```sql
update public.users
set role = 'user'
where email = 'admin@example.com';
```

## QA Checklist

- Register user through `/register/user`.
- Register worker through `/register/worker`.
- Confirm `public.users` record exists.
- Confirm worker also has `public.worker_profiles`.
- Login user redirects to `/dashboard`.
- Login worker redirects to `/worker/dashboard`.
- Login admin redirects to `/admin`.
- User cannot open `/worker/dashboard`.
- Worker cannot open `/dashboard`.
- User/worker cannot open `/admin`.
- Suspended account is signed out and redirected to `/login`.
- Logout clears session and protected pages redirect to `/login`.
- Duplicate email shows a friendly error.
- Weak password shows a friendly error.
- Expired session redirects cleanly without loops.
