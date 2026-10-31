---
name: All Boundaries
description: A Swiss-grid pattern catalogue; one visible module grid, black ink, one signal red marking the current selection.
colors:
  ink: "#111111"
  poster-white: "#fafaf8"
  signal-red: "#e10600"
  red-text-light: "#b00500"
  graphite: "#55544f"
  rule-grey: "#cfcdc6"
  tint-grey: "#ebe9e3"
  poster-black: "#0f0f0e"
  bone: "#f4f2ec"
  ash: "#a3a19b"
  night-rule: "#3a3a39"
  code-ground: "#111111"
typography:
  display:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  cover:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    letterSpacing: "0.04em"
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, Menlo, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.6
rounded:
  none: "0"
spacing:
  module: "6.25rem"
  sidebar: "18.75rem"
  column: "43.75rem"
components:
  nav-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  code-block:
    backgroundColor: "{colors.code-ground}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
---

# Design System: All Boundaries

## Overview

**Creative North Star: "The Poster Wall"**

One module grid disciplines every page, the way one grid disciplines a series of Swiss concert posters. The catalogue spans a function and an organisation, and reads as one calm intelligence because the same ruled, flat, grotesque language holds at every scale. Sections differ by geometric motif, never by layout.

The frame is where the world speaks: a heavy top rule, an uppercase wordmark with a red bar, a typographic rail, large flush-left titles, and a toggle that reveals the grid itself. The reading column is calm: a serif at a 60 to 75 character measure on a flat ground.

Rejected: soft cards, rounded corners, shadows, gradients, mascots, decorative illustration, accent colour scattered over the page.

**Key Characteristics:**
- Visible 6.25rem module grid (header "Grid" toggle); the sidebar is 3 modules, the column 7.
- Black ink on unprinted white, or bone on poster black; red marks the current selection only.
- Heavy 3px rules, flat geometry (squares, bars, quarter-circle) as the only imagery.
- Controls are typographic: state moves a red bar, not a colour wash.

## Colors

Restrained: neutrals carry the page, one saturated red carries state.

### Primary
- **Signal Red** (#e10600): the current page in the sidebar and contents, link underlines, the wordmark bar, the red element in each geometric motif, selection. Never a surface or large text fill except the hero mark and hover fills.

### Neutral
- **Ink** (#111111) and **Poster White** (#fafaf8): light theme text and ground. Code blocks stay ink.
- **Bone** (#f4f2ec) and **Poster Black** (#0f0f0e): dark theme text and ground.
- **Graphite** (#55544f) and **Ash** (#a3a19b): secondary text. **Rule Grey** (#cfcdc6) and **Night Rule** (#3a3a39): hairlines.

### Named Rules
**The One Signal Rule.** Red appears only where the reader is, what they can act on, or the single red element of a motif. If red is decorating, remove it.

## Typography

**Display and UI Font:** Hanken Grotesk (variable, self-hosted via Fontsource)
**Body Font:** Source Serif 4 (variable)
**Code Font:** JetBrains Mono (variable)

**Character:** a neutral grotesque set heavy and tight for titles and wayfinding, a quiet text serif for sustained reading.

### Hierarchy
- **Display** (800, clamp 2.75-4.75rem, 1.05, -0.035em): page titles, flush left, balanced.
- **Cover** (800, clamp 2.75-6rem, 0.98): the landing statement.
- **Headline** (800, 2rem, -0.02em): h2 under a 3px ink rule.
- **Body** (400 serif, 1.125rem, 1.65): reading column, about 74 characters at 43.75rem.
- **Label** (800, 0.8125rem, +0.04em, uppercase): sidebar group titles, wordmark, "On this page".
- **Code** (JetBrains Mono, 0.875rem): code only.

### Named Rules
**The Grotesque-Heads Rule.** Titles and UI are always the grotesque; prose is always the serif; mono is only code.

## Layout

A 6.25rem module. Sidebar 3 modules, a one-module margin, a 7-module reading column starting on module 4 (400px at 1440), contents rail on the right with the family motif above it. Below 72rem Starlight's single-column layout takes over and the column is fluid. The landing cover is a free grid up to 75rem with a large mark on the right.

## Elevation & Depth

Flat. No shadows. Depth is conveyed by 3px ink rules, 1px hairlines, and the black code block.

### Named Rules
**The Flat Rule.** No shadows, no blur, no rounded corners anywhere.

## Shapes

Right angles only (radius 0). The only forms are squares, bars and one quarter-circle. Each family owns a construction: inside a service = nested squares with a red core; between services = two squares joined by a red bar; across teams = a quarter-circle with a red square. The brand mark is an outlined square crossed by a red square.

## Components

### Navigation
Uppercase 800 group labels; links 600; the current page is bold ink with a 4px red bar under the label. Contents rail uses a 3px red bar the same way.

### Links in prose
Ink with a 3px red underline; on hover the underline fills to a red block with white text.

### Code blocks
Ink ground (#111), min-dark syntax theme, 1px night rule border, no radius, filename tab, no shadow.

### Tables
No verticals; a 3px ink rule under the header, 1px hairlines between rows; grotesque, tabular numerals.

### Diagrams
Mermaid rendered at build time to inline SVG using the page's colour variables: ink strokes 2px, ground fill, no colour; type is Arial/Helvetica so labels fit their measured boxes.

## Do's and Don'ts

### Do
- Align new structure to the module; check with the Grid toggle.
- Mark state with a red bar, not fill or colour.
- Give each new family or section a single flat geometric motif.

### Don't
- No rounded corners, shadows, gradients, glass, icons-as-decoration, or emoji.
- No coloured left borders; no eyebrows above headings; no section numbers in headings.
- Don't put mono or serif in headings or UI.
