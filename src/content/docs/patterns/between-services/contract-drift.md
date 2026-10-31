---
title: "Contract drift and breaking changes"
id: between-services.contract-drift
family: between-services
description: "Use the broker to see which side is asking for a change and what it would break."
related: [between-services.consumer-driven-contracts, between-services.deployment-gates]
agent:
  use_when: "a field or endpoint must be added, changed or removed across team boundaries"
  checklist:
    - "Reader needs something new: write the pact first, provider follows"
    - "Sender removes something: the broker shows who still reads it"
    - "Readers tolerate unknown fields"
---


A contract changes because one side wants something. The question is which side, and what the tooling can tell them before they ship.

## How the broker decides

The broker does not compare schemas or look for "new fields". It answers one question with data it already holds: *has this version of the provider been verified against the pacts of the consumer versions that are in the target environment, and did it pass?* Everything below is a consequence.

- A change that no pact mentions cannot fail a verification, so it needs no coordination.
- A change to something a pact mentions fails the verification of the consumer versions that wrote it, and only those.
- A consumer version that is not deployed anywhere does not block anything.

## Changes by who asks

| Change | Who asks | What the verification says | What to do |
|---|---|---|---|
| Add a field the readers do not use | Sender | Passes. Readers ignore unknown fields, so no pact is affected. | Ship it. |
| Reader starts to use an existing field | Reader | Passes if the sender already sends it. | Ship it: the pact now protects the field. |
| Reader starts to use a new field | Reader | Fails until the sender ships it. | Sender first, then reader (story A). |
| Sender removes or renames a field a pact mentions | Sender | Fails for every consumer version that mentions it. | Reader stops using it, ships; then sender (story B). |
| Sender changes a field's type or format | Sender | Fails for pacts whose matcher states the old type. | As above. |
| Sender adds an enum value | Sender | Passes. | The reader's handler must cope with an unknown value; that is a reader test, not a pact. |
| Reader tightens an expectation (optional becomes required) | Reader | Fails if the sender sometimes omits it. | Sender first. |

The rule that makes the rest work: **a sender can change anything that no deployed reader mentions.** The tooling's only job is to find out which readers mention it.

## Story A: the reader needs something new

Subscriptions wants to give a longer grace period when the processor was unavailable than when the card was declined. It needs a machine-readable `failureCode` on failed outcomes. Today the webhook carries free text in `failureReason`.

```
Day 1  Subscriptions adds failureCode to its webhook pact and publishes it from its branch.
       Production runs Subscriptions 0.5.0 (pact: failureReason) and Payments 2.0.0.

Day 1  Payments' verification picks up the new pact and fails:
       "failureCode: expected a string, the message has no such key".
       can-i-deploy for Subscriptions 0.6.0 to production also says no:
       no deployed provider version has been verified against this pact.

Day 2  Payments adds failureCode, keeps sending failureReason, verification passes,
       Payments 2.1.0 is deployed and recorded.

Day 3  can-i-deploy for Subscriptions 0.6.0 to production: yes.
       Subscriptions deploys.
```

The failed verification on Day 1 is not an error to fix, it is the request: the pact is the message from one team to the other, and the failing check is how Payments finds out. Payments' pipeline sees it without anyone asking.

### The circular dependency

There is a trap on Day 1. The new pact exists only on a Subscriptions branch. Payments' main-branch pipeline replays pacts for the consumer's main branch and for what is deployed, so it never sees the new pact. Nothing fails, nothing is asked, and Subscriptions waits.

Two fixes, used together:

- Let the broker trigger a provider verification when a pact is published or changes, for the changed pact only. The result is on the broker within minutes and Payments' team is told it is failing.
- Payments verifies the consumer's *matching branch* too, so a feature branch with the same name on both sides tests the change before anything merges.

Without them the first symptom is a consumer pipeline that is red for a reason nobody on the other team has heard of.

## Story B: the sender wants to remove something

After Story A, Payments wants to remove `failureReason`, now that `failureCode` exists.

```
Production:  Subscriptions 0.6.0 (pact: failureCode)         Payments 2.1.0 (sends both)
Staging:     Subscriptions 0.7.0 (pact: failureCode)         Payments 2.1.0

Payments 2.2.0 stops sending failureReason.
can-i-deploy Payments 2.2.0 to production:
  Subscriptions 0.6.0 pact: verified
  Result: yes.
```

Looks safe, but only because 0.6.0 stopped mentioning `failureReason`. In the earlier week, while Subscriptions 0.5.0 was still in production, the same check would have said:

```
  Subscriptions 0.5.0 pact (production): FAILED
    failureReason: expected a string, the message has no such key
  Result: no. The consumer that mentions this field is the version running in production.
```

The broker found the one reader that still depends on the field by looking at what is deployed, not what is latest. The same check answers "may we remove it now?" without asking anyone.

The change is split in the same way as any other breaking change: add the new thing, move the readers, remove the old thing, in three separately safe steps. The broker makes the middle step visible.

## Drift that remains

The pact catches drift in shape. It does not catch drift in behaviour, and several kinds are worth naming because they cause real incidents:

| Drift | Why a pact does not see it | Where it is caught |
|---|---|---|
| Payments sends the webhook before the charge is committed | Same body either way | Payments' use-case and idempotency tests; Part 5 for the cross-service ordering |
| Payments changes its retry schedule | Not part of any message | Payments' gateway tests; the Subscriptions handler's idempotency tests |
| A new enum value for `outcome` | The pact lists the values it knows | The reader's handler tests: unknown value goes to dead-letter or an alert |
| Subscriptions treats `amount: 0` as success | Both sides agree about shape | The Subscriptions domain tests |
| A reader that is not on the broker | Not in any pact | Process: all readers join, or the change is announced |

A contract also does not make the two teams agree about meaning. Two tests, one on each side, can still contradict each other about what "failed" means. Keeping them in step is manual work, which is one more reason to keep the pacts small and name the fields that matter.

## Tolerant readers

Some of this is the reader's job. A reader that ignores fields it does not use, and copes with values it has not seen, makes most sender changes safe by construction. A reader that defaults a missing required value, for example treating a missing `amount` as `0`, hides exactly the violation the contract is there to catch. Reject it, log it, and let the retry or the alert do its work.

## Next: environments and the gate

Read [deployment-gates.md](/patterns/between-services/deployment-gates/).
