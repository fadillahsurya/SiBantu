# Yanto Siap Demo Readiness

## Demo Accounts

- Admin: `admin@yantosiap.test` / `admin123`
- User: `user@yantosiap.test` / `user123`
- Worker 1: `worker@yantosiap.test` / `worker123`
- Worker 2: `worker2@yantosiap.test` / `worker123`

## Demo Script

1. Open admin in one browser tab at `/admin`.
2. Open worker in another tab at `/worker/dashboard` and make sure the worker is online.
3. Open user in another tab at `/orders/new`.
4. User creates an order with Jakarta coordinates.
5. Worker sees `New Order Received` without refreshing.
6. Worker opens the job and clicks `Accept Job`.
7. User detail and admin live feed show `Diterima` without refreshing.
8. Worker clicks `Start Navigation`, `Start Working`, then `Complete Job`.
9. User detail and admin live feed update each status without refresh.
10. User submits rating after the order is completed.

## QA Scenarios

- User can create an order and see it in `/orders`.
- Online active worker receives dispatched waiting order.
- Offline worker does not receive new waiting orders.
- Suspended worker cannot go online or accept jobs.
- Two workers cannot accept the same waiting order.
- Worker cannot jump from `waiting` directly to `completed`.
- Valid transitions work: `waiting -> accepted -> on_the_way -> working -> completed`.
- Any active order can be changed to `cancelled` by the assigned worker.
- User order detail updates through Supabase Realtime.
- Worker job detail updates through Supabase Realtime.
- Admin dashboard counters update through Supabase Realtime.
- Admin live feed handles insert, update, and delete events.
- Rating form is disabled before completion and enabled after completion.

## Supabase SQL Patch For Hosted Demo

Run this after the existing schema if the hosted database is already live:

```sql
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

drop trigger if exists orders_validate_status_transition on public.orders;
create trigger orders_validate_status_transition
before insert or update on public.orders
for each row execute function public.validate_order_status_transition();

do $$ begin
  create policy "dispatch order owner insert" on public.order_dispatches
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_dispatches.order_id
        and o.user_id = auth.uid()
    )
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "dispatch own worker update" on public.order_dispatches
  for update using (
    public.current_role() = 'admin'
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = order_dispatches.worker_id
        and wp.user_id = auth.uid()
    )
  );
exception when duplicate_object then null;
end $$;

do $$ begin
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
exception when duplicate_object then null;
end $$;
```
