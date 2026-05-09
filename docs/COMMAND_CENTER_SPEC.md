# Meridian - UI Overhaul Spec
## Linear-Inspired Workspace Redesign v2.0
### This document replaces the previous visual direction. Hand it to the implementation agent as the source of truth for redesigning Meridian's interface.

---

## 0. Agent Directive

You are redesigning the existing Meridian frontend, not rebuilding the product from scratch.

Meridian already has the core product architecture:
- three primary work surfaces: Files, Editor, Chat
- Convex-backed file lifecycle and sync logic
- AI chat and inline diff review workflow
- offline support and mobile tab flow

Your job is to make the product feel like a polished, Linear-inspired operator workspace while preserving its current behavior.

Core constraints:
- Optimize for speed of thought and low cognitive load.
- Preserve current information architecture unless this document explicitly changes it.
- Preserve the existing backend, data model, and AI workflow.
- Prefer tokenization and reuse over one-off styling.
- Keep the app dark-first and keyboard-first.
- Do not introduce a large component library or unnecessary abstractions.
- Ask before changing the data model, the editor engine, or the product's core navigation model.

---

## 1. Scope

This overhaul changes:
- visual language
- layout density and spacing rhythm
- typography
- color system and elevation model
- motion and transitions
- component hierarchy and chrome
- mobile presentation
- empty states, loading, error, and feedback styling

This overhaul does not change:
- Convex schema
- file lifecycle states
- file, chat, sync, or auth business logic
- AI routing and streaming architecture
- the three-surface workspace model: Files, Editor, Chat

The implementation agent should treat this as a design-system and UX overhaul, not a product rewrite.

---

## 2. Design Intent

Meridian should feel like a serious command surface, not a themed markdown app.

The new UI must feel:
- calm
- dense
- immediate
- precise
- low-noise
- desktop-native on large screens
- native-like and continuous on mobile

The target reference is the Linear product UI, not the Linear marketing site.

Translate that direction into Meridian by keeping the current workspace model while making every surface more structured, more restrained, and more consistent.

From the old direction to the new direction:

| Replace | With |
|---|---|
| Obsidian-like dark theme | layered charcoal surfaces |
| bright purple used everywhere | muted indigo accent used sparingly |
| full-bleed flat panes | structured workspace shell with subtle depth |
| hardcoded one-off colors | semantic tokens |
| loud diff colors | softer review tinting with precise signals |
| generic mobile tab strip | floating, native-feeling mobile navigation |
| utility-first placeholder chrome | deliberate product-grade chrome |
| editor-as-code aesthetic | content-first, operator-grade workspace aesthetic |

---

## 3. Assumptions

- Dark mode only remains correct.
- The three-pane desktop layout remains the primary mode.
- Mobile still uses Files, Editor, and Chat, but the navigation should feel closer to a floating native control bar than a basic tab strip.
- Meridian branding may remain in the name and mark, but the interface language should follow Linear's density and restraint.
- The accent color should move from bright violet toward a quieter indigo-violet range closer to Linear.

---

## 4. Existing UI Surfaces To Overhaul

The redesign should map directly onto the current frontend structure.

| File or surface | Current role | Overhaul goal |
|---|---|---|
| `src/index.css` and `src/App.css` | global styling and legacy variables | replace with a tokenized dark system and global interaction rules |
| `src/App.tsx` | app root | ensure the app shell, global background, and top-level theme scaffolding match the new system |
| `src/components/layout/Workspace.tsx` | desktop and mobile layout coordinator | turn the workspace into a structured shell with a command layer, refined pane sizing, and better responsive transitions |
| `src/components/layout/Sidebar.tsx` | left navigation pane | make it feel like a dense, premium navigation rail instead of a flat panel |
| `src/components/sidebar/*` | file tree, search, folder groups, new file button | redesign rows, section headers, counts, search trigger, and actions using Linear-like hierarchy |
| `src/components/layout/EditorPane.tsx` | main editing surface | add refined document chrome, metadata hierarchy, and review-state containment |
| `src/components/editor/*` | editor banners, status, diff controls | redesign to feel like a restrained review system rather than bright patch UI |
| `src/components/layout/ChatPane.tsx` | right-side assistant surface | make it feel like a contextual inspector instead of a separate chat app |
| `src/components/chat/*` | chat messages, input, agent selector, quick actions | reduce visual noise, dock the composer, and structure actions like productivity software |
| `src/components/shared/*` | status pills, offline banner, shortcuts | make shared primitives coherent, subtle, and accessible |
| `src/lib/codemirror/theme.ts` | editor visual system | shift the editor from a dev-heavy mono aesthetic to a content-first document aesthetic |

