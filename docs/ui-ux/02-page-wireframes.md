# Page Wireframes

Wireframes use simple text blocks. They define structure before visual polish.

## Public: Login

Purpose: Let returning users enter the app quickly.

Component hierarchy:

- Auth page container
- Auth card
- Title and helper text
- Email field
- Password field
- Primary login button
- Register link

Mobile wireframe:

```text
[Yanto Siap]
[Login title]
[Email input]
[Password input]
[Login full-width]
[Register link]
```

Desktop wireframe:

```text
------------------------------------------------
|              centered auth card              |
| Login Yanto Siap                             |
| Email                                        |
| Password                                     |
| [Login]                                      |
| Register link                                |
------------------------------------------------
```

UX considerations:

- Keep login under 2 fields.
- Show errors clearly.
- Redirect by role after login.

## Public: Register

Purpose: Create a user or worker account.

Component hierarchy:

- Auth card
- Full name, email, phone
- Role select
- Password
- Submit button

Mobile wireframe:

```text
[Register]
[Name]
[Email]
[Phone]
[Role dropdown]
[Password]
[Create account]
```

Desktop wireframe:

```text
------------------------------
| Register                   |
| Name                       |
| Email                      |
| Phone                      |
| Role                       |
| Password                   |
| [Create Account]           |
------------------------------
```

UX considerations:

- Default role should be User.
- Worker onboarding details can be added later.

## User: Dashboard

Purpose: Show current activity and make "Buat Order" obvious.

Component hierarchy:

- App shell
- Stat cards
- Primary create order button
- Recent order cards

Mobile wireframe:

```text
[Header]
[Create Order button]
[Active Orders stat]
[Services stat]
[Workers Online stat]
[Recent Order Card]
[Recent Order Card]
```

Desktop wireframe:

```text
[Sidebar] [Header]
          [Stats row: active | services | online]
          [Recent Orders]                 [Buat Order]
          [Order card] [Order card]
```

UX considerations:

- Primary order action must be above the fold.
- Show order status without opening detail.

## User: Create Order

Purpose: Let users request help in 3-4 steps.

Component hierarchy:

- Service select
- Address
- Location fields/map placeholder
- Notes
- Submit button

Mobile wireframe:

```text
[Header]
[Service]
[Address]
[Use current location / coordinates]
[Notes]
[Create Order button]
```

Desktop wireframe:

```text
[Form card]                       [Map placeholder]
Service
Address
Latitude / Longitude
Notes
[Create Order]
```

UX considerations:

- Future: one-tap current location.
- Notes are optional.
- Submit label should mention worker search.

## User: Order Detail

Purpose: Track job status realtime and rate after completion.

Component hierarchy:

- Order summary
- Status badge
- Timeline
- Worker info
- Rating form if completed

Mobile wireframe:

```text
[Service + Status]
[Address]
[Timeline]
 waiting
 accepted
 on the way
 working
 completed
[Rating form if completed]
```

Desktop wireframe:

```text
[Order summary + timeline] [Rating / worker panel]
```

UX considerations:

- Use human labels.
- Realtime updates should be visible immediately.
- Disable rating until completed.

## User: History

Purpose: Let users review completed orders.

Component hierarchy:

- Filter/search future
- Completed order cards
- Empty state

Mobile wireframe:

```text
[Header]
[Completed Order]
[Completed Order]
```

Desktop wireframe:

```text
[Sidebar] [History grid]
```

UX considerations:

- Keep compact.
- Include service, date, worker, rating.

## User: Profile

Purpose: Show account identity and basic contact info.

Component hierarchy:

- Profile card
- Name
- Email
- Phone
- Role

Mobile wireframe:

```text
[Profile]
[Name]
[Email]
[Phone]
```

Desktop wireframe:

```text
[Sidebar] [Profile card]
```

UX considerations:

- Editing can be future feature.

## Worker: Dashboard

Purpose: Let worker manage availability and see active opportunities.

