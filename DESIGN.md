# IAESTE Khujand visual system

The selected direction is **creative studio**: expressive typography, authentic exchange photography, asymmetrical compositions and stronger motion. Every layout should still make the internship, application and arrival information easy to find.

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
- DM Sans supplies body text, navigation and sans-serif headings. Instrument Serif supplies expressive italic phrases and large numbers. Arial and Georgia are the fallbacks.
- The hero pairs the literal title “International internships” and primary actions with an animated geographic globe. Tajikistan is highlighted, with illustrative connections originating in Khujand. The globe uses the existing blue-green palette and local Natural Earth data.
- The globe always animates while visible, with no playback or reset buttons. Drag and arrow keys rotate it; Home returns to Tajikistan. The globe and its visual assets are omitted below 768 px. Phone layouts use the headline and actions without an empty visual column. Keep the hero free of promotional filler.
- The committee introduction has a narrow section label beside a wide statement. National figures sit below it, explicitly attributed to IAESTE Tajikistan. Benefits are numbered rows.
- Internship formats use keyboard-operated tabs and an asymmetric feature with the copy on the left and photography on the right. Retained research/teamwork assets are illustrative, not testimonials.
- The application section uses the original accent background, a sticky introduction, a visible summer 2027 intake notice and oversized serif step numbers. The notice contains the site owner’s English translation, CV deadline, application email, payment and language requirements. Current intake details are repeated in the first step and relevant FAQ. The general national selection cycle remains clearly labelled below the sequence.
- Documents use an always-visible table matching the national website’s twelve numbered requirements, document names, languages and download column. Six verified official files are served locally with native download links. The liability-policy file is unavailable at the official source; that row links to the committee. On phones, each table row stacks its description above its language and action.
- The city section uses a wide riverside photograph with a blue-green contrast overlay. Cultural highlights, the 2024 archive label and photo credits remain readable outside the image.
- The gallery is a horizontal, scroll-snapping photo sequence with visible previous/next controls and a counter. Each photo still opens in the accessible lightbox.
- News uses wide publication-style rows with small artwork and large titles. The partner section uses only the heading “Our partners” and a continuously scrolling strip of the five official partner logos, keeping their original colours. Avoid subtitles, extra claims or promotional copy.
- FAQs use native disclosures beside a large heading. The contact section closes with expressive type and direct phone/email links. The footer stays concise.

## Responsive layout

Content is at most 1320 px wide. Desktop gutters are 56 px, reducing to 36 px on compact desktops, 22 px on phones and 16 px below 380 px. Navigation collapses below 960 px. Primary columns stack below 700 px.

The phone hero contains no globe. Its copy and actions fill a single column. The gallery shows a partial next image to communicate horizontal movement. News becomes compact thumbnail rows. The partner strip supports native horizontal swiping on phones. Its static fallback uses five, three or two columns according to available width. Sticky section introductions become static on phones.

## Motion and accessibility

Use a staggered, clipped title entrance; one-time content reveals; application-step reveals; a moving tab underline; smooth gallery navigation; and restrained photo zooms. The desktop globe rotates gently, animates particles along geographic arcs and pulses at Khujand. It plays automatically while visible, including during dragging and when reduced motion is requested. Suspend rendering outside the viewport, on a hidden tab or below 768 px and resume automatically when visible again.

Keep the gallery's native touch scrolling. Its buttons and arrow-key controls update the counter and disable at the ends. The lightbox retains Escape, previous/next keys, focus containment and focus restoration.

Partner logos move automatically at 28 px per second in a seamless native scrolling loop, without a play/pause button. Pause on hover or keyboard focus and keep focused links visible. After manual touch or wheel scrolling settles, resume automatically after 1.2 seconds. Stop animation outside the viewport or when the tab is hidden. A repeated visual copy is hidden from assistive technology and removed from the tab order. Reduced motion and no JavaScript show the original static list.

Respect `prefers-reduced-motion` for page animations other than the globe. Disable smooth scrolling, reveals and decorative hover transforms. Keyboard focus reveals controls immediately. Core content, native disclosures, gallery links and official forms remain available without JavaScript. A local geographic SVG supplies the desktop globe fallback.

## Content

Preserve eligibility details, destination-specific form notes, national attribution, archive dates, contact roles and image licences. Do not invent opportunities, deadlines, statistics, testimonials or office details. Keep official links and all five partner entries.
