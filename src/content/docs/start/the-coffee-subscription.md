---
title: The coffee subscription
description: The running example used by every pattern.
---

Every pattern uses one product: a coffee subscription split across four teams.

| Service | Owns |
|---|---|
| **Subscriptions** | plans, subscription lifecycle, billing cycle, renewals, cancellation |
| Inventory | product stock and reservations |
| Payments | charging, refunds, payment methods |
| Accounts | users, profiles, account closure |

```mermaid
flowchart LR
    Subs["Subscriptions"] -->|POST /charges| Pay["Payments"]
    Pay -->|webhook: payment outcome| Subs
    Subs -->|POST /reservations| Inv["Inventory"]
    Acc["Accounts"] -->|AccountClosed| Subs
    Subs -->|SubscriptionRenewed / Cancelled| Bus[("Broker")]
```

Start with [the journey through one service](/journeys/build-one-service-testably/).
