'use client'

import { motion } from 'framer-motion'

interface AccentRuleProps {
  delay?: number
  centered?: boolean
}

export function AccentRule({ delay = 0.5, centered = false }: AccentRuleProps) {
  return (
    <motion.div
      className={`h-0.5 bg-[var(--c-accent)] mt-4 rounded-full ${centered ? 'mx-auto' : ''}`}
      initial={{ width: 0 }}
      animate={{ width: 60 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    />
  )
}
