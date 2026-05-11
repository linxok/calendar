# Design System — Beauty Salon Booking App

## 🎨 Brand Identity

### Concept
**"Elegant Simplicity"** — Premium beauty experience through clean, breathable design with soft feminine accents.

---

## 🌈 Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-50` | #fdf2f8 | Lightest backgrounds |
| `--primary-100` | #fce7f3 | Hover states, subtle fills |
| `--primary-200` | #fbcfe8 | Borders, dividers |
| `--primary-300` | #f9a8d4 | Secondary accents |
| `--primary-400` | #f472b6 | Icons, highlights |
| `--primary-500` | #ec4899 | **Primary brand color** |
| `--primary-600` | #db2777 | Buttons, links hover |
| `--primary-700` | #be185d | Active states |
| `--primary-800` | #9d174d | Text on light bg |
| `--primary-900` | #831843 | Strong emphasis |

### Secondary Colors (Rose Gold)
| Token | Hex | Usage |
|-------|-----|-------|
| `--rose-50` | #fff1f2 | Card backgrounds |
| `--rose-100` | #ffe4e6 | Subtle highlights |
| `--rose-400` | #fb7185 | Accent icons |
| `--rose-500` | #f43f5e | **Secondary accent** |
| `--rose-600` | #e11d48 | CTAs, important actions |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--gray-50` | #fafafa | Page background |
| `--gray-100` | #f3f4f6 | Card backgrounds |
| `--gray-200` | #e5e7eb | Borders |
| `--gray-300` | #d1d5db | Disabled states |
| `--gray-400` | #9ca3af | Placeholder text |
| `--gray-500` | #6b7280 | Secondary text |
| `--gray-600` | #4b5563 | Body text |
| `--gray-700` | #374151 | Headings |
| `--gray-800` | #1f2937 | Strong text |
| `--gray-900` | #111827 | Primary text |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | #10b981 | Success states |
| `--warning` | #f59e0b | Warnings |
| `--error` | #ef4444 | Errors |
| `--info` | #3b82f6 | Information |

### Gradient Presets
```css
/* Hero Gradient */
--gradient-hero: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #ddd6fe 100%);

/* Card Gradient */
--gradient-card: linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(252,231,243,0.6) 100%);

/* Accent Gradient */
--gradient-accent: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);

/* Dark Gradient */
--gradient-dark: linear-gradient(135deg, #1f2937 0%, #111827 100%);
```

---

## 📝 Typography

### Font Family
- **Primary**: `Inter` (Google Fonts) — Clean, modern, excellent readability
- **Display**: `Playfair Display` — Elegant serif for headings

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 | 48px / 3rem | 700 | 1.1 | -0.02em |
| H2 | 36px / 2.25rem | 600 | 1.2 | -0.01em |
| H3 | 28px / 1.75rem | 600 | 1.3 | 0 |
| H4 | 24px / 1.5rem | 600 | 1.4 | 0 |
| H5 | 20px / 1.25rem | 600 | 1.4 | 0 |
| H6 | 18px / 1.125rem | 600 | 1.5 | 0 |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.01em |
| Overline | 12px / 0.75rem | 600 | 1.4 | 0.08em |

---

## 🎯 Spacing System

### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Icon gaps |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Default padding |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Large gaps |
| `--space-10` | 40px | Section padding |
| `--space-12` | 48px | Large sections |
| `--space-16` | 64px | Hero padding |
| `--space-20` | 80px | Major sections |

---

## 🎴 Components

### Buttons

#### Primary Button
- Background: `gradient-accent`
- Text: white
- Padding: 12px 24px
- Border radius: 12px
- Shadow: `0 4px 14px rgba(236, 72, 153, 0.25)`
- Hover: Scale 1.02, shadow increase
- Active: Scale 0.98

#### Secondary Button
- Background: transparent
- Border: 1.5px solid `--primary-200`
- Text: `--primary-600`
- Hover: Background `--primary-50`

#### Ghost Button
- Background: transparent
- Text: `--gray-600`
- Hover: Background `--gray-100`

### Cards

#### Standard Card
- Background: white
- Border radius: 16px
- Shadow: `0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)`
- Padding: 24px
- Hover: Transform translateY(-2px), shadow increase

#### Glass Card
- Background: `rgba(255, 255, 255, 0.7)`
- Backdrop filter: blur(12px)
- Border: 1px solid `rgba(255,255,255,0.5)`
- Border radius: 20px

### Inputs
- Background: white
- Border: 1px solid `--gray-200`
- Border radius: 12px
- Padding: 12px 16px
- Focus: Border `--primary-400`, ring 3px `--primary-100`

---

## ✨ Effects & Animations

### Transitions
```css
/* Default */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
--shadow-xl: 0 16px 48px rgba(0,0,0,0.16);
--shadow-glow: 0 0 40px rgba(236, 72, 153, 0.15);
```

### Animations
```css
/* Fade In Up */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
}

/* Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

---

## 🖼️ Visual Elements

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards |
| `--radius-xl` | 20px | Large cards |
| `--radius-2xl` | 24px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

### Icons
- Library: Lucide React
- Default size: 20px
- Stroke width: 1.5px
- Color: inherit from text

---

## 🧩 Layout Patterns

### Container
- Max width: 1280px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)

### Grid
- Gap: 24px (default), 32px (large sections)
- Columns: Responsive 1-2-3-4

### Section Spacing
- Between major sections: 80px
- Within sections: 48px
- Component groups: 24px

---

## 🎭 Status Colors

| Status | Color | Background |
|--------|-------|------------|
| Pending | #f59e0b | #fffbeb |
| Confirmed | #10b981 | #d1fae5 |
| Completed | #6b7280 | #f3f4f6 |
| Cancelled | #ef4444 | #fee2e2 |

---

*Created for Beauty Salon Booking App — Modern Redesign 2025*
