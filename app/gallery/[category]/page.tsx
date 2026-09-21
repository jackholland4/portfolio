import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategories, getCategory } from '@/lib/photos'
import PhotoGrid from '@/components/gallery/PhotoGrid'

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category)
  if (!category) notFound()

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/gallery"
          className="font-body text-xs uppercase tracking-[0.15em] text-[var(--c-txt-3)] hover:text-[var(--c-accent)] transition-colors"
        >
          ← Work
        </Link>
        <h1 className="font-display font-bold text-[var(--c-txt-0)] text-4xl md:text-5xl mt-4 mb-12">
          {category.title}
        </h1>
        <PhotoGrid photos={category.photos} />
      </div>
    </main>
  )
}
