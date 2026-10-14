# IAESTE Khujand

IAESTE Khujand's internship and application information website, built with HTML, CSS and vanilla JavaScript. No dependencies or build step.

## Local preview

Run from the project directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open [127.0.0.1:4173](http://127.0.0.1:4173/).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content, metadata and asset links |
| `styles.css` | Colour and typography tokens, components, responsive styles and motion |
| `mobile.css` | Overrides at widths up to 700 px |
| `main.js` | Navigation, tabs, gallery, partner strip and content reveals |
| `globe.js` | Canvas globe and controls; active from 768 px |
| `DESIGN.md` | Design conventions |
| `assets/` | Images, logos, geographic data and downloadable forms |

Save text files as UTF-8. Use `-Encoding utf8` when reading or writing them in PowerShell.

## Content sources

[IAESTE Tajikistan](https://www.iaeste.tj/) was checked on 13 October 2026 for document requirements, national figures, the selection cycle and contact details.

- The site owner supplied the summer 2027 intake details, 31 October 2026 CV deadline, `iaeste@inbox.ru` application address, payment terms and language requirements.
- The 1992 establishment date and 425+/289+ exchange totals are national figures. The selection cycle is a general timetable, without confirmed dates for a particular intake.
- The twelve nomination requirements and languages follow the national table. Six official forms were downloaded unchanged; provenance and SHA-256 checksums are in [SOURCES.json](assets/documents/SOURCES.json). The enrolment form is for Germany. The liability-policy link returned 404, so its row links to the committee.
- News items are archives. Cultural information uses the [2024 Khujand programme](https://www.iaeste.tj/media/CP-2024_LC-Khujand.pdf).
- Contact details are the Khujand phone `+992 92 773 50 05` and national email `tajikistan@iaeste.org`. The map uses Plus Code `7JHH+3X6`.

## Publishing

GitHub Pages serves the repository root. Include referenced assets when committing changes. Update the Open Graph URLs in `index.html` if the production domain changes.

## Checks

```sh
node --check main.js
node --check globe.js
git diff --check
```

## Image sources and licences

- `globe-land.json`, `globe-static.svg`: derived from the [Natural Earth 1:110m country dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain. Routes are illustrative.
- IAESTE blue/white logos: official IAESTE assets.
- `gallery-2.webp`, `gallery-3.webp`, `iaeste-discover.webp`: national committee gallery photography from `https://www.iaeste.tj/images/gallery/webp/img2.webp`, `img3.webp` and `img4.webp`.
- `international-exchange.webp`, `practical-experience.webp`: illustrative technical teamwork and laboratory research photography.
- `gallery-community.webp`: [national gallery image 6](https://www.iaeste.tj/images/gallery/webp/img6.webp).
- `news-anniversary.webp`, `news-conference.webp`: [anniversary artwork](https://www.iaeste.tj/images/news/iaeste_30th_birthday.webp) and [conference artwork](https://www.iaeste.tj/images/news/vienna.webp).
- `partner-babilon.webp`, `partner-acted.webp`, `partner-academy.webp`, `partner-alif.webp`, `partner-arkon.webp`: national committee partner images 1, 2, 4, 5 and 6 under `https://www.iaeste.tj/images/partners/`.
- `khujand-city-view.jpg`: [sunset architecture photograph supplied by the site owner](https://avatars.mds.yandex.net/get-altay/11748256/2a00000192464393c31d957e54bd204e2f3e/XXL_height).
- `khujand-city-detail.jpg`: [Syr Darya and city panorama supplied by the site owner](https://avatars.mds.yandex.net/get-altay/16873746/2a00000197b521187cb46d30890273a65f6c/orig).
- `khujand-theater.jpg`: [DilshodKh, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:K._Khujandi_State_Musical_Comedy_Theater.jpg), CC BY-SA 4.0. Cropped by the responsive layout.
- `khujand-river.jpg`: [Neu holland, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F_%D0%B2_%D0%A5%D1%83%D0%B4%D0%B6%D0%B0%D0%BD%D0%B4%D0%B5.jpg), CC BY-SA 4.0.
- `panjshanbe-bazaar.jpg`: [Steve Evans, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Panjshanbe_bazar_in_Khujand_.jpg), CC BY 2.0.