The redesign must preserve the existing surface map so another agent can implement the change without moving the product's core structure.

---

## 5. Non-Negotiable Experience Rules

- No pure black surfaces.
- No oversized shadows.
- No saturated color blocks as default UI backgrounds.
- No decorative gradients inside core work surfaces.
- No emoji-based navigation icons.
- No giant radii or oversized padding.
- No hidden focus states.
- No one-off text sizes or spacing exceptions.
- No component should rely on color alone to convey status.
- Every interactive surface must define default, hover, focus-visible, active, disabled, loading, and error states.
- The UI must remain usable at dense desktop text sizing.
- Perceived latency should be masked with immediate state feedback instead of waiting on spinners wherever possible.

---

## 6. Design Tokens And Foundations

This redesign must be implemented with semantic tokens first. Component guidance below should reference tokens, not raw hex values.

### 6.1 Color System

The color model must use layered charcoal surfaces. The product should never feel black-on-black or neon.

Suggested token set:

| Token | Suggested value | Usage |
|---|---|---|
| `color.surface.app` | `#08090A` | outer app background |
| `color.surface.canvas` | `#0D0E10` | workspace shell backdrop |
| `color.surface.panel` | `#111113` | default pane surface |
| `color.surface.panelRaised` | `#18181B` | inputs, popovers, floating nav, selected cards |
| `color.surface.panelHover` | `rgba(255,255,255,0.04)` | hover fill |
| `color.surface.panelActive` | `rgba(255,255,255,0.06)` | pressed or toggled surfaces |
| `color.surface.input` | `#141518` | text inputs and composer fields |
| `color.surface.overlay` | `rgba(8,9,10,0.72)` | overlays and modal scrims |
| `color.border.subtle` | `rgba(255,255,255,0.06)` | default borders and separators |
| `color.border.strong` | `rgba(255,255,255,0.10)` | focused or elevated separators |
| `color.text.primary` | `#F7F8F8` | primary readable content |
| `color.text.secondary` | `rgba(255,255,255,0.68)` | supporting text |
| `color.text.tertiary` | `rgba(255,255,255,0.45)` | metadata and low-priority labels |
| `color.text.disabled` | `rgba(255,255,255,0.28)` | disabled content |
| `color.accent.default` | `#5E6AD2` | active states, focus accents, key actions |
| `color.accent.hover` | `#6B77DD` | hover accent |
| `color.accent.soft` | `rgba(94,106,210,0.14)` | selected rows, pills, focus backgrounds |
| `color.accent.strong` | `rgba(94,106,210,0.22)` | active fills |
| `color.status.success` | `#6FD3A1` | success text and indicators |
| `color.status.successSoft` | `rgba(111,211,161,0.14)` | success background |
| `color.status.warning` | `#E0B15A` | warning text and indicators |
| `color.status.warningSoft` | `rgba(224,177,90,0.14)` | warning background |
| `color.status.danger` | `#E07A8A` | danger text and indicators |
| `color.status.dangerSoft` | `rgba(224,122,138,0.14)` | danger background |
| `color.focus.ring` | `rgba(120,136,255,0.55)` | keyboard focus ring |

Rules:
- Accent color must be used sparingly.
- Headings must not be purple by default.
- Success, warning, and danger colors must appear as restrained signals, not loud badges.
- Borders should do more hierarchy work than shadows.

### 6.2 Typography

Typography must do most of the hierarchy work.

Foundations:
- Primary font: Inter Variable
- Chrome text should live mostly between 12px and 14px.
- Document title and key section titles should use weight and spacing, not color, to stand out.
- Use medium or semibold weight selectively; do not flood the UI with bold text.

Suggested type scale:

| Token | Size | Typical usage |
|---|---|---|
| `font.size.xs` | 12px | metadata, pills, shortcut hints |
| `font.size.sm` | 13px | default dense UI text |
| `font.size.md` | 14px | body text, chat content, document body |
| `font.size.lg` | 16px | section titles and prominent controls |
| `font.size.xl` | 20px | document title area |
| `font.size.2xl` | 24px | rare large headers |

