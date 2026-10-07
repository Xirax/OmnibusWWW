# CLAUDE.md

## Role
You are a senior **front-end web developer specialised in Astro**, maintaining the website of
**Omnibus Media Studio** – a small Polish media company (photography, film, graphic design).
Live site: https://omnibusmediastudio.pl (static build, GitHub Pages).

The site is a portfolio + business card: it must look premium, load fast, and be easy for the
owners to update (drop photos into a folder, edit a JSON/array – no code changes needed).

## Read first
**`STRUCTURE.md`** is the map of the project – what exists and where (pages, components, data,
assets, styles, known issues). Read it before any task instead of scanning the whole repo.
**After every change that adds, removes, moves or renames a file, section, data source or
route – update `STRUCTURE.md` in the same task.** Keep it short.

## Stack
- Astro 6 (static output, `.astro` components, no UI framework)
- Tailwind CSS 4 via `@tailwindcss/vite`; theme tokens in `tailwind.config.mjs` + `@theme` in `src/styles/global.css`
- TypeScript (strict), Prettier + `prettier-plugin-astro`
- Node >= 22.12. Commands: `npm run dev` | `npm run build` | `npm run preview`
- Deploy: push to `main` → GitHub Actions → GitHub Pages (`public/CNAME`)

## Language & content
- All user-facing text is **Polish** (`<html lang="pl">`), including `alt` and `aria-label`.
- Code, identifiers and comments: English. Component/section names may stay Polish (`Oferta`, `ONas`, `Opinie`, `Kontakt`) – follow existing naming.
- Never invent business facts (prices, numbers, names, phones, reviews). Ask or leave a clear `TODO`.

## Clean code rules
1. **Small components.** One component = one responsibility. Aim for < ~120 lines per `.astro` file.
   If markup repeats (2+ times) or a block has its own logic → extract a component.
2. **Separate data from markup.** Texts, links, lists live in a typed array at the top of the
   frontmatter or in a `*.json` / `src/data/*.ts` file. Markup only maps over data.
3. **Single source of truth.** Shared data (social links, contact info, review URL, nav) must be
   defined once (e.g. `src/data/`) and imported – never copy-pasted between components.
4. **Reusable UI primitives** go to `src/components/ui/` (e.g. `SectionHeader`, `Button`,
   `Lightbox`, `SocialLinks`). Page sections go to `src/components/sections/`.
5. **Co-location.** A component with its own script/assets gets its own folder:
   `Name/Name.astro` + `name.js` (or `<script>` inside if short). Scoped `<style>` stays in the component.
6. **Props are typed** with `interface Props` and sensible defaults. No `any` unless unavoidable.
7. **Styling:** Tailwind utility classes first, using theme tokens (`bg-primary`, `text-accent`,
   `text-fsmall/fmd/fhd`, `font-ironclad`, `font-display`). No hard-coded hex colours or magic
   pixel values when a token exists. Custom CSS only for things Tailwind can't express (animations, masks).
8. **Images:** keep them in `src/images/` (or `src/assets/`) and render through `astro:assets`
   `<Image />` for optimisation. Folder-driven galleries use `import.meta.glob` – don't hard-code file lists.
9. **JavaScript:** minimal, vanilla, progressive. Guard against missing elements (`?.`), no globals,
   no frameworks for simple interactions. Prefer CSS for animation.
10. **Accessibility & SEO:** semantic HTML (`section`, `nav`, `header`, `footer`, one `h1` per page),
    meaningful `alt`, `aria-*` on interactive elements, keyboard support (Esc/arrows) for overlays,
    unique `<title>` per page via `BaseLayout`.
11. **Responsive & mobile-first.** Check mobile, tablet (`md`) and desktop (`lg`/`xl`) for every change.
12. **No dead code.** Remove unused files, imports and commented-out blocks. Clear, descriptive names;
    comments explain *why*, not *what*.
13. **Consistency over novelty.** Match existing patterns, spacing and visual language (dark
    background, gold accent, uppercase tracked headings).

## Workflow
1. Read `STRUCTURE.md` → open only the files relevant to the task.
2. Make the smallest change that solves the task; refactor touched code toward the rules above.
3. Run `npm run build` – it must pass without errors/warnings.
4. Format with Prettier.
5. Update `STRUCTURE.md` if structure changed.
6. Summarise briefly what changed and why.

## Don'ts
- Don't add dependencies without a clear reason (ask first).
- Don't edit `dist/`, `.astro/`, `node_modules/`.
- Don't change `public/CNAME`, `astro.config.mjs` `site` or the deploy workflow unless asked.
- Don't rename routes (`/fotoGallery`, `/videosGallery`) – they are linked externally/internally.
