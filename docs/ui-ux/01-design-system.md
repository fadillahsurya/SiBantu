# Yanto Siap Design System

## 1. Design Philosophy

Yanto Siap is designed for non-technical users who need confidence quickly. The interface should feel friendly, trustworthy, and action-oriented. Users should understand the next action within seconds.

Principles:

- One primary action per screen.
- Use plain Indonesian labels.
- Keep forms short and forgiving.
- Make status visible and human-readable.
- Put important actions in thumb-friendly areas on mobile.
- Avoid dense admin-template visuals on customer and worker screens.
- Use reassuring feedback for every action.

## 2. Color Palette

### Primary

- Emerald 600 `#059669`: primary actions, active status.
- Emerald 700 `#047857`: stronger headers and emphasis.
- Emerald 50 `#ecfdf5`: soft success/background highlight.

### Supporting

- Sky 600 `#0284c7`: accepted/informational states.
- Indigo 600 `#4f46e5`: on-the-way state.
- Amber 500 `#f59e0b`: waiting/attention state.
- Rose 600 `#e11d48`: danger, suspend, cancellation.

### Neutral

- Zinc 950 `#09090b`: primary text.
- Zinc 700 `#3f3f46`: secondary strong text.
- Zinc 500 `#71717a`: helper text.
- Zinc 200 `#e4e4e7`: borders.
- Zinc 50 `#fafafa`: app background.
- White `#ffffff`: surfaces.

## 3. Typography System

- Font: Geist Sans for modern web readability.
- H1: 40-56px desktop, 32-40px mobile, bold/black.
- H2: 24-32px, bold.
- H3: 18-20px, semibold.
- Body: 14-16px, regular.
- Helper text: 12-14px, regular.
- Button text: 14-16px, semibold.

Rules:

- Do not use tiny text for key actions.
- Keep labels direct: "Buat Order", "Terima Job", "Menuju Lokasi".
- Avoid negative letter spacing.

## 4. Spacing System

- 4px: micro spacing.
- 8px: inline gaps.
- 12px: compact card internals.
- 16px: standard mobile spacing.
- 20px: card padding.
- 24px: section spacing.
- 32px: page block spacing.
- 48px: desktop section separation.

## 5. Border Radius System

- 6px: inputs and buttons.
- 8px: cards and modals.
- 999px: badges and pills.

Cards should stay at 8px radius or less to preserve a professional operational feel.

## 6. Shadow System

- Subtle shadow for interactive cards: `0 1px 2px rgb(0 0 0 / 0.05)`.
- Hover shadow for clickable cards: `0 8px 24px rgb(15 23 42 / 0.08)`.
- Avoid heavy floating shadows except for modals.

## 7. Component Library

### Navigation

- Public header.
- Role-based sidebar for desktop.
- Horizontal scroll nav for mobile.
- Clear logout action.

### Buttons

- Primary: create order, accept job, save.
- Secondary: view details, toggle non-critical states.
- Danger: suspend worker, cancel order.
- Icon + text where action benefits from recognition.

### Forms

- Text input.
- Select.
- Textarea.
- Checkbox/toggle.
- Numeric input for rating/location fallback.
- Field labels always visible.
- Errors shown below fields.

### Data Display

- OrderCard.
- WorkerCard.
- StatusBadge.
- StatCard.
- Responsive table.
- Timeline/status stepper.

### Feedback

- LoadingSkeleton.
- EmptyState.
- Success state.
- Error state.
- Confirmation dialog for destructive actions.

## 8. Responsive Breakpoints

- Mobile: 320-767px.
- Tablet: 768-1023px.
- Desktop: 1024-1439px.
- Wide desktop: 1440px+.

Layout rules:

- Mobile: single column, full-width buttons, bottom-friendly actions.
- Tablet: two-column cards where useful.
- Desktop: sidebar navigation and multi-column dashboards.
- Wide: constrain content to readable max width.

## 9. Dark Mode Strategy

MVP can ship light mode first. Dark mode should be token-driven:

- Define semantic tokens for background, surface, text, border, and status.
- Keep status colors recognizable in both modes.
- Test contrast at WCAG AA minimum.
- Do not rely on color alone for status.

## 10. Accessibility Guidelines

- Minimum text contrast WCAG AA.
- Focus rings visible on all interactive elements.
- Buttons at least 40px high.
- Inputs have persistent labels.
- Status uses text plus color.
- Tables remain horizontally scrollable on mobile.
- Forms should expose clear errors.
- Avoid icon-only actions unless tooltip/aria-label is provided.
- Loading state should not trap users.

## 11. Visual Style Direction

Yanto Siap should feel like a real Indonesian service startup:

- Friendly but not cartoonish.
- Operational but not cold.
- Modern cards with clear hierarchy.
- Large primary actions.
- Trust-building copy.
- Clean dashboards.
- Green as the core service/action color, balanced with neutral and status accents.
