# Flow Diagrams and Order Lifecycle

## User Flow Diagram

```mermaid
flowchart TD
  A[Open App] --> B[Login or Register]
  B --> C[User Dashboard]
  C --> D[Choose Service]
  D --> E[Enter Address and Location]
  E --> F[Add Notes]
  F --> G[Submit Order]
  G --> H[Waiting for Worker]
  H --> I[Worker Accepted]
  I --> J[Worker On The Way]
  J --> K[Working]
  K --> L[Completed]
  L --> M[Cash Payment]
  M --> N[Rate Worker]
```

## Worker Flow Diagram

```mermaid
flowchart TD
  A[Login] --> B[Worker Dashboard]
  B --> C[Toggle Online]
  C --> D[Receive Incoming Job]
  D --> E{Accept?}
  E -->|Yes| F[Accepted]
  E -->|No| G[Reject or Timeout]
  G --> C
  F --> H[On The Way]
  H --> I[Working]
  I --> J[Completed]
  J --> K[History]
```

## Admin Flow Diagram

```mermaid
flowchart TD
  A[Admin Login] --> B[Dashboard Stats]
  B --> C[Monitor Orders]
  B --> D[Monitor Users]
  B --> E[Monitor Workers]
  E --> F{Worker Issue?}
  F -->|Yes| G[Suspend Worker]
  F -->|No| H[Keep Active]
  B --> I[Manage Services]
```

## Order Lifecycle Diagram

```mermaid
stateDiagram-v2
  [*] --> waiting
  waiting --> accepted: worker accepts
  waiting --> cancelled: user/admin cancels
  accepted --> on_the_way: worker departs
  accepted --> cancelled: cancellation
  on_the_way --> working: worker arrives
  working --> completed: worker finishes
  working --> cancelled: admin cancellation
  completed --> [*]
  cancelled --> [*]
```

## Status Rules

- `waiting`: created, no worker assigned yet.
- `accepted`: worker has accepted the job.
- `on_the_way`: worker is traveling to customer.
- `working`: work is in progress.
- `completed`: work is finished and ready for rating/payment.
- `cancelled`: order ended before completion.

## UX Flow Constraints

- User order creation should require no more than 4 steps.
- Worker acceptance must be a single primary button.
- Status labels must be human-readable, not raw enum names.
- Every status transition should show immediate visual feedback.
