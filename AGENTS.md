# All Boundaries website

Astro + Starlight site. Content is markdown in `src/content/docs/`; Mermaid fences render to inline SVG at build time.

## Tooling

- Use `mise` for every runtime dependency (node, pnpm, d2, ...). Declare tools in `mise.toml`; run commands with `mise exec -- <cmd>` or `mise run <task>` (`dev`, `build`, `check`).
- First time: `mise install && mise exec -- pnpm install && mise exec -- pnpm exec playwright install chromium` (Chromium renders Mermaid).

## Content rules

- Layout: `start/`, `patterns/{inside-a-service,between-services,across-teams}/`, `journeys/`, `reference/`. Patterns are the source of truth; journeys only order them.
- Pattern front matter: `id`, `family`, `description`, `tests`, `related`, `repo`, `agent` (`use_when`, `checklist`). Pages with `agent` get a generated skill at `/skills/<id>/SKILL.md`; every page has a raw twin at `/raw/<path>.md`.
- Link with absolute slugs (`/patterns/inside-a-service/domain/`), not relative `.md` paths.
