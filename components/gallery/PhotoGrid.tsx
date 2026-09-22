'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { Photo } from '@/lib/photos'

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, close, prev, next])

  if (photos.length === 0) {
    return (
      <p className="font-body text-sm text-[var(--c-txt-1)]">
        No photos in this collection yet.
      </p>
    )
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setOpenIndex(i)}
            className="mb-4 block w-full break-inside-avoid group cursor-zoom-in"
          >
            <Image
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              className="w-full h-auto rounded-lg transition-opacity duration-300 group-hover:opacity-90"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close() }}
              className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl"
              aria-label="Close"
            >
              ×
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white text-3xl"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white text-3xl"
              aria-label="Next"
            >
              ›
            </button>
            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[openIndex].src}
                alt=""
                width={photos[openIndex].width}
                height={photos[openIndex].height}
                className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded"
                sizes="90vw"
                priority
              />
              {photos[openIndex].location && (
                <p className="absolute left-1 top-1 font-body text-xs tracking-wide text-white/70">
                  {photos[openIndex].location}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
