#!/usr/bin/env node
// Imports photos from a local folder into public/photos/<category>/ and
// generates data/photos.json, which drives the hero slideshow and gallery
// pages. This only runs on the machine where your photos live — it never
// runs in CI or on the deployed site.
//
// Usage:
//   node scripts/import-photos.mjs ["/path/to/your/photo/folder"]
//
// With no argument it defaults to DEFAULT_SOURCE below. Organize the
// source folder as either:
//   - subfolders of images, one subfolder per gallery category, or
//   - a single flat folder of images, imported as one "Portfolio" category
//
// "Page Elements" is treated as reserved — it holds site assets (logo,
// contact card) rather than gallery photos, so it's skipped even though it
// contains images.
//
// Location captions: data/locations.json is a hand-maintained sidecar
// mapping each photo's public src path to a place name (e.g.
// "San Francisco, CA"), shown as a caption in the gallery lightbox. It is
// never overwritten by this script — on each run, any new photos are added
// to it with an empty string for you to fill in by hand, and existing
// entries (including ones you've already typed) are left alone.
//
// Edited versions: if a photo has a sibling named "<name> Edited.<ext>" or
// "<name> <N> Edited.<ext>" (Apple Photos' export naming — the number only
// appears when exporting a batch), that edited file's pixels are used
// instead of the original — but the *original* filename still drives the
// slug/src, so the photo's URL and any location caption already assigned
// to it stay the same when an edit is dropped in later.

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULT_SOURCE = '/Users/jackholland/Downloads/Personal/Photos/Photo Repository'
const PROJECT_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const PUBLIC_PHOTOS_DIR = path.join(PROJECT_ROOT, 'public', 'photos')
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'data', 'photos.json')
const LOCATIONS_PATH = path.join(PROJECT_ROOT, 'data', 'locations.json')

const MAX_DIMENSION = 2400
const JPEG_QUALITY = 85

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.heic', '.heif',
])

const RESERVED_DIR_NAMES = new Set(['page elements'])
// Apple Photos exports a batch as "<name> N Edited.<ext>" but a single
// share/export as just "<name> Edited.<ext>" — the number is optional.
const EDITED_SUFFIX_PATTERN = /^(.*?)(?: \d+)? Edited$/i

function slugify(input) {
  return (
    input
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  )
}

function titleize(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function listImageFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort()
}

// Pairs each original image with its "<name> <N> Edited.<ext>" sibling, if
// one exists, so the edited pixels get used while the original filename
// stays the identity used for slugs. Returns [{ name, sourceFile }].
function resolveSourceFiles(dir) {
  const files = listImageFiles(dir)

  const editedByBase = new Map()
  for (const file of files) {
    const match = path.parse(file).name.match(EDITED_SUFFIX_PATTERN)
    if (match) editedByBase.set(match[1], file)
  }

  const resolved = []
  for (const file of files) {
    if (EDITED_SUFFIX_PATTERN.test(path.parse(file).name)) continue // paired in below
    const base = path.parse(file).name
    const edited = editedByBase.get(base)
    if (edited) editedByBase.delete(base)
    resolved.push({ name: file, sourceFile: edited ?? file })
  }

  // Edited files with no matching original (e.g. the original was moved or
  // renamed) — import them standalone under their own name.
  for (const file of editedByBase.values()) {
    resolved.push({ name: file, sourceFile: file })
  }

  return resolved.sort((a, b) => a.name.localeCompare(b.name))
}

function discoverCategories(sourceDir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })
  const subdirs = entries.filter(
    (e) =>
      e.isDirectory() &&
      !e.name.startsWith('.') &&
      !RESERVED_DIR_NAMES.has(e.name.toLowerCase())
  )
  const rootImages = resolveSourceFiles(sourceDir)

  const categories = subdirs
    .map((dir) => ({
      slug: slugify(dir.name),
      title: titleize(dir.name),
      sourceDir: path.join(sourceDir, dir.name),
      files: resolveSourceFiles(path.join(sourceDir, dir.name)),
    }))
    .filter((c) => c.files.length > 0)

  if (rootImages.length > 0) {
    categories.push({
      slug: 'portfolio',
      title: 'Portfolio',
      sourceDir,
      files: rootImages,
    })
  }

  return categories
}

