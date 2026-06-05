# UX Research Notes and Interaction Strategy

## Primary UX Hypothesis

People will use Yanto Siap when they can understand the service quickly, create an order without friction, and trust that someone nearby will respond.

## Non-Technical User Needs

- Clear language.
- Few choices per screen.
- Strong reassurance after submitting an order.
- Visible status updates.
- No hidden critical actions.
- No unnecessary configuration.

## Conversion Strategy

- Public page explains the core offer immediately.
- Register form is short.
- Dashboard puts "Buat Order" near the top.
- Create order form is a single page with minimal fields.
- Worker job detail uses a single primary accept action.

## Interaction Feedback

Every user action should produce feedback:

- Button loading state while submitting.
- Success message after create/update.
- Error message if validation fails.
- Empty state when no jobs/orders exist.
- Realtime status badge updates.
- Confirmation before destructive admin actions.

## Loading States

- Dashboard cards use skeletons.
- Order list uses skeleton rows/cards.
- Detail page uses stable layout placeholders.
- Buttons should show disabled/loading state during mutation.

## Empty States

- User has no orders: show "Belum ada order" with "Buat Order" button.
- Worker has no jobs: show "Belum ada job masuk" and remind to stay online.
- Admin no services: show "Tambahkan layanan pertama".

## Error States

- Auth error: show concise message and keep form values where safe.
- Order creation error: explain field or network issue.
- Worker accept race: show "Job sudah diambil worker lain".
- Realtime disconnected: show subtle reconnecting indicator.

## Success States

- Order created: redirect to detail with waiting status.
- Worker accepted: show accepted status and next action.
- Completed: show rating prompt to user.
- Admin action saved: show status change.

## Mobile Ergonomics

- Primary buttons full-width on mobile.
- Minimum 40px hit targets.
- Avoid long multi-column forms.
- Keep nav horizontally scrollable if sidebar is unavailable.
- Important status visible without scrolling deeply.

## Accessibility Checklist

- Keyboard navigable forms.
- Visible focus states.
- Semantic headings.
- Labels bound to inputs.
- Status conveyed through text.
- Color contrast WCAG AA.
- No motion required to understand state.

## Copywriting Tone

- Direct.
- Friendly.
- Local and familiar.
- Avoid technical terms.

Examples:

- "Buat Order & Cari Worker"
- "Worker sedang menuju lokasi"
- "Belum ada job masuk"
- "Aktifkan akun worker"
