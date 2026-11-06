---
title: "Webhook idempotency"
id: between-services.webhook-idempotency
family: between-services
description: "Make a webhook handler safe to call twice by recording what it has processed."
related: [between-services.error-classification, inside-a-service.inbound-http-gateway]
agent:
  use_when: "a webhook can arrive late, be retried or arrive twice"
  checklist:
    - "Record the event id before or with the effect"
    - "A second delivery changes nothing"
    - "Test duplicate and out-of-order delivery"
---


The processor calls Payments' webhook to report the charge outcome. Webhooks are unreliable: they can arrive late, be retried, or arrive twice. The handler must be idempotent: calling it twice must be safe.

## The problem

A processor's webhook retry logic might be:
- Call webhook
- No response → retry in 1 minute
- No response → retry in 5 minutes
- ...

If Payments is slow to respond, the processor retries. If our handler processes the webhook and *then* crashes before returning a response, the processor thinks we didn't get it and retries. Result: we process the same outcome twice.

```
Processor: POST /webhooks/outcome { chargeId: "ch-1", status: "succeeded", deliveryId: "evt-1" }
Payments: receive, process, charge settled, crash
Processor: no response → retry
Processor: POST /webhooks/outcome { chargeId: "ch-1", status: "succeeded", deliveryId: "evt-1" } (same delivery)
Payments (after restart): receive, process, charge settled again (!)
```

If the second call updates the charge, it might shorten the refund window or send two notifications to Subscriptions.

## The solution

The handler must remember which webhook deliveries it has already processed. If the same `deliveryId` arrives again, it returns success without reprocessing.

```typescript
export async function handleProcessorOutcome(raw: unknown): Promise<"ack" | "retry"> {
  const parsed = outcomeSchema.safeParse(raw);
  if (!parsed.success) return "ack";

  const { deliveryId, chargeId, status } = parsed.data;

  // Idempotency guard
  if (await hasSeenDelivery(deliveryId)) {
    return "ack";  // Already processed; return success without reprocessing
  }

  // Settling the charge and recording the delivery commit together, or not at all
  const result = await inTransaction(async () => {
    const settled = await settleChargeFromOutcome(chargeId, { type: status, ... });
    if (settled.isOk()) await markDeliveryProcessed(deliveryId);
    return settled;
  });
  if (result.isErr()) return "retry";

  // Notifying Subscriptions is a separate step with its own retries (see below)
  await enqueueNotification(result._unsafeUnwrap().charge);

  return "ack";
}
```

Two things matter here:
1. Settling the charge and recording the delivery id are one transaction. If they were separate, a crash between them would settle the charge again on the retry.
2. Telling Subscriptions is not done inline. The handler writes a notification to an outbox in the same transaction (`enqueueNotification`), and a sender delivers it with its own retries using the [error classification](/patterns/between-services/error-classification/) rules. Otherwise a slow Subscriptions would make the processor's webhook time out and retry for the wrong reason.

If we crash after the transaction but before returning ack, the next processor retry finds the delivery already recorded and returns ack. The outbox still holds the notification, so it is not lost.

## Testing idempotency

The test calls the handler twice with the same `deliveryId`:

```typescript
it("is idempotent: calling twice with the same deliveryId is safe", async () => {
  const useCase = spyOn(settleModule, "settleChargeFromOutcome")
    .mockReturnValue(okAsync({
      charge: aCharge({ status: "succeeded" }),
      notifySubscription: true,
    }));

  const outcome = {
    deliveryId: "evt-1",
    chargeId: "ch-1",
    status: "succeeded",
  };

  const first = await handleProcessorOutcome(outcome);
  const second = await handleProcessorOutcome(outcome);

  expect(first).toBe("ack");
  expect(second).toBe("ack");
  expect(useCase).toHaveBeenCalledTimes(1);  // settled only once
});
```

The test proves:
- Both calls return ack (so the processor is satisfied both times)
- The use case is called only once (so the charge is settled exactly once)

## Storage

The `deliveryId` must be persisted in the database, in a table the handler owns (the same pattern as the `processed_message` table in the [inbound messaging](/patterns/inside-a-service/inbound-messaging/) pattern):

```sql
create table processed_webhook_delivery (
  delivery_id  text primary key,
  processor    text not null,
  processed_at timestamptz not null
);
```

The primary key also protects against two deliveries racing each other: the second insert fails and the transaction rolls back.

The handler checks this table before processing, inside the same transaction that settles the charge.

## Difference from the Subscriptions service

The Subscriptions service already has the same problem twice. The `AccountClosed` listener and the Payments webhook handler each deduplicate with the `processed_message` table, because the broker (or Payments) delivers at least once.

What differs here is who retries and how:
- Broker: retries on a negative acknowledgement, and the consumer controls the outcome (`ack`, `retry`, `dead-letter`)
- Webhook: the *caller* retries, on its own schedule, driven only by the HTTP status code we return

In both cases the service owns deduplication. For the webhook the status code is also the retry instruction, so the mapping of results to codes is part of the contract (see the [webhook table](/patterns/inside-a-service/inbound-http-gateway/#the-payments-webhook)).

## In code

See `payments/src/webhook/processor-outcome-handler.ts` and `payments/test/non-dom/processor-outcome-handler.test.ts`.
