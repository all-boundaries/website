---
title: "Synchronous call, asynchronous outcome"
id: between-services.synchronous-inbound-pending
family: between-services
description: "Answer immediately with a pending charge, then report the real outcome by callback."
related: [between-services.webhook-idempotency, inside-a-service.outbound-http-gateway]
agent:
  use_when: "a synchronous API must start work that completes later, such as charging a card through a processor"
  checklist:
    - "Respond at once with an id and status pending"
    - "Deliver the real outcome by webhook"
    - "Plan for failure modes between the answer and the outcome"
---


Subscriptions calls `POST /charges` and expects a response immediately. Payments cannot charge the card immediately—it calls the processor asynchronously. This creates a pattern: sync request → async processing → async callback.

## Why not fully async?

Subscriptions could publish a `ChargeRequested` message and forget about it. It asks synchronously instead (see the [outbound gateway](/patterns/inside-a-service/outbound-http-gateway/)).

**Sync request makes sense here:**
- Subscriptions needs to know right now if the charge request was accepted or malformed, and gets a charge id it can quote in support and logs
- Subscriptions doesn't need to know the outcome right now (that comes via webhook later)
- A timeout can be retried safely, because the request carries an idempotency key

**The pattern mirrors real payment processors:**
- POST /charges → { chargeId, status: "pending" } (sync)
- Webhook callback → { chargeId, outcome } (async)

The processor follows the same pattern towards Payments. Payments sits in the middle: it is the provider of the first exchange and a consumer of the second.

## The design

```
Client (Subscriptions):
  POST /charges { subscriptionId, amount, currency }
  ↓
Payments (sync):
  Validate request
  Create charge in pending state
  Return { chargeId, status: "pending" } immediately
  After responding: submit the charge to the processor
  ↓
Processor (async):
  Process charge
  Call Payments webhook: POST /webhooks/outcome { chargeId, result }
  ↓
Payments (sync webhook handler):
  Receive webhook
  Update charge to succeeded/failed
  Call Subscriptions webhook: POST /webhooks/payment-outcome { chargeId, outcome }
```

## Implementation notes

The key difference from Subscriptions:

- **Route returns immediately** after saving the charge as pending, before calling the processor
- **Submission happens after the response:** the route doesn't wait for the processor
- **Submission can fail:** the gateway classifies the result ([error classification](/patterns/between-services/error-classification/)). A transient failure leaves the charge pending for the retry job; a permanent one marks it failed and reports to Subscriptions

```typescript
// Simplified example

export async function initiateChargeRoute(req) {
  const data = validateRequest(req);
  
  const charge = newCharge(data);
  await save(charge);                    // Charge saved as pending
  
  queueMicrotask(() => submitCharge(charge.id));   // after the response; result classified by the gateway
  
  return json({ chargeId: charge.id, status: "pending" }, 201);
}
```

This means:
- The route returns 201 even if the submission later fails
- A scheduled job must find old pending charges and retry them
- Tests must account for this: the processor gateway is replaced in the use-case test, not in the route test

## Failure modes

Because the processor call is async, failures are different:

| Failure | When | Example | Handling |
|---|---|---|---|
| Validation | Sync, in route | Missing required field | Return 400 immediately |
| Processor | Async, after route returns | Network timeout, processor down | Charge stays pending; retry job picks it up |
| Webhook | Async, after processor | Subscriptions webhook fails | Payments gateway decides: retry or give up |

The use case tests cover the processor and webhook paths with mocks. The closed-box test simulates the webhook arriving.

## In code

See `payments/src/charge/initiate-charge.ts` and `payments/test/non-dom/initiate-charge.test.ts` for the full implementation and tests.
