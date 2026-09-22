'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const isLanding = pathname === '/'
  const transparent = isLanding && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset scroll state on route change
  useEffect(() => {
    setScrolled(false)
  }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 md:px-12 lg:px-20"
      style={{
        backgroundColor: transparent ? 'transparent' : 'var(--c-header-bg)',
        backdropFilter: transparent ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: transparent ? 'none' : 'blur(12px)',
        borderBottom: transparent ? 'none' : '1px solid var(--c-header-border)',
        transition: 'background-color 300ms ease, border-color 300ms ease',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="inline-flex flex-col group"
      >
        <Image
          src="/brand/signature.png"
          alt={siteConfig.name}
          width={2200}
          height={669}
          priority
          className="h-7 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-200"
        />
        <span className="block h-0.5 w-0 group-hover:w-full bg-[var(--c-accent)] transition-all duration-300 ease-out" />
      </Link>

      {/* Nav */}
      <nav className="ml-auto flex items-center gap-7">
        {siteConfig.nav.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="relative font-body text-sm transition-colors duration-200 pb-0.5"
              style={{ color: active ? 'var(--c-txt-0)' : 'var(--c-txt-1)' }}
            >
              {label}
              {active && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--c-accent)] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
