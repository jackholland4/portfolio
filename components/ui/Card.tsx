type CardProps = {
  children: React.ReactNode
  active?: boolean
  className?: string
}

export default function Card({ children, active = true, className = '' }: CardProps) {
  return (
    <div
      className={[
        'bg-[var(--c-bg-1)] border border-[var(--c-border-md)] rounded-2xl',
        'transition-all duration-300 ease-out',
        active
          ? 'hover:-translate-y-1 hover:border-[var(--c-accent-border)] hover:shadow-[0_0_32px_var(--c-accent-glow)]'
          : 'opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
