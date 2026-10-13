# IAESTE Khujand visual system

The visual direction combines clear, professional typography, authentic exchange photography, asymmetrical compositions and restrained motion. Every layout should make the internship, application and arrival information easy to find.

## Palette

Preserve these original tokens. Official marks and photographs keep their own colours.

| Token | Value |
| --- | --- |
| Accent | #205464 |
| Accent dark | #153d49 |
| Ink | #202e34 |
| Muted | #5b686d |
| Paper | #f5f6f4 |
| Tint | #edf3f2 |
| Line | #dce2e0 |
| Footer | #20383f |

## Typography and composition

- Separate sections and content rows with spacing and the existing background colours. Do not add decorative separator lines. Preserve outlines for buttons, keyboard focus and active control indicators.
- Inter supplies body text, navigation and controls. Manrope supplies upright semibold headings and clear, tabular numerals. Use consistent weights, comfortable line heights and moderate letter spacing. Render heading emphasis in the same upright face; use colour to distinguish it. Segoe UI and Arial are the fallbacks.
- The hero spells out IAESTE’s official name, “International Association for the Exchange of Students for Technical Experience,” beside the animated geographic globe. Set all five lines in upright Manrope, with the final three in the accent colour at the same size and weight. Reveal each letter once in reading order with a short, staggered rise and fade. Keep whole words together, preserve the complete accessible heading and show static text when reduced motion is requested. Tajikistan is highlighted on the globe, using the existing palette and local Natural Earth data.
- Pair the solid “Explore internships” action with an outlined “How to apply” pill of matching height. Give the secondary action a light surface, restrained border, semibold label, forward arrow and clear keyboard focus. Keep its hover movement horizontal and respect reduced motion. Both actions retain native section links and comfortable touch targets.
- The globe always animates while visible, with no playback or reset buttons. Drag and arrow keys rotate it; Home returns to Tajikistan. The globe and its visual assets are omitted below 768 px. Phone layouts use the headline and actions without an empty visual column. Keep the hero free of promotional filler.
- Sections begin with their main headings, without numbered section labels. The committee introduction has a full-width heading above its copy and contact link. National figures sit below it, explicitly attributed to IAESTE Tajikistan. Benefits are numbered rows.
- Internship formats use keyboard-operated tabs and an asymmetric feature with the copy on the left and photography on the right. Retained research/teamwork assets are illustrative, not testimonials.
- The application section uses the original accent background, a sticky introduction, a visible summer 2027 intake notice and prominent tabular step numbers. The notice contains the site owner’s English translation, CV deadline, application email, payment and language requirements. Current intake details are repeated in the first step and relevant FAQ. The general national selection cycle remains clearly labelled below the sequence.
- Documents use an always-visible table matching the national website’s twelve numbered requirements, document names, languages and download column. Six verified official files are served locally with native download links. The liability-policy file is unavailable at the official source; that row links to the committee. On phones, each table row stacks its description above its language and action.
- The city section uses a wide riverside photograph with a blue-green contrast overlay. Cultural highlights, the 2024 archive label and photo credits remain readable outside the image.
- The gallery is a horizontal, scroll-snapping photo sequence with visible previous/next controls and a counter. Each photo still opens in the accessible lightbox.
- News uses wide publication-style rows with small artwork and large titles. The partner section uses only the heading “Our partners” and a continuously scrolling strip of the five official partner logos, keeping their original colours. Avoid subtitles, extra claims or promotional copy.
- FAQs use native disclosures beside a large heading. The contact section closes with expressive type and direct phone/email links. The footer stays concise.

## Responsive layout

Content is at most 1320 px wide. Desktop gutters are 56 px, reducing to 36 px on compact desktops, 22 px on phones and 16 px below 380 px. Navigation collapses below 960 px. Primary columns stack below 700 px.

The phone hero contains no globe. Its copy and actions fill a single column. The gallery shows a partial next image to communicate horizontal movement. News becomes compact thumbnail rows. The partner strip supports native horizontal swiping on phones. Its static fallback uses five, three or two columns according to available width. Sticky section introductions become static on phones.

## Motion and accessibility

Use a staggered, clipped title entrance; one-time content reveals; application-step reveals; a moving tab underline; smooth gallery navigation; and restrained photo zooms. The desktop globe spins into place once, then rotates gently with lit, atmospheric shading, comet-trail particles along geographic arcs, arrival ripples and a double pulse at Khujand. Dragging eases with momentum, arrow keys glide and Home eases back to Tajikistan. It plays automatically while visible, including during dragging and when reduced motion is requested (the entrance spin is skipped then). Suspend rendering outside the viewport, on a hidden tab or below 768 px and resume automatically when visible again. Buttons share one interaction system: a fill that expands from the pointer's entry point, a 2 px lift with deeper shadow, an arrow that passes through its circle, a press scale and the same fill for keyboard focus.

Keep the gallery's native touch scrolling. Its buttons and arrow-key controls update the counter and disable at the ends. The lightbox retains Escape, previous/next keys, focus containment and focus restoration.

Partner logos move automatically at 28 px per second in a seamless native scrolling loop, without a play/pause button. Pause on hover or keyboard focus and keep focused links visible. After manual touch or wheel scrolling settles, resume automatically after 1.2 seconds. Stop animation outside the viewport or when the tab is hidden. A repeated visual copy is hidden from assistive technology and removed from the tab order. Reduced motion and no JavaScript show the original static list.

Respect `prefers-reduced-motion` for page animations other than the globe. Disable smooth scrolling, reveals and decorative hover transforms. Keyboard focus reveals controls immediately. Core content, native disclosures, gallery links and official forms remain available without JavaScript. A local geographic SVG supplies the desktop globe fallback.

## Content

Preserve eligibility details, destination-specific form notes, national attribution, archive dates, contact roles and image licences. Do not invent opportunities, deadlines, statistics, testimonials or office details. Keep official links and all five partner entries.
