**You:**

give me a technical overview / write up of the styling and layout of the linear web / mobile app so i can recreate how it looks and feels, here's a link to their landing page: https://linear.app/

* * *

**ChatGPT:**

If you want to recreate the feel of [Linear](https://linear.app?utm_source=chatgpt.com), the key is understanding that the product is not just “minimal dark UI.” It’s a very disciplined system built around:

* extreme visual restraint
* ultra-fast perceived performance
* subtle depth and motion
* strong typography hierarchy
* desktop-native interaction patterns
* dense but calm information layouts

Their interface feels premium because almost nothing is loud.

* * *

# 1. Core Design Philosophy

Linear’s UI philosophy is:

> “Make complex workflows feel effortless.”

Everything in the UI supports:

* speed
* focus
* reduced cognitive load
* keyboard-first workflows
* low visual friction

Their designers explicitly talk about optimizing for how the interface _feels after minutes of use_, not just screenshots. [Linear+1](https://linear.app/now/how-we-redesigned-the-linear-ui?utm_source=chatgpt.com)

The result:

* very low contrast surfaces
* tiny spacing adjustments
* almost invisible borders
* restrained color usage
* subtle motion everywhere

* * *

# 2. Overall Visual Style

## The “Linear look”

### Characteristics

* dark-first UI
* charcoal/near-black surfaces
* muted grays
* soft borders
* thin separators
* floating panels
* subtle blur
* crisp typography
* tiny radii
* low saturation
* occasional indigo/purple accent

The UI is:

* more “precision engineering”
* less “marketing website”

* * *

# 3. Color System

The biggest Linear misconception:

> They do NOT use pure black.

They use layered charcoal tones.

Typical palette:

| Token | Approx |
| --- | --- |
| Background | `#08090A` |
| Surface | `#111113` |
| Elevated Surface | `#18181B` |
| Border | `rgba(255,255,255,0.06)` |
| Primary Text | `#F7F8F8` |
| Secondary Text | `rgba(255,255,255,0.65)` |
| Muted Text | `rgba(255,255,255,0.42)` |
| Accent | `#5E6AD2` |

This is critical.

The hierarchy comes from:

* luminance
* opacity
* layering

NOT bright colors. [Awesome Design MD Gallery+2oh-my-design+2](https://design.hagicode.com/fr-FR/designs/linear.app/?utm_source=chatgpt.com)

* * *

# 4. Typography

Typography does most of the work.

## Font

Primarily:

* Inter Variable

Sometimes:

* Neue Montreal for marketing headlines

## Styling

* medium weights everywhere
* very tight line-heights
* strong optical alignment
* subtle tracking adjustments

Typical scale:

| Usage | Size |
| --- | --- |
| Hero | 56–72px |
| Page Title | 24–32px |
| Section Header | 18–20px |
| Body | 14px |
| Dense UI | 12–13px |

Linear uses:

* unusually refined font weights
* lots of 510–590 variable font values
* almost no giant bold text [oh-my-design+1](https://oh-my-design.kr/design-systems/linear.app?utm_source=chatgpt.com)

* * *

# 5. Spacing System

Everything is built on:

* 4px grid
* dense spacing

Typical spacing:

* 4
* 8
* 12
* 16
* 24
* 32

Rows are compact:

* 32–36px tall

Panels:

* 12–16px padding

This density is a huge part of the “professional tool” feel. [AgentSkills+1](https://agentskills.so/skills/ihlamury-design-skills-linear-ui-skills?utm_source=chatgpt.com)

* * *

# 6. Borders & Elevation

Linear avoids heavy shadows.

Instead:

* ultra subtle borders
* layered surfaces
* tiny brightness differences

Example:

```CSS
border: 1px solid rgba(255,255,255,0.06);
```

Cards often differ from the background by:

* only 2–4% brightness

This creates:

* calm depth
* less visual noise

* * *

# 7. Layout Structure (Web App)

The app layout is extremely structured.

## Typical Structure

```
--------------------------------
 Top Bar / Command Layer
--------------------------------
 Sidebar | Main Content | Inspector
--------------------------------
```

### Sidebar

* fixed width (~240px)
* ultra dense
* monochrome
* tiny labels
* subtle active state

### Main Area

* flexible
* list/board/timeline
* layered headers

### Inspector Panel

* right side metadata panel
* contextual editing
* collapsible

Linear heavily relies on:

* split panes
* nested layouts
* contextual side panels [Linear+1](https://linear.app/now/how-we-redesigned-the-linear-ui?utm_source=chatgpt.com)

* * *

# 8. Mobile Layout Philosophy

The mobile app feels:

* native
* compressed
* gesture-first
* highly animated

## Mobile Characteristics

### Bottom Nav

* floating feel
* blurred/translucent
* low-height
* icon-first

### Cards

* edge-to-edge
* minimal padding
* stacked information

### Navigation

* modal layers
* slide transitions
* contextual panels

The mobile app prioritizes:

* continuity
* velocity
* spatial transitions

* * *

# 9. Motion & Animation

This is probably the MOST important part.

Linear’s UI without motion:

* feels average

With motion:

* feels magical

## Animation Principles

### Fast

Usually:

* 120ms–220ms

### Physics-based

* spring animations
* soft easing
* momentum

### Minimal Distance

Things barely move.

### Motion Communicates State

Not decoration. [Reddit+1](https://www.reddit.com/r/UI_Design/comments/1rpkdpd/micro_interactions_design_that_doesnt_feel/?utm_source=chatgpt.com)

* * *

## Typical Motions

### Hover

* slight surface brighten
* subtle lift
* border glow

### Page Transitions

* fade + translateY(2px)
* never dramatic

### Modals

* scale from 0.98 → 1
* opacity fade

### Sidebar

* smooth width interpolation
* icon alignment preservation

### Lists

* staggered but subtle

* * *

# 10. Interaction Design

Linear feels amazing because:

* interactions are immediate
* latency is hidden

## Key Principles

### Optimistic UI

Changes happen instantly.

### Keyboard-first

Everything has shortcuts.

### Minimal Confirmation

Few dialogs.

### Inline Editing

Almost no separate pages.

### Context Preservation

Panels open instead of navigation resets.

* * *

# 11. Landing Page Structure

Their landing page follows a very specific modern dev-tool formula.

## Layout

### Hero

* centered copy
* massive product preview
* subtle gradients
* floating layers

### Feature Sections

Alternating:

* left text
* right motion demo

### Product Visuals

Always:

* dark
* layered
* animated
* realistic UI

### Sticky Navigation

Thin translucent nav.

### Motion

Scroll-triggered:

* fade-ins
* layered parallax
* soft scaling
* subtle glow shifts

* * *

# 12. The “Linear Feel”

To truly recreate it:

## DO:

* reduce visual noise
* use opacity instead of color
* use layered charcoal surfaces
* keep motion subtle
* prioritize typography
* compress spacing
* use tiny radii (8–12px)
* keep shadows weak
* make everything feel instant

## DON’T:

* use strong gradients everywhere
* use large shadows
* overuse glassmorphism
* use saturated colors
* make animations slow
* create giant padding
* use thick borders

* * *

# 13. Technical Stack To Recreate It

## Frontend

Usually easiest with:

* React
* Tailwind
* Framer Motion

## Helpful Libraries

* Radix UI
* shadcn/ui
* Motion One or Framer Motion
* CMDK
* Vaul (mobile drawers)

## CSS Techniques

* backdrop-filter
* layered opacity
* transform-based animations
* spring easing
* subtle blur
* GPU transforms

* * *

# 14. Suggested Tailwind Foundations

Example foundations:

```JavaScript
colors: {
  background: "#08090A",
  surface: "#111113",
  elevated: "#18181B",
  border: "rgba(255,255,255,0.06)",
  text: "#F7F8F8",
  muted: "rgba(255,255,255,0.65)",
  accent: "#5E6AD2",
}
```

Typography:

```CSS
font-family: InterVariable;
font-feature-settings: "cv01", "ss03";
```

Radii:

```CSS
border-radius: 10px;
```

* * *

# 15. The Secret Sauce

The real reason Linear feels premium:

## Consistency

Every single component:

* moves similarly
* uses the same spacing rhythm
* uses the same opacity hierarchy
* follows the same motion physics

Nothing feels isolated.

That consistency creates:

* trust
* speed
* perceived quality

* * *

# 16. Best References Beyond Linear

If you want more references in the same design family:

* [Vercel](https://vercel.com?utm_source=chatgpt.com)
* [Raycast](https://raycast.com?utm_source=chatgpt.com)
* [Superhuman](https://superhuman.com?utm_source=chatgpt.com)
* [Arc Browser](https://arc.net?utm_source=chatgpt.com)
* [Retool](https://retool.com?utm_source=chatgpt.com)
* [Cron Calendar](https://cron.com?utm_source=chatgpt.com)

They all share:

* calm density
* refined motion
* developer-tool aesthetics

* * *

A useful next step would be:

* a full Linear-inspired design token system
* Tailwind theme config
* motion spec sheet
* React component architecture
* layout breakdowns for desktop/mobile
* exact animation timings/easings
* a “how to build Linear UI from scratch” engineering guide

I can also break down:

* the Linear sidebar
* issue cards
* mobile nav
* command palette
* typography system
* animation system
* their landing page sections
* their dark mode token architecture
* how to build this in Tailwind + Framer Motion.