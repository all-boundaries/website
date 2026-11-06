---
title: "Contracts with the processor and Subscriptions"
id: between-services.bidirectional-contracts
family: between-services
description: "Verify the contracts you can, and record an understanding where a third party will not verify."
related: [between-services.consumer-driven-contracts]
agent:
  use_when: "a service sits between a team it serves and an external provider and contract tooling fits each differently"
  checklist:
    - "Verify the pacts consumers write about your API"
    - "For an external processor, keep a recorded understanding, not a claimed contract"
    - "Say which neighbour each guarantee comes from"
---


Payments stands between two different kinds of neighbour, and the contract tooling fits them differently:

| Neighbour | Who it is | Direction | What works |
|---|---|---|---|
| Subscriptions | A team in the same company, with its own pipeline | Subscriptions calls `POST /charges`; Payments calls the webhook | Consumer-written contracts that Payments verifies |
| The card processor | A third party | Payments calls the processor; the processor calls Payments | A recorded understanding of the API, checked against the processor's sandbox |

The page on [stopping contract drift](/journeys/stop-contract-drift/) explains how the first kind moves between teams. This page covers what Payments writes and verifies.

## Subscriptions' contracts: Payments verifies them

Subscriptions writes down what it needs, in its own tests (the [outbound gateway](/patterns/inside-a-service/outbound-http-gateway/) for `POST /charges` and the [webhook handler](/patterns/inside-a-service/inbound-http-gateway/) for the outcome payload). Each writes a pact. Payments replays both against its own code.

```
POST /charges   { subscriptionId, idempotencyKey, amount, currency }
                -> 201 { chargeId, status: "pending" }

webhook body    { eventId, chargeId, subscriptionId, outcome, occurredAt }
```

Verification of the HTTP request replays Subscriptions' request against the real route, with a provider state that prepares the data:

```typescript
// test/non-dom/charges.provider.test.ts

it("meets the expectations Subscriptions has of POST /charges", async () => {
  await new Verifier({
    provider: "payments",
    providerBaseUrl: server.url.origin,
    pactUrls: [resolve("pacts/subscriptions-payments.json")],
    stateHandlers: {
      "a subscription can be charged": async () => resetDb(),
    },
  }).verifyProvider();
});
```

The webhook payload is verified as a message: Payments produces the body it would send, and the check compares it with what Subscriptions reads.

```typescript
// test/non-dom/webhook.provider.test.ts

it("sends a payload that meets what Subscriptions reads", async () => {
  await new MessageProviderPact({
    provider: "payments",
    pactUrls: [resolve("pacts/subscriptions-payments.json")],
    messageProviders: {
      "a PaymentOutcome webhook": async () =>
        toWebhookPayload(aCharge({ status: "failed", id: "ch-1" })),
    },
  }).verify();
});
```

Payments verifies; it does not author these. The point is that Subscriptions says what it relies on, so Payments can change anything else freely. A field that no pact mentions can be renamed or removed without asking anyone.

## The processor: a recorded understanding, not a verified contract

Payments consumes the processor's API:

```
When I POST /charges with { amount, currency, metadata },
I expect back { id, status, failureCode? } with status in [succeeded, requires_action, failed]
```

The gateway test is written the same way as the Inventory test, against a contract mock server:

```typescript
// test/non-dom/processor.consumer.test.ts

it("requests a charge and receives processor charge id", async () => {
  await provider
    .addInteraction()
    .uponReceiving("a charge request")
    .withRequest("POST", "/charges", (b) =>
      b.jsonBody({ amount: like(99.99), currency: "USD", metadata: like({}) })
    )
    .willRespondWith(200, (b) =>
      b.jsonBody({ id: like("ch-1"), status: "succeeded" })
    )
    .executeTest(async (mock) => {
      const result = await callProcessor(aCharge(), ky.create({ prefixUrl: mock.url }));
      expect(result._unsafeUnwrap()).toEqual({ type: "succeeded", processorChargeId: "ch-1" });
    });
});
```

What this test proves is that the gateway reads the response shape Payments *believes* the processor sends. It does not prove the processor sends it: the processor is not a team in this company, will not replay the pact, and will not set up provider states for it. Contract verification with a Broker needs control of both sides; here there is only one.

So the mock is checked a different way:

- **Learning tests** run the same requests against the processor's sandbox on a schedule (not on every commit), and fail when the sandbox disagrees with the mock. They are the nearest substitute for provider verification.
- **The adapter limits the blast radius.** Only the gateway knows the processor's field names and codes; a change there is a change in one file.
- **Expect surprises in production.** Unknown statuses and unparseable bodies are classified as transient or permanent failures, never crashes ([error classification](/patterns/between-services/error-classification/)).

## Why both matter

**Subscriptions' contracts:**
- Gives Subscriptions confidence that Payments sends what it reads
- Protects Payments: nothing outside the pacts can break a consumer, so internals can change
- A breaking change is found by the verification, not by an incident

**The processor mock:**
- Keeps processor-specific detail in one place
- Is honest about being an assumption, and is re-checked against the sandbox

## In code

See `payments/test/non-dom/` for the tests:
- `charges.provider.test.ts` and `webhook.provider.test.ts` — verification of Subscriptions' pacts
- `processor.consumer.test.ts` — the processor mock
- `processor.sandbox.test.ts` — learning tests against the sandbox (scheduled)

The page on [stopping contract drift](/journeys/stop-contract-drift/) explains how the pact files flow between teams.
