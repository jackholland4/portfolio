import { getCategories } from '@/lib/photos'
import GalleryCategories from '@/components/landing/GalleryCategories'

export const metadata = { title: 'Work' }

export default function GalleryIndex() {
  const categories = getCategories()

  return (
    <main className="pt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <h1 className="font-display font-bold text-[var(--c-txt-0)] text-4xl md:text-5xl mb-2">
          Work
        </h1>
        <p className="font-body text-[var(--c-txt-1)] max-w-xl">Selected collections.</p>
      </div>
      <GalleryCategories categories={categories} />
    </main>
  )
}
