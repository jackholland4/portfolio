'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import type { Category } from '@/lib/photos'

export default function GalleryCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-[var(--c-bg-0)] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-[var(--c-accent)] mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Collections
        </motion.p>

        {categories.length === 0 ? (
          <p className="font-body text-sm text-[var(--c-txt-1)] max-w-md">
            No photos yet. Run <code className="text-[var(--c-txt-0)]">npm run import-photos</code> to
            bring in your collection, then refresh.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, i) => {
              const cover = category.photos[0]
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
                >
                  <Link href={`/gallery/${category.slug}`}>
                    <Card className="flex flex-col h-full overflow-hidden group">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                        {cover && (
                          <Image
                            src={cover.src}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      <div className="p-6 flex items-center justify-between">
                        <h2 className="font-display font-bold text-[var(--c-txt-0)] text-lg">
                          {category.title}
                        </h2>
                        <span className="font-body text-xs text-[var(--c-txt-3)]">
                          {category.photos.length} photo{category.photos.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