Component hierarchy:

- Online/offline status
- Toggle button
- Rating/job stats
- Incoming jobs list

Mobile wireframe:

```text
[Header]
[Online status]
[Toggle Online]
[Rating]
[Incoming Jobs]
```

Desktop wireframe:

```text
[Sidebar] [Stats row]
          [Toggle Online]
          [Incoming job cards]
```

UX considerations:

- Toggle must be obvious.
- Incoming job list must refresh realtime.

## Worker: Incoming Jobs

Purpose: Show waiting and assigned jobs.

Component hierarchy:

- Job cards
- Status badge
- Address
- Detail link

Mobile wireframe:

```text
[Header]
[Job card: service, address, status]
[Job card]
```

Desktop wireframe:

```text
[Sidebar] [Job grid]
```

UX considerations:

- Most important card info: service, distance/location, action.

## Worker: Job Detail

Purpose: Accept job and update progress.

Component hierarchy:

- Job summary
- Customer/address/notes
- Accept button if waiting
- Status action buttons

Mobile wireframe:

```text
[Service + Status]
[Customer]
[Address]
[Notes]
[Accept Job]
[On the way] [Working] [Completed]
```

Desktop wireframe:

```text
[Job detail card]
[Action button group]
```

UX considerations:

- Accept job in one click.
- Status buttons should be large and clear.

## Worker: History

Purpose: Review completed jobs.

Component hierarchy:

- Completed job cards
- Date/status/rating future

Mobile wireframe:

```text
[Header]
[Completed job card]
```

Desktop wireframe:

```text
[Sidebar] [Completed jobs grid]
```

UX considerations:

- Useful for trust and personal record.

## Worker: Profile

Purpose: Show worker availability and rating profile.

Component hierarchy:

- Worker card
- Online state
- Rating
- Status

Mobile wireframe:

```text
[Profile]
[Name]
[Online/Offline]
[Rating]
[Status]
```

Desktop wireframe:

```text
[Sidebar] [Worker profile card]
```

UX considerations:

- Future: update location and service skills.

## Admin: Dashboard

Purpose: Give operational overview.

Component hierarchy:

- Stat cards
- Recent order monitoring future
- Worker activity future

Mobile wireframe:

```text
[Header]
[Total Orders]
[Workers]
[Users]
[Online Workers]
```

Desktop wireframe:

```text
[Sidebar] [Stats row]
          [Monitoring panels future]
```

UX considerations:

- Admin pages can be denser but still readable.

## Admin: Users

Purpose: Monitor registered users.

Component hierarchy:

- Responsive table
- Name/email/phone/role

Mobile wireframe:

```text
[Header]
[Scrollable table]
```

Desktop wireframe:

```text
[Sidebar] [Users table]
```

UX considerations:

- Horizontal scroll on mobile is acceptable for admin.

## Admin: Workers

Purpose: Manage worker operational access.

Component hierarchy:

- Worker table
- Status
- Online state
- Rating
- Activate/suspend actions

Mobile wireframe:

```text
[Header]
[Scrollable worker table]
[Activate] [Suspend]
```

Desktop wireframe:

```text
[Sidebar] [Worker management table]
```

UX considerations:

- Suspend should require confirmation in production.

## Admin: Orders

Purpose: Monitor all platform orders.

Component hierarchy:

- Realtime order cards/table
- Status badges
- Detail links

Mobile wireframe:

```text
[Header]
[Order card]
[Order card]
```

Desktop wireframe:

```text
[Sidebar] [Order grid]
```

UX considerations:

- Status filters should be future enhancement.

## Admin: Services

Purpose: Manage service catalog.

Component hierarchy:

- Add service form
- Service list
- Active/inactive toggle

Mobile wireframe:

```text
[Header]
[Add service form]
[Service item]
[Service item]
```

Desktop wireframe:

```text
[Sidebar] [Add service form] [Service list]
```

UX considerations:

- Keep service names short.
- Inactive services should not appear to users.
