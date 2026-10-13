# IAESTE Khujand

A student-focused informational website for IAESTE Khujand, Tajikistan. Built with semantic HTML, CSS and vanilla JavaScript. No build step or backend is required.

## Local preview

From the project directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4173/).

## Design and content

The original blue-green, white, off-white and dark text palette is preserved. The typography combines upright Manrope headings with Inter body text, consistent semibold emphasis, tabular numerals and comfortable spacing. An animated geographic globe appears on larger screens alongside varied section compositions. Below 768 px, the hero uses a single column of copy and actions with no globe or globe asset downloads.

Decorative divider lines have been removed from section boundaries and content rows, including the partner strip, application steps, document table, news, FAQ and contact sections. Spacing and existing background colours separate content. Button outlines and active control indicators remain visible.
The application journey sits on the existing blue-green accent, with a sticky introduction, oversized step numbers and a compact timeline. Internship formats use a moving underline and an asymmetric image-and-copy layout. A wide photographic Khujand feature leads into a horizontal gallery with previous/next controls. Archived news appears as publication-style rows. Practical instructions and source attribution are retained.

The documents section is an always-visible table with the same twelve requirements, order and language column as iaeste.tj. Six verified official DOCX/PDF forms are hosted unchanged under `assets/documents/` and download directly from this site. The broken official liability-policy download is replaced with a request link to the committee. Personal documents are prepared by the student; no files are uploaded. All five partner marks remain in their original colours.

Motion includes staggered title entrances, globe rotation and travelling connections, one-time section reveals, application-step reveals, a moving internship underline, gallery sliding, photo hover feedback and native disclosure transitions in supported browsers. The globe always animates while visible on desktop, without playback or reset buttons. Reduced-motion preferences disable CSS animations, transitions, smooth scrolling and decorative hover movement elsewhere on the page. Keyboard focus reveals controls immediately.

- Internship tabs support arrow keys, Home and End.
- The gallery supports previous/next, arrow keys, Escape and focus restoration.
- The horizontal photo sequence supports native touch scrolling, navigation buttons, an updating counter and arrow keys when focused.
- Mobile navigation closes after a destination, Escape or outside focus.
- Essential sections, both internship formats, native disclosures and form links remain available without JavaScript.
- Photography, logos and favicon are local; Google Fonts has system fallbacks.

## Source and accuracy

