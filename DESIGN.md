---
name: All Boundaries
description: A technical guide library: cool mist ground, deep navy ink, one indigo for action, four flat family colours carrying fine line art, navy code panels.
colors:
  ink-navy: "#0b1f3a"
  mist: "#f6f9fc"
  indigo: "#5b4cf0"
  indigo-deep: "#4636d6"
  cobalt: "#1f62d6"
  tangerine: "#ff8a2b"
  rose: "#ff6fa5"
  violet: "#6f4be0"
  rule: "#d5deea"
  wash: "#e8eef6"
  slate: "#52678a"
  night: "#0a1628"
  night-surface: "#101f36"
  night-rule: "#243652"
  night-text: "#eaf1fb"
  night-indigo: "#8f86ff"
  code-panel: "#0f1b33"
typography:
  display:
    fontFamily: "Figtree Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  cover:
    fontFamily: "Figtree Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Figtree Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Figtree Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, Menlo, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  sidebar: "17.5rem"
  column: "46rem"
components:
  button-primary:
    backgroundColor: "{colors.indigo}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.indigo-deep}"
  family-card:
    rounded: "{rounded.lg}"
    padding: "1.5rem 1.5rem 0"
  code-block:
    backgroundColor: "{colors.code-panel}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.lg}"
---

# Design System: All Boundaries

## Overview

**Creative North Star: "The Guide Library"**

A shelf of well-made technical guides. Each family of boundaries is a flat colour with its own fine geometric line art, sitting on a cool pale ground under deep navy type. Indigo is the one colour that means "act". Code sits in navy panels, and small labels use mono, in the manner of the Stripe guides and docs and the opencode docs. The reading column is calm: sans text at a 65 to 75 character measure.

Rejected: serif reading text, hard black rules, red as a state colour, shadows on anything but cards, gradients, glass, emoji, mascots.

**Key Characteristics:**
- Four family colours (cobalt, tangerine, rose, violet) appear only on the landing cards and as fine-line art; page chrome stays navy and indigo.
- Rounded 12px panels (cards, code, tables, diagrams); pills only for the primary button.
- Mono for code and small uppercase labels only.
- Day (mist) and night (deep navy) themes with the same hues.

## Colors

### Primary
- **Indigo** (#5b4cf0, night #8f86ff): links, current page pill, primary button, diagram edges. Contrast on mist 5.9:1.

### Family
- **Cobalt** (#1f62d6) inside a service; **Tangerine** (#ff8a2b) between services; **Rose** (#ff6fa5) across teams; **Violet** (#6f4be0) journeys. White type on cobalt and violet, navy on tangerine and rose.

### Neutral
- **Ink Navy** (#0b1f3a) text on **Mist** (#f6f9fc); **Wash** (#e8eef6) tints; **Rule** (#d5deea) hairlines; **Slate** (#52678a) secondary text.
- Night: **Night** (#0a1628) ground, **Night Surface** (#101f36), **Night Rule** (#243652), **Night Text** (#eaf1fb).
- **Code Panel** (#0f1b33) in both themes.

### Named Rules
**The One Action Rule.** Indigo means link, current location or primary action. Family colours never mark state.

## Typography

**Display, UI and Body:** Figtree (variable, self-hosted). **Code and labels:** JetBrains Mono (variable).

### Hierarchy
- **Display** (700, clamp 2.25-3.25rem, 1.12, -0.03em): page titles.
- **Cover** (700, clamp 2.25-3.75rem, 1.05): landing statement.
- **Headline** (700, 1.75rem, -0.02em): h2.
- **Body** (400, 1.0625rem, 1.7): reading column, 46rem wide.
- **Label** (mono 600, 0.75rem, +0.08em, uppercase): sidebar groups, "On this page".
- **Code** (mono, 0.875rem).

### Named Rules
**The Mono Is For Machines Rule.** Mono only for code and tiny labels; never headings or running text.

## Layout

Sidebar 17.5rem, reading column 46rem, contents rail on the right. The landing cover is two columns: statement and actions left, a staggered 2x2 of family cards right (every second card offset 3rem); it stacks on narrow screens. Cards sit on a 1rem gap.

## Elevation & Depth

Flat pages; only the family cards lift (two-layer navy shadow, deeper on hover with a 4px rise, disabled under reduced motion). Everything else uses 1px rules and tints.

## Shapes

Radius 12px for panels, 8px for nav pills and controls, 6px for inline code, pill for the primary button. Line art is strokes only, 1px, from circles, squares, arcs and stairs.

## Components

### Navigation
Mono uppercase group labels in slate; links 500; the current page is a soft indigo pill with indigo text. Header carries four mono section links (Patterns, Journeys, Reference, For AI).

### Code blocks
Navy panel, 12px radius, github-dark-dimmed syntax, filename tab.

### Tables and diagrams
Tables: 1px frame, wash header, tabular numerals. Diagrams: always a light panel (#f6f9fc) with navy ink and indigo edges, in both themes, so authored pale fills stay legible.

## Do's and Don'ts

### Do
- Give each new family a colour from the four-colour family set plus its own line art.
- Use indigo for the one thing the reader can do next.

### Don't
- No red, no black rules, no shadows on non-cards, no gradient or glass, no serif body.
- Don't put white text on tangerine or rose.
