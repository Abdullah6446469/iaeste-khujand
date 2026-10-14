# IAESTE Khujand visual system

The visual direction combines clear, professional typography, authentic exchange photography, asymmetrical compositions and restrained motion. Every layout should make the internship, application and arrival information easy to find.

## Palette

Keep the original deep teal brand, ink and footer colours. Light surfaces use a restrained mint-gray / icy blue-green palette; official marks and photographs keep their own colours.

| Token | Value |
| --- | --- |
| Accent | #205464 |
| Accent dark | #153d49 |
| Ink | #202e34 |
| Muted | #5b686d |
| Paper | #edf4f3 |
| Surface | #f7faf9 |
| Tint | #e1edeb |
| Tint strong | #dae8e6 |
| Line | #c9dbd8 |
| Control line | #65848a |
| Surface soft | #f7faf9a6 |
| Surface glass | #f7faf9f2 |
| Footer | #20383f |

Use Paper for page backgrounds and inset document/FAQ surfaces, Surface for brighter sections and contained controls, Tint for selected/hover states and the contact section, and Tint strong for segmented-control tracks and deadline highlights. The soft and glass surface variants retain the existing translucency in secondary actions and the sticky header. Control line gives outlined controls at least 3:1 contrast against the light palette; Line is reserved for subtle decorative separation. Keep white text on the existing dark brand surfaces.

## Typography and composition

- Separate sections and content rows with spacing and the existing background colours. Do not add decorative separator lines. Preserve outlines for buttons, keyboard focus and active control indicators.
- Inter supplies body text, navigation and controls. Manrope supplies upright semibold headings and clear, tabular numerals. Use consistent weights, comfortable line heights and moderate letter spacing. Render heading emphasis in the same upright face; use colour to distinguish it. Segoe UI and Arial are the fallbacks.
- The header begins as a spacious, pale mint-neutral bar. After scrolling, its inner surface becomes a compact, softly rounded floating bar with a restrained shadow and background blur. Preserve its original layout space so content never jumps. Hide after deliberate downward scrolling and reveal after a short upward movement; keep it visible near the top, during anchor navigation, with keyboard focus or an open mobile menu. Reduced motion keeps the compact header visible and removes transitions. Navigation links use generous pill-shaped targets with tinted hover and current-section states. The primary contact button pairs a semibold label with a quiet circular arrow. Phones use a labelled Menu control and a scrollable dropdown with the same focus and active states.
- The hero spells out IAESTE’s official name, “International Association for the Exchange of Students for Technical Experience,” beside the animated geographic globe. Set across three balanced, semantic rows in upright Manrope, with the organization name in ink and the following two exchange lines in the accent colour at the same size and weight. Reveal each letter in reading order with a short, staggered row-by-row cascade. Keep whole words together, preserve the complete accessible heading and show static text when reduced motion is requested. Tajikistan is highlighted on the globe, using the existing palette and local Natural Earth data.
- Pair the solid “Explore internships” action with an outlined “How to apply” pill of matching height. Give the secondary action a light surface, restrained border, semibold label, forward arrow and clear keyboard focus. Keep its hover movement horizontal and respect reduced motion. Both actions retain native section links and comfortable touch targets.
- The globe always animates while visible, with no playback or reset buttons. Drag and arrow keys rotate it; Home returns to Tajikistan, and a globe left rotated drifts back on its own after about nine seconds of stillness. The globe and its visual assets are omitted below 768 px. Phone layouts use the headline and actions without an empty visual column. Keep the hero free of promotional filler.
- Sections begin with their main headings, without numbered section labels. The committee introduction has a full-width heading above its copy. National figures sit below it, explicitly attributed to IAESTE Tajikistan. Benefits are numbered rows.
- Internship formats use keyboard-operated tabs and an asymmetric feature with the copy on the left and photography on the right. Retained research/teamwork assets are illustrative, not testimonials.
- The application section uses the original accent background, a sticky introduction, a visible summer 2027 intake notice and prominent tabular step numbers. The notice contains the site owner’s English translation, CV deadline, application email, payment and language requirements. Current intake details are repeated in the first step and relevant FAQ. The general national selection cycle remains clearly labelled below the sequence.
- Documents use an always-visible table matching the national website’s twelve numbered requirements, document names, languages and download column. Treat the table as one rounded panel with a paper-coloured surface, a tinted header and the medium radius token (20 px desktop, 16 px phone). Inset cells and phone rows enough to preserve keyboard focus outlines inside the clipped panel. Six verified official files are served locally with native download links. The liability-policy file is unavailable at the official source; that row links to the committee. On phones, each table row stacks its description above its language and action.
- The city section uses a three-photo collage: a portrait of turquoise-domed architecture beside stacked riverside and theatre views. On phones, the architecture photograph sits above two smaller riverside and theatre views in one compact composition. A blue-green overlay keeps the heading and programme link readable. Cultural highlights and the 2024 archive label remain readable outside the images.
- The gallery is a horizontal, scroll-snapping photo sequence with visible previous/next controls and a counter. Each photo still opens in the accessible lightbox.
- News uses wide publication-style rows with small artwork and large titles. The partner section uses only the heading “Our partners” and a continuously scrolling strip of the five official partner logos, keeping their original colours. Avoid subtitles, extra claims or promotional copy.
- FAQs use native disclosures beside a large heading. The contact section closes with expressive type, a hairline-separated list of labelled phone, email and location rows (location links to directions) and a plain wide Google Maps embed for Plus Code 7JHH+3X6 (Khujand, Tajikistan), which stacks to a shorter map on phones. The footer stays concise.

