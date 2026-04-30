# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star
**Creative North Star: "The Intellectual Brutalist"**

This design system rejects the "cookie-cutter" tech blog aesthetic of bright blues and heavy borders. Instead, it draws inspiration from high-end architectural journals and vintage engineering manuals. It combines the warmth of physical paper (`#DACCB7`) with the authoritative punch of deep Oxblood (`#680A08`). 

The system moves beyond the standard grid by embracing **Intentional Asymmetry**. Layouts should feel curated, not templated. We achieve this through "The Breathing Canvas" approach—utilizing extreme whitespace and overlapping editorial elements to create a sense of depth and intellectual rigor. This is a space for deep thought, not just quick scrolls.

---

## 2. Color & Tonal Depth
The palette is a sophisticated interplay between the warmth of the secondary cream and the gravity of the primary red.

### The "No-Line" Rule
**Explicit Instruction:** Sectioning via 1px solid lines is strictly prohibited. 
Structure is defined through **Tonal Shifting**. To separate a sidebar from a main feed, transition from `surface` (#F9F9F9) to `surface-container-low` (#F3F3F3). This creates a "soft edge" that feels integrated rather than boxed in.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery.
*   **Base:** `background` (#F9F9F9).
*   **Containers:** Use `surface-container` tiers to create hierarchy. A code block should live in a `surface-container-high` (#E8E8E8) to recede slightly, while a featured post card should sit on `surface-container-lowest` (#FFFFFF) to "pop" forward.

### The "Glass & Gradient" Rule
To elevate the "Developer-Focused" vibe, use **Glassmorphism** for navigation and floating overlays. Use `surface` at 80% opacity with a `24px` backdrop-blur. 
**Signature Texture:** Main Call-to-Actions (CTAs) should utilize a subtle linear gradient from `primary_container` (#680A08) to `primary` (#440001) at a 135-degree angle. This adds "visual soul" and prevents the deep red from feeling flat or "muddy."

---

## 3. Typography
The type system pairs the architectural precision of **Manrope** (Sans) with the literary warmth of **Newsreader** (Serif).

*   **Display & Headlines (Manrope):** These are the "bones" of the blog. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for article titles to create a modern, technical impact.
*   **Body Text (Newsreader):** All long-form content must use `body-lg` (1rem). The serif typeface ensures maximum readability for complex tech tutorials while providing a premium, editorial feel.
*   **Labels (Inter):** Technical metadata (tags, timestamps, file sizes) uses Inter at `label-md` (0.75rem). This introduces a "UI-native" feel for functional elements.

---

## 4. Elevation & Depth
In this system, elevation is a product of light and color, not shadows.

*   **The Layering Principle:** Depth is achieved by stacking. A card in `surface-container-lowest` placed on a `surface-container-low` background creates a natural lift.
*   **Ambient Shadows:** If a shadow is required (e.g., a floating search bar), use a 4% opacity shadow with a 40px blur. The shadow color must be a tint of `on_surface` (#1A1C1C), never pure black.
*   **The "Ghost Border":** For elements that require clear containment (like an input field), use the `outline_variant` (#DEC0BB) at **20% opacity**. It should be felt, not seen.
*   **Refraction:** Use `surface_tint` (#A6392F) at 5% opacity as an overlay on images to pull them into the brand's warm color world.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary_container` to `primary`. Text in `on_primary` (#FFFFFF). Corner radius: `md` (0.375rem).
*   **Tertiary (Ghost):** No background. Text in `primary_container`. On hover, apply a `surface-container-high` background shift.

### Cards & Feed Items
*   **Rule:** Forbid divider lines between articles. 
*   **Execution:** Separate list items using `32px` of vertical white space. Use an asymmetrical layout where the headline overlaps a `surface-variant` image container by `16px`.

### Code Blocks (Developer Focus)
*   **Background:** `tertiary_container` (#323232).
*   **Border:** `none`.
*   **Styling:** Use `secondary_fixed_dim` (#D2C5B0) for comments and `primary_fixed_dim` (#FFB4AA) for keywords. This maintains the "Atelier" palette even in code syntax.

### Input Fields
*   **State:** Default state uses the "Ghost Border" (20% opacity `outline_variant`). On focus, the border transitions to 100% `primary_container` but only on the *bottom* edge (Editorial style).

### Chips (Tags)
*   **Selection:** Use `secondary_container` (#EFE1CB) with `on_secondary_container` (#6D6352) text. No border. Corner radius: `full` (9999px).

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a "Featured" heading at the far left and the content body slightly offset to the right.
*   **Embrace the Cream:** Use `#DACCB7` (`secondary_fixed`) as a full-bleed background for "Thought Pieces" to distinguish them from "Technical Documentation" (which uses `#F9F9F9`).
*   **Large Margins:** Give headlines room to breathe. A `headline-lg` should have at least `48px` of margin-bottom.

### Don't:
*   **Don't use 100% black:** Never use #000000. Use `on_surface` (#1A1C1C) for all text to maintain the soft, high-end feel.
*   **Don't use "Card Slop":** Avoid the common trend of putting every piece of content in a shadowed box. Use the "No-Line" rule and background shifts instead.
*   **Don't use standard icons:** Use "Light" or "Thin" weight iconography (1px stroke) to match the Manrope headlines.