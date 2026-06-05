# Yanto Siap Deployment

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Run `supabase/seed.sql`.
4. Enable email auth in Supabase Auth.
5. Confirm Realtime is active for `orders`, `worker_profiles`, and `order_dispatches`.

## Vercel

1. Import this repository into Vercel.
2. Set environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to the production URL.
4. Deploy.

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
