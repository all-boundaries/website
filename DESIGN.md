---
name: All Boundaries
description: A technical guide library: cool mist ground, deep navy ink, one indigo for action, four flat family colours carrying fine line art, navy code panels.
colors:
  ink-pine: "#12231e"
  chalk: "#f4f6f1"
  signal: "#c73a12"
  signal-deep: "#a92e0b"
  pine: "#0e6b4f"
  survey-yellow: "#f2c200"
  coal: "#1b2b26"
  sky: "#8ccbea"
  rule: "#d3dbd3"
  wash: "#e6ebe4"
  slate: "#566b62"
  night: "#0d1512"
  night-surface: "#15201c"
  night-rule: "#26362f"
  night-text: "#e9efe9"
  night-signal: "#ff8a63"
  code-panel: "#0f1a16"
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
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.signal-deep}"
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

A shelf of well-made technical guides, coloured like survey markings: each family of boundaries is a flat paint colour (pine, survey yellow, coal, sky) with its own fine geometric line art, on a chalk ground under pine-black type. Signal vermilion, the colour of a survey flag, is the one colour that means "act". Code sits in pine-black panels and small labels use mono. Structure follows the Stripe guides and docs and the opencode docs; the palette is deliberately not theirs. The reading column is calm: sans text at a 65 to 75 character measure.

Rejected: navy and indigo, pastel rainbow cards, serif reading text, hard black rules, shadows on anything but cards, gradients, glass, emoji, mascots.

**Key Characteristics:**
- Four family colours (pine, survey yellow, coal, sky) appear only on the landing cards and as fine-line art; page chrome stays pine-black and vermilion.
- Rounded 12px panels (cards, code, tables, diagrams); pills only for the primary button.
- Mono for code and small uppercase labels only.
- Day (chalk) and night (pine-black) themes.

## Colors

### Primary
- **Signal Vermilion** (#c73a12, night #ff8a63): links, current-page pill, primary button, selection. Contrast on chalk 5.0:1.

### Family
- **Pine** (#0e6b4f) inside a service; **Survey Yellow** (#f2c200) between services; **Coal** (#1b2b26) across teams; **Sky** (#8ccbea) journeys. White type on pine and coal, ink on yellow and sky. Diagram edges use pine.

### Neutral
- **Ink Pine** (#12231e) text on **Chalk** (#f4f6f1); **Wash** (#e6ebe4) tints; **Rule** (#d3dbd3) hairlines; **Slate** (#566b62) secondary text.
- Night: **Night** (#0d1512) ground, **Night Surface** (#15201c), **Night Rule** (#26362f), **Night Text** (#e9efe9).
- **Code Panel** (#0f1a16) in both themes.

### Named Rules
**The One Action Rule.** Vermilion means link, current location or primary action. Family colours never mark state.

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

Flat pages; only the family cards lift (two-layer pine-black shadow, deeper on hover with a 4px rise, disabled under reduced motion). Everything else uses 1px rules and tints.

## Shapes

Radius 12px for panels, 8px for nav pills and controls, 6px for inline code, pill for the primary button. Line art is strokes only, 1px, from circles, squares, arcs and stairs.

## Components

### Navigation
Mono uppercase group labels in slate; links 500; the current page is a soft vermilion-tint pill with vermilion text. Header carries four mono section links (Patterns, Journeys, Reference, For AI).

### Code blocks
Pine-black panel, 12px radius, github-dark-dimmed syntax, filename tab.

### Tables and diagrams
Tables: 1px frame, wash header, tabular numerals. Diagrams: always a light panel (#f4f6f1) with pine-black ink and pine edges, in both themes, so authored pale fills stay legible.

## Do's and Don'ts

### Do
- Give each new family a survey colour plus its own line art.
- Use vermilion for the one thing the reader can do next.

### Don't
- No navy or indigo, no black rules, no shadows on non-cards, no gradient or glass, no serif body.
- Don't put white text on survey yellow or sky.
