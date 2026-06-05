# Development Roadmap, Deployment Roadmap, and Scalability

## Development Roadmap

### Phase 1: Planning

- Complete PRD.
- Define user stories.
- Define ERD and RLS.
- Define UX flows and wireframes.
- Define API and architecture.

### Phase 2: Foundation

- Set up Next.js 15 App Router.
- Configure TypeScript and Tailwind.
- Add Supabase clients.
- Add shared UI components.
- Add app shell and navigation.

### Phase 3: Authentication

- Register/login/logout.
- Role storage.
- Route protection.
- Profile creation.

### Phase 4: User Ordering

- Service list.
- Create order flow.
- Order detail.
- Realtime status.
- History and rating.

### Phase 5: Worker Operations

- Online/offline toggle.
- Incoming job list.
- Accept/reject job.
- Status updates.
- Worker history.

### Phase 6: Matching and Realtime

- Haversine distance calculation.
- Dispatch candidate creation.
- Realtime subscriptions.
- Timeout strategy.

### Phase 7: Admin

- Dashboard statistics.
- User list.
- Worker list.
- Suspend/activate worker.
- Order monitoring.
- Service management.

### Phase 8: QA and Launch

- Test role access.
- Test order lifecycle.
- Test RLS manually in Supabase.
- Test responsive layouts.
- Deploy to Vercel.

## Deployment Roadmap

### Supabase

- Create production project.
- Run schema SQL.
- Run seed SQL.
- Configure auth settings.
- Enable realtime.
- Add RLS test users.

### Vercel

- Import repository.
- Set environment variables.
- Run production build.
- Deploy preview.
- Validate auth callback and cookies.
- Promote to production.

### Post-Launch

- Monitor errors.
- Review Supabase logs.
- Validate realtime reliability.
- Collect user feedback.
- Prioritize map/push notification improvements.

## Scalability Recommendations

### Database

- Add PostGIS for production-grade location queries.
- Replace Haversine API filtering with indexed geospatial queries.
- Add audit log tables for admin actions.
- Add status transition database function.
- Add dispatch queue table with scheduled expiration.

### Backend

- Move dispatch timeout logic to Supabase Edge Function or background worker.
- Use service role only in backend runtime.
- Add idempotency keys for order creation.
- Add structured error logging.

### Frontend

- Add optimistic UI for status updates.
- Add offline-aware states.
- Add map picker with current location.
- Add accessible toast feedback.

### Notifications

- Add durable notification records.
- Add web push.
- Add WhatsApp/SMS fallback for workers.
- Add notification retry and dead-letter queue.

### Operations

- Add uptime monitoring.
- Add analytics for funnel conversion.
- Track order acceptance time.
- Track worker no-response rate.
- Track cancellation reasons.

### Security

- Add admin audit logs.
- Add stricter worker location exposure rules.
- Add rate limiting to APIs.
- Add server-side validation with schema parser.
