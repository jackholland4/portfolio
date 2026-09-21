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

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULT_SOURCE = '/Users/jackholland/Downloads/Personal/Photos/Photo Repository'
const PROJECT_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const PUBLIC_PHOTOS_DIR = path.join(PROJECT_ROOT, 'public', 'photos')
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'data', 'photos.json')

const MAX_DIMENSION = 2400
const JPEG_QUALITY = 85

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.heic', '.heif',
])

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

function discoverCategories(sourceDir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })
  const subdirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  const rootImages = listImageFiles(sourceDir)

  const categories = subdirs
    .map((dir) => ({
      slug: slugify(dir.name),
      title: titleize(dir.name),
      sourceDir: path.join(sourceDir, dir.name),
      files: listImageFiles(path.join(sourceDir, dir.name)),
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

  const manifest = { categories: [] }
  let totalCopied = 0
  let totalSkipped = 0

  for (const category of categories) {
    const destDir = path.join(PUBLIC_PHOTOS_DIR, category.slug)
    fs.mkdirSync(destDir, { recursive: true })

    const photos = []
    const usedSlugs = new Set()

    for (const file of category.files) {
      const base = slugify(path.parse(file).name)
      let slug = base
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${base}-${n++}`
      }
      usedSlugs.add(slug)

      const srcPath = path.join(category.sourceDir, file)
      const destPath = path.join(destDir, `${slug}.jpg`)

      try {
        const { width, height } = await processImage(srcPath, destPath)
        photos.push({ src: `/photos/${category.slug}/${slug}.jpg`, width, height })
        totalCopied++
      } catch (err) {
        console.warn(`Skipped ${file}: ${err.message}`)
        totalSkipped++
      }
    }

    if (photos.length > 0) {
      manifest.categories.push({ slug: category.slug, title: category.title, photos })
    }
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')

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
  console.log(`Manifest written to data/photos.json. Run "npm run dev" to preview.`)
}

main()
