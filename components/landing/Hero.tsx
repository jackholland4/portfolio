'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'

export default function Hero() {
  const { scrollY } = useScroll()
  const contentOpacity = useTransform(scrollY, [0, 320], [1, 0])
  const contentY = useTransform(scrollY, [0, 320], [0, -56])

  return (
    // Opening page is a deliberate blank-white intro — forced to the light
    // theme regardless of the site's global dark/light setting, so it reads
    // as white no matter what the visitor has toggled.
    <section
      data-theme="light"
      className="relative h-screen overflow-hidden bg-[var(--c-bg-0)]"
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Name */}
        <motion.h1
          className="flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
        >
          <Image
            src="/brand/signature.png"
            alt={siteConfig.name}
            width={2200}
            height={669}
            priority
            className="site-signature w-auto"
            style={{ height: 'clamp(2.5rem, 7vw, 6rem)' }}
          />
        </motion.h1>

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
