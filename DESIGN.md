# Design conventions

## Tokens

`styles.css` is the source of truth for colours, typography, spacing and radii. Use its custom properties in `mobile.css`.

| Tokens | Use |
| --- | --- |
| `--accent`, `--accent-dark` | Brand teal, primary actions and emphasis |
| `--ink`, `--muted` | Main and supporting text |
| `--paper`, `--surface` | Mint-gray page backgrounds and brighter surfaces |
| `--tint`, `--tint-strong` | Hover/selected states, contact section and inset highlights |
| `--surface-soft`, `--surface-glass` | Translucent actions and header |
| `--control-line` | Control outlines |
| `--footer` | Footer and gallery dialog |

## Layout and typography

- Use Inter for body text and controls, Manrope for upright semibold headings. Adjust the existing type tokens instead of adding another scale.
- Content width is at most 1320 px. Desktop gutters are 56 px, reducing to 36 px below 1150 px. Phone gutters are 20 px, or 16 px at 380 px and below.
- Navigation collapses at 960 px. Phone overrides apply at 700 px and below; the globe is omitted below 768 px.
- Keep the header's layout space constant when it compacts or hides.
- On phones, hide the header after 24 px of deliberate downward scrolling beyond the header's height and reveal it after 8 px upward. Keep it visible at the top, with an open menu or keyboard focus, and during menu-link navigation. Reduced motion removes the animation while retaining this behavior. Preserve the existing desktop thresholds and reduced-motion behavior.
- Separate sections with spacing and surface colours. Avoid decorative divider lines.
- Use 24/20/12 px radii for large/medium/small surfaces; large/medium reduce to 20/16 px on phones. Clip photos at their wrappers and keep keyboard outlines visible.
- On phones, place the Khujand heading and programme link outside the photo collage. Use the map link instead of an embedded map.

## Interaction and accessibility

- Keep text contrast at least 4.5:1 (3:1 for large text), control boundaries at least 3:1, visible keyboard focus and touch targets at least 44 px high.
- Preserve keyboard navigation: menu dismissal with Escape; tabs with arrows, Home and End; gallery navigation with arrows and Escape, focus containment and restoration.
- Preserve document table semantics, language labels and native downloads when adapting rows for phones or larger text.
- Keep content, both internship formats, navigation and form links usable without JavaScript. Retain the SVG globe fallback.
- Respect reduced motion for CSS and partner scrolling. The globe skips its entrance spin but continues rotating while visible; pause it offscreen, on hidden tabs and below 768 px.
- Keep duplicate partner logos out of the accessibility tree and tab order. Pause the scrolling strip on hover/focus and resume after manual scrolling settles.

## Content and assets

- Keep the full official IAESTE name and direct section/action labels.
- Preserve intake dates, destination-specific document notes, national attribution, archive labels and contact roles. Confirm factual changes with the committee.
- Keep official logos in their original colours. Use existing local images and retain source/licence records in `README.md` and `assets/documents/SOURCES.json`.