Suggested weight usage:
- 400 for default content
- 450 to 500 for labels and active rows
- 550 to 600 for section headers and selected document title

Editor typography rule:
- Product chrome must use Inter Variable.
- The markdown editor should feel content-first, not code-first.
- Use a proportional reading font for standard markdown text.
- Reserve monospace for code blocks, inline code, slugs, timestamps, and keyboard hints.

### 6.3 Spacing And Density

Use a 4px base grid with dense spacing.

Suggested spacing tokens:

| Token | Size |
|---|---|
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 20px |
| `space.6` | 24px |
| `space.7` | 32px |

Density rules:
- Desktop list rows should generally be 32px to 36px tall.
- Desktop input controls should generally be 32px to 36px tall.
- Mobile touch targets must be at least 40px to 44px tall.
- Panel padding should generally sit in the 12px to 16px range.

### 6.4 Radius

Use small radii only.

| Token | Size | Usage |
|---|---|---|
| `radius.xs` | 5px | tight pills and inline chips |
| `radius.sm` | 8px | inputs, small cards |
| `radius.md` | 10px | panels and composer surfaces |
| `radius.lg` | 12px | overlays and mobile nav |
| `radius.full` | 9999px | floating pills and nav capsules |

### 6.5 Elevation And Borders

Linear-like depth should come from subtle layering, not shadow spectacle.

Rules:
- Use 1px separators and panel outlines as the primary depth mechanism.
- Use shadow only for overlays, popovers, and floating mobile navigation.
- Surface brightness shifts should usually be more subtle than color shifts.

### 6.6 Motion

Motion must feel fast, controlled, and almost invisible.

Suggested motion tokens:

| Token | Duration | Use |
|---|---|---|
| `motion.instant` | 50ms | state swaps and opacity changes |
| `motion.fast` | 140ms | hover, active, focus transitions |
| `motion.normal` | 180ms | panel swaps, mobile tab transitions |
| `motion.emphasis` | 220ms | overlays, sheets, command surfaces |

Rules:
- Most movement should be 2px to 4px at most.
- Prefer fade, slight translate, and slight scale over large sliding motion.
- Streaming and loading states should feel alive but not busy.
- Respect reduced motion preferences.

### 6.7 Icons And Ornamentation

Rules:
- Replace emoji icons with 16px or 18px line icons.
- Use one icon family consistently.
- Decorative gradients should be limited to very subtle shell atmosphere, not component fills.
- Do not use large glow effects.

### 6.8 Global Interaction Rules

All interactive components must define the following states:

| State | Required behavior |
|---|---|
| default | quiet surface, strong hierarchy, no unnecessary chrome |
| hover | slightly brighter surface or border, never dramatic lift |
| focus-visible | visible ring and/or accent outline, keyboard-only |
| active | slightly darker or stronger fill, immediate response |
| disabled | reduced contrast, no hover response, still legible |
| loading | preserve layout, show skeleton or inline progress without jumping |
| error | use restrained danger signal plus explanatory text when relevant |

---

## 7. Layout Architecture

### 7.1 Desktop Shell

The current three-pane workspace remains, but it must sit inside a more deliberate shell.

Required changes:
- Add a slim top command layer above the three panes.
- The top layer should hold the product mark, workspace context, global search or command trigger, and quiet system indicators.
- The full app should use subtle outer insets so the product feels framed, not edge-to-edge raw.
- Pane boundaries should be defined by separators and slight surface contrast differences.

Recommended desktop sizing:
- sidebar: around 240px to 252px
- editor: flexible, largest surface
- chat inspector: around 360px to 392px

The editor should remain the visual center of gravity.

### 7.2 Mobile Shell

Mobile must stop feeling like a direct desktop collapse.

Required changes:
- Keep the Files, Editor, and Chat navigation model.
- Replace the current flat tab strip with a floating, inset bottom navigation control.
- Add a compact top context bar showing current file or workspace state.
- Use sheet-like transitions between modes.
- Keep the active compose area reachable above the keyboard.

---

## 8. Component-Level Rules

Each component below must be redesigned to align with the token system and interaction rules above.

