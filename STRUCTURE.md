# STRUCTURE.md
Project map – keep in sync with the code (see CLAUDE.md). Paths relative to repo root.

## Routes (`src/pages/`)
| Route | File | Content |
|---|---|---|
| `/` | `index.astro` | One-pager: Header → Landing → Oferta → Portfolio → ONas → Opinie → Kontakt |
| `/fotoGallery` | `fotoGallery/index.astro` | Photo masonry in 4 sections (+ inline lightbox script) |
| `/videosGallery` | `videosGallery/index.astro` | YouTube embeds: `shorts` (empty → "Wkrótce...") + `longs` |
| `/gallery?id=…` | `gallery.astro` | **Legacy**, not linked anywhere (old query-param gallery) – candidate to delete |

**Nav per route:** `header.json` placed in a page folder (`src/pages/header.json`, `fotoGallery/header.json`,
`videosGallery/header.json`) = list of `{href,label}` anchors. `Header` picks the longest matching route.

## Layout
- `src/layouts/BaseLayout.astro` – `<html lang="pl">`, `title` prop, Google Fonts, imports `global.css`, `<slot/>`.

## Components (`src/components/`)
| Component | Purpose / data source |
|---|---|
| `Header/Header.astro` + `header.js` | Fixed header: logo, nav (from `header.json`), socials, mobile menu, "scrolled" bg, back arrow on sub-pages |
| `sections/Landing.astro` | Hero, full-screen bg `images/landing_page.jpg`, scroll-down button → `#oferta` |
| `sections/Oferta.astro` | `#oferta` – 3 services (Fotografia/Film/Grafika), data array in frontmatter, slide-in on scroll |
| `sections/Portfolio/Portfolio.astro` + `portfolio.js` | `#portfolio` – 2 tiles: GIF slideshow → `/videosGallery`, 3-photo slideshow → `/fotoGallery`. Data passed via `<script type="application/json" id="portfolio-data">` |
| `sections/ONas.astro` | `#o-nas` – studio + Franciszek + Dominik bios (data objects in frontmatter) |
| `sections/Opinie/Opinie.astro` + `opinie.js` | `#opinie` – animated counters (`data-counter data-target`), Google review link, preview button, modal |
| `sections/Opinie/OpiniePreviewButton.astro` | Teaser card (hard-coded placeholder "Jan Kowalski"), opens modal via `data-opinie-modal-open` |
| `OpinieModal/OpinieModal.astro` + `opiniemodal.js` | Reviews popup. Reads `src/assets/opinie/<folder>/{desc.txt,alias.txt,avatar.*}`; fallback `avatar.png` |
| `sections/Kontakt.astro` | `#kontakt` footer – phones, email, socials, "Napisz do nas" (Gmail), logo |

## Content / data (edit here, no code needed)
| What | Where |
|---|---|
| Photo gallery | `src/images/gallery/{portrait,events,parties,animals}/` (auto via `import.meta.glob`) |
| Portfolio slideshow | `src/images/portfolio/images/{horizontal,vertical}/`, GIFs in `portfolio/videos/` |
| YouTube videos | `src/pages/videosGallery/videos.json` (array of URLs; any YT URL format) |
| Reviews | `src/assets/opinie/<name>/desc.txt + alias.txt (+ avatar.png/jpg/webp)` – **currently none** |
| Offer / about texts | arrays in `Oferta.astro`, `ONas.astro` |
| Counters (40 / 65) | `data-target` in `Opinie.astro` |
| Section images | `src/images/{oferta,onas}/`, `landing_page.jpg`, `logo1.png` (footer), `logo2.png` (header) |

## Styles & theme
- `src/styles/global.css` – Tailwind import, `@config` → `tailwind.config.mjs`, Jost font, `Ironclad` @font-face (`public/fonts/`), `@theme`: `font-ironclad`, `text-fsmall 16px / fmd 20px / fhd 24px`.
- `src/styles/index.css` – keyframes + `.animate-fade-in-up`, `.animate-bounce-slow`, `.hero-*` delays (imported by pages).
- `tailwind.config.mjs` – colors: `primary #1D1E1F`, `primary-light #333230`, `accent #8e7f43`, `accent-light #b5a45a`, `secondary #FFF`; `font-display` Cormorant Garamond.
- Visual language: dark bg, gold accent, uppercase tracked `font-ironclad` headings, section header = line–label–line.

## Config / infra
`astro.config.mjs` (site URL, Tailwind vite plugin) · `tsconfig.json` (strict) · `.prettierrc` · `.github/workflows/deploy.yml` (main → Pages) · `public/` (CNAME, favicons, fonts).

## Known issues / refactor backlog
- `socialLinks` array duplicated in `Header.astro` and `Kontakt.astro` → move to `src/data/`.
- Section header markup (line–label–line) repeated ~7× → `ui/SectionHeader.astro`.
- Lightbox duplicated in `fotoGallery/index.astro` and `gallery.astro` → `ui/Lightbox`.
- Text+image block repeated in `Oferta`/`ONas`; identical scroll-reveal scripts → shared component/script.
- Google review URL duplicated (`Opinie.astro`, `OpinieModal.astro`).
- `ONas.astro` uses `text-md` (should be `text-fmd`); `ONas` uses `<img>` instead of `<Image>`.
- Fonts loaded twice (Cormorant/Montserrat in layout, Jost/Jura/Literata/Space Mono in CSS) – most unused.
- Unused/duplicate images: `src/images/dominik.JPG`, `src/images/franek.JPG` (copies in `onas/`); `portfolio/videos/test.gif`.
- `README.md` is the default Astro template.