## Corner radii

Use selective rounding on contained surfaces. Large internship photos, the application notice, the city collage, gallery photos, the map and the lightbox use the 24 px `--radius-lg` token. Partner hover surfaces and the lightbox image use the 20 px `--radius-md` token; compact news thumbnails and lightbox controls use the 12 px `--radius-sm` token. Below 700 px, the large and medium tokens reduce to 20 px and 16 px. Clip photography and map content at their own rounded wrappers, keeping linked captions and keyboard focus outlines outside the clipped area. Keep the city collage inside the phone content gutters so all four corners remain visible. Treat the collage as one image surface, with straight internal seams. Keep full-width section backgrounds, document tables and editorial text rows aligned with the page grid. Existing pill buttons, circular controls and the floating header retain their established shapes.

## Responsive layout

Content is at most 1320 px wide. Desktop gutters are 56 px, reducing to 36 px on compact desktops, 22 px on phones and 16 px below 380 px. Navigation collapses below 960 px. Primary columns stack below 700 px.

The phone hero contains no globe. Its copy and actions fill a single column. The gallery shows a partial next image to communicate horizontal movement. News becomes compact thumbnail rows. The partner strip supports native horizontal swiping on phones. Its static fallback uses five, three or two columns according to available width. Sticky section introductions become static on phones.

### Phone layout, up to 700 px

Keep phone refinements in `mobile.css`, loaded with a matching media condition and protected by its own media query. Preserve the existing desktop presentation and shared JavaScript. New phone-only controls should be hidden by default in the shared stylesheet and exposed only in the phone stylesheet.