### 8.1 Workspace Shell

Applies to:
- `src/components/layout/Workspace.tsx`

Anatomy:
- top command layer
- left navigation pane
- center editor pane
- right assistant pane
- modal and overlay layer for shortcuts, search, and mobile surfaces

Rules:
- The workspace must feel like one coherent operating surface, not three unrelated panels.
- Background contrast between shell and panes should be subtle but visible.
- The command layer should be compact and always useful, not decorative.
- Keyboard shortcut overlay should inherit the same panel language as command search.

### 8.2 Sidebar And File Tree

Applies to:
- `src/components/layout/Sidebar.tsx`
- `src/components/sidebar/FileTree.tsx`
- `src/components/sidebar/FileItem.tsx`
- `src/components/sidebar/FolderGroup.tsx`
- `src/components/sidebar/NewFileButton.tsx`
- `src/components/sidebar/SearchBar.tsx`

Design intent:
The sidebar should feel like a dense productivity navigation system, not a generic file browser.

Anatomy:
- product or workspace label
- command-search trigger
- grouped folders with counts
- file rows with selection and metadata
- pinned or priority items near the top if supported
- bottom utility action for new file creation

Rules:
- Section headers must be visually quiet and compact.
- File rows must be short, dense, and easy to scan.
- Active file rows must use `color.accent.soft` with stronger text, not a loud solid fill.
- Hover states must be understated but clear.
- File status indicators must be small and integrated into the row, not large badges.
- Search should look like a command trigger with a shortcut hint, not a consumer search bar.
- The new file action should look secondary but always available.
- Replace emoji folder icons with consistent line icons.

File row states:
- default: transparent row, secondary text for metadata
- hover: `color.surface.panelHover`
- focus-visible: ring or outline using `color.focus.ring`
- active: `color.accent.soft`, primary text, subtle left indicator or icon tint
- disabled: muted text, no hover lift
- loading: skeleton rows with preserved height
- error: danger icon or retry affordance without breaking row height

Edge cases:
- Very long file names must truncate cleanly.
- Empty folders must show a concise zero-state label.
- Search results must preserve selection visibility and keyboard navigation.

### 8.3 Editor Pane

Applies to:
- `src/components/layout/EditorPane.tsx`
- `src/components/editor/MarkdownEditor.tsx`
- `src/components/editor/PromptBanner.tsx`
- `src/components/editor/StatusBadge.tsx`
- `src/lib/codemirror/theme.ts`

Design intent:
The editor should feel like the calm center of the product. It must read like a document surface, not a code IDE.

Required changes:
- Introduce a refined editor header with file title, location context, and status metadata.
- Reduce decorative accent usage inside markdown content.
- Move markdown hierarchy toward weight, spacing, and contrast rather than purple heading colors.
- Reconsider always-on line numbers. If retained, they must be visually recessive.
- Use subtle active-line and selection treatments.
- Ensure the empty editor state feels premium and instructive.

Prompt banner rules:
- Prompt files must still have a warning banner.
- The banner should be slimmer, quieter, and more integrated into the pane chrome.
- It should communicate risk without feeling like an emergency alert.

Status badge rules:
- Status badges must be compact, muted, and system-like.
- Use soft fills and tiny icons or dots, not candy colors.

### 8.4 Diff Review System

Applies to:
- `src/components/editor/DiffActionBar.tsx`
- diff decorations in CodeMirror
- any future inline review controls

Design intent:
Diff review should feel like document review, not git patch theater.

Rules:
- Keep additions and removals visible, but soften the fills.
- Use low-opacity tinted backgrounds with precise edge indicators.
- The review action bar should read as a structured toolbar, not a bright alert strip.
- The current review state should be obvious even when color perception is limited.
- Accept, reject, and review-next actions must feel like part of the same control family.

Visual rules:
- addition state: restrained success tint plus clean edge marker
- removal state: restrained danger tint plus clean edge marker
- counts should use muted text with one high-clarity emphasis point
- active review focus should scroll the editor cleanly without jumpy motion

Edge cases:
- large diffs must not flood the pane with saturated color
- diff controls must remain usable on narrow screens
- if no diff is active, no review chrome should remain visible

### 8.5 Chat Pane

