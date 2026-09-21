'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

// A simple drag-to-unlock puzzle that gates the contact email behind a
// deliberate human action. This is not real bot protection (a scraper that
// executes JS could still solve it) — it's meant to stop dumb scrapers that
// only read static HTML from harvesting the address.
const TRACK_WIDTH = 256 // px, matches w-64 below
const HANDLE_SIZE = 36 // px, matches w-9 h-9 below
const TRACK_PADDING = 4 // px, matches p-1 below
const MAX_X = TRACK_WIDTH - HANDLE_SIZE - TRACK_PADDING * 2
const UNLOCK_THRESHOLD = 0.9
const KEYBOARD_STEP = 24

type Stage = 'idle' | 'puzzle' | 'solved'

export default function EmailGate({ encodedEmail }: { encodedEmail: string }) {
  const [stage, setStage] = useState<Stage>('idle')
  const x = useMotionValue(0)
  const fillWidth = useTransform(x, (v) => v + HANDLE_SIZE)

  function unlock() {
    animate(x, MAX_X, { type: 'spring', stiffness: 300, damping: 30 })
    setStage('solved')
  }

  function handleDragEnd() {
    if (x.get() / MAX_X >= UNLOCK_THRESHOLD) {
      unlock()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(x.get() + KEYBOARD_STEP, MAX_X)
      animate(x, next, { duration: 0.15 })
      if (next / MAX_X >= UNLOCK_THRESHOLD) setStage('solved')
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      animate(x, Math.max(x.get() - KEYBOARD_STEP, 0), { duration: 0.15 })
    } else if (e.key === 'End' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      unlock()
    } else if (e.key === 'Home') {
      e.preventDefault()
      animate(x, 0, { duration: 0.2 })
    }
  }

  if (stage === 'solved') {
    // Decoded only now, after the puzzle is solved, so the plaintext address
    // never sits in the server-rendered HTML for a scraper to regex out.
    const email = atob(encodedEmail)
    return (
      <motion.a
        href={`mailto:${email}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="font-body text-lg text-[var(--c-accent)] hover:underline"
      >
        {email}
      </motion.a>
    )
  }

  if (stage === 'puzzle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div
          className="relative h-11 w-64 rounded-full bg-[var(--c-bg-2)] border border-[var(--c-border-md)] overflow-hidden select-none"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-[var(--c-accent-glow)]"
            style={{ width: fillWidth }}
          />
          <p className="absolute inset-0 flex items-center justify-center font-body text-[0.65rem] uppercase tracking-[0.15em] text-[var(--c-txt-3)] pointer-events-none">
            Drag to unlock
          </p>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: MAX_X }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onKeyDown={handleKeyDown}
            style={{ x }}
            tabIndex={0}
            role="slider"
            aria-label="Drag to unlock the contact email"
            aria-valuemin={0}
            aria-valuemax={MAX_X}
            aria-valuenow={Math.round(x.get())}
            className="absolute top-1 left-1 w-9 h-9 rounded-full bg-[var(--c-accent)] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_12px_var(--c-accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent-light)]"
          >
            <span className="block w-1.5 h-1.5 border-r-2 border-b-2 border-[var(--c-accent-ink)] rotate-[-45deg] -translate-x-0.5" />
          </motion.div>
        </div>
        <p className="mt-3 font-body text-xs text-[var(--c-txt-3)]">
          Solve the puzzle to reveal the contact email.
        </p>
      </motion.div>
    )
  }

  return (
    <button
      onClick={() => setStage('puzzle')}
      className="font-display font-semibold text-lg text-[var(--c-accent)] hover:text-[var(--c-accent-light)] underline underline-offset-4 decoration-[var(--c-accent-border)] transition-colors"
    >
      Inquire
    </button>
  )
}
