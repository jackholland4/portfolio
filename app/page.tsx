import Hero from '@/components/landing/Hero'
import GalleryCategories from '@/components/landing/GalleryCategories'
import { getCategories, getFeaturedPhotos } from '@/lib/photos'

export default function Home() {
  const categories = getCategories()
  const featured = getFeaturedPhotos()

  return (
    <>
      <Hero photos={featured} />
      <GalleryCategories categories={categories} />
    </>
  )
}