Applies to:
- `src/components/layout/ChatPane.tsx`
- `src/components/chat/ChatWindow.tsx`
- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/components/chat/AgentSelector.tsx`
- `src/components/chat/QuickActions.tsx`

Design intent:
The chat pane should feel like a contextual inspector and assistant console, not a consumer messenger.

Anatomy:
- compact header with agent context and file context
- action rail or quiet grouped quick actions
- message stream with restrained hierarchy
- docked composer

Rules:
- User and assistant messages should be visually distinct but subtle.
- Avoid oversized rounded speech bubbles.
- Assistant responses should feel like structured notes or inspector content.
- Streaming state should feel live and polished, not like a blinking placeholder.
- Quick actions must feel operational and secondary, not promotional.
- Agent selection should look like a quiet segmented control or compact menu, not a loud dropdown.

Message styling:
- user messages: slightly raised surface, tighter width, strong text
- assistant messages: flatter surface, more generous rhythm, better markdown readability
- system messages: tertiary text and low-contrast container

Composer rules:
- composer must stay docked to the bottom of the pane
- input must be compact, raised, and calm
- send action must be clear but not visually dominant
- disabled and streaming states must preserve layout and avoid jumpiness

### 8.6 Shared Primitives

Applies to:
- `src/components/shared/StatusPill.tsx`
- `src/components/shared/OfflineBanner.tsx`
- `src/components/shared/KeyboardShortcuts.tsx`

Rules:
- Shared primitives must establish the product's tone for every surface.
- Offline messaging should be narrow and informative, not alarming.
- Shortcut overlay should look like a command reference panel inside the same design system.
- Pills should be small, dense, and quiet.

Offline banner states:
- default offline: warning-toned but restrained
- syncing: tertiary text plus subtle progress cue
- recovered: brief success confirmation without loud celebration
- error: compact retry guidance

### 8.7 Buttons, Inputs, Pills, Tabs, And Menus

All controls must follow one consistent family.

Buttons:
- primary buttons must be rare and reserved for high-consequence actions
- secondary buttons should be the default control style
- ghost buttons should be common for row actions and toolbar actions
- button heights should be compact on desktop and larger on mobile

Inputs:
- inputs must use raised panel surfaces, subtle border definition, and clear caret contrast
- focus state must be visible without glowing neon
- placeholder text must remain legible but clearly secondary

Pills and tabs:
- use quiet fills and precise active states
- avoid oversized capsules and bright fills
- maintain strong keyboard focus treatment

Menus and overlays:
- use raised surfaces, strong borders, subtle shadow, and tight spacing
- opening motion should be fast and low-distance

### 8.8 Keyboard, Pointer, And Touch Behavior

Keyboard behavior:
- File tree navigation must support arrow keys, Enter, Space where appropriate, and visible selection states.
- Search and command surfaces must open and close cleanly with keyboard shortcuts and Escape.
- Diff review controls must remain operable without pointer input.
- Chat input, quick actions, and agent selection must have predictable tab order.

Pointer behavior:
- Hover should reveal hierarchy and affordance, but should never be required to understand state.
- Click targets should generally use full-row hit areas for file items and list actions.
- Pointer interactions should feel immediate and should not depend on long delays or decorative animation.

Touch behavior:
- Touch targets must be larger than desktop targets and must not depend on hover.
- Mobile navigation must stay reachable within thumb range.
- Composer actions, diff actions, and pane switches must remain usable while the software keyboard is open.
- If long-press actions are introduced, they must remain optional and must not hide core actions.

### 8.9 Overflow, Empty, Loading, And Error Handling

Overflow and long-content rules:
- Long file names must truncate in lists and expand in a more spacious active context.
- Long markdown content must wrap cleanly in reading mode and keep code blocks contained.
- Long chat replies must preserve readable line length and spacing.
- Toolbars must collapse secondary actions before wrapping into visually noisy multi-line controls.

Empty-state rules:
- Every empty state should explain the next useful action in one or two lines.
- Empty surfaces must match the same tone and panel language as the rest of the UI.
- Empty states must never rely on large illustrations or decorative filler.

Loading rules:
- Loading states must preserve layout and use skeletons or inline progress cues.
- Streaming states should not cause container resizing or control shifting.

Error rules:
- Errors must be actionable, concise, and close to the failing surface.
- Error styling must use restrained danger tokens and visible text, not color alone.

---

## 9. Mobile Behavior

Mobile must feel intentionally designed, not compressed desktop.

Required rules:
- Bottom navigation should float above the app shell with blur or elevated panel treatment.
- The active tab must use a quiet accent fill and strong label contrast.
- Files view should behave like a compact navigator sheet.
- Editor view should maximize vertical space and reduce redundant chrome.
- Chat view should keep the composer fixed and the history smooth.
- Mode switches should use fade and slight slide transitions.
- Touch targets must meet mobile accessibility sizing.

Mobile-specific edge cases:
- long titles must truncate without collapsing the header
- keyboard opening must not hide the send control
- review controls must remain reachable in diff mode
- offline and sync states must not consume too much vertical space

---

## 10. Accessibility Requirements And Testable Acceptance Criteria

Target: WCAG 2.2 AA.

The implementation agent must treat these as testable requirements.

### 10.1 Core Accessibility Rules

- All body text and controls must meet AA contrast requirements against their backgrounds.
- Focus-visible states must be clearly visible on every interactive element.
- Keyboard users must be able to reach file tree items, search, toolbar actions, chat controls, and mobile nav toggles where applicable.
- Icon-only controls must have accessible labels.
- Status, diff state, and connectivity state must not rely on color alone.
- Reduced-motion preferences must disable non-essential motion.
- Interactive targets on mobile must be at least 40px to 44px.

### 10.2 Pass-Fail Checks

- Pass if a keyboard user can open the app, select a file, edit content, review a diff, send a chat message, and switch mobile tabs without using a mouse.
- Pass if focus remains visible across dark surfaces and raised panels.
- Pass if offline, warning, success, and diff states remain understandable in grayscale.
- Pass if long file names and long chat messages still remain readable and operable.
- Pass if motion can be reduced without breaking orientation.
- Fail if the redesign introduces hidden focus, low-contrast metadata, or mobile controls below touch target minimums.

---

## 11. Content And Tone Standards

The interface copy should be concise, confident, and implementation-focused.

Rules:
- Use sentence case.
- Prefer direct verbs.
- Avoid playful, chatty, or marketing-heavy copy.
- Avoid generic filler like "No worries" or "You're all set".
- Keep labels operational and short.

Preferred examples:
- "Mark spec ready"
- "Refine document"
- "Open a file to start"
- "Offline changes queued"
- "Sync restored"

Avoid examples:
- "Let's get creating"
- "Magic happens here"
- "All caught up and ready to rock"
- "Search everything..."

Empty-state guidance:
- empty states should explain the next useful action in one or two lines
- they should not use oversized illustrations or decorative filler

---

## 12. Anti-Patterns And Prohibited Implementations

Do not ship any of the following:
- pure black backgrounds for all surfaces
- bright purple headings and accents across the entire UI
- loud green and red diff blocks
- thick borders or card outlines
- large drop shadows on standard panes
- emoji icons in navigation
- oversized floating action buttons
- consumer chat bubble styling
- giant pills, giant radii, or oversized padding
- component-local color inventions outside the token set
- busy animations, long easing, or large translation distances
- multiple unrelated button styles in the same toolbar

---

## 13. Implementation Sequence

The implementation agent should work in this order.

### Phase 1 - Token Foundation

1. Replace global color and typography setup with semantic tokens.
2. Introduce a single interaction state language for buttons, inputs, pills, rows, and tabs.
3. Normalize global background, separators, focus styles, scrollbars, and typography.

### Phase 2 - Workspace Shell

4. Redesign the desktop shell in `Workspace.tsx`.
5. Add the top command layer and refined pane framing.
6. Improve responsive spacing and overlay layering.

### Phase 3 - Sidebar System

7. Redesign sidebar chrome, search trigger, folder groups, and file rows.
8. Replace emoji and bright accents with structured iconography and quiet active states.
9. Make file tree density and row hierarchy match the new system.

### Phase 4 - Editor System

10. Redesign editor chrome, metadata header, prompt banner, and status surfaces.
11. Overhaul the CodeMirror theme to feel content-first.
12. Tune headings, body text, selection, gutter behavior, and empty state.

### Phase 5 - Review System

13. Redesign diff decorations and the diff action bar.
14. Ensure review states remain precise but visually restrained.
15. Validate review usability in long documents and on narrow layouts.

### Phase 6 - Assistant Pane

16. Redesign chat header, agent selector, quick actions, message stream, and composer.
17. Convert the pane into an inspector-like assistant surface.
18. Improve streaming, empty, and disabled states.

### Phase 7 - Shared States And Mobile

19. Restyle shared pills, banners, and the shortcut overlay.
20. Replace the mobile tab strip with a floating navigation treatment.
21. Tune keyboard-safe spacing and touch sizing.

### Phase 8 - Polish And QA

22. Audit for raw colors, spacing drift, and inconsistent motion.
23. Run accessibility checks and responsive QA.
24. Verify the redesign preserves all existing workflows.

---

## 14. File-By-File Implementation Map

Use this as the execution map for the redesign.

| File | Primary overhaul task |
|---|---|
| `src/index.css` | create semantic tokens, font setup, root shell, global interaction, focus, scrollbar, backdrop rules |
| `src/App.css` | remove or align any legacy styles with the new token system |
| `src/App.tsx` | ensure top-level shell and theme scaffolding stay clean |
| `src/components/layout/Workspace.tsx` | add command layer, refine pane framing, redesign mobile shell |
| `src/components/layout/Sidebar.tsx` | create product-grade navigation header and panel language |
| `src/components/sidebar/FileTree.tsx` | improve structure, density, counts, and section rhythm |
| `src/components/sidebar/FileItem.tsx` | redesign active, hover, metadata, and status presentation |
| `src/components/sidebar/FolderGroup.tsx` | redesign section headers and collapse affordances |
| `src/components/sidebar/NewFileButton.tsx` | shift from CTA style to quiet operator action |
| `src/components/sidebar/SearchBar.tsx` | redesign as a command-search trigger with shortcut hint |
| `src/components/layout/EditorPane.tsx` | restructure editor header, metadata, and review containment |
| `src/components/editor/MarkdownEditor.tsx` | align editor frame and empty states with new document model |
| `src/components/editor/DiffActionBar.tsx` | restyle review toolbar |
| `src/components/editor/PromptBanner.tsx` | slim and integrate the warning surface |
| `src/components/editor/StatusBadge.tsx` | create muted lifecycle indicator system |
| `src/components/layout/ChatPane.tsx` | match inspector panel language |
| `src/components/chat/ChatWindow.tsx` | redesign pane hierarchy and streaming state |
| `src/components/chat/ChatMessage.tsx` | shift to restrained message surfaces |
| `src/components/chat/ChatInput.tsx` | docked, compact composer treatment |
| `src/components/chat/AgentSelector.tsx` | quiet segmented or menu-driven agent control |
| `src/components/chat/QuickActions.tsx` | operational action styling with restrained emphasis |
| `src/components/shared/StatusPill.tsx` | compact system pill language |
| `src/components/shared/OfflineBanner.tsx` | thin connectivity banner treatment |
| `src/components/shared/KeyboardShortcuts.tsx` | command-panel treatment |
| `src/lib/codemirror/theme.ts` | implement the new editor token system and markdown behavior |

---

## 15. QA Checklist

- [x] No hardcoded legacy purple or raw one-off colors remain in component styling.
- [x] All panes feel like one system, not three unrelated panels.
- [x] Sidebar rows are dense, readable, and keyboard navigable.
- [x] Search looks and behaves like a command surface.
- [x] Editor typography is content-first and no longer reads like a code IDE.
- [x] Diff review uses restrained color and still remains obvious.
- [x] Chat looks like an assistant inspector, not a consumer messenger.
- [x] Status pills, banners, and inputs all share one control language.
- [x] Mobile navigation feels intentional and elevated.
- [x] Focus-visible states are clearly visible across the app.
- [x] Long titles, long notes, long chat replies, and empty folders are handled cleanly.
- [x] Reduced motion settings are respected.
- [x] The redesign preserves the current product workflow without introducing new UX confusion.

---

## 16. Final Instruction To The Implementation Agent

Implement this redesign as a focused UI overhaul of the existing Meridian app.

Do not change product architecture unless this document requires it.
Do not invent a separate design direction.
Do not ship placeholder styling and call it done.

The bar is: Meridian should look and feel like a purpose-built, premium command workspace with the calm density, motion restraint, and operational clarity associated with Linear.
