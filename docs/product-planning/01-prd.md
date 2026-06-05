# Product Requirements Document: Yanto Siap

## 1. Product Summary

Yanto Siap is a responsive web application that connects customers with nearby workers for light household assistance. The MVP focuses on quick ordering, nearby worker matching, realtime order status, cash payment, and basic admin monitoring.

## 2. Problem

Customers often need short-notice help for household tasks but do not have a reliable nearby worker contact. At the same time, many workers need simple daily side jobs but lack a structured channel for receiving requests.

## 3. Solution

Yanto Siap provides a simple dispatch platform:

User creates order -> system prioritizes nearby online workers -> worker accepts -> realtime status updates -> job completed -> cash payment -> user rating.

## 4. Goals

- Let users create a household service order in 3-4 steps.
- Let workers accept incoming jobs in one click.
- Let users and admins monitor order status in realtime.
- Let admins activate, suspend, and monitor workers.
- Validate demand and workflow for a portfolio-grade MVP.

## 5. Non-Goals

- No online payment.
- No chat.
- No KTP upload.
- No wallet.
- No promo/voucher system.
- No multi-worker orders.
- No dynamic price negotiation.

## 6. Target Users

- Household users needing fast help.
- Daily workers seeking flexible jobs.
- Platform admin managing service quality and worker availability.

## 7. Success Metrics

- User can register and create an order.
- Worker can go online and accept a job.
- Order status changes are visible realtime.
- Nearest online worker candidates can be calculated.
- Admin can monitor users, workers, services, and orders.
- App can be deployed on Vercel and connected to Supabase.

## 8. MVP Scope

- Supabase authentication.
- Role-based access for user, worker, admin.
- Service catalog.
- Order creation with address, notes, and coordinates.
- Worker online/offline status.
- Worker matching by nearest distance.
- Realtime order status updates.
- Rating after completed order.
- Admin dashboard and worker suspension.

## 9. Assumptions

- Users know their service location or can provide coordinates through a future map picker.
- Payment is handled directly in cash after completion.
- Worker vetting is manual outside the MVP.
- Notification delivery can begin with realtime in-app events before SMS/push integration.

## 10. Risks

- Location accuracy affects matching quality.
- RLS policies must be strict because multiple roles share tables.
- Realtime dispatch timeout requires a scheduled worker or edge function for production.
- Workers may miss in-app notifications without push/SMS in future phases.
