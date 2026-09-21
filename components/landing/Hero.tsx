'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import KenBurnsSlideshow, { type Slide } from './KenBurnsSlideshow'
import { siteConfig } from '@/lib/site-config'

export default function Hero({ photos }: { photos: (string | Slide)[] }) {
  const { scrollY } = useScroll()
  const contentOpacity = useTransform(scrollY, [0, 320], [1, 0])
  const contentY = useTransform(scrollY, [0, 320], [0, -56])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Layer 1 — slideshow */}
      <KenBurnsSlideshow images={photos} />

      {/* Layer 2 — gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero)', zIndex: 2 }}
      />

      {/* Layer 3 — content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Name */}
        <h1
          className="font-display font-bold text-[var(--c-txt-0)] leading-none flex flex-wrap justify-center text-center"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
        >
          {siteConfig.name.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.6, ease: 'easeOut' }}
            >
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          className="font-body text-[var(--c-txt-1)] mt-4 tracking-[0.18em] uppercase"
          style={{ fontSize: 'clamp(0.65rem, 1.4vw, 0.9rem)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.9 }}
        >
          {siteConfig.tagline}
        </motion.p>

        {/* Accent rule */}
        <motion.div
          className="h-0.5 bg-[var(--c-accent)] mt-5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ delay: 1.0, duration: 0.4, ease: 'easeOut' }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.0 }}
        >
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[var(--c-accent)] to-transparent origin-top rounded-full"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-2.5 h-2.5 border-r-2 border-b-2 border-[var(--c-accent)] rotate-45 -mt-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
