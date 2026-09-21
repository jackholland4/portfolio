import photosData from '@/data/photos.json'

export interface Photo {
  src: string
  width: number
  height: number
  /** Hand-entered place name, e.g. "San Francisco, CA". See data/locations.json. */
  location?: string
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
