# IAESTE Khujand

A student-focused informational website for IAESTE Khujand, Tajikistan. Built with semantic HTML, CSS and vanilla JavaScript. No build step or backend is required.

## Local preview

From the project directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4173/).

## Text encoding

Save source files as UTF-8, as specified in `.editorconfig`. When editing from PowerShell, explicitly use `-Encoding utf8` when reading and writing files. HTML uses character references for punctuation and symbols, and JavaScript uses Unicode escapes for dynamic gallery captions, so these characters survive tools that default to a legacy encoding.

## Design and content

The original deep blue-green brand, dark text and footer are preserved, with a refined light mint-gray / icy blue-green palette for page backgrounds, section surfaces, cards and interaction states. Shared colour tokens in `styles.css` keep the desktop and phone treatments consistent. The typography combines upright Manrope headings with Inter body text, consistent semibold emphasis, tabular numerals and comfortable spacing. An animated geographic globe appears on larger screens alongside varied section compositions. Below 768 px, the hero uses a single column of copy and actions with no globe or globe asset downloads.

Phone refinements up to 700 px live in `mobile.css`, loaded only under its matching media condition. They use a stable compact header with visible Menu/Close labels, consistent full-width actions, 16 px body text, segmented internship tabs without repeated format kickers, smaller application-step markers, an aligned selection cycle, explicitly labelled document languages and clearer FAQ/contact surfaces. The compact three-photo city composition has its heading and archive link outside the photographs for reliable contrast. Larger text settings trigger stacked facts and document metadata. Phones use a full-width Open in Maps action instead of the embedded map. The mobile hero orders its actions as Explore internships, Contact IAESTE and How to apply, using solid, outlined and quiet treatments respectively. Contact IAESTE links to the contact section and stays hidden on larger screens. Existing desktop styles, shared scripts and content are preserved.

Decorative divider lines have been removed from section boundaries and content rows, including the partner strip, application steps, document table, news, FAQ and contact sections. Spacing and existing background colours separate content. Button outlines and active control indicators remain visible.

Contained photography, the application notice, map and photo viewer use soft 24 px corners, reducing to 20 px on phones. Compact news thumbnails use 12 px corners; partner hover surfaces and the viewer image use the medium radius token. The phone city collage stays inside the content gutters, with visible rounded outer corners and straight internal seams. The radius scale is defined centrally in `styles.css` and documented in `DESIGN.md`.

The nomination table sits in a single paper-coloured panel with a tinted header and 20 px outer corners, reducing to 16 px on phones. Desktop cells and stacked phone rows have inset padding to keep text, actions and keyboard focus outlines clear of the clipped edges.
The application journey sits on the existing blue-green accent, with a sticky introduction, oversized step numbers and a compact timeline. Internship formats use a moving underline and an asymmetric image-and-copy layout. A wide photographic Khujand feature leads into a horizontal gallery with previous/next controls. Archived news appears as publication-style rows. Practical instructions and source attribution are retained.

The documents section is an always-visible table with the same twelve requirements, order and language column as iaeste.tj. Six verified official DOCX/PDF forms are hosted unchanged under `assets/documents/` and download directly from this site. The broken official liability-policy download is replaced with a request link to the committee. Personal documents are prepared by the student; no files are uploaded. All five partner marks remain in their original colours.

Motion includes staggered title entrances, globe rotation, travelling connections with city-name arrival labels and idle auto-return to Tajikistan, one-time section reveals, application-step reveals, a moving internship underline, gallery sliding, photo hover feedback and native disclosure transitions in supported browsers. The globe always animates while visible on desktop, without playback or reset buttons. Reduced-motion preferences disable CSS animations, transitions, smooth scrolling and decorative hover movement elsewhere on the page. Keyboard focus reveals controls immediately.

