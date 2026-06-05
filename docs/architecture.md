# Yanto Siap Architecture

## Phases

1. Architecture: App Router route groups, reusable UI components, domain types, Supabase clients, server actions, and API routes.
2. Database: PostgreSQL schema, indexes, RLS policies, realtime publication, and seed services.
3. Authentication: Supabase Auth with role stored in `users` and mirrored into auth metadata for route guards.
4. Dashboard: Role-specific dashboards for user, worker, and admin.
5. Orders: User creates order, worker accepts, worker updates status, user rates completed order.
6. Realtime: Client subscriptions listen to order changes and refresh views.
7. Admin: Worker activation/suspension, user monitoring, order monitoring, service management.
8. Deployment: Vercel-ready env vars and Supabase SQL guide.

## Structure

`app/` contains routes and API handlers.
`components/` contains reusable UI primitives and domain cards.
`lib/actions/` contains server actions.
`lib/supabase/` contains Supabase clients.
`supabase/` contains production SQL.
