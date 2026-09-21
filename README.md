# Jack Holland Photography

A Next.js photography portfolio, adapted from the `gymc` landing-page
architecture — the Ken Burns hero, dark/light theming, and card-grid
mechanics are reused as-is; the title and the simulation-tool tabs are
replaced with a photo gallery.

## Setup

```
npm install
npm run import-photos
npm run dev
```

### Importing your photos

`npm run import-photos` reads from a local folder and needs your machine's
filesystem, so it can't run in this session or in CI — run it yourself
after cloning the repo. By default it looks at:

```
/Users/jackholland/Downloads/Personal/Photos/Photo Repository
```

Edit `DEFAULT_SOURCE` in `scripts/import-photos.mjs` to change that, or
pass a path explicitly:

```
npm run import-photos -- "/some/other/path"
```

Organize the source folder as either:
- one subfolder per gallery ("Landscapes/", "Portraits/", ...) — each
  becomes its own collection, or
- a single flat folder of images — imported as one "Portfolio" collection.

Each run resizes photos to a max of 2400px on the long edge, re-encodes as
JPEG, copies them into `public/photos/<category>/`, and writes
`data/photos.json`, which drives the homepage hero slideshow and the
gallery pages. Re-run it any time your source folder changes — it's safe
to run repeatedly. HEIC/HEIF files that fail to convert are skipped with a
warning (export them as JPEG first, e.g. via Preview or `sips`).

Until you run the import, the site renders with an empty gallery state
instead of crashing — safe to preview with `npm run dev` right away.

## Editing

- `lib/site-config.ts` — your name, tagline, nav links, contact email
  (left blank on purpose; fill in only when you want it public)
- `app/about/page.tsx`, `app/contact/page.tsx` — bio and contact copy
- `styles/globals.css` — swap `--c-accent` (and its light/dark/glow
  variants) for your own brand color

## Structure

- `components/landing/Hero.tsx` + `KenBurnsSlideshow.tsx` — the animated
  hero, reused from the gymc template
- `components/landing/GalleryCategories.tsx` — collection cards on the
  homepage (replaces the old tool nav cards)
- `components/gallery/PhotoGrid.tsx` — masonry grid + lightbox for a
  single collection
- `app/gallery/[category]/page.tsx` — one page per collection
- `lib/photos.ts` — typed accessors over `data/photos.json`
- `scripts/import-photos.mjs` — the local photo importer described above
