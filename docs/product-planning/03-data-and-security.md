# Data Model, ERD, Supabase Schema, and RLS

## ERD

```mermaid
erDiagram
  USERS ||--o| WORKER_PROFILES : "has profile"
  USERS ||--o{ ORDERS : "creates"
  WORKER_PROFILES ||--o{ ORDERS : "accepts"
  SERVICES ||--o{ ORDERS : "selected for"
  ORDERS ||--o{ ORDER_DISPATCHES : "dispatch attempts"
  WORKER_PROFILES ||--o{ ORDER_DISPATCHES : "receives"
  ORDERS ||--o| RATINGS : "rated after completion"
  USERS ||--o{ RATINGS : "writes"
  WORKER_PROFILES ||--o{ RATINGS : "receives"

  USERS {
    uuid id PK
    varchar full_name
    varchar email
    varchar phone
    user_role role
    timestamptz created_at
  }

  WORKER_PROFILES {
    uuid id PK
    uuid user_id FK
    boolean is_online
    decimal latitude
    decimal longitude
    decimal rating
    worker_status status
    timestamptz created_at
  }

  SERVICES {
    uuid id PK
    varchar name
    text description
    boolean is_active
  }

  ORDERS {
    uuid id PK
    uuid user_id FK
    uuid worker_id FK
    uuid service_id FK
    text address
    decimal latitude
    decimal longitude
    text notes
    order_status status
    timestamptz created_at
    timestamptz updated_at
  }

  ORDER_DISPATCHES {
    uuid id PK
    uuid order_id FK
    uuid worker_id FK
    decimal distance_km
    dispatch_status status
    timestamptz expires_at
    timestamptz created_at
  }

  RATINGS {
    uuid id PK
    uuid order_id FK
    uuid user_id FK
    uuid worker_id FK
    integer rating
    text review
    timestamptz created_at
  }
```

## Database Relationship Diagram

```mermaid
flowchart LR
  Auth[Supabase Auth User] --> Users[public.users]
  Users -->|role worker| WorkerProfiles[worker_profiles]
  Users -->|creates| Orders[orders]
  Services -->|chosen service| Orders
  WorkerProfiles -->|assigned worker| Orders
  Orders --> Dispatches[order_dispatches]
  WorkerProfiles --> Dispatches
  Orders --> Ratings[ratings]
  Users --> Ratings
  WorkerProfiles --> Ratings
```

## Supabase Schema Design

See `supabase/schema.sql` for executable SQL. The schema uses:

- PostgreSQL enum types for roles and statuses.
- UUID primary keys.
- Foreign keys with cascade or set-null behavior.
- Indexes for role lookup, worker availability, order status, and dispatch queues.
- Realtime publication for `orders`, `worker_profiles`, and `order_dispatches`.

## Key Tables

- `users`: application profile and role.
- `worker_profiles`: worker availability, operational status, rating, location.
- `services`: service catalog.
- `orders`: core order lifecycle.
- `order_dispatches`: one record per worker notification attempt.
- `ratings`: post-completion feedback.

## RLS Strategy

### Users

- Users can read and update their own profile.
- Admin can read and update all users.
- Users can insert only their own profile after auth signup.

### Worker Profiles

- Authenticated users can read active worker metadata needed for dispatch and dashboards.
- Workers can update their own online status/location.
- Admin can activate, deactivate, or suspend any worker.

### Services

- Authenticated users can read active services.
- Admin can create, update, or deactivate services.

### Orders

- Users can create orders for themselves.
- Users can read their own orders.
- Workers can read waiting orders and their assigned orders.
- Admin can read all orders.
- Workers assigned to an order can update operational status.

### Dispatches

- Workers can read dispatches addressed to their worker profile.
- Admin/service role creates dispatch rows.
- Dispatch status changes should be constrained to eligible workers/admin.

### Ratings

- Users can rate their completed orders.
- Participants and admin can read ratings.
- One rating per order.

## Security Recommendations

- Use service role only in server-only code or Supabase Edge Functions.
- Never expose service role key to the browser.
- Keep worker location precision limited in user-facing UI until accepted.
- Validate every status transition in server actions or database functions.
- Add audit logs for admin actions in a future release.