Primary source: [IAESTE Tajikistan](https://www.iaeste.tj/), checked on **13 October 2026** for nomination requirements, file links, national figures, timetable and contact details.

- The summer 2027 application notice, 31 October 2026 CV deadline, `iaeste@inbox.ru` application address, language requirement, payment note and placement-chance statement were supplied by the site owner and translated into English. The notice, first application step and FAQ use this current intake information.
- The September, October, January–February and March timeline reproduces the published national cycle. It is not presented as confirmed dates for a particular year.
- The 1992 establishment date and 425+/289+ exchange totals are identified as published **national** figures.
- All twelve document requirements and languages come from the national nomination table. Six working DOCX/PDF forms were downloaded unchanged from its official links on 13 October 2026. File provenance and checksums are recorded in `assets/documents/SOURCES.json`.
- The Germany enrolment form is explicitly destination-specific.
- The source’s liability-policy link returns 404. That row directs students to request the form from the committee.
- Offers link to the official IAESTE internship platform; availability and individual deadlines are not invented.
- The two national news items are explicitly archives. The Khujand cultural programme is labelled **2024 archive**, and students are directed to the committee for current activities.
- All five unique partner marks listed by the national committee are included: Babilon-T, ACTED, the National Academy of Sciences of Tajikistan, Alif and ARKON Education Group. The heading is “Our partners,” with no subtitle or source link in the section. The five linked logos scroll continuously with a repeated visual sequence; that copy adds no screen-reader announcements or keyboard stops.
- The Babilon-T mark now links to its verified official website; the source pairs that mark with a Babilon-Mobile link. ARKON’s link is functional here despite the source’s `hre` attribute typo.
- Contact uses the verified Khujand telephone **+992 92 773 50 05** and national email **tajikistan@iaeste.org**. No Khujand office address or response time is assumed.

The source’s [2024 Khujand cultural programme](https://www.iaeste.tj/media/CP-2024_LC-Khujand.pdf) informs the cultural content.

## Files

- `index.html`: structured content, metadata, forms, source links and imagery.
- `styles.css`: design tokens, components, responsive layouts and motion preferences.
- `main.js`: navigation, internship tabs, active section tracking and gallery.
- `globe.js`: automatic desktop globe animation, drag and keyboard rotation; inactive below 768 px.
- `DESIGN.md`: visual and editorial conventions.
- `assets/`: local photography, official identity marks, favicon and downloadable nomination forms.

The existing GitHub Pages setup serves the repository root. Changes are local until committed and published. Update the Open Graph URL and image URL if the production domain changes.

## Image sources and licences

- `globe-land.json`, `globe-static.svg`: derived from the [Natural Earth 1:110m country dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain. Connections are illustrative, rather than a list of available placements.
- IAESTE blue/white logos: retained official IAESTE assets.
- `gallery-2.webp`, `gallery-3.webp`, `iaeste-discover.webp`: retained national committee gallery photography, originally from `https://www.iaeste.tj/images/gallery/webp/img2.webp`, `img3.webp` and `img4.webp`.
- `international-exchange.webp`, `practical-experience.webp`: retained project assets showing technical teamwork and laboratory research; used as illustrative internship photography.
- `gallery-community.webp`: [national gallery image 6](https://www.iaeste.tj/images/gallery/webp/img6.webp).
- `news-anniversary.webp`, `news-conference.webp`: [anniversary artwork](https://www.iaeste.tj/images/news/iaeste_30th_birthday.webp) and [conference artwork](https://www.iaeste.tj/images/news/vienna.webp).
- `partner-babilon.webp`, `partner-acted.webp`, `partner-academy.webp`, `partner-alif.webp`, `partner-arkon.webp`: national committee partner images 1, 2, 4, 5 and 6 under `https://www.iaeste.tj/images/partners/`. Original logo colours and artwork are preserved; CSS balances their visual sizes.
- `khujand-river.jpg`: [Neu holland, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F_%D0%B2_%D0%A5%D1%83%D0%B4%D0%B6%D0%B0%D0%BD%D0%B4%D0%B5.jpg), CC BY-SA 4.0.
- `panjshanbe-bazaar.jpg`: [Steve Evans, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Panjshanbe_bazar_in_Khujand_.jpg), CC BY 2.0.

Creative Commons credits, licences and crop notices appear on the page. National gallery photographs are attributed to the IAESTE Tajikistan community.

## Verification

Hero and documents update checked locally on 13 October 2026:

- Removed the requested hero slogans; the opening copy now consists of the title and actions.
- Styled the hero’s “How to apply” action as an outlined secondary pill with a matching height, semibold label, subtle hover feedback and visible keyboard focus. It remains a native link to the application section.
- Replaced the decorative italic serif treatment with Manrope headings and Inter body text. Retuned heading sizes, line heights, numeral styles and paragraph sizes across the site while preserving the full-name letter animation.
- Removed all eight numbered section labels. Main headings introduce each section directly; the About heading and copy share the same left edge, with no empty label column.
- The hero uses the full name “International Association for the Exchange of Students for Technical Experience,” verified against [IAESTE’s official overview](https://iaeste.org/about). Each letter reveals once in reading order; whole words, the complete accessible heading and static text without JavaScript or with reduced motion are preserved.
- Removed the globe’s visible hint and disclaimer and the “Discover IAESTE” link, including their empty containers and styles. Globe animation and keyboard help remain available.
- Removed the globe’s play/pause and reset buttons and their empty toolbar. It animates automatically whenever visible on desktop, including while dragging and when reduced motion is requested; offscreen and hidden tabs suspend rendering until the globe is visible again.
- Compared all twelve nomination requirements and languages with the official national table.
- Downloaded and verified six official files; local HTTP downloads match their original SHA-256 checksums. DOCX archives and PDF signatures are valid.
- Confirmed the official liability-policy URL returns HTTP 404 and supplied a committee request link.
- Tested native browser downloads of the student nomination DOCX and Germany enrolment PDF.
- Reviewed the document layout on desktop and phone; no horizontal overflow at 320, 390, 700, 768 or 1280 px.
- Confirmed the phone globe remains hidden.
- Added the site owner’s summer 2027 application notice in English, including the 31 October 2026 deadline and email action; checked it at 320, 390, 768 and 1280 px without horizontal overflow.
- Removed Яхмоси 33 from the displayed partner network and changed the desktop grid to five columns.
- Replaced the static partner row with an automatic continuous strip, without a playback button. Hover and keyboard focus stop movement; touch and horizontal wheel gestures take temporary control, with automatic resume after scrolling settles. Animation also stops offscreen or in a hidden tab. Reduced motion and no JavaScript retain a static, fully visible partner grid.
- Verified partner loop wraparound, keyboard focus visibility and native horizontal scrolling. The strip has no page overflow at 320, 390 or 1280 px.
- Checked HTML nesting, unique IDs, internal links and local asset paths. JavaScript syntax and Git whitespace checks passed; browser diagnostics reported no warnings or errors.

The earlier gallery, internship-tab and mobile-navigation interaction checks are recorded in the previous design review. This update changed the hero copy, document downloads, application notice and partner list.