async function processImage(srcPath, destPath) {
  const buffer = await sharp(srcPath, { failOn: 'none' })
    .rotate() // apply EXIF orientation, then strip it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  fs.writeFileSync(destPath, buffer)

  const { width, height } = await sharp(buffer).metadata()
  return { width, height }
}

async function main() {
  const sourceDir = process.argv[2] || DEFAULT_SOURCE

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source folder not found: ${sourceDir}`)
    console.error('Pass a path explicitly: node scripts/import-photos.mjs "/path/to/photos"')
    process.exit(1)
  }

  const categories = discoverCategories(sourceDir)
  if (categories.length === 0) {
    console.error(
      `No images found in ${sourceDir} (checked top-level files and one level of subfolders).`
    )
    process.exit(1)
  }

  fs.mkdirSync(PUBLIC_PHOTOS_DIR, { recursive: true })

  let locations = {}
  if (fs.existsSync(LOCATIONS_PATH)) {
    try {
      locations = JSON.parse(fs.readFileSync(LOCATIONS_PATH, 'utf8'))
    } catch (err) {
      console.warn(`Couldn't parse data/locations.json (${err.message}) — starting fresh.`)
    }
  }
  const locationsBefore = Object.keys(locations).length

  const manifest = { categories: [] }
  let totalCopied = 0
  let totalSkipped = 0

  for (const category of categories) {
    const destDir = path.join(PUBLIC_PHOTOS_DIR, category.slug)
    fs.mkdirSync(destDir, { recursive: true })

    const photos = []
    const usedSlugs = new Set()

    for (const file of category.files) {
      const base = slugify(path.parse(file.name).name)
      let slug = base
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${base}-${n++}`
      }
      usedSlugs.add(slug)

      const srcPath = path.join(category.sourceDir, file.sourceFile)
      const destPath = path.join(destDir, `${slug}.jpg`)

      try {
        const { width, height } = await processImage(srcPath, destPath)
        const src = `/photos/${category.slug}/${slug}.jpg`

        if (!(src in locations)) locations[src] = ''
        const location = locations[src]

        photos.push({ src, width, height, ...(location ? { location } : {}) })
        totalCopied++
      } catch (err) {
        console.warn(`Skipped ${file.name}: ${err.message}`)
        totalSkipped++
      }
    }

    if (photos.length > 0) {
      manifest.categories.push({ slug: category.slug, title: category.title, photos })
    }
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')
  fs.writeFileSync(LOCATIONS_PATH, JSON.stringify(locations, null, 2) + '\n')

  const categoryWord = manifest.categories.length === 1 ? 'category' : 'categories'
  console.log(`\nImported ${totalCopied} photo(s) into ${manifest.categories.length} ${categoryWord}.`)
  if (totalSkipped > 0) {
    console.log(
      `Skipped ${totalSkipped} file(s) — HEIC/HEIF often needs converting to JPEG first ` +
        `(Preview: File > Export, or \`sips -s format jpeg in.heic --out out.jpg\`).`
    )
  }
  if (totalCopied > 200) {
    console.log(`That's a lot of photos for one site — consider curating before you deploy.`)
  }
  const newLocations = Object.keys(locations).length - locationsBefore
  if (newLocations > 0) {
    console.log(
      `Added ${newLocations} new entr${newLocations === 1 ? 'y' : 'ies'} to data/locations.json — ` +
        `fill in place names there and re-run this script to apply them.`
    )
  }
  console.log(`Manifest written to data/photos.json. Run "npm run dev" to preview.`)
}

main()
