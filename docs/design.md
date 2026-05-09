# Projects

## Mission
Create implementation-ready, token-driven UI guidance for Projects that is optimized for consistency, accessibility, and fast delivery across dashboard web app.

## Brand
- Product/brand: Projects
- URL: https://linear.app/romanlinear/projects/all
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Inter Variable`, `font.family.stack=Inter Variable, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, Linear Thai, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=13px`, `font.size.md=13.33px`, `font.size.lg=16px`
- Color palette: `color.text.primary=lch(100 0 272)`, `color.text.secondary=#ffffff`, `color.text.tertiary=lch(90.35 1.15 272)`, `color.text.inverse=lch(90.077 1 272)`, `color.surface.base=#000000`, `color.surface.muted=lch(10.691 0.493 272)`, `color.surface.raised=lch(4.52 0.3 272)`, `color.surface.strong=lch(9.02 0.45 272)`
- Spacing scale: `space.1=1px`, `space.2=2px`, `space.3=3px`, `space.4=4px`, `space.5=6px`, `space.6=7px`, `space.7=8px`, `space.8=10px`
- Radius/shadow/motion tokens: `radius.xs=5px`, `radius.sm=8px`, `radius.md=10px`, `radius.lg=12px`, `radius.xl=50px`, `radius.2xl=9999px` | `shadow.1=lch(0 0 0 / 0.04) 0px 4px 4px -1px, lch(0 0 0 / 0.08) 0px 1px 1px 0px` | `motion.duration.instant=50ms`, `motion.duration.fast=150ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: buttons (48), links (14), inputs (2), navigation (2), lists (2).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
