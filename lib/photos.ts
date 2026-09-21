import photosData from '@/data/photos.json'

export interface Photo {
  src: string
  width: number
  height: number
}

export interface Category {
  slug: string
  title: string
  photos: Photo[]
}

const data = photosData as { categories: Category[] }

export function getCategories(): Category[] {
  return data.categories
}

export function getCategory(slug: string): Category | undefined {
  return data.categories.find((c) => c.slug === slug)
}

export function getAllPhotos(): Photo[] {
  return data.categories.flatMap((c) => c.photos)
}

/** Spreads photos across categories so the hero slideshow isn't dominated by one gallery. */
export function getFeaturedPhotos(limit = 24): Photo[] {
  const categories = data.categories
  if (categories.length === 0) return []

  const featured: Photo[] = []
  let round = 0
  while (featured.length < limit) {
    let addedAny = false
    for (const category of categories) {
      const photo = category.photos[round]
      if (photo) {
        featured.push(photo)
        addedAny = true
        if (featured.length >= limit) break
      }
    }
    if (!addedAny) break
    round++
  }
  return featured
}
