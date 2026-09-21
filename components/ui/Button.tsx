import Link from 'next/link'

type ButtonProps = {
  variant?: 'primary' | 'ghost'
  href?: string
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  title?: string
}

export default function Button({
  variant = 'primary',
  href,
  disabled,
  children,
  onClick,
  className = '',
  title,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-3 rounded-lg transition-all duration-200 tracking-tight'

  const styles = {
    primary: disabled
      ? `${base} bg-[var(--c-accent)] text-[var(--c-accent-ink)] opacity-40 cursor-not-allowed`
      : `${base} bg-[var(--c-accent)] text-[var(--c-accent-ink)] hover:bg-[var(--c-accent-light)] hover:shadow-[0_0_20px_var(--c-accent-glow)]`,
    ghost: disabled
      ? `${base} border border-[var(--c-border-md)] text-[var(--c-txt-6)] cursor-not-allowed`
      : `${base} border border-[var(--c-border-md)] text-[var(--c-txt-0)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent-light)]`,
  }

  const cls = `${styles[variant]} ${className}`

  if (href && !disabled) {
    return <Link href={href} className={cls} title={title}>{children}</Link>
  }
  return (
    <button className={cls} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  )
}
