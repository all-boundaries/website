---
title: "Environments and \"can I deploy?\""
id: between-services.deployment-gates
family: between-services
---


Pacts and verification results are only useful if they stop a bad deployment. This page covers the gate: what the broker knows about each environment, the commands each pipeline runs, and how rollback is checked.

## What the broker knows about an environment

Every service version that has been published has a place in the broker. Two kinds of fact are recorded against it:

- **Verification results**: provider version X was replayed against consumer pact version Y, and passed or failed.
- **Deployments**: version Z of a service is live in `staging` or `production`.

Together these give versioned contracts per environment. Production has a set of service versions, and each pair of them either has a passing verification or it does not.

```
production:  Subscriptions 0.6.0    Payments 2.1.0
staging:     Subscriptions 0.7.0    Payments 2.2.0
```

Nothing in the broker is a copy of "the production contract". The contract in force in production is the pacts of the consumer versions live there, and whether the live provider version satisfies them is a verification result you can look up.

## The question the gate asks

```bash
pact-broker can-i-deploy \
  --pacticipant Payments --version "$GIT_COMMIT_SHA" \
  --to-environment production
```

The broker looks at this version's published pacts and verification results and at the versions recorded in `production`, and answers: is there a passing verification between this version and every version it would run next to?

```
Computer says no ¯\_(ツ)_/¯

  Payments 2.2.0 and Subscriptions 0.5.0: FAILED
    pact "failureReason: expected a string, the message has no such key"
    Subscriptions 0.5.0 is the version in production.
```

The failure names the version in production that depends on the thing being changed. The team that is blocked does not have to guess whom to ask.

The same check is asked in both directions. Subscriptions asks it before deploying a version that expects something new (the provider in production must already do it). Payments asks it before deploying a version that stops doing something (no consumer in production may still need it).

## The gate in each pipeline

The shape is identical for any service on the broker:

1. **Test.** The usual suite (Parts 1 and 2).
2. **Consumer: publish pacts.** Tagged with the commit and branch.
3. **Provider: verify pacts and publish the result.** Selectors: main branch, matching branch, and everything deployed or released.
4. **`can-i-deploy` to the target environment.** A failure stops the pipeline.
5. **Deploy.**
6. **`record-deployment`.** Tell the broker this version is now live there.

Step 6 matters more than it looks. If it is skipped, the broker believes the old version is still live, and every later check compares against the wrong thing. Make it a step of the deploy job, not a separate job that can be forgotten.

```yaml
# Subscriptions (consumer): excerpt, see code-examples/ci-examples/subscriptions-ci.yml
- run: npm run test:contracts:consumer
- run: >
    pact-broker publish pacts
    --consumer-app-version "$GITHUB_SHA" --branch "$GITHUB_REF_NAME"
- run: >
    pact-broker can-i-deploy --pacticipant Subscriptions
    --version "$GITHUB_SHA" --to-environment production
- run: npm run deploy:production
- run: >
    pact-broker record-deployment --pacticipant Subscriptions
    --version "$GITHUB_SHA" --environment production
```

```yaml
# Payments (provider): excerpt, see code-examples/ci-examples/payments-ci.yml
- run: npm run test:contracts:verify    # replays Subscriptions' pacts, publishes the result
- run: >
    pact-broker can-i-deploy --pacticipant Payments
    --version "$GITHUB_SHA" --to-environment production
- run: npm run deploy:production
- run: >
    pact-broker record-deployment --pacticipant Payments
    --version "$GITHUB_SHA" --environment production
```

Payments does not publish pacts about what it sends. It publishes *verification results* about the pacts it replayed, and the verifier does that itself when `publishVerificationResult` is on.

## Environments that differ

The gate is stricter the closer a version is to customers, but the mechanism is the same:

| Environment | Check | If it fails |
|---|---|---|
| Development | None required. Consumers publish from branches; providers verify matching branches. | Fix on the branch. |
| Staging | `can-i-deploy --to-environment staging` | Fix, or deploy the other side to staging first. |
| Production | `can-i-deploy --to-environment production` | The other team's version must go first. Open a conversation. |

A version that passes in staging has not passed in production. Production may run an older version of the other service, so the check is asked again against what is *recorded in production*.

## Order of deployment

The check does not choose an order, it rejects the wrong one. Following Story A in the previous page:

```
Payments 2.1.0 sends failureCode  →  production
Subscriptions 0.6.0 reads it      →  production   (can-i-deploy now passes)
```

The sender goes first when the reader wants something new. When the sender wants to remove something, the reader goes first and the sender follows. In both cases the broker reports "no" to the one trying to go too early.

## Rollback

Rolling back is another deployment, so the same check applies:

```bash
pact-broker can-i-deploy --pacticipant Payments --version 2.0.0 --to-environment production
```

It answers: is the older version still compatible with the consumers live now? If Subscriptions 0.6.0 reads `failureCode` and Payments 2.0.0 does not send it, the answer is no, and the broker has told you before you tried. Keeping the previous version of the other side in the picture is the point.

Two limits. The check says nothing about databases: a rollback that needs an older schema is a separate problem. And it only knows about versions that were recorded; a hotfix pushed around the pipeline leaves the broker wrong.

## When the gate says no

A "no" is a request for a conversation, not a verdict. What the team that was blocked does:

1. Reads the failing pair in the broker: which pact, which version, which interaction.
2. Asks whether the other side should change, this side should change, or the pact says more than it should.
3. If the pact over-specifies, the consumer loosens it. If the sender should change, the sender changes.
4. Reruns.

The working agreement is that both teams treat the pact file as the thing under discussion, not each other's code.

## Setup

The broker runs in a container with a database, and each environment has to be created once (`pact-broker create-environment --name production --production`). `code-examples/pact-broker/docker-compose.yml` is a local setup; a team that uses this seriously will want a hosted broker. See code-examples/README.md.

## What the gate does not do

- It does not run the services together. Nothing here starts both and sends a request.
- It does not cover services outside the broker: the third-party processor, or a consumer that never joined.
- It does not know about behaviour that a pact does not describe (see [contract-drift.md](/patterns/between-services/contract-drift/#drift-that-remains)).

Those gaps are the reason for the few end-to-end journeys in Part 5.

## Next: Part 4

[Part 4](/journeys/one-product-several-teams/) looks at the teams around these gates.
