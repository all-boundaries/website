---
title: "Error classification"
id: between-services.error-classification
family: between-services
description: "Separate transient from permanent failures so use cases retry only what can succeed."
related: [between-services.webhook-idempotency, across-teams.failure-and-degradation]
agent:
  use_when: "a use case calls a gateway and must decide whether a failure should be retried or reported"
  checklist:
    - "The gateway classifies; the use case decides on retryable"
    - "Transient failures retry, permanent ones report immediately"
    - "Test both classes"
---


When a use case calls a gateway (processor API, Subscriptions webhook), the outcome can be success or failure. But not all failures are equal. Some should be retried; others should be reported immediately.

## The distinction

**Transient failures** (retry):
- Network timeout
- 5xx from the processor
- DNS failure
- Connection refused

**Permanent failures** (don't retry):
- 4xx errors (bad request, not found, unauthorized)
- Processor declines the charge (402)
- Invalid card (4xx)

## Why it matters

If you retry a 4xx, you're wasting time. If you don't retry a timeout, you're giving up too early.

The gateway, not the use case, decides what is retryable. This keeps the decision logic in one place.

```typescript
// src/gateway/processor-gateway.ts

export async function callProcessor(charge: Charge, client): Promise<Result<ProcessorOutcome, GatewayError>> {
  const response = await client.post("charges", { json: {...}, throwHttpErrors: false });

  // 402: processor declined the charge (permanent, normal outcome)
  if (response.status === 402) {
    const body = chargeResponseSchema.parse(await response.json());
    return ok({ type: "failed", reason: body.failureCode || "declined" });
  }

  // 5xx: processor is down (transient, retry)
  if (response.status >= 500) {
    return err({ code: "proc-1", retryable: true, message: "processor unavailable" });
  }

  // 4xx other than 402 (permanent, don't retry)
  if (response.status >= 400) {
    return err({ code: "proc-2", retryable: false, message: "bad request" });
  }

  // Success
  if (response.ok) {
    const body = chargeResponseSchema.parse(await response.json());
    return ok({ type: "succeeded", processorChargeId: body.id });
  }

  // Network error (transient, retry)
  return err({ code: "proc-1", retryable: true, message: "connection failed" });
}
```

Notice: a 402 (payment required) becomes `ok({ type: "failed" })`, not an error. Why? Because a declined card is a normal business outcome, not a failure of the integration.

## Use case decides on retryable

The use case receives the result and can act:

```typescript
export function submitCharge(chargeId: string): ResultAsync<...> {
  return findById(chargeId)
    .andThen((charge) => callProcessor(charge))
    .match(
      (outcome) => {
        // Success: update charge
        return save({ ...charge, status: "settled", processorOutcome: outcome });
      },
      (error) => {
        if (error.retryable) {
          // Transient: don't save, so a retry job can try again
          return err(error);
        } else {
          // Permanent: save the error and alert
          return save({ ...charge, status: "failed", error: error.message });
        }
      }
    );
}
```

If the error is retryable, the use case doesn't save. A retry job later finds the charge still pending and tries again. If the error is permanent, the use case (or a job) can save it and alert the operator.

## Testing

Both paths are tested:

```typescript
it("propagates transient errors without saving", async () => {
  const procSpy = spyOn(processorModule, "callProcessor")
    .mockReturnValueOnce(errAsync({
      code: "proc-1",
      retryable: true,
      message: "timeout",
    }));

  const result = await initiateCharge("sub-1", 99.99, "USD");

  expect(result.isErr()).toBeTrue();
  expect(result._unsafeUnwrapErr().retryable).toBeTrue();
  // Charge was not saved (stays pending for retry)
});

it("saves permanent errors", async () => {
  const procSpy = spyOn(processorModule, "callProcessor")
    .mockReturnValueOnce(errAsync({
      code: "proc-2",
      retryable: false,
      message: "bad request",
    }));

  const result = await initiateCharge("sub-1", 99.99, "USD");

  expect(result.isErr()).toBeTrue();
  expect(result._unsafeUnwrapErr().retryable).toBeFalse();
  expect((await findById("ch-1"))._unsafeUnwrap().status).toBe("failed");   // permanent error was saved
});
```

## In code

See `payments/src/gateway/processor-gateway.ts` for the full classification logic and `payments/test/non-dom/processor-gateway.test.ts` for the tests.
