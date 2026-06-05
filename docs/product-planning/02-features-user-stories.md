# Features and User Stories

## MVP Features

### Authentication

- Register as user or worker.
- Login and logout.
- Store role in database.
- Protect pages by role.

### User

- View available services.
- Create order with service, address, location, and notes.
- View active order status.
- View order history.
- Rate worker after completion.

### Worker

- Toggle online/offline.
- View incoming jobs.
- Accept job in one click.
- Update status: accepted, on_the_way, working, completed.
- View job history.

### Admin

- View dashboard statistics.
- View users.
- View workers.
- Activate or suspend workers.
- View orders.
- Manage services.

### Realtime

- New order updates.
- Order status updates.
- Worker availability changes.
- Admin monitoring updates.

## Future Features

- Map picker and reverse geocoding.
- Push notifications.
- SMS/WhatsApp fallback.
- Worker verification workflow.
- Photo proof after completion.
- Scheduled orders.
- Dynamic pricing suggestions.
- Admin analytics dashboard.
- Dispute handling.
- In-app cancellation reasons.
- Service area configuration.

## Out of Scope

- Payment gateway.
- Wallet.
- Voucher/promo/referral.
- Chat.
- KTP upload.
- Subscription.
- AI recommendation.
- Multi-worker order.
- Price negotiation.

## User Stories

### User Stories

- As a user, I want to register quickly so I can request household help.
- As a user, I want to see available services so I can choose the right task.
- As a user, I want to submit location and notes so the worker understands the job.
- As a user, I want realtime order status so I know when the worker is coming.
- As a user, I want to rate a worker so I can give quality feedback.

### Worker Stories

- As a worker, I want to go online so I can receive jobs.
- As a worker, I want incoming jobs to be clear so I can decide quickly.
- As a worker, I want to accept a job in one click so I do not lose time.
- As a worker, I want to update status so the customer knows my progress.
- As a worker, I want history so I can review completed jobs.

### Admin Stories

- As an admin, I want to monitor orders so I can detect operational issues.
- As an admin, I want to suspend workers so I can protect service quality.
- As an admin, I want to manage services so the catalog stays relevant.
- As an admin, I want dashboard stats so I can understand platform activity.

## Acceptance Criteria

- A user cannot access worker/admin pages.
- A worker cannot access admin pages.
- A waiting order can be accepted by an eligible worker.
- A completed order can receive one rating.
- Suspended workers cannot receive dispatch candidates.
- Admin can see all orders.