- Internship tabs support arrow keys, Home and End.
- The gallery supports previous/next, arrow keys, Escape and focus restoration.
- The horizontal photo sequence supports native touch scrolling, navigation buttons, an updating counter and arrow keys when focused.
- Mobile navigation closes after a destination, Escape or outside focus.
- The header compacts into a floating bar after scrolling, hides on deliberate downward movement and returns on upward movement. Its layout space stays constant. Keyboard focus reveals it immediately; an open menu and reduced-motion preference keep it visible. Navigation links highlight the current section and the mobile dropdown fits short viewports.
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
- Contact uses the verified Khujand telephone **+992 92 773 50 05** and national email **tajikistan@iaeste.org**. No Khujand office address or response time is assumed; the map marks only the supplied Plus Code **7JHH+3X6** (Khujand, Tajikistan) via a lazy-loaded Google Maps embed.

The source’s [2024 Khujand cultural programme](https://www.iaeste.tj/media/CP-2024_LC-Khujand.pdf) informs the cultural content.

## Files

- `index.html`: structured content, metadata, forms, source links and imagery.
- `styles.css`: design tokens, components, responsive layouts and motion preferences.
- `mobile.css`: phone-only layout, controls and spacing, guarded at a maximum width of 700 px.
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
- `khujand-city-view.jpg`: [sunset architecture photograph supplied by the site owner](https://avatars.mds.yandex.net/get-altay/11748256/2a00000192464393c31d957e54bd204e2f3e/XXL_height).
- `khujand-city-detail.jpg`: [Syr Darya and city panorama supplied by the site owner](https://avatars.mds.yandex.net/get-altay/16873746/2a00000197b521187cb46d30890273a65f6c/orig).
- `khujand-theater.jpg`: [DilshodKh, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:K._Khujandi_State_Musical_Comedy_Theater.jpg), CC BY-SA 4.0. The supplied 1280 px image is hosted locally and cropped by the responsive layout.
- `khujand-river.jpg`: previous city photograph, retained as an unused asset; [Neu holland, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F_%D0%B2_%D0%A5%D1%83%D0%B4%D0%B6%D0%B0%D0%BD%D0%B4%D0%B5.jpg), CC BY-SA 4.0.
- `panjshanbe-bazaar.jpg`: [Steve Evans, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Panjshanbe_bazar_in_Khujand_.jpg), CC BY 2.0.

Image sources, licences and crop information are recorded above. Exchange gallery photography comes from the IAESTE Tajikistan community. The website's footer photo-credit block was removed at the site owner's request.

## Verification

Mobile hero contact action checked locally on 14 October 2026: visible at 320, 390, 430 and 700 px with a 48 px touch height and no page overflow; hidden at 701, 768, 1280 and 1440 px. Existing desktop hero styles are identical with or without the hidden control. Contact anchor navigation, keyboard focus, 200% text and visibility without JavaScript passed. No browser page errors; Git whitespace checks passed.

Mobile polish checked locally on 14 October 2026: reviewed 320, 360, 375, 390, 430, 540 and 700 px layouts with no horizontal overflow, clipped reading text or main controls below 44 px. Checked 125% and 200% text settings at 320 and 390 px with normal and reduced motion; facts and document metadata stack without page overflow. Menu destination, Escape/focus restoration, outside dismissal and anchor clearance passed. The 667 × 375 px menu stays inside the viewport and scrolls to its contact action. Internship tabs, gallery counter/viewer navigation, FAQ disclosures and a native DOCX download passed; all six official files returned HTTP 200. No JavaScript mode retains navigation, both internship formats and twelve document records. Desktop computed style values matched 569 stable elements at 701, 768, 960, 1280 and 1440 px; `styles.css`, `main.js` and `globe.js` are byte-for-byte unchanged from the start of this pass. HTML changes only refresh the phone stylesheet cache version. Browser page errors, local asset/anchor checks and Git whitespace checks passed. Verification used mobile browser emulation; changes remain local.

Phone design refinement checked locally on 14 October 2026: reviewed layouts at 320, 360, 390, 430 and 700 px with no horizontal page overflow and at least 44 px of touch height on main controls. At 667 × 375 px, the open menu stays inside the viewport and scrolls to its remaining links. Verified menu destination/keyboard dismissal, internship tab switching and Home-key navigation, gallery navigation and counter updates, photo viewer navigation/Escape/focus restoration, and FAQ opening/closing. All twelve nomination records, six downloads and three city photographs remain. At 390 px, page height decreased from 11,923 to 9,428 px. Desktop computed styles were compared across 648 elements at 701, 768, 1280 and 1440 px; shared CSS and JavaScript match the pre-change files byte for byte, and the only HTML change is the phone stylesheet link. Browser warnings/errors and Git whitespace checks passed. Changes remain local.

Rounded nomination table checked locally on 14 October 2026: confirmed the desktop panel and stacked phone layout, 20/16 px responsive radii, visible keyboard focus and no horizontal page overflow at 320, 390, 700, 768, 960 and 1280 px. The twelve document rows and six download links are unchanged. Browser diagnostics and Git whitespace checks passed.

Footer cleanup on 14 October 2026: removed the complete "Photo credits" disclosure, its three attribution paragraphs and its unused styles. Image-source records remain in this README.

Source-note cleanup on 14 October 2026: removed the national updates, national figures and national application guidance links, both internship offer-review footnotes, the document source note and repeated contact/archive notes. Theatre and bazaar credits now appear together in a collapsed footer disclosure. Main actions, document downloads, national context and archive labels are retained. HTML structure, internal anchors, local assets, twelve document rows, six download links and Git whitespace checks passed. Browser checks confirmed the cleaned desktop news layout, keyboard opening/closing of credits and no page overflow at 320 and 390 px; no browser warnings or errors were reported.

Rounded-corner refinement checked locally on 14 October 2026: reviewed the internship feature, city collage, gallery viewer and phone application notice. Verified the radius tokens and no horizontal page overflow at 320, 390, 768 and 1280 px. The remote internship tab, gallery photo navigation, Escape and focus restoration passed; browser diagnostics reported no warnings or errors. HTML content is unchanged apart from the stylesheet cache version, and Git whitespace checks passed.

Copy cleanup on 14 October 2026: removed the placement-help callout, repeated contact prompts and city tagline; replaced promotional headings and the email button label with direct wording. Application details, contact information and image credits are retained.

City photography update on 14 October 2026: replaced the single riverside image with the three site-owner-supplied photographs in a responsive collage, added theatre attribution and updated the stylesheet cache version. Image decoding, declared dimensions, alternative text, local image references, internal anchors and Git whitespace checks passed. Browser checks at 1280 px and 390 px confirmed that all three photographs load, the collage adapts to a vertical phone layout, the heading and cultural programme link remain readable, and there is no horizontal page overflow. The local page, stylesheet and all three JPEG requests returned HTTP 200; browser diagnostics reported no warnings or errors.

Text encoding correction checked locally on 14 October 2026: repaired punctuation, arrows, accented letters, metadata and gallery captions. Desktop and 390 px phone checks confirmed clean FAQ and footer text, working FAQ disclosures and photo navigation, and no browser warnings or errors. All source text passed a UTF-8 and corruption scan; HTML structure, internal anchors, local assets, JavaScript syntax and Git whitespace checks passed.

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
- Globe refinement checked in headless Chrome on 14 October 2026: directional shading and atmosphere crescent, highlighted travelled arcs, lit destinations with non-overlapping city labels, allocation-free dot projection, adaptive 60/30 fps pacing, and automatic return to Tajikistan after a drag. No console errors.
- Checked HTML nesting, unique IDs, internal links and local asset paths. JavaScript syntax and Git whitespace checks passed; browser diagnostics reported no warnings or errors.

The earlier gallery, internship-tab and mobile-navigation interaction checks are recorded in the previous design review. This update changed the hero copy, document downloads, application notice and partner list.
