# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Astro + Starlight (markdown/MDX source in `src/content/docs/`, Mermaid rendered to inline SVG at build time). Runtimes managed with mise.

## Users
- Engineers, tech leads and architects building or reviewing services that depend on other teams' services. They arrive with a concrete problem (contract drift, webhook retries, unclear test boundaries) and want a pattern to copy.
- Directors and executives who own several services and experiences and are exploring team shapes and organisation structure; they read the cross-team material (team interaction, platform, ways of working) and need it connected to the technical reality.
- LLM agents that ingest pages, raw markdown and generated skills.

## Product Purpose
A site of practical patterns with real examples, backed by a companion GitHub repo, that connects problems at every scale: testing inside one service, contracts between services, and collaboration between teams and the organisation. Success: a reader finds the pattern for their problem, sees it in working code, and can follow it up the scale from code to team structure.

## Positioning
The pattern catalogue spans the whole boundary stack (domain, gateway, contract, team) on one running example (a coffee subscription across Subscriptions, Payments, Inventory, Accounts), with the test boundary stated for each pattern and the content built to be consumed by agents as well as people.

## Operating Context
- Source is markdown with Mermaid diagrams and code blocks; many diagrams per page.
- Companion code lives in a GitHub repo that does not exist yet; pages currently carry a "none of the code has been run" caveat.
- Content is organised as patterns (source of truth) plus journeys (reading orders), with LLM outputs: `/llms.txt`, `/raw/<path>.md`, `/skills/<id>/SKILL.md`.

## Capabilities and Constraints
- Name: All Boundaries, at allboundaries.net.
- Existing logo at `src/assets/logo.svg` may be improved.
- Four parts drafted: inside one service, a second service, across the boundary (contracts), one product several teams. Only Part 1 is imported so far.
- Open: companion repo URL, content licence, contribution model.

## Brand Commitments
- Name "All Boundaries" and the domain are fixed.
- Logo and visual identity are open to improvement; no binding colours or fonts.
- Visual references the user named (October 2026): Stripe Guides, Stripe Docs and the opencode v2 docs: pale cool ground, deep navy ink, saturated colour fields with fine line art, navy code panels, mono for small labels.
- Voice direction (recommended, awaiting confirmation): plural, collective "we explore" voice, plain and direct as in the drafts, with a visible invitation to take part (edit on GitHub, propose a pattern, open a discussion) so readers feel like contributors.

## Evidence on Hand
- Drafts for Parts 1-4 (about 29k words, 29 Mermaid diagrams, 119 code blocks) in `~/Documents/1-Projects/all-boundaries/material-oct-2026/drafts`.
- No testimonials, customers, usage numbers or published companion repo; do not fabricate them.

## Product Principles
- Patterns are the source of truth; journeys only order them.
- Every pattern ties code to its test boundary, and scales up to the team decision it implies.
- Show before telling: a diagram and real code come before prose.
- Equal citizenship for human and agent readers.
- Invite participation; the catalogue is meant to grow with its readers.

## Accessibility & Inclusion
Readable by executives and engineers alike: avoid jargon without a definition, keep diagrams legible and text-alternative friendly. No formal standard stated; aim for WCAG AA.