- Use 20 px gutters (16 px below 380 px), a 56 px section rhythm and a stable 64 px header. The 44 px high menu control pairs its icon with a visible Menu/Close label and retains its accessible open/close name. Keep the menu scrollable in short viewports. Anchor navigation is immediate, with enough clearance below the header.
- Keep the complete official name in the hero. Order phone actions as Explore internships, Contact IAESTE and How to apply, using solid, outlined and quiet treatments respectively. Contact IAESTE links to the contact section and remains hidden above 700 px. Keep visual, reading and keyboard order aligned. Set body text at 16 px, supporting text at 14–15 px and metadata at 12–13 px. Align national figures in a compact tinted panel and use the existing benefit icons instead of decorative row numbers.
- Present internship formats as two equal segmented controls; omit the repeated numbered format kicker on phones. Use shallower photography and full-width offer and application actions. Highlight the CV deadline with larger date text; use small step markers instead of oversized numerals. Present the national selection cycle as four aligned month-and-description rows for easier reading.
- Keep all twelve nomination requirements visible as individual document records, preserving the table semantics, languages, destination notes and six download links. Pair explicit language labels with comfortably sized download/request actions. Keep document titles and notes readable, and preserve contrasting hover and keyboard-focus states. Container queries stack the facts and document metadata when enlarged text needs more space.
- Limit the city photo surface to 300–420 px in height. Place the heading above the photos and the cultural programme link, including its archive label, on a solid surface below. Keep gallery touch scrolling and the next-image preview. Preserve full-card news links, native FAQ disclosures and clearly labelled contact surfaces. On phones, replace the embedded map with the existing Open in Maps link as a full-width branded action, avoiding a nested map scroll surface. Use readable captions in the photo viewer and a stacked footer ending.
- Give main controls at least 44 px of touch height, with 48 px download/contact targets and 52 px primary actions. Display the menu, photo viewer, hero letters, hero actions and revealed content immediately on phones; preserve the desktop motion system and global reduced-motion behavior.

## Motion and accessibility

Use a staggered, clipped title entrance; one-time content reveals; application-step reveals; a moving tab underline; smooth gallery navigation; and restrained photo zooms. The desktop globe spins into place once, then rotates gently with lit, atmospheric shading, comet-trail particles along geographic arcs that light up behind the moving comet, arrival ripples with a briefly lit destination and a small city-name label, and a double pulse at Khujand. Lighting is consistent: a glint and crescent of atmosphere face the light and the far side falls into shade. City labels never overlap each other or the Tajikistan label. Dragging eases with momentum, arrow keys glide and Home eases back to Tajikistan with a slower, calmer glide. Rendering is capped at 60 fps and falls back to 30 fps at rest on devices where drawing is slow. It plays automatically while visible, including during dragging and when reduced motion is requested (the entrance spin is skipped then). Suspend rendering outside the viewport, on a hidden tab or below 768 px and resume automatically when visible again. Buttons share one interaction system: a fill that expands from the pointer's entry point, a 2 px lift with deeper shadow, an arrow that passes through its circle, a press scale and the same fill for keyboard focus.

Keep the gallery's native touch scrolling. Its buttons and arrow-key controls update the counter and disable at the ends. The lightbox retains Escape, previous/next keys, focus containment and focus restoration.

Partner logos move automatically at 28 px per second in a seamless native scrolling loop, without a play/pause button. Pause on hover or keyboard focus and keep focused links visible. After manual touch or wheel scrolling settles, resume automatically after 1.2 seconds. Stop animation outside the viewport or when the tab is hidden. A repeated visual copy is hidden from assistive technology and removed from the tab order. Reduced motion and no JavaScript show the original static list.

Respect `prefers-reduced-motion` for page animations other than the globe. Disable smooth scrolling, reveals and decorative hover transforms. Keyboard focus reveals controls immediately. Core content, native disclosures, gallery links and official forms remain available without JavaScript. A local geographic SVG supplies the desktop globe fallback.

## Content

Use direct section headings and action labels. Omit generic help prompts, repeated contact invitations and promotional slogans; keep practical information and specific actions.

Keep source-navigation labels and generic offer-review footnotes out of the main sections. Keep image source, licence and crop records in the project documentation; omit the photo-credit block from the website.

Preserve eligibility details, destination-specific form notes, national attribution, archive dates, contact roles and image licences. Do not invent opportunities, deadlines, statistics, testimonials or office details. Keep primary internship and document links and all five partner entries.
