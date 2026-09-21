import Hero from '@/components/landing/Hero'
import GalleryCategories from '@/components/landing/GalleryCategories'
import { getCategories } from '@/lib/photos'

export default function Home() {
  const categories = getCategories()

  return (
    <>
      <Hero />
      <GalleryCategories categories={categories} />
    </>
  )
}
